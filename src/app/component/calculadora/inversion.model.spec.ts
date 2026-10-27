import { Investment, addMonths, calculateInvestment, xirr } from './inversion.model';

export function exampleInvestment(): Investment {
  return { id: 'test', name: 'CDT', issuer: 'Entidad', type: 'CDT', purchase: 1000000, nominal: 1000000,
    start: '2025-01-01', end: '2026-01-01', rate: 10, rateType: 'effective', index: 0,
    frequency: 0, basis: 365, withholding: 0, costs: 0, mode: 'schedule', notes: '', flows: [], updatedAt: '' };
}
describe('Motor de inversiones', () => {
  it('obtiene 10% EA para un cobro de 1.1 millones después de 365 días', () => {
    const r = calculateInvestment(exampleInvestment());
    expect(r.irr!).toBeCloseTo(.1, 10); expect(r.profit).toBeCloseTo(100000, 5);
  });
  it('reproduce el ejemplo de XIRR de Microsoft con fechas irregulares', () => {
    const flows = [['2008-01-01', -10000], ['2008-03-01', 2750], ['2008-10-30', 4250], ['2009-02-15', 3250], ['2009-04-01', 2750]];
    expect(xirr(flows.map(f => ({ date: String(f[0]), amount: Number(f[1]), concept: '' })))!).toBeCloseTo(.373362535, 8);
  });
  it('distingue una pérdida de una TIR no calculable', () => {
    const v = exampleInvestment(); v.purchase = 1200000;
    expect(calculateInvestment(v).irr!).toBeLessThan(0);
    expect(xirr([{ date: '2025-01-01', amount: -1, concept: '' }])).toBeNull();
  });
  it('incluye costos y retención en los flujos netos', () => {
    const v = exampleInvestment(); v.costs = 10000; v.withholding = 4;
    const r = calculateInvestment(v);
    expect(r.flows[0].amount).toBe(-1010000); expect(r.tax).toBeCloseTo(4000, 5);
    expect(r.profit).toBeCloseTo(86000, 5); expect(r.irr!).toBeCloseTo(1096000 / 1010000 - 1, 10);
  });
  it('ancla los pagos al día original y ajusta el cierre de mes', () => {
    expect(addMonths('2024-01-31', 1)).toBe('2024-02-29');
    expect(addMonths('2024-01-31', 2)).toBe('2024-03-31');
    const v = exampleInvestment(); v.start = '2024-01-31'; v.end = '2024-04-15'; v.frequency = 1; v.rateType = 'nominal';
    const r = calculateInvestment(v);
    expect(r.flows.map(f => f.date)).toEqual(['2024-01-31', '2024-02-29', '2024-03-31', '2024-04-15']);
    expect(r.interest).toBeCloseTo(1000000 * .1 * 75 / 365, 6);
  });
  it('no agrega capital ni intereses a los flujos propios', () => {
    const v = exampleInvestment(); v.mode = 'custom'; v.flows = [{ date: v.end, amount: 1100000, concept: 'Capital e interés' }];
    const r = calculateInvestment(v); expect(r.flows.length).toBe(2); expect(r.irr!).toBeCloseTo(.1, 10);
  });
  it('usa las fechas reales de años bisiestos para anualizar', () => {
    const v = exampleInvestment(); v.start = '2024-01-01'; v.end = '2025-01-01';
    const r = calculateInvestment(v); expect(r.days).toBe(366); expect(r.irr!).toBeCloseTo(.1, 10);
  });
  it('rechaza fechas invertidas y cobros fuera del plazo', () => {
    const v = exampleInvestment(); v.end = v.start;
    expect(() => calculateInvestment(v)).toThrow();
    v.end = '2026-01-01'; v.mode = 'custom'; v.flows = [{ date: '2027-01-01', amount: 10, concept: '' }];
    expect(() => calculateInvestment(v)).toThrow();
  });
  it('calcula el índice más spread con el supuesto registrado', () => {
    const v = exampleInvestment(); v.rate = 3; v.index = 6; v.rateType = 'indexed';
    expect(calculateInvestment(v).interest).toBeCloseTo(90000, 5);
  });
});
