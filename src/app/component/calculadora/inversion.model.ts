export interface CashFlow { date: string; amount: number; concept: string; grossInterest?: number; retainedTax?: number; principal?: number; }
export interface Investment {
  id: string; name: string; issuer: string; type: string; purchase: number; nominal: number;
  start: string; end: string; rate: number; rateType: string; index: number;
  frequency: number; basis: number; withholding: number; costs: number;
  couponConvention?: 'fixed-period'; couponAnchor?: string;
  sourceReport?: { reportId: string; sheet: string; row: number; fund: string; code: string; reference: string; issued: string; cutoff: string; ipc: number };
  mode: string; notes: string; flows: CashFlow[]; updatedAt: string;
}
export interface InvestmentResult {
  flows: CashFlow[]; irr: number | null; income: number; profit: number; returnPct: number;
  interest: number; tax: number; days: number;
}
const DAY = 86400000;
export function dateValue(value: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('Ingresa fechas válidas.');
  const time = Date.parse(value + 'T00:00:00Z');
  if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== value) throw new Error('Ingresa fechas válidas.');
  return time;
}
export function daysBetween(a: string, b: string): number { return (dateValue(b) - dateValue(a)) / DAY; }
export function addMonths(value: string, months: number): string {
  const date = new Date(dateValue(value));
  const day = date.getUTCDate();
  date.setUTCDate(1); date.setUTCMonth(date.getUTCMonth() + months);
  const last = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(day, last));
  return date.toISOString().slice(0, 10);
}
/** Conventional investment flows: one initial outflow, followed by nonnegative receipts.
 * Solve in log(1+r) space, using actual days / 365 as in Excel XIRR. */
export function xirr(flows: CashFlow[]): number | null {
  if (flows.length < 2 || flows[0].amount >= 0 || flows.slice(1).some(f => f.amount < 0) || !flows.some(f => f.amount > 0)) return null;
  const start = dateValue(flows[0].date);
  if (flows.slice(1).some(f => dateValue(f.date) <= start)) return null;
  const scale = Math.max(...flows.map(f => Math.abs(f.amount)));
  const npv = (logRate: number) => flows.reduce((sum, f) => sum + f.amount / scale * Math.exp(-logRate * (dateValue(f.date) - start) / DAY / 365), 0);
  let low = -36, high = 36;
  if (npv(low) < 0 || npv(high) > 0) return null;
  for (let i = 0; i < 200; i++) {
    const mid = (low + high) / 2;
    if (npv(mid) > 0) low = mid; else high = mid;
  }
  const result = Math.expm1((low + high) / 2);
  return Number.isFinite(result) && result > -1 ? result : null;
}
export function calculateInvestment(v: Investment): InvestmentResult {
  const days = daysBetween(v.start, v.end);
  if (days <= 0) throw new Error('El vencimiento debe ser posterior a la compra.');
  if (days > 365 * 100) throw new Error('El plazo máximo admitido es de 100 años.');
  if (![v.purchase, v.nominal, v.rate, v.index, v.withholding, v.costs, v.frequency, v.basis].every(Number.isFinite)) throw new Error('Revisa los valores numéricos.');
  if (v.purchase <= 0 || v.nominal <= 0 || v.costs < 0 || v.rate < 0 || v.index < 0 || v.withholding < 0 || v.withholding > 100) throw new Error('Capital y compra deben ser positivos; tasas y costos no pueden ser negativos. La retención debe estar entre 0 y 100.');
  if (![0, 1, 3, 6, 12].includes(v.frequency) || ![360, 365].includes(v.basis) || !['nominal', 'effective', 'indexed'].includes(v.rateType) || !['schedule', 'custom'].includes(v.mode)) throw new Error('La configuración de la inversión no es válida.');
  let interest = 0, tax = 0;
  let receipts: CashFlow[] = [];
  if (v.mode === 'custom') {
    if (!v.flows.length || v.flows.length > 2000) throw new Error('Registra entre 1 y 2000 cobros.');
    receipts = v.flows.map(f => {
      const time = dateValue(f.date);
      if (time <= dateValue(v.start) || time > dateValue(v.end) || !Number.isFinite(f.amount) || f.amount < 0) throw new Error('Cada cobro debe ser positivo o cero, posterior a la compra y hasta el vencimiento.');
      return { ...f, concept: f.concept || 'Cobro neto' };
    }).sort((a, b) => a.date.localeCompare(b.date));
    if (!receipts.some(f => f.amount > 0)) throw new Error('Registra al menos un cobro positivo.');
  } else {
    const rate = (v.rate + (v.rateType === 'indexed' ? v.index : 0)) / 100;
    const anchor = v.couponConvention === 'fixed-period' ? v.couponAnchor || v.start : v.start;
    if (dateValue(anchor) > dateValue(v.start)) throw new Error('La fecha de emisión no puede ser posterior a la compra.');
    let previous = anchor;
    for (let period = 1; period <= 1201; period++) {
      const next = v.frequency === 0 ? v.end : addMonths(anchor, period * v.frequency);
      const date = next < v.end ? next : v.end;
      if (date <= v.start) { previous = date; if (date === v.end) break; continue; }
      const fraction = v.couponConvention === 'fixed-period' && v.frequency > 0
        ? v.frequency / 12 * daysBetween(previous, date) / daysBetween(previous, next)
        : daysBetween(previous, date) / v.basis;
      const gross = v.nominal * (v.rateType === 'effective' ? Math.expm1(Math.log1p(rate) * fraction) : rate * fraction);
      const retained = gross * v.withholding / 100;
      interest += gross; tax += retained;
      receipts.push({ date, grossInterest: gross, retainedTax: retained, principal: date === v.end ? v.nominal : 0, amount: gross - retained + (date === v.end ? v.nominal : 0), concept: date === v.end ? 'Interés neto + devolución del nominal' : 'Interés neto' });
      if (date === v.end) break;
      previous = date;
    }
  }
  const initial = v.purchase + v.costs;
  const flows = [{ date: v.start, amount: -initial, concept: 'Compra + costos iniciales' }, ...receipts];
  const income = receipts.reduce((sum, f) => sum + f.amount, 0);
  if (![income, interest, tax, initial].every(Number.isFinite)) throw new Error('Los valores exceden el rango de cálculo.');
  return { flows, irr: xirr(flows), income, profit: income - initial, returnPct: (income / initial - 1) * 100, interest, tax, days };
}
