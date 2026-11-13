import { addressQuality, compareAddressReference, compareSisbenAddress, compareLocality, identityKey, normalizedStreet, readStudentAddress, sameAddressKey } from './address-audit';
const address={direccion:'CRA 22 # 46B - 12 APTO 101',barrio:'Centro',ciudad:'Bucaramanga',departamento:'Santander'};
describe('Cruce de direcciones',()=>{
  it('no confunde coincidencia de municipio con coincidencia de vivienda',()=>{
    expect(compareSisbenAddress(address,{...address,direccion:''},true).estado).toBe('Sisbén no informa dirección');
    expect(compareSisbenAddress(address,undefined,false).estado).toBe('Pendiente de consulta');
    expect(compareSisbenAddress(address,{...address,direccion:'CARRERA 30 # 50-60'},true).estado).toBe('Dirección diferente');
    expect(compareSisbenAddress(address,{...address,direccion:'CARRERA 22 46B 12 APARTAMENTO 101'},true).estado).toBe('Direcciones coinciden');
    expect(compareSisbenAddress(address,{...address,barrio:''},true).estado).toBe('Coincidencia parcial');
  });
  it('lee encabezados con tildes y conserva el texto de origen',()=>{
    expect(readStudentAddress({'Dirección':'  Calle 10 # 12-51  ',Barrio:'San Antonio',Municipio:'Piedecuesta',Departamento:'Santander'}).direccion).toBe('Calle 10 # 12-51');
  });
  it('normaliza abreviaturas sin juntar números ni viviendas distintas',()=>{
    expect(normalizedStreet(address.direccion)).toBe(normalizedStreet('Carrera 22 46B 12 Apartamento 101'));
    expect(normalizedStreet('CL 10 # 12-34')).not.toBe(normalizedStreet('CL 10 # 1234'));
    expect(sameAddressKey(address)).not.toBe(sameAddressKey({...address,direccion:'CRA 22 # 46B - 12 APTO 102'}));
    expect(sameAddressKey(address)).not.toBe(sameAddressKey({...address,ciudad:'Floridablanca'}));
  });
  it('no llama completos a los vacíos, puntos o municipio usado como dirección',()=>{
    expect(addressQuality({...address,barrio:'.'}).estado).toBe('Por completar / revisar');
    expect(addressQuality({...address,direccion:'NO REGISTRA'}).estado).toBe('Sin dirección');
    expect(addressQuality({...address,direccion:'Bucaramanga'}).estado).toBe('Por completar / revisar');
    expect(addressQuality({...address,direccion:'VEREDA EL ROSAL FINCA LA ESPERANZA'}).estado).toBe('Datos completos');
  });
  it('distingue coincidencia geográfica, discrepancia y datos insuficientes',()=>{
    expect(compareLocality(address,'68001 - BUCARAMANGA','SANTANDER',true).estado).toBe('Municipio y departamento coinciden');
    expect(compareLocality(address,'PIEDECUESTA','SANTANDER',true).estado).toBe('Ubicación diferente');
    expect(compareLocality(address,'BUCARAMANGA','',true).estado).toBe('Cruce incompleto');
    expect(compareLocality(address,'BUCARAMANGA','SANTANDER',false).estado).toBe('Pendiente de consulta');
  });
  it('cruza por tipo y documento y no escoge una referencia conflictiva',()=>{
    expect(identityKey('CC','1.234')).toBe(identityKey('Cédula de ciudadanía','1234'));
    expect(identityKey('TI','1234')).not.toBe(identityKey('CC','1234'));
    const ref={tipoDocumento:'CC',documento:'1234',address};
    expect(compareAddressReference(address,[ref]).estado).toBe('Coincidencia normalizada');
    expect(compareAddressReference(address,[ref,{...ref,address:{...address,ciudad:'Cali'}}]).estado).toBe('Referencia ambigua');
    expect(compareAddressReference(address,[{...ref,address:{...address,barrio:''}}]).estado).toBe('Cruce incompleto');
  });
});
