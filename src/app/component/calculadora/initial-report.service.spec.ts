import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InitialReportService } from './initial-report.service';
import { exampleInvestment } from './inversion.model.spec';
describe('Carga inicial en cualquier despliegue', () => {
  let service: InitialReportService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(InitialReportService); http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  it('solicita el JSON de los assets comunes y valida sus inversiones', async () => {
    const result = service.load();
    http.expectOne('assets/informes/inversiones-iniciales.json').flush({ version: 2, investments: [exampleInvestment()], reports: [] });
    expect((await result)!.investments.length).toBe(1);
  });
  it('carga la plantilla desde los assets disponibles en producción', async () => {
    const result = service.loadTemplate();
    http.expectOne('assets/informes/plantilla-universidad.xlsx').flush(new ArrayBuffer(8));
    expect((await result).byteLength).toBe(8);
  });
});
