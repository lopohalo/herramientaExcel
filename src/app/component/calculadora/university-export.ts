import * as XLSX from 'xlsx';
import { Investment, calculateInvestment, daysBetween, dateValue, addMonths } from './inversion.model';
import { UniversityReport } from './university-report';
const NS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const esc = (v: unknown) => String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
const months = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];
const serial = (date: string) => (dateValue(date) - Date.UTC(1899,11,30)) / 86400000;
interface Cell { value: string | number | null; formula?: string; style?: string; }
export interface ExportOptions { month: string; institution: string; title: string; }
export function createUniversityExport(template: ArrayBuffer, investments: Investment[], reports: UniversityReport[], options: ExportOptions): Uint8Array {
  if (!investments.length) throw new Error('No hay inversiones guardadas para exportar.');
  if (!/^\d{4}-\d{2}$/.test(options.month)) throw new Error('Selecciona un mes de corte válido.');
  const first = options.month + '-01'; dateValue(first);
  const cutoff = new Date(dateValue(addMonths(first,1)) - 86400000).toISOString().slice(0,10);
  const periods = [1,2,3].map(n => addMonths(first,n).slice(0,7));
  const source = XLSX.CFB.read(new Uint8Array(template), { type: 'array' });
  const getBytes = (path: string): Uint8Array => {
    const index = source.FullPaths.indexOf('Root Entry/' + path);
    if (index < 0) throw new Error('La plantilla no tiene la estructura esperada.');
    return new Uint8Array(source.FileIndex[index].content as Uint8Array);
  };
  const get = (path: string) => new TextDecoder().decode(getBytes(path));
  const originalSheet = get('xl/worksheets/sheet1.xml');
  const originalStyles = get('xl/styles.xml');
  const xfMatch = originalStyles.match(/<cellXfs\b[^>]*>([\s\S]*?)<\/cellXfs>/);
  const xfEntries = xfMatch?.[1].match(/<xf\b[^>]*\/>|<xf\b[^>]*>[\s\S]*?<\/xf>/g) || [];
  const sourceStyles = new Map<string,string>();
  originalSheet.replace(/<c\b([^>]*?)>/g, (_,attrs: string) => { const address=attrs.match(/\br="([^"]+)"/)?.[1], style=attrs.match(/\bs="(\d+)"/)?.[1]; if(address&&style)sourceStyles.set(address,style); return ''; });
  const style=(cell:string)=>sourceStyles.get(cell)||'0';
  const integerStyle=style('A10'), numberStyle=style('K10'), rateStyle=style('F10'), bodyStyle=style('D10'), headingStyle=style('A9');
  const emitCell=(address:string,cell:Cell,defaultStyle:string)=> {
    if(cell.value===null)return `<c r="${address}" s="${cell.style||defaultStyle}"/>`;
    if(typeof cell.value==='number') { if(!Number.isFinite(cell.value))throw new Error('Valor numérico inválido al exportar.');return `<c r="${address}" s="${cell.style||defaultStyle}">${cell.formula?`<f>${esc(cell.formula)}</f>`:''}<v>${cell.value}</v></c>`; }
    return `<c r="${address}" s="${cell.style||defaultStyle}" t="inlineStr"><is><t xml:space="preserve">${esc(cell.value)}</t></is></c>`;
  };
  const guideStyle = String(xfEntries.length);
  const wrap = (xfEntries[Number(bodyStyle)] || xfEntries[0] || '<xf numFmtId="0"/>').replace(/<alignment\b[^>]*\/>/, '<alignment horizontal="left" vertical="center" wrapText="1"/>');
  const guideXf = wrap.includes('<alignment') ? wrap : wrap.replace('/>', ' applyAlignment="1"><alignment horizontal="left" vertical="center" wrapText="1"/></xf>');
  const exportStyles = originalStyles.replace(/<cellXfs\b[^>]*>[\s\S]*?<\/cellXfs>/, `<cellXfs count="${xfEntries.length + 1}">${xfEntries.join('')}${guideXf}</cellXfs>`);
  let row=0;const mainRows:string[]=[],merges:string[]=[];
  const main=(cells:Cell[],sample=10,height=25)=>{row++;mainRows.push(`<row r="${row}" ht="${height}" customHeight="1">${cells.map((c,i)=>emitCell(XLSX.utils.encode_cell({r:row-1,c:i}),c,style(XLSX.utils.encode_cell({r:sample-1,c:i})))).join('')}</row>`);return row;};
  const text=(s:string):Cell=>({value:s});
  const title=(s:string,sample:number)=>{const n=main([text(s)],sample,25);merges.push(`A${n}:Q${n}`);};
  title(options.institution,1); title(options.title,2); title(`A ${months[Number(options.month.slice(5))-1]} ${cutoff.slice(8)} DE ${cutoff.slice(0,4)}`,3);
  main([],4,14); main([],5,14);main([],6,14);main([],7,14);
  const groups=new Map<string,Investment[]>();
  investments.forEach(v=>{const fund=v.sourceReport?.fund||'INVERSIONES SIN FONDO ASIGNADO';groups.set(fund,[...(groups.get(fund)||[]),v]);});
  const summary:(string|number|null)[][]=[['RESUMEN DEL PORTAFOLIO'],['Corte',cutoff],['Fuente','Inversiones guardadas en el sistema al exportar. No se usan filas eliminadas ni cambios sin guardar.'],['Posiciones',investments.length],['Fondos',groups.size]];
  const detail:(string|number|null)[][]=[['DETALLE Y LECTURA DE CADA INVERSIÓN'],['Fondo','Título','Tipo','Emisor','Compra','Capital nominal','Costos iniciales','TIR anual del escenario','Ganancia neta del escenario','Compra fecha','Vencimiento','Modelo y condiciones','Advertencias']];
  const calendar:(string|number|null)[][]=[['CALENDARIO DE PAGOS PROYECTADOS'],['Son previsiones del escenario, no pagos recibidos ni intereses contables certificados.'],['Fondo','Título','Fecha','Capital devuelto','Interés bruto','Retención','Cobro neto','Concepto']];
  const fundTotals:number[]=[];let overallNominal=0,overallPurchase=0;const overallMonths=[0,0,0];
  const issuerTotals=new Map<string,number>(),typeTotals=new Map<string,number>();
  let ipcMismatch=false;
  for(const [fund,positions] of groups) {
    const indexed=positions.filter(v=>v.rateType==='indexed'&&v.mode==='schedule');
    const indices=Array.from(new Set(indexed.map(v=>v.index)));
    const ipc=indices.length===1?indices[0]:null; if(indices.length>1)ipcMismatch=true;
    const sourcePositions = reports.flatMap(report=>report.positions).filter(p=>p.fund===fund);
    const sampleHeader = sourcePositions.length ? Math.min(...sourcePositions.map(p=>p.row))-1 : 9;
    const sampleTotal = sourcePositions.length ? Math.max(...sourcePositions.map(p=>p.row))+1 : 25;
    const block=main([{value:fund},...Array.from({length:15},()=>({value:null} as Cell)),{value:`IPC / índice supuesto · ${options.month}`},{value:ipc===null?null:ipc/100,style:rateStyle}],sampleHeader-1,27);
    merges.push(`A${block}:L${block}`,`N${block}:P${block}`);
    const headers=['No.','Nemotecnico MEC','Clase Titulo','Emisor','Tasa de Referencia','Spread / Tasa anual','Periodicidad','Fecha Emision','Fecha Vcto','Fecha Compra','Valor Nominal Saldo en Moneda','Vr. Compra',null,...periods.map(p=>serial(p+'-01')),'Tasa de Referencia','Spread / Tasa anual','Periodicidad'];
    main(headers.map(v=>({value:v})),sampleHeader,42);
    const startRow=row+1;let nominal=0,purchase=0;const monthTotals=[0,0,0];
    for(const [index,v] of positions.entries()) {
      const r=calculateInvestment(v),excelRow=row+1;
      const reference=v.mode==='custom'?'MANUAL':v.rateType==='indexed'?'IPC':v.rateType==='effective'?'EA':'FS';
      const frequency=({0:'Al vencimiento',1:'Mensual',3:'Trimestral',6:'Semestral',12:'Anual'} as Record<number,string>)[v.frequency];
      const position=reports.flatMap(report=>report.positions).find(p=>p.investment.id===v.id);
      const cells:Cell[]=[index+1,v.name,v.type,v.issuer,reference,v.mode==='custom'?null:v.rate/100,frequency,v.couponAnchor?serial(v.couponAnchor):null,serial(v.end),serial(v.start),v.nominal,v.purchase,null].map(value=>({value}));
      let previous=v.start;
      const fractions=new Map<string,number>();
      r.flows.slice(1).forEach(flow=>{
        const rate=(v.rate+(v.rateType==='indexed'?v.index:0))/100;
        const fraction=v.couponConvention==='fixed-period' && v.frequency>0 ? (flow.grossInterest||0)/(v.nominal*rate||1) : daysBetween(previous,flow.date)/v.basis;
        fractions.set(flow.date,fraction); previous=flow.date;
        if(periods.includes(flow.date.slice(0,7))) calendar.push([fund,v.name,flow.date,flow.principal??null,flow.grossInterest??null,flow.retainedTax??null,flow.amount,flow.concept]);
      });
      for(const [i,period] of periods.entries()) {
        const flows=r.flows.slice(1).filter(f=>f.date.startsWith(period));
        const amount=flows.reduce((s,f)=>s+(v.mode==='custom'?f.amount:f.grossInterest||0),0);
        monthTotals[i]+=amount;
        const originalBlank=position?.months.some(m=>m.period===period&&m.reported===null) && r.flows.every(f=>!f.date.startsWith(period));
        if(originalBlank) {cells.push({value:null});continue;}
        const rateExpr=v.rateType==='indexed'?`(F${excelRow}+${ipc!==null?`$R$${block}`:String(v.index/100)})`:`F${excelRow}`;
        const terms=flows.map(flow=>{
          if(v.couponConvention==='fixed-period'&&v.frequency>0){const fraction=fractions.get(flow.date)!; return Math.abs(fraction-v.frequency/12)<1e-10?`K${excelRow}*${rateExpr}/${12/v.frequency}`:`K${excelRow}*${rateExpr}*${fraction}`;}
          return v.rateType==='effective'?`K${excelRow}*((1+${rateExpr})^${fractions.get(flow.date)}-1)`:`K${excelRow}*${rateExpr}*${fractions.get(flow.date)}`;
        });
        cells.push({value:amount, ...(v.mode==='custom'?{}:{formula:terms.length?terms.join('+'):'0'})});
      }
      cells.push({value:reference,formula:undefined},{value:v.mode==='custom'?null:v.rate/100},{value:frequency});main(cells,position?.row||sampleHeader+1,30);
      nominal+=v.nominal;purchase+=v.purchase;
      issuerTotals.set(v.issuer||'Sin emisor',(issuerTotals.get(v.issuer||'Sin emisor')||0)+v.nominal);typeTotals.set(v.type,(typeTotals.get(v.type)||0)+v.nominal);
      detail.push([fund,v.name,v.type,v.issuer,v.purchase,v.nominal,v.costs,r.irr,r.profit,v.start,v.end,`${reference} · ${v.rate}%${reference==='IPC'?` + índice ${v.index}%`:''} · ${frequency} · ${v.couponConvention==='fixed-period'?'cupón fijo desde emisión':`días reales/${v.basis} desde compra`}`,[reference==='IPC'?'Índice constante del escenario; no histórico completo.':'',v.mode==='custom'?'Los cobros manuales no separan capital/interés/retención.':'',v.sourceReport?'El Excel no informó retenciones ni costos adicionales; revisar los valores registrados.':'',v.notes].filter(Boolean).join(' ')]);
    }
    const endRow=row,totalRow=row+1;
    const totals:Cell[]=Array.from({length:19},()=>({value:null}));totals[0]={value:'TOTAL FONDO'};
    for(const [column,amount] of [[10,nominal],[11,purchase],[13,monthTotals[0]],[14,monthTotals[1]],[15,monthTotals[2]]] as const) {const col=XLSX.utils.encode_col(column);totals[column]={value:amount,formula:`SUM(${col}${startRow}:${col}${endRow})`};}
    main(totals,sampleTotal,25);fundTotals.push(totalRow); if(fund !== Array.from(groups.keys()).slice(-1)[0]) main([],26,14);
    summary.push([fund,'Posiciones',positions.length,'Nominal',nominal,'Compra',purchase]);
    summary.push(['Pagos brutos previstos / manuales netos',...periods.flatMap((p,i)=>[p,monthTotals[i]])]);
    overallNominal+=nominal;overallPurchase+=purchase;monthTotals.forEach((n,i)=>overallMonths[i]+=n);
  }
  const grand:Cell[]=Array.from({length:19},()=>({value:null}));grand[0]={value:'TOTAL GENERAL'};
  for(const [column,amount] of [[10,overallNominal],[11,overallPurchase],[13,overallMonths[0]],[14,overallMonths[1]],[15,overallMonths[2]]] as const){const col=XLSX.utils.encode_col(column);grand[column]={value:amount,formula:fundTotals.map(r=>`${col}${r}`).join('+')};}main(grand,50,28);
  summary.push(['TOTAL NOMINAL',overallNominal],['TOTAL COMPRA',overallPurchase],['Diferencia compra − nominal',overallPurchase-overallNominal],['Cómo leer el informe'],['Precio de compra','Lo que se pagó por adquirir el título; no es necesariamente el capital que devuelve.'],['Nominal','Capital usado para calcular los intereses; no es la ganancia.'],['Intereses','Los meses del informe principal contienen intereses brutos. MANUAL contiene cobros netos sin desglose.'],['TIR','En Detalle se muestra una TIR anual del escenario; no está certificada por el informe de origen.'],['IPC','Se utiliza el índice supuesto de cada registro, constante en el escenario. No se consultan valores futuros oficiales.'],['Vacíos','Una celda vacía del origen sin pagos calculados se conserva pendiente, no como cero confirmado.'],['Cobros','Son proyecciones de las condiciones guardadas, no constancia de recepción.'],['Índices diferentes',ipcMismatch?'Hay fondos con distintos índices supuestos; se conserva cada índice en su fórmula, sin presentar uno solo como común.':'Los índices se indican por fondo cuando son comunes.'],['COMPOSICIÓN POR TIPO (NOMINAL)']);
  typeTotals.forEach((value,key)=>summary.push([key,value,value/overallNominal]));summary.push(['COMPOSICIÓN POR EMISOR (NOMINAL)']);issuerTotals.forEach((value,key)=>summary.push([key,value,value/overallNominal]));
  const mainName=`${months[Number(options.month.slice(5))-1]} ${options.month.slice(0,4)}`;
  const cols=(originalSheet.match(/<cols>[\s\S]*?<\/cols>/)?.[0]||'').replace(/<col\b[^>]*\/>/g,tag=>Number(tag.match(/min="(\d+)"/)?.[1])>19?'':tag.replace(/max="(\d+)"/,(_,max)=>`max="${Math.min(19,Number(max))}"`));
  const margins=originalSheet.match(/<pageMargins\b[^>]*\/>/)?.[0]||'';
  const setup=(originalSheet.match(/<pageSetup\b[^>]*\/>/)?.[0]||'').replace(/\s+r:id="[^"]*"/g,'').replace(/\s+fitToWidth="[^"]*"/g,'').replace(/\s+fitToHeight="[^"]*"/g,'').replace('/>',' fitToWidth="1" fitToHeight="0"/>');
  const sheetXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="${NS}"><sheetPr><pageSetUpPr fitToPage="1"/></sheetPr><dimension ref="A1:S${row}"/><sheetViews><sheetView workbookViewId="0"/></sheetViews><sheetFormatPr defaultRowHeight="15"/>${cols}<sheetData>${mainRows.join('')}</sheetData><mergeCells count="${merges.length}">${merges.map(ref=>`<mergeCell ref="${ref}"/>`).join('')}</mergeCells>${margins}${setup}</worksheet>`;
  const auxiliary=(rows:(string|number|null)[][],kind:string)=>`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="${NS}"><sheetViews><sheetView workbookViewId="0"><pane ySplit="2" topLeftCell="A3" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${Array.from({length:13},(_,i)=>`<col min="${i+1}" max="${i+1}" width="${i===0?40:i>9?50:25}" customWidth="1"/>`).join('')}</cols><sheetData>${rows.map((values,i)=>`<row r="${i+1}" ht="${i<2?30:Math.min(180,Math.max(32,Math.ceil(Math.max(...values.map(v=>typeof v==='string'?v.length:0))/(kind==='summary'?25:45))*15))}" customHeight="1">${values.map((value,c)=>emitCell(XLSX.utils.encode_cell({r:i,c}),{value,style:typeof value==='number'?((kind==='detail'&&c===7)||(kind==='summary'&&c===2&&values.length===3)?rateStyle:kind==='summary'&&(values[c-1]==='Posiciones'||values[c-1]==='Fondos')?integerStyle:numberStyle):i<2?headingStyle:guideStyle},bodyStyle)).join('')}</row>`).join('')}</sheetData></worksheet>`;
  const out=XLSX.CFB.utils.cfb_new();
  const put=(path:string,value:string|Uint8Array)=>XLSX.CFB.utils.cfb_add(out,path,typeof value==='string'?new TextEncoder().encode(value):value);
  put('xl/styles.xml',exportStyles);put('xl/theme/theme1.xml',getBytes('xl/theme/theme1.xml'));
  const names=[mainName,'Resumen didáctico','Detalle de inversiones','Calendario de pagos'];
  put('xl/workbook.xml',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="${NS}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${names.map((name,i)=>`<sheet name="${esc(name)}" sheetId="${i+1}" r:id="rId${i+1}"/>`).join('')}</sheets><definedNames><definedName name="_xlnm.Print_Area" localSheetId="0">'${esc(mainName)}'!$A$1:$S$${row}</definedName></definedNames><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>`);
  const REL='http://schemas.openxmlformats.org/officeDocument/2006/relationships';
  put('xl/_rels/workbook.xml.rels',`<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${names.map((_,i)=>`<Relationship Id="rId${i+1}" Type="${REL}/worksheet" Target="worksheets/sheet${i+1}.xml"/>`).join('')}<Relationship Id="rId5" Type="${REL}/styles" Target="styles.xml"/><Relationship Id="rId6" Type="${REL}/theme" Target="theme/theme1.xml"/></Relationships>`);
  put('_rels/.rels',`<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${REL}/officeDocument" Target="xl/workbook.xml"/></Relationships>`);
  put('[Content_Types].xml',`<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/xl/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>${names.map((_,i)=>`<Override PartName="/xl/worksheets/sheet${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}</Types>`);
  put('xl/worksheets/sheet1.xml',sheetXml);put('xl/worksheets/sheet2.xml',auxiliary(summary,'summary'));put('xl/worksheets/sheet3.xml',auxiliary(detail,'detail'));put('xl/worksheets/sheet4.xml',auxiliary(calendar,'calendar'));
  return new Uint8Array(XLSX.CFB.write(out,{type:'array',fileType:'zip'}));
}
