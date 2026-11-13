import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { AuditoriaLiquidacionesComponent } from './auditoria-liquidaciones.component';
const row={ 'Código estudiante':'PRUEBA','Nombre':'ESTUDIANTE DE PRUEBA','Tipo Institución':'PÚBLICA','Valor pensión':0,'Valor pagado':100,'Estrato':2,'Tipo de documento':'CC','Número de documento':'1234',Direccion:'CL 10 # 12-34',Barrio:'CENTRO',Ciudad:'BUCARAMANGA',Departamento:'SANTANDER' };
function upload(rows:Record<string,unknown>[]): Event {
  const book=XLSX.utils.book_new();XLSX.utils.book_append_sheet(book,XLSX.utils.json_to_sheet(rows),'Datos');
  const bytes=XLSX.write(book,{type:'array',bookType:'xlsx'});
  return {target:{files:[{name:'datos-prueba.xlsx',arrayBuffer:async()=>bytes}],value:''}} as unknown as Event;
}
describe('Auditoría de direcciones integrada',()=>{
  let component:AuditoriaLiquidacionesComponent;
  beforeEach(()=>{TestBed.configureTestingModule({imports:[HttpClientTestingModule]});component=new AuditoriaLiquidacionesComponent(TestBed.inject(HttpClient));spyOn(Swal,'fire').and.stub();});
  it('carga direcciones del reporte y no agrega criticidad económica por compartir domicilio',async()=>{
    await component.cargarExcel(upload([row,{...row,'Código estudiante':'OTRO','Número de documento':'5678'}]));
    expect(component.registros.length).toBe(2);
    expect(component.registros[0].direccion.direccion).toBe(row.Direccion);
    expect(component.registros[0].estudiantesMismaDireccion).toBe(2);
    expect(component.registros[0].puntaje).toBe(0);
    component.registros[0].municipioSisben='FLORIDABLANCA';component.registros[0].departamentoSisben='SANTANDER';component.registros[0].estadoConsulta='Consultado';component.recalcular();
    expect(component.registros[0].cruceUbicacion.estado).toBe('Ubicación diferente');
    expect(component.registros[0].puntaje).toBe(0);
  });
  it('cruza una base por identidad y conserva el cruce al recalcular',async()=>{
    await component.cargarExcel(upload([row]));
    await component.cargarBaseDirecciones(upload([{...row,Direccion:'CARRERA 20 # 30-40'}]));
    expect(component.registros[0].cruceDireccionBase.estado).toBe('Diferencia con base');
    component.recalcular();expect(component.registros[0].referenciaDireccion!.direccion).toBe('CARRERA 20 # 30-40');
    component.quitarBaseDirecciones();expect(component.registros[0].cruceDireccionBase.estado).toBe('Sin referencia');
  });
  it('contrasta la dirección SISBÉN devuelta por la consulta y la conserva al recalcular',async()=>{
    await component.cargarExcel(upload([row]));const caso=component.registros[0];
    const pending=component.consultarCasoSisben(caso,false);const http=TestBed.inject(HttpTestingController);
    http.expectOne(req=>req.url.includes('ConsultarGrupoSisben')).flush({ok:true,grupo:'A1',direccion:'CARRERA 30 # 50-60',barrio:'CENTRO',municipio:'BUCARAMANGA',departamento:'SANTANDER'});
    http.expectOne(req=>req.url.includes('ObtenerDatosRUI')).flush({ok:true,nombre:row.Nombre});
    await pending;expect(caso.cruceDireccionSisben.estado).toBe('Dirección diferente');
    expect(caso.cruceUbicacion.estado).toBe('Municipio y departamento coinciden');
    component.recalcular();expect(component.registros[0].direccionSisben!.direccion).toBe('CARRERA 30 # 50-60');
    expect(component.registros[0].cruceDireccionSisben.estado).toBe('Dirección diferente');http.verify();
  });
  it('no cuenta recibos duplicados como estudiantes diferentes en la misma vivienda',async()=>{
    await component.cargarExcel(upload([row,{...row,'Número recibo':'OTRO'}]));
    expect(component.registros[0].estudiantesMismaDireccion).toBe(1);
  });
  it('marca respuesta inválida como error y permite reintentar sin reutilizarla',async()=>{
    await component.cargarExcel(upload([row]));const caso=component.registros[0];
    const http=TestBed.inject(HttpTestingController);
    const failed=component.consultarCasoSisben(caso,false);
    http.expectOne(req=>req.url.includes('ConsultarGrupoSisben')).flush({});
    http.expectOne(req=>req.url.includes('ObtenerDatosRUI')).flush({ok:false});
    await failed;expect(caso.estadoConsulta).toBe('Error');expect(caso.sisbenConsultado).toBeUndefined();
    const retry=component.consultarCasoSisben(caso,false);
    http.expectOne(req=>req.url.includes('ConsultarGrupoSisben')).flush({ok:true,grupo:'A1'});
    http.expectOne(req=>req.url.includes('ObtenerDatosRUI')).flush({ok:false});
    await retry;expect(caso.estadoConsulta).toBe('Consultado');http.verify();
  });
  it('Consultar manual vuelve a solicitar datos aunque exista caché',async()=>{
    await component.cargarExcel(upload([row]));const caso=component.registros[0];
    const http=TestBed.inject(HttpTestingController);
    for(const manual of [false,true]){
      const pending=component.consultarCasoSisben(caso,manual);
      http.expectOne(req=>req.url.includes('ConsultarGrupoSisben')).flush({ok:false});
      http.expectOne(req=>req.url.includes('ObtenerDatosRUI')).flush({ok:false});
      await pending;expect(caso.estadoConsulta).toBe('No encontrado');
    }
    http.verify();
  });

});
