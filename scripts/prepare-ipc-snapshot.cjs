// Read downloaded OFFICIAL DANE workbooks; do not derive annual IPC from rounded monthly rates.
// node scripts/prepare-ipc-snapshot.cjs monthly.xls annual.xls output.json
const fs = require('fs');
const crypto = require('crypto');
const XLSX = require('xlsx');
const [monthlyPath, annualPath, output] = process.argv.slice(2);
if (!monthlyPath || !annualPath || !output) throw new Error('Provide monthly.xls annual.xls output.json');
const readRows = (path, sheet) => {
  const workbook = XLSX.readFile(path);
  if (!workbook.Sheets[sheet]) throw new Error('Unexpected DANE workbook structure: ' + sheet);
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { header: 1, defval: null });
};
const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const rows = readRows(monthlyPath, 'VarNal');
const header = rows.find(row => row[0] === 'Mes' && row.slice(1).some(value => value === 2003));
if (!header) throw new Error('Missing year header');
const metadata = rows.find(row => typeof row[0] === 'string' && /^AÑO \d{4}, MES \d+/.test(row[0]));
const [, year, month] = metadata[0].match(/^AÑO (\d{4}), MES (\d+)/);
const cutoff = year + '-' + month.padStart(2, '0');
const monthly = [];
months.forEach((name, index) => {
  const row = rows.find(row => row[0] === name);
  if (!row) throw new Error('Missing month ' + name);
  header.forEach((year, column) => {
    if (!Number.isInteger(year) || year < 2003 || year > 2100) return;
    const value = row[column];
    const period = year + '-' + String(index + 1).padStart(2, '0');
    if (value === null) { if (period <= cutoff) throw new Error('Historical gap ' + period); return; }
    if (!Number.isFinite(value) || period > cutoff) throw new Error('Invalid observation ' + period);
    monthly.push({ period, value, unit: 'percent', status: 'observed' });
  });
});
monthly.sort((a,b) => a.period.localeCompare(b.period));
const annualRows = readRows(annualPath, 'VarAnuales');
const annualMeta = annualRows.find(row => typeof row[0] === 'string' && /^AÑO \d{4}, MES \d+/.test(row[0]));
const [, annualYear, annualMonth] = annualMeta[0].match(/^AÑO (\d{4}), MES (\d+)/);
const total = annualRows.find(row => row[0] === 'Total IPC');
if (!total) throw new Error('Missing national annual IPC');
const annual = total.slice(1, 13).flatMap((value,index) => {
  if (value === null) return [];
  if (!Number.isFinite(value) || index + 1 > Number(annualMonth)) throw new Error('Invalid annual observation');
  return [{ period: annualYear + '-' + String(index + 1).padStart(2, '0'), value, unit: 'percent', status: 'observed' }];
});
const base = 'https://www.dane.gov.co/files/operaciones/IPC/sep2026/';
const source = (file, path) => ({ url: base + file, sha256: crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex') });
const snapshot = {
  version: 1, publisher: 'DANE', geography: 'Colombia - total nacional', cutoff,
  note: 'Snapshot offline, not a live connection. Monthly variation and annual 12-month variation are different series. Annual workbook covers 2026 only. Missing annual history is not zero or a forecast. Not applied to investment cash flows.',
  series: [
    { id: 'IPC_MONTHLY_CHANGE', meaning: 'Variación mensual (%)', source: source('anex-IPC-Variacion-sep2026.xls', monthlyPath), observations: monthly },
    { id: 'IPC_ANNUAL_CHANGE', meaning: 'Variación anual 12 meses (%)', source: source('anex-IPC-divisionesAnuales-sep2026.xls', annualPath), observations: annual }
  ]
};
fs.writeFileSync(output, JSON.stringify(snapshot, null, 2) + '\n');
console.log(JSON.stringify(snapshot.series.map(series => ({ id: series.id, count: series.observations.length, from: series.observations[0].period, to: series.observations.slice(-1)[0].period }))));
