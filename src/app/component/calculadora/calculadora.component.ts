import { parseUniversityReport, UniversityReport, validateStoredReport } from './university-report';
import { InitialReportService } from './initial-report.service';
import { createUniversityExport } from './university-export';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { breakdownPeriods, PeriodBreakdown, periodKey, periodLabel, accruedPeriods, accrualGrouping } from './investment-breakdown';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { CashFlow, Investment, InvestmentResult, calculateInvestment, daysBetween, dateValue, addMonths } from './inversion.model';

@Component({ selector: 'app-calculadora', templateUrl: './calculadora.component.html', styleUrls: ['./calculadora.component.scss'] })
export class CaculadoraComponent implements OnInit {
  view: 'list' | 'form' | 'result' | 'comparison' | 'report' | 'export' = 'list';
  reports: UniversityReport[] = [];
  activeReport: UniversityReport | null = null;
  importingReport = false;
  reportError = '';
  private readonly reportsKey = 'inversiones.university-reports.v1';
  private editingTemplate: Investment | null = null;
  get editedSource() { return this.editingTemplate?.sourceReport; }
  get reportDifferences(): number { return this.activeReport?.positions.flatMap(p => p.months).filter(m => m.difference !== null && Math.abs(m.difference) > .01).length || 0; }
  get reportBlanks(): number { return this.activeReport?.positions.flatMap(p => p.months).filter(m => m.reported === null).length || 0; }
  showReport(report: UniversityReport): void { this.activeReport = report; this.reportError = ''; this.navigate('report'); }
  async importReport(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement; const file = input.files?.[0]; if (!file) return;
    this.error = ''; this.importingReport = true;
    try {
      if (file.size > 5000000) throw new Error('El Excel supera 5 MB.');
      const bytes = await file.arrayBuffer();
      const digest = await crypto.subtle.digest('SHA-256', bytes);
      const id = Array.from(new Uint8Array(digest)).map(n => n.toString(16).padStart(2, '0')).join('');
      this.showReport(parseUniversityReport(bytes, file.name, id));
    } catch (error) { this.error = error instanceof Error ? error.message : 'No se pudo leer el Excel.'; }
    finally { input.value = ''; this.importingReport = false; }
  }
  registerReport(): void {
    const report = this.activeReport; if (!report) return;
    this.reportError = '';
    if (this.storageDamaged) { this.reportError = 'El almacenamiento contiene datos ilegibles; no se sobrescribieron.'; return; }
    const additions = report.positions.map(p => p.investment).filter(v => !this.investments.some(existing => existing.id === v.id));
    const next = [...this.investments, ...additions];
    const reports = this.reports.some(r => r.id === report.id) ? this.reports : [...this.reports, report];
    let originalInvestments: string | null = null, originalReports: string | null = null;
    let wroteReports = false;
    try {
      originalInvestments = localStorage.getItem(this.storageKey); originalReports = localStorage.getItem(this.reportsKey);
      localStorage.setItem(this.reportsKey, JSON.stringify(reports)); wroteReports = true;
      localStorage.setItem(this.storageKey, JSON.stringify(next));
      this.reports = reports; this.investments = next; additions.forEach(v => this.results.set(v.id, calculateInvestment(v)));
      this.message = `${additions.length} inversiones registradas; ${report.positions.length - additions.length} existentes conservadas. Informe y fórmulas guardados en este navegador.`;
    } catch {
      try { if (wroteReports) { if (originalReports === null) localStorage.removeItem(this.reportsKey); else localStorage.setItem(this.reportsKey, originalReports); if (originalInvestments === null) localStorage.removeItem(this.storageKey); else localStorage.setItem(this.storageKey, originalInvestments); } } catch { /* Original values remain in memory for retry/backup. */ }
      this.reportError = 'No fue posible guardar el informe. Revisa el espacio del navegador y conserva un respaldo.';
    }
  }
  exportMonth = '';
  exporting = false;
  openExport(): void {
    this.exportMonth = this.reports.slice(-1)[0]?.cutoff.slice(0,7) || this.today().slice(0,7);
    this.error = ''; this.navigate('export');
  }
  async exportUniversityReport(): Promise<void> {
    this.error = ''; this.exporting = true;
    try {
      const template = await this.initialReport.loadTemplate();
      const original = this.reports.slice(-1)[0];
      const bytes = createUniversityExport(template, this.investments, this.reports, { month: this.exportMonth, institution: original?.institution || 'PORTAFOLIO DE INVERSIONES', title: original?.title || 'INFORME DE INVERSIONES' });
      const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download=`Informe Inversiones - ${this.exportMonth}.xlsx`; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
      this.message = `Informe de ${this.investments.length} inversiones exportado con resumen y calendario.`;
    } catch (error) { this.error = error instanceof Error ? error.message : 'No se pudo exportar el informe. Revisa la plantilla local.'; }
    finally { this.exporting = false; }
  }
  formStep = 0;
  readonly stepLabels = ['Tu inversión', 'Cómo te pagan', 'Costos y revisión'];
  private readonly stepFields = [
    ['name', 'issuer', 'type', 'purchase', 'nominal', 'start', 'end'],
    ['mode', 'rateType', 'rate', 'index', 'frequency'],
    ['costs', 'withholding', 'basis', 'notes']
  ];
  comparisonDrafts = new Map<string, Investment>();
  comparisonResults = new Map<string, InvestmentResult>();
  comparisonDates: Record<string, string> = {};
  comparisonError = '';
  changeStep(step: number): void {
    this.error = '';
    if (step > this.formStep) {
      for (let index = 0; index < step; index++) {
        if (!this.validateStep(index)) { this.formStep = index; return; }
      }
    }
    this.formStep = step;
  }
  private validateStep(step: number): boolean {
    const fields = this.stepFields[step];
    fields.forEach(name => this.form.get(name)?.markAsTouched());
    if (fields.some(name => this.form.get(name)?.invalid)) { this.error = 'Revisa los campos de este paso antes de continuar.'; return false; }
    try {
      if (step === 0 && daysBetween(this.form.value.start, this.form.value.end) <= 0) throw new Error('El vencimiento debe ser posterior a la compra.');
      if (step === 1 && this.form.value.mode === 'custom') {
        if (!this.customFlows.length || !this.customFlows.some(f => f.amount > 0)) throw new Error('Agrega al menos un cobro positivo para continuar.');
        for (const flow of this.customFlows) {
          const date = dateValue(flow.date);
          if (!Number.isFinite(flow.amount) || flow.amount < 0 || date <= dateValue(this.form.value.start) || date > dateValue(this.form.value.end)) throw new Error('Revisa las fechas y valores de los cobros: deben estar después de la compra y hasta el vencimiento.');
        }
      }
      return true;
    } catch (error) { this.error = error instanceof Error ? error.message : 'Revisa las fechas.'; return false; }
  }
  submitForm(): void { if (this.formStep < 2) this.changeStep(this.formStep + 1); else this.save(); }
  extendComparison(v: Investment, months: number): void {
    this.comparisonDates[v.id] = addMonths(this.comparisonDates[v.id] || v.end, months);
    this.applyComparisonDate(v);
  }
  applyComparisonDate(v: Investment): void {
    this.comparisonError = '';
    try {
      const draft = { ...v, end: this.comparisonDates[v.id] || '', flows: v.flows.map(f => ({ ...f })) };
      const result = calculateInvestment(draft);
      this.comparisonDrafts.set(v.id, draft); this.comparisonResults.set(v.id, result);
      this.updateComparisonChart();
    } catch (error) { this.comparisonError = error instanceof Error ? error.message : 'No se pudo actualizar la fecha.'; }
  }
  resetComparisonDate(id: string): void {
    const original = this.investments.find(v => v.id === id);
    if (!original) return;
    this.comparisonDrafts.delete(id); this.comparisonDates[id] = original.end;
    this.comparisonResults.set(id, this.results.get(id)!); this.comparisonError = ''; this.updateComparisonChart();
  }
  saveComparisonDates(): void {
    const next = this.investments.map(v => this.comparisonDrafts.has(v.id) ? { ...this.comparisonDrafts.get(v.id)!, updatedAt: new Date().toISOString() } : v);
    if (this.persist(next)) {
      this.comparisonDrafts.forEach((v, id) => this.results.set(id, calculateInvestment(v)));
      this.comparisonDrafts.clear(); this.updateComparisonChart(); this.message = 'Fechas guardadas. Las inversiones registradas ya tienen los plazos actualizados.';
    }
  }
  readonly storageKey = 'inversiones.v2';
  form: FormGroup;
  readonly palette = ['#176c72', '#5661b3', '#cd8431', '#b45472', '#438647', '#537d9e'];
  chartMetric = 'periods';
  chartData: ChartDataSets[] = [];
  chartLabels: string[] = [];
  chartOptions: ChartOptions = {};
  chartType: 'bar' | 'line' = 'bar';
  resultMetric = 'interest';
  resultBasis = 'accrued';
  comparisonBasis = 'accrued';
  private displayPeriods(v: Investment, r: InvestmentResult, group: string, basis: string): PeriodBreakdown[] {
    return basis === 'accrued' ? accruedPeriods(v, r, group) : breakdownPeriods(v, r, group);
  }
  resultGrouping = 'auto';
  comparisonGrouping = 'auto';
  comparisonPeriodMetric = 'interest';
  resultPeriods: PeriodBreakdown[] = [];
  resultLegend = false;
  comparisonLegend = false;
  private readonly componentColors = ['#176c72', '#cf8b37', '#537d9e', '#b45472'];
  private detailedOptions(): ChartOptions {
    const options = this.options();
    return { ...options, legend: { display: true, position: 'bottom' }, tooltips: { mode: 'index', intersect: false, callbacks: { label: (item: any, data: any) => `${data.datasets[item.datasetIndex].label}: ${this.money(Number(item.yLabel))}` } } };
  }
  private periodSeries(v: Investment, r: InvestmentResult, group: string, metric: string, keys: string[]): (number | null)[] {
    const resolved = this.comparisonBasis === 'accrued' && v.mode === 'schedule' ? accrualGrouping(v, group) : group;
    const periods = new Map(this.displayPeriods(v, r, group, this.comparisonBasis).map(row => [row.key, row]));
    return keys.map(key => {
      if (key < periodKey(v.start, resolved) || key > periodKey(v.end, resolved) || (v.mode === 'custom' && metric !== 'net')) return null;
      const row = periods.get(key);
      return row ? Number(row[metric as keyof PeriodBreakdown] ?? 0) : 0;
    });
  }
  resultChartData: ChartDataSets[] = [];
  resultChartLabels: string[] = [];
  resultChartOptions: ChartOptions = {};
  copyPurchase(): void { this.form.patchValue({ nominal: this.form.value.purchase }); }
  frequencyLabel(value: number): string { return ({ 0: 'Al vencimiento', 1: 'Mensual', 3: 'Trimestral', 6: 'Semestral', 12: 'Anual' } as Record<number, string>)[value] || 'Flujos propios'; }
  rateLabel(v: Investment): string {
    if (v.mode === 'custom') return 'Cobros ingresados manualmente';
    if (v.rateType === 'indexed') return `${this.percent(v.index)} índice + ${this.percent(v.rate)} spread (supuestos)`;
    return `${this.percent(v.rate)} · ${v.rateType === 'effective' ? 'efectiva anual' : v.couponConvention === 'fixed-period' ? 'anual simple · cupón fijo' : 'anual simple'}`;
  }
  viewInvestment(v: Investment): void { this.edit(v); this.prepareResultChart(); this.navigate('result'); }
  private options(percent = false): ChartOptions {
    return { responsive: true, maintainAspectRatio: false, animation: { duration: 0 },
      legend: { display: false },
      scales: { yAxes: [{ ticks: { beginAtZero: true, callback: (value: any) => percent ? this.percent(Number(value)) : this.money(Number(value)) } }], xAxes: [{ gridLines: { display: false } }] },
      tooltips: { callbacks: { label: (item: any) => percent ? this.percent(Number(item.yLabel)) : this.money(Number(item.yLabel)) } }
    };
  }
  prepareResultChart(): void {
    if (!this.preview) return;
    const v = this.build();
    const r = this.preview;
    this.resultPeriods = this.displayPeriods(v, r, this.resultGrouping, this.resultBasis);
    this.resultLegend = this.resultMetric !== 'movements';
    if (this.resultMetric === 'periods' || this.resultMetric === 'interest') {
      this.resultChartLabels = this.resultPeriods.map(row => row.label);
      const measures = this.resultMetric === 'interest' ? ['interest', 'tax'] : ['principal', 'interest', 'tax'];
      this.resultChartData = v.mode === 'custom' ? [{ label: 'Cobros netos (sin desglose)', data: this.resultPeriods.map(row => row.net), backgroundColor: '#176c72' }] : measures.map((metric, i) => ({
        label: metric === 'principal' ? 'Capital devuelto' : metric === 'tax' ? (this.resultBasis === 'accrued' ? 'Retención estimada sobre interés generado' : 'Retención descontada (no recibida)') : (this.resultBasis === 'accrued' ? 'Interés generado neto estimado' : 'Interés neto recibido'),
        data: this.resultPeriods.map(row => Number(row[metric as keyof PeriodBreakdown])), backgroundColor: this.componentColors[i], borderWidth: 0
      }));
      this.resultChartOptions = this.detailedOptions();
    } else if (this.resultMetric === 'bridge') {
      this.resultChartLabels = v.mode === 'custom' ? ['Cobros netos', 'Compra', 'Costos', 'Ganancia / pérdida'] : ['Intereses brutos', 'Retención', 'Capital − compra', 'Costos', 'Ganancia / pérdida'];
      const values = v.mode === 'custom' ? [r.income, -v.purchase, -v.costs, r.profit] : [r.interest, -r.tax, v.nominal - v.purchase, -v.costs, r.profit];
      this.resultChartData = [{ label: 'Aporte al resultado (última barra = total)', data: values, backgroundColor: values.map(value => value < 0 ? '#bd6370' : '#176c72') }];
      this.resultLegend = false; this.resultChartOptions = this.options();
    } else {
      this.resultChartLabels = r.flows.map(f => this.date(f.date));
      this.resultChartData = [{ label: 'Movimiento neto', data: r.flows.map(f => f.amount), backgroundColor: r.flows.map(f => f.amount < 0 ? '#bd6370' : '#176c72'), borderWidth: 0 }];
      this.resultChartOptions = this.options();
    }
  }

