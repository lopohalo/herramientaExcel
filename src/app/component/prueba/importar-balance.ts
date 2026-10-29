export interface FilaBalanceImportada {
  nombre: string;
  saldoAnterior: string | number;
  debito: string | number;
  credito: string | number;
  nuevoSaldo: string | number;
}

/** Convierte el reporte oficial al mismo formato del Excel preparado manualmente. */
export function limpiarFilasBalance(filas: any[]): FilaBalanceImportada[] {
  return filas.flatMap((fila: any) => {
    const nombre = String(fila?.nombre || '').trim();
    const cuenta = nombre.match(/^(\d{8})\s+(.+)$/);
    if (!cuenta || cuenta[1].endsWith('00')) return [];
    return [{
      nombre,
      saldoAnterior: fila.saldoAnterior ?? 0,
      debito: fila.debito ?? 0,
      credito: fila.credito ?? 0,
      nuevoSaldo: fila.nuevoSaldo ?? 0,
    }];
  });
}

export function leerBalanceOficialTxt(contenido: string): FilaBalanceImportada[] {
  const filas: FilaBalanceImportada[] = [];
  const importe = /^-?[\d,]+\.\d{2}(?:\s+(?:DB|CR))?$/;
  contenido.split(/\r?\n/).forEach((linea: string, indice: number) => {
    // Los encabezados, firmas y totales no comienzan con un código de cuenta.
    if (!/^\s*\|\s*\d{8}\s/.test(linea)) return;
    const columnas = linea.split('|').slice(1, -1).map(valor => valor.trim());
    if (columnas.length !== 5 || !columnas.slice(1).every(valor => importe.test(valor))) {
      throw new Error(`La cuenta de la línea ${indice + 1} tiene columnas o importes inválidos.`);
    }
    filas.push({
      nombre: columnas[0], saldoAnterior: columnas[1],
      debito: Number(columnas[2].replace(/,/g, '')),
      credito: Number(columnas[3].replace(/,/g, '')),
      nuevoSaldo: columnas[4],
    });
  });
  return limpiarFilasBalance(filas);
}
