import { InitialReportService } from './initial-report.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { exampleReport } from './university-report.spec';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CopInputDirective } from './cop-input.directive';
import { CaculadoraComponent } from './calculadora.component';

const record = { name: 'CDT prueba', issuer: 'Entidad', type: 'CDT', purchase: 1000000, nominal: 1000000,
  start: '2025-01-01', end: '2026-01-01', rate: 10, rateType: 'effective', index: 0,
  frequency: 0, basis: 365, withholding: 0, costs: 0, mode: 'schedule', notes: '' };
describe('Calculadora de inversiones', () => {
  let component: CaculadoraComponent;
  let fixture: ComponentFixture<CaculadoraComponent>;
  let saved: string | null;
  let savedReports: string | null;
  let savedSeed: string | null;
  let seedLoader: jasmine.Spy;
  beforeEach(async () => {
    savedSeed = localStorage.getItem('inversiones.initial-seed.uis-2026-09'); localStorage.removeItem('inversiones.initial-seed.uis-2026-09');
    seedLoader = jasmine.createSpy('load').and.resolveTo(null);
    savedReports = localStorage.getItem('inversiones.university-reports.v1'); localStorage.removeItem('inversiones.university-reports.v1');
    saved = localStorage.getItem('inversiones.v2'); localStorage.removeItem('inversiones.v2');
    await TestBed.configureTestingModule({ declarations: [CaculadoraComponent, CopInputDirective], providers: [{ provide: InitialReportService, useValue: { load: seedLoader } }], imports: [FormsModule, ReactiveFormsModule, RouterTestingModule, ChartsModule] }).compileComponents();
    fixture = TestBed.createComponent(CaculadoraComponent); component = fixture.componentInstance; fixture.detectChanges();
  });
  afterEach(() => { if (savedSeed === null) localStorage.removeItem('inversiones.initial-seed.uis-2026-09'); else localStorage.setItem('inversiones.initial-seed.uis-2026-09', savedSeed); if (savedReports === null) localStorage.removeItem('inversiones.university-reports.v1'); else localStorage.setItem('inversiones.university-reports.v1', savedReports); if (saved === null) localStorage.removeItem('inversiones.v2'); else localStorage.setItem('inversiones.v2', saved); });
  it('guarda, edita sin duplicar y recupera los registros', () => {
    expect(fixture.nativeElement.querySelector('form')).toBeNull();
    component.newInvestment(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('form')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.portfolio-table')).toBeNull();
    component.resultMetric = 'movements'; component.form.patchValue(record); component.calculate(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('form')).toBeNull();
    expect(fixture.nativeElement.querySelector('.result-panel')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.chart-frame canvas')).not.toBeNull();
    expect(component.resultChartData[0].data).toEqual([-1000000, 1100000]);
    component.save(); fixture.detectChanges();
    expect(component.view).toBe('list');
    expect(fixture.nativeElement.querySelector('.result-panel')).toBeNull();
    expect(component.investments.length).toBe(1);
    component.form.patchValue({ name: 'CDT actualizado' }); component.save();
    expect(component.investments.length).toBe(1);
    component.ngOnInit(); expect(component.investments[0].name).toBe('CDT actualizado');
    fixture.detectChanges(); expect(fixture.nativeElement.textContent).toContain('CDT actualizado');
  });
  it('invalida el resultado al cambiar condiciones y conserva selecciones por identificador', () => {
    component.form.patchValue(record); component.save(); const first = component.investments[0]; component.toggle(first.id);
    component.duplicate(first); component.form.patchValue({ purchase: 950000 });
    expect(component.preview).toBeNull(); component.save(); component.toggle(component.investments[1].id);
    expect(component.comparison.length).toBe(2); expect(component.comparison[0].purchase).toBe(950000);
    component.openComparison(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.comparison-table')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.comparison-chart canvas')).not.toBeNull();
    expect(component.chartData.length).toBe(2);
    component.chartMetric = 'timeline'; component.updateComparisonChart(); fixture.detectChanges();
    expect(component.chartType).toBe('line');
    expect((component.chartData[0].data![0] as any).y).toBe(-950000);
    expect((component.chartData[0].data![1] as any).y).toBeCloseTo(150000, 5);
    expect(fixture.nativeElement.querySelector('.portfolio-table')).toBeNull();
    component.navigate('list');
    component.remove(first); expect(component.comparison.length).toBe(1);
  });
  it('recupera condiciones anteriores como borrador que exige confirmar la tasa', () => {
    component.reviewLegacy({ valorTitulo: 1000000, valorCompra: 950000, fechaCompra: '2025-01-01', fechaVcto: '2026-01-01', periocidad: 2, tipoTasa: 1, tasaFacial: 12 });
    expect(component.form.value.frequency).toBe(3);
    expect(component.form.value.purchase).toBe(950000);
    expect(component.form.value.rate).toBeNull();
    component.save(); expect(component.investments.length).toBe(0);
  });
  it('formatea pesos al escribir y conserva números al guardar y editar', () => {
    component.newInvestment(); component.form.patchValue(record); fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#purchase');
    expect(input.value).toBe('$ 1.000.000,00');
    input.value = '1234567,89'; input.dispatchEvent(new Event('input')); fixture.detectChanges();
    expect(input.value).toBe('$ 1.234.567,89');
    expect(component.form.value.purchase).toBe(1234567.89);
    input.dispatchEvent(new Event('blur'));
    component.save();
    expect(component.investments[0].purchase).toBe(1234567.89);
    component.edit(component.investments[0]); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#purchase').value).toBe('$ 1.234.567,89');
    const edited: HTMLInputElement = fixture.nativeElement.querySelector('#purchase');
    edited.value = ''; edited.dispatchEvent(new Event('input'));
    expect(component.form.value.purchase).toBeNull();
  });
  it('muestra un paso a la vez y valida antes de avanzar', () => {
    component.newInvestment(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#purchase')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#rate')).toBeNull();
    expect(fixture.nativeElement.querySelector('#costs')).toBeNull();
    component.changeStep(1); expect(component.formStep).toBe(0);
    component.form.patchValue(record); component.changeStep(1); fixture.detectChanges();
    expect(component.formStep).toBe(1);
    expect(fixture.nativeElement.querySelector('#purchase')).toBeNull();
    expect(fixture.nativeElement.querySelector('#rate')).not.toBeNull();
    component.changeStep(2); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#rate')).toBeNull();
    expect(fixture.nativeElement.querySelector('#costs')).not.toBeNull();
    component.changeStep(0); expect(component.form.value.purchase).toBe(1000000);
  });
  it('compara tres inversiones y simula fechas sin cambiar el registro hasta guardar', () => {
    for (let i = 0; i < 3; i++) { component.newInvestment(); component.form.patchValue({ ...record, name: 'Inversión ' + i }); component.save(); }
    component.investments.forEach(v => component.toggle(v.id)); component.openComparison();
    expect(component.comparison.length).toBe(3);
    const first = component.comparison[0]; const oldProfit = component.results.get(first.id)!.profit;
    component.extendComparison(first, 6);
    expect(component.comparisonDates[first.id]).toBe('2026-07-01');
    expect(component.comparisonResults.get(first.id)!.profit).toBeGreaterThan(oldProfit);
    expect(component.investments.find(v => v.id === first.id)!.end).toBe('2026-01-01');
    component.resetComparisonDate(first.id);
    expect(component.comparisonDrafts.size).toBe(0);
    expect(component.comparisonResults.get(first.id)!.profit).toBe(oldProfit);
    component.comparisonDates[first.id] = '2024-01-01'; component.applyComparisonDate(first);
    expect(component.comparisonError).toBeTruthy(); expect(component.comparisonDrafts.size).toBe(0);
    component.comparisonDates[first.id] = '2026-07-01'; component.applyComparisonDate(first); component.saveComparisonDates();
    expect(component.investments.find(v => v.id === first.id)!.end).toBe('2026-07-01');
    expect(component.comparisonDrafts.size).toBe(0);
  });
  it('registra el informe sin duplicar posiciones y conserva metadatos al editar', () => {
    component.activeReport = exampleReport(); component.registerReport();
    expect(component.investments.length).toBe(2); expect(component.reports.length).toBe(1);
    component.registerReport(); expect(component.investments.length).toBe(2);
    const imported = component.investments[0]; component.edit(imported);
    component.form.patchValue({ notes: 'Revisión de registro' }); component.save();
    const edited = component.investments.find(v => v.id === imported.id)!;
    expect(edited.sourceReport!.fund).toBe(imported.sourceReport!.fund);
    expect(edited.couponConvention).toBe('fixed-period'); expect(edited.couponAnchor).toBe(imported.couponAnchor);
    component.ngOnInit(); expect(component.reports[0].positions.length).toBe(2);
  });
  it('conserva el portafolio si falla el guardado del informe', () => {
    component.activeReport = exampleReport();
    spyOn(Storage.prototype, 'setItem').and.throwError('quota'); component.registerReport();
    expect(component.investments.length).toBe(0); expect(component.reports.length).toBe(0); expect(component.reportError).toBeTruthy();
  });
  it('precarga una sola vez y no restaura inversiones eliminadas por el usuario', async () => {
    seedLoader.and.resolveTo(exampleReport());
    await component.seedInitialReport();
    expect(component.investments.length).toBe(2); expect(component.reports.length).toBe(1);
    const removed = component.investments[0]; component.remove(removed);
    await component.seedInitialReport(); expect(component.investments.length).toBe(1);
    expect(localStorage.getItem(component.initialSeedKey)).toBeTruthy();
  });
  it('precarga sin sobrescribir los registros existentes', async () => {
    const report = exampleReport();
    component.investments = [{ ...report.positions[0].investment, name: 'Registro editado' }];
    seedLoader.and.resolveTo(report); await component.seedInitialReport();
    expect(component.investments.length).toBe(2);
    expect(component.investments[0].name).toBe('Registro editado');
  });
  it('impide guardar formularios incompletos', () => { component.save(); expect(component.investments.length).toBe(0); expect(component.error).toBeTruthy(); });
  it('conserva los datos si falla el almacenamiento', () => {
    spyOn(Storage.prototype, 'setItem').and.throwError('quota'); component.form.patchValue(record); component.save();
    expect(component.investments.length).toBe(0); expect(component.error).toContain('No fue posible guardar');
  });
});
