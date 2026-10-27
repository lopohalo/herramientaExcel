import * as XLSX from 'xlsx';
import { parseUniversityReport, validateStoredReport } from './university-report';
import { calculateInvestment } from './inversion.model';
export function exampleReport() {
  const serial = (date: string) => (Date.parse(date + 'T00:00:00Z') - Date.UTC(1899, 11, 30)) / 86400000;
  const sheet: XLSX.WorkSheet = {};
  const put = (address: string, value: string | number, formula?: string) => { sheet[address] = { t: typeof value === 'number' ? 'n' : 's', v: value, ...(formula ? { f: formula } : {}) }; };
  put('A1','UNIVERSIDAD DE PRUEBA'); put('A2','INVERSIONES'); put('A3','A SEPTIEMBRE 30 DE 2026'); put('R8', .0629);
  for (const [heading, row, fund, reference, rate] of [[9, 10, 'FONDO 9704', 'FS', .12], [14, 15, 'FONDO 9705', 'IPC', .03]] as const) {
    put('A'+(heading-1), fund); put('B'+heading, 'Nemotecnico MEC'); put('K'+heading,'Valor Nominal Saldo en Moneda'); put('L'+heading,'Vr. Compra');
    for (const [column, month] of [['N',10],['O',11],['P',12]] as const) put(column+heading,serial(`2026-${month}-30`));
    const cells: Record<string, string | number> = { A:1, B:'MISMO-TITULO', C:'BONO', D:'EMISOR', E:reference, F:rate, G:'Trimestral', H:serial('2026-01-15'), I:serial('2028-01-15'), J:serial('2026-02-01'), K:1000000, L:1010000, O:0 };
    Object.entries(cells).forEach(([column, value])=>put(column+row,value));
    put('N'+row, 1000000 * (rate + (reference === 'IPC' ? .0629 : 0)) / 4, reference === 'IPC' ? `K${row}*(F${row}+$R$8)/4` : `K${row}*F${row}/4`);
    // Deliberately leave December empty to verify unknown is preserved.
  }
  sheet['!ref']='A1:S15'; const book = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(book,sheet,'SEPTIEMBRE 2026');
  return parseUniversityReport(XLSX.write(book,{type:'array',bookType:'xlsx'}),'informe-prueba.xlsx','test-id');
}
describe('Informe universitario', () => {
  it('conserva fondos distintos, fechas, fórmulas y porcentajes', () => {
    const report=exampleReport(); expect(report.positions.length).toBe(2);
    const [a,b]=report.positions; expect(a.investment.id).not.toBe(b.investment.id);
    expect(a.investment.rate).toBe(12); expect(b.investment.index).toBe(6.29);
    expect(a.investment.couponAnchor).toBe('2026-01-15'); expect(a.investment.start).toBe('2026-02-01');
    expect(a.months[0].difference).toBeCloseTo(0,6); expect(b.months[0].difference).toBeCloseTo(0,6);
    expect(a.months[2].reported).toBeNull(); expect(a.months[2].difference).toBeNull();
    expect(a.months[0].formula).toContain('/4'); expect(report.cells.some(c=>c.formula)).toBeTrue();
  });
  it('recalcula la conciliación desde las celdas originales al recuperar un respaldo', () => {
    const source=exampleReport(); source.positions[0].months[0].calculated=123;
    const checked=validateStoredReport(JSON.parse(JSON.stringify(source)));
    expect(checked.positions[0].months[0].calculated).toBeCloseTo(30000,6);
  });
  it('usa el calendario del título y cupones fijos sin desplazarlo a la compra', () => {
    const v=exampleReport().positions[0].investment; const r=calculateInvestment(v);
    expect(r.flows[1].date).toBe('2026-04-15');
    expect(r.flows[1].grossInterest).toBeCloseTo(30000,6);
    expect(r.flows[0].amount).toBe(-1010000);
  });
});
