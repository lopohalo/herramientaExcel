import * as XLSX from 'xlsx';
import { Investment, calculateInvestment } from './inversion.model';
export interface SourceCell { address: string; value: string | number | boolean | null; formula?: string; format?: string; }
export interface ReportPosition {
  investment: Investment; row: number; fund: string; reference: string;
  months: { period: string; cell: string; reported: number | null; calculated: number; difference: number | null; formula?: string }[];
  warnings: string[];
}
export interface UniversityReport {
  version: 1; id: string; filename: string; importedAt: string; institution: string; title: string; cutoff: string;
  sheet: string; ipc: number; positions: ReportPosition[]; cells: SourceCell[];
  totals: { label: string; nominal: number; purchase: number; months: number[]; reported: (number | null)[]; differences: (number | null)[] }[];
}
function clean(value: unknown): string { return String(value ?? '').replace(/\s+/g, ' ').trim(); }
export function parseUniversityReport(bytes: ArrayBuffer, filename: string, id: string): UniversityReport {
  const book = XLSX.read(bytes, { type: 'array', cellFormula: true, cellNF: true });
  if (book.SheetNames.length !== 1) throw new Error('Este importador admite el formato universitario de una hoja. Revisa el archivo.');
  if (book.Workbook?.WBProps?.date1904) throw new Error('El archivo usa un calendario de fechas distinto al formato esperado.');
  const sheetName = book.SheetNames[0], sheet = book.Sheets[sheetName];
  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
  if (range.e.r > 2000 || range.e.c > 200) throw new Error('El informe supera las dimensiones admitidas.');
  const value = (cell: string): any => sheet[cell]?.v ?? null;
  const num = (cell: string): number => { const n = value(cell); if (typeof n !== 'number' || !Number.isFinite(n)) throw new Error(`Valor numérico inválido en ${cell}.`); return n; };
  const date = (cell: string): string => { const v = num(cell), d = XLSX.SSF.parse_date_code(v); if (!d || d.y < 1901 || d.y > 2200) throw new Error(`Fecha inválida en ${cell}.`); return `${d.y}-${String(d.m).padStart(2, '0')}-${String(d.d).padStart(2, '0')}`; };
  const title = clean(value('A3'));
  const cut = title.match(/(\d{1,2}) DE (\d{4})/i);
  const monthName = title.match(/A (.*?) \d{1,2} DE/i)?.[1]?.toUpperCase();
  const monthNames = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];
  if (!cut || !monthName || !monthNames.includes(monthName)) throw new Error('No se reconoce la fecha de corte del informe.');
  const cutoff = `${cut[2]}-${String(monthNames.indexOf(monthName) + 1).padStart(2, '0')}-${cut[1].padStart(2, '0')}`;
  const importedAt = new Date().toISOString();
  const report: UniversityReport = { version: 1, id, filename, importedAt, institution: clean(value('A1')), title: clean(value('A2')), cutoff, sheet: sheetName, ipc: num('R8') * 100, positions: [], cells: [], totals: [] };
  if (report.ipc < -100 || report.ipc > 100) throw new Error('IPC fuera del rango esperado.');
  for (const [address, cell] of Object.entries(sheet)) {
    if (address.startsWith('!') || !['s','n','b','str'].includes(cell.t)) continue;
    report.cells.push({ address, value: cell.v ?? null, ...(cell.f ? { formula: cell.f } : {}), ...(cell.z ? { format: cell.z } : {}) });
  }
  let fund = '', current: ReportPosition[] = [], lastTotalRow = -1;
  let columns: { column: string; period: string }[] = [];
  const addTotals = (row: number, label: string, positions: ReportPosition[]) => {
    const totals = { label, nominal: positions.reduce((s, p) => s + p.investment.nominal, 0), purchase: positions.reduce((s, p) => s + p.investment.purchase, 0), months: columns.map((_, i) => positions.reduce((s, p) => s + (p.months[i].reported || 0), 0)), reported: ['K','L',...columns.map(c => c.column)].map(c => value(c + row) as number | null), differences: [] as (number | null)[] };
    totals.differences = [totals.nominal, totals.purchase, ...totals.months].map((n, i) => totals.reported[i] === null ? null : n - totals.reported[i]!);
    report.totals.push(totals);
  };
  for (let row = 1; row <= range.e.r + 1; row++) {
    const first = clean(value('A' + row));
    if (first.startsWith('FONDO')) { fund = first; current = []; continue; }
    if (clean(value('B' + row)) === 'Nemotecnico MEC') {
      if (!fund || clean(value('K'+row)) !== 'Valor Nominal Saldo en Moneda' || clean(value('L'+row)) !== 'Vr. Compra') throw new Error('Encabezados distintos al formato esperado.');
      columns = ['N','O','P'].map(column => ({ column, period: date(column + row).slice(0, 7) })); continue;
    }
    if (typeof value('A' + row) === 'number' && value('B'+row) !== null && value('K'+row) !== null) {
      if (!fund || columns.length !== 3) throw new Error('Posición fuera de un fondo reconocido.');
      const reference = clean(value('E'+row)), type = clean(value('C'+row));
      const frequencies: Record<string, number> = { Mensual: 1, Trimestral: 3, Semestral: 6, Anual: 12 };
      const frequency = frequencies[clean(value('G'+row))];
      if (!['FS', 'IPC'].includes(reference) || !['CDT','BONO','TES','TIPS'].includes(type) || !frequency) throw new Error(`Tasa, tipo o periodicidad no soportada en fila ${row}.`);
      const code = clean(value('B'+row));
      const investment: Investment = {
        id: `uis-${encodeURIComponent(fund)}-${encodeURIComponent(code)}-${date('J'+row)}`, name: code, issuer: clean(value('D'+row)), type,
        purchase: num('L'+row), nominal: num('K'+row), start: date('J'+row), end: date('I'+row), rate: num('F'+row) * 100,
        rateType: reference === 'IPC' ? 'indexed' : 'nominal', index: reference === 'IPC' ? report.ipc : 0,
        frequency, basis: 365, withholding: 0, costs: 0, mode: 'schedule', flows: [], updatedAt: importedAt,
        couponConvention: 'fixed-period', couponAnchor: date('H'+row),
        sourceReport: { reportId: id, sheet: sheetName, row, fund, code, reference, issued: date('H'+row), cutoff, ipc: report.ipc },
        notes: `Importado del informe ${filename}, fila ${row}. Cupón fijo por periodo, calendario desde emisión. IPC de corte constante para escenario; no reconstruye el IPC histórico. Retenciones y costos no informados. TIR del escenario, no certificada por el informe.`
      };
      const result = calculateInvestment(investment);
      const warnings = reference === 'IPC' ? ['IPC del corte aplicado como escenario constante; el histórico y la fijación contractual no están completos.'] : [];
      if ((investment.couponAnchor || '') < investment.start) warnings.push('Compra posterior a emisión: los cupones siguen el calendario del título, no la fecha de compra.');
      const months = columns.map(({column,period}) => {
        const cell = column + row, raw = value(cell);
        if (raw !== null && (typeof raw !== 'number' || !Number.isFinite(raw))) throw new Error(`Cobro inválido en ${cell}.`);
        const calculated = result.flows.slice(1).filter(flow => flow.date.startsWith(period)).reduce((sum, flow) => sum + (flow.grossInterest || 0), 0);
        return { period, cell, reported: raw as number | null, calculated, difference: raw === null ? null : calculated - raw, ...(sheet[cell]?.f ? { formula: sheet[cell].f } : {}) };
      });
      if (months.some(m => m.reported === null)) warnings.push('El informe contiene un cobro vacío; no se interpreta como cero confirmado.');
      if (months.some(m => m.difference !== null && Math.abs(m.difference) > .01)) warnings.push('Diferencia en calendario o cupón respecto del informe: revisar condiciones del título.');
      const position = { investment, row, fund, reference, months, warnings }; report.positions.push(position); current.push(position);
    } else if (value('K'+row) !== null && value('L'+row) !== null && value('A'+row) === null && columns.length) {
      const global = row === lastTotalRow + 1;
      addTotals(row, global ? 'TOTAL GENERAL' : fund, global ? report.positions : current); lastTotalRow = row;
    }
  }
  if (!report.positions.length || new Set(report.positions.map(p => p.investment.id)).size !== report.positions.length) throw new Error('No hay posiciones válidas o hay posiciones repetidas dentro del mismo fondo.');
  return report;
}

