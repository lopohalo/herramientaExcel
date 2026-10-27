import { breakdownPeriods, accruedPeriods } from './investment-breakdown';
import { calculateInvestment, Investment } from './inversion.model';
const base: Investment = { id: 'breakdown', name: 'Prueba', issuer: '', type: 'CDT', purchase: 950000, nominal: 1000000, start: '2025-01-01', end: '2026-01-01', rate: 12, rateType: 'nominal', index: 0, frequency: 1, basis: 365, withholding: 4, costs: 10000, mode: 'schedule', notes: '', flows: [], updatedAt: '' };
describe('Desglose de gráficos', () => {
  for (const rateType of ['nominal', 'effective']) {
    it('distribuye interés generado antes de cobrar al vencimiento con tasa ' + rateType, () => {
      const v = { ...base, frequency: 0, rateType, end: '2027-01-01' };
      const r = calculateInvestment(v); const original = JSON.stringify(r.flows);
      const rows = accruedPeriods(v, r, 'month');
      expect(rows.filter(row => row.gross! > 0).length).toBe(24);
      expect(rows[0].gross!).toBeGreaterThan(0);
      expect(rows[0].net).toBe(0);
      expect(rows.reduce((sum, row) => sum + row.gross!, 0)).toBeCloseTo(r.interest, 6);
      expect(rows.reduce((sum, row) => sum + row.tax!, 0)).toBeCloseTo(r.tax, 6);
      expect(rows.reduce((sum, row) => sum + row.net, 0)).toBeCloseTo(r.income, 6);
      expect(JSON.stringify(r.flows)).toBe(original);
    });
  }
  it('respeta cupones, meses parciales y años bisiestos al distribuir intereses', () => {
    const v = { ...base, start: '2024-01-31', end: '2025-04-15', frequency: 3, rateType: 'effective' };
    const r = calculateInvestment(v); const rows = accruedPeriods(v, r, 'month');
    expect(rows.find(row => row.key === '2024-02')!.gross!).toBeGreaterThan(0);
    expect(rows.reduce((sum, row) => sum + row.gross!, 0)).toBeCloseTo(r.interest, 6);
    expect(rows.reduce((sum, row) => sum + row.interest!, 0)).toBeCloseTo(r.interest - r.tax, 6);
  });
  it('reconcilia los componentes con los cobros y la ganancia', () => {
    const r = calculateInvestment(base); const rows = breakdownPeriods(base, r, 'month');
    expect(rows.reduce((sum, row) => sum + row.gross!, 0)).toBeCloseTo(r.interest, 6);
    expect(rows.reduce((sum, row) => sum + row.tax!, 0)).toBeCloseTo(r.tax, 6);
    expect(rows.reduce((sum, row) => sum + row.principal!, 0)).toBe(base.nominal);
    rows.forEach(row => expect(row.interest! + row.principal!).toBeCloseTo(row.net, 6));
    expect(r.interest - r.tax + base.nominal - base.purchase - base.costs).toBeCloseTo(r.profit, 6);
  });
  for (const [frequency, count, label] of [[1, 12, 'Mes'], [3, 4, 'Trimestre'], [6, 2, 'Semestre'], [12, 1, 'Año']] as const) {
    it('muestra cada pago de frecuencia ' + frequency + ' con su periodo y fecha', () => {
      const v = { ...base, frequency };
      const rows = breakdownPeriods(v, calculateInvestment(v), 'auto');
      expect(rows.length).toBe(count);
      expect(rows[0].label).toContain(label + ' 1');
      expect(rows[rows.length - 1].label).toContain('01/01/2026');
    });
  }
  it('incluye meses sin cobros y permite agrupación semestral', () => {
    const v = { ...base, frequency: 6 };
    const r = calculateInvestment(v);
    const monthly = breakdownPeriods(v, r, 'month');
    expect(monthly.length).toBe(13);
    expect(monthly.find(row => row.key === '2025-02')!.net).toBe(0);
    const semesters = breakdownPeriods(v, r, 'semester');
    expect(semesters.map(row => row.key)).toEqual(['2025-S1', '2025-S2', '2026-S1']);
    expect(semesters.reduce((sum, row) => sum + row.net, 0)).toBeCloseTo(r.income, 6);
  });
  it('conserva el desglose con retención del 100%', () => {
    const v = { ...base, withholding: 100 }; const r = calculateInvestment(v);
    const rows = breakdownPeriods(v, r, 'quarter');
    expect(rows.reduce((sum, row) => sum + row.interest!, 0)).toBe(0);
    expect(rows.reduce((sum, row) => sum + row.tax!, 0)).toBeCloseTo(r.interest, 6);
    expect(rows.reduce((sum, row) => sum + row.net, 0)).toBe(base.nominal);
  });
  it('agrupa cobros manuales sin atribuir capital ni intereses', () => {
    const v: Investment = { ...base, mode: 'custom', flows: [{ date: '2025-03-01', amount: 300000, concept: 'Cobro' }, { date: '2025-03-20', amount: 800000, concept: 'Cobro' }] };
    const rows = breakdownPeriods(v, calculateInvestment(v), 'year');
    expect(rows.length).toBe(2); expect(rows[0].net).toBe(1100000);
    expect(rows[0].interest).toBeNull(); expect(rows[0].principal).toBeNull(); expect(rows[0].tax).toBeNull();
  });
});
