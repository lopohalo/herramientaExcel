import * as XLSX from 'xlsx-js-style';
import { catalogoNotas, agrupacionesNotas } from './catalogo-notas';
import { crearLectorBalance, normalizarFuenteBalance } from './fuente-balance';
const redondear = (n: number) => Math.round((n + Math.sign(n) * Number.EPSILON) * 100) / 100;
const normalizar = (codigo: any) => String(codigo ?? '').replace(/\./g, '').trim();
const estructurar = (codigo: string) => codigo.length === 1 ? codigo : [codigo[0], codigo[1], ...(codigo.slice(2).match(/.{1,2}/g) || [])].join('.');
export interface FuenteNotasBase { cuentas: any[]; completa: boolean; }

/** Un estado resumido no permite reconstruir las notas del periodo anterior. */
export function leerFuenteNotasBase(libro: XLSX.WorkBook, anio: number): FuenteNotasBase {
  const nombre = libro.SheetNames.find(n => /^base esf$/i.test(n));
  if (nombre) {
    const filas: any[] = XLSX.utils.sheet_to_json(libro.Sheets[nombre]);
    const cuentas = filas.filter(f => Number(f['PERÍODO']) === anio).map(f => {
      const raw = normalizar(f['CÓDIGO']);
      const signo = /^[2349]/.test(raw) ? -1 : 1;
      return { codigo: estructurar(raw), nombre: f['DESCRIPCIÓN'], nuevoSaldo: Number(f.S_FIN || 0) * signo,
        tipoDeCuenta: Number(f.S_C || 0) * signo, compartidoTipo: Number(f.S_NC || 0) * signo };
    });
    if (cuentas.length) return { cuentas, completa: true };
  }
  const cuentas = new Map<string, any>();
  libro.SheetNames.filter(n => /^Nota\s/.test(n)).forEach(n => {
    const filas: any[][] = XLSX.utils.sheet_to_json(libro.Sheets[n], { header: 1, range: `A1:${libro.Sheets[n]['!ref']?.split(':').pop() || 'A1'}`, defval: null });
    const indice = filas.findIndex(f => f[0] === 'Código' && f[1] === 'Concepto');
    if (indice < 0) return;
    const headers = filas[indice].map(String);
    const actual = headers.findIndex(h => h === `Saldo final ${anio}` || h === `Saldo final Diciembre ${anio}` || h.endsWith(` ${anio}`) && /^Saldo final/.test(h));
    if (actual < 0) return;
    const colC = actual - 2, colNC = actual - 1;
    filas.slice(indice + 1).forEach(f => {
      const raw = normalizar(f[0]);
      if (!/^[1-7]\d{0,7}$/.test(raw) || typeof f[actual] !== 'number') return;
      const codigo = estructurar(raw);
      const fila = { codigo, nombre: f[1], nuevoSaldo: f[actual], tipoDeCuenta: Number(f[colC] || 0), compartidoTipo: Number(f[colNC] || 0) };
      if (!cuentas.has(codigo)) cuentas.set(codigo, fila);
    });
  });
  return { cuentas: Array.from(cuentas.values()), completa: false };
}

