import { interpretarImportePegado } from './modall/importe-pegado';

export interface SaldoCiclo { rubro: string; corriente: number; }
export interface RevisionSaldoCiclo extends SaldoCiclo {
  codigo: string;
  nombre: string;
  saldo: number;
  noCorriente: number;
  motivo: string;
}
const encabezado = (valor: any): string => String(valor ?? '').normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();

export function leerSaldosCiclo(hojas: any[][][]): SaldoCiclo[] {
  const registros = new Map<string, SaldoCiclo>();
  let detectada = false;
  hojas.forEach(filas => {
    const indice = filas.findIndex(fila => fila.some(c => encabezado(c) === 'rubro') &&
      fila.some(c => encabezado(c) === 'sc ano vigente'));
    if (indice < 0) return;
    detectada = true;
    const columnaRubro = filas[indice].findIndex(c => encabezado(c) === 'rubro');
    const columnaVigente = filas[indice].findIndex(c => encabezado(c) === 'sc ano vigente');
    filas.slice(indice + 1).forEach((fila, n) => {
      const rubro = String(fila[columnaRubro] ?? '').trim().replace(/\./g, '');
      if (!rubro || /^total/i.test(rubro)) return;
      if (!/^\d{8}$/.test(rubro)) throw new Error(`Rubro inválido en la fila ${indice + n + 2}: ${rubro}.`);
      const bruto = fila[columnaVigente];
      const corriente = typeof bruto === 'number' ? bruto : interpretarImportePegado(String(bruto ?? ''));
      if (corriente === null || !Number.isFinite(corriente)) throw new Error(`SC Año Vigente inválido para ${rubro}.`);
      if (registros.has(rubro)) throw new Error(`El rubro ${rubro} está repetido. Revisa el archivo antes de aplicarlo.`);
      registros.set(rubro, { rubro, corriente });
    });
  });
  if (!detectada) throw new Error('El archivo debe incluir las columnas Rubro y SC Año Vigente.');
  if (!registros.size) throw new Error('No se encontraron rubros con valores para aplicar.');
  return Array.from(registros.values());
}

export function revisarSaldosCiclo(registros: SaldoCiclo[], fuente: any[]): RevisionSaldoCiclo[] {
  const porRubro = new Map(fuente.map(fila => [String(fila.codigo || '').replace(/\./g, '').trim(), fila]));
  return registros.map(registro => {
    const cuenta = porRubro.get(registro.rubro);
    const codigo = cuenta?.codigo || [registro.rubro[0], registro.rubro[1], ...registro.rubro.slice(2).match(/.{2}/g)!].join('.');
    const tieneHijos = cuenta && fuente.some(fila => String(fila.codigo || '').startsWith(`${codigo}.`));
    const motivo = !cuenta ? 'No existe en el balance cargado' :
      !/^[12]/.test(registro.rubro) ? 'Solo se distribuyen activos y pasivos' :
      tieneHijos ? 'Es una cuenta padre; requiere rubros de detalle' : '';
    const saldo = Number(cuenta?.nuevoSaldo || 0);
    return { ...registro, codigo, nombre: cuenta?.nombre || '', saldo,
      noCorriente: saldo - registro.corriente, motivo };
  });
}
