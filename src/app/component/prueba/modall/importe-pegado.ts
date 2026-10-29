/** Acepta los formatos de Excel colombiano y los importes con punto decimal. */
export function interpretarImportePegado(texto: string): number | null {
  texto = texto.trim();
  if (/[\t\r\n]/.test(texto)) return null;
  const limpio = texto.replace(/[\s\u00a0\u202f$]/g, '').replace(/^COP/i, '');
  if (!/^-?\d+(?:[.,]\d+)*$/.test(limpio)) return null;
  let normalizado = limpio;
  const punto = limpio.lastIndexOf('.');
  const coma = limpio.lastIndexOf(',');
  if (punto >= 0 && coma >= 0) {
    const decimal = punto > coma ? '.' : ',';
    const miles = decimal === '.' ? ',' : '.';
    const partes = limpio.split(decimal);
    if (partes.length !== 2 || !/^-?\d{1,3}([.,]\d{3})+$/.test(partes[0]) ||
        !/^\d{1,2}$/.test(partes[1])) return null;
    normalizado = partes[0].split(miles).join('') + '.' + partes[1];
  } else if (punto >= 0 || coma >= 0) {
    if (/^-?\d{1,3}([.,]\d{3})+$/.test(limpio)) {
      normalizado = limpio.replace(/[.,]/g, '');
    } else if (/^-?\d+[.,]\d{1,2}$/.test(limpio)) {
      normalizado = limpio.replace(',', '.');
    } else {
      return null;
    }
  }
  const valor = Number(normalizado);
  return Number.isFinite(valor) ? valor : null;
}
