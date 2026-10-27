import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { UniversityReport, validateStoredReport } from './university-report';

@Injectable({ providedIn: 'root' })
export class InitialReportService {
  constructor(private http: HttpClient) {}
  async loadTemplate(): Promise<ArrayBuffer> {
    return firstValueFrom(this.http.get('assets/local-informes/plantilla-universidad.xlsx', { responseType: 'arraybuffer' }));
  }
  async load(): Promise<UniversityReport | null> {
    // Private university data is provided only by the local development build.
    if (!isDevMode() || !['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) return null;
    const backup = await firstValueFrom(this.http.get<{ reports: unknown[] }>('assets/local-informes/uis-septiembre-2026-respaldo.json'));
    if (!Array.isArray(backup.reports) || backup.reports.length !== 1) throw new Error('No se reconoce el informe inicial.');
    return validateStoredReport(backup.reports[0]);
  }
}