/** Re-read stored source cells and recompute checks; never trust cached reconciliation totals. */
export function validateStoredReport(data: unknown): UniversityReport {
  const value = data as UniversityReport;
  if (!value || value.version !== 1 || typeof value.id !== 'string' || value.id.length > 128 || typeof value.filename !== 'string' || typeof value.sheet !== 'string' || !Array.isArray(value.cells) || value.cells.length > 15000) throw new Error('Informe guardado inválido.');
  const sheet: XLSX.WorkSheet = {};
  const seen = new Set<string>();
  let maxRow = 0, maxColumn = 0;
  for (const cell of value.cells) {
    if (!cell || !/^[A-Z]{1,3}[1-9]\d{0,3}$/.test(cell.address) || seen.has(cell.address) || !['string','number','boolean'].includes(typeof cell.value) || (typeof cell.value === 'number' && !Number.isFinite(cell.value)) || (cell.formula !== undefined && typeof cell.formula !== 'string')) throw new Error('Celdas de origen inválidas.');
    const position = XLSX.utils.decode_cell(cell.address);
    if (position.r > 2000 || position.c > 200) throw new Error('Celdas fuera del rango admitido.');
    maxRow = Math.max(maxRow, position.r); maxColumn = Math.max(maxColumn, position.c); seen.add(cell.address);
    sheet[cell.address] = { t: typeof cell.value === 'number' ? 'n' : typeof cell.value === 'boolean' ? 'b' : 's', v: cell.value, ...(cell.formula ? { f: cell.formula } : {}), ...(typeof cell.format === 'string' ? { z: cell.format } : {}) };
  }
  sheet['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: maxRow, c: maxColumn } });
  const book = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(book, sheet, value.sheet);
  const bytes = XLSX.write(book, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer;
  const parsed = parseUniversityReport(bytes, value.filename, value.id);
  if (typeof value.importedAt === 'string' && Number.isFinite(Date.parse(value.importedAt))) parsed.importedAt = value.importedAt;
  return parsed;
}
