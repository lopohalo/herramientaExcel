import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Investment, calculateInvestment } from './inversion.model';
import { UniversityReport, validateStoredReport } from './university-report';

export interface InitialPortfolio { investments: Investment[]; reports: UniversityReport[]; }

@Injectable({ providedIn: 'root' })
export class InitialReportService {
  constructor(private http: HttpClient) {}
  async loadTemplate(): Promise<ArrayBuffer> {
    return firstValueFrom(this.http.get('assets/informes/plantilla-universidad.xlsx', { responseType: 'arraybuffer' }));
  }
  async load(): Promise<InitialPortfolio | null> {
    const data = await firstValueFrom(this.http.get<{ version: number; investments: Investment[]; reports: unknown[] }>('assets/informes/inversiones-iniciales.json'));
    if (data.version !== 2 || !Array.isArray(data.investments) || !Array.isArray(data.reports)) throw new Error('No se reconoce el JSON de inversiones iniciales.');
    const ids = new Set<string>();
    for (const investment of data.investments) {
      if (!investment || typeof investment.id !== 'string' || typeof investment.name !== 'string' || typeof investment.issuer !== 'string' || typeof investment.notes !== 'string' || !Array.isArray(investment.flows) || ids.has(investment.id)) throw new Error('Hay inversiones inválidas o repetidas en el JSON inicial.');
      calculateInvestment(investment); ids.add(investment.id);
    }
    return { investments: data.investments, reports: data.reports.map(validateStoredReport) };
  }
}
