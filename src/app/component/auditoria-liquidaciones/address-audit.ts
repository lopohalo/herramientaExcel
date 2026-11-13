export interface StudentAddress { direccion: string; barrio: string; ciudad: string; departamento: string; }
export interface AddressReference { tipoDocumento: string; documento: string; address: StudentAddress; }
export interface AddressCheck { estado: string; notas: string[]; }
export function normalizeAddressText(value: unknown): string {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim().replace(/\s+/g, ' ');
}
export function missingAddressValue(value: unknown): boolean {
  return ['', '0', 'NA', 'NOREGISTRA', 'SINDATO', 'SININFORMACION', 'NOAPLICA'].includes(normalizeAddressText(value).replace(/[^A-Z0-9]/g, ''));
}
export function normalizedStreet(value: string): string {
  if (missingAddressValue(value)) return '';
  const words = normalizeAddressText(value).replace(/([A-Z])(\d)/g, '$1 $2').replace(/[.,#\-\/]/g, ' ').replace(/\s+/g, ' ').trim().split(' ');
  const aliases: Record<string,string> = { CRA:'CARRERA', CR:'CARRERA', KR:'CARRERA', KRA:'CARRERA', CL:'CALLE', CLL:'CALLE', AV:'AVENIDA', DG:'DIAGONAL', TV:'TRANSVERSAL', TRV:'TRANSVERSAL', APTO:'APARTAMENTO', APT:'APARTAMENTO' };
  return words.map(word => aliases[word] || word).join(' ');
}
function locality(value: string): string {
  if (missingAddressValue(value)) return '';
  return normalizeAddressText(value).replace(/^\d{2,5}\s*[-:]\s*/, '').replace(/[^A-Z0-9]/g, '');
}
export function addressField(row: Record<string, unknown>, names: string[]): string {
  const normal = (v:string) => normalizeAddressText(v).replace(/[^A-Z0-9]/g,'');
  const key = Object.keys(row).find(key => names.some(name => normal(key) === normal(name)));
  return key ? String(row[key] ?? '').trim() : '';
}
export function readStudentAddress(row: Record<string, unknown>): StudentAddress {
  return { direccion: addressField(row,['Direccion','Dirección de residencia','Domicilio']), barrio: addressField(row,['Barrio','Vereda']), ciudad: addressField(row,['Ciudad','Municipio','Municipio de residencia']), departamento: addressField(row,['Departamento','Departamento de residencia']) };
}
export function identityKey(type: string, document: string): string {
  const aliases: Record<string,string> = { CEDULADECIUDADANIA:'CC', TARJETADEIDENTIDAD:'TI', CEDULADEEXTRANJERIA:'CE', REGISTROCIVIL:'RC', PERMISOPORPROTECCIONTEMPORAL:'PPT' };
  const normalized = normalizeAddressText(type).replace(/[^A-Z]/g,'');
  const kind = aliases[normalized] || normalized;
  const number = String(document).replace(/\D/g,'');
  return kind && number ? `${kind}:${number}` : '';
}
export function addressQuality(address: StudentAddress): AddressCheck {
  const absent = Object.entries(address).filter(([,value])=>missingAddressValue(value)).map(([key])=>key);
  const notes = absent.length ? ['Faltan datos de ubicación: ' + absent.join(', ') + '.'] : [];
  const street = normalizedStreet(address.direccion);
  if (street && (locality(address.direccion) === locality(address.ciudad) || !/\d/.test(street) && !/\b(VEREDA|FINCA|CORREGIMIENTO|KM|KILOMETRO)\b/.test(street))) notes.push('La dirección no permite identificar claramente una vía o ubicación rural; revisar con el estudiante.');
  return { estado: !street ? 'Sin dirección' : notes.length ? 'Por completar / revisar' : 'Datos completos', notas: notes };
}
export function compareLocality(address: StudentAddress, city: string, department: string, valid: boolean): AddressCheck {
  if (!valid) return {estado:'Pendiente de consulta',notas:[]};
  const pairs: [string,string,string][] = [['municipio',address.ciudad,city],['departamento',address.departamento,department]];
  const different = pairs.filter(([,a,b])=>locality(a)&&locality(b)&&locality(a)!==locality(b));
  if (different.length) return {estado:'Ubicación diferente',notas:different.map(([label,a,b])=>`${label}: Excel ${a} / consulta ${b}. Verificar vigencia del domicilio.`)};
  if (pairs.some(([,a,b])=>!locality(a)||!locality(b))) return {estado:'Cruce incompleto',notas:['Falta municipio o departamento en alguna fuente. No se confirma coincidencia completa.']};
  return {estado:'Municipio y departamento coinciden',notas:['Coincidencia geográfica; no valida calle, vivienda, estrato ni pertenencia al mismo hogar.']};
}
export function sameAddressKey(address: StudentAddress): string {
  const street=normalizedStreet(address.direccion),city=locality(address.ciudad),dept=locality(address.departamento);
  return street && city && dept && addressQuality(address).estado === 'Datos completos' ? `${dept}|${city}|${street}` : '';
}
export function compareAddressReference(address: StudentAddress, candidates: AddressReference[]): AddressCheck {
  if (!candidates.length) return {estado:'Sin referencia',notas:[]};
  const distinct = new Set(candidates.map(c=>[normalizedStreet(c.address.direccion),locality(c.address.ciudad),locality(c.address.departamento),locality(c.address.barrio)].join('|')));
  if (distinct.size>1) return {estado:'Referencia ambigua',notas:['La base tiene varias ubicaciones para el mismo tipo y número de documento; no se escogió una automáticamente.']};
  const other=candidates[0].address;
  const fields: (keyof StudentAddress)[]=['direccion','barrio','ciudad','departamento'];
  const normalize=(key:keyof StudentAddress,value:string)=>key==='direccion'?normalizedStreet(value):locality(value);
  const missing=fields.filter(key=>!normalize(key,address[key])||!normalize(key,other[key]));
  const different=fields.filter(key=>normalize(key,address[key])&&normalize(key,other[key])&&normalize(key,address[key])!==normalize(key,other[key]));
  const notas=different.map(key=>`${key}: reporte ${address[key]} / base ${other[key]}.`);
  if(missing.length)notas.push('Campos no comparables por datos faltantes: '+missing.join(', ')+'.');
  return {estado:different.length?'Diferencia con base':missing.length?'Cruce incompleto':'Coincidencia normalizada',notas};
}

export function compareSisbenAddress(reported: StudentAddress, official: StudentAddress | undefined, consulted: boolean): AddressCheck {
  if(!consulted)return {estado:'Pendiente de consulta',notas:[]};
  if(!official || missingAddressValue(official.direccion))return {estado:'Sisbén no informa dirección',notas:['La respuesta no contiene una dirección de vivienda comparable. Municipio y departamento solo permiten un cruce geográfico parcial.']};
  if(missingAddressValue(reported.direccion))return {estado:'Estudiante sin dirección',notas:['Sisbén tiene una dirección, pero falta la reportada por el estudiante.']};
  const result=compareAddressReference(reported,[{tipoDocumento:'',documento:'',address:official}]);
  return {estado:result.estado==='Diferencia con base'?'Dirección diferente':result.estado==='Coincidencia normalizada'?'Direcciones coinciden':'Coincidencia parcial',notas:result.notas};
}
