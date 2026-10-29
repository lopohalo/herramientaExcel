import * as XLSX from 'xlsx-js-style';
import { crearLectorBalance } from './fuente-balance';
import { estilosInstitucionales, plantillasInstitucionales } from './formato-institucional';

const formatoImporte = '#,##0;[Red](#,##0);"-"';
const redondear = (n: number): number => Math.round((n + Math.sign(n) * Number.EPSILON) * 100) / 100;
function celda(hoja: any, fila: number, columna: number, valor: any): void {
  const ref = XLSX.utils.encode_cell({ r: fila - 1, c: columna });
  hoja[ref] = { ...(hoja[ref] || {}), v: valor, t: typeof valor === 'number' ? 'n' : 's' };
  delete hoja[ref].f;
  if (typeof valor === 'number' && columna === 3) hoja[ref].z = formatoImporte;
}
function base(indice: number, anio: number): any {
  const modelo = plantillasInstitucionales[indice];
  const hoja: any = { '!ref': `A1:D${modelo.lastRow}`, '!cols': [{ wch: 3 }, { wch: 86 }, { wch: 10 }, { wch: 26 }], '!rows': [], '!merges': [] };
  modelo.cells.forEach(([fila, col, valor, estilo]: any[]) => {
    const ref = XLSX.utils.encode_cell({ r: fila - 1, c: col });
    hoja[ref] = { v: valor ?? '', t: typeof valor === 'number' ? 'n' : 's', s: JSON.parse(JSON.stringify(estilosInstitucionales[estilo])) };
    if (col === 3 && typeof valor === 'number') hoja[ref].z = formatoImporte;
  });
  Object.entries(modelo.heights).forEach(([fila, altura]) => hoja['!rows'][Number(fila) - 1] = { hpt: altura });
  const inicio = indice === 0 ? 3 : 4;
  const titulo = indice === 0 ? 'ESTADO DE SITUACIÓN FINANCIERA' : 'ESTADO DE RESULTADOS';
  ['UNIVERSIDAD INDUSTRIAL DE SANTANDER', titulo, `VIGENCIA ${anio}`, 'Cifras en pesos Colombianos sin decimales'].forEach((texto, i) => {
    celda(hoja, inicio + i, 1, texto);
    hoja[XLSX.utils.encode_cell({ r: inicio + i - 1, c: 1 })].s = {
      font: { name: 'Arial', sz: i === 0 ? 12 : 11, bold: true }, alignment: { horizontal: 'center', vertical: 'center' },
    };
    hoja['!merges'].push({ s: { r: inicio + i - 1, c: 1 }, e: { r: inicio + i - 1, c: 3 } });
    hoja['!rows'][inicio + i - 1] = { hpt: 21 };
  });
  for (const fila of indice === 0 ? [10] : [9, 62]) {
    celda(hoja, fila, 2, 'NOTAS'); celda(hoja, fila, 3, anio);
    hoja[`D${fila}`].z = '0';
  }
  // Las firmas del modelo ocupan todo el ancho y no invaden columnas comparativas.
  for (const fila of indice === 0 ? [80, 81] : [172, 173]) {
    hoja['!merges'].push({ s: { r: fila - 1, c: 1 }, e: { r: fila - 1, c: 3 } });
    hoja[`B${fila}`].s = { font: { name: 'Arial', sz: 9 }, alignment: { wrapText: true, horizontal: 'center', vertical: 'center' } };
    hoja['!rows'][fila - 1] = { hpt: 34 };
  }
  return hoja;
}
function insertar(hoja: any, antes: number, filas: Array<[string, number]>): void {
  if (!filas.length) return;
  const cantidad = filas.length;
  Object.keys(hoja).filter(k => !k.startsWith('!')).map(ref => ({ ref, pos: XLSX.utils.decode_cell(ref) }))
    .filter(({ pos }) => pos.r >= antes - 1).sort((a, b) => b.pos.r - a.pos.r).forEach(({ ref, pos }) => {
      hoja[XLSX.utils.encode_cell({ r: pos.r + cantidad, c: pos.c })] = hoja[ref]; delete hoja[ref];
    });
  hoja['!rows'].splice(antes - 1, 0, ...filas.map(() => ({ hpt: 22 })));
  hoja['!merges'].forEach((m: any) => { if (m.s.r >= antes - 1) { m.s.r += cantidad; m.e.r += cantidad; } });
  filas.forEach(([nombre, valor], i) => {
    celda(hoja, antes + i, 1, nombre); celda(hoja, antes + i, 3, valor);
    hoja[`B${antes + i}`].s = { font: { name: 'Arial', sz: 10 }, alignment: { wrapText: true, vertical: 'center' } };
    hoja[`D${antes + i}`].s = { font: { name: 'Arial', sz: 10 }, alignment: { horizontal: 'right' } };
  });
  const rango = XLSX.utils.decode_range(hoja['!ref']); rango.e.r += cantidad; hoja['!ref'] = XLSX.utils.encode_range(rango);
}