export function agregarNotasFinancieras(libro: any, fuente: any[], periodo: string, situacion: any[], base?: FuenteNotasBase, periodoBase?: string): void {
  fuente = normalizarFuenteBalance(fuente);
  if (base) base = { ...base, cuentas: normalizarFuenteBalance(base.cuentas) };
  const leer = crearLectorBalance(fuente), leerBase = crearLectorBalance(base?.cuentas || []);
  const codigosBase = new Set((base?.cuentas || []).map(f => normalizar(f.codigo)));
  const agrupadas = (codigo: string): string[] => {
    const miembros = Array.from(new Set(agrupacionesNotas.filter(([, grupo]) => grupo === codigo).map(([cuenta]) => cuenta)));
    return codigo.length === 3 && miembros.length ? miembros : [codigo];
  };
  const prefijosNota = (numero: number, codigo: string): string[] => {
    if (codigo === '19' && numero === 13) return ['1951', '1952'];
    if (codigo === '19' && numero === 14) return ['1970', '1975', '1976'];
    return agrupadas(codigo);
  };
  const valor = (codigo: string, campo: string, numero: number, anterior = false): number | null => {
    const codigos = prefijosNota(numero, codigo);
    if (anterior && !base?.completa && !codigos.every(c => codigosBase.has(c))) return null;
    const lector = anterior ? leerBase : leer;
    let total = codigos.reduce((s, c) => s + lector(estructurar(c), campo), 0);
    if (numero === 16 && codigo === '19') total -= ['1951', '1952', '1970', '1975', '1976', '1980', '1981', '1982'].reduce((s, c) => s + lector(estructurar(c), campo), 0);
    if (!anterior && numero === 27 && codigo === '3151' && campo === 'nuevoSaldo') total = Number(situacion.find(f => f.codigo === '3.1.51')?.nuevoSaldo || 0);
    return redondear(total);
  };
  const crearHoja = (filas: any[][], cabecera: number, columnas: number): any => {
    const hoja: any = XLSX.utils.aoa_to_sheet(filas);
    hoja['!cols'] = [{ wch: 17 }, { wch: 80 }, ...Array(columnas - 2).fill({ wch: 24 })];
    hoja['!merges'] = [0, 1, 2, 3].map(r => ({ s: { r, c: 0 }, e: { r, c: columnas - 1 } }));
    hoja['!rows'] = [{ hpt: 26 }, { hpt: 32 }, { hpt: 28 }, { hpt: 35 }];
    filas.forEach((fila, r) => fila.forEach((_v, c) => {
      const ref = XLSX.utils.encode_cell({ r, c }); if (!hoja[ref]) return;
      hoja[ref].s = { font: { name: 'Arial', sz: r < 2 ? 12 : 10, bold: r < 2 || r === cabecera },
        alignment: { vertical: 'center', wrapText: c === 1 || r < 4, horizontal: c >= 2 && r >= cabecera ? 'right' : 'left' },
        fill: { patternType: 'solid', fgColor: { rgb: r === cabecera ? 'DCEDE5' : 'FFFFFF' } } };
      if (typeof hoja[ref].v === 'number') hoja[ref].z = '#,##0.00;[Red](#,##0.00);"-"';
    }));
    return hoja;
  };
  const indice: any[][] = [['NOTAS A LOS ESTADOS FINANCIEROS'], [`Periodo: ${periodo}`],
    ['Importes calculados desde el balance cargado; no se incluyen saldos históricos del modelo.'],
    ['Las clases 8 y 9 y sus notas 25 y 26 quedan fuera de esta integración.'],
    ['Nota', 'Concepto', 'Contenido']];
  catalogoNotas.slice().sort((a, b) => a.numero - b.numero).forEach(nota => {
    const comparativo = !!periodoBase;
    const headers = ['Código', 'Concepto', `Corriente ${periodo}`, `No corriente ${periodo}`, `Saldo final ${periodo}`,
      ...(comparativo ? [`Corriente ${periodoBase}`, `No corriente ${periodoBase}`, `Saldo final ${periodoBase}`, 'Variación saldo final'] : []), 'Observación'];
    const columnas = headers.length;
    const filas: any[][] = [['UNIVERSIDAD INDUSTRIAL DE SANTANDER'], [nota.titulo],
      [`Periodo: ${periodo}${comparativo ? ` · Comparado con ${periodoBase}` : ''}`],
      ['Los grupos incluyen a sus auxiliares: no sumar todas las filas. Campos complementarios pendientes no equivalen a cero.'], [], headers];
    const registros: any[] = nota.cuentas.slice();
    const cubiertos = new Set(registros.map(r => r.codigo));
    // Incluir las cuentas nuevas, aunque no existieran en la base de notas de 2025.
    const prefijos = nota.cuentas.map((r: any) => r.codigo).filter((c: string) => c.length <= 4);
    fuente.forEach(cuenta => {
      const raw = normalizar(cuenta.codigo);
      if (!/^[1-7]\d{1,7}$/.test(raw) || cubiertos.has(raw) || !prefijos.some((p: string) => raw.startsWith(p))) return;
      if (nota.numero === 13 && !/^(1951|1952)/.test(raw) || nota.numero === 14 && !/^(1970|1975|1976)/.test(raw)) return;
      if (nota.numero === 16 && /^(1951|1952|1970|1975|1976|1980|1981|1982)/.test(raw)) return;
      cubiertos.add(raw); registros.push({ codigo: raw, nombre: cuenta.nombre });
    });
    registros.forEach(registro => {
      const aplicaPlazo = /^[12]/.test(registro.codigo);
      const valores = ['tipoDeCuenta', 'compartidoTipo', 'nuevoSaldo'].map(campo => !aplicaPlazo && campo !== 'nuevoSaldo' ? null : valor(registro.codigo, campo, nota.numero));
      const anteriores = comparativo ? ['tipoDeCuenta', 'compartidoTipo', 'nuevoSaldo'].map(campo => !aplicaPlazo && campo !== 'nuevoSaldo' ? null : valor(registro.codigo, campo, nota.numero, true)) : [];
      const agrupacion = registro.codigo.length === 3 || registro.codigo === '19' && [13, 14, 16].includes(nota.numero);
      const nombre = agrupacion ? registro.nombre : fuente.find(f => normalizar(f.codigo) === registro.codigo)?.nombre || registro.nombre;
      filas.push([registro.codigo, nombre, ...valores, ...anteriores,
        ...(comparativo ? [anteriores[2] === null ? null : redondear(Number(valores[2]) - Number(anteriores[2]))] : []),
        comparativo && anteriores[2] === null ? 'Sin detalle suficiente del periodo base' : 'Calculado desde el balance']);
    });
    if ([6, 7].includes(nota.numero)) {
      const raiz = nota.numero === 6 ? '12' : '13';
      const grupos = nota.cuentas.filter((r: any) => r.codigo.length === 3);
      const bloques = (anterior = false): Array<number | null> => ['tipoDeCuenta', 'compartidoTipo', 'nuevoSaldo'].map(campo => {
        const total = valor(raiz, campo, nota.numero, anterior);
        const valores = grupos.map((g: any) => valor(g.codigo, campo, nota.numero, anterior));
        return total === null || valores.some((v: any) => v === null) ? null : redondear(total - valores.reduce((s: number, v: any) => s + Number(v), 0));
      });
      const sinGrupo = bloques(), sinGrupoBase = comparativo ? bloques(true) : [];
      if ([...sinGrupo, ...sinGrupoBase].some(v => v !== null && Math.abs(v) >= 0.01)) {
        filas.push(['SIN-AGRUPACION', 'Cuentas sin agrupación definida en el modelo de referencia', ...sinGrupo, ...sinGrupoBase,
          ...(comparativo ? [sinGrupoBase[2] === null ? null : redondear(Number(sinGrupo[2]) - Number(sinGrupoBase[2]))] : []),
          'Incluidas en el saldo total; pendiente definir su agrupación con la contadora. No es un ajuste contable.']);
      }
    }
    if (nota.numero === 27) {
      for (const [codigo, texto] of [['TOTAL-PAT', 'Patrimonio registrado'], ['RESULTADO-PENDIENTE', 'Resultado del periodo presentado por separado'], ['TOTAL-PAT-R', 'Patrimonio + resultado del periodo']]) {
        filas.push([codigo, texto, null, null, Number(situacion.find(f => f.codigo === codigo)?.nuevoSaldo || 0)]);
      }
    }
    filas.push([], ['Información complementaria del modelo', 'Estado']);
    for (const campo of nota.campos) filas.push(['', campo, ...Array(columnas - 3).fill(null), 'Pendiente de información complementaria o validación de la contadora']);
    if (!nota.campos.length && !registros.length) filas.push(['', 'Información de la nota', ...Array(columnas - 3).fill(null), 'Pendiente de información complementaria']);
    XLSX.utils.book_append_sheet(libro, crearHoja(filas, 5, columnas), nota.nombre);
    indice.push([`Nota ${nota.numero}`, nota.titulo, registros.length ? 'Saldos automáticos y campos complementarios pendientes' : 'Requiere información complementaria']);
  });
  XLSX.utils.book_append_sheet(libro, crearHoja(indice, 4, 3), 'Indice de notas');
}

