import * as XLSX from 'xlsx';
import { createUniversityExport } from './university-export';
import { exampleReport } from './university-report.spec';
import { Investment } from './inversion.model';
function templateBytes(): ArrayBuffer {
  const report=exampleReport(), sheet: XLSX.WorkSheet={};
  report.cells.forEach(cell=>sheet[cell.address]={t:typeof cell.value==='number'?'n':'s',v:cell.value!});
  sheet['!ref']='A1:S20';const book=XLSX.utils.book_new();XLSX.utils.book_append_sheet(book,sheet,'PLANTILLA');
  return XLSX.write(book,{type:'array',bookType:'xlsx'});
}
describe('Exportación universitaria',()=>{
  it('genera cuatro hojas con fondos, fórmulas, tasas porcentuales y vacíos conservados',()=>{
    const report=exampleReport();const bytes=createUniversityExport(templateBytes(),report.positions.map(p=>p.investment),[report],{month:'2026-09',institution:report.institution,title:report.title});
    const w=XLSX.read(bytes,{type:'array',cellFormula:true});
    expect(w.SheetNames).toEqual(['SEPTIEMBRE 2026','Resumen didáctico','Detalle de inversiones','Calendario de pagos']);
    const s=w.Sheets[w.SheetNames[0]];
    expect(s['K17'].v).toBe(2000000);expect(s['L17'].v).toBe(2020000);
    expect(s['N10'].f).toBe('K10*F10/4');expect(s['N15'].f).toBe('K15*(F15+$R$13)/4');
    expect(s['F10'].v).toBe(.12);expect(s['R13'].v).toBe(.0629);
    expect(s['P10']?.v).toBeUndefined();
  });
  it('usa las posiciones actuales y no incluye nombres eliminados del origen',()=>{
    const report=exampleReport();const current={...report.positions[0].investment,name:'TITULO ACTUAL',nominal:2000000,purchase:1900000};
    const bytes=createUniversityExport(templateBytes(),[current],[report],{month:'2026-09',institution:'UNIVERSIDAD',title:'INVERSIONES'});
    const w=XLSX.read(bytes,{type:'array'});const s=w.Sheets[w.SheetNames[0]];
    expect(s['B10'].v).toBe('TITULO ACTUAL');expect(s['K12'].v).toBe(2000000);expect(s['N10'].v).toBe(60000);
    const zip=XLSX.CFB.read(bytes,{type:'array'});
    expect(zip.FullPaths.some((p:string)=>/externalLink|sharedStrings/.test(p))).toBeFalse();
    const text=zip.FileIndex.map((x:any)=>new TextDecoder().decode(new Uint8Array(x.content||[]))).join('');
    expect(text).not.toContain('MISMO-TITULO');
  });
  it('incluye nuevas inversiones sin fondo y no atribuye interés a flujos manuales',()=>{
    const source=exampleReport().positions[0].investment;
    const v:Investment={...source,id:'manual',name:'MANUAL',sourceReport:undefined,couponConvention:undefined,couponAnchor:undefined,mode:'custom',flows:[{date:'2026-11-15',amount:1200000,concept:'Cobro propio'}]};
    const w=XLSX.read(createUniversityExport(templateBytes(),[v],[],{month:'2026-09',institution:'PORTAFOLIO',title:'INVERSIONES'}),{type:'array'});
    const s=w.Sheets[w.SheetNames[0]];expect(s['A8'].v).toBe('INVERSIONES SIN FONDO ASIGNADO');expect(s['E10'].v).toBe('MANUAL');expect(s['O10'].v).toBe(1200000);expect(s['O10'].f).toBeUndefined();
  });
  it('rechaza un mes inválido o un portafolio vacío',()=>{
    expect(()=>createUniversityExport(templateBytes(),[],[],{month:'2026-09',institution:'U',title:'I'})).toThrow();
    expect(()=>createUniversityExport(templateBytes(),exampleReport().positions.map(p=>p.investment),[],{month:'2026-13',institution:'U',title:'I'})).toThrow();
  });
});