export function crearEstadosInstitucionales(fuente: any[], situacion: any[], resultados: any[], anio: number): any[] {
  const leer = crearLectorBalance(fuente);
  const saldo = (codigo: string): number => leer(codigo, 'nuevoSaldo');
  const cuentas = fuente.filter(cuenta => /^\d/.test(cuenta.codigo) && !fuente.some(otra => String(otra.codigo).startsWith(`${cuenta.codigo}.`)));
  const importe = (cuenta: any): number => Number(cuenta.nuevoSaldo) || 0;
  const sumaDetalle = (prefijos: string[], salud?: boolean, patron?: RegExp): number => redondear(cuentas.filter(cuenta => {
    const codigo = String(cuenta.codigo).replace(/\./g, '');
    const nombre = String(cuenta.nombre || '').toUpperCase();
    return prefijos.some(p => codigo.startsWith(p)) && (salud === undefined || /UISALUD/.test(nombre) === salud) && (!patron || patron.test(nombre));
  }).reduce((total, cuenta) => total + importe(cuenta), 0));
  const valor = (codigo: string, seccion?: string): number => Number(situacion.find(fila => fila.codigo === codigo && (!seccion || fila.seccion === seccion))?.nuevoSaldo || 0);
  const resultado = (codigo: string): number => Number(resultados.find(fila => fila.codigo === codigo)?.valor || 0);
  const hoja1 = base(0, anio), hoja2 = base(1, anio);
  const ac = (codigo: string) => valor(codigo, 'Activo corriente');
  const anc = (codigo: string) => valor(codigo, 'Activo no corriente');
  const pc = (codigo: string) => valor(codigo, 'Pasivo corriente');
  const pnc = (codigo: string) => valor(codigo, 'Pasivo no corriente');
  const sinContraprestacion = cuentas.filter(c => /^(131|138)/.test(c.codigo.replace(/\./g, ''))).reduce((n, c) => n + (Number(c.tipoDeCuenta) || 0), 0);
  const transicion = saldo('3.1.09.01.02') + saldo('3.1.09.01.92');
  const valores1: { [fila: number]: number } = {
    16: ac('1.1'), 17: ac('1.2'), 18: redondear(sinContraprestacion), 19: redondear(ac('1.3') - sinContraprestacion),
    20: ac('1.5'), 21: ac('1.9'), 22: valor('TOTAL-AC'), 26: anc('1.2'), 27: anc('1.6'), 28: anc('1.7'),
    29: anc('1.9.51'), 30: anc('1.9.70'), 31: anc('1.9'), 32: valor('TOTAL-ANC'), 33: valor('TOTAL-A'),
    39: pc('2.4'), 40: pc('2.5.11'), 41: pc('2.5.12'), 42: pc('2.7'), 43: pc('2.9'), 44: valor('TOTAL-PC'),
    48: pnc('2.5.14'), 49: pnc('2.5.12'), 50: pnc('2.7'), 51: valor('TOTAL-PNC'), 52: valor('TOTAL-P'),
    56: valor('3.1.05'), 57: redondear(valor('3.1.09') - transicion), 58: valor('3.1.10'),
    59: redondear(valor('3.1.45') + transicion), 60: valor('3.1.51'), 61: valor('TOTAL-PAT'), 63: valor('TOTAL-PP'),
    66: valor('8'), 67: valor('9'), 68: redondear(valor('8') + valor('9')),
  };
  Object.entries(valores1).forEach(([fila, v]) => celda(hoja1, Number(fila), 3, v));
  celda(hoja1, 63, 1, 'Total Pasivo + Patrimonio + Resultado del periodo');
  const extras = (seccion: string, incluidos: string[]): Array<[string, number]> => situacion
    .filter(f => f.seccion === seccion && !f.esTotal && !incluidos.includes(f.codigo) && f.nuevoSaldo !== 0)
    .map(f => [f.nombre, f.nuevoSaldo]);
  // Insertar desde abajo conserva las posiciones de las filas superiores del modelo.
  insertar(hoja1, 63, [['Resultado del periodo', valor('RESULTADO-PENDIENTE')], ['Patrimonio + Resultado del periodo', valor('TOTAL-PAT-R')]]);
  insertar(hoja1, 61, extras('Patrimonio', ['3.1.05', '3.1.09', '3.1.10', '3.1.45', '3.1.51']));
  insertar(hoja1, 51, extras('Pasivo no corriente', ['2.5.14', '2.5.12', '2.7']));
  insertar(hoja1, 44, extras('Pasivo corriente', ['2.4', '2.5.11', '2.5.12', '2.7', '2.9']));
  insertar(hoja1, 32, extras('Activo no corriente', ['1.2', '1.6', '1.7', '1.9.51', '1.9.70', '1.9']));
  insertar(hoja1, 22, extras('Activo corriente', ['1.1', '1.2', '1.3', '1.5', '1.9']));

  const codigo = (raw: string): string => [raw[0], raw[1], ...(raw.slice(2).match(/.{1,2}/g) || [])].join('.');
  const valores2: { [fila: number]: number } = {};
  const asignar = (fila: number, v: number) => valores2[fila] = redondear(v);
  const sumarFilas = (desde: number, hasta: number) => redondear(Object.entries(valores2).filter(([fila]) => Number(fila) >= desde && Number(fila) <= hasta).reduce((s, [, v]) => s + v, 0));
  const directos: { [fila: number]: string } = { 14: '42106091', 20: '430514', 21: '430515', 22: '430527', 23: '430550', 24: '4390', 29: '431105', 30: '431190', 31: '4312', 32: '439512', 39: '442802', 40: '442803', 41: '442805', 42: '442807', 43: '442830', 44: '442890', 45: '47', 51: '4802', 52: '4808', 53: '4830', 54: '4831', 105: '542390', 118: '6205', 119: '6210' };
  Object.entries(directos).forEach(([fila, raw]) => asignar(Number(fila), saldo(codigo(raw))));
  asignar(15, saldo('4.2')); asignar(25, saldo('4.3.95') - valores2[32]); asignar(26, sumarFilas(20, 25));
  asignar(33, sumarFilas(29, 32)); asignar(35, saldo('4.3')); asignar(46, saldo('4.4') + saldo('4.7'));
  asignar(55, saldo('4.8')); asignar(57, saldo('4.8')); asignar(59, resultado('TOTAL-I'));
  const gastos51Salud = sumaDetalle(['51'], true), gastos58Salud = sumaDetalle(['58'], true);
  ['5101','5102','5103','5104','5107','5108','5111','5120'].forEach((raw, i) => {
    const salud = sumaDetalle([raw], true); asignar(69 + i, saldo(codigo(raw)) - salud); asignar(82 + i, salud);
  });
  asignar(77, saldo('5.1') - gastos51Salud); asignar(90, 0); asignar(91, 0); asignar(92, gastos58Salud); asignar(93, gastos51Salud + gastos58Salud);
  const deterioroSalud = sumaDetalle(['5347'], true), depreciacionSalud = sumaDetalle(['5330','5360','5362'], true);
  const amortizacionSalud = sumaDetalle(['5366'], true), provisionSalud = sumaDetalle(['5368'], true);
  const total53Salud = deterioroSalud + depreciacionSalud + amortizacionSalud + provisionSalud;
  asignar(97, saldo('5.3.47') - deterioroSalud);
  asignar(98, saldo('5.3.30') + saldo('5.3.60') + saldo('5.3.62') - depreciacionSalud);
  asignar(99, saldo('5.3.66') - amortizacionSalud); asignar(100, saldo('5.3.68') - provisionSalud); asignar(101, saldo('5.3') - total53Salud);
  asignar(106, saldo('5.4'));
  ['5802','5803','5804','5890'].forEach((raw, i) => asignar(110 + i, saldo(codigo(raw)) - sumaDetalle([raw], true)));
  asignar(114, saldo('5.8') - gastos58Salud); asignar(120, saldo('6.2'));
  const dep72 = sumaDetalle(['72'], undefined, /DEPRECI/), amo72 = sumaDetalle(['72'], undefined, /AMORTIZA/);
  const det72 = sumaDetalle(['72'], undefined, /DETERIOR/), pro72 = sumaDetalle(['72'], undefined, /LITIG|DEMANDA/);
  asignar(127, saldo('7.2.09') - sumaDetalle(['7209'], undefined, /DEPRECI|AMORTIZA|DETERIOR|LITIG|DEMANDA/));
  asignar(126, saldo('7.2') - valores2[127] - dep72 - amo72 - det72 - pro72); asignar(128, valores2[126] + valores2[127]);
  asignar(132, det72); asignar(133, dep72); asignar(134, amo72); asignar(135, pro72); asignar(136, det72 + dep72 + amo72 + pro72); asignar(138, saldo('7.2'));
  const patrones = [/DETERIOR/, /DEPRECI/, /AMORTIZA/, /LITIG|DEMANDA/];
  const ajustes73 = patrones.map(p => sumaDetalle(['73'], undefined, p));
  [deterioroSalud, depreciacionSalud, amortizacionSalud, provisionSalud].forEach((v, i) => asignar(146 + i, v + ajustes73[i]));
  asignar(150, sumarFilas(146, 149));
  [['7301'], ['7310','7311','7312','7313','7314'], ['7320','7324'], ['7340','7341','7342','7343'], ['7349','7352','7356'], ['7384','7387']].forEach((prefijos, i) =>
    asignar(153 + i, sumaDetalle(prefijos) - sumaDetalle(prefijos, undefined, /DETERIOR|DEPRECI|AMORTIZA|LITIG|DEMANDA/)));
  asignar(159, saldo('7.3') - ajustes73.reduce((s, v) => s + v, 0)); asignar(161, saldo('7.3') + total53Salud);
  asignar(163, resultado('TOTAL-CG')); asignar(165, resultado('RESULTADO'));
  Object.entries(valores2).forEach(([fila, v]) => celda(hoja2, Number(fila), 3, v));
  const otros = (fila: number, total: number, desglosado: number) => {
    const diferencia = redondear(total - desglosado);
    if (diferencia) insertar(hoja2, fila, [['Otros conceptos del grupo no desglosados en el modelo', diferencia]]);
  };
  otros(163, resultado('TOTAL-CG'), valores2[77] + valores2[93] + valores2[101] + valores2[106] + valores2[114] + valores2[120] + valores2[138] + valores2[161]);
  otros(159, valores2[159], sumarFilas(153, 158));
  otros(120, valores2[120], valores2[118] + valores2[119]); otros(114, valores2[114], sumarFilas(110, 113));
  otros(106, valores2[106], valores2[105]); otros(101, valores2[101], sumarFilas(97, 100));
  otros(93, valores2[93], sumarFilas(82, 92)); otros(77, valores2[77], sumarFilas(69, 76));
  otros(59, valores2[59], valores2[15] + valores2[35] + valores2[46] + valores2[57]);
  otros(55, valores2[55], sumarFilas(51, 54)); otros(46, valores2[46], sumarFilas(39, 45));
  otros(35, valores2[35], valores2[26] + valores2[33]); otros(15, valores2[15], valores2[14]);
  return [hoja1, hoja2];
}
