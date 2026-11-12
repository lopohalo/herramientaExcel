import * as XLSX from 'xlsx';
import { limpiarFilasBalance, leerBalanceOficialTxt } from './importar-balance';
import { prepararDetalleHistorico, agruparDetalleHistorico } from './balance-historico';
import { crearLectorBalance } from './fuente-balance';

export interface CargaCuentasOrden {
  cuentas: any[];
  cantidad: number;
  archivo: string;
  periodo?: { mes: number; anio: number };
}
const redondear = (n: number) => Math.round((n + Math.sign(n) * Number.EPSILON) * 100) / 100;
const nombres: Record<string, string> = {
  '8': 'CUENTAS DE ORDEN DEUDORAS', '8.1': 'ACTIVOS CONTINGENTES', '8.2': 'DEUDORAS FISCALES',
  '8.3': 'DEUDORAS DE CONTROL', '8.9': 'DEUDORAS POR CONTRA (CR)',
  '9': 'CUENTAS DE ORDEN ACREEDORAS', '9.1': 'PASIVOS CONTINGENTES', '9.2': 'ACREEDORAS FISCALES',
  '9.3': 'ACREEDORAS DE CONTROL', '9.9': 'ACREEDORAS POR CONTRA (DB)',
};

/** Lee el libro auxiliar sin tomar los totales impresos como movimientos adicionales. */
export async function leerArchivoCuentasOrden(archivo: File): Promise<CargaCuentasOrden> {
  if (!/\.(txt|xlsx?)$/i.test(archivo.name)) throw new Error('Selecciona cuentas de orden en TXT o Excel.');
  const bytes = await archivo.arrayBuffer();
  let filas: any[] = [], texto = '';
  if (/\.txt$/i.test(archivo.name)) {
    try { texto = new TextDecoder('utf-8', { fatal: true }).decode(bytes); }
    catch (_error) { texto = new TextDecoder('windows-1252').decode(bytes); }
    filas = leerBalanceOficialTxt(texto);
  } else {
    const libro = XLSX.read(bytes, { type: 'array' });
    for (const hoja of libro.SheetNames) {
      const candidatas = limpiarFilasBalance(XLSX.utils.sheet_to_json(libro.Sheets[hoja]));
      if (candidatas.length) { filas = candidatas; break; }
    }
  }
  if (!filas.length) throw new Error('No se encontraron cuentas de detalle en el archivo.');
  if (filas.some(f => !/^[89]\d{7}\s/.test(f.nombre))) {
    throw new Error('Este cargador admite únicamente las clases 8 y 9. La clase 7 corresponde a costos.');
  }
  const detalle = prepararDetalleHistorico(filas, []);
  detalle.forEach(c => {
    const esperado = redondear(c.saldoAnterior + (c.codigo.startsWith('8') ? 1 : -1) * (c.debito - c.credito));
    if (Math.abs(esperado - c.nuevoSaldo) > 0.005) throw new Error(`${c.codigo}: saldo anterior y movimientos no coinciden con el saldo final.`);
    // No tienen vencimiento corriente/no corriente.
    c.corriente = false; c.noCorriente = false;
    c.tipoDeCuenta = 0; c.compartidoTipo = 0;
    c.clasificacionPendiente = false;
  });
  const meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
  const encabezado = texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()
    .match(/CUENTAS DE ORDEN A\s+([A-Z]+)\s+\d{1,2}\s+DE\s+(20\d{2})/);
  const periodo = encabezado && meses.includes(encabezado[1])
    ? { mes: meses.indexOf(encabezado[1]) + 1, anio: Number(encabezado[2]) } : undefined;
  const catalogo = Object.entries(nombres).map(([codigo, nombre]) => ({ codigo, nombre }));
  // Recuperar también los nombres de los encabezados 00, sin importar sus saldos.
  texto.split(/\r?\n/).forEach(linea => {
    const m = linea.match(/^\s*\|\s*([89]\d{7})\s+([^|]+)/);
    if (!m) return;
    let raw = m[1].replace(/(?:00)+$/, '');
    if (/^[89]0$/.test(raw)) raw = raw[0];
    const codigo = raw.length <= 2 ? raw.split('').join('.') : [raw[0], raw[1], ...raw.slice(2).match(/.{2}/g)!].join('.');
    catalogo.push({ codigo, nombre: m[2].trim() });
  });
  const cuentas = agruparDetalleHistorico(detalle, catalogo).map(c => ({
    ...c, tipoDeCuenta: 0, compartidoTipo: 0, archivoOrden: archivo.name, periodoOrden: periodo,
  }));
  return { cuentas, cantidad: detalle.length, archivo: archivo.name, periodo };
}

/** Reemplaza las clases 8/9 completas: repetir la carga no duplica ni acumula saldos. */
export function integrarCuentasOrden(fuente: any[], orden: any[]): any[] {
  return [...fuente.filter(c => !/^[89](?:\.|$)/.test(String(c.codigo).trim())), ...orden.map(c => ({ ...c }))];
}

/** El catálogo trae filas vacías 8/9: su presencia no acredita una carga real. */
export function hayCuentasOrden(fuente: any[], clase: string): boolean {
  return fuente.some(c => String(c.codigo).trim().startsWith(clase) &&
    (c.archivoOrden || c.cuentaOrdenCargada === true ||
      ['saldoAnterior', 'debito', 'credito', 'nuevoSaldo'].some(campo => Number(c[campo]) !== 0 && Number.isFinite(Number(c[campo])))));
}

/** Importes revelados, contrapartidas con signo y controles netos; nunca se suman al activo. */
export function resumenCuentasOrden(fuente: any[]): any[] {
  const leer = crearLectorBalance(fuente);
  return ['8', '9'].flatMap(clase => {
    const cargada = hayCuentasOrden(fuente, clase);
    const contra = `${clase}.9`;
    const neto = leer(clase, 'nuevoSaldo');
    const contrapartida = leer(contra, 'nuevoSaldo');
    const revelado = redondear(neto - contrapartida);
    const fila = (codigo: string, nombre: string, nuevoSaldo: number) => ({
      codigo, nombre, nuevoSaldo, tipoDeCuenta: 0, compartidoTipo: 0, seccion: 'Cuentas de orden', sinArchivoOrden: !cargada,
    });
    return [fila(clase, `${nombres[clase]} (SIN CONTRAPARTIDA)`, revelado),
      fila(contra, nombres[contra], contrapartida), fila(`NETO-${clase}`, `SALDO NETO CLASE ${clase} (CONTROL)`, neto)];
  });
}
