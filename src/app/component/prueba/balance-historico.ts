import { FilaBalanceImportada } from './importar-balance';
const redondear = (n: number) => Math.round((n + Math.sign(n) * Number.EPSILON) * 100) / 100;
/** Procesa el archivo histórico sin usar localStorage ni modificar el balance actual. */
export function prepararDetalleHistorico(filas: FilaBalanceImportada[], modelo: any[]): any[] {
  const usados = new Set<string>();
  const importe = (valor: any, clase: string): number => {
    const texto = String(valor ?? 0).trim();
    const marca = texto.match(/\b(DB|CR)\b/i)?.[1]?.toUpperCase();
    const n = Number(texto.replace(/,/g, '').replace(/\b(DB|CR)\b/ig, '').trim());
    if (!Number.isFinite(n)) throw new Error(`Importe histórico inválido: ${texto}`);
    if (!marca) return redondear(n);
    const naturaleza = ['1', '5', '6', '7', '8'].includes(clase) ? 'DB' : 'CR';
    return redondear(marca === naturaleza ? Math.abs(n) : -Math.abs(n));
  };
  return filas.map(fila => {
    const partes = fila.nombre.trim().match(/^(\d{8})\s+(.+)$/);
    if (!partes) throw new Error('El balance original requiere código y nombre de cuenta.');
    const raw = partes[1], codigo = [raw[0], raw[1], ...raw.slice(2).match(/.{2}/g)!].join('.');
    if (usados.has(codigo)) throw new Error(`La cuenta histórica ${codigo} está repetida.`);
    usados.add(codigo);
    const configuracion = modelo.filter(c => codigo === String(c.codigo).trim() || codigo.startsWith(`${String(c.codigo).trim()}.`))
      .sort((a, b) => String(b.codigo).trim().length - String(a.codigo).trim().length)[0];
    const activo = (v: any) => v === true || v === 'true';
    const definida = configuracion && (activo(configuracion.corriente) || activo(configuracion.noCorriente));
    const corriente = definida ? activo(configuracion.corriente) : true;
    const noCorriente = definida ? activo(configuracion.noCorriente) : true;
    return { codigo, nombre: partes[2], saldoAnterior: importe(fila.saldoAnterior, raw[0]),
      nuevoSaldo: importe(fila.nuevoSaldo, raw[0]), debito: importe(fila.debito, '1'), credito: importe(fila.credito, '1'),
      corriente, noCorriente, tipoDeCuenta: 0, compartidoTipo: 0, tipo: false };
  });
}

export function agruparDetalleHistorico(detalle: any[], catalogo: any[]): any[] {
  const nombres = new Map(catalogo.map(c => [String(c.codigo).trim(), c.nombre]));
  const filas = new Map<string, any>(detalle.map(c => [c.codigo, { ...c }]));
  const campos = ['saldoAnterior', 'nuevoSaldo', 'debito', 'credito', 'tipoDeCuenta', 'compartidoTipo'];
  detalle.forEach(cuenta => {
    const partes = cuenta.codigo.split('.');
    for (let n = 1; n < partes.length; n++) {
      const codigo = partes.slice(0, n).join('.');
      if (detalle.some(c => c.codigo === codigo)) throw new Error(`La cuenta ${codigo} tiene detalle y saldo propio; revisa el histórico para evitar duplicados.`);
      if (!filas.has(codigo)) filas.set(codigo, { codigo, nombre: nombres.get(codigo) || codigo, tipo: false });
      const padre = filas.get(codigo);
      campos.forEach(campo => padre[campo] = redondear(Number(padre[campo] || 0) + Number(cuenta[campo] || 0)));
      if (cuenta.clasificacionPendiente) padre.clasificacionPendiente = true;
    }
  });
  return Array.from(filas.values()).sort((a, b) => a.codigo.localeCompare(b.codigo, 'es', { numeric: true }));
}
