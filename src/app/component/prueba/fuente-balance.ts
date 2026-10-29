/** Lee los padres disponibles o sus hijos inmediatos, sin duplicar auxiliares. */
export function crearLectorBalance(filas: any[]): (codigo: string, campo: string) => number {
  const cuentas = new Map<string, any>();
  const hijos = new Map<string, string[]>();
  filas.forEach(fila => {
    const codigo = String(fila?.codigo || '').trim();
    if (/^\d+(?:\.\d+)*$/.test(codigo)) cuentas.set(codigo, fila);
  });
  // Completar los niveles ausentes para incluir también cuentas nuevas.
  Array.from(cuentas.keys()).forEach(codigo => {
    const partes = codigo.split('.');
    for (let n = 1; n < partes.length; n++) {
      const padre = partes.slice(0, n).join('.');
      if (!cuentas.has(padre)) cuentas.set(padre, {});
    }
  });
  cuentas.forEach((_fila, codigo) => {
    const padre = codigo.split('.').slice(0, -1).join('.');
    if (!padre) return;
    hijos.set(padre, [...(hijos.get(padre) || []), codigo]);
  });
  const numero = (valor: any): number => {
    const n = Number(String(valor ?? 0).replace(/,/g, ''));
    return Number.isFinite(n) ? n : 0;
  };
  const cache = new Map<string, number>();
  const leer = (codigo: string, campo: string): number => {
    const clave = `${codigo}:${campo}`;
    if (cache.has(clave)) return cache.get(clave)!;
    const cuenta = cuentas.get(codigo) || {};
    let valor = numero(cuenta[campo]);
    const clasificacion = campo === 'tipoDeCuenta' || campo === 'compartidoTipo';
    const sinDistribucion = numero(cuenta.tipoDeCuenta) === 0 && numero(cuenta.compartidoTipo) === 0;
    // Un cero en corriente es válido si el saldo está clasificado en no corriente.
    const tieneValor = cuenta[campo] !== undefined && cuenta[campo] !== null && cuenta[campo] !== '';
    // Un saldo cero explícito es válido, incluso si hay un resultado auxiliar calculado.
    if (valor === 0 && (clasificacion ? sinDistribucion : !tieneValor)) {
      valor = (hijos.get(codigo) || []).reduce((suma, hijo) => suma + leer(hijo, campo), 0);
    }
    cache.set(clave, valor);
    return valor;
  };
  return leer;
}