  updateComparisonChart(): void {
    const rows = this.comparison;
    this.chartLabels = rows.map(v => v.name);
    this.chartType = this.chartMetric === 'timeline' ? 'line' : 'bar';
    this.chartOptions = this.options(this.chartMetric === 'irr');
    this.comparisonLegend = ['timeline', 'breakdown', 'periods'].includes(this.chartMetric);
    if (this.chartMetric === 'periods') {
      const group = this.comparisonBasis === 'accrued' && this.comparisonGrouping === 'auto' ? 'month' : this.comparisonGrouping;
      const keys = Array.from(new Set(rows.flatMap(v => this.displayPeriods(v, this.comparisonResults.get(v.id)!, group, this.comparisonBasis).map(row => row.key)))).sort();
      this.chartLabels = keys.map(key => periodLabel(key, group));
      this.chartData = rows.map((v, i) => ({ label: `${v.name} · ${v.mode === 'custom' ? 'Fechas propias' : this.frequencyLabel(v.frequency)}`, data: this.periodSeries(v, this.comparisonResults.get(v.id)!, group, this.comparisonPeriodMetric, keys), backgroundColor: this.palette[i % this.palette.length] }));
      this.chartOptions = this.detailedOptions();
    } else if (this.chartMetric === 'breakdown') {
      const labels = ['Intereses brutos', 'Retención (resta)', 'Capital − compra', 'Costos (restan)', 'Ganancia / pérdida'];
      this.chartLabels = labels;
      this.chartData = rows.map((v, i) => {
        const r = this.comparisonResults.get(v.id)!;
        return { label: v.name, data: [v.mode === 'custom' ? null : r.interest, v.mode === 'custom' ? null : -r.tax, v.mode === 'custom' ? null : v.nominal - v.purchase, -v.costs, r.profit], backgroundColor: this.palette[i % this.palette.length] };
      });
      this.chartOptions = this.detailedOptions();
    } else if (this.chartMetric === 'timeline') {
      const dates = Array.from(new Set(rows.flatMap(v => this.comparisonResults.get(v.id)!.flows.map(f => f.date)))).sort();
      // Numeric date axis keeps equal distances in time, even for irregular payments.
      this.chartLabels = [];
      this.chartData = rows.map((v, i) => {
        const flows = this.comparisonResults.get(v.id)!.flows;
        let balance = 0;
        const totals = new Map<string, number>();
        flows.forEach(f => totals.set(f.date, (totals.get(f.date) || 0) + f.amount));
        return { label: v.name, data: dates.filter(d => d >= v.start && d <= v.end).map(date => { balance += totals.get(date) || 0; return { x: Date.parse(date + 'T00:00:00Z'), y: balance }; }),
          pointBackgroundColor: this.palette[i % this.palette.length], pointBorderColor: this.palette[i % this.palette.length], borderColor: this.palette[i % this.palette.length], backgroundColor: this.palette[i % this.palette.length], fill: false, steppedLine: 'before', pointRadius: 3, lineTension: 0 };
      });
      this.chartOptions = { ...this.chartOptions, legend: { display: true, position: 'bottom' },
        scales: { ...this.chartOptions.scales, xAxes: [{ type: 'linear', ticks: { min: Date.parse(dates[0] + 'T00:00:00Z'), max: Date.parse(dates[dates.length - 1] + 'T00:00:00Z'), maxTicksLimit: 6, callback: (value: any) => this.date(new Date(Number(value)).toISOString().slice(0, 10)) } }] },
        tooltips: { callbacks: { title: (items: any[]) => items.length ? this.date(new Date(Number(items[0].xLabel)).toISOString().slice(0, 10)) : '', label: (item: any, data: any) => `${data.datasets[item.datasetIndex].label}: ${this.money(Number(item.yLabel))}` } } };
    } else {
      this.chartData = [{ label: this.chartMetric === 'irr' ? 'TIR anual neta' : this.chartMetric === 'profit' ? 'Ganancia neta' : 'Desembolso inicial',
        data: rows.map(v => { const r = this.comparisonResults.get(v.id)!; return this.chartMetric === 'irr' ? (r.irr === null ? null : r.irr * 100) : this.chartMetric === 'profit' ? r.profit : v.purchase + v.costs; }),
        backgroundColor: rows.map((_, i) => this.palette[i % this.palette.length]), borderWidth: 0 }];
    }
  }
  investments: Investment[] = [];
  selected = new Set<string>();
  results = new Map<string, InvestmentResult>();
  preview: InvestmentResult | null = null;
  customFlows: CashFlow[] = [];
  editingId: string | null = null;
  message = '';
  error = '';
  search = '';
  statusFilter = 'all';
  deleteId: string | null = null;
  readonly types = ['CDT', 'BONO', 'TES', 'TIPS', 'OTRA'];
  constructor(private fb: FormBuilder, private initialReport: InitialReportService) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]], issuer: ['', Validators.maxLength(100)], type: ['CDT', Validators.required],
      purchase: [null, [Validators.required, Validators.min(0.01)]], nominal: [null, [Validators.required, Validators.min(0.01)]],
      start: ['', Validators.required], end: ['', Validators.required], rate: [0, [Validators.required, Validators.min(0)]],
      rateType: ['effective'], index: [0, [Validators.required, Validators.min(0)]], frequency: [0], basis: [365],
      withholding: [0, [Validators.required, Validators.min(0), Validators.max(100)]], costs: [0, [Validators.required, Validators.min(0)]],
      mode: ['schedule'], notes: ['', Validators.maxLength(2000)]
    });
    this.form.valueChanges.subscribe(() => {
      this.preview = null; this.error = '';
      const scheduled = this.form.value.mode === 'schedule';
      for (const name of ['rate', 'index', 'withholding']) {
        const control = this.form.get(name)!;
        const required = scheduled && (name !== 'index' || this.form.value.rateType === 'indexed');
        control.setValidators(required ? [Validators.required, Validators.min(0), ...(name === 'withholding' ? [Validators.max(100)] : [])] : []);
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
  }
  newInvestment(): void { this.reset(); this.navigate('form'); }
  navigate(view: 'list' | 'form' | 'result' | 'comparison' | 'report' | 'export'): void {
    this.view = view;
    this.deleteId = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  openComparison(): void { if (this.comparison.length >= 2) { this.comparisonDrafts.clear(); this.comparisonError = ''; this.comparisonResults = new Map(this.results); this.investments.forEach(v => this.comparisonDates[v.id] = v.end); this.updateComparisonChart(); this.navigate('comparison'); } }
  readonly initialSeedKey = 'inversiones.initial-seed.uis-2026-09';
  async seedInitialReport(): Promise<void> {
    if (this.storageDamaged) return;
    try {
      if (localStorage.getItem(this.initialSeedKey)) return;
      const report = await this.initialReport.load();
      if (!report) return;
      if (this.reports.some(existing => existing.id === report.id)) {
        localStorage.setItem(this.initialSeedKey, report.id); return;
      }
      const previousReport = this.activeReport;
      this.activeReport = report; this.registerReport(); this.activeReport = previousReport;
      if (this.reportError) { this.error = this.reportError; return; }
      localStorage.setItem(this.initialSeedKey, report.id);
    } catch { this.error = 'No se pudo precargar el informe de septiembre. Revisa el almacenamiento o el archivo local del proyecto.'; }
  }
  ngOnInit(): void {
    try {
      const reportData = JSON.parse(localStorage.getItem(this.reportsKey) || '[]');
      if (!Array.isArray(reportData) || !reportData.every(r => r && typeof r.id === 'string' && typeof r.filename === 'string' && Array.isArray(r.positions) && Array.isArray(r.cells) && Array.isArray(r.totals))) throw new Error('Informes inválidos');
      this.reports = reportData.map(validateStoredReport);
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        const data: unknown = JSON.parse(raw);
        if (!Array.isArray(data)) throw new Error();
        const ids = new Set<string>();
        for (const item of data) {
          if (!this.validRecord(item) || ids.has(item.id)) throw new Error();
          ids.add(item.id);
          this.results.set(item.id, calculateInvestment(item));
        }
        this.investments = data;
      }
      void this.seedInitialReport();
    } catch { this.error = 'No se pudieron leer los registros locales. Los datos originales siguen guardados. Revisa el almacenamiento antes de guardar cambios.'; this.storageDamaged = true; }
  }
  storageDamaged = false;
  legacyRecords: { label: string; value: any }[] = [];
  loadLegacy(): void {
    this.legacyRecords = [];
    try {
      const seen = new Set<string>();
      for (const key of ['dataTareasCalcular', 'formulario', 'dataTareas']) {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const records = JSON.parse(raw);
        if (!Array.isArray(records)) continue;
        for (const record of records) {
          const value = record?.form?.value || record?.form || record;
          if (!value || typeof value !== 'object') continue;
          const fingerprint = JSON.stringify(value);
          if (seen.has(fingerprint)) continue;
          seen.add(fingerprint);
          this.legacyRecords.push({ label: value.nemotecnico || value.numeroInterno || `Registro anterior ${this.legacyRecords.length + 1}`, value });
        }
      }
      if (!this.legacyRecords.length) this.message = 'No se encontraron registros del sistema anterior en este navegador.';
    } catch { this.error = 'Algún registro anterior no se pudo leer. No se modificaron sus datos.'; }
  }
  reviewLegacy(value: any): void {
    this.newInvestment();
    const legacyDate = (raw: unknown) => {
      if (typeof raw !== 'string') return '';
      if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
      const date = new Date(raw);
      if (!Number.isFinite(date.getTime())) return '';
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };
    this.form.patchValue({ name: value.nemotecnico || value.numeroInterno || 'Inversión anterior', issuer: value.emisor || '',
      type: this.types[Number(value.idTipoTitulo) - 1] || 'OTRA', purchase: Number(value.valorCompra ?? value.vrCompra) || null,
      nominal: Number(value.valorTitulo ?? value.valorNominal) || null, start: legacyDate(value.fechaCompra), end: legacyDate(value.fechaVcto),
      rate: null, rateType: value.tipoTasa === 2 ? 'indexed' : 'nominal',
      frequency: ({ 1: 1, 2: 3, 3: 6, 4: 12 } as Record<number, number>)[Number(value.periocidad)] ?? 0,
      notes: 'Recuperada del sistema anterior. Revisar las condiciones contractuales antes de calcular.' });
    this.message = 'Datos anteriores cargados como borrador. Confirma tasa, convención, índice y fechas antes de guardar. La TIR anterior no se reutiliza.';
    document.getElementById('investment-form')?.scrollIntoView({ behavior: 'smooth' });
  }
  private validRecord(v: any): v is Investment {
    return !!v && (v.couponConvention === undefined || (v.couponConvention === 'fixed-period' && typeof v.couponAnchor === 'string')) && typeof v.id === 'string' && typeof v.name === 'string' && typeof v.issuer === 'string' && typeof v.notes === 'string' && this.types.includes(v.type) && Array.isArray(v.flows) && v.flows.every((f: any) => f && typeof f.date === 'string' && typeof f.concept === 'string' && typeof f.amount === 'number');
  }
  get filtered(): Investment[] {
    const query = this.search.toLocaleLowerCase();
    return this.investments.filter(v => `${v.name} ${v.issuer} ${v.type} ${v.sourceReport?.fund || ''}`.toLocaleLowerCase().includes(query) && (this.statusFilter === 'all' || this.status(v) === this.statusFilter));
  }
  get comparison(): Investment[] { return this.investments.filter(v => this.selected.has(v.id)).sort((a, b) => (this.results.get(b.id)?.irr ?? -Infinity) - (this.results.get(a.id)?.irr ?? -Infinity)).map(v => this.comparisonDrafts.get(v.id) || v); }
  get totalCapital(): number { return this.investments.reduce((sum, v) => sum + v.purchase + v.costs, 0); }
  get totalProfit(): number { return this.investments.reduce((sum, v) => sum + (this.results.get(v.id)?.profit || 0), 0); }
  private today(): string { return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
  status(v: Investment): string { const today = this.today(); return v.start > today ? 'Programada' : v.end < today ? 'Vencida' : 'Vigente'; }
  money(value: number): string { return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 2 }).format(value); }
  percent(value: number | null | undefined): string { return value == null ? 'No calculable' : new Intl.NumberFormat('es-CO', { maximumFractionDigits: 4 }).format(value) + ' %'; }
  date(value: string): string { return value.split('-').reverse().join('/'); }
  build(): Investment {
    const values = this.form.getRawValue();
    if (values.mode === 'custom') { values.rate = 0; values.index = 0; values.withholding = 0; }
    else if (values.rateType !== 'indexed') values.index = 0;
    return { ...(this.editingTemplate || {}), ...values, id: this.editingId || globalThis.crypto.randomUUID(), flows: this.customFlows.map(f => ({ ...f })), updatedAt: new Date().toISOString() }; }
  calculate(): Investment | null {
    this.error = ''; this.message = ''; this.preview = null; this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.formStep = Math.max(0, this.stepFields.findIndex(fields => fields.some(name => this.form.get(name)?.invalid)));
      document.querySelector('details.optional-settings')?.setAttribute('open', '');
      this.error = 'Completa los campos obligatorios y revisa los valores señalados.'; return null; }
    try { const value = this.build(); this.preview = calculateInvestment(value); this.prepareResultChart(); this.navigate('result'); return value; }
    catch (error) { this.error = error instanceof Error ? error.message : 'No se pudo calcular la inversión.'; return null; }
  }
  private persist(next: Investment[]): boolean {
    if (this.storageDamaged) { this.error = 'El almacenamiento contiene datos que no se pudieron leer. No se sobrescribieron.'; return false; }
    try { localStorage.setItem(this.storageKey, JSON.stringify(next)); this.investments = next; return true; }
    catch { this.error = 'No fue posible guardar. Revisa el espacio disponible y los permisos del navegador.'; return false; }
  }
  save(): void {
    const value = this.calculate(); if (!value || !this.preview) return;
    const next = this.investments.filter(v => v.id !== value.id).concat(value);
    if (this.persist(next)) { this.results.set(value.id, this.preview); this.editingId = value.id; this.navigate('list'); this.message = 'Inversión guardada en este navegador.'; }
  }
  edit(v: Investment): void { this.editingTemplate = v; this.formStep = 0; this.navigate('form'); this.editingId = v.id; this.customFlows = v.flows.map(f => ({ ...f })); this.form.patchValue(v); this.preview = this.results.get(v.id) || null; this.message = ''; this.error = ''; document.getElementById('investment-form')?.scrollIntoView({ behavior: 'smooth' }); }
  reset(): void { this.editingTemplate = null; this.formStep = 0; this.editingId = null; this.customFlows = []; this.preview = null; this.form.reset({ name: '', issuer: '', type: 'CDT', rate: 0, rateType: 'effective', index: 0, frequency: 0, basis: 365, withholding: 0, costs: 0, mode: 'schedule', notes: '' }); this.message = ''; this.error = ''; }
  duplicate(v: Investment): void { this.edit(v); this.editingId = null; this.form.patchValue({ name: v.name + ' (copia)' }); this.preview = null; }
  remove(v: Investment): void { if (this.persist(this.investments.filter(item => item.id !== v.id))) { this.results.delete(v.id); this.selected.delete(v.id); this.deleteId = null; if (this.editingId === v.id) this.reset(); this.message = 'Registro eliminado.'; } }
  toggle(id: string): void { if (this.selected.has(id)) this.selected.delete(id); else this.selected.add(id); }
  addFlow(): void { this.customFlows.push({ date: this.form.value.end || '', amount: 0, concept: 'Cobro neto' }); this.preview = null; }
  removeFlow(i: number): void { this.customFlows.splice(i, 1); this.preview = null; }
  flowChanged(): void { this.preview = null; }
  backup(): void {
    const blob = new Blob([JSON.stringify({ version: 2, investments: this.investments, reports: this.reports }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'inversiones-respaldo.json'; link.click(); URL.revokeObjectURL(url);
  }
  async restore(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement; const file = input.files?.[0]; if (!file) return;
    this.error = ''; this.message = '';
    try {
      if (file.size > 5000000) throw new Error('El respaldo supera 5 MB.');
      const data = JSON.parse(await file.text());
      if (data.version !== 2 || !Array.isArray(data.investments) || data.investments.length > 1000) throw new Error('Formato de respaldo inválido.');
      const additions: Investment[] = []; const ids = new Set<string>();
      for (const v of data.investments) {
        if (!this.validRecord(v) || ids.has(v.id)) throw new Error('El respaldo contiene registros inválidos o repetidos.');
        calculateInvestment(v); ids.add(v.id);
        // Existing records are preserved; importing never silently overwrites edits.
        if (!this.investments.some(item => item.id === v.id)) additions.push(v);
      }
      let mergedReports = this.reports;
      if (data.reports !== undefined) {
        if (!Array.isArray(data.reports) || !data.reports.every((r: any) => r && typeof r.id === 'string' && typeof r.filename === 'string' && Array.isArray(r.cells) && Array.isArray(r.positions) && Array.isArray(r.totals))) throw new Error('Informes del respaldo inválidos.');
        const checkedReports = data.reports.map(validateStoredReport) as UniversityReport[];
        mergedReports = [...this.reports, ...checkedReports.filter(r => !this.reports.some(existing => existing.id === r.id))];
      }
      if (this.storageDamaged) throw new Error('El almacenamiento contiene datos ilegibles.');
      const previousReports = localStorage.getItem(this.reportsKey);
      localStorage.setItem(this.reportsKey, JSON.stringify(mergedReports));
      if (this.persist([...this.investments, ...additions])) { this.reports = mergedReports; additions.forEach(v => this.results.set(v.id, calculateInvestment(v))); this.message = `${additions.length} inversiones recuperadas. Los registros existentes se conservaron.`; } else { if (previousReports === null) localStorage.removeItem(this.reportsKey); else localStorage.setItem(this.reportsKey, previousReports); }
    } catch (error) { this.error = error instanceof Error ? error.message : 'No se pudo leer el respaldo.'; }
    input.value = '';
  }
}