/** Control antes de escribir el archivo: una nota inconsistente no debe descargarse. */
export function validarNotasFinancieras(libro: any, situacion: any[]): void {
  for (const nombre of libro.SheetNames.filter((n: string) => /^Nota /.test(n))) {
    const filas: any[][] = XLSX.utils.sheet_to_json(libro.Sheets[nombre], { header: 1 });
    filas.forEach((fila, indice) => {
      if (!/^[12]\d+$/.test(String(fila[0]))) return;
      for (const inicio of [2, 5]) {
        // En una nota sin comparativo la columna 5 es la observación.
        const valores = fila.slice(inicio, inicio + 3);
        if (valores.length !== 3 || !valores.every(v => typeof v === 'number')) continue;
        if (Math.abs(redondear(valores[0] + valores[1] - valores[2])) > 0.005) {
          throw new Error(`${nombre}, fila ${indice + 1}: corriente + no corriente no coincide con el saldo.`);
        }
      }
    });
  }
  for (const [nombre, codigo] of [['Nota 13 P Inversión', '1.9.51'], ['Nota 14 Intangibles', '1.9.70'], ['Nota 16 Otros Derechos', '1.9']]) {
    const estado = situacion.find(f => f.codigo === codigo && f.seccion === 'Activo no corriente');
    if (!estado || !libro.Sheets[nombre]) continue;
    const filas: any[][] = XLSX.utils.sheet_to_json(libro.Sheets[nombre], { header: 1 });
    const nota = filas.find(f => f[0] === '19');
    if (!nota || Math.abs(redondear(Number(nota[3]) - Number(estado.nuevoSaldo))) > 0.005) {
      throw new Error(`${nombre}: el saldo no corriente no coincide con el estado financiero.`);
    }
  }
}
