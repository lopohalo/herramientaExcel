import { Investment, InvestmentResult, addMonths } from './inversion.model';
export interface PeriodBreakdown { key: string; label: string; gross: number | null; tax: number | null; interest: number | null; principal: number | null; net: number; }
export function periodKey(date: string, group: string): string {
  if (group === 'auto') return date;
  if (group === 'semester') return date.slice(0, 4) + '-S' + Math.ceil(Number(date.slice(5, 7)) / 6);
  if (group === 'year') return date.slice(0, 4);
  if (group === 'quarter') return date.slice(0, 4) + '-T' + Math.ceil(Number(date.slice(5, 7)) / 3);
  return date.slice(0, 7);
}
export function periodLabel(key: string, group: string): string {
  if (group === 'auto') return key.split('-').reverse().join('/');
  if (group === 'year') return key;
  if (group === 'quarter') return 'Trimestre ' + key.slice(-1) + ' · ' + key.slice(0, 4);
  if (group === 'semester') return 'Semestre ' + key.slice(-1) + ' · ' + key.slice(0, 4);
  return new Intl.DateTimeFormat('es-CO', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(key + '-01T00:00:00Z'));
}
export function calendarKeys(start: string, end: string, group: string): string[] {
  if (group === 'auto') return [];
  const keys = new Set<string>();
  let date = start.slice(0, 7) + '-01';
  for (let index = 0; index <= 1201 && date <= end; index++) { keys.add(periodKey(date, group)); date = addMonths(date, 1); }
  return [...keys];
}
/** Group payments when they are received; this is a cash calendar, not accrual. */
export function breakdownPeriods(v: Investment, r: InvestmentResult, group: string): PeriodBreakdown[] {
  const rows = new Map<string, PeriodBreakdown>();
  r.flows.slice(1).forEach(flow => {
    const key = periodKey(flow.date, group);
    const known = v.mode === 'schedule';
    const row = rows.get(key) || { key, label: periodLabel(key, group), gross: known ? 0 : null, tax: known ? 0 : null, interest: known ? 0 : null, principal: known ? 0 : null, net: 0 };
    row.net += flow.amount;
    if (known) {
      row.gross! += flow.grossInterest || 0; row.tax! += flow.retainedTax || 0;
      row.interest! += (flow.grossInterest || 0) - (flow.retainedTax || 0);
      row.principal! += flow.principal || 0;
    }
    rows.set(key, row);
  });
  if (group !== 'auto') calendarKeys(v.start, v.end, group).forEach(key => {
    if (!rows.has(key)) rows.set(key, { key, label: periodLabel(key, group), gross: v.mode === 'schedule' ? 0 : null, tax: v.mode === 'schedule' ? 0 : null, interest: v.mode === 'schedule' ? 0 : null, principal: v.mode === 'schedule' ? 0 : null, net: 0 });
  });
  if (group === 'auto' && v.mode === 'schedule') {
    const unit = ({ 1: 'Mes', 3: 'Trimestre', 6: 'Semestre', 12: 'Año' } as Record<number, string>)[v.frequency];
    [...rows.values()].forEach((row, index) => row.label = `${unit ? unit + ' ' + (index + 1) : 'Vencimiento'} · ${periodLabel(row.key, 'auto')}`);
  }
  return [...rows.values()].sort((a, b) => a.key.localeCompare(b.key));
}

export function accrualGrouping(v: Investment, group: string): string {
  return group !== 'auto' ? group : ({ 1: 'month', 3: 'quarter', 6: 'semester', 12: 'year' } as Record<number, string>)[v.frequency] || 'month';
}
/** Estimated contractual interest earned within each coupon, not a change to cash flows or XIRR.
 * Differences in cumulative coupon interest preserve the original simple/EA convention. */
export function accruedPeriods(v: Investment, r: InvestmentResult, group: string): PeriodBreakdown[] {
  if (v.mode !== 'schedule') return breakdownPeriods(v, r, group);
  const resolved = accrualGrouping(v, group);
  const rows = new Map(breakdownPeriods(v, r, resolved).map(row => [row.key, { ...row, gross: 0, tax: 0, interest: 0 }]));
  const rate = (v.rate + (v.rateType === 'indexed' ? v.index : 0)) / 100;
  let previous = v.start;
  const cumulative = (days: number) => v.nominal * (v.rateType === 'effective' ? Math.expm1(Math.log1p(rate) * days / v.basis) : rate * days / v.basis);
  for (const flow of r.flows.slice(1)) {
    let cursor = previous;
    const origin = Date.parse(previous + 'T00:00:00Z');
    let allocated = 0;
    while (cursor < flow.date) {
      const boundary = addMonths(cursor.slice(0, 7) + '-01', 1);
      const end = boundary < flow.date ? boundary : flow.date;
      const elapsed = (Date.parse(end + 'T00:00:00Z') - origin) / 86400000;
      const earnedToDate = end === flow.date ? flow.grossInterest || 0 : v.couponConvention === 'fixed-period' ? (flow.grossInterest || 0) * elapsed / ((Date.parse(flow.date + 'T00:00:00Z') - origin) / 86400000) : cumulative(elapsed);
      const gross = earnedToDate - allocated;
      const key = periodKey(cursor, resolved);
      const row = rows.get(key)!;
      const tax = gross * v.withholding / 100;
      row.gross! += gross; row.tax! += tax; row.interest! += gross - tax;
      allocated = earnedToDate; cursor = end;
    }
    previous = flow.date;
  }
  return [...rows.values()].sort((a, b) => a.key.localeCompare(b.key));
}
