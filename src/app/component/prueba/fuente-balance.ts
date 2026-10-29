const numero = (valor: any): number => {
  const n = Number(String(valor ?? 0).replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
};
const redondear = (n: number) => Math.round((n + Math.sign(n) * Number.EPSILON) * 100) / 100;
const definido = (v: any) => v !== undefined && v !== null && v !== '';

/** Normaliza una copia. Recupera padres vacíos y conserva las distribuciones editadas válidas. */
export function normalizarFuenteBalance(filas: any[]): any[] {
  const cuentas = new Map<string, any>();
  filas.forEach(fila => {
    const codigo = String(fila?.codigo || '').trim();
    if (/^\d+(?:\.\d+)*$/.test(codigo)) cuentas.set(codigo, { ...fila, codigo });
  });
  Array.from(cuentas.keys()).forEach(codigo => {
    const partes = codigo.split('.');
    for (let n = 1; n < partes.length; n++) {
      const padre = partes.slice(0, n).join('.');
      if (!cuentas.has(padre)) cuentas.set(padre, { codigo: padre });
    }
  });
  const hijos = new Map<string, string[]>();
  cuentas.forEach((_fila, codigo) => {
    const padre = codigo.split('.').slice(0, -1).join('.');
    if (padre) hijos.set(padre, [...(hijos.get(padre) || []), codigo]);
  });
  const campos = ['saldoAnterior', 'debito', 'credito', 'nuevoSaldo', 'tipoDeCuenta', 'compartidoTipo'];
  // El auxiliar de resultado generado por el flujo antiguo no es un registro de cierre.
  const resultado = cuentas.get('3.1.10');
  const resultadoSinCierre = resultado && definido(resultado.nuevoSaldo) && numero(resultado.nuevoSaldo) === 0 &&
    ['saldoAnterior', 'debito', 'credito'].every(campo => numero(resultado[campo]) === 0);
  Array.from(cuentas.keys()).sort((a, b) => b.split('.').length - a.split('.').length).forEach(codigo => {
    const cuenta = cuentas.get(codigo), descendientes = (hijos.get(codigo) || []).map(hijo => cuentas.get(hijo));
    const suma = (campo: string) => redondear(descendientes.reduce((s, hijo) => s + numero(hijo[campo]), 0));
    if (resultadoSinCierre && (codigo === '3.1.10' || codigo.startsWith('3.1.10.'))) {
      campos.forEach(campo => cuenta[campo] = 0);
      return;
    }
    if (!descendientes.length && /^(DB|CR)$/.test(cuenta.tipoSaldoAnterior) &&
        ['saldoAnterior', 'debito', 'credito'].every(campo => definido(cuenta[campo]))) {
      const deudora = ['1', '5', '6', '7', '8'].includes(codigo.split('.')[0]);
      const marcaNatural = deudora ? 'DB' : 'CR';
      cuenta.saldoAnterior = Math.abs(numero(cuenta.saldoAnterior)) * (cuenta.tipoSaldoAnterior === marcaNatural ? 1 : -1);
      cuenta.nuevoSaldo = redondear(cuenta.saldoAnterior + (deudora ? 1 : -1) * (numero(cuenta.debito) - numero(cuenta.credito)));
    } else {
      const esPadreVacio = descendientes.length && numero(cuenta.nuevoSaldo) === 0 &&
        ['saldoAnterior', 'debito', 'credito'].every(c => numero(cuenta[c]) === 0);
      for (const campo of ['saldoAnterior', 'debito', 'credito', 'nuevoSaldo']) {
        cuenta[campo] = !definido(cuenta[campo]) || esPadreVacio ? suma(campo) : numero(cuenta[campo]);
      }
    }
    if (!descendientes.length && /^(DB|CR)$/.test(cuenta.tipoSaldoNuevo) &&
        !/^(DB|CR)$/.test(cuenta.tipoSaldoAnterior)) {
      const naturaleza = ['1', '5', '6', '7', '8'].includes(codigo.split('.')[0]) ? 'DB' : 'CR';
      cuenta.nuevoSaldo = Math.abs(numero(cuenta.nuevoSaldo)) * (cuenta.tipoSaldoNuevo === naturaleza ? 1 : -1);
    }
    const saldo = numero(cuenta.nuevoSaldo);
    let corriente = numero(cuenta.tipoDeCuenta), noCorriente = numero(cuenta.compartidoTipo);
    if (Math.abs(redondear(corriente + noCorriente) - saldo) > 0.005) {
      if (descendientes.length && Math.abs(redondear(suma('tipoDeCuenta') + suma('compartidoTipo')) - saldo) < 0.005) {
        corriente = suma('tipoDeCuenta'); noCorriente = suma('compartidoTipo');
      } else {
        if (saldo < 0 && corriente >= 0 && noCorriente >= 0) corriente = -corriente;
        noCorriente = redondear(saldo - corriente);
      }
    }
    cuenta.tipoDeCuenta = redondear(corriente);
    cuenta.compartidoTipo = redondear(noCorriente);
  });
  return Array.from(cuentas.values());
}

/** Usa la misma fuente coherente en estados, notas e informes institucionales. */
export function crearLectorBalance(filas: any[]): (codigo: string, campo: string) => number {
  const cuentas = new Map(normalizarFuenteBalance(filas).map(fila => [fila.codigo, fila]));
  return (codigo, campo) => numero(cuentas.get(codigo)?.[campo]);
}
