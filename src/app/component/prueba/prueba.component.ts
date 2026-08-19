import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as XLSX from 'xlsx';
import * as XLSXStyle from 'xlsx-js-style';
import { debounceTime } from 'rxjs/operators';
import { formatNumber } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ModalTablaComponent } from './modall/modal.component';
import { ModalTablaNuevasComponent } from './modal-tabla/modal-tabla.component';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.scss'],
})
export class PruebaComponent implements OnInit {
  displayedColumns: string[] = [
    'tipo',
    'codigo',
    'nombre',
    'saldoAnterior',
    'debito',
    'credito',
    'nuevoSaldo',
    'tipoSaldoAnterior',
    'tipoSaldoNuevo',
    'tipoDeCuenta',
    'compartidoTipo',
  ];
  reporteActivo: 'balance' | 'chip' | 'resultados' | 'original' | '' = '';
  tablaInicialGuardada: any[] = [];
  reporteChipGuardado: any[] = [];
  datosReporteActual: any[] = [];
  rowColors: any = {};
  contadorAlert = 0;
  corrientes: any = [];
  mostrarTabla3: boolean = false;
  noCorrientes: any = [];
  objSuma: any;
  corrientesNoCorrientes: any = [];
  mostrarNuevos: boolean = false;
  codigosNoexistentes: any = [];
  padres: any = [];
  currentPage = 1;
  pageSize = 100;
  corrientesCopia: any = [];
  seleccionados: any = [];
  filterValue: string = '';
  mostrarTabla: boolean = false;
  dataTareasPaginated: any = [];
  selectAll: boolean = false;
  datosRepetidosCuidoReport: any;
  title = 'herramientaExcel';
  baseInformes: any;
  datosHijosTabla: any;
  titulo: any = '';
  resultados: any = [];
  validartabla = 0;
  cargandoPaginaSpinner: any = '';
  mostrarReporte: any = '';
  mostrarBoton = 0;
  contadormodelo = 18;
  recorrido2 = 0;
  convertedJson!: string;
  fileName = 'tabla.xlsx';
  ejecucion = 0;
  datosTabla: any = [];
  datosTabla2: any = [];
  datosTabla334: any = [];
  datosTabla2Recorrido: any = [];
  seleccionadosNewTable: any = [];
  unicosmodelo = [];
  elementosUnificados: any;
  private filterSubject = new Subject<string>();
  @ViewChild('tabla', { static: false }) tablaFiltro: ElementRef<any> | null;

  modeloDeDatosSistemaContaduria = [
    {
      codigo: '1 ',
      nombre: 'ACTIVOS ',
    },
    {
      codigo: '1.1 ',
      nombre: 'EFECTIVO ',
    },
    {
      codigo: '1.1.05 ',
      nombre: 'CAJA ',
    },
    {
      codigo: '1.1.05.01 ',
      nombre: 'CAJA PRINCIPAL ',
    },
    {
      codigo: '1.1.05.02 ',
      nombre: 'CAJA MENOR ',
    },
    {
      codigo: '1.1.10 ',
      nombre: 'DEPÓSITOS EN INSTITUCIONES FINANCIERAS ',
    },
    {
      codigo: '1.1.10.05 ',
      nombre: 'CUENTA CORRIENTE ',
    },
    {
      codigo: '1.1.10.06 ',
      nombre: 'CUENTA DE AHORRO ',
    },
    {
      codigo: '1.1.32 ',
      nombre: 'efectivo de uso restringido ',
    },
    {
      codigo: '1.2 ',
      nombre: 'INVERSIONES E INSTRUMENTOS DERIVADOS ',
    },
    {
      codigo: '1.2.01 ',
      nombre: 'INVERSIONES ADMINISTRACIÓN DE LIQUIDEZ EN TÍTULOS DE DEUDA ',
    },
    {
      codigo: '1.2.01.01 ',
      nombre: 'TÍTULOS DE TESORERÍA -TES ',
    },
    {
      codigo: '1.2.01.06 ',
      nombre: 'CERTIFICADOS DE DEPÓSITO A TÉRMINO ',
    },
    {
      codigo: '1.2.01.10 ',
      nombre: 'BONOS Y TÍTULOS EMITIDOS POR EL SECTOR PRIVADO ',
    },
    {
      codigo: '1.2.01.42 ',
      nombre: 'BONOS Y TÍTULOS EMITIDOS POR LAS EMPRESAS NO FINANCIERAS ',
    },
    {
      codigo: '1.2.01.43 ',
      nombre: 'BONOS Y TÍTULOS EMITIDOS POR LAS ENTIDADES FINANCIERAS ',
    },
    {
      codigo: '1.2.07 ',
      nombre: 'INVERSIONES PATRIMONIALES EN ENTIDADES NO CONTROLADAS ',
    },
    {
      codigo: '1.2.07.56 ',
      nombre: 'SOCIEDADES PÚBLICAS ',
    },
    {
      codigo: '1.2.16 ',
      nombre: 'INVERSIONES PATRIMONIALES EN ENTIDADES EN LIQUIDACIÓN ',
    },
    {
      codigo: '1.2.21 ',
      nombre: 'INVERSIONES DE ADMINISTRACION DE LIQUIDEZ VALOR',
    },
    {
      codigo: '1.2.21.01 ',
      nombre: 'T侊ULOS DE TESORER褜 (TES)',
    },
    {
      codigo: '1.2.21.03 ',
      nombre: 'BONOS Y T侊ULOS EMITIDOS POR EL SECTOR PRIVADO',
    },
    {
      codigo: '1.2.21.07 ',
      nombre: 'BONOS Y T侊ULOS EMITIDOS POR LAS EMPRESAS NO FINAN',
    },
    {
      codigo: '1.2.21.16 ',
      nombre: 'Carteras colectivas',
    },
    {
      codigo: '1.2.23 ',
      nombre: 'INVERSIONES DE ADMINISTRACION DE LIQUIDEZ COSTO',
    },
    {
      codigo: '1.2.23.02 ',
      nombre: 'CERTIFICADOS DE DEPITO A T餝MINO (CDT)',
    },

    {
      codigo: '1.2.24 ',
      nombre: 'INVERSIONES DE ADMINISTRACION DE LIQUIDEZ AL COSTO',
    },
    {
      codigo: '1.2.24.13 ',
      nombre: 'Acciones ordinarias',
    },
    {
      codigo: '1.2.24.15 ',
      nombre: 'CUOTAS O PARTES DE INTER餞 SOCIAL',
    },
    {
      codigo: '1.2.16.02 ',
      nombre: 'SOCIEDADES DE ECONOMÍA MIXTA ',
    },
    {
      codigo: '1.2.80',
      nombre: ' DETERIORO ACUMULADO DE INVERSIONES (CR)',
    },
    {
      codigo: '1.2.80.42',
      nombre: 'Inversiones de administraci de liquidez al costo',
    },
    {
      codigo: '1.3 ',
      nombre: 'CUENTAS POR COBRAR ',
    },
    {
      codigo: '1.3.17 ',
      nombre: 'PRESTACION DE SERVICIOS ',
    },
    {
      codigo: '1.3.17.01 ',
      nombre: 'SERVICIOS EDUCATIVOS',
    },
    {
      codigo: '1.3.17.90 ',
      nombre: 'OTROS SERVICIOS',
    },
    {
      codigo: '1.3.19 ',
      nombre: 'PRESTACION DE SERVICIOS DE SALUD ',
    },
    {
      codigo: '1.3.19.14 ',
      nombre: 'Servicios de Salud por entidades con r馮imen espec',
    },
    {
      codigo: '1.3.22 ',
      nombre: 'ADMINISTRACION DEL SISTEMA DE SEGURIDAD SOCIAL SSG',
    },
    {
      codigo: '1.3.22.20 ',
      nombre: 'INCAPACIDADES',
    },
    {
      codigo: '1.3.24',
      nombre: 'SUBVENCIONES POR COBRAR',
    },
    {
      codigo: '1.3.37',
      nombre: 'TRANSFERENCIAS POR COBRAR',
    },
    {
      codigo: '1.3.37.12',
      nombre: 'Otras transferencias',
    },
    {
      codigo: '1.3.84',
      nombre: 'OTRAS CUENTAS X COBRAR',
    },
    {
      codigo: '1.3.84.08',
      nombre: 'CUOTAS PARTES DE PENSIONES',
    },
    {
      codigo: '1.3.84.13',
      nombre: 'DEVOLUCI N IVA PARA ENTIDADES DE EDUCACI N SUPERIO',
    },
    {
      codigo: '1.3.84.90',
      nombre: 'OTRAS CUENTAS POR COBRAR',
    },
    {
      codigo: '1.3.85',
      nombre: 'CUENTAS POR COBRAR DE DEFICIT RECAUDO',
    },
    {
      codigo: '1.3.85.02',
      nombre: 'PRESTACIÓN DE SERVICIOS',
    },
    {
      codigo: '1.3.85.90',
      nombre: 'Otras cuentas por cobrar de dif兤il cobro',
    },
    {
      codigo: '1.3.86',
      nombre: 'DETERIORO ACUMULADO CUENTAS X COBRAR',
    },
    {
      codigo: '1.3.86.02',
      nombre: 'PRESTACI DE SERVICIOS (CR)',
    },
    {
      codigo: '1.3.86.90',
      nombre: 'OTRAS CUENTAS POR COBRAR (CR)',
    },
    {
      codigo: '1.3.90',
      nombre: 'CUENTAS POR COBRAR POR TRANSACCIONES CON CONTRAPRESTACION',
    },
    {
      codigo: '1.4 ',
      nombre: 'DEUDORES ',
    },
    {
      codigo: '1.4.07 ',
      nombre: 'PRESTACIÓN DE SERVICIOS ',
    },
    {
      codigo: '1.4.07.01 ',
      nombre: 'SERVICIOS EDUCATIVOS ',
    },
    {
      codigo: '1.4.07.90 ',
      nombre: 'OTROS SERVICIOS ',
    },
    {
      codigo: '1.4.13 ',
      nombre: 'TRANSFERENCIAS POR COBRAR ',
    },
    {
      codigo: '1.4.13.14 ',
      nombre: 'OTRAS TRANSFERENCIAS ',
    },
    {
      codigo: '1.4.20 ',
      nombre: 'AVANCES Y ANTICIPOS ENTREGADOS ',
    },
    {
      codigo: '1.4.20.12 ',
      nombre: 'ANTICIPO PARA ADQUISICIÓN DE BIENES Y SERVICIOS ',
    },
    {
      codigo: '1.4.22 ',
      nombre: 'ANTICIPOS O SALDOS A FAVOR POR IMPUESTOS Y CONTRIBUCIONES ',
    },
    {
      codigo: '1.4.22.10 ',
      nombre: 'SALDO A FAVOR DE IMPUESTO A LAS VENTAS ',
    },
    {
      codigo: '1.4.25 ',
      nombre: 'DEPÓSITOS ENTREGADOS EN GARANTÍA ',
    },
    {
      codigo: '1.4.25.01 ',
      nombre: 'PARA SERVICIOS ',
    },
    {
      codigo: '1.4.25.03 ',
      nombre: 'DEPÓSITOS JUDICIALES ',
    },
    {
      codigo: '1.4.25.05 ',
      nombre: 'DEPÓSITOS SOBRE CONTRATOS ',
    },
    {
      codigo: '1.4.70 ',
      nombre: 'OTROS DEUDORES ',
    },
    {
      codigo: '1.4.70.08 ',
      nombre: 'CUOTAS PARTES DE PENSIONES ',
    },
    {
      codigo: '1.4.70.13 ',
      nombre: 'EMBARGOS JUDICIALES ',
    },
    {
      codigo: '1.4.70.90 ',
      nombre: 'OTROS DEUDORES ',
    },
    {
      codigo: '1.4.80 ',
      nombre: 'PROVISIÓN PARA DEUDORES (CR) ',
    },
    {
      codigo: '1.4.80.12 ',
      nombre: 'PRESTACIÓN DE SERVICIOS ',
    },
    {
      codigo: '1.4.80.90 ',
      nombre: 'OTROS DEUDORES ',
    },
    {
      codigo: '1.5 ',
      nombre: 'INVENTARIOS ',
    },
    {
      codigo: '1.5.05 ',
      nombre: 'BIENES PRODUCIDOS',
    },
    {
      codigo: '1.5.05.06 ',
      nombre: 'IMPRESOS Y PUBLICACIONES',
    },
    {
      codigo: '1.5.10 ',
      nombre: 'MERCANCÍAS EN EXISTENCIA ',
    },
    {
      codigo: '1.5.10.04 ',
      nombre: 'IMPRESOS Y PUBLICACIONES ',
    },
    {
      codigo: '1.5.10.90',
      nombre: 'OTRAS MERCANC褜S EN EXISTENCIA',
    },
    {
      codigo: '1.5.14 ',
      nombre: 'MATERIALES Y SUMINISTROS ',
    },
    {
      codigo: '1.5.14.03 ',
      nombre: 'MEDICAMENTOS ',
    },
    {
      codigo: '1.5.14.05 ',
      nombre: 'MATERIALES REACTIVOS Y DE LABORATORIO ',
    },
    {
      codigo: '1.5.14.08 ',
      nombre: 'VIVERES Y RANCHO',
    },
    {
      codigo: '1.5.30 ',
      nombre: 'EN PODER DE TERCEROS ',
    },
    {
      codigo: '1.5.30.90 ',
      nombre: 'Otros inventarios en poder de terceros',
    },
    {
      codigo: '1.6 ',
      nombre: 'PROPIEDADES, PLANTA Y EQUIPO ',
    },
    {
      codigo: '1.6.05 ',
      nombre: 'TERRENOS ',
    },
    {
      codigo: '1.6.05.01 ',
      nombre: 'URBANOS ',
    },
    {
      codigo: '1.6.05.02 ',
      nombre: 'RURALES ',
    },
    {
      codigo: '1.6.15 ',
      nombre: 'CONSTRUCCIONES EN CURSO ',
    },
    {
      codigo: '1.6.15.01 ',
      nombre: 'EDIFICACIONES ',
    },
    {
      codigo: '1.6.15.90 ',
      nombre: 'OTRAS CONSTRUCCIONES EN CURSO ',
    },
    {
      codigo: '1.6.20 ',
      nombre: 'MAQUINARIA PLANTA Y EQUIPO EN MONTAJE',
    },
    {
      codigo: '1.6.25 ',
      nombre: 'PROPIEDADES, PLANTA Y EQUIPO EN TRÁNSITO ',
    },
    {
      codigo: '1.6.25.03 ',
      nombre: 'MAQUINARIA Y EQUIPO ',
    },
    {
      codigo: '1.6.25.04 ',
      nombre: 'EQUIPO MÉDICO Y CIENTÍFICO ',
    },
    {
      codigo: '1.6.25.05 ',
      nombre: 'EQUIPOS DE COMUNICACIÓN Y COMPUTACIÓN ',
    },
    {
      codigo: '1.6.25.07 ',
      nombre: 'MUEBLES, ENSERES Y EQUIPO DE OFICINA ',
    },
    {
      codigo: '1.6.25.12 ',
      nombre: 'COMPONENTES DE PROPIEDADES, PLANTA Y EQUIPO ',
    },
    {
      codigo: '1.6.25.90 ',
      nombre: 'OTRAS MAQUINARIAS, PLANTA Y EQUIPO EN TR甎SITO',
    },
    {
      codigo: '1.6.35 ',
      nombre: 'BIENES MUEBLES EN BODEGA',
    },
    {
      codigo: '1.6.40 ',
      nombre: 'EDIFICACIONES ',
    },
    {
      codigo: '1.6.40.01 ',
      nombre: 'EDIFICIOS Y CASAS ',
    },
    {
      codigo: '1.6.40.02 ',
      nombre: 'Oficinas ',
    },
    {
      codigo: '1.6.40.12 ',
      nombre: 'HOTELES, HOSTALES Y PARADORES ',
    },
    {
      codigo: '1.6.40.17 ',
      nombre: 'PARQUEADEROS Y GARAJES ',
    },
    {
      codigo: '1.6.40.19 ',
      nombre: 'INSTALACIONES DEPORTIVAS Y RECREACIONALES ',
    },
     {
      codigo: '1.6.40.24 ',
      nombre: 'TANQUES DE ALMACENAMIENTO',
    },
    {
      codigo: '1.6.40.90 ',
      nombre: 'OTRAS EDIFICACIONES ',
    },
    {
      codigo: '1.6.45 ',
      nombre: 'PLANTAS, DUCTOS Y TÚNELES ',
    },
    {
      codigo: '1.6.45.13 ',
      nombre: 'ACUEDUCTO Y CANALIZACIÓN ',
    },
    {
      codigo: '1.6.50 ',
      nombre: 'REDES, LÍNEAS Y CABLES ',
    },
    {
      codigo: '1.6.50.10 ',
      nombre: 'L匤eas y cables de telecomunicaciones',
    },
    {
      codigo: '1.6.50.90 ',
      nombre: 'OTRAS REDES, LÍNEAS Y CABLES ',
    },
    {
      codigo: '1.6.55 ',
      nombre: 'MAQUINARIA Y EQUIPO ',
    },
    {
      codigo: '1.6.55.90 ',
      nombre: 'OTRA MAQUINARIA Y EQUIPO ',
    },
    {
      codigo: '1.6.60 ',
      nombre: 'EQUIPO MÉDICO Y CIENTÍFICO ',
    },
    {
      codigo: '1.6.60.02 ',
      nombre: 'EQUIPO DE LABORATORIO ',
    },
    {
      codigo: '1.6.60.90 ',
      nombre: 'OTRO EQUIPO MÉDICO Y CIENTÍFICO ',
    },
    {
      codigo: '1.6.65 ',
      nombre: 'MUEBLES, ENSERES Y EQUIPO DE OFICINA ',
    },
    {
      codigo: '1.6.65.01 ',
      nombre: 'MUEBLES Y ENSERES ',
    },
    {
      codigo: '1.6.65.02 ',
      nombre: 'EQUIPO Y MÁQUINA DE OFICINA ',
    },
    {
      codigo: '1.6.65.90 ',
      nombre: 'OTROS MUEBLES, ENSERES Y EQUIPO DE OFICINA ',
    },
    {
      codigo: '1.6.70 ',
      nombre: 'EQUIPOS DE COMUNICACIÓN Y COMPUTACIÓN ',
    },
    {
      codigo: '1.6.70.01 ',
      nombre: 'EQUIPO DE COMUNICACIÓN ',
    },
    {
      codigo: '1.6.70.02 ',
      nombre: 'EQUIPO DE COMPUTACIÓN ',
    },
    {
      codigo: '1.6.75 ',
      nombre: 'EQUIPOS DE TRANSPORTE, TRACCIÓN Y ELEVACIÓN ',
    },
    {
      codigo: '1.6.75.02 ',
      nombre: 'TERRESTRE ',
    },
    {
      codigo: '1.6.81 ',
      nombre: 'BIENES ARTE Y CULTURA ',
    },
    {
      codigo: '1.6.81.01 ',
      nombre: 'Obras de arte ',
    },
    {
      codigo: '1.6.81.07 ',
      nombre: 'Libros y publicaciones de investigaci y consulta ',
    },
    {
      codigo: '1.6.82 ',
      nombre: 'PROPIEDADES DE INVERSIÓN ',
    },
    {
      codigo: '1.6.82.01 ',
      nombre: 'TERRENOS ',
    },
    {
      codigo: '1.6.82.02 ',
      nombre: 'EDIFICACIONES ',
    },
    {
      codigo: '1.6.82.90 ',
      nombre: 'OTRAS PROPIEDADES DE INVERSIÓN ',
    },
    {
      codigo: '1.6.85 ',
      nombre: 'DEPRECIACIÓN ACUMULADA (CR) ',
    },
    {
      codigo: '1.6.85.01 ',
      nombre: 'EDIFICACIONES ',
    },
    {
      codigo: '1.6.85.02 ',
      nombre: 'PLANTAS, DUCTOS Y TÚNELES ',
    },
    {
      codigo: '1.6.85.03 ',
      nombre: 'REDES, LÍNEAS Y CABLES ',
    },
    {
      codigo: '1.6.85.04 ',
      nombre: 'MAQUINARIA Y EQUIPO ',
    },
    {
      codigo: '1.6.85.05 ',
      nombre: 'EQUIPO MÉDICO Y CIENTÍFICO ',
    },
    {
      codigo: '1.6.85.06 ',
      nombre: 'MUEBLES, ENSERES Y EQUIPO DE OFICINA ',
    },
    {
      codigo: '1.6.85.07 ',
      nombre: 'EQUIPOS DE COMUNICACIÓN Y COMPUTACIÓN ',
    },
    {
      codigo: '1.6.85.08 ',
      nombre: 'EQUIPOS DE TRANSPORTE, TRACCIÓN Y ELEVACIÓN ',
    },
    {
      codigo: '1.6.85.12 ',
      nombre: 'BIENES DE ARTE Y CULTURA (CR)',
    },
    {
      codigo: '1.6.95 ',
      nombre: 'DETERIORO ACUMULADO PLANTA PP EQUIPO',
    },
    {
      codigo: '1.6.95.01 ',
      nombre: 'Terrenos',
    },
    {
      codigo: '1.7 ',
      nombre: 'BIENES DE USO PÚBLICO E HISTÓRICOS Y CULTURALES ',
    },
    {
      codigo: '1.7.10 ',
      nombre: 'BIENES DE USO PUBLICO EN SERVICIO',
    },
    {
      codigo: '1.7.10.01 ',
      nombre: 'RED CARRETERA',
    },
    {
      codigo: '1.7.15 ',
      nombre: 'BIENES HISTÓRICOS Y CULTURALES ',
    },
    {
      codigo: '1.7.15.07 ',
      nombre: 'EDIFICACIONES ',
    },
    {
      codigo: '1.7.15.90 ',
      nombre: 'Otros bienes histicos y culturales ',
    },
    {
      codigo: '1.9 ',
      nombre: 'OTROS ACTIVOS ',
    },
    {
      codigo: '1.9.01 ',
      nombre: 'RESERVA FINANCIERA ACTUARIAL ',
    },
    {
      codigo: '1.9.02 ',
      nombre: 'PLAN DE ACTIVOS PARA BENEFICIOS DE LOS EMPLEADOS',
    },
    {
      codigo: '1.9.02.04 ',
      nombre: 'Encargos fiduciarios',
    },
    {
      codigo: '1.9.04 ',
      nombre: 'PLAN DE ACTIVOS PARA BENEFICIOS POST EMPLEADOS',
    },
    {
      codigo: '1.9.04.04 ',
      nombre: 'ENCARGOS FIDUCIARIOS',
    },
    {
      codigo: '1.9.04.12 ',
      nombre: 'CUENTAS POR COBRAR',
    },
    {
      codigo: '1.9.01.02 ',
      nombre: 'RECURSOS ENTREGADOS EN ADMINISTRACIÓN ',
    },
    {
      codigo: '1.9.05 ',
      nombre: 'BIENES Y SERVICIOS PAGADOS POR ANTICIPADO ',
    },
    {
      codigo: '1.9.05.01 ',
      nombre: 'SEGUROS ',
    },
    {
      codigo: '1.9.05.05 ',
      nombre: 'IMPRESOS, PUBLICACIONES, SUSCRIPCIONES Y AFILIACIONES ',
    },
    {
      codigo: '1.9.05.15 ',
      nombre: 'Otros beneficios a los empleados',
    },
    {
      codigo: '1.9.05.90 ',
      nombre: 'OTROS BIENES Y SERVICIOS PAGADOS POR ANTICIPADO ',
    },
    {
      codigo: '1.9.06 ',
      nombre: 'AVANCES Y ANTICIPOS ENTREGADOS',
    },
    {
      codigo: '1.9.06.04 ',
      nombre: 'Anticipo para adquisici de bienes y servicios',
    },
    {
      codigo: '1.9.08 ',
      nombre: 'RECURSOS ENTREGADOS EN LA ADMINISTRACION',
    },
    {
      codigo: '1.9.08.03 ',
      nombre: 'Encargo fiduciario  Fiducia de administraci',
    },
    {
      codigo: '1.9.09',
      nombre: 'DEPOSITOS ENTREGADOS EN GARANTIA',
    },
    {
      codigo: '1.9.09.03',
      nombre: 'Depitos judiciales',
    },
    {
      codigo: '1.9.10 ',
      nombre: 'CARGOS DIFERIDOS ',
    },
    {
      codigo: '1.9.10.23 ',
      nombre: 'CAPACITACIÓN, BIENESTAR SOCIAL Y ESTÍMULOS ',
    },
    {
      codigo: '1.9.15 ',
      nombre: 'OBRAS Y MEJORAS EN PROPIEDAD AJENA ',
    },
    {
      codigo: '1.9.15.90 ',
      nombre: 'OTRAS OBRAS Y MEJORAS EN PROPIEDAD AJENA ',
    },
    {
      codigo: '1.9.26 ',
      nombre: 'DERECHOS EN FIDEICOMISO ',
    },
    {
      codigo: '1.9.26.03 ',
      nombre: 'FIDUCIA MERCANTIL - CONSTITUCIÓN DE PATRIMONIO AUTÓNOMO ',
    },
    {
      codigo: '1.9.60 ',
      nombre: 'BIENES DE ARTE Y CULTURA ',
    },
    {
      codigo: '1.9.51 ',
      nombre: 'PROPIEDADES DE INVERSION',
    },
    {
      codigo: '1.9.51.01 ',
      nombre: 'Terrenos',
    },
    {
      codigo: '1.9.51.02 ',
      nombre: 'Edificaciones',
    },
    {
      codigo: '1.9.52',
      nombre: 'DEPRECIACION ACUMULADA DE PROPIEDAD INVERSION',
    },
    {
      codigo: '1.9.52.01',
      nombre: 'Edificaciones',
    },
    {
      codigo: '1.9.60.01 ',
      nombre: 'OBRAS DE ARTE ',
    },
    {
      codigo: '1.9.60.07 ',
      nombre: 'LIBROS Y PUBLICACIONES DE INVESTIGACIÓN Y CONSULTA ',
    },
    {
      codigo: '1.9.07 ',
      nombre: 'INTANGIBLES ',
    },
    {
      codigo: '1.9.70 ',
      nombre: 'INTANGIBLES ',
    },
    {
      codigo: '1.9.70.03 ',
      nombre: 'Patentes ',
    },
    {
      codigo: '1.9.70.02 ',
      nombre: 'MARCAS ',
    },
    {
      codigo: '1.9.70.08 ',
      nombre: 'SOFTWARE ',
    },
    {
      codigo: '1.9.75 ',
      nombre: 'AMORTIZACIÓN ACUMULADA DE INTANGIBLES (CR) ',
    },
    {
      codigo: ' 1.9.75.03',
      nombre: 'AMORTIZACIÓN ACUMULADA DE INTANGIBLES (CR) ',
    },

    {
      codigo: '1.9.75.08 ',
      nombre: 'SOFTWARE ',
    },
    {
      codigo: '1.9.86 ',
      nombre: 'COBERTURA A 12 MESES ',
    },
    {
      codigo: '1.9.86.09 ',
      nombre: 'SEGUROS CON COBERTURA MAYOR A DOCE MESES',
    },
    {
      codigo: '1.9.99 ',
      nombre: 'VALORIZACIONES ',
    },
    {
      codigo: '1.9.99.52 ',
      nombre: 'TERRENOS ',
    },
    {
      codigo: '1.9.99.62 ',
      nombre: 'EDIFICACIONES ',
    },
    {
      codigo: '2 ',
      nombre: 'PASIVOS ',
    },
    {
      codigo: '2.4 ',
      nombre: 'CUENTAS POR PAGAR ',
    },
    {
      codigo: '2.4.01 ',
      nombre: 'ADQUISICIÓN DE BIENES Y SERVICIOS NACIONALES ',
    },
    {
      codigo: '2.4.07 ',
      nombre: 'RECURSOS A FAVOR DE TERCEROS',
    },
    {
      codigo: '2.4.07.01 ',
      nombre: 'Deducci de impuestos',
    },
    {
      codigo: '2.4.07.03 ',
      nombre: 'Impuestos',
    },
    {
      codigo: '2.4.07.20 ',
      nombre: 'RECAUDOS POR CLASIFICAR ',
    },
    {
      codigo: '2.4.07.22 ',
      nombre: 'Estampillas ',
    },
    {
      codigo: '2.4.07.90 ',
      nombre: 'Otros recaudos a favor de terceros',
    },
    {
      codigo: '2.4.01.01 ',
      nombre: 'BIENES Y SERVICIOS ',
    },
    {
      codigo: '2.4.17 ',
      nombre: '',
    },
    {
      codigo: '2.4.25 ',
      nombre: 'ACREEDORES ',
    },
    {
      codigo: '2.4.24 ',
      nombre: 'DESCUENTOS NOMINA ',
    },
    {
      codigo: '2.4.24.01 ',
      nombre: 'Aportes a fondos pensionales',
    },
    {
      codigo: '2.4.24.02 ',
      nombre: 'Aportes a seguridad social en salud',
    },
    {
      codigo: '2.4.24.04 ',
      nombre: 'Sindicatos ',
    },
    {
      codigo: '2.4.24.05 ',
      nombre: 'Cooperativas',
    },
    {
      codigo: '2.4.24.06 ',
      nombre: 'Fondos de empleados ',
    },
    {
      codigo: '2.4.24.07 ',
      nombre: 'Libranzas ',
    },
    {
      codigo: '2.4.24.11 ',
      nombre: 'Embargos judiciales ',
    },
    {
      codigo: '2.4.25.04 ',
      nombre: 'SERVICIOS PÚBLICOS ',
    },
    {
      codigo: '2.4.25.06 ',
      nombre: 'SUSCRIPCIONES ',
    },
    {
      codigo: '2.4.25.07 ',
      nombre: 'ARRENDAMIENTOS ',
    },
    {
      codigo: '2.4.25.08 ',
      nombre: 'VIÁTICOS Y GASTOS DE VIAJE ',
    },
    {
      codigo: '2.4.25.10 ',
      nombre: 'SEGUROS ',
    },
    {
      codigo: '2.4.25.18 ',
      nombre: 'APORTES A FONDOS  PENSIONALES ',
    },
    {
      codigo: '2.4.25.19 ',
      nombre: 'APORTES A SEGURIDAD SOCIAL EN SALUD ',
    },
    {
      codigo: '2.4.25.20 ',
      nombre: 'APORTES AL ICBF, SENA Y CAJAS DE COMPENSACIÓN ',
    },
    {
      codigo: '2.4.25.21 ',
      nombre: 'SINDICATOS ',
    },
    {
      codigo: '2.4.25.22 ',
      nombre: 'COOPERATIVAS ',
    },
    {
      codigo: '2.4.25.23 ',
      nombre: 'FONDOS DE EMPLEADOS ',
    },
    {
      codigo: '2.4.25.24 ',
      nombre: 'EMBARGOS JUDICIALES ',
    },
    {
      codigo: '2.4.25.32 ',
      nombre: 'APORTE RIESGOS PROFESIONALES ',
    },
    {
      codigo: '2.4.25.35 ',
      nombre: 'LIBRANZAS ',
    },
    {
      codigo: '2.4.25.52 ',
      nombre: 'HONORARIOS ',
    },
    {
      codigo: '2.4.25.53 ',
      nombre: 'SERVICIOS ',
    },
    {
      codigo: '2.4.25.90 ',
      nombre: 'OTROS ACREEDORES ',
    },
    {
      codigo: '2.4.36 ',
      nombre: 'RETENCIÓN EN LA FUENTE E IMPUESTO DE TIMBRE ',
    },
    {
      codigo: '2.4.36.03 ',
      nombre: 'HONORARIOS ',
    },
    {
      codigo: '2.4.36.05 ',
      nombre: 'SERVICIOS ',
    },
    {
      codigo: '2.4.36.06 ',
      nombre: 'ARRENDAMIENTOS ',
    },
    {
      codigo: '2.4.36.08 ',
      nombre: 'COMPRAS ',
    },
    {
      codigo: '2.4.36.15 ',
      nombre: 'A EMPLEADOS ARTÍCULO 383 ET ',
    },
    {
      codigo: '2.4.36.16 ',
      nombre: 'A EMPLEADOS ARTÍCULO 384 ET ',
    },
    {
      codigo: '2.4.36.25 ',
      nombre: 'IMPUESTO A LAS VENTAS RETENIDO POR CONSIGNAR ',
    },
    {
      codigo: '2.4.36.26 ',
      nombre: 'CONTRATOS DE OBRA ',
    },
    {
      codigo: '2.4.36.27 ',
      nombre: 'RETENCIÓN DE IMPUESTO DE INDUSTRIA Y COMERCIO POR COMPRAS ',
    },
    {
      codigo: '2.4.36.90 ',
      nombre: 'OTRAS RETENCIONES ',
    },
    {
      codigo: '2.4.36.98 ',
      nombre: 'Impuesto de timbre',
    },
    {
      codigo: '2.4.40 ',
      nombre: 'IMPUESTOS, CONTRIBUCIONES Y TASAS POR PAGAR ',
    },
    {
      codigo: '2.4.40.03 ',
      nombre: 'IMPUESTO PREDIAL UNIFICADO ',
    },
    {
      codigo: '2.4.40.16 ',
      nombre: 'IMPUESTO SOBRE VEHÍCULOS AUTOMOTORES ',
    },
    {
      codigo: '2.4.40.23 ',
      nombre: 'CONTRIBUCIONES ',
    },
    {
      codigo: '2.4.40.75 ',
      nombre: 'OTROS IMPUESTOS NACIONALES ',
    },
    {
      codigo: '2.4.50 ',
      nombre: 'AVANCES Y ANTICIPOS RECIBIDOS ',
    },
    {
      codigo: '2.4.50.01 ',
      nombre: 'ANTICIPOS SOBRE VENTAS DE BIENES Y SERVICIOS ',
    },
    {
      codigo: '2.4.50.02 ',
      nombre: 'ANTICIPOS SOBRE PROYECTOS DE INVERSIÓN ',
    },
    {
      codigo: '2.4.50.90 ',
      nombre: 'OTROS AVANCES Y ANTICIPOS ',
    },
    {
      codigo: '2.4.53 ',
      nombre: 'RECURSOS RECIBIDOS EN ADMINISTRACIÓN ',
    },
    {
      codigo: '2.4.53.01 ',
      nombre: 'EN ADMINISTRACIÓN ',
    },
    {
      codigo: '2.4.55 ',
      nombre: 'DEPÓSITOS RECIBIDOS EN GARANTÍA ',
    },
    {
      codigo: '2.4.55.90 ',
      nombre: 'OTROS DEPÓSITOS ',
    },
    {
      codigo: '2.4.60 ',
      nombre: 'CRÉDITOS JUDICIALES ',
    },
    {
      codigo: '2.4.60.02 ',
      nombre: 'SENTENCIAS ',
    },
    {
      codigo: '2.4.81',
      nombre: 'Incapacidades',
    },
    {
      codigo: '2.4.81.06',
      nombre: 'Incapacidades  Contributivo',
    },
    {
      codigo: '2.4.90 ',
      nombre: ' ',
    },
    {
      codigo: '2.4.90.26 ',
      nombre: ' Suscripciones',
    },
    {
      codigo: '2.4.90.27 ',
      nombre: 'Vi疸icos y gastos de viaje ',
    },
    {
      codigo: '2.4.90.28 ',
      nombre: 'Seguros ',
    },
    {
      codigo: '2.4.90.50 ',
      nombre: ' Aportes al ICBF y SENA',
    },
    {
      codigo: '2.4.90.51 ',
      nombre: ' Servicios p炻licos',
    },
    {
      codigo: '2.4.90.54 ',
      nombre: ' Honorarios',
    },
    {
      codigo: '2.4.90.55 ',
      nombre: 'Servicios ',
    },
    {
      codigo: '2.4.90.58 ',
      nombre: ' Arrendamiento operativo',
    },
    {
      codigo: '2.4.90.90 ',
      nombre: ' OTRAS CUENTAS POR PAGAR',
    },
    {
      codigo: '2.5 ',
      nombre: 'OBLIGACIONES LABORALES Y DE SEGURIDAD SOCIAL INTEGRAL ',
    },
    {
      codigo: '2.5.05 ',
      nombre: 'SALARIOS Y PRESTACIONES SOCIALES ',
    },
    {
      codigo: '2.5.05.01 ',
      nombre: 'NÓMINA POR PAGAR ',
    },
    {
      codigo: '2.5.05.02 ',
      nombre: 'CESANTÍAS ',
    },
    {
      codigo: '2.5.05.03 ',
      nombre: 'INTERESES SOBRE CESANTÍAS ',
    },
    {
      codigo: '2.5.05.04 ',
      nombre: 'VACACIONES ',
    },
    {
      codigo: '2.5.05.05 ',
      nombre: 'PRIMA DE VACACIONES ',
    },
    {
      codigo: '2.5.05.06 ',
      nombre: 'PRIMA DE SERVICIOS ',
    },
    {
      codigo: '2.5.05.07 ',
      nombre: 'PRIMA DE NAVIDAD ',
    },
    {
      codigo: '2.5.05.09 ',
      nombre: 'LICENCIAS ',
    },
    {
      codigo: '2.5.05.12 ',
      nombre: 'BONIFICACIONES ',
    },
    {
      codigo: '2.5.05.15 ',
      nombre: 'OTRAS PRIMAS ',
    },
    {
      codigo: '2.5.05.90 ',
      nombre: 'OTROS SALARIOS Y PRESTACIONES SOCIALES ',
    },
    {
      codigo: '2.5.10 ',
      nombre: 'PENSIONES Y PRESTACIONES ECONÓMICAS POR PAGAR ',
    },
    {
      codigo: '2.5.11 ',
      nombre: 'BENEFICIOS A LOS EMPLEADOS A CORTO PLAZO',
    },
    {
      codigo: '2.5.11.01 ',
      nombre: 'Nina por pagar',
    },
    {
      codigo: '2.5.11.02 ',
      nombre: 'Cesant僘s',
    },
    {
      codigo: '2.5.11.03 ',
      nombre: 'Intereses sobre cesant僘s',
    },
    {
      codigo: '2.5.11.06 ',
      nombre: 'Prima de servicios',
    },
    {
      codigo: '2.5.11.09 ',
      nombre: 'Bonificaciones',
    },
    {
      codigo: '2.5.11.10 ',
      nombre: 'Otras primas',
    },
    {
      codigo: '2.5.11.11 ',
      nombre: 'Aportes a riesgos laborales',
    },
    {
      codigo: '2.5.11.22 ',
      nombre: 'Aportes a fondos pensionales  empleador',
    },
    {
      codigo: '2.5.11.23 ',
      nombre: 'Aportes a seguridad social en salud  empleador',
    },
    {
      codigo: '2.5.11.90 ',
      nombre: 'Otros beneficios a los empleados a corto plazo',
    },
    {
      codigo: '2.5.12 ',
      nombre: 'BENEFICIOS A LOS EMPLEADOS A LARGO PLAZO',
    },
    {
      codigo: '2.5.12.90 ',
      nombre: 'OTROS BENEFICIOS A LOS EMPLEADOS A LARGO PLAZO',
    },
    {
      codigo: '2.5.14 ',
      nombre: 'BENEFICIOS POS EMPLEO PENSIONES',
    },
    {
      codigo: '2.5.14.01 ',
      nombre: 'Pensiones de jubilaci patronales',
    },
    {
      codigo: '2.5.14.05 ',
      nombre: 'Cuotas partes de pensiones',
    },
    {
      codigo: '2.5.14.10 ',
      nombre: 'C疝culo actuarial de pensiones actuales',
    },
    {
      codigo: '2.5.14.14 ',
      nombre: 'C疝culo actuarial de cuotas partes de pensiones',
    },
    {
      codigo: '2.5.10.01 ',
      nombre: 'PENSIONES DE JUBILACIÓN PATRONALES ',
    },
    {
      codigo: '2.5.10.06 ',
      nombre: 'CUOTAS PARTES DE PENSIONES ',
    },
    {
      codigo: '2.6 ',
      nombre: 'OTROS BONOS Y TÍTULOS EMITIDOS ',
    },
    {
      codigo: '2.6.25 ',
      nombre: 'BONOS PENSIONALES ',
    },
    {
      codigo: '2.6.25.01 ',
      nombre: 'CUOTAS PARTES DE BONOS PENSIONALES EMITIDOS ',
    },
    {
      codigo: '2.7 ',
      nombre: 'PASIVOS ESTIMADOS ',
    },
    {
      codigo: '2.7.01 ',
      nombre: 'LITIGIOS Y DEMANDAS',
    },
    {
      codigo: '2.7.01.90 ',
      nombre: 'Otros litigios y demandas',
    },
    {
      codigo: '2.7.10 ',
      nombre: 'PROVISIÓN PARA CONTINGENCIAS ',
    },
    {
      codigo: '2.7.10.05 ',
      nombre: 'LITIGIOS ',
    },
    {
      codigo: '2.7.15 ',
      nombre: 'PROVISIÓN PARA PRESTACIONES SOCIALES ',
    },
    {
      codigo: '2.7.15.01 ',
      nombre: 'CESANTÍAS ',
    },
    {
      codigo: '2.7.15.02 ',
      nombre: 'INTERESES SOBRE CESANTÍAS ',
    },
    {
      codigo: '2.7.15.04 ',
      nombre: 'PRIMA DE SERVICIOS ',
    },
    {
      codigo: '2.7.15.06 ',
      nombre: 'PRIMA DE VACACIONES ',
    },
    {
      codigo: '2.7.15.09 ',
      nombre: 'PRIMA DE NAVIDAD ',
    },
    {
      codigo: '2.7.15.12 ',
      nombre: 'OTRAS PRIMAS ',
    },
    {
      codigo: '2.7.20 ',
      nombre: 'PROVISIÓN PARA PENSIONES ',
    },
    {
      codigo: '2.7.90 ',
      nombre: 'PROVISIÓNES DIVERSAS ',
    },
    {
      codigo: '2.7.90.90 ',
      nombre: 'Otras provisiones diversas ',
    },
    {
      codigo: '2.7.20.03 ',
      nombre: 'CÁLCULO ACTUARIAL DE PENSIONES ACTUALES ',
    },
    {
      codigo: '2.7.21 ',
      nombre: 'PROVISIÓN PARA BONOS PENSIONALES ',
    },
    {
      codigo: '2.7.21.01 ',
      nombre: 'LIQUIDACIÓN PROVISIONAL DE CUOTAS PARTES DE BONOS PENSIONALES ',
    },
    {
      codigo: '2.9 ',
      nombre: 'OTROS PASIVOS ',
    },
    {
      codigo: '2.9.02 ',
      nombre: 'RECURSOS RECIBIDOS EN ADMINISTRACION ',
    },
    {
      codigo: '2.9.02.01 ',
      nombre: 'En administraci',
    },
    {
      codigo: '2.9.90 ',
      nombre: 'OTROS PASIVOS DIFERIDOS',
    },
    {
      codigo: '2.9.90.02 ',
      nombre: 'Ingreso diferido por transferencias condicionadas',
    },
    {
      codigo: '2.9.10 ',
      nombre: 'INGRESOS RECIBIDOS POR ANTICIPADO ',
    },
    {
      codigo: '2.9.10.05 ',
      nombre: 'ARRENDAMIENTOS ',
    },
    {
      codigo: '2.9.10.07 ',
      nombre: 'VENTAS ',
    },
    {
      codigo: '2.9.10.26 ',
      nombre: 'Servicios educativos ',
    },
    {
      codigo: '2.9.10.90 ',
      nombre: 'OTROS INGRESOS RECIBIDOS POR ANTICIPADO ',
    },
    {
      codigo: '3 ',
      nombre: 'PATRIMONIO ',
    },
    {
      codigo: '3.1 ',
      nombre: 'PATRIMONIO ',
    },
    {
      codigo: '3.1.05 ',
      nombre: 'CAPITAL FISCAL ',
    },
    {
      codigo: '3.1.05.06 ',
      nombre: 'Capital Fiscal ',
    },
    {
      codigo: '3.1.09 ',
      nombre: 'RESULTADO DEL EJERCICIO ANTERIOR ',
    },
    {
      codigo: '3.1.09.01 ',
      nombre: 'EXCEDENTES ACUMULADOS',
    },
    {
      codigo: '3.1.10 ',
      nombre: 'RESULTADO DEL EJERCICIO',
    },
      {
      codigo: '3.1.10.01 ',
      nombre: 'UTILIDAD O EXCEDENTE DEL EJERCICIO ',
    },
    {
      codigo: '3.1.45 ',
      nombre: 'IMPACTO POR TRANSICION',
    },
    {
      codigo: '3.1.51 ',
      nombre: 'GANANCIAS GP POR PLANOS DE BENEFICIO',
    },
    {
      codigo: '3.1.51.01 ',
      nombre: 'Ganancias o p駻didas actuariales por planes de ben',
    },
    {
      codigo: '3.2 ',
      nombre: 'PATRIMONIO INSTITUCIONAL ',
    },
    {
      codigo: '3.2.08 ',
      nombre: 'CAPITAL FISCAL ',
    },
    {
      codigo: '3.2.08.01 ',
      nombre: 'CAPITAL FISCAL ',
    },
    {
      codigo: '3.2.30 ',
      nombre: 'RESULTADOS DEL EJERCICIO ',
    },
    {
      codigo: '3.2.30.01 ',
      nombre: 'UTILIDAD O EXCEDENTE DEL EJERCICIO ',
    },
    {
      codigo: '3.2.35 ',
      nombre: 'SUPERÁVIT POR DONACIÓN ',
    },
    {
      codigo: '3.2.35.01 ',
      nombre: 'EN DINERO ',
    },
    {
      codigo: '3.2.35.02 ',
      nombre: 'EN ESPECIE ',
    },
    {
      codigo: '3.2.35.03 ',
      nombre: 'EN DERECHOS ',
    },
    {
      codigo: '3.2.40 ',
      nombre: 'SUPERÁVIT POR VALORIZACIÓN ',
    },
    {
      codigo: '3.2.40.52 ',
      nombre: 'TERRENOS ',
    },
    {
      codigo: '3.2.40.62 ',
      nombre: 'EDIFICACIONES ',
    },
    {
      codigo: '3.2.55 ',
      nombre: 'PATRIMONIO INSTITUCIONAL INCORPORADO ',
    },
    {
      codigo: '3.2.55.25 ',
      nombre: 'BIENES ',
    },
    {
      codigo: '3.2.55.26 ',
      nombre: 'DERECHOS ',
    },
    {
      codigo: '4 ',
      nombre: 'INGRESOS ',
    },
    {
      codigo: '4.3 ',
      nombre: 'VENTA DE SERVICIOS ',
    },
    {
      codigo: '4.3.05 ',
      nombre: 'SERVICIOS EDUCATIVOS ',
    },
    {
      codigo: '4.3.05.14 ',
      nombre: 'EDUCACIÓN FORMAL - SUPERIOR FORMACIÓN PROFESIONAL ',
    },
    {
      codigo: '4.3.05.15 ',
      nombre: 'EDUCACIÓN FORMAL- SUPERIOR POSTGRADOS ',
    },
    {
      codigo: '4.3.05.27 ',
      nombre: 'EDUCACIÓN NO FORMAL - FORMACIÓN EXTENSIVA ',
    },
    {
      codigo: '4.3.05.50 ',
      nombre: 'SERVICIOS CONEXOS A LA EDUCACIÓN ',
    },
    {
      codigo: '4.3.11 ',
      nombre: 'ADMINISTRACIÓN DEL SISTEMA DE SEGURIDAD SOCIAL EN SALUD ',
    },
    {
      codigo: '4.3.11.05 ',
      nombre: '',
    },
    {
      codigo: '4.3.11.90 ',
      nombre:
        'OTROS INGRESOS POR LA ADMINISTRACIÓN DEL SISTEMA DE SEGURIDAD SOCIAL EN SALUD ',
    },
    {
      codigo: '4.3.90 ',
      nombre: 'SERVICIOS',
    },
    {
      codigo: '4.3.90.07 ',
      nombre: 'PUBLICIDAD',
    },
    {
      codigo: '4.3.90.90 ',
      nombre: 'PUBLICIDAD',
    },
    {
      codigo: '4.3.95 ',
      nombre: 'DEVOLUCIONES, REBAJAS Y DESCUENTOS EN VENTA DE SERVICIOS (DB) ',
    },
    {
      codigo: '4.3.95.01 ',
      nombre: 'SERVICIOS EDUCATIVOS ',
    },
    {
      codigo: '4.3.95.12',
      nombre: 'Servicios de salud',
    },
    {
      codigo: '4.3.95.90',
      nombre: 'Otros servicios',
    },
    {
      codigo: '4.4 ',
      nombre: 'TRANSFERENCIAS ',
    },
    {
      codigo: '4.4.13 ',
      nombre: 'SISTEMA GENERAL DE REGALÍAS ',
    },
    {
      codigo: '4.4.13.01 ',
      nombre: 'ASIGNACIONES DIRECTAS ',
    },
    {
      codigo: '4.4.28 ',
      nombre: 'OTRAS TRANSFERENCIAS ',
    },
    {
      codigo: '4.4.28.02 ',
      nombre: 'PARA PROYECTOS DE INVERSIÓN ',
    },
    {
      codigo: '4.4.28.03 ',
      nombre: 'PARA GASTOS DE FUNCIONAMIENTO ',
    },
    {
      codigo: '4.4.28.05 ',
      nombre: 'Para programas de educaci',
    },
    {
      codigo: '4.4.28.30 ',
      nombre: 'BIENES,DERECHOS,RECUR.EFECT.PROCED.SECTOR PRIVADO',
    },
    {
      codigo: '4.4.28.90 ',
      nombre: 'Otras transferencias',
    },
    {
      codigo: '4.8 ',
      nombre: 'OTROS INGRESOS ',
    },
    {
      codigo: '4.8.02 ',
      nombre: 'FINANCIEROS ',
    },
    {
      codigo: '4.8.02.01 ',
      nombre: 'FINANCIEROS ',
    },
    {
      codigo: '4.8.02.11 ',
      nombre: 'RENDIM.EFECTIVO INVERS.DE ADMON.DE LIQUID.COSTO AM ',
    },
    {
      codigo: '4.8.02.16 ',
      nombre: 'GCIA.POR VALORAC.INSTRUMENT.DERIV.VR.MCDO.VR.RAZON',
    },
    {
      codigo: '4.8.02.32 ',
      nombre: 'Rendimientos sobre recursos entregados en administ',
    },
    {
      codigo: '4.8.02.90 ',
      nombre: 'Otros ingresos financierost',
    },
    {
      codigo: '4.8.05 ',
      nombre: 'FINANCIEROS ',
    },
    {
      codigo: '4.8.05.04 ',
      nombre: 'INTERESES DE DEUDORES ',
    },
    {
      codigo: '4.8.05.07 ',
      nombre: 'RENDIMIENTO POR REAJUSTE MONETARIO ',
    },
    {
      codigo: '4.8.05.13 ',
      nombre: 'INTERESES DE MORA ',
    },
    {
      codigo: '4.8.05.22 ',
      nombre: 'INTERESES SOBRE DEPÓSITOS EN INSTITUCIONES FINANCIERAS ',
    },
    {
      codigo: '4.8.05.35 ',
      nombre: 'RENDIMIENTOS SOBRE RECURSOS ENTREGADOS EN ADMINISTRACIÓN ',
    },
    {
      codigo: '4.8.05.90 ',
      nombre: 'OTROS INGRESOS FINANCIEROS ',
    },
    {
      codigo: '4.8.08 ',
      nombre: 'OTROS INGRESOS ORDINARIOS ',
    },
    {
      codigo: '4.8.08.02 ',
      nombre: 'VENTA DE PLIEGOS ',
    },
    {
      codigo: '4.8.08.03 ',
      nombre: 'CUOTAS PARTES DE PENSIONES ',
    },
    {
      codigo: '4.8.08.05 ',
      nombre: 'UTILIDAD EN VENTA DE ACTIVOS ',
    },
    {
      codigo: '4.8.08.06 ',
      nombre: 'PUBLICACIONES ',
    },
    {
      codigo: '4.8.08.08 ',
      nombre: 'HONORARIOS ',
    },
    {
      codigo: '4.8.08.17 ',
      nombre: 'ARRENDAMIENTOS ',
    },
    {
      codigo: '4.8.08.19 ',
      nombre: 'DONACIONES ',
    },
    {
      codigo: '4.8.08.25 ',
      nombre: 'SOBRANTES ',
    },
    {
      codigo: '4.8.08.27 ',
      nombre: 'APROVECHAMIENTOS ',
    },
    {
      codigo: '4.8.08.28 ',
      nombre: 'INDEMNIZACIONES',
    },
    {
      codigo: '4.8.08.90',
      nombre: 'Otros ingresos diversos',
    },
    {
      codigo: '4.8.31',
      nombre: 'REVERSION DE PROVISIONES',
    },
    {
      codigo: '4.8.31.01',
      nombre: 'LITIGIOS Y DEMANDAS',
    },
    {
      codigo: '4.8.10 ',
      nombre: 'EXTRAORDINARIOS ',
    },
    {
      codigo: '4.8.10.07 ',
      nombre: 'SOBRANTES ',
    },
    {
      codigo: '4.8.10.08 ',
      nombre: 'RECUPERACIONES ',
    },
    {
      codigo: '4.8.10.47 ',
      nombre: 'APROVECHAMIENTOS ',
    },
    {
      codigo: '4.8.10.49 ',
      nombre: 'INDEMNIZACIONES ',
    },
    {
      codigo: '4.8.10.90 ',
      nombre: 'OTROS INGRESOS EXTRAORDINARIOS ',
    },
    {
      codigo: '4.8.15 ',
      nombre: 'AJUSTE DE EJERCICIOS ANTERIORES ',
    },
    {
      codigo: '4.8.15.57 ',
      nombre: 'TRANSFERENCIAS ',
    },
    {
      codigo: '4.8.15.59 ',
      nombre: 'OTROS INGRESOS ',
    },
    {
      codigo: '5 ',
      nombre: 'GASTOS ',
    },
    {
      codigo: '5.1 ',
      nombre: 'DE ADMINISTRACIÓN ',
    },
    {
      codigo: '5.1.01 ',
      nombre: 'SUELDOS Y SALARIOS ',
    },
    {
      codigo: '5.1.01.01 ',
      nombre: 'SUELDOS DEL PERSONAL ',
    },
    {
      codigo: '5.1.01.03 ',
      nombre: 'HORAS EXTRAS Y FESTIVOS ',
    },
    {
      codigo: '5.1.01.05 ',
      nombre: 'GASTOS DE REPRESENTACIÓN ',
    },
    {
      codigo: '5.1.01.10 ',
      nombre: 'Prima t馗nica',
    },
    {
      codigo: '5.1.01.06 ',
      nombre: 'REMUNERACIÓN SERVICIOS TÉCNICOS ',
    },
    {
      codigo: '5.1.01.09 ',
      nombre: 'HONORARIOS ',
    },
    {
      codigo: '5.1.01.13 ',
      nombre: 'PRIMA DE VACACIONES ',
    },
    {
      codigo: '5.1.01.14 ',
      nombre: 'PRIMA DE NAVIDAD ',
    },
    {
      codigo: '5.1.01.17 ',
      nombre: 'VACACIONES ',
    },
    {
      codigo: '5.1.01.19 ',
      nombre: 'BONIFICACIONES ',
    },
    {
      codigo: '5.1.01.23 ',
      nombre: 'AUXILIO DE TRANSPORTE ',
    },
    {
      codigo: '5.1.01.24 ',
      nombre: 'CESANTÍAS ',
    },
    {
      codigo: '5.1.01.25 ',
      nombre: 'INTERESES A LAS CESANTÍAS ',
    },
    {
      codigo: '5.1.01.30 ',
      nombre: 'CAPACITACIÓN, BIENESTAR SOCIAL Y ESTÍMULOS ',
    },
    {
      codigo: '5.1.01.31 ',
      nombre: 'DOTACIÓN Y SUMINISTRO A TRABAJADORES ',
    },
    {
      codigo: '5.1.01.33 ',
      nombre: 'GASTOS DEPORTIVOS Y DE RECREACIÓN ',
    },
    {
      codigo: '5.1.01.47 ',
      nombre: 'VIÁTICOS ',
    },
    {
      codigo: '5.1.01.48 ',
      nombre: 'GASTOS DE VIAJE ',
    },
    {
      codigo: '5.1.01.50 ',
      nombre: 'BONIFICACIÓN POR SERVICIOS PRESTADOS ',
    },
    {
      codigo: '5.1.01.52 ',
      nombre: 'PRIMA DE SERVICIOS ',
    },
    {
      codigo: '5.1.01.60 ',
      nombre: 'SUBSIDIO DE ALIMENTACIÓN ',
    },
    {
      codigo: '5.1.01.64 ',
      nombre: 'OTRAS PRIMAS ',
    },
    {
      codigo: '5.1.01.90 ',
      nombre: 'OTROS SUELDOS Y SALARIOS ',
    },
    {
      codigo: '5.1.02 ',
      nombre: 'CONTRIBUCIONES IMPUTADAS ',
    },
    {
      codigo: '5.1.02.01 ',
      nombre: 'INCAPACIDADES ',
    },
    {
      codigo: '5.1.02.02 ',
      nombre: 'SUBSIDIO FAMILIAR ',
    },
    {
      codigo: '5.1.02.07 ',
      nombre: 'CUOTAS PARTES DE PENSIONES ',
    },
    {
      codigo: '5.1.02.90 ',
      nombre: 'OTRAS CONTRIBUCIONES IMPUTADAS ',
    },
    {
      codigo: '5.1.03 ',
      nombre: 'CONTRIBUCIONES EFECTIVAS ',
    },
    {
      codigo: '5.1.03.03 ',
      nombre: 'COTIZACIONES A SEGURIDAD SOCIAL EN SALUD ',
    },
    {
      codigo: '5.1.03.04 ',
      nombre: 'APORTES SINDICALES ',
    },
    {
      codigo: '5.1.03.05 ',
      nombre: 'COTIZACIONES A RIESGOS PROFESIONALES ',
    },
    {
      codigo: '5.1.03.06 ',
      nombre:
        'COTIZACIONES A ENTIDADES ADMINISTRADORAS DEL RÉGIMEN DE PRIMA MEDIA ',
    },
    {
      codigo: '5.1.03.07 ',
      nombre:
        'COTIZACIONES A ENTIDADES ADMINISTRADORAS DEL RÉGIMEN DE AHORRO INDIVIDUAL ',
    },
    {
      codigo: '5.1.03.90 ',
      nombre: 'OTRAS CONTRIBUCIONES EFECTIVAS ',
    },
    {
      codigo: '5.1.04 ',
      nombre: 'APORTES SOBRE LA NÓMINA ',
    },
    {
      codigo: '5.1.04.01 ',
      nombre: 'APORTES AL ICBF ',
    },
    {
      codigo: '5.1.11 ',
      nombre: 'GENERALES ',
    },
    {
      codigo: '5.1.07 ',
      nombre: 'PRESTACIONES SOCIALES ',
    },
    {
      codigo: '5.1.07.01 ',
      nombre: 'vacaciones ',
    },
    {
      codigo: '5.1.07.02 ',
      nombre: 'CESANTIAS ',
    },
    {
      codigo: '5.1.07.03 ',
      nombre: 'INTERESES DE LAS CESANTIAS ',
    },
    {
      codigo: '5.1.07.04 ',
      nombre: 'PRIMA DE VACACIONES ',
    },
    {
      codigo: '5.1.07.05 ',
      nombre: 'PRIMA DE NAVIDAD',
    },
    {
      codigo: '5.1.07.06',
      nombre: 'PRIMA DE SERVICIOS',
    },
    {
      codigo: '5.1.07.90',
      nombre: 'Otras primas',
    },
    {
      codigo: '5.1.08 ',
      nombre: 'GASTOS DE PERSONAL DIVERSOS ',
    },
    {
      codigo: '5.1.08.01 ',
      nombre: 'renumeracion por servicios tecnicos',
    },
    {
      codigo: '5.1.08.03 ',
      nombre: 'capacitacion bienestar social',
    },
    {
      codigo: '5.1.08.04 ',
      nombre: 'dotacion y suministro a trabajadores',
    },
    {
      codigo: '5.1.08.05 ',
      nombre: 'gastos deportivos y de recreacion',
    },
    {
      codigo: '5.1.08.07 ',
      nombre: 'gastos de viaje',
    },
    {
      codigo: '5.1.08.10 ',
      nombre: 'gastos de viaje',
    },
    {
      codigo: '5.1.08.90 ',
      nombre: 'otros gastos de personal diversos',
    },

    {
      codigo: '5.1.11.06 ',
      nombre: 'ESTUDIOS Y PROYECTOS ',
    },
    {
      codigo: '5.1.11.11 ',
      nombre: 'COMISIONES, HONORARIOS Y SERVICIOS ',
    },
    {
      codigo: '5.1.11.12 ',
      nombre: 'OBRAS Y MEJORAS EN PROPIEDAD AJENA ',
    },
    {
      codigo: '5.1.11.13 ',
      nombre: 'VIGILANCIA Y SEGURIDAD ',
    },
    {
      codigo: '5.1.11.14 ',
      nombre: 'MATERIALES Y SUMINISTROS ',
    },
    {
      codigo: '5.1.11.15 ',
      nombre: 'MANTENIMIENTO ',
    },
    {
      codigo: '5.1.11.16 ',
      nombre: 'REPARACIONES ',
    },
    {
      codigo: '5.1.11.17 ',
      nombre: 'SERVICIOS PÚBLICOS ',
    },
    {
      codigo: '5.1.11.18 ',
      nombre: 'ARRENDAMIENTO ',
    },
    {
      codigo: '5.1.11.19 ',
      nombre: 'VIÁTICOS Y GASTOS DE VIAJE ',
    },
    {
      codigo: '5.1.11.20 ',
      nombre: 'PUBLICIDAD Y PROPAGANDA ',
    },
    {
      codigo: '5.1.11.21 ',
      nombre: 'IMPRESOS, PUBLICACIONES, SUSCRIPCIONES Y AFILIACIONES ',
    },
    {
      codigo: '5.1.11.22 ',
      nombre: 'FOTOCOPIAS ',
    },
    {
      codigo: '5.1.11.23 ',
      nombre: 'COMUNICACIONES Y TRANSPORTE ',
    },
    {
      codigo: '5.1.11.25 ',
      nombre: 'SEGUROS GENERALES ',
    },
    {
      codigo: '5.1.11.33 ',
      nombre: 'SEGURIDAD INDUSTRIAL ',
    },
    {
      codigo: '5.1.11.36 ',
      nombre: 'IMPLEMENTOS DEPORTIVOS ',
    },
    {
      codigo: '5.1.11.37 ',
      nombre: 'EVENTOS CULTURALES ',
    },
    {
      codigo: '5.1.11.46 ',
      nombre: 'COMBUSTIBLES Y LUBRICANTES ',
    },
    {
      codigo: '5.1.11.49 ',
      nombre: 'SERVICIOS DE ASEO, CAFETERÍA, RESTAURANTE Y LAVANDERÍA ',
    },
    {
      codigo: '5.1.11.55 ',
      nombre: 'ELEMENTOS DE ASEO, LAVANDERÍA Y CAFETERÍA ',
    },
    {
      codigo: '5.1.11.64 ',
      nombre: 'GASTOS LEGALES ',
    },
    {
      codigo: '5.1.11.65 ',
      nombre: 'INTANGIBLES ',
    },
    {
      codigo: '5.1.11.79 ',
      nombre: 'HONORARIOS ',
    },
    {
      codigo: '5.1.11.80 ',
      nombre: 'SERVICIOS ',
    },
    {
      codigo: '5.1.11.90 ',
      nombre: 'OTROS GASTOS GENERALES ',
    },
    {
      codigo: '5.1.20 ',
      nombre: 'IMPUESTOS, CONTRIBUCIONES Y TASAS ',
    },
    {
      codigo: '5.1.20.01 ',
      nombre: 'IMPUESTO PREDIAL UNIFICADO ',
    },
    {
      codigo: '5.1.20.02 ',
      nombre: 'CUOTA DE FISCALIZACIÓN Y AUDITAJE ',
    },
    {
      codigo: '5.1.20.06 ',
      nombre: 'VALORIZACIÓN ',
    },
    {
      codigo: '5.1.20.08 ',
      nombre: 'SANCIONES ',
    },
    {
      codigo: '5.1.20.10 ',
      nombre: 'TASAS ',
    },
    {
      codigo: '5.1.20.11 ',
      nombre: 'IMPUESTO SOBRE VEHÍCULOS AUTOMOTORES ',
    },
    {
      codigo: '5.1.20.12 ',
      nombre: 'IMPUESTO DE REGISTRO ',
    },
    {
      codigo: '5.1.20.24 ',
      nombre: 'GRAVAMEN A LOS MOVIMIENTOS FINANCIEROS ',
    },
    {
      codigo: '5.1.20.26 ',
      nombre: 'CONTRIBUCIONES ',
    },
    {
      codigo: '5.1.20.27 ',
      nombre: 'LICENCIAS ',
    },
    {
      codigo: '5.1.20.90 ',
      nombre: 'OTROS IMPUESTOS ',
    },
    {
      codigo: '5.3 ',
      nombre: 'DETERIORO, DEPRECIACIONES, AMORTIZACIONES Y PROVIS ',
    },
    {
      codigo: '5.3.60 ',
      nombre: 'DEPRECIACIﾓN DE PROPIEDADES, PLANTA Y EQUIPO ',
    },
    {
      codigo: '5.3.60.01 ',
      nombre: 'Edificaciones ',
    },
    {
      codigo: '5.3.60.02 ',
      nombre: 'Plantas, ductos y t佖eles ',
    },
    {
      codigo: '5.3.62 ',
      nombre: 'DEPRECIACIﾓN DE PROPIEDADES DE INVERSIﾓN ',
    },
    {
      codigo: '5.3.62.01 ',
      nombre: 'Edificaciones ',
    },
    {
      codigo: '5.3.68 ',
      nombre: 'Edificaciones ',
    },
    {
      codigo: '5.3.68.03 ',
      nombre: 'Administrativas ',
    },
    {
      codigo: '5.3.68.05 ',
      nombre: 'Laborales ',
    },
    {
      codigo: '5.8 ',
      nombre: 'OTROS GASTOS ',
    },
    {
      codigo: '5.8.02 ',
      nombre: 'COMISIONES ',
    },
    {
      codigo: '5.8.02.37 ',
      nombre: 'COMISIONES SOBRE RECURSOS ENTREGADOS EN ADMINISTRACIÓN ',
    },
    {
      codigo: '5.8.02.38 ',
      nombre: 'COMISIONES Y OTROS GASTOS BANCARIOS ',
    },
    {
      codigo: '5.8.02.40 ',
      nombre: 'COMISIONES Y SERVICIOS FINANCIEROS',
    },
    {
      codigo: '5.8.02.90 ',
      nombre: 'OTRAS COMISIONES ',
    },
    {
      codigo: '5.8.03 ',
      nombre: 'COMISIONES ',
    },
    {
      codigo: '5.8.03.90 ',
      nombre: 'COMISIONES ',
    },
    {
      codigo: '5.8.04 ',
      nombre: 'FINANCIEROS ',
    },
    {
      codigo: '5.8.04.11 ',
      nombre: 'P駻dida por valoraci de inversiones de administr ',
    },
    {
      codigo: '5.8.08 ',
      nombre: 'OTROS GASTOS ORDINARIOS ',
    },
    {
      codigo: '5.8.08.02 ',
      nombre: 'PÉRDIDA EN RETIRO DE ACTIVOS ',
    },
    {
      codigo: '5.8.08.12 ',
      nombre: 'SENTENCIAS ',
    },
    {
      codigo: '5.8.08.90 ',
      nombre: 'OTROS GASTOS ORDINARIOS ',
    },
    {
      codigo: '5.8.10 ',
      nombre: 'EXTRAORDINARIOS ',
    },
    {
      codigo: '5.8.10.06 ',
      nombre: 'PÉRDIDAS EN SINIESTROS ',
    },
    {
      codigo: '5.8.10.90 ',
      nombre: 'OTROS GASTOS EXTRAORDINARIOS ',
    },
    {
      codigo: '5.8.15 ',
      nombre: 'AJUSTE DE EJERCICIOS ANTERIORES ',
    },
    {
      codigo: '5.8.15.88 ',
      nombre: 'GASTOS DE ADMINISTRACIÓN ',
    },
    {
      codigo: '5.8.15.90 ',
      nombre: 'PROVISIONES, DEPRECIACIONES Y AMORTIZACIONES ',
    },
    {
      codigo: '5.8.15.93 ',
      nombre: 'OTROS GASTOS ',
    },
    {
      codigo: '5.8.90 ',
      nombre: 'P駻dida por valoraci de inversiones de administr ',
    },
    {
      codigo: '5.8.90.12 ',
      nombre: 'Sentencias',
    },
    {
      codigo: '5.8.90.19 ',
      nombre: 'P駻dida por baja en cuentas de activos no financie',
    },
    {
      codigo: '5.8.90.90 ',
      nombre: 'Otros gastos diversos',
    },
    {
      codigo: '5.9 ',
      nombre: 'CIERRE DE INGRESOS, GASTOS Y COSTOS ',
    },
    {
      codigo: '5.9.05 ',
      nombre: 'CIERRE DE INGRESOS, GASTOS Y COSTOS',
    },
    {
      codigo: '5.9.05.01 ',
      nombre: 'Cierre de ingresos, gastos y costos',
    },
    {
      codigo: '6 ',
      nombre: 'COSTOS DE VENTAS Y OPERACIÓN ',
    },
    {
      codigo: '6.3 ',
      nombre: 'COSTO DE VENTAS DE SERVICIOS ',
    },
    {
      codigo: '6.3.05 ',
      nombre: 'SERVICIOS EDUCATIVOS ',
    },
    {
      codigo: '6.3.05.08 ',
      nombre: 'EDUCACIÓN FORMAL - SUPERIOR FORMACIÓN PROFESIONAL ',
    },
    {
      codigo: '6.3.05.09 ',
      nombre: 'EDUCACIÓN FORMAL - SUPERIOR POSTGRADO ',
    },
    {
      codigo: '6.3.10 ',
      nombre: 'SERVICIOS DE SALUD ',
    },
    {
      codigo: '6.3.10.01 ',
      nombre: 'Urgencias  Consulta y procedimientos',
    },
    {
      codigo: '6.3.10.15 ',
      nombre: 'SERVICIOS AMBULATORIOS - CONSULTA EXTERNA Y PROCEDIMIENTOS ',
    },
    {
      codigo: '6.3.10.16 ',
      nombre: 'SERVICIOS AMBULATORIOS - CONSULTA ESPECIALIZADA ',
    },
    {
      codigo: '6.3.10.17 ',
      nombre: 'SERVICIOS AMBULATORIOS - ACTIVIDADES DE SALUD ORAL ',
    },
    {
      codigo: '6.3.10.18 ',
      nombre: 'Servicios ambulatorios  Actividades de promoci',
    },
    {
      codigo: '6.3.10.19 ',
      nombre: 'Servicios ambulatorios  Otras actividades extramu',
    },
    {
      codigo: '6.3.10.25 ',
      nombre: 'Hospitalizaci  Estancia general',
    },
    {
      codigo: '6.3.10.29 ',
      nombre: 'Hospitalizaci  Salud mental',
    },
    {
      codigo: '6.3.10.40 ',
      nombre: 'Apoyo diagntico  Laboratorio cl匤ico',
    },
    {
      codigo: '6.3.10.41 ',
      nombre: 'Apoyo diagntico  Imagenolog僘',
    },
    {
      codigo: '6.3.10.42 ',
      nombre: 'Apoyo diagntico  Anatom僘 patolica',
    },
    {
      codigo: '6.3.10.43 ',
      nombre: 'Apoyo diagntico  Otras unidades de apoyo diagn・',
    },
    {
      codigo: '6.3.10.50 ',
      nombre: 'APOYO TERAPÉUTICO - REHABILITACIÓN Y TERAPIAS ',
    },
    {
      codigo: '6.3.10.53 ',
      nombre: 'Apoyo terap騏tico  Unidad renal',
    },
    {
      codigo: '6.3.10.56 ',
      nombre: 'APOYO TERAPÉUTICO - REHABILITACIÓN Y TERAPIAS ',
    },
    {
      codigo: '6.3.10.67 ',
      nombre: 'SERVICIOS CONEXOS A LA SALUD OTROS SERVICIOS ',
    },
    {
      codigo: '7 ',
      nombre: 'COSTOS DE PRODUCCIÓN ',
    },
    {
      codigo: '7.2 ',
      nombre: 'SERVICIOS EDUCATIVOS ',
    },
    {
      codigo: '7.2.08 ',
      nombre: 'EDUCACIÓN FORMAL  SUPERIOR - FORMACIÓN PROFESIONAL ',
    },
    {
      codigo: '7.2.08.02 ',
      nombre: 'GENERALES ',
    },
    {
      codigo: '7.2.08.03 ',
      nombre: 'SUELDOS Y SALARIOS ',
    },
    {
      codigo: '7.2.08.04 ',
      nombre: 'CONTRIBUCIONES IMPUTADAS ',
    },
    {
      codigo: '7.2.08.05 ',
      nombre: 'CONTRIBUCIONES EFECTIVAS ',
    },
    {
      codigo: '7.2.08.06 ',
      nombre: 'APORTES SOBRE LA NÓMINA ',
    },
    {
      codigo: '7.2.08.07 ',
      nombre: 'DEPRECIACIÓN Y AMORTIZACIÓN ',
    },
    {
      codigo: '7.2.08.08 ',
      nombre: 'IMPUESTOS ',
    },
    {
      codigo: '7.2.08.09 ',
      nombre: 'PRESTACIONES SOCIALES ',
    },
    {
      codigo: '7.2.08.10 ',
      nombre: 'REMUNERACION SERVICIOS TECNICOS',
    },
    {
      codigo: '7.2.08.95 ',
      nombre: 'TRASLADO DE COSTOS (CR) ',
    },
    {
      codigo: '7.2.09 ',
      nombre: 'EDUCACIÓN FORMAL - SUPERIOR - POSTGRADO ',
    },
    {
      codigo: '7.2.09.02 ',
      nombre: 'GENERALES ',
    },
    {
      codigo: '7.2.09.03 ',
      nombre: 'SUELDOS Y SALARIOS ',
    },
    {
      codigo: '7.2.09.05 ',
      nombre: 'CONTRIBUCIONES EFECTIVAS ',
    },
    {
      codigo: '7.2.09.08 ',
      nombre: 'IMPUESTOS ',
    },
    {
      codigo: '7.2.09.10 ',
      nombre: 'GASTOS DE PERSONAL DIVERSOS ',
    },
    {
      codigo: '7.2.09.95 ',
      nombre: 'TRASLADO DE COSTOS (CR) ',
    },
    {
      codigo: '7.3 ',
      nombre: 'SERVICIOS DE SALUD ',
    },
    {
      codigo: '7.3.01 ',
      nombre: 'URGENCIAS CONSULTA Y PROCEDIMIENTOS ',
    },
    {
      codigo: '7.3.01.02 ',
      nombre: 'Generales',
    },
    {
      codigo: '7.3.01.04 ',
      nombre: 'Generales',
    },
    {
      codigo: '7.3.01.10 ',
      nombre: 'Gastos de personal diversos',
    },
    {
      codigo: '7.3.01.95 ',
      nombre: 'Traslado de costos (Cr)',
    },
    {
      codigo: '7.3.10 ',
      nombre: 'SERVICIOS AMBULATORIOS - CONSULTA EXTERNA Y PROCEDIMIENTOS ',
    },
    {
      codigo: '7.3.10.01 ',
      nombre: 'MATERIALES UISSALUD ',
    },
    {
      codigo: '7.3.10.02 ',
      nombre: 'Generales',
    },
    {
      codigo: '7.3.10.04 ',
      nombre: 'CONTRIBUCIONES IMPUTADAS ',
    },
    {
      codigo: '7.3.10.10 ',
      nombre: 'GASTOS DE PERSONAL DIVERSOS',
    },
    {
      codigo: '7.3.10.95 ',
      nombre: 'TRASLADO DE COSTOS (CR) ',
    },
    {
      codigo: '7.3.11 ',
      nombre: 'SERVICIOS AMBULATORIOS - CONSULTA ESPECIALIZADA ',
    },
    {
      codigo: '7.3.11.02 ',
      nombre: 'GENERALES ',
    },
    {
      codigo: '7.3.11.03 ',
      nombre: 'SUELDOS Y SALARIOS ',
    },
    {
      codigo: '7.3.11.04 ',
      nombre: 'CONTRIBUCIONES IMPUTADAS ',
    },
    {
      codigo: '7.3.11.05 ',
      nombre: 'CONTRIBUCIONES EFECTIVAS ',
    },
    {
      codigo: '7.3.11.07 ',
      nombre: 'DEPRECIACIÓN Y AMORTIZACIÓN ',
    },
    {
      codigo: '7.3.11.09 ',
      nombre: 'PRESTACIONES SOCIALES',
    },
    {
      codigo: '7.3.11.10 ',
      nombre: 'GASTOS DE PERSONAL DIVERSOS',
    },
    {
      codigo: '7.3.11.95 ',
      nombre: 'TRASLADO DE COSTOS (CR) ',
    },
    {
      codigo: '7.3.12 ',
      nombre: 'SERVICIOS AMBULATORIOS - SALUD ORAL ',
    },
    {
      codigo: '7.3.12.01 ',
      nombre: 'MATERIALES ',
    },
    {
      codigo: '7.3.12.02 ',
      nombre: 'GENERALES ',
    },
    {
      codigo: '7.3.12.03 ',
      nombre: 'SUELDOS Y SALARIOS ',
    },
    {
      codigo: '7.3.12.04 ',
      nombre: 'CONTRIBUCIONES IMPUTADAS ',
    },
    {
      codigo: '7.3.12.09 ',
      nombre: 'PRESTACIONES SOCIALES ',
    },
    {
      codigo: '7.3.12.10 ',
      nombre: 'GASTOS DE PERSONAL DIVERSOS ',
    },
    {
      codigo: '7.3.12.95 ',
      nombre: 'TRASLADO DE COSTOS (CR) ',
    },
    {
      codigo: '7.3.13 ',
      nombre: 'SERVICIOS AMBULATORIOS  PROMOCIﾓN Y PREVENCIﾓN ',
    },
    {
      codigo: '7.3.13.95 ',
      nombre: 'Traslado de costos (Cr)',
    },
    {
      codigo: '7.3.14 ',
      nombre: '	SERVICIOS AMBULATORIOS - OTRAS ACTIVIDADES EXTRAMU ',
    },
    {
      codigo: '7.3.14.01 ',
      nombre: '	suministro de oxigeno ',
    },
    {
      codigo: '7.3.14.02 ',
      nombre: '	generales ',
    },
    {
      codigo: '7.3.14.04 ',
      nombre: '	contribuciones imputadas ',
    },
    {
      codigo: '7.3.14.10',
      nombre: 'Gastos de personal diversos',
    },
    {
      codigo: '7.3.14.95 ',
      nombre: 'Traslado de costos (Cr)',
    },
    {
      codigo: '7.3.20 ',
      nombre: 'HOSPITALIZACIﾓN - ESTANCIA GENERAL ',
    },
    {
      codigo: '7.3.20.02 ',
      nombre: 'GENERALES',
    },
    {
      codigo: '7.3.20.04 ',
      nombre: 'Contribuciones imputadas',
    },
    {
      codigo: '7.3.20.95 ',
      nombre: 'Traslado de costos (Cr)',
    },
    {
      codigo: '7.3.24 ',
      nombre: 'HOSPITALIZACION SALUD MENTAL ',
    },
    {
      codigo: '7.3.24.02 ',
      nombre: 'HPSIQUIATRIA INFANTIL pn ',
    },
    {
      codigo: '7.3.24.95 ',
      nombre: 'TRASLADO DE COSTOS (CR)',
    },
    {
      codigo: '7.3.40 ',
      nombre: 'APOYO DIAGNﾓSTICO - LABORATORIO CLﾍNICO',
    },
    {
      codigo: '7.3.40.02 ',
      nombre: 'GENERALES',
    },
    {
      codigo: '7.3.40.95 ',
      nombre: 'Traslado de costos (Cr)',
    },
    {
      codigo: '7.3.41 ',
      nombre: 'APOYO DIAGNﾓSTICO - IMAGENOLOGﾍA',
    },
    {
      codigo: '7.3.41.02 ',
      nombre: 'GENERALES',
    },
    {
      codigo: '7.3.41.04 ',
      nombre: 'CONTRIBUCIONES IMPUTADAS',
    },
    {
      codigo: '7.3.41.95 ',
      nombre: 'Traslado de costos (Cr)',
    },
    {
      codigo: '7.3.42 ',
      nombre: 'APOYO DIAGNﾓSTICO - ANATOMﾍA PATOLﾓGICA',
    },
    {
      codigo: '7.3.42.02 ',
      nombre: 'GENERALES',
    },
    {
      codigo: '7.3.42.95 ',
      nombre: 'Traslado de costos (Cr)',
    },

    {
      codigo: '7.3.43 ',
      nombre: 'APOYO DIAGNﾓSTICO - OTRAS UNIDADES DE APOYO DIAGNﾓ',
    },
    {
      codigo: '7.3.43.01 ',
      nombre: 'LENTES Y MONTURAS',
    },
    {
      codigo: '7.3.43.02 ',
      nombre: 'MATERIAL ORTOPEDICO',
    },
    {
      codigo: '7.3.43.04 ',
      nombre: 'CONTRIBUCIONES IMPUTADAS',
    },
    {
      codigo: '7.3.43.95 ',
      nombre: 'Traslado de costos (Cr)',
    },
    {
      codigo: '7.3.49 ',
      nombre: 'APOYO TERAPÉUTICO - REHABILITACIÓN Y TERAPIAS ',
    },
    {
      codigo: '7.3.49.02 ',
      nombre: 'GENERALES ',
    },
    {
      codigo: '7.3.49.03 ',
      nombre: 'SUELDOS Y SALARIOS ',
    },
    {
      codigo: '7.3.49.04 ',
      nombre: 'CONTRIBUCIONES IMPUTADAS ',
    },
    {
      codigo: '7.3.49.09',
      nombre: 'PRESTACIONES SOCIALES ',
    },
    {
      codigo: '7.3.49.10',
      nombre: 'GASTOS DE PERSONAL DIVERSOS',
    },
    {
      codigo: '7.3.49.95 ',
      nombre: 'TRASLADO DE COSTOS (CR) ',
    },
    {
      codigo: '7.3.52 ',
      nombre: 'APOYO TERAPﾉUTICO  UNIDAD RENAL',
    },
    {
      codigo: '7.3.52.02 ',
      nombre: 'Generales',
    },
    {
      codigo: '7.3.52.95 ',
      nombre: 'Traslado de costos (Cr)',
    },
    {
      codigo: '7.3.56 ',
      nombre: 'APOYO TERAPﾉUTICO - OTRAS UNIDADES DE APOYO TERAPﾉ',
    },
    {
      codigo: '7.3.56.02 ',
      nombre: 'generales',
    },
    {
      codigo: '7.3.56.10 ',
      nombre: 'Gastos de personal diversos',
    },
    {
      codigo: '7.3.56.95',
      nombre: 'Traslado de costos (Cr)',
    },
    {
      codigo: '7.3.84 ',
      nombre: 'SERVICIOS CONEXOS A LA SALUD  INVESTIGACIﾓN CIENT',
    },
    {
      codigo: '7.3.84.02 ',
      nombre: 'Generales',
    },
    {
      codigo: '7.3.87 ',
      nombre: 'SERVICIOS CONEXOS A LA SALUD  OTROS SERVICIOS ',
    },
    {
      codigo: '7.3.87.02 ',
      nombre: 'GENERALES ',
    },
    {
      codigo: '7.3.87.03 ',
      nombre: 'SUELDOS Y SALARIOS ',
    },
    {
      codigo: '7.3.87.04 ',
      nombre: 'CONTRIBUCIONES IMPUTADAS',
    },
    {
      codigo: '7.3.87.09 ',
      nombre: 'PRESTACIONES SOCIALES',
    },
    {
      codigo: '7.3.87.10 ',
      nombre: 'GASTOS DE PERSONAL',
    },
    {
      codigo: '7.3.87.95 ',
      nombre: 'TRASLADO DE COSTOS (CR) ',
    },
    {
      codigo: '8 ',
      nombre: 'CUENTAS DE ORDEN DEUDORAS ',
    },
    {
      codigo: '8.1 ',
      nombre: 'DERECHOS CONTINGENTES ',
    },
    {
      codigo: '8.1.20 ',
      nombre: 'LITIGIOS Y MECANISMOS ALTERNATIVOS DE SOLUCIÓN DE CONFLICTOS ',
    },
    {
      codigo: '8.1.20.01 ',
      nombre: 'CIVILES ',
    },
    {
      codigo: '8.1.20.04 ',
      nombre: 'CIVILES ',
    },
    {
      codigo: '8.1.20.02 ',
      nombre: 'LABORALES ',
    },
    {
      codigo: '8.1.90 ',
      nombre: 'OTROS DERECHOS CONTINGENTES ',
    },
    {
      codigo: '8.1.90.02 ',
      nombre: 'OTROS DERECHOS CONTINGENTES ',
    },
    {
      codigo: '8.1.90.90 ',
      nombre: 'OTROS DERECHOS CONTINGENTES ',
    },
    {
      codigo: '8.3 ',
      nombre: 'DEUDORAS DE CONTROL ',
    },
    {
      codigo: '8.3.47 ',
      nombre: 'BIENES ENTREGADOS A TERCEROS',
    },
    {
      codigo: '8.3.47.04 ',
      nombre: 'PROPIEDADES, PLANTA Y EQUIPO',
    },
    {
      codigo: '8.3.55 ',
      nombre: '',
    },
    {
      codigo: '8.3.55.10 ',
      nombre: ' ',
    },
    {
      codigo: '8.3.61 ',
      nombre: 'INTERNAS ',
    },
    {
      codigo: '8.3.61.01 ',
      nombre: 'INTERNAS ',
    },
    {
      codigo: '8.9 ',
      nombre: 'DEUDORAS POR CONTRA (CR) ',
    },
    {
      codigo: '8.9.05 ',
      nombre: 'DERECHOS CONTINGENTES POR CONTRA (CR) ',
    },
    {
      codigo: '8.9.05.06 ',
      nombre: 'LITIGIOS Y MECANISMOS ALTERNATIVOS DE SOLUCIÓN DE CONFLICTOS ',
    },
    {
      codigo: '8.9.05.90 ',
      nombre: 'OTROS DERECHOS CONTINGENTES ',
    },
    {
      codigo: '8.9.15 ',
      nombre: 'DEUDORAS DE CONTROL POR CONTRA (CR) ',
    },
    {
      codigo: '8.9.15.16 ',
      nombre: 'Ejecuci de proyectos de inversi',
    },
    {
      codigo: '8.9.15.18 ',
      nombre: 'Bienes entregados a terceros',
    },

    {
      codigo: '8.9.15.21 ',
      nombre: 'RESPONSABILIDADES EN PROCESO ',
    },

    {
      codigo: '9 ',
      nombre: 'CUENTAS DE ORDEN ACREEDORAS ',
    },
    {
      codigo: '9.1 ',
      nombre: 'RESPONSABILIDADES CONTINGENTES ',
    },
    {
      codigo: '9.1.10 ',
      nombre: 'BIENES RECIBIDOS EN GARANTIA',
    },
    {
      codigo: '9.1.10.01 ',
      nombre: 'INVERSIONES',
    },
    {
      codigo: '9.1.20 ',
      nombre: 'LITIGIOS Y MECANISMOS ALTERNATIVOS DE SOLUCIÓN DE CONFLICTOS ',
    },
    {
      codigo: '9.1.20.90 ',
      nombre: '',
    },
    {
      codigo: '9.1.20.04 ',
      nombre: '	ADMINISTRATIVOS',
    },
    {
      codigo: '9.1.20.05 ',
      nombre: 'OBLIGACIONES FISCALES ',
    },
    {
      codigo: '9.1.90 ',
      nombre: 'OTRAS RESPONSABILIDADES CONTINGENTES ',
    },
    {
      codigo: '9.1.90.01 ',
      nombre: 'CUENTAS EN PARTICIPACIÓN ',
    },
    {
      codigo: '9.1.90.90 ',
      nombre: 'Otros pasivos contingentes',
    },
    {
      codigo: '9.3 ',
      nombre: 'ACREEDORAS DE CONTROL ',
    },
    {
      codigo: '9.3.13 ',
      nombre: 'MERCANCIAS RECIBIDAS EN CONSIGNACION',
    },
    {
      codigo: '9.3.13.01 ',
      nombre: 'MERCANCIAS RECIBIDAS EN CONSIGNACION',
    },
    {
      codigo: '9.3.46 ',
      nombre: 'BIENES RECIBIDOS DE TERCEROS ',
    },
    {
      codigo: '9.3.46.19 ',
      nombre: 'PROPIEDADES, PLANTA Y EQUIPO ',
    },
    {
      codigo: '9.3.46.90 ',
      nombre: 'OTROS BIENES RECIBIDOS DE TERCEROS ',
    },
    {
      codigo: '9.3.90 ',
      nombre: 'OTRAS CUENTAS ACREEDORAS DE CONTROL ',
    },
    {
      codigo: '9.3.90.12 ',
      nombre: 'FACTURACION GLOSADA ADQUIS.SERVICIOS SALUD',
    },
    {
      codigo: '9.3.90.13 ',
      nombre: 'CONVENIOS',
    },
    {
      codigo: '9.3.90.90 ',
      nombre: 'OTRAS CUENTAS ACREEDORAS DE CONTROL ',
    },
    {
      codigo: '9.9 ',
      nombre: 'ACREEDORAS POR CONTRA (DB) ',
    },
    {
      codigo: '9.9.05 ',
      nombre: 'RESPONSABILIDADES CONTINGENTES POR CONTRA (DB) ',
    },
    {
      codigo: '9.9.05.05 ',
      nombre: 'LITIGIOS Y MECANISMOS ALTERNATIVOS DE SOLUCIÓN DE CONFLICTOS ',
    },
    {
      codigo: '9.9.05.90 ',
      nombre: 'OTRAS RESPONSABILIDADES CONTINGENTES ',
    },
    {
      codigo: '9.9.15 ',
      nombre: 'ACREEDORAS DE CONTROL POR CONTRA (DB) ',
    },
    {
      codigo: '9.9.15.03 ',
      nombre: '	MERCANCIAS RECIBIDAS EN CONSIGNACION',
    },
    {
      codigo: '9.9.15.06 ',
      nombre: 'BIENES RECIBIDOS DE TERCEROS ',
    },
    {
      codigo: '9.9.15.90 ',
      nombre: 'OTRAS CUENTAS ACREEDORAS DE CONTROL ',
    },
  ];

  modeloDeDatosContabilidad = [
    {
      nombre: 'ACTIVOS',
      saldoAnterior: 0,
      debito: 0,
      credito: 0,
      nuevoSaldo: 0,
      codigo: '1.0.00.00.00',
      tipo: false,
      color: '',
      tipoSaldoNuevo: null,
      tipoSaldoAnterior: null,
      corriente: 'false',
      noCorriente: 'false',
    },
    {
      nombre: 'EFECTIVO Y EQUIVALENTES AL EFECTIVO',
      saldoAnterior: 0,
      debito: 0,
      credito: 0,
      nuevoSaldo: 0,
      codigo: '1.1.00.00.00',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: null,
      tipoSaldoAnterior: null,
      corriente: 'false',
      noCorriente: 'false',
    },
    {
      nombre: 'INVERSIONES E INSTRUMENTOS DERIVADOS',
      saldoAnterior: 0,
      debito: 0,
      credito: 0,
      nuevoSaldo: 0,
      codigo: '1.2.00.00.00',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: null,
      tipoSaldoAnterior: null,
      corriente: 'false',
      noCorriente: 'false',
    },
    {
      nombre: 'INVERSIONES EN ENTIDADES EN LIQUIDACI N',
      saldoAnterior: 0,
      debito: 0,
      credito: 0,
      nuevoSaldo: 0,
      codigo: '1.2.16.00.00',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: null,
      tipoSaldoAnterior: null,
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      nombre: 'Sociedades de econom a mixta',
      saldoAnterior: 0,
      debito: 0,
      credito: 0,
      nuevoSaldo: 0,
      codigo: '1.2.16.02.00',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: null,
      tipoSaldoAnterior: null,
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      nombre: 'SOCIEDADES DE ECONOMIA MIXTA',
      saldoAnterior: 0,
      debito: 0,
      credito: 0,
      nuevoSaldo: 0,
      codigo: '1.2.16.04.00',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: null,
      tipoSaldoAnterior: null,
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      nombre: 'T TULOS DE TESORER A (TES)',
      saldoAnterior: 0,
      debito: 0,
      credito: 0,
      nuevoSaldo: 0,
      codigo: '1.2.21.01.00',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: null,
      tipoSaldoAnterior: null,
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      nombre: 'INCAPACIDADES',
      saldoAnterior: 0,
      debito: 0,
      credito: 0,
      nuevoSaldo: 0,
      codigo: '1.3.22.20.00',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: null,
      tipoSaldoAnterior: null,
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      nombre: 'Prestaci n de servicios',
      saldoAnterior: 0,
      debito: 0,
      credito: 0,
      nuevoSaldo: 0,
      codigo: '1.3.85.02.00',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: null,
      tipoSaldoAnterior: null,
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      nombre: 'OTROS SERVICIOS FACTURAS DE VENTA',
      saldoAnterior: 281214747,
      debito: 0,
      credito: 0,
      nuevoSaldo: 281214747,
      codigo: '1.3.85.02.02',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'DB',
      tipoSaldoAnterior: 'DB',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      nombre: 'CUENTAS DIFICIL COBRO PRESTACION SERVICIOS (CR)',
      saldoAnterior: 46276442,
      debito: 0,
      credito: 0,
      nuevoSaldo: 46276442,
      codigo: '1.3.86.02.02',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'CR',
      tipoSaldoAnterior: 'CR',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      nombre: 'CUENTAS DIFICIL COBRO OTROS DEUDORES (CR)',
      saldoAnterior: 1723264538,
      debito: 0,
      credito: 0,
      nuevoSaldo: 1723264538,
      codigo: '1.3.86.90.05',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'CR',
      tipoSaldoAnterior: 'CR',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      nombre: 'PROPIEDADES, PLANTA Y EQUIPO',
      saldoAnterior: 0,
      debito: 0,
      credito: 0,
      nuevoSaldo: 0,
      codigo: '1.6.00.00.00',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: null,
      tipoSaldoAnterior: null,
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'OTRAS EDIFICACIONES',
      saldoAnterior: 1672192990,
      debito: 0,
      credito: 0,
      nuevoSaldo: 1672192990,
      codigo: '1.6.15.01.90',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'DB',
      tipoSaldoAnterior: 'DB',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'Hoteles, hostales y paradores',
      saldoAnterior: 0,
      debito: 0,
      credito: 0,
      nuevoSaldo: 0,
      codigo: '1.6.40.12.00',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: null,
      tipoSaldoAnterior: null,
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'PAISAJISMO-URBANISMO UIS',
      saldoAnterior: 1476373113,
      debito: 0,
      credito: 0,
      nuevoSaldo: 1476373113,
      codigo: '1.7.10.01.02',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'DB',
      tipoSaldoAnterior: 'DB',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'ACTIVOS INTANGIBLES',
      saldoAnterior: 0,
      debito: 0,
      credito: 0,
      nuevoSaldo: 0,
      codigo: '1.9.70.00.00',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: null,
      tipoSaldoAnterior: null,
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'ACTIVOS DIFERIDOS',
      saldoAnterior: 0,
      debito: 0,
      credito: 0,
      nuevoSaldo: 0,
      codigo: '1.9.86.00.00',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: null,
      tipoSaldoAnterior: null,
      corriente: 'false',
      noCorriente: 'false',
    },
    {
      nombre: 'VEHICULOS',
      saldoAnterior: 34420464.04,
      debito: 0,
      credito: '        4802855.40 ',
      nuevoSaldo: 29617608.64,
      codigo: '1.9.86.09.04',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'DB',
      tipoSaldoAnterior: 'DB',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      nombre: 'Recaudos por clasificar',
      saldoAnterior: 0,
      debito: 0,
      credito: 0,
      nuevoSaldo: 0,
      codigo: '2.4.07.20.00',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: null,
      tipoSaldoAnterior: null,
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      nombre: 'RECAUDOS PENDIENTES POR IDENTIFICAR',
      saldoAnterior: 5584829,
      debito: 0,
      credito: 0,
      nuevoSaldo: 5584829,
      codigo: '2.4.07.20.01',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'CR',
      tipoSaldoAnterior: 'CR',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      nombre: 'IMPUESTO DE TIMBRE UISALUD',
      saldoAnterior: 2044058.04,
      debito: '        2240541.49 ',
      credito: '        3240052.04 ',
      nuevoSaldo: 3043568.59,
      codigo: '2.4.36.98.91',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'CR',
      tipoSaldoAnterior: 'CR',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      nombre: 'Recursos recibidos para fomentar telefon a social',
      saldoAnterior: 0,
      debito: 0,
      credito: 0,
      nuevoSaldo: 0,
      codigo: '2.9.10.23.00',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: null,
      tipoSaldoAnterior: null,
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      nombre: 'SPGR.INCREMENTO PRODUC.TRANF. FRUTO ASAI 8943',
      saldoAnterior: 0,
      debito: '       71835762.00 ',
      credito: '    3399517881.00 ',
      nuevoSaldo: 3327682119,
      codigo: '2.9.90.02.18',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'CR',
      tipoSaldoAnterior: null,
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      nombre: 'SPGR.PRODUCCION AGROECOLOGICA CEREAL.LUMINOSA 8944',
      saldoAnterior: 0,
      debito: '       36601161.00 ',
      credito: '    3305162642.00 ',
      nuevoSaldo: 3268561481,
      codigo: '2.9.90.02.19',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'CR',
      tipoSaldoAnterior: null,
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      nombre: 'CONVENIOS-COEJECUTORES',
      saldoAnterior: 19813225,
      debito: 0,
      credito: 0,
      nuevoSaldo: 19813225,
      codigo: '2.9.90.02.23',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'CR',
      tipoSaldoAnterior: 'CR',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      nombre: 'VENTA DE SERVICIOS',
      saldoAnterior: 456939552,
      debito: 0,
      credito: 0,
      nuevoSaldo: 456939552,
      codigo: '3.1.09.01.43',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'DB',
      tipoSaldoAnterior: 'DB',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'TRANSFERENCIAS Y SUBVENCIONES',
      saldoAnterior: 7555374938.95,
      debito: 0,
      credito: 0,
      nuevoSaldo: 7555374938.95,
      codigo: '3.1.09.01.44',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'CR',
      tipoSaldoAnterior: 'CR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'GTO.DE ADMINISTRACION Y OPERACION',
      saldoAnterior: 402519011.34,
      debito: '        1515000 ',
      credito: '        1743258.00 ',
      nuevoSaldo: 402290753.34,
      codigo: '3.1.09.01.51',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'DB',
      tipoSaldoAnterior: 'DB',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'COSTOS SERVICIOS EDUCATIVOS',
      saldoAnterior: 29746963,
      debito: 0,
      credito: '       12365296.00 ',
      nuevoSaldo: 17381667,
      codigo: '3.1.09.01.72',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'DB',
      tipoSaldoAnterior: 'DB',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'INGRESOS UISALUD',
      saldoAnterior: 780509834,
      debito: 0,
      credito: 0,
      nuevoSaldo: 780509834,
      codigo: '3.1.09.01.74',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'CR',
      tipoSaldoAnterior: 'CR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'EDUCACI N FORMAL - SUPERIOR - FORMACI N PROFESIONA',
      saldoAnterior: 1006427.28,
      debito: 0,
      credito: 0,
      nuevoSaldo: 1006427.28,
      codigo: '3.1.09.01.78',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'DB',
      tipoSaldoAnterior: 'DB',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'EDUCACI N FORMAL - SUPERIOR - POSTGRADO',
      saldoAnterior: 0,
      debito: '        8838350.51 ',
      credito: 0,
      nuevoSaldo: 8838350.51,
      codigo: '3.1.09.01.79',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'DB',
      tipoSaldoAnterior: null,
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: '0.5% APORTE DE RESERVA EMPLEADOS 9705',
      saldoAnterior: 147370,
      debito: 0,
      credito: 0,
      nuevoSaldo: 147370,
      codigo: '4.3.11.05.21',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'CR',
      tipoSaldoAnterior: 'CR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'Servicios ambulatorios - Otras actividades extramu',
      saldoAnterior: 0,
      debito: 0,
      credito: 0,
      nuevoSaldo: 0,
      codigo: '4.3.12.21.00',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: null,
      tipoSaldoAnterior: null,
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'Publicidad y propaganda',
      saldoAnterior: 0,
      debito: 0,
      credito: 0,
      nuevoSaldo: 0,
      codigo: '4.3.90.07.00',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: null,
      tipoSaldoAnterior: null,
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'Otros servicios',
      saldoAnterior: 0,
      debito: 0,
      credito: 0,
      nuevoSaldo: 0,
      codigo: '4.3.90.90.00',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: null,
      tipoSaldoAnterior: null,
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'SERVICIOS CONTRATOS INTERADMNISTRATIVOS',
      saldoAnterior: 46290106314,
      debito: '      560756363.00 ',
      credito: '      719330362.00 ',
      nuevoSaldo: 46448680313,
      codigo: '4.3.90.90.01',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'CR',
      tipoSaldoAnterior: 'CR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'Servicios educativos',
      saldoAnterior: 0,
      debito: 0,
      credito: 0,
      nuevoSaldo: 0,
      codigo: '4.3.95.01.00',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: null,
      tipoSaldoAnterior: null,
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'Servicios de salud',
      saldoAnterior: 0,
      debito: 0,
      credito: 0,
      nuevoSaldo: 0,
      codigo: '4.3.95.12.00',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: null,
      tipoSaldoAnterior: null,
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'SPGR.INCREMENTO PRODUC.TRANF. FRUTO ASAI 8943',
      saldoAnterior: 0,
      debito: '       35917881.00 ',
      credito: '       71835762.00 ',
      nuevoSaldo: 35917881,
      codigo: '4.4.28.90.28',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'CR',
      tipoSaldoAnterior: null,
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'SPGR.PRODUCCION AGROECOLOGICA CEREAL.LUMINOSA 8944',
      saldoAnterior: 0,
      debito: '       35917881.00 ',
      credito: '       36601161.00 ',
      nuevoSaldo: 683280,
      codigo: '4.4.28.90.29',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'CR',
      tipoSaldoAnterior: null,
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'OPERACIONES INTERINSTITUCIONALES',
      saldoAnterior: 0,
      debito: 0,
      credito: 0,
      nuevoSaldo: 0,
      codigo: '4.7.00.00.00',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: null,
      tipoSaldoAnterior: null,
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'FONDOS RECIBIDOS',
      saldoAnterior: 0,
      debito: 0,
      credito: 0,
      nuevoSaldo: 0,
      codigo: '4.7.05.00.00',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: null,
      tipoSaldoAnterior: null,
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'Intereses sobre dep sitos en instituciones financi',
      saldoAnterior: 0,
      debito: 0,
      credito: 0,
      nuevoSaldo: 0,
      codigo: '4.8.02.01.00',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: null,
      tipoSaldoAnterior: null,
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'INTERESES DEPOSITOS INSTITU.FINANCIERAS',
      saldoAnterior: 1845348165.88,
      debito: '        1702623.36 ',
      credito: '      108026576.10 ',
      nuevoSaldo: 1951672118.62,
      codigo: '4.8.02.01.01',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'CR',
      tipoSaldoAnterior: 'CR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'INTERESES DEPOSITOS INSTITU.FINANCIERAS UISALUD',
      saldoAnterior: 56434290.04,
      debito: 0,
      credito: '        7765160.40 ',
      nuevoSaldo: 64199450.44,
      codigo: '4.8.02.01.91',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'CR',
      tipoSaldoAnterior: 'CR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'INTERESES DE SENTENCIAS A FAVOR DE ENTIDAD',
      saldoAnterior: 0,
      debito: 0,
      credito: 0,
      nuevoSaldo: 0,
      codigo: '4.8.02.50.00',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: null,
      tipoSaldoAnterior: null,
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'Contratos para la gesti n de servicios p blicos',
      saldoAnterior: 0,
      debito: 0,
      credito: 0,
      nuevoSaldo: 0,
      codigo: '4.8.08.18.00',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: null,
      tipoSaldoAnterior: null,
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'IVA DEVOLUCION POR CONVENIOS',
      saldoAnterior: 13371868,
      debito: 0,
      credito: '       11414668.00 ',
      nuevoSaldo: 24786536,
      codigo: '4.8.08.90.13',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'CR',
      tipoSaldoAnterior: 'CR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'DEVOLUCION IVA DIAN DE UISALUD',
      saldoAnterior: 88321910.31,
      debito: 0,
      credito: 0,
      nuevoSaldo: 88321910.31,
      codigo: '4.8.08.90.15',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'CR',
      tipoSaldoAnterior: 'CR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'COSTAS PROCESALES PROCESOS JURIDICOS',
      saldoAnterior: 138000,
      debito: 0,
      credito: 0,
      nuevoSaldo: 138000,
      codigo: '4.8.08.90.16',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'CR',
      tipoSaldoAnterior: 'CR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'BENEFICIOS AGENCIAS DE VIAJES',
      saldoAnterior: 6215980,
      debito: 0,
      credito: 0,
      nuevoSaldo: 6215980,
      codigo: '4.8.08.90.17',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'CR',
      tipoSaldoAnterior: 'CR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'OTROS LITIGIOS Y DEMANDAS',
      saldoAnterior: 170400,
      debito: 0,
      credito: 0,
      nuevoSaldo: 170400,
      codigo: '4.8.31.01.04',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'CR',
      tipoSaldoAnterior: 'CR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'AUXILIO Y APOYO GASTOS DEPORTIVOS-RECREACION',
      saldoAnterior: 0,
      debito: '       37050000 ',
      credito: 0,
      nuevoSaldo: 37050000,
      codigo: '5.1.02.90.09',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'DB',
      tipoSaldoAnterior: null,
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'PAISAJISMO Y PLANTA DECORATIVAS',
      saldoAnterior: 119990000,
      debito: 0,
      credito: 0,
      nuevoSaldo: 119990000,
      codigo: '5.1.11.15.03',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'DB',
      tipoSaldoAnterior: 'DB',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'ELEMENTOS CONSUMO-COMEDORES BIENESTAR',
      saldoAnterior: 404272864.27,
      debito: 0,
      credito: 0,
      nuevoSaldo: 404272864.27,
      codigo: '5.1.11.90.16',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'DB',
      tipoSaldoAnterior: 'DB',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'AJUSTE POR DIFERENCIA EN CAMBIO',
      saldoAnterior: 0,
      debito: 0,
      credito: 0,
      nuevoSaldo: 0,
      codigo: '5.8.03.00.00',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: null,
      tipoSaldoAnterior: null,
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'Otros ajustes por diferencia en cambio',
      saldoAnterior: 0,
      debito: 0,
      credito: 0,
      nuevoSaldo: 0,
      codigo: '5.8.03.90.00',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: null,
      tipoSaldoAnterior: null,
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'AJUSTES POR DIFERENCIA EN CAMBIO',
      saldoAnterior: 169365.16,
      debito: 0,
      credito: 0,
      nuevoSaldo: 169365.16,
      codigo: '5.8.03.90.01',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'DB',
      tipoSaldoAnterior: 'DB',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'PERDIDA EN NEGOCIACION FDO ALTO COSTO Y PROMOC Y P',
      saldoAnterior: 7654529,
      debito: 0,
      credito: 0,
      nuevoSaldo: 7654529,
      codigo: '5.8.04.11.93',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'DB',
      tipoSaldoAnterior: 'DB',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'DESCUENTO POR ESTAMPILLAS',
      saldoAnterior: 14243042.48,
      debito: '        3868000 ',
      credito: 0,
      nuevoSaldo: 18111042.48,
      codigo: '5.8.90.90.04',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'DB',
      tipoSaldoAnterior: 'DB',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'DEVOLUCION MATRICULAS VIGENCIA ANTERIOR',
      saldoAnterior: 2191687234,
      debito: '      288789003.00 ',
      credito: '        1904517.00 ',
      nuevoSaldo: 2478571720,
      codigo: '5.8.90.90.05',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'DB',
      tipoSaldoAnterior: 'DB',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'Apoyo terap utico - Farmacia e insumos hospitalari',
      saldoAnterior: 0,
      debito: 0,
      credito: 0,
      nuevoSaldo: 0,
      codigo: '6.3.10.56.00',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: null,
      tipoSaldoAnterior: null,
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'TASA RETRIBUTIVA VERTIMIENTO AGUAS RESIDUALES',
      saldoAnterior: 172250,
      debito: 0,
      credito: 0,
      nuevoSaldo: 172250,
      codigo: '7.2.08.08.11',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'DB',
      tipoSaldoAnterior: 'DB',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'ALERGOLOGIA  (PJ)',
      saldoAnterior: 1518300,
      debito: 0,
      credito: 0,
      nuevoSaldo: 1518300,
      codigo: '7.3.11.02.01',
      tipo: 'false',
      color: '',
      tipoSaldoNuevo: 'DB',
      tipoSaldoAnterior: 'DB',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'Traslado de costos (Cr)',
      codigo: '7.3.24.95.00',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'SERVICIO MEDICO ASISTENCIAL PN',
      codigo: '7.3.87.02.53',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      nombre: 'SERVICIO MEDICO ASISTENCIAL PJ',
      codigo: '7.3.87.02.54',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.85.02.01',
      nombre: 'CAJA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.9.90.02.22',
      nombre: 'CAJA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.3.84.90.93',
      nombre: 'CAJA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.9.86.09.16',
      nombre: 'CAJA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.9.86.09.19',
      nombre: 'CAJA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.9.86.09.21',
      nombre: 'CAJA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.9.86.09.22',
      nombre: 'CAJA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.9.86.09.05',
      nombre: 'CAJA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.9.86.09.09',
      nombre: 'CAJA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.9.86.09.11',
      nombre: 'CAJA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.9.86.09.13',
      nombre: 'CAJA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.6.81.07.07',
      nombre: 'CAJA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.12.01',
      nombre: 'CAJA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.81.07.06',
      nombre: 'CAJA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.23',
      nombre: 'CAJA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.91',
      nombre: 'CAJA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.92',
      nombre: 'CAJA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.93',
      nombre: 'CAJA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.93',
      nombre: 'CAJA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.12',
      nombre: 'CAJA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.85',
      nombre: 'CAJA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.1.05.00.00',
      nombre: 'CAJA',
      corriente: 'false',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.01.00',
      nombre: 'Caja Principal',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.01.01',
      nombre: 'CAJA PRINCIPAL',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.01.02',
      nombre: 'CAJA PRINCIPAL  SEDE BARRANCABERMEJA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.01.03',
      nombre: 'CAJA PRINCIPAL  SEDE SOCORRO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.01.04',
      nombre: 'CAJA PRINCIPAL  SEDE BARBOSA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.01.05',
      nombre: 'CAJA PRINCIPAL  SEDE MALAGA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.01.91',
      nombre: 'CAJA PRINCIPAL  UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.00',
      nombre: 'CAJA MENOR',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.01',
      nombre: 'DIVISION SERVICIOS GENERALESSEDE GUATIGUARA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.02',
      nombre: 'COORD. GENERAL DE INVESTIGAC. Y ESTUDIOS AVANZADOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.03',
      nombre: 'DIRECCION DE EXTENSION Y EDUCACION CONTINUA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.04',
      nombre: 'ESCUELA DE INGENIERIA CIVIL',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.05',
      nombre: 'DIRECCION CULTURAL',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.06',
      nombre: 'VICEDECANATURA FACULTAD DE SALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.07',
      nombre: 'I.P.R.E.D.',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.08',
      nombre: 'POSTGRADO EN MICROBIOLOGIA INDUSTRIAL',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.09',
      nombre: 'PLANEACION',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.10',
      nombre: 'POSTGRADO FILOSOFIA POLITICA CONTEMPORANEA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.11',
      nombre: 'ESCUELA DE LETRASCONTRATO ECOPETROL',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.12',
      nombre: 'DIVISION DE SERVICIOS DE INFORMACIﾓN',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.13',
      nombre: 'I.P.R.E.D.  SECCIONAL MALAGA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.14',
      nombre: 'PROY.CREACION CENTRO DE DESARROLLO PROD.ALIMENT.SD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.15',
      nombre: 'DEPARTAMENTO DE MEDICINA INTERNA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.16',
      nombre: 'SECCIONAL UIS  BARRANCABERMEJA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.17',
      nombre: 'UNIDAD DE CONSTRUCCION',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.18',
      nombre: 'SECCIONAL UIS  SOCORRO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.19',
      nombre: 'DIVISION DE MANTENIMIENTO TECNOLOGICO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.20',
      nombre: 'PARQUE TECNOLOGICO DE GUATIGUARA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.21',
      nombre: 'ESCUELA DE NUTRICION',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.22',
      nombre: 'ESCUELA DE BACTERIOLOGIA Y LAB. CLINICO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.23',
      nombre: 'INSTITUTO DE LENGUAS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.24',
      nombre: 'DIRECCION DE CONTRATACION Y PROYECTOS DE INVERSION',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.25',
      nombre: 'CAJA MENOR SEDE UIS MALAGA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.26',
      nombre: 'CAJA MENOR SEDE UIS BARBOSA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.27',
      nombre: 'LABORATORIO DE DIFRACCION DE RAYOS "X"',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.28',
      nombre: 'SECCION DE COMEDORES Y CAFETERIA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.29',
      nombre: 'LAB.INMUNOLOGIA Y BIOLOGIA MOLECULAR',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.30',
      nombre: 'DIVISION DE PUBLICACIONES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.31',
      nombre: 'CAJA MENOR MAESTRIA EN HISTORIA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.32',
      nombre: 'CAJA MENOR BIENESTAR ESTUDIANTIL',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.39',
      nombre: 'BASE RECAUDARORA PARA MANEJO DE CAJA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.40',
      nombre: 'FONDO ROTATORIO LIBRERIA UIS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.50',
      nombre: 'FONDO FIJO RENOVABLE',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.51',
      nombre: 'FONDO FIJO RENOVABLE DE COMPRAS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.52',
      nombre: 'FONDO FIJO RENOVABLE DE SERVICIOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.53',
      nombre: 'FONDO FIJO RENOVABLE ASISTENCIA TECNICA Y CONSULT.',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.54',
      nombre: 'FONDO FIJO RENOVABLE TELEUIS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.55',
      nombre: 'FONDO FIJO RENOVABLE BIENESTAR UNIVERSITARIO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.56',
      nombre: 'FONDO FIJO RENOVABLE INSTITUTO DE LENGUAS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.57',
      nombre: 'FONDO FIJO RENOVABLE DE PUBLICACIONES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.58',
      nombre: 'FONDO FIJO RENOVABLE CAFETERIA FACULTAD DE SALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.59',
      nombre: 'FONDO FIJO RENOVABLE C.E.R.(CENTRO ESTUD.REGIONAL)',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.60',
      nombre: 'FONDO FIJO RENOVABLE SECCIONAL UISBARRANCABERMEJA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.61',
      nombre: 'FONDO FIJO RENOVABLE DIVISION FINANCIERA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.62',
      nombre: 'FONDO FIJO RENOVABLE PASAJES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.63',
      nombre: 'FONDO FIJO RENOVABLE DIRECCION DE COMUNICACIONES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.64',
      nombre: 'FONDO FIJO RENOVABLE DIVISION DE MANTENIMIENTO TEC',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.65',
      nombre: 'FONDO FIJO RENOVABLE COMEDORES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.91',
      nombre: 'FONDO FIJO RENOVABLE ADMINISTRATIVO UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.92',
      nombre: 'FONDO FIJO RENOVABLE ASISTENCIAL UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.05.02.98',
      nombre: 'FONDO FIJO RENOVABLE ASISTENCIAL UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.56',
      nombre: 'FONDO FIJO RENOVABLE ASISTENCIAL UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.57',
      nombre: 'FONDO FIJO RENOVABLE ASISTENCIAL UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.58',
      nombre: 'FONDO FIJO RENOVABLE ASISTENCIAL UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.00.00',
      nombre: 'DEPOSITOS EN INSTITUCIONES FINANCIERAS',
      corriente: 'false',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.00',
      nombre: 'Cuenta corriente',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.01',
      nombre: 'BANCO CORPBANCA CTA.CTE.',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.02',
      nombre: 'CANCELADA BCO.OCCID.CTA.CTE.FASE 1 SDER.CENTRO ORI',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.03',
      nombre: 'CANCELADA B.B.V.A. CTE. BARRANCABERMEJA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.04',
      nombre: 'B.B.V.A. CTE.SOCORRO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.05',
      nombre: 'BCO.ITAU DOTAC.MOBILIARIO SEDES UIS UAA1439',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.06',
      nombre: 'BANCO BOGOTA CORRIENTE BARRANCABERMEJA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.07',
      nombre: 'COOMULTRASAN CTE.INSED MALAGA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.08',
      nombre: 'CANCELADA BCO.POPULAR CTA.CTE.MALAGA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.09',
      nombre: 'BCO.DE OCCIDENTE CTE.APORTES NACION',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.10',
      nombre: 'CANCELADA BBVA CTA.AHORROS UISESTAMPILLA UNIV.PBC',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.11',
      nombre: 'BCO.OCCUIS CONST.ESC.DEPOR.CERR.PERIM.S.BARB1444',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.12',
      nombre: 'BANCO BOGOTA CORRIENTE MATRICULAS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.13',
      nombre: 'BANCO DE OCCIDENTE CTE. MATRICULAS COMUN',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.14',
      nombre: 'BANCO POPULAR CORRIENTE MATRICULAS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.15',
      nombre: 'CANCELADA BANCO OCCIDENTE  MEJORAMIENTO LAB. UIS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.17',
      nombre: 'BCO.OCCIDENTEMEJORA LABORAT.UIS DPTO.SDER.ACTUALI',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.18',
      nombre: 'DAVIVIENDA CORRIENTE MATRICULAS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.19',
      nombre: 'CANCELADA BCO.OCCIDENTE PROY.FORTALECIM.Y PROM.INV',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.20',
      nombre: 'BBVA DOTAC.INFRAESTR.TECN.FORTALEC.REGIONALES UIS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.21',
      nombre: 'CANCELADA BCO.OCCIDENTE PROY.CONSTRUCC.BIBLIOTECA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.22',
      nombre: 'CANCELADA BCO.OCC.PROY.MODERNIZAC.INFRAESTR.LAB.Y',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.23',
      nombre: 'CANCELADA BCO.OCC.AMPLIACION MODERNIZAC.INFRAESTR.',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.24',
      nombre: 'BCO.OCC.PROY.SERV.EDUCATIVOS SEDES REGIONALES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.30',
      nombre: 'B.B.V.A. CTA.CTE.',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.31',
      nombre: 'CANCELADA BCO.OCC.UIS CTTO.COFINANCIACION BANCOLDE',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.32',
      nombre: 'CANCELADA BCO.OCC.UIS ESPECIALIZ.GESTION PUBLICA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.33',
      nombre: 'CANCELADA BCO.OCCIDENTE UIS MAESTRIA HISTORIA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.34',
      nombre: 'CANCELADA OCCIDENTE AJENOS ESTAMOS CON LA UIS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.35',
      nombre: 'CANCELADA BANCO DE OCCIDENTE CTE.AJENOS APOYO DOCT',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.36',
      nombre: 'CANCELADA BCO.CORPBANCA CONVENIO UISMEN 8005',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.37',
      nombre: 'BCO.OCC.CTA.CTEUIS RECURSOS AJENOS UAA.7104',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.38',
      nombre: 'BBVACTE. PROYECTO MININTERIOR SNCPV UAA 8051 F3',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.39',
      nombre: 'TIENDA UNIVERSITARIA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.40',
      nombre: 'DAVIVIENDACONV.ECOPETROL UIS CAMPOESCUELA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.41',
      nombre: 'CANCELADA BBVACTE.DISEﾑO Y ADAPTAC.TECN.PROCES.Y',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.42',
      nombre: 'CANCELADA BCO.OCCIDENTE COMPUTAD.PARA EDUCAR EFA20',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.43',
      nombre: 'CANCELADA BCO.OCCIDENTE COMPUTAD.PARA EDUCAR EFA20',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.44',
      nombre: 'CANCELADA BCO. DE OCCIDENTE UISPROYECTO SUMA PROG',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.45',
      nombre: 'CANCELADA BCO.OCCIDENTEAPOYO CONSOL.COMITE UNIV',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.46',
      nombre: 'CANCELADA BCO.OCC.NATIONAL ENDOWMENT FOR DEMOCRACY',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.50',
      nombre: 'CANCELADA BCO.BOGOTA CTA.CTE.PATRIMONIAL',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.60',
      nombre: 'BCO. ITAU CTA.CTE.',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.61',
      nombre: 'CANCELADA BCO.OCCIDENTE CTA.CTE.UIS APOYO CORAL CO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.62',
      nombre: 'B.B.V.A. CTA.CTE.',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.63',
      nombre: 'CANCELADA BCO.OCC.CTA.CTE.CONV.INTERADM.V SEMANA C',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.64',
      nombre: 'CANCELADA BCO.ITAUCONV.UISDTO.SDER FORM.EQUIDAD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.65',
      nombre: 'CANCELADA BCO.POPULAR IPRED  MALAGA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.66',
      nombre: 'BCO.BOGOTA CTE.RECAUDO NAL.',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.67',
      nombre: 'BANCO AGRARIO IPRED CUENTA CORRIENTE',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.68',
      nombre: 'BCO.DE OCCIDENTE CTA.CTE.',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.69',
      nombre: 'CANCELADA BANCO CORPBANCA CTE. CONTRALORIA DPTAL.',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.70',
      nombre: 'DAVIVIENDA CORRIENTE',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.71',
      nombre: 'BBVA TARJETAS DE CREDITO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.72',
      nombre: 'BCO.DE OCCIDENTE CTE.IPRED',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.73',
      nombre: 'BBVA SOCORRO CTE F6',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.74',
      nombre: 'CANCELADA BANCOLOMBIA CORRIENTE ESPECIALES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.75',
      nombre: 'CANCELADA BCO.OCC.CTA.CTE.CONV.INTERADM.V SEMANA C',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.76',
      nombre: 'BCO.ITAUCTA.CTE FONDO ROTATORIO F6',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.77',
      nombre: 'CANCELADA BBVA CTE. BARRANCABERMEJA ESPECIALES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.78',
      nombre: 'CANCELADA BCO. DAVIVIENDA CORRIENTE ESPECIALES #34',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.79',
      nombre: 'CANCELADA BCO.DAVIVIENDA CORRIENTE ESPECIALES #028',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.80',
      nombre: 'BCO. ITAU CTE.PROUIS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.81',
      nombre: 'CANCELADA BCO.POPULAR CTA.CTE.PROUIS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.82',
      nombre: 'CANCELADA B.C.H. CTA.CTE.PROUIS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.83',
      nombre: 'CANCELADA BBVA CORRIENTE PROUIS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.84',
      nombre: 'BANCO ITAU PROUIS LEY 1216',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.85',
      nombre: 'BCO.DE OCCIDENTE UISDPTO.DE SANTANDER',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.90',
      nombre: 'BCO OCCIDENTE CTA.CTE.UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.91',
      nombre: 'CANCELADA BANCO CORPBANCA FESTIVAL CORAL SANTANDER',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.92',
      nombre: 'CANCELADA BANCO CORPBANCA FESTIVAL DEL PIANO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.93',
      nombre: 'CANCELADA BANCO OCCIDENTE CONVENIO UISGOBERN.SDER',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.94',
      nombre: 'CANCELADA BCO.DE OCCIDENTE UIS INGEOMINAS CONVENIO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.95',
      nombre: 'CANCELADA BANCO CORPBANCA UISINVIAS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.96',
      nombre: 'CANCELADA BANCO CORPBANCA UISDPTO.SDER.',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.98',
      nombre: 'CANCELADA BCO.OCC.PROY.UIS CONV.972(FESTIVAL DE PI',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.05.99',
      nombre: 'CANCELADA BCO.OCC. UIS GOB.SDER. CONVENIO 1153',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.00',
      nombre: 'Cuenta de ahorro',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.01',
      nombre: 'BANCO ITAU AHORROS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.02',
      nombre: 'CANCELADA BCO.OCC.ADQUIS.INSTAL.EQ.MEJORAM.INFRAES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.03',
      nombre: 'DAVIVIENDA  CUOTAS PARTES PENSIONALES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.04',
      nombre: 'BANCO SCOTIABANK COLPATRIA MATRICULAS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.05',
      nombre: 'BANCO DE OCCIDENTE RECAUDO IMPUESTO CREE',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.06',
      nombre: 'BCO.POP.AHCONV.UIS MEJORAM.INFRAE.FAC.SALUD 1459',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.07',
      nombre: 'BCO.POPULAR AHORROS COMUN',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.08',
      nombre: 'ITAU  AHORROS TASA ESPEC',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.09',
      nombre: 'BANCO "AV VILLAS"AHORROS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.10',
      nombre: 'BCO.OCC.UISMEN DECRETO 22362017 UAA 3140',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.11',
      nombre: 'BCO.SDERBECAS IBEROAMRCA,ESTUD.GRADO.SDERUNI3140',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.12',
      nombre: 'BANCO AGRARIO DE C/BIA. AHORROS F1 DEP. JUDICIALES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.13',
      nombre: 'COOMULTRASAN AHORROS APORTES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.14',
      nombre: 'COOMULTRASAN AHORROS MALAGA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.15',
      nombre: 'BANCO PICHINCHA AHORROS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.16',
      nombre: 'COOMULTRASAN C.AHUISMATRICULA I SEMESTRE 2020',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.17',
      nombre: 'BCO.OCC.UISAMPLIAC.Y MODERNIZ.PLANTA FISICA SEDE',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.18',
      nombre: 'BBVA AHORROS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.19',
      nombre: 'BANCO DE OCCIDENTE AHORROS SERV.PERSONALES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.20',
      nombre: 'BCO.OCC.AMPL.MODER.PLANT FIS SOCORRO UIS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.21',
      nombre: 'BANCOLOMBIA S.A. UIS AHORRO FONDO COMUN',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.22',
      nombre: 'BANCOLOMBIA UIS FONDO ESPECIAL',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.23',
      nombre: 'CANCELADA BBVA AH.UAA 9135 CONV.INTERAD.3075 DPTO.',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.24',
      nombre: 'CANCELADA BCO.BBVA CTA.AHRECURSOS PAGOS PASIVOS M',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.25',
      nombre: 'BCO.BBVA CTA.AHRECURSOS INVERSION PLANES FOM. MEN',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.26',
      nombre: 'BBVA.CTA.AHRECURSOS FUNCION/EXCED.COOPERA.MEN3140',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.27',
      nombre: 'BCO.POPULARAPOYO PAGO MATRIC. COVID19',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.28',
      nombre: 'F.COMULTRASAN.CTA.AH.RECAUDO MATRICULAS 3140',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.29',
      nombre: 'CANCELADA BCO BBVAUIS EQUIDAD GENERO POLIT.PUB.SD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.30',
      nombre: 'BCO.DE OCCIDENTE UIS FONDOS AJENOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.31',
      nombre: 'CANCELADA BCO.OCC.BIORETO XXI15:50 BIODIVER.COLO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.32',
      nombre: 'CANCELADA BCO.BBVA.CTA.AHCONV.COOPER.ECOPETROL302',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.33',
      nombre: 'CANCELADA BCO.DAVCTA.AH. AGROINDUSTRIA ARAUCA FII',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.34',
      nombre: 'CANCELADA DAVAH.APOYO IPRED MPIO BETULIA 1ER SEM',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.35',
      nombre: 'BCO. OCC. CODIGO BPINFONDOS SGR',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.36',
      nombre: 'BCO.OCC.AHCONV.3044677 UISECOPETROL 9840',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.37',
      nombre: 'CANCELADA BCO.BBVACTA.AH. DIDAC TICPLATAFORMA 85',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.38',
      nombre: 'BCO.DAVCONV.MARCO INTADTVO FEDESCESAR Y UIS 8029',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.39',
      nombre: 'CANCELADA BBVAAH. CONV.INTADTVO B/MEJA Y UIS UAA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.40',
      nombre: 'BCO.OCC.AHCONV.ESPEC.3042921 UISECOPETROL 9494',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.41',
      nombre: 'BCO.OCC.AHPY.ANALISIS Y MONIT.SITUAC.MUJERES 8047',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.42',
      nombre: 'CANCELADA BCO.BTACORPOICAUIS CBPIN201300021002',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.43',
      nombre: 'BANCOLOMBIA CONV UIS ECOPETROL 8901/2/4/5/6/7/8/9',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.44',
      nombre: 'BCO.ITAUCONV.INTERAD.ITS.DAMASO ZAPATA Y UIS 8023',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.45',
      nombre: 'POPULARINS Y LABORATORIO PRUEBAS COVID19 UAA8024',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.46',
      nombre: 'CANCELADA BBVAAH.CONV.INTADTVO COOPER.#129 B/MANG',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.47',
      nombre: 'POPULARCONV.INTADTVO AYUDA ECONOM LEBRIJA UAA8031',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.48',
      nombre: 'BCO.BBVACTA.AH. 40 FESTIVAL INTNAL DEL PIANO 8319',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.49',
      nombre: 'BBVA CONV.COOPERACION UIS MUNIC.BARBOSA,CHIPATA,VE',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.50',
      nombre: 'BCO.PUPULARCTA.AH.2DA FASE CONTROL DEFORESTA.8050',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.51',
      nombre: 'BANCO DE OCCIDENTE AHORROS PATRIMONIAL',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.52',
      nombre: 'CANCELADA B.B.V.A. AHORROS PATRIMONIAL SOCORRO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.59',
      nombre: 'BCO.POPULAR CTA.AH.CONVENIO COOPERATIVAS 9372 F6',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.60',
      nombre: 'CANCELADA BCO.POPULAR AHCONV.INTERADTVO FONTIC Y',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.61',
      nombre: 'SCOTIABANK COLPATRIA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.62',
      nombre: 'BANCO ITAU CUENTA DE AHORROS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.63',
      nombre: 'BCO.POPULARCONV.INTERADTVO N.006362023 UAA 9759',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.64',
      nombre: 'BANCO PICHINCHA AHORROS FONDO ESPECIAL',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.65',
      nombre: 'BANCO BOGOTA AHORROS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.66',
      nombre: 'BCO. DE OCCIDENTE UISFONDOS ESPECIALES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.67',
      nombre: 'COOMULTRASAN AHORROS ESPECIALES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.68',
      nombre: 'COOPFUTURO AHORRO APORTES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.69',
      nombre: 'CANCELADA BCO.OCCIDENTE CTTO.INTERADM.1045',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.70',
      nombre: 'CANCELADA BCO.BTAUIS PLAN GEST.INTEGRAL AGUAZULC',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.71',
      nombre: 'CANCELADA BCO.DAV.CTA.AH.CONVENIO INTERADM.000132',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.72',
      nombre: 'DAVIVIENDA RECAUDO NACIONAL AHORROS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.73',
      nombre: 'COOMULTRASAN CTA.AH.CONVENIO COOPERATIVAS UAA9372',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.74',
      nombre: 'BANCO AGRARIO AHORROS UIS SOCORRO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.75',
      nombre: 'CANCELADA BCO.OCCIDENTE CUENTA AHORROS PROYECTO 91',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.76',
      nombre: 'CANCELADA BCO.POPULARCTA.AH.PROY.MISION TIC 2022',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.77',
      nombre: 'BCO.POPCTA.AH.CONV.UNIDAD PLAN.MINERO.UPME 9767',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.78',
      nombre: 'COOMULDESA CTA.AH.APORTES COOPERATIVAS UAA9372',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.79',
      nombre: 'B.OCC.AHCONV.INTER.331/2021 MPIO.BMANGAUIS 9730',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.80',
      nombre: 'BCO.POPULAR CTA.AH.MISION TIC 2022 UAA 9732',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.81',
      nombre: 'BANCO DE OCCIDENTE ESTAMPILLA PROUIS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.82',
      nombre: 'BCO.OCC.AH.AMPLIAC/MODERNIZAC.UIS SOCORR',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.83',
      nombre: 'BBVA AHORROS PROUIS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.88',
      nombre: 'BCO BOGOTACTA AHORROS SPGR PROYECTO 8860 F15',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.89',
      nombre: 'BBVA UIS PROESTAMPILLA UNIVERS PUBLICAS 73600319',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.90',
      nombre: 'BCO.OCCIDENTE CTA.AHORROS UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.91',
      nombre: 'CAJA SOCIAL DE AHORROS  COMUN',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.92',
      nombre: 'BCO.OCCCTA.AH.UISALUD UAA 9702',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.93',
      nombre: 'BCO.OCCCTA.AH.UISALUD UAA 9703',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.94',
      nombre: 'BCO ITAU  UISALUDAHORROS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.95',
      nombre: 'BCO.OCCCTA.AH.UISALUD UAA 97049705',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.96',
      nombre: 'BCO.DE OCCIDENTE UIS DPTO.CONVENIO 1118',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.97',
      nombre: 'COOMULTRASAN C.AHUIS CONTINGENCIA MATRICUL 20201',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.98',
      nombre: 'BCO.OCCCT.AH.CONTIG.APORTES SOLIDARIDAD ADRES9706',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.10.06.99',
      nombre: 'CANCELADA OCCIDENTE AHORROSCONSTRUCCION LITOTECA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.00.00',
      nombre: 'EFECTIVO DE USO RESTRINGIDO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.00',
      nombre: 'DEPOSITOS EN INSTITUCIONES FINANCIERAS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.01',
      nombre: 'REUBICADA BCO.OCCID.CTA.CTE.FASE 1 SDER.CENTRO ORI',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.02',
      nombre: 'REUBICADA BCO.CORPBANCA DOTAC.MOBILIARIO SEDES UIS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.03',
      nombre: 'REUBICADA BCO.OCCUIS CONST.ESC.DEPOR.CERR.PERIM.S',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.04',
      nombre: 'REUBICADA BCO.OCCIDENTEMEJORA LABORAT.UIS DPTO.SD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.05',
      nombre: 'REUBICADA BBVA DOTAC.INFRAESTR.TECN.FORTALEC.REGIO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.06',
      nombre: 'REUBICADA BCO.OCC.AMPLIACION MODERNIZAC.INFRAESTR.',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.07',
      nombre: 'REUBICADA BCO.OCC.PROY.SERV.EDUCATIVOS SEDES REGIO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.16',
      nombre: 'REUBICADA B.B.V.A. CTA.CTE.',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.17',
      nombre: 'REUBICADA BCO.OCC.CTA.CTEUIS RECURSOS AJENOS UAA.',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.23',
      nombre: 'REUBICADA BCO.ITAUCONV.UISDTO.SDER FORM.EQUIDAD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.24',
      nombre: 'REUBICADA BANCO CORPBANCA CTE. CONTRALORIA DPTAL.',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.44',
      nombre: 'REUBICADA BCO OCCIDENTE CTA.CTE.UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.51',
      nombre: 'REUBICADA BCO.OCC.ADQUIS.INSTAL.EQ.MEJORAM.INFRAES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.52',
      nombre: 'REUBICADA DAVIVIENDA  CUOTAS PARTES PENSIONALES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.53',
      nombre: 'REUBICADA BANCO DE OCCIDENTE RECAUDO IMPUESTO CREE',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.54',
      nombre: 'REUBICADA BANCO AGRARIO DE C/BIA. AHORROS F1',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.55',
      nombre: 'REUBICADA BCO.OCC.UISAMPLIAC MODERNIZ.INFRAEST.ED',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.56',
      nombre: 'REUBICADA BCO.OCC.UISAMPLIAC.Y MODERNIZ.PLANTA FI',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.57',
      nombre: 'REUBICADA BCO.OCC.AMPL.MODER.PLANT FIS SOCORRO UIS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.58',
      nombre: 'REUBICADA BCO.OCC.UISMEJORAMIENTO INFRAESTRUCT.TE',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.66',
      nombre: 'REUBICADA BCO.DE OCCIDENTE UIS FONDOS AJENOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.67',
      nombre: 'REUBICADA BCO.OCC.BIORETO XXI15:50 BIODIVER.COLO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.73',
      nombre: 'REUBICADA BBVA AH.UAA 9135 CONV.INTERAD.3075 DPTO.',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.74',
      nombre: 'REUBICADA BCO CORPBUISMPIO.B/MANGA.CTTO INTERADT',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.75',
      nombre: 'REUBICADA BCO.OCCIDENTE CTTO.INTERADM.1045',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.76',
      nombre: 'REUBICADA BCO.BTAUIS PLAN GEST.INTEGRAL AGUAZULC',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.77',
      nombre: 'REUBICADA BCO.OCCIDENTE UIS CTTO.INTERADM.00001179',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.78',
      nombre: 'REUBICADA BCO.OCCIDENTE CUENTA AHORROS PROYECTO 91',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.79',
      nombre: 'REUBICADA BCO. OCC. AHORROS UISIPSE',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.80',
      nombre: 'REUBICADA BBVA AH.CONV.9102 INTERADM.FORTALEC.ENSE',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.81',
      nombre: 'REUBICADA BCO.DE OCC.CONV.INTERADM.BILINGUISMO MPI',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.82',
      nombre: 'REUBICADA BCO.DE OCCIDENTE UIS DPTO.CONVENIO 1118',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.83',
      nombre: 'REUBICADA OCCIDENTE AHORROSCONSTRUCCION LITOTECA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.93',
      nombre: 'REUBICADA BBVA UIS PROESTAMPILLA UNIVERS PUBLICAS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.94',
      nombre: 'REUBICADA BCO.OCCIDENTE CTA.AHORROS UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.95',
      nombre: 'REUBICADA BCO ITAU COLOMBIA S.A. UISALUDAHORROS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.1.32.10.99',
      nombre: 'REUBICADA BCO BOGOTACTA AHORROS SPGR PROYECTO 886',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.2.21.00.00',
      nombre: 'INVERSIONES DE ADMINISTRACIﾓN DE LIQUIDEZ A VALOR',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.2.21.01',
      nombre: 'T侊ULOS DE TESORER褜 (TES)',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.21.01.94',
      nombre: 'TES TASA FIJA FDO RESERVA REC UIS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.21.01.95',
      nombre: 'TES TASA FIJA FDO RESERVA REC PROPIOS UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.21.03.00',
      nombre: 'BONOS Y T侊ULOS EMITIDOS POR EL SECTOR PRIVADO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.21.03.94',
      nombre: 'BONOS ORDINARIOS FDO.RESERV.RECURSOS UIS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.21.03.95',
      nombre: 'BONOS ORDINARIOS FDO.RESERV.REC.PROPIOS UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.21.07.00',
      nombre: 'BONOS Y T侊ULOS EMITIDOS POR LAS EMPRESAS NO FINAN',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.21.07.94',
      nombre: 'BONOS DEUDA PBCA.FDO.RESERV.RECURSOS UIS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.21.07.95',
      nombre: 'BONOS DEUDA PBCA.FDO.RESERV.REC.PROPIOS UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.21.08.00',
      nombre: 'Bonos y t咜ulos emitidos por las entidades financi',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.21.08.94',
      nombre: 'BONOS ORD.Y TES TASA FIJA FDO.RESERV.REC.UIS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.21.08.95',
      nombre: 'BONOS ORD.Y TES TASA FIJA FDO.RESER.REC.PROPIOS UI',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.21.08.96',
      nombre: 'TITULOS HIPOTECARIOS UAA(9704)',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.21.16.00',
      nombre: 'Carteras colectivas',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.21.16.11',
      nombre: 'FONDOS DE INVERSIONFONDO COMUN',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.21.16.13',
      nombre: 'FONDOS DE INVERSIONFONDOS AJENOS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.21.16.15',
      nombre: 'FONDOS DE INVERSIONFONDO PATRIMONIAL',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.21.16.16',
      nombre: 'FONDOS DE INVERSIONFONDOS Y RENTAS ESPECIALES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.21.16.18',
      nombre: 'FONDOS DE INVERSIONFONDO ESTAMPILLA PROUIS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.21.16.90',
      nombre: 'FONDOS DE INVERSIONFDO.ASEGURADOR UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.21.17.00',
      nombre: 'CERTIFICADOS EMITIDOS POR FONDOS DE INVERSI',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.21.17.11',
      nombre: 'FONDOS DE INVERSIONFONDO COMUN',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.21.17.13',
      nombre: 'FONDOS DE INVERSIONFONDOS AJENOS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.21.17.15',
      nombre: 'FONDOS DE INVERSIONFONDO PATRIMONIAL',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.21.17.16',
      nombre: 'FONDOS DE INVERSIONFONDOS Y RENTAS ESPECIALES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.21.17.18',
      nombre: 'FONDOS DE INVERSIONFONDO ESTAMPILLA PROUIS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.21.17.90',
      nombre: 'FONDOS DE INVERSIONFDO.ASEGURADOR UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.23.00.00',
      nombre: 'INVERSIONES DE ADMINISTRACIﾓN DE LIQUIDEZ A COSTO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.2.23.02.00',
      nombre: 'CERTIFICADOS DE DEPITO A T餝MINO (CDT)',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.23.02.01',
      nombre: 'C.D.T.FONDO COMUN',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.23.02.03',
      nombre: 'C.D.T.FONDOS AJENOS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.23.02.05',
      nombre: 'C.D.T.FONDO PATRIMONIAL',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.23.02.06',
      nombre: 'C.D.T.FONDOS Y RENTAS ESPECIALES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.23.02.08',
      nombre: 'C.D.T.FONDO ESTAMPILLA PROUIS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.23.02.91',
      nombre: 'CDT FONDO ASEGURADOR UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.23.02.93',
      nombre: 'CDT FDO.ALTO COSTO Y PROMOC.Y PREV.UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.23.02.94',
      nombre: 'CDT FONDO RESERVA RECURSOS UIS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.23.02.95',
      nombre: 'CDT FONDO RESERVA RECURSOS PROPIOS UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.24.00.00',
      nombre: 'INVERSIONES DE ADMINISTRACIﾓN DE LIQUIDEZ AL COSTO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.2.24.13.00',
      nombre: 'Acciones ordinarias',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.24.13.01',
      nombre: 'SOCIEDADES ECONOMIA MIXTA',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.24.15.00',
      nombre: 'CUOTAS O PARTES DE INTER餞 SOCIAL',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.24.15.01',
      nombre: 'FODESEPFONDO DE DESARROLLO DE LA EDUCAC.SUPERIOR',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.80.00.00',
      nombre: 'DETERIORO ACUMULADO DE INVERSIONES (CR)',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.80.42.00',
      nombre: 'Inversiones de administraci de liquidez al costo',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.2.80.42.01',
      nombre: 'SOCIEDADES ECONOMIA MIXTA',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.00.00.00',
      nombre: 'CUENTAS POR COBRAR',
      corriente: 'false',
      noCorriente: 'false',
    },
    {
      codigo: '1.3.17.00.00',
      nombre: 'PRESTACIﾓN DE SERVICIOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.3.17.01.00',
      nombre: 'SERVICIOS EDUCATIVOS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.17.01.01',
      nombre: 'MATRICULAS PREGRADO PRESENCIAL',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.17.01.02',
      nombre: 'MATRICULAS POSTGRADOS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.17.01.03',
      nombre: 'MATRICULAS IPRED',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.17.01.04',
      nombre: 'MATRICULAS INSTITUTO DE LENGUAS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.17.01.05',
      nombre: 'OTRAS DEUDAS MATRICULAS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.17.01.06',
      nombre: 'CURSOS INTERSEMESTRALES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.17.90.00',
      nombre: 'OTROS SERVICIOS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.17.90.01',
      nombre: 'OTRAS CUENTAS POR COBRAR',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.17.90.02',
      nombre: 'DOCUMENTOS POR COBRAR',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.17.90.03',
      nombre: 'OTRAS CUENTAS POR COBRARREINTEGROS DE NOMINA',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.17.90.04',
      nombre: 'OTRAS CUENTAS POR COBRAR: RECAUDO GENERAL Y OTROS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.17.90.05',
      nombre: 'OTRAS CUENTAS POR COBRAR: ACUERDOS DE PAGO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.17.90.06',
      nombre: 'OTRAS CUENTAS POR COBRARFONDO ROTATORIO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.17.90.07',
      nombre: 'OTRAS CXC REINTEGRO AUXILIATURAS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.17.90.08',
      nombre: 'OTRAS CUENTAS POR COBRAR PROYECTOS INVESTIGACION',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.17.90.09',
      nombre: 'OTRAS CUENTAS POR COBRAR: PROCESOS JURIDICOS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.17.90.10',
      nombre: 'OTRAS CUENTAS POR COBRARCREDITOS CONDONABLES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.17.90.91',
      nombre: 'OTRAS CUENTAS POR COBRAR UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.19.00.00',
      nombre: 'PRESTACIﾓN DE SERVICIOS DE SALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.3.19.14.00',
      nombre: 'Servicios de Salud por entidades con r馮imen espec',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.19.14.91',
      nombre: 'CONVENIO RED UNIVERSITARIA UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.22.20.91',
      nombre: '',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.3.22.00.00',
      nombre: 'ADMINISTRACIﾓN DEL SISTEMA DE SEGURIDAD SOCIAL EN',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.3.22.90.00',
      nombre: 'OTROS INGRESOS POR LA ADMINISTRACI DEL SISTEMA D',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.3.22.90.91',
      nombre: 'OTROS INGRESOS POR ADMON.SIST.SEG.SOC.UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.22.90.92',
      nombre: 'CONVENIO RED UNIVERSITARIA UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.22.90.94',
      nombre: 'VALES ASISTENCIALES UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.22.90.96',
      nombre: 'OTROS INGRESOS AFILIADOS UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.24.00.00',
      nombre: 'SUBVENCIONES POR COBRAR',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.3.24.16.00',
      nombre: 'SUBVENCI POR RECURSOS TRANSFERIDOS POR EL GOBIER',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.3.24.16.01',
      nombre: 'SUBVENCIONES POR COBRAR SPGR',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.37.00.00',
      nombre: 'TRANSFERENCIAS POR COBRAR',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.3.37.02.00',
      nombre: 'SISTEMA GENERAL DE REGAL褜S',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.37.02.01',
      nombre: 'LOCAL SUBVENCIONES POR COBRAR SPGR',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.37.12.00',
      nombre: 'Otras transferencias',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.37.12.01',
      nombre: 'OTRAS TRANSFERENCIAS MINISTERIO DE EDUCACION',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.37.12.04',
      nombre: 'OTRAS TRANSFERENCIAS DPTO. DE SANTANDER',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.37.12.15',
      nombre: 'OTRAS TRANSF.SPGR DEPARTAMENTO SANTANDER',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.37.12.16',
      nombre: 'OTRAS TRANSF.SPGR SHD BOGOTA D.C',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.37.12.17',
      nombre: 'OTRAS TRANSF.SPGR DEPARTAMENTO BOYACA',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.37.12.18',
      nombre: 'OTRAS TRANSF.SPGR DEPARTAMENTO CUNDINAMARCA',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.37.12.19',
      nombre: 'OTRAS TRANSF.SPGR DPTO.NORTE DE SANTANDER',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.37.12.20',
      nombre: 'OTRAS TRANSF.SPGR DEPARTAMENTO CASANARE',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.37.12.21',
      nombre: 'OTRAS TRANSF.SPGR DEPARTAMENTO DEL CESAR',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.37.12.22',
      nombre: 'OTRAS TRANSF.SPGR DEPARTAMENTO DE NARIﾑO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.37.12.23',
      nombre: 'OTRAS TRANSF.SPGR DEPARTAMENTO BOLIVAR',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.37.12.24',
      nombre: 'OTRAS TRANSF.SPGR DEPARTAMENTO CORDOBA',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.37.12.25',
      nombre: 'OTRAS TRANSF.SPGR DEPARTAMENTO AMANZONAS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.84.00.00',
      nombre: 'OTRAS CUENTAS POR COBRAR',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.3.84.08.00',
      nombre: 'CUOTAS PARTES DE PENSIONES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.84.08.01',
      nombre: 'CUOTAS PARTES DE PENSIONES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.84.08.02',
      nombre: 'CONCURRENCIA CUOTAS PARTES DE PENSION',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.84.13.00',
      nombre: 'DEVOLUCI IVA PARA ENTIDADES DE EDUCACI SUPERIO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.84.13.01',
      nombre: 'DEVOLUCION IVA PARA ENTIDADES DE EDUCACION SUPERIO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.84.13.80',
      nombre: 'DEVOLUCION IVA PARA ENTIDADES DE EDUCACIONBIORETO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.84.13.91',
      nombre: 'DEVOLUCION IVA ENTIDADES EDUC. SUP. UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.84.19.00',
      nombre: 'Faltantes de bienes aprehendidos o incautados',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.84.19.01',
      nombre: 'BIENES APREHENDIDOS O INCAUTADOS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.84.90.00',
      nombre: 'OTRAS CUENTAS POR COBRAR',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.84.90.05',
      nombre: 'OTROS DEUDORES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.84.90.06',
      nombre: 'OTROS DEUDORESSENTENCIAS CONDENATORIAS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.84.90.07',
      nombre: 'OTROS DEUDORES  BASE CAJA RECAUDADORA',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.84.90.08',
      nombre: 'RECURSOS FINANCIEROSINTERESES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.84.90.09',
      nombre: 'OTROS DEUDORESESTAMPILLA PROUIS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.84.90.10',
      nombre: 'DE MULTAS,SANCIONES E INTERESES DE MORA',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.84.90.12',
      nombre: 'OTROS DEUDORESINCAPACIDADES EPS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.84.90.80',
      nombre: 'OTROS DEUDORES BIORETO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.84.90.91',
      nombre: 'OTROS DEUDORES UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.85.00.00',
      nombre: 'CUENTAS POR COBRAR DE DIFﾍCIL RECAUDO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.3.85.90.00',
      nombre: 'Otras cuentas por cobrar de dif兤il cobro',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.85.90.01',
      nombre: 'OTRAS CUENTAS POR COBRAR',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.85.90.05',
      nombre: 'ACUERDO DE PAGO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.85.90.10',
      nombre: 'CREDITOS CONDONABLES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.86.00.00',
      nombre: 'DETERIORO ACUMULADO DE CUENTAS POR COBRAR (CR)',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.3.86.02.00',
      nombre: 'PRESTACI DE SERVICIOS (CR)',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.86.02.01',
      nombre: 'PRESTACION DE SERVICIOS (CR)',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.86.02.91',
      nombre: 'PRESTACION DE SERVICIOS UISALUD (CR)',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.86.90.00',
      nombre: 'OTRAS CUENTAS POR COBRAR (CR)',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.86.90.01',
      nombre: 'OTROS DEUDORES (CR)',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.86.90.02',
      nombre: 'TRANSFERENCIAS POR COBRAR (CR)',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.86.90.03',
      nombre: 'CESANTIAS RETROACTIVAS (CR)',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.3.86.90.04',
      nombre: 'CONCURRENCIA DEUDA PENSIONAL',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.4.00.00.00',
      nombre: 'PRﾉSTAMOS POR COBRAR',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.4.07.90.07',
      nombre: 'OTRAS CXC REINTEGRO AUXILIATAURA Y CREDITOS CONDON',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.5.00.00.00',
      nombre: 'INVENTARIOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.05.00.00',
      nombre: 'BIENES PRODUCIDOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.05.06.00',
      nombre: 'IMPRESOS Y PUBLICACIONES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.05.06.01',
      nombre: 'PUBLICACIONES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.10.00.00',
      nombre: 'MERCANCﾍAS EN EXISTENCIA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.10.04.00',
      nombre: 'IMPRESOS Y PUBLICACIONES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.10.04.01',
      nombre: 'INSTITUTO DE LENGUAS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.10.04.02',
      nombre: 'MODULOS INSED',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.10.04.03',
      nombre: 'FONDO ROTATORIO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.10.04.04',
      nombre: 'TIENDA UNIVERSITARIA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.10.04.06',
      nombre: 'BODEGA GENERAL PUBLICACIONES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.10.04.07',
      nombre: 'BODEGA CORTE (PAPEL)PUBLICACIONES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.10.04.08',
      nombre: 'BODEGA GRAN FORMATO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.10.04.09',
      nombre: 'BODEGA BOBINAS  PUBLICACIONES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.10.04.10',
      nombre: 'BODEGA PLASTICO  PUBLICACIONES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.10.04.11',
      nombre: 'BODEGA PRODUCTO TERMINADO  PUBLICACIONES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.10.90.00',
      nombre: 'OTRAS MERCANC褜S EN EXISTENCIA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.10.90.01',
      nombre: 'FONDO ROTATORIO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.10.90.02',
      nombre: 'TIENDA UNIVERSITARIA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.14.00.00',
      nombre: 'MATERIALES Y SUMINISTROS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.14.03.00',
      nombre: 'MEDICAMENTOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.14.03.01',
      nombre: 'MEDICAMENTOS BIENESTAR UNIVERSITARIO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.14.03.02',
      nombre: 'PLANIFICACI BIENESTAR UNIVERSITARIO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.14.03.91',
      nombre: 'INVENTARIO UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.14.05.00',
      nombre: 'MATERIALES REACTIVOS Y DE LABORATORIO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.14.05.01',
      nombre: 'MATERIAL DE LABORATORIO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.14.05.02',
      nombre: 'LABORATORIO DE QU仡ICA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.14.08.00',
      nombre: 'VIVERES Y RANCHO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.14.08.01',
      nombre: 'INVENTARIO DE COMEDORES BIENESTAR UNIVERSITARIO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.14.08.02',
      nombre: 'INVENTARIO SUCURSALES DE CAFETERIAS UIS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.30.00.00',
      nombre: 'EN PODER DE TERCEROS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.30.90.00',
      nombre: 'Otros inventarios en poder de terceros',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.5.30.90.01',
      nombre: 'M/CIA ENTREGADA CONSIG. TIENDA UNIVERISTARIA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '1.6.00',
      corriente: 'false',
      noCorriente: 'false',
    },
    {
      codigo: '1.6.05.00.00',
      nombre: 'TERRENOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.00',
      nombre: 'Urbanos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.01',
      nombre: 'CAMPUS CENTRAL:LOTE #1 CARRERA 27 CON CALLE 9',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.02',
      nombre: 'CAMPUS CENTRAL: LOTE # 2',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.03',
      nombre: 'CENTRO CULTURAL Y NEGOCIACIONES BUCARICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.04',
      nombre: 'LOCAL INDUSTRIAL UIS AVENIDA LIBERTADOR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.05',
      nombre: 'LOTE #1PARQUEADERO FAC.DE SALUD CRA 33 AV.QDA.SEC',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.06',
      nombre: 'LOTE #2 FACULTAD DE SALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.07',
      nombre: 'RESIDENCIA SPACHOVSKY CALLE 10#2924 LOTE URBANIZA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.08',
      nombre: 'LOTE UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.10',
      nombre: 'TERRENO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.20',
      nombre: 'PARQUE TECNOLOGICOGRANJA GUATIGUARA PIEDECUESTA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.21',
      nombre: 'PARQUE TECNOLOGICO LOTE#2 MECANIZADO AGRICOLAPIED',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.22',
      nombre: 'LOTE HANGAR IPRED PARQUE TECNOLOGICO GUATIGUARA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.31',
      nombre: 'LOTE GENERAL LOCALES TEJAR MODERNO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.32',
      nombre: 'LOTE COMERCIAL # 1 TEJAR MODERNO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.33',
      nombre: 'LOTE COMERCIAL # 2 TEJAR MODERNO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.34',
      nombre: 'NUEVA SEDE UIS FLORIDABLANCA CRA 5.#532 CASCO ANT',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.40',
      nombre: 'SEDE UIS BARRANCABERMEJA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.41',
      nombre: 'BIBLIOTECA ALEJANDRO GALVIS LOTE CLL 60 CRA 28 BAR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.50',
      nombre: 'SEDE UISBARBOSA LOTE CRA 9 # 1326',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.51',
      nombre: 'SEDE CAMPUS BARBOSA LOTE YURI CONSTANZA CRA 5#12I',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.60',
      nombre: 'LOTE 7A ZONA INDUSTRIAL  CUCUTA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.61',
      nombre: 'LOTE 7B ZONA INDUSTRIAL  CUCUTA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.62',
      nombre: 'LOTE #9 CLL 29C CRA 35 PARAJE DE LORETOMEDELLIN U',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.70',
      nombre: 'LOTE SEDE UIS MALAGA CLL 10 # 620 BARRIO EL LIMON',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.71',
      nombre: 'LOTES (40)BARRIO EL LIMONAL MALAGA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.72',
      nombre: 'LOTE NARANJITO CARRERA 3A N.282 MALAGA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.73',
      nombre: 'LOTE EL ARRAYANPESCADERITO MALAGA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.74',
      nombre: 'LOTE LLANO LARGOPESCADERITO MALAGA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.75',
      nombre: 'LOTE VEREDA EL ROBLEPESCADERITO MALAGA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.76',
      nombre: 'LOTE PALO SANTOPESCADERITO MALAGA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.80',
      nombre: 'SEDE UIS SOCORRO CLL 14 6133 LOTE 3',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.81',
      nombre: 'SEDE UIS SOCORRO CRA 8 12A58 LOTE 2',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.82',
      nombre: 'SEDE UIS SOCORRO CLL 14 671 LOTE 1',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.90',
      nombre: 'VIAS DE ACCESO Y COMUNICACION INTERNA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.91',
      nombre: 'BIBLIOTECA BICENTANARIO SOCORRO CARRERA 8 N. 604',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.01.92',
      nombre: 'LOTE 2 POTOSISOCORRO CRA 8#662 M.I.32143168',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.02.00',
      nombre: 'Rurales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.02.01',
      nombre: 'ANTENA REPETIDORA FM STEREO BUENAVISTA KM6 VIA PAM',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.02.02',
      nombre: 'ANTENA REPETIDORA AM LOS LAURELES VDA.LOS SANTOS K',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.02.03',
      nombre: 'LOTE 916 MESA DE RUITOQUE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.02.04',
      nombre: 'LOTE 917B MESA DE RUITOQUE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.02.05',
      nombre: 'LOTE SANTA ROSA VDA RIO FRIO ORIENTALTABIO (CUNDI',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.02.06',
      nombre: 'FINCA SECTOR AEROPUERTO "YURI CONSTANZA"BARBOSA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.02.07',
      nombre: 'LOTE "VIVERO QUEBRADAS"SOCORRO KM.2 CARRETERA CEN',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.04.00',
      nombre: 'Terrenos pendientes de legalizar',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.05.04.01',
      nombre: 'TERRENOS PENDIENTES DE LEGALIZAR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.00.00',
      nombre: 'CONSTRUCCIONES EN CURSO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.00',
      nombre: 'EDIFICACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.01',
      nombre: 'EDIFICACIONES ADMINISTRACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.02',
      nombre: 'ADECUACIONES ARQUITECT.INSTITUTO DE LENGUAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.03',
      nombre: 'CAMPOS DEPORTIVOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.04',
      nombre: 'EDIF.CAMILO TORRES:LAB.COMPUTO ESPECIALIZADO MATEM',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.05',
      nombre: 'ESTADIO PRIMERO DE MARZO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.06',
      nombre: 'LABORATORIO DE FISICA DE LA FACULTAD DE CIENCIAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.07',
      nombre: 'EDIFICACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.08',
      nombre: 'PLAZOLETA DE ACCESO Y SOTANO DE PARQUEADEROS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.09',
      nombre: 'CENTICCENTRO DE TECN.DE INFORMACION Y COMUNICACIO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.10',
      nombre: 'CENTRO DE CARACTERIZ.DE MATERIALES DE CONSTRUCCION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.11',
      nombre: 'II FASE DEL AREA DE DIRECCION CULTURAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.12',
      nombre: 'LABORATORIO QUIMICO DE SUELOS ESCUELA DE QUIMICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.13',
      nombre: 'LABORATORIO Y PLANTA PILOTOCENIVAM',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.14',
      nombre: 'MODULOS PARA ESTUDIO EN AREAS VERDES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.15',
      nombre: 'VICERRECTORIA DE INVESTIGACION (HUMANIDADES II)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.16',
      nombre: 'SEDE BUCARICA UIS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.17',
      nombre: 'SEDE UIS BARBOSA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.18',
      nombre: 'EDIFICIO DE ADMINISTRACION II (ANTIG.CIENCIAS HUMA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.19',
      nombre: 'EDIF.ING.QUIMICAADECUAC.CIVILES,ARQUITEC.Y ELECTR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.20',
      nombre: 'FAC.DE SALUD3ER.PISO EDIF.ADMON.Y LABORATORIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.21',
      nombre: 'CENTRO DE INVESTIGACIONES GUATIGUARA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.22',
      nombre: 'INGENIERﾍA INDUSTRIALMODERNIZACION Y AMPLIACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.23',
      nombre: 'LIBRERIA UIS TIENDA UNIVERSITARIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.24',
      nombre: 'CENTRO CULTURAL LUIS A. CALVO ADECUACION Y REMODEL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.25',
      nombre: 'NUEVA SEDE LITOTECA NAL.PARQUE TECN.GUATIGARA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.26',
      nombre: 'SEDE UIS BARRANCABERMEJA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.27',
      nombre: 'INGENIERﾍA ELECTRICA MODERNIZACION Y AMPLIACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.28',
      nombre: 'FAC.DE SALUDEDIFICIO ROBERTO SERPA F. AULAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.29',
      nombre: 'EDIF.JORGE BAUTISTA VESGA AMPLIACION REFORZAMIENTO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.30',
      nombre: 'EDIFICIO CIENCIAS HUMANAS ADECUACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.31',
      nombre: 'GECT I GESTION EMPRESARIAL EN CIENCIA Y TECN GUATI',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.32',
      nombre: 'INGENIERﾍA ELECTRICA IIMODERNIZACION Y AMPLIACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.33',
      nombre: 'GIMNASIO UIS MEJORAS Y ADECUACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.34',
      nombre: 'REFORMA REESTRUC.MUSEO DE HISTORIA EDIF.LAB.LIVIAN',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.35',
      nombre: 'FAC.SALUDDPTO.PATOLOGIA ADECUACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.36',
      nombre: 'CASONA LA PERLA ADECUACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.37',
      nombre: 'ED.BIBLIOTECA ADECUACIONES Y MEJORAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.38',
      nombre: 'CUBIERTA AUDITORIO GUILLERMO CAMACHO EDI.ING. INDU',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.39',
      nombre: 'EDIF. ELOY VALENZUELA. LAB. LAFICO Y NUTRICI',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.41',
      nombre: 'PLAZOLETA Y CAFETERIA SEDE BARBOSA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.42',
      nombre: 'GECT II GESTION EMPRESARIAL EN CIENCIA Y TECN GUAT',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.43',
      nombre: 'MODERNIZ.MORGUE EN LA FACULTAD DE SALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.44',
      nombre: 'ADECUACIONES EDIFICIO UISALUDFAVUIS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.45',
      nombre: 'ADECUAC.EDIFICIO BIENESTAR ESTUDIANTIL.',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.46',
      nombre: 'FACULTAD DE SALUD.MEJORAMIENTO INFRAESTRUCT.F侒ICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.47',
      nombre: 'MODULOS HEXAGONAL COMEDORES Y COMBOS SALUDABLES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.48',
      nombre: 'PLAN MAESTRO SEDE UIS M甅AGA FASE I',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.49',
      nombre: 'PROYECTO PLAN MAESTRO SEDE SOCORRO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.50',
      nombre: 'PLAN MAESTRO ESPACIO PUBL.CAMPUS PRINCIPAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.51',
      nombre: 'EDIF.INGENIERIA MECANICA CONSTRUC.DE LABORATORIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.52',
      nombre: 'NUEVA SEDE UIS FLORIDABLANCA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.53',
      nombre: 'CONSTRUCCION CAFETERIA EL BOSQUE UIS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.54',
      nombre: 'EDIFICIO DE RESIDENCIAS UNIVERSITARIAS UIS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.55',
      nombre: 'SIETENARIO MONUMENTO EDIFICIO ING. MECANICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.56',
      nombre: 'PROYECTO PLAN MAESTRO FACULTAD DE SALUD UIS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.57',
      nombre: 'PLANTA TRATAMIENTO AGUAS RESIDUALES GUATIGUARA PAR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.58',
      nombre: 'PLAN MAESTRO SEDE UIS FLORIDABLANCA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.59',
      nombre: 'CONST.CAFETER褜 PLAZOLETA CAMILO TORRES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.60',
      nombre: 'ADECUAC.PARQUE BICENTENARIO PAISAJISMO/URBANISMO.',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.62',
      nombre: 'EDIF.CENTRO LOGISTICO PLANTA FISICAMMTO TECNOL Y',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.63',
      nombre: 'CONST. PLAZOLETA EDIF. CAMILO TORRES Y LAB. LIVIAN',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.64',
      nombre: 'CONST.PLAZOLETA EDIF. INGEN.MECANICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.65',
      nombre: 'BIBLIOTECA ALEJANDRO GALVIS BARRANCA.AIRE ACONDICI',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.66',
      nombre: 'EDIF. CAMILO TORRES.AMPLIACION Y MODERNIZACION.',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.67',
      nombre: 'AUDITORIO PRINCIPAL SEDE GUATIGUARA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.68',
      nombre: 'CONSTRUC.EDIFICIO INVESTIGACIONES CAMPUS CENTRAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.69',
      nombre: 'EDIF.(H)CENTRO DEPORTIVO PARQUE BICENTENARIO SOCOR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.70',
      nombre: 'EDIF.(D)AULAS PARQUE BICENTENARIO SEDE SOCORRO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.72',
      nombre: 'NUEVO EDIFICIO ADMINISTRACION III. CONSTRUCCION/AD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.73',
      nombre: 'NUEVO EDIFICIO CIENCIAS HUMANAS II',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.74',
      nombre: 'RESTAURACION DEL AULA MAXIMA DE CIENCIA.',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.75',
      nombre: 'PORTERIA SALIDA CARRERA 30',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.76',
      nombre: 'EDIF.INVESTIG.FACULTAD CIENCIASEDIC',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.77',
      nombre: 'ADECUAC.PARQUE TECNOLOGICO PAISAJISMO/URBANISMO.',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.78',
      nombre: 'EDIFICIO BIENESTAR PROFESORAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.79',
      nombre: 'ADECUAC. EDIFICIO ADMINISTRACION I',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.80',
      nombre: 'CONSTRUC.AULA COOMULDESA CAMPUS BICENTENARIO SOCOR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.81',
      nombre: 'ADECUAC.CAMPUS CENTRAL PAISAJISMO/URBANISMO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.82',
      nombre: 'TANQUE DE ALMACENAMIENTO DE AGUA  DEL CAMPUS PRINC',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.83',
      nombre: 'EDIF.FACULTAD DE INGENIERIA FISICOMECANICAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.84',
      nombre: 'ADECUACIONES EDIFICIO MUSICA (DANIEL CASAS)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.85',
      nombre: 'PLAZOLETA EDIFICIO MUSICA (DANIEL CASAS)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.86',
      nombre: 'CONSTRUCCION SKATE PARK',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.87',
      nombre: 'CANCHAS DEPORTIVAS SQUASH',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.88',
      nombre: 'MODULO DE SALUD MENTAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.01.89',
      nombre: 'MALAGA CONSTRUC.NUEVO CAMPUS UNIVERSITARIO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.05.00',
      nombre: 'Redes, l匤eas y cables',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.05.01',
      nombre: 'REDES, LINEAS Y CABLES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.90.00',
      nombre: 'Otras construcciones en curso',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.90.01',
      nombre: 'MUROS, CERCAS Y VALLAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.90.02',
      nombre: 'OBRAS Y MEJORAS EN PROPIEDAD AJENA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.90.03',
      nombre: 'VIAS DE ACCESO Y COMUNICACION INTERNA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.90.04',
      nombre: 'SISTEMA DE CONTROL DE INGRESO PEATONAL Y VEHICULAR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.90.05',
      nombre: 'PORTAL DE ACCESO PARQUE TECNOLOGICO GUATIGUARA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.90.06',
      nombre: 'MOBILIARIO MECANICA,SALUD,PLANEACION,FINANCIERA Y',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.90.07',
      nombre: 'ADECUA.BATERIAS SANITARIAS BIBLIOTEC.,HUMANAS Y OT',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.15.90.08',
      nombre: 'S.DE AUDIO Y VIDEO CONFER.ESC.MECANICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.20.00.00',
      nombre: 'MAQUINARIA, PLANTA Y EQUIPO EN MONTAJE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.20.03.01',
      nombre: 'MAQUINARIA Y EQUIPO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.25.00.00',
      nombre: 'PROPIEDADES, PLANTA Y EQUIPO EN TRﾁNSITO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.25.03',
      nombre: 'MAQUINARIA Y EQUIPO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.25.03.01',
      nombre: 'MAQUINARIA Y EQUIPO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.25.04.00',
      nombre: 'EQUIPO M颯ICO Y CIENT炻ICO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.25.04.01',
      nombre: 'EQUIPO MEDICO Y CIENTIFICO',
      corriente: 'false',
      noCorriente: 'true',
    },

       {
      codigo: '1.6.25.05',
      nombre: 'EQUIPO DE COMUNICACION Y COMPUTACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.25.05.01',
      nombre: 'EQUIPO DE COMUNICACION Y COMPUTACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.25.07.00',
      nombre: 'MUEBLES, ENSERES Y EQUIPO DE OFICINA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.25.07.01',
      nombre: 'MUEBLES, ENSERES Y EQUIPO DE OFICINA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.25.07.02',
      nombre: 'BIENES DE ARTE Y CULTURA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.25.07.03',
      nombre: 'INTANGIBLES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.25.12',
      nombre: 'COMPONENTES DE PROPIEDADES, PLANTA Y EQUIPO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.25.12.01',
      nombre: 'MATERIALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.25.90.00',
      nombre: 'OTRAS MAQUINARIAS, PLANTA Y EQUIPO EN TR甎SITO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.25.90.01',
      nombre: 'OTRAS MAQUINARIAS, PLANTA Y EQUIPO EN TRANSITO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.35.00.00',
      nombre: 'BIENES MUEBLES EN BODEGA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.35.90.00',
      nombre: 'Otros bienes muebles en bodega',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.35.90.01',
      nombre: 'OTROS BIENES MUEBLES EN BODEGA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.00.00',
      nombre: 'EDIFICACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.01.00',
      nombre: 'Edificios y casas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.01.01',
      nombre: 'EDIFICIOS DE ADMINISTRACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.01.02',
      nombre: 'EDIFICIOS AUXILIARES PARA EDUCACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.01.03',
      nombre: 'EDIFICIOS DE LABORATORIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.01.04',
      nombre: 'EDIFICIOS PARA EDUCACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.01.06',
      nombre: 'SEDE REGIONAL UIS  BARRANCABERMEJA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.01.07',
      nombre: 'CENTRO CULTURAL Y NEGOCIACIONES BUCARICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.01.08',
      nombre: 'PARQUE TECNOLOGICO GUATIGUARA (PIEDECUESTA)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.01.09',
      nombre: 'SEDE REGIONAL UIS  BARBOSA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.01.10',
      nombre: 'ANTENA REPETIDORA A.M. UIS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.01.11',
      nombre: 'ANTENA REPETIDORA F.M.STEREO UIS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.01.12',
      nombre: 'BODEGAS ZONA INDUSTRIAL  CUCUTA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.01.13',
      nombre: 'CASA CAMPESTRE Y ANEXIDADES  TABIO (CUNDINAMARCA)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.01.14',
      nombre: 'FACULTAD DE SALUD UISBUCARAMANGA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.01.15',
      nombre: 'SEDE REGIONAL UIS MALAGA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.01.16',
      nombre: 'SEDE REGIONAL UIS BARBOSAYURI CONSTANZA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.01.17',
      nombre: 'BIBLIOTECA Y PARQUE BICENTENARIO SEDE UIS SOCORRO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.01.18',
      nombre: 'SEDE UIS SOCORRO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.01.19',
      nombre: 'SEDE UIS FLORIDABLANCA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.01.20',
      nombre: 'INSTITUTO DE LENGUA SEDE CABECERA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.01.21',
      nombre: 'SEDE UIS MESON DE LOS BUCAROS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.01.91',
      nombre: 'EDIFICIO UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.02.00',
      nombre: 'Oficinas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.02.01',
      nombre: 'OFICINA 401 Y 402 EDIF. OFFICE EN BOGOTA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.17.00',
      nombre: 'Parqueaderos y garajes',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.17.01',
      nombre: 'VIAS Y PARQUEADERO CAMPUS CENTRAL UIS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.17.02',
      nombre: 'PARQUEADERO CENTRO CULTURAL Y NEGOCIACIONES UIS BU',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.17.03',
      nombre: 'PARQUEADERO ESTADIO ALFONSO LOPEZ COMODATO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.17.04',
      nombre: 'PARQUEADERO FACULTAD DE SALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.19.00',
      nombre: 'Instalaciones deportivas y recreacionales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.19.01',
      nombre: 'INSTALACIONES DEPORTIVAS Y RECREACIONALES',
      corriente: 'false',
      noCorriente: 'true',
    },
      {
      codigo: '1.6.40.24',
      nombre: 'TANQUES DE ALMACENAMIENTO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.90.00',
      nombre: 'Otras edificaciones',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.90.01',
      nombre: 'OTRAS EDIFICACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.90.02',
      nombre: 'MURO Y ENCERRAMIENTO PARQ.TEC.GUATIGUARA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.45.00.00',
      nombre: 'PLANTAS, DUCTOS Y TﾚNELES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.45.13.00',
      nombre: 'Acueducto y canalizaci',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.45.13.01',
      nombre: 'ACUEDUCTO Y CANALIZACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.50.00.00',
      nombre: 'REDES, LﾍNEAS Y CABLES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.50.10.00',
      nombre: 'L匤eas y cables de telecomunicaciones',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.50.10.01',
      nombre: 'LINEAS Y CABLE DE TELECOMUNICACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.50.90.00',
      nombre: 'Otras redes, l匤eas y cables',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.01.23',
      nombre: 'Otras redes, l匤eas y cables',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.40.01.22',
      nombre: 'Otras redes, l匤eas y cables',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.50.90.01',
      nombre: 'REDES ELECTRICAS, ACUEDUCTO Y ALCANTARILLADO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.55.00.00',
      nombre: 'MAQUINARIA Y EQUIPO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.55.11.00',
      nombre: 'Herramientas y accesorios',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.55.11.01',
      nombre: 'HERRAMIENTAS Y ACCESORIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.55.90.00',
      nombre: 'Otra maquinaria y equipo',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.55.90.01',
      nombre: 'OTRAS MAQUINARIAS Y EQUIPOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.55.90.02',
      nombre: 'AJUSTES POR INFLACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.55.90.91',
      nombre: 'OTRAS MAQUINARIAS Y EQUIPOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.60.00.00',
      nombre: 'EQUIPO MﾉDICO Y CIENTﾍFICO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.60.01.00',
      nombre: 'Equipo de investigaci',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.60.01.01',
      nombre: 'EQUIPO DE INVESTIGACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.60.02.00',
      nombre: 'Equipo de laboratorio',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.60.02.01',
      nombre: 'EQUIPO DE LABORATORIO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.60.02.02',
      nombre: 'AJUSTES POR INFLACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.60.90.00',
      nombre: 'Otro equipo m馘ico y cient凬ico',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.60.90.01',
      nombre: 'OTROS EQUIPO MEDICO Y CIENTIFICO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.60.90.91',
      nombre: 'OTROS EQUIPO MEDICO Y CIENTIFICO UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.65.00.00',
      nombre: 'MUEBLES, ENSERES Y EQUIPO DE OFICINA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.65.01.00',
      nombre: 'Muebles y enseres',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.65.01.01',
      nombre: 'MUEBLES Y ENSERES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.65.01.02',
      nombre: 'AJUSTES POR INFLACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.65.01.91',
      nombre: 'MUEBLES Y ENSERES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.65.02.00',
      nombre: 'Equipo y m痃uina de oficina',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.65.02.01',
      nombre: 'EQUIPO Y MAQUINA DE OFICINA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.65.02.02',
      nombre: 'AJUSTES POR INFLACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.65.02.91',
      nombre: 'EQUIPO Y MAQUINA DE OFICINA UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.65.90.00',
      nombre: 'Otros muebles, enseres y equipo de oficina',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.65.90.01',
      nombre: 'OTROS MUEBLES, ENSERES Y EQUIPOS DE OFICINA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.65.90.91',
      nombre: 'OTROS MUEBLES,ENSERES Y EQ.OFICINA UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.70.00.00',
      nombre: 'EQUIPOS DE COMUNICACIﾓN Y COMPUTACIﾓN',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.70.01.00',
      nombre: 'Equipo de comunicaci',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.70.01.01',
      nombre: 'EQUIPO DE COMUNICACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.70.01.02',
      nombre: 'AJUSTES POR INFLACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.70.01.91',
      nombre: 'EQUIPO DE COMUNICACION UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.70.02.00',
      nombre: 'Equipo de computaci',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.70.02.01',
      nombre: 'EQUIPO DE COMPUTACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.70.02.02',
      nombre: 'AJUSTES POR INFLACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.70.02.91',
      nombre: 'EQUIPO DE COMPUTACION UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.70.04.00',
      nombre: 'Sat駘ites y antenas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.70.04.01',
      nombre: 'SATELITES Y ANTENAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.70.90.00',
      nombre: 'Otros equipos de comunicaci y computaci',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.70.90.01',
      nombre: 'OTROS EQUIPOS DE COMUNICACION Y COMPUTACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.75.00.00',
      nombre: 'EQUIPOS DE TRANSPORTE, TRACCIﾓN Y ELEVACIﾓN',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.75.02.00',
      nombre: 'Terrestre',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.75.02.01',
      nombre: 'TERRESTRE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.75.02.02',
      nombre: 'AJUSTES POR INFLACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.81.00.00',
      nombre: 'BIENES DE ARTE Y CULTURA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.81.01.00',
      nombre: 'Obras de arte',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.81.01.01',
      nombre: 'OBRAS DE ARTELECCION DE GEOMETRIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.81.01.02',
      nombre: 'OBRA DE ARTEESCULTURA SIETENARIO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.81.01.03',
      nombre: 'ESCULTURA CONSTELACION BIODIVERSA CENIVAM',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.81.07.00',
      nombre: 'Libros y publicaciones de investigaci y consulta',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.81.07.01',
      nombre: 'BIBLIOTECA SEDE CENTRAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.81.07.02',
      nombre: 'BIBLIOTECA SEDE SOCORRO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.81.07.03',
      nombre: 'BIBLIOTECA SEDE MALAGA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.81.07.04',
      nombre: 'BIBLIOTECA SEDE BARRANCABERMEJA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.81.07.05',
      nombre: 'BIBLIOTECA SEDE BARBOSA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.00.00',
      nombre: 'DEPRECIACIﾓN ACUMULADA DE PROPIEDADES, PLANTA Y EQ',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.01.00',
      nombre: 'EDIFICACIONES (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.01.01',
      nombre: 'EDIFICACIONES ADMINISTRATIVAS (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.01.02',
      nombre: 'AJUSTES POR INFLACION (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.01.03',
      nombre: 'EDIFICACIONES PROPIEDAD INVERSIONES (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.01.04',
      nombre: 'EDIFICACIONES PARA LA EDUCACION (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.01.91',
      nombre: 'EDIFICACIONES UISALUD (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.02.00',
      nombre: 'PLANTAS, DUCTOS Y TⅤELES (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.02.01',
      nombre: 'PLANTAS, DUCTOS Y TUNELES (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.03.00',
      nombre: 'REDES, L仼EAS Y CABLES (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.03.01',
      nombre: 'REDES, LINEAS Y CABLES (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.03.02',
      nombre: 'AJUSTES POR INFLACION (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.04.00',
      nombre: 'MAQUINARIA Y EQUIPO (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.04.01',
      nombre: 'MAQUINARIA Y EQUIPO (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.04.02',
      nombre: 'AJUSTES POR INFLACION (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.04.91',
      nombre: 'MAQUINARIA Y EQUIPO UISALUD (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.05.00',
      nombre: 'EQUIPO M颯ICO Y CIENT炻ICO (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.05.01',
      nombre: 'EQUIPO MEDICO Y CIENTIFICO (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.05.02',
      nombre: 'AJUSTES POR INFLACION (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.05.91',
      nombre: 'EQUIPO MEDICO Y CIENTIFICO UISALUD (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.06.00',
      nombre: 'MUEBLES, ENSERES Y EQUIPO DE OFICINA (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.06.01',
      nombre: 'MUEBLES, ENSERES Y EQUIPOS DE OFICINA (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.06.02',
      nombre: 'AJUSTES POR INFLACION (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.06.90',
      nombre: 'ELEMENTOS DEVOLUTIVOS MENORES DE CONTROL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.06.91',
      nombre: 'MUEBLES,ENSERES Y EQUIPOS DE OFIC.UISALUD(CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.06.92',
      nombre: 'ELEMENTOS DEVOLUTIVOS MENORES DE CONTROL UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.07.00',
      nombre: 'EQUIPOS DE COMUNICACI Y COMPUTACI (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.07.01',
      nombre: 'EQUIPOS DE COMUNICACION Y COMPUTACION (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.07.02',
      nombre: 'AJUSTES POR INFLACION  (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.07.91',
      nombre: 'EQUIPOS DE COMUNICACION Y COMPUTACION UISALUD (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.08.00',
      nombre: 'EQUIPOS DE TRANSPORTE, TRACCI Y ELEVACI (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.08.01',
      nombre: 'EQUIPOS DE TRANSPORTE, TRACCION Y ELEVACION (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.08.02',
      nombre: 'AJUSTES POR INFLACION (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.12.00',
      nombre: 'BIENES DE ARTE Y CULTURA (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.85.12.01',
      nombre: 'LIBROS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.95.00.00',
      nombre: 'DETERIORO ACUMULADO DE PROPIEDADES, PLANTA Y EQUIP',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.95.01.00',
      nombre: 'Terrenos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.6.95.01.01',
      nombre: 'TERRENOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.7.00.00.00',
      nombre: 'BIENES DE USO PﾚBLICO E HISTﾓRICOS Y CULTURALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.7.10.00.00',
      nombre: 'BIENES DE USO UBLICO EN SERVICIO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.7.10.01.00',
      nombre: 'RED CARRETERA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.7.10.01.01',
      nombre: 'VIAS INTERNAS UIS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.7.15.00.00',
      nombre: 'BIENES HISTﾓRICOS Y CULTURALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.7.15.01.00',
      nombre: 'Monumentos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.7.15.01.01',
      nombre: 'CENTRO CULTURAL Y NEGOCIACIONES UIS BUCARICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.7.15.07.00',
      nombre: 'EDIFICACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.7.15.90.00',
      nombre: 'Otros bienes histicos y culturales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.7.15.90.01',
      nombre: 'CENTRO CULTURAL Y NEGOCIACIONES UIS BUCARICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.00.00.00',
      nombre: 'OTROS ACTIVOS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.02.00.00',
      nombre: 'PLAN DE ACTIVOS PARA BENEFICIOS A LOS EMPLEADOS A',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.02.04.00',
      nombre: 'Encargos fiduciarios',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.02.04.01',
      nombre: 'ENCARGOS FIDUCIARIOS PENSIONES BONO TIPO B',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.02.04.02',
      nombre: 'ENCARGOS FIDUCIARIOS PENSIONES FONDO EFECTIVO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.04.00.00',
      nombre: 'PLAN DE ACTIVOS PARA BENEFICIOS POSEMPLEO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.04.04.00',
      nombre: 'Encargos fiduciarios',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.04.04.01',
      nombre: 'ENCARGOS FIDUCIARIOS PENSIONES BONO TIPO B',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.04.04.02',
      nombre: 'ENCARGOS FIDUCIARIOS PENSIONES FONDO EFECTIVO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.04.12.00',
      nombre: 'CUENTAS POR COBRAR',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.04.12.02',
      nombre: 'CUENTAS POR COBRARCONCURRENCIA PASIVO PENSIONAL',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.00.00',
      nombre: 'BIENES Y SERVICIOS PAGADOS POR ANTICIPADO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.01.00',
      nombre: 'Seguros',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.01.01',
      nombre: 'ROBO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.01.02',
      nombre: 'INCENDIO  TERREMOTO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.01.03',
      nombre: 'RESPONSABILIDAD CIVILEXTRACONTRACTUALSERVID.PBCO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.01.04',
      nombre: 'VEHICULOS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.01.05',
      nombre: 'MAQUINARIA Y EQUIPO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.01.06',
      nombre: 'SEGURO ESTUDIANTIL',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.01.07',
      nombre: 'CUMPLIMIENTO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.01.08',
      nombre: 'COLECTIVO DE VIDA',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.01.09',
      nombre: 'TRANSPORTE DE VALORES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.01.10',
      nombre: 'ACCIDENTE DE PASAJEROS EN VEHICULOS DE LA UIS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.01.11',
      nombre: 'TRANSPORTE',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.01.12',
      nombre: 'MULTIRIESGO PLAN ESTATAL',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.01.13',
      nombre: 'TODORIESGO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.01.14',
      nombre: 'DAﾑOS MATERIALES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.01.15',
      nombre: 'ACCIDENTES PERSONALES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.01.16',
      nombre: 'INFIDELIDAD Y RIESGOS FINANCIEROS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.01.17',
      nombre: 'EQUIPO DE COMUNICACION Y COMPUTO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.01.18',
      nombre: 'S.O.A.TSEG.DAS CORPORALES A PNAS.EN ACCID.TRANS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.01.19',
      nombre: 'MANEJO GLOBAL CARGOS ENTIDADES OFICIALES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.01.20',
      nombre: 'GARANTIAS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.01.92',
      nombre: 'RESPONSABIL.CIVIL UISALUD PROFESIONAL MEDICO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.01.93',
      nombre: 'RESPONSABIL.CIVIL UISALUD.CLINICAS Y HOSPITALES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.02.00',
      nombre: 'Intereses',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.02.01',
      nombre: 'INTERESES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.04.00',
      nombre: 'Arrendamiento operativo',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.04.01',
      nombre: 'ARRENDAMIENTOS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.05.00',
      nombre: 'Impresos, publicaciones, suscripciones y afiliacio',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.05.01',
      nombre: 'IMPRESOS,PUBLICACIONES,SUSCRIPCIONES Y AFILIACION',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.11.00',
      nombre: 'Sueldos y salarios',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.11.03',
      nombre: 'VACACIONES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.11.91',
      nombre: 'VACACIONES UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.15.00',
      nombre: 'Otros beneficios a los empleados',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.15.03',
      nombre: 'VACACIONES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.15.91',
      nombre: 'VACACIONES UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.90.00',
      nombre: 'Otros bienes y servicios pagados por anticipado',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.90.01',
      nombre: 'OTROS BIENES Y SERVICIOS PAGADOS POR ANTICIPADO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.05.90.91',
      nombre: 'OTROS BIENES Y SERV.PDOS.ANTICIPADO UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.06.00.00',
      nombre: 'AVANCES Y ANTICIPOS ENTREGADOS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.06.04.00',
      nombre: 'Anticipo para adquisici de bienes y servicios',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.06.04.01',
      nombre: 'ANTICIPOS SOBRE COMPRAS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.06.04.02',
      nombre: 'ANTICIPOS SOBRE CONTRATOS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.08.00.00',
      nombre: 'RECURSOS ENTREGADOS EN ADMINISTRACIﾓN',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.08.03.00',
      nombre: 'Encargo fiduciario  Fiducia de administraci',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.08.03.01',
      nombre: 'ENCARGO FIDUC. POPULAR CONV. MARCO UIS ECOPETROL',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.08.03.02',
      nombre: 'ENCARGO FIDUC.CORFICOLOMBIANA UISECOPETROL 302846',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.09.00.00',
      nombre: 'DEPﾓSITOS ENTREGADOS EN GARANTﾍA',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.09.01.00',
      nombre: 'Para servicios',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.09.01.01',
      nombre: 'PARA SERVICIOS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.09.03.00',
      nombre: 'Depitos judiciales',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.09.03.01',
      nombre: 'DEPOSITOS JUDICIALES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.09.04.00',
      nombre: 'Depitos sobre contratos',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.09.04.01',
      nombre: 'CONTRATOS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.26.00.00',
      nombre: 'DERECHOS EN FIDEICOMISO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.26.03.00',
      nombre: 'Fiducia mercantil  Constituci de patrimonio aut',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.26.03.01',
      nombre: 'FIDUCIA MERCANTILCONSTITUC.PATRIMONIO AUTONOMO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.51.00.00',
      nombre: 'PROPIEDADES DE INVERSIﾓN',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.51.01.00',
      nombre: 'Terrenos',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.51.01.30',
      nombre: 'LOCAL # 8 CENTRO COMERCIAL LOS ANDES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.51.01.31',
      nombre: 'LOTE GENERAL LOCALES TEJAR MODERNO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.51.01.32',
      nombre: 'LOTE COMERCIAL # 1 TEJAR MODERNO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.51.01.33',
      nombre: 'LOTE COMERCIAL # 2 TEJAR MODERNO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.51.01.60',
      nombre: 'LOTE 7A BODEGA ZONA INDUSTRIAL  CUCUTA',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.51.01.61',
      nombre: 'LOTE 7B BODEGA ZONA INDUSTRIAL  CUCUTA',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.51.02.00',
      nombre: 'Edificaciones',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.51.02.12',
      nombre: 'BODEGAS ZONA INDUSTRIAL  CUCUTA',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.51.02.90',
      nombre: 'OTRAS PROPIEDADES DE INVERSION',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.51.02.91',
      nombre: 'LOCALES EL TEJAR  SANTA BARBARA',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.51.02.92',
      nombre: 'CENTRO COMERCIAL LOS ANDES, LOCAL #8',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.51.02.93',
      nombre: 'KIOSCO "DON CAFETO"',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.51.02.94',
      nombre: 'KIOSCO "DEPORTES" EDIFICIO 36 RESIDENCIAS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.51.02.95',
      nombre: 'KIOSCO INGENIER褜 INDUSTRIAL "SOCCER H.D."',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.52.00.00',
      nombre: 'DEPRECIACIﾓN ACUMULADA DE PROPIEDADES DE INVERSIﾓN',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.52.01.00',
      nombre: 'Edificaciones',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.52.01.01',
      nombre: 'EDIFICACIONES PROPIEDAD INVERSIONES (CR)',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.70.02.00',
      nombre: 'Marcas',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.70.02.01',
      nombre: 'LOGOTIPO SELLO EDICIONES UIS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.70.03.00',
      nombre: 'Patentes',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.70.03.01',
      nombre: 'PATENTES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.70.08.00',
      nombre: 'Softwares',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.70.08.01',
      nombre: 'SOFTWARE',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.70.08.91',
      nombre: 'SOFTWARE UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.75.00.00',
      nombre: 'AMORTIZACIﾓN ACUMULADA DE ACTIVOS INTANGIBLES (CR)',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.75.03.00',
      nombre: 'PATENTES (CR)',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.75.03.01',
      nombre: 'AMORTIZACION PATENTES (CR)',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.75.08.00',
      nombre: 'SOFTWARE (CR)',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.75.08.01',
      nombre: 'SOFTWARE (CR)',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.75.08.91',
      nombre: 'SOFTWARE UISALUD (CR)',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.86.09.00',
      nombre: 'SEGUROS CON COBERTURA MAYOR A DOCE MESES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.86.09.03',
      nombre: 'RESPONSABILIDAD CIVILEXTRACONTRACTUALSERVID.PBCO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.86.09.07',
      nombre: 'CUMPLIMIENTO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.86.09.15',
      nombre: 'ACCIDENTES PERSONALES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '1.9.86.09.18',
      nombre: 'S.O.A.TSEG.DAS CORPORALES A PNAS.EN ACCID.TRANS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.0.00.00.00',
      nombre: 'PASIVOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.00.00.00',
      nombre: 'CUENTAS POR PAGAR',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.01.00.00',
      nombre: 'ADQUISICIﾓN DE BIENES Y SERVICIOS NACIONALES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.01.01.00',
      nombre: 'Bienes y servicios',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.01.01.01',
      nombre: 'BIENES Y SERVICIOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.01.01.80',
      nombre: 'BIENES Y SERVICIOS BIORETO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.01.01.81',
      nombre: 'BIENES Y SERVICIOS BIORETO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.01.01.91',
      nombre: 'BIENES Y SERVICIOS UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.03.00.00',
      nombre: 'TRANSFERENCIAS POR PAGAR',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.03.15.01',
      nombre: 'MINCIENCIASCOLCIENCIAS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.06.00.00',
      nombre: 'ADQUISICIﾓN DE BIENES Y SERVICIOS DEL EXTERIOR',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.06.01.00',
      nombre: 'Bienes y servicios',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.06.01.01',
      nombre: 'BIENES Y SERVICIOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.07.00.00',
      nombre: 'RECURSOS A FAVOR DE TERCEROS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.07.01.00',
      nombre: 'Deducci de impuestos',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.07.01.01',
      nombre: 'DEDUCCION DE IMPUESTOSSPGR',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.07.03.00',
      nombre: 'Impuestos',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.07.03.02',
      nombre: 'CONTRIBUCION 5% CTTOS.OBRA PUBLICA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.07.03.92',
      nombre: 'CONTRIBUCION 5% CTTOS.OBRA PUBLICA UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.07.22.00',
      nombre: 'Estampillas',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.07.22.02',
      nombre: 'ESTAMPILLA PROUIS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.07.22.03',
      nombre: 'HORAS CATEDRA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.07.22.05',
      nombre: 'MINISTERIO DE EDUCACION NACIONAL',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.07.22.07',
      nombre: 'APRENDICES SENA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.07.22.10',
      nombre: 'ENTRENAMIENTO PERSONAL  CREDITOS EDUCATIVOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.07.22.80',
      nombre: 'ESTAMPILLA PROUIS BIORETO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.07.22.91',
      nombre: 'ESTAMPILLA PROUISUISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.07.26.00',
      nombre: 'RECURSOS A FAVOR DE TERCEROS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.07.26.01',
      nombre: 'RENDIMIENTOS FINANCIEROS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.07.90.00',
      nombre: 'Otros recaudos a favor de terceros',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.07.90.01',
      nombre: 'OTROS RECAUDOS A FAVOR DE TERCEROS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.07.90.03',
      nombre: 'AUXILIOS EDUCATIVOS A FAVOR DE TERCEROS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.07.90.04',
      nombre: 'INCAPACIDAD REINTEGRO EPS DOC.CATEDRA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.07.90.91',
      nombre: 'RECURSOS A FAVOR DE TERCEROSUISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.00.00',
      nombre: 'DESCUENTOS DE NﾓMINA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.01.00',
      nombre: 'Aportes a fondos pensionales',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.01.01',
      nombre: 'APORTES A FONDOS PENSIONALES  EMPLEADOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.01.91',
      nombre: 'APORTES A FONDOS PENSIONALES EMPLEADOS UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.01.92',
      nombre: 'APORTES A FONDOS PENSIONALES UIS UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.02.00',
      nombre: 'Aportes a seguridad social en salud',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.02.01',
      nombre: 'APORTES A SEGURIDAD SOCIAL EN SALUD  EMPLEADOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.02.03',
      nombre: 'APORTES A SEGURIDAD SOCIAL EN SALUD  OTROS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.02.91',
      nombre: 'APORTES SEGURIDAD SOCIAL EN SALUD EMPLEADOS UISALU',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.02.92',
      nombre: 'APORTES A SEGURIDAD SOCIAL EN SALUD UIS UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.02.93',
      nombre: 'APORTES SEGURIDAD SOCIAL EN SALUDOTROS UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.04.00',
      nombre: 'Sindicatos',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.04.01',
      nombre: 'SINDICATOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.05.00',
      nombre: 'Cooperativas',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.05.01',
      nombre: 'COOPERATIVAS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.05.91',
      nombre: 'COOPERATIVAS UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.06.00',
      nombre: 'Fondos de empleados',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.06.01',
      nombre: 'FONDOS DE EMPLEADOS  EMPLEADOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.06.02',
      nombre: 'FONDOS DE EMPLEADOS  PRESTAMOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.06.03',
      nombre: 'FONDOS DE EMPLEADOS  UIS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.06.04',
      nombre: 'FONDO DE EMPLEADOS FEUIS  EMPLEADOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.06.91',
      nombre: 'FONDOS DE EMPLEADOS UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.06.92',
      nombre: 'FONDOS DE EMPLEADOSPRESTAMOS UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.06.94',
      nombre: 'FONDO DE EMPLEADOSFEUIS UISALUD  EMPLEADOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.07.00',
      nombre: 'Libranzas',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.07.01',
      nombre: 'LIBRANZAS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.07.91',
      nombre: 'LIBRANZAS UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.11.00',
      nombre: 'Embargos judiciales',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.11.01',
      nombre: 'EMBARGOS JUDICIALES  CIVILES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.11.02',
      nombre: 'EMBARGOS JUDICIALES  ALIMENTOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.11.91',
      nombre: 'EMBARGOS JUDICIALES  CIVILES UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.24.11.92',
      nombre: 'EMBARGOS JUDICIALES  ALIMENTOS UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.00.00',
      nombre: 'RETENCIﾓN EN LA FUENTE E IMPUESTO DE TIMBRE',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.03.00',
      nombre: 'HONORARIOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.03.01',
      nombre: 'HONORARIOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.03.80',
      nombre: 'HONORARIO BIORETO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.03.91',
      nombre: 'HONORARIOS UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.05.00',
      nombre: 'SERVICIOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.05.01',
      nombre: 'SERVICIOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.05.80',
      nombre: 'SERVICIOS BIORETO  RETENCION',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.05.91',
      nombre: 'SERVICIOS UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.06.00',
      nombre: 'ARRENDAMIENTOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.06.01',
      nombre: 'ARRENDAMIENTOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.06.91',
      nombre: 'ARRENDAMIENTOS UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.08.00',
      nombre: 'Compras',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.08.01',
      nombre: 'COMPRAS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.08.80',
      nombre: 'COMPRAS BIORETO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.08.91',
      nombre: 'COMPRAS UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.15.00',
      nombre: 'A empleados art兤ulo 383 ET',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.15.01',
      nombre: 'A EMPLEADOS ARTICULO 383 E.T.',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.15.91',
      nombre: 'A EMPLEADOS ARTICULO 383 E.T.UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.16.00',
      nombre: 'A empleados art兤ulo 384 ET',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.16.01',
      nombre: 'A EMPLEADOS ARTICULO 384 E.T.',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.25.00',
      nombre: 'Impuesto a las ventas retenido pendiente de consig',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.25.01',
      nombre: 'IMPOVENTAS RETENIDO POR CONSIGNAR',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.25.80',
      nombre: 'IMPOVENTAS RETENIDO POR CONSIGNAR BIORETO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.25.91',
      nombre: 'IMPUESTO A LAS VENTAS RETENIDO POR CONSIGNAR UISAL',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.26.00',
      nombre: 'Contratos de obra',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.26.01',
      nombre: 'CONTRATOS DE OBRA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.26.91',
      nombre: 'CONTRATOS DE OBRA UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.27.00',
      nombre: 'Retenci de impuesto de industria y comercio por',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.27.01',
      nombre: 'RETENCION DE IMPTO.DE INDUSTRIA Y COMERCIO POR COM',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.27.02',
      nombre: 'IMPUESTO DE AVISO Y TABLEROS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.27.03',
      nombre: 'SOBRETASA BOMBERIL',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.27.80',
      nombre: 'RETENCION DE IMPTO.DE INDUSTRIA Y COMERC BIORETO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.27.82',
      nombre: 'IMPUESTO DE AVISO Y TABLEROS BIORETO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.27.83',
      nombre: 'SOBRETASA BOMBERIL BIORETO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.27.91',
      nombre: 'RETENCION DE IMPTO.DE INDUST.Y COMERCIO UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.27.92',
      nombre: 'IMPUESTO DE AVISO Y TABLEROS UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.27.93',
      nombre: 'SOBRETASA BOMBERIL UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.30.00',
      nombre: 'IMPUESTO SOLIDARIO POR EL COVID 19',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.30.01',
      nombre: 'RETENCION IMPTO SOLIDARIO COVID 19',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.30.91',
      nombre: 'RETENCION IMPTO SOLIDARIO COVID 19 UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.90.00',
      nombre: 'Otras retenciones',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.90.01',
      nombre: 'CONTRATOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.90.02',
      nombre: 'PREMIOS POR ACTIVIDADES NO RECONOCIDAS POR GOB.GEN',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.90.03',
      nombre: 'IMPUESTO DE RENTA POR LA EQUIDADCREE',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.98.00',
      nombre: 'Impuesto de timbre',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.36.98.01',
      nombre: 'IMPUESTO DE TIMBRE',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.40',
      nombre: 'IMPUESTOS, CONTRIBUCIONES Y TASAS POR PAGAR',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.40.00.00',
      nombre: 'IMPUESTOS, CONTRIBUCIONES Y TASAS POR PAGAR',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.40.03.00',
      nombre: 'Impuesto predial unificado',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.40.03.01',
      nombre: 'PREDIAL UNIFICADO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.40.14.00',
      nombre: 'Cuota de fiscalizaci y auditaje',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.40.14.01',
      nombre: 'CUOTAS DE FISCALIZACION Y AUDITAJE',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.40.16.00',
      nombre: 'Impuesto sobre veh兤ulos automotores',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.40.16.01',
      nombre: 'IMPUESTO SOBRE VEHICULOS AUTOMOTORES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.40.24.00',
      nombre: 'Tasas',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.40.24.01',
      nombre: 'IMPUESTOS, CONTRIBUCIONES Y TASAS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.40.75.00',
      nombre: 'Otros impuestos nacionales',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.40.75.01',
      nombre: 'OTROS IMPUESTOS NACIONALES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.40.75.91',
      nombre: 'OTROS IMPUESTOS NACIONALES UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.45.00.00',
      nombre: 'IMPUESTO AL VALOR AGREGADO  IVA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.45.02.00',
      nombre: 'Venta de servicios',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.45.02.01',
      nombre: 'PARQUEADERO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.60.00.00',
      nombre: 'CRﾉDITOS JUDICIALES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.60.02.00',
      nombre: 'Sentencias',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.60.02.01',
      nombre: 'SENTENCIAS Y CONCILIACIONES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.60.02.91',
      nombre: 'SENTENCIAS Y CONCILIACIONES UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.81.00.00',
      nombre: 'ADMINISTRACIﾓN DE LA SEGURIDAD SOCIAL EN SALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.81.06.00',
      nombre: 'Incapacidades  Contributivo',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.81.06 ',
      nombre: 'Incapacidades  Contributivo',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.81.06.91',
      nombre: 'INCAPACIDADES UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.00.00',
      nombre: 'OTRAS CUENTAS POR PAGAR',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.26.00',
      nombre: 'Suscripciones',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.26.01',
      nombre: 'SUSCRIPCIONES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.27.00',
      nombre: 'Vi疸icos y gastos de viaje',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.27.01',
      nombre: 'VIATICOS Y GASTOS DE VIAJE',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.27.80',
      nombre: 'VIATICOS Y GASTOS DE VIAJE BIORETO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.27.91',
      nombre: 'VIATICOS Y GASTOS DE VIAJEUISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.28.00',
      nombre: 'Seguros',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.28.01',
      nombre: 'SEGUROS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.32.00',
      nombre: 'Cheques no cobrados o por reclamar',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.32.01',
      nombre: 'CHEQUES NO COBRADOS O POR RECLAMAR',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.50.00',
      nombre: 'Aportes al ICBF y SENA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.50.01',
      nombre: 'APORTES AL ICBF, SENA Y CAJAS DE COMPENSACION',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.50.91',
      nombre: 'APORTES AL ICBF, SENA Y CAJAS DE COMPENSACION UISA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.51.00',
      nombre: 'Servicios p炻licos',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.51.01',
      nombre: 'SERVICIOS PUBLICOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.54.00',
      nombre: 'Honorarios',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.54.01',
      nombre: 'HONORARIOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.54.02',
      nombre: 'HORAS CATEDRA',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.54.80',
      nombre: 'HONORARIOS BIORETO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.54.91',
      nombre: 'HONORARIOS UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.55.00',
      nombre: 'Servicios',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.55.01',
      nombre: 'SERVICIOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.55.02',
      nombre: 'AUXILIATURAS ESTUDIANTILES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.55.03',
      nombre: 'BECAS POSTGRADO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.55.04',
      nombre: 'TRANSPORTE Y ACARREOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.55.05',
      nombre: 'CREDITOS CONDONABLES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.55.80',
      nombre: 'SERVICIOS BIORETO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.55.82',
      nombre: 'AUXILIATURAS ESTUDIANTILESBIORETO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.55.92',
      nombre: 'AUXILIATURAS ESTUDIANTILES UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.58.00',
      nombre: 'Arrendamiento operativo',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.58.01',
      nombre: 'ARRENDAMIENTOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.90.00',
      nombre: 'OTRAS CUENTAS POR PAGAR',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.90.01',
      nombre: 'OTROS ACREEDORES',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.90.80',
      nombre: 'OTROS ACREEDORES BIORETO',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.4.90.90.90',
      nombre: 'OTROS ACREEDORES UISALUD',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.5.00.00.00',
      nombre: 'BENEFICIO A LOS EMPLEADOS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.00.00',
      nombre: 'BENEFICIOS A LOS EMPLEADOS A CORTO PLAZO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.01.00',
      nombre: 'Nina por pagar',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.01.01',
      nombre: 'NOMINA POR PAGAR PLANTA GENERAL',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.01.02',
      nombre: 'NOMINA POR PAGAR PLANTA TEMPORAL',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.01.91',
      nombre: 'NOMINA POR PAGAR PLANTA GENERAL UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.01.92',
      nombre: 'NOMINA POR PAGAR UISALUD PLANTA TEMPORAL',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.02.00',
      nombre: 'Cesant僘s',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.02.01',
      nombre: 'CESANTIAS LEY 50 Y NORMAS POSTERIORES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.02.91',
      nombre: 'CESANTIAS LEY 50 Y NORMAS POSTERIORES UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.03.00',
      nombre: 'Intereses sobre cesant僘s',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.03.01',
      nombre: 'INTERESES SOBRE CESANTIAS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.03.91',
      nombre: 'INTERESES SOBRE CESANTIAS UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.04.00',
      nombre: 'Vacaciones',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.04.01',
      nombre: 'VACACIONES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.04.91',
      nombre: 'VACACIONES UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.05.00',
      nombre: 'Prima de vacaciones',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.05.01',
      nombre: 'PRIMA DE VACACIONES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.05.91',
      nombre: 'PRIMA DE VACACIONES UISALUD N.GENERAL',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.06.00',
      nombre: 'Prima de servicios',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.06.01',
      nombre: 'PRIMA DE SERVICIOS NOMINA GENERAL',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.06.02',
      nombre: 'PRIMA DE SERVICIOS NOMINA TEMPORAL',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.06.91',
      nombre: 'PRIMA DE SERVICIOS UISALUD N. GENERAL',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.06.92',
      nombre: 'PRIMA DE SERVICIOS UISALUD N. TEMPORAL',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.07.00',
      nombre: 'Prima de navidad',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.07.01',
      nombre: 'PRIMA DE NAVIDAD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.07.91',
      nombre: 'PRIMA DE NAVIDAD UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.08.00',
      nombre: 'Licencias',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.08.01',
      nombre: 'LICENCIAS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.09.00',
      nombre: 'Bonificaciones',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.09.01',
      nombre: 'BONIFICACIONES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.10.00',
      nombre: 'Otras primas',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.10.01',
      nombre: 'OTRAS PRIMAS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.10.91',
      nombre: 'OTRAS PRIMAS UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.11.00',
      nombre: 'Aportes a riesgos laborales',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.11.01',
      nombre: 'APORTE RIESGOS LABORALES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.11.91',
      nombre: 'APORTE RIESGOS LABORALES UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.22.00',
      nombre: 'Aportes a fondos pensionales  empleador',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.22.02',
      nombre: 'APORTES A FONDOS PENSIONALES  UIS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.22.92',
      nombre: 'APORTES A FONDOS PENSIONALES UIS UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.23.00',
      nombre: 'Aportes a seguridad social en salud  empleador',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.23.02',
      nombre: 'APORTES A SEGURIDAD SOCIAL EN SALUD  UIS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.23.92',
      nombre: 'APORTES A SEGURIDAD SOCIAL EN SALUD UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.90.00',
      nombre: 'Otros beneficios a los empleados a corto plazo',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.90.01',
      nombre: 'OTROS SALARIOS Y PRESTACIONES SOCIALES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.90.02',
      nombre: 'HORAS CATEDRAOTROS SALARIOS Y PRESTACIONES SOCIAL',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.90.03',
      nombre: 'AUXILIATURAS ESTUDIANTILESOTROS SALARIOS Y PRESTA',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.90.04',
      nombre: 'CREDITOS CONDONABLESOTROS SALARIOS Y PRESTACIONES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.11.90.05',
      nombre: 'BECAS POSGRADOOTROS SALARIOS Y PRESTACIONES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.12.00.00',
      nombre: 'BENEFICIOS A LOS EMPLEADOS A LARGO PLAZO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.12.90.00',
      nombre: 'Otros beneficios a los empleados a largo plazo',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.12.90.02',
      nombre: 'CESANTIAS LEY LABORAL ANTERIOR',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.14.00.00',
      nombre: 'BENEFICIOS POSEMPLEO  PENSIONES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.14.01.00',
      nombre: 'Pensiones de jubilaci patronales',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.14.01.01',
      nombre: 'PENSIONES DE JUBILACION PATRONALES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.14.05.00',
      nombre: 'Cuotas partes de pensiones',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.14.05.01',
      nombre: 'CUOTAS PARTES DE PENSIONES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.14.10.00',
      nombre: 'C疝culo actuarial de pensiones actuales',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.14.10.01',
      nombre: 'CALCULO ACTUARIAL DE PENSIONES ACTUALES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.14.10.02',
      nombre: 'LIQUID. PROVIS. CUOTAS PARTES DE BONOS PENSIONALES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.14.12.00',
      nombre: 'C疝culo actuarial de futuras pensiones',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.14.12.01',
      nombre: 'CALCULO ACTUARIAL DE FUTURAS PENSIONES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.14.14.00',
      nombre: 'C疝culo actuarial de cuotas partes de pensiones',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.14.14.01',
      nombre: 'CALCULO ACTUARIAL DE CUOTAS PARTES DE PENSIONES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.15.00.00',
      nombre: 'OTROS BENEFICIOS POSEMPLEO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.15.02.00',
      nombre: 'Auxilio funerario',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.5.15.02.01',
      nombre: 'AUXILIO FUNERARIO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.6.00.00.00',
      nombre: 'OPERACIONES CON INSTRUMENTOS DERIVADOS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.7.00.00.00',
      nombre: 'PROVISIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '2.7.01.00.00',
      nombre: 'LITIGIOS Y DEMANDAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '2.7.01.90.00',
      nombre: 'Otros litigios y demandas',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.7.01.90.01',
      nombre: 'LITIGIOS O DEMANDAS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.7.90.00.00',
      nombre: 'PROVISIONES DIVERSAS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.7.90.90.00',
      nombre: 'Otras provisiones diversas',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '2.7.90.90.01',
      nombre: 'CESANTIAS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.7.90.90.02',
      nombre: 'INTERESES SOBRE CESANTIAS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.7.90.90.03',
      nombre: 'VACACIONES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.7.90.90.04',
      nombre: 'PRIMA DE SERVICIOS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.7.90.90.05',
      nombre: 'PRIMA DE VACACIONES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.7.90.90.06',
      nombre: 'PRIMA DE NAVIDAD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.7.90.90.07',
      nombre: 'OTRAS PRIMAS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.7.90.90.08',
      nombre: 'OTRAS PROVISIONES PARA PRESTACIONES SOCIALES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.7.90.90.12',
      nombre: 'BONIFICACION SERVICIOS PRESTADOS BSP',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.7.90.90.91',
      nombre: 'CESANTIAS UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.7.90.90.92',
      nombre: 'INTERESES SOBRE CESANTIAS UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.7.90.90.93',
      nombre: 'VACACIONES UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.7.90.90.94',
      nombre: 'PRIMA DE SERVICIOS UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.7.90.90.95',
      nombre: 'PRIMA DE VACACIONES UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.7.90.90.96',
      nombre: 'PRIMA DE NAVIDAD UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.7.90.90.97',
      nombre: 'BONIFICACION SERVICIOS PRESTADOS BSP UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.7.90.90.98',
      nombre: 'GASTOS UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.00.00.00',
      nombre: 'OTROS PASIVOS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.01.00.00',
      nombre: 'AVANCES Y ANTICIPOS RECIBIDOS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.01.01.00',
      nombre: 'Anticipos sobre ventas de bienes y servicios',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.01.01.01',
      nombre: 'ANTICIPOS SOBRE VENTAS DE BIENES Y SERVICIOS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.00.00',
      nombre: 'RECURSOS RECIBIDOS EN ADMINISTRACIﾓN',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.00',
      nombre: 'En administraci',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.01',
      nombre: 'EN ADMINISTRACION',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.03',
      nombre: 'ECOPETROL',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.04',
      nombre: 'PROY.SUMATOWARD SUSTAINABLE FIN.MANAG.OF UNIV.LAT',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.05',
      nombre: 'MINISTERIO DE EDUCACION NACIONALM.E.N.',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.06',
      nombre: 'SISTEMA GENERAL DE REGALIAS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.07',
      nombre: 'CONVENIO SUENOS DE PAZ LUMNI FUND. BANCOLOMBIA',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.08',
      nombre: 'SER PILO PAGA',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.09',
      nombre: 'BECAS IBEROAMERICANAS BCO.SDER.ESPANA ESTUDIANTES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.10',
      nombre: 'CONVENIO GOBERNACION DE SANTANDER',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.11',
      nombre: 'BANCO DE LA REPUBLICA',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.12',
      nombre: 'ENTIDADES INTERNACIONALES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.13',
      nombre: 'CONVENIO MARCO ECOPETROL 5222395 COOP.TEC.Y CIENT.',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.14',
      nombre: 'MISION TIC 2022 MINTIC',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.31',
      nombre: 'PROYECTO I:INVENTARIO DE LA DIVERSIDAD BIOLOGICA E',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.32',
      nombre: 'PROYECTO 2:ESTUDIO COMPARATIVO DE LA CARACTERIZACI',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.33',
      nombre: 'PROYECTO 3:BIOFABRICA: PROTOTIPADO DE PROCESOS DE',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.34',
      nombre: 'PROYECTO 4:EXTRACCION, CARACTERIZACION QUIMICA DE',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.35',
      nombre: 'PROYECTO 5:OBTENCION DE TERPEROS OXIFUNCIONALIZADO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.36',
      nombre: 'PROYECTO 6:APROVECHAMIENTO SOSTENIBLE DE ACEITES E',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.37',
      nombre: 'PROYECTO 7:OBTENCION DE GLICOSIDOS TERPENICOS DE A',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.38',
      nombre: 'PROYECTO 8:EVALUACION DEL POTENCIAL DE EXTRACTOS Y',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.39',
      nombre: 'PROYECTO 9:ESTUDIO POTENCIAL FARMACOLOGICO PARA DE',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.40',
      nombre: 'PROYECTO 10:DESALLO DE UN NOVEDOSO SISTEMA FARMACE',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.41',
      nombre: 'PROYECTO 11: DESARROLLO DE NUEVOS PRODUCTOS CON AC',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.42',
      nombre: 'PROYECTO 12:EVALUACION DE LAS ACTIVIDADES ANTIMICO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.43',
      nombre: 'PROYECTO 13:CARACTERIZACION CELULAR Y MOLECULAR AC',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.44',
      nombre: 'PROYECTO 14:DESARROLLO DE COSMECEUTICOS ELABORADOS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.45',
      nombre: 'PROYECTO 15:BIOPRODUCTOS PARA EL MEJORAMIENTO E IN',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.46',
      nombre: 'RENDIMIENTOS FINANCIEROS PROYECTO BIORETO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.02.01.47',
      nombre: 'GRAVAMEN MVTOS FINANCIEROS PROYEC.BIORETO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.03.00.00',
      nombre: 'DEPﾓSITOS RECIBIDOS EN GARANTﾍA',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.03.90.00',
      nombre: 'Otros depitos',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.03.90.90',
      nombre: 'OTROS DEPOSITOS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.10.00.00',
      nombre: 'INGRESOS RECIBIDOS POR ANTICIPADO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.10.01.00',
      nombre: 'Intereses',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.10.01.01',
      nombre: 'INTERESES',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.10.05.00',
      nombre: 'Arrendamiento operativo',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.10.05.01',
      nombre: 'ARRENDAMIENTOS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.10.07.00',
      nombre: 'Ventas',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.10.07.01',
      nombre: 'SERVICIOS EDUCATIVOSPREGRADO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.10.07.02',
      nombre: 'SERVICIOS EDUCATIVOSEDUC FORMAL SUPERIOR POSTGRAD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.10.07.03',
      nombre: 'SERVICIOS EDUCATIVOSIPRED',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.10.26.00',
      nombre: 'Servicios educativos',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.10.26.01',
      nombre: 'SERVICIOS EDUCATIVOSPREGRADO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.10.26.02',
      nombre: 'SERVICIOS EDUCATIVOSEDUC FORMAL SUPERIOR POSTGRAD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.10.26.03',
      nombre: 'SERVICIOS EDUCATIVOSIPRED',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.10.26.90',
      nombre: 'TRIBUTACION COOPERATIVA',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.10.90.00',
      nombre: 'Otros ingresos recibidos por anticipado',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.10.90.01',
      nombre: 'OTROS INGRESOS RECIBIDOS POR ANTICIPADO',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.10.90.94',
      nombre: 'OTROS INGRESOS RECIBIDOS POR ANTICIPADO UISALUD',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.90.00.00',
      nombre: 'OTROS PASIVOS DIFERIDOS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.90.02.00',
      nombre: 'Ingreso diferido por transferencias condicionadas',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.90.02.01',
      nombre: 'MINCIENCIASCOLCIENCIAS',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.90.02.02',
      nombre: 'FIDUPREVISORAPATR.AUTONOMO FDO.FRANCISCO JOSE DE',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.90.02.03',
      nombre: 'SPGR DRLLO.SISTEMA DE OPTICO COMPUTACIONAL 8933',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.90.02.04',
      nombre: 'SPGR DRLLO.FORTALECIMTO.CAPAC.INSTITUCIONAL 8931',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.90.02.05',
      nombre: 'SPGR DRLLO.PILOTO OBTENCION EDULCORANTES 8936',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.90.02.06',
      nombre: 'SPGR PLATAFORMA ESTUDIOS CELULARES 8934',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.90.02.07',
      nombre: 'SPGR DRLLO.PROTOTIPO SELECT.Y SENSIBLE CADMIO 8932',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.90.02.08',
      nombre: 'SPGR DRLLO.PILOTO REMOCION CADMIO GRANOS CACAO8937',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.90.02.09',
      nombre: 'SPGR ESTRATEGIA DE EDUCACIﾓN FLEXIBLE 8935',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.90.02.10',
      nombre: 'SPGR FORMACION DE CAPITAL HUMANO II 8938',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.90.02.11',
      nombre: 'SPGR DRLLO.AGROINDUST.PLANTA AROMATICAS 8883',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.90.02.12',
      nombre: 'SPGR FORMAC.CAPITAL HUMANO ALTO NIVEL 8939',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.90.02.13',
      nombre: 'SPGR CONTRUCC.EDIFICIO AULAS SEDE SOCORRO 8887',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.90.02.14',
      nombre: 'SPGR.FORTALEC.CAPAC.INSTAL.EPIDEMIOL.MOLEC 8893',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.90.02.15',
      nombre: 'SPGR.INCREM.COMPETITIV.SECTOR CACAO 8940',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.90.02.16',
      nombre: 'SPGR.PRODUCCION NUCLEOTIDOS 8941',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.90.02.17',
      nombre: 'SPGR.ESTRATEG.MANEJO AGUAS RESIDUAL 8942',
      corriente: 'true',
      noCorriente: 'true',
    },
    {
      codigo: '2.9.90.02.21',
      nombre: 'FIDUCOLDEXPATR.AUTONOMO FDO.FRANC.JOSE DE CALDAS',
      corriente: 'true',
      noCorriente: 'false',
    },
    {
      codigo: '3.0.00.00.00',
      nombre: 'PATRIMONIO',
      corriente: 'false',
      noCorriente: 'false',
    },
    {
      codigo: '3.1',
      nombre: 'PATRIMONIO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.05.00.00',
      nombre: 'CAPITAL FISCAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.05.06.00',
      nombre: 'Capital Fiscal',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.05.06.01',
      nombre: 'CAPITAL FISCAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.05.06.02',
      nombre: 'AJUSTES POR INFLACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.05.06.07',
      nombre: 'EFECTO DEL SANEAMIENTO CONTABLE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.05.06.08',
      nombre: 'AMORTIZACION ACUMULADA VIAS DE COMUNICACIﾓN Y ACCE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.05.06.09',
      nombre: 'RESULTADOS DE EJERCICIOS ANTERIORES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.05.06.10',
      nombre: 'PATRIMONIO INSTITUCIONAL INCORPORADO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.05.06.11',
      nombre: 'SUPERAVIT POR DONACIONES: EN DINERO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.05.06.12',
      nombre: 'SUPERAVIT POR DONACIONES: EN ESPECIE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.05.06.13',
      nombre: 'SUPERAVIT POR DONACIONES: EN DERECHOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.05.06.14',
      nombre: 'PATRIMONIO INSTITUCIONAL INCORPORADO: BIENES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.05.06.15',
      nombre: 'PATRIMONIO INSTITUCIONAL INCORPORADO: DERECHOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.05.06.35',
      nombre: 'DONACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.05.06.90',
      nombre: 'RESULTADOS DE EJERCICIOS ANTERIORES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.05.06.91',
      nombre: 'PATRIMONIO INSTITUCIONAL INCORPORADO CAPRUIS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.09.00.00',
      nombre: 'RESULTADOS DE EJERCICIOS ANTERIORES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.09.01.00',
      nombre: 'EXCEDENTES ACUMULADOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.09.01.01',
      nombre: 'UTILIDAD O EXCEDENTES ACUMULADOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.09.01.02',
      nombre: 'IMPACTO POR LA TRANSICION AL NUEVO MARCO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.09.01.12',
      nombre: 'INVERSIONES E INSTRUMENTOS DERIVADOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.09.01.13',
      nombre: 'CUENTAS POR COBRAR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.09.01.14',
      nombre: 'CUENTAS POR COBRAR UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.09.01.16',
      nombre: 'PROPIEDAD,PLANTA Y EQUIPO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.09.01.19',
      nombre: 'OTROS ACTIVOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.09.01.24',
      nombre: 'CUENTAS POR PAGAR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.09.01.25',
      nombre: 'BENEFICIO A LOS EMPLEADOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.09.01.27',
      nombre: 'PROVISIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.09.01.29',
      nombre: 'OTROS PASIVOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.09.01.48',
      nombre: 'INGRESOS DIVERSOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.09.01.52',
      nombre: 'COSTOS Y GASTOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.09.01.58',
      nombre: 'OTROS GASTOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.09.01.73',
      nombre: 'SERVICIOS DE SALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.09.01.76',
      nombre: 'PROPIEDAD,PLANTA Y EQUIPO UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.09.01.91',
      nombre: 'UTILIDAD O EXCEDENTES ACUMULADOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.09.01.92',
      nombre: 'IMPACTO POR LA TRANSICION AL NUEVO MARCO UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.10.00.00',
      nombre: 'RESULTADO DEL EJERCICIO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.10.01.00',
      nombre: 'Excedente del ejercicio',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.10.01.01',
      nombre: 'UTILIDAD O EXCEDENTE DEL EJERCICIO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.10.01.91',
      nombre: 'UTILIDAD O EXCEDENTE DEL EJERCICIO UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.00.00',
      nombre: 'IMPACTOS POR LA TRANSICIﾓN AL NUEVO MARCO DE REGUL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.02.00',
      nombre: 'Inversiones e instrumentos derivados',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.02.01',
      nombre: 'INVERSIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.02.91',
      nombre: 'INVERSIONES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.03.00',
      nombre: 'Cuentas por cobrar',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.03.01',
      nombre: 'PRESTACION DE SERVICIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.03.70',
      nombre: 'CUOTAS PARTES DE PENSION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.03.90',
      nombre: 'OTROS DEUDORES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.06.00',
      nombre: 'Propiedades, planta y equipo',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.06.01',
      nombre: 'EQUIPOS, MAQUINARIA, MUEBLES Y ENSERES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.06.05',
      nombre: 'TERRENOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.06.15',
      nombre: 'CONSTRUCCI EN CURSO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.06.17',
      nombre: 'BIENES HISTICOS Y CULTURALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.06.40',
      nombre: 'EDIFICACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.06.82',
      nombre: 'PROPIEDADES DE INVERSION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.06.85',
      nombre: 'DEPRECIACI EQUIPOS, MAQUINARIA, MUEBLES Y ENSERE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.06.86',
      nombre: 'DEPRECIACI CONSTRUCCIONES Y EDIFICACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.06.90',
      nombre: 'EQUIPOS, MAQUINARIA, MUEBLES Y ENSERES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.06.91',
      nombre: 'DEPRECIACI EQUIPOS, MAQUINARIA, MUEBLES Y ENSERE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.09.01.28',
      nombre: 'PROVISIONES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.07.00',
      nombre: 'Activos intangibles',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.07.70',
      nombre: 'LICENCIAS Y PATENTES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.07.71',
      nombre: 'LICENCIAS Y PATENTES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.07.75',
      nombre: 'AMORTIZACION LICENCIAS Y PATENTES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.07.76',
      nombre: 'AMORTIZACION LICENCIAS Y PATENTES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.10.00',
      nombre: 'Bienes de uso p炻lico',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.10.07',
      nombre: 'LIBROS Y PUBLICACIONES DE INVESTIGACION Y CONSULTA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.12.00',
      nombre: 'Otros activos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.12.01',
      nombre: 'OTROS BIENES Y SERVICIOS PAGADOS POR ANTICIPADO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.12.23',
      nombre: 'ENTRENAMIENTO DE PERSONAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.12.91',
      nombre: 'OTROS BIENES Y SERVIC.PAGADOS ANTICIP.UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.15.00',
      nombre: 'Cuentas por pagar',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.15.01',
      nombre: 'RECURSOS RECIBIDOS EN ADMINISTRACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.15.02',
      nombre: 'CUENTAS POR PAGAR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.15.53',
      nombre: 'RECURSOS RECIBIDOS EN ADMINISTRACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.16.00',
      nombre: 'Beneficios a empleados',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.16.01',
      nombre: 'PROVISION VACACIONES Y BSP',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.16.05',
      nombre: 'CESANT褜S LEY ANTERIOR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.90.00',
      nombre: 'Otros impactos por transici',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.90.02',
      nombre: 'AJUSTES POR INFLACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.90.08',
      nombre: 'EFECTO SANEAMIENTO CONTABLE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.90.35',
      nombre: 'DONACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.45.90.53',
      nombre: 'RECURSOS EN ADMINISTRACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.51.00.00',
      nombre: 'GANANCIAS O PﾉRDIDAS POR PLANES DE BENEFICIOS A LO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.51.01.00',
      nombre: 'Ganancias o p駻didas actuariales por planes de ben',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '3.1.51.01.02',
      nombre: 'PERDIDA ACTUARIALES PLANES BENEFIC.POSEMPLEO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.0.00.00.00',
      nombre: 'INGRESOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.2.10.00.00',
      nombre: 'BIENES COMERCIALIZADOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.2.10.60.00',
      nombre: 'Medicamentos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.2.10.60.91',
      nombre: 'MEDICAMENTOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.00.00.00',
      nombre: 'VENTA DE SERVICIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.00.00',
      nombre: 'SERVICIOS EDUCATIVOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.14.00',
      nombre: 'Educaci formal  Superior formaci profesional',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.14.01',
      nombre: 'INSCRIPCIONES PREGRADO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.14.02',
      nombre: 'MATRICULAS PREGRADO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.14.03',
      nombre: 'DERECHOS DE SALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.14.04',
      nombre: 'DERECHOS ACADEMICOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.14.05',
      nombre: 'HABILITACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.14.06',
      nombre: 'CURSOS DE  VACACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.14.07',
      nombre: 'CURSOS DE NIVELACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.14.08',
      nombre: 'PROGRAMA SER PILO PAGA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.15.00',
      nombre: 'Educaci formal  Superior postgrados',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.15.01',
      nombre: 'INSCRIPCIONES POSTGRADO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.15.02',
      nombre: 'MATRICULAS POSTGRADO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.15.03',
      nombre: 'DERECHOS DE SALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.15.04',
      nombre: 'DERECHOS ACADEMICOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.15.05',
      nombre: 'VALIDACION POR INSUFICIENCIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.27.00',
      nombre: 'Educaci no formal  Formaci extensiva',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.27.01',
      nombre: 'SEMINARIOS Y OTROS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.27.02',
      nombre: 'CURSOS DE CAPACITACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.27.03',
      nombre: 'DIPLOMADOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.50.00',
      nombre: 'Servicios conexos a la educaci',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.50.01',
      nombre: 'PRODUCTO COMEDORES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.50.02',
      nombre: 'RESIDENCIAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.50.03',
      nombre: 'DERECHOS DE GRADO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.50.04',
      nombre: 'CERTIFICADOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.50.05',
      nombre: 'BONOS SIDES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.50.06',
      nombre: 'ESTUDIOS DE TRANSFERENCIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.50.07',
      nombre: 'REGISTRO DIPLOMA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.50.08',
      nombre: 'SERVICIOS MEDICOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.50.09',
      nombre: 'PRUEBAS DE LABORATORIO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.50.10',
      nombre: 'PRODUCTO FUENTE DE SODA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.50.11',
      nombre: 'UTILIDAD FONDO ROTATORIO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.50.12',
      nombre: 'PUBLICIDAD Y PROPAGANDA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.50.13',
      nombre: 'CURSOS INTERSEMESTRALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.50.14',
      nombre: 'EVALUACION DE MERITOS PROFESIONALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.50.15',
      nombre: 'PRUEBAS DE LABORATORIO PCR COVID 19',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.50.16',
      nombre: 'EVENTOS ACADEM. OLIMPIADAS MATEMATICAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.05.50.18',
      nombre: 'PRODUCTOS DE PLANIFICACIﾓN FAMILIAR B.U.',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.11.00.00',
      nombre: 'ADMINISTRACIﾓN DEL SISTEMA DE SEGURIDAD SOCIAL EN',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.11.05.00',
      nombre: 'Cuotas de inscripci y afiliaci r馮imen contrib',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.11.05.01',
      nombre: 'APORTE POSSEGUNDOS EMPLEADOS (70%)UISALUD 9701',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.11.05.02',
      nombre: 'APORTE POSSEGUNDOS EMPLEADOS (30%)UISALUD 9702',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.11.05.11',
      nombre: 'APORTE POSINDEPENDIENTES (70%) UISALUD 9701',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.11.05.12',
      nombre: 'APORTE POSINDEPENDIENTES (30%) UISALUD 9702',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.11.05.91',
      nombre: 6.5,
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.11.05.92',
      nombre: 0.5,
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.11.05.93',
      nombre: 4,
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.11.05.94',
      nombre: 10.5,
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.11.05.95',
      nombre: 11,
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.11.05.96',
      nombre: 0.5,
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.11.05.97',
      nombre: 2,
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.11.05.98',
      nombre: 0.5,
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.11.05.99',
      nombre: 1,
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.11.90.00',
      nombre: 'Otros ingresos por la administraci del sistema d',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.11.90.91',
      nombre: 'VALES ASISTENCIALES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.11.90.94',
      nombre: 'SERVICIOS DE RED UNIVERSITARIA UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.11.90.95',
      nombre: 'OTROS INGRESOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.11.90.97',
      nombre: 'RECOBROS ARL UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.12.00.00',
      nombre: 'SERVICIOS DE SALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.12.17.00',
      nombre: 'Servicios ambulatorios  Consulta externa y proced',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.12.17.91',
      nombre: 'MEDICINA GENERAL EN PLANTA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.12.18.00',
      nombre: 'Servicios ambulatorios  Consulta especializada',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.12.18.91',
      nombre: 'ESPECIALISTAS EN PLANTA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.12.19.00',
      nombre: 'Servicios ambulatorios  Salud oral',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.12.19.91',
      nombre: 'ODONTOLOGIA GENERAL EN PLANTA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.12.21',
      nombre: 'Servicios ambulatorios  Otras actividades extramu',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.12.21.91',
      nombre: 'ENFERMERIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.90.00.00',
      nombre: 'OTROS SERVICIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.90.07',
      nombre: 'Publicidad y propaganda',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.90.07.01',
      nombre: 'PUBLICACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.90.30.00',
      nombre: 'Servicios de parqueadero',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.90.30',
      nombre: 'Servicios de parqueadero',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.90.30.08',
      nombre: 'SERVICIO DE PARQUEADERO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.95.00.00',
      nombre: 'DEVOLUCIONES, REBAJAS Y DESCUENTOS EN VENTA DE SER',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.95.01',
      nombre: 'Servicios educativos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.95.01.01',
      nombre: 'MATRICULAS PREGRADO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.95.01.02',
      nombre: 'MATRICULAS POSTGRADO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.95.01.03',
      nombre: 'EDUCACION NO FORMAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.95.01.04',
      nombre: 'CURSOS DE VACACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.95.01.05',
      nombre: 'DERECHOS DE GRADO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.95.01.50',
      nombre: 'SERVICIOS CONEXOS A LA EDUCACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.95.01.90',
      nombre: 'DEVOLUC.REBAJAS.DSCTOS.UISALUD(DB)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.95.12',
      nombre: 'Servicios de salud',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.95.12.91',
      nombre: 'SERVICIOS DE SALUDUISALUD.',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.95.12.92',
      nombre: 'GLOSASSERVICIOS DE SALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.95.90.00',
      nombre: 'Otros servicios',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.95.90.07',
      nombre: 'PUBLICACIONESTIENDA UNIVERSITARIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.3.95.90.08',
      nombre: 'INGRESOS DIVERSOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.00.00.00',
      nombre: 'TRANSFERENCIAS Y SUBVENCIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.13.00.00',
      nombre: 'SISTEMA GENERAL DE REGALIAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.13.02.00',
      nombre: 'PARA PROYECTOS DE CIENCIA,TECNOLOG褜 E INNOVACIﾓN',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.13.02.01',
      nombre: 'MINISTERIO DE HACIENDA Y CREDITO PUBLICO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.13.02.02',
      nombre: 'DEPARTAMENTO DE SANTANDER',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.00.00',
      nombre: 'OTRAS TRANSFERENCIAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.02.00',
      nombre: 'Para proyectos de inversi',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.02.01',
      nombre: 'MINCIENCIAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.02.02',
      nombre: 'ECOPETROL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.02.03',
      nombre: 'MINISTERIO DE EDUCACIﾓN NACIONAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.02.04',
      nombre: 'MINISTERIO DE CULTURA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.02.05',
      nombre: 'GOBERNACION DE SANTANDER',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.02.06',
      nombre: 'M.H.C.P.RECURSOS IMPUESTO CREE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.02.07',
      nombre: 'PARA PROYECTOS DE INVERS.ESTAMPILLA PROUNAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.03.00',
      nombre: 'Para gastos de funcionamiento',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.03.01',
      nombre: 'MINISTERIO DE EDUCACION NACIONAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.03.03',
      nombre: 'GOBERNACION DE SANTANDER',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.03.04',
      nombre: 'PARA GASTOS DE FUNCIONAMIENTODSCTO.POR VOTACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.05.00',
      nombre: 'Para programas de educaci',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.05.01',
      nombre: 'PARA PROGRAMAS DE EDUCACIONIPC',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.05.02',
      nombre: 'PARA PROGRAMAS DE EDUCACIONDCTO POR VOTACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.05.03',
      nombre: 'PARA PROGRAMAS DE EDUCACIONCESU',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.05.04',
      nombre: 'PARA PROGRAMAS DE EDUCACIONESTAMPILLAS PROUIS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.05.05',
      nombre: 'PARA PROGRAMAS DE EDUCACIONTRIBUTACION COOPERATIV',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.05.06',
      nombre: 'PARA PROGRAMAS DE EDUCACIONOTROS APORTES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.07.00',
      nombre: 'Bienes recibidos sin contraprestaci',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.07.01',
      nombre: 'PROPIEDAD PLANTA Y EQUIPO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.30.00',
      nombre: 'BIENES,DERECHOS,RECUR.EFECT.PROCED.SECTOR PRIVADO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.30.01',
      nombre: 'BIENES,DERECHOS Y RECURSOSDONACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.90.00',
      nombre: 'Otras transferencias',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.90.01',
      nombre: 'UNIVERSIDAD DE ANTIOQUIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.90.02',
      nombre: 'SISTEMA GENERAL DE REGALIASCACAO 8860 F15',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.90.03',
      nombre: 'SISTEMA GENERAL DE REGALIASSEDE F/BLANCA 8592',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.90.04',
      nombre: 'GOBERNACION DE SANTANDER',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.90.05',
      nombre: 'APORTES O SUBSIDIOS  PROYECTOS SIN CONTRAPRESTACIO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.90.06',
      nombre: 'MINISTERIO DE EDUCACION NACIONAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.90.07',
      nombre: 'SISTEMA GENERAL DE REGALIASGECT II 8006',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.90.08',
      nombre: 'SISTEMA GENERAL DE REGALIASPROY.AROMATICAS 8883',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.90.09',
      nombre: 'COLCIENCIAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.90.10',
      nombre: 'SISTEMA GENERAL REGALIAS CAPITAL HUMANO 8889',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.90.11',
      nombre: 'SISTEMA GENERAL REGALIAS BIOCERAS 8890',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.90.12',
      nombre: 'SPGR CONTRUCC.EDIFICIO AULAS SEDE SOCORRO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.90.13',
      nombre: 'SPGR.FORTALEC.CAPAC.INSTAL.EPIDEMIOL.MOLEC 8896',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.90.15',
      nombre: 'SPGR DRLLO.PROTOTIPO SELECT.Y SENSIBLE CADMIO 8932',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.90.16',
      nombre: 'SPGR DRLLO.SISTEMA DE OPTICO COMPUTACIONAL 8933',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.90.17',
      nombre: 'SPGR PLATAFORMA ESTUDIOS CELULARES 8934',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.90.18',
      nombre: 'SPGR ESTRATEGIA DE EDUCACIﾓN FLEXIBLE 8935',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.90.19',
      nombre: 'SPGR DRLLO.PILOTO OBTENCION EDULCORANTES 8936',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.90.20',
      nombre: 'SPGR CONTRUCC.EDIFICIO AULAS SEDE SOCORRO 8887',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.90.21',
      nombre: 'SPGR FORMACION DE CAPITAL HUMANO II 8938',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.90.22',
      nombre: 'SPGR FORMAC.CAPITAL HUMANO ALTO NIVEL 8939',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.90.23',
      nombre: 'SPGR DRLLO.FORTALECIMTO.CAPAC.INSTITUCIONAL 8931',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.90.24',
      nombre: 'SPGR DRLLO.PILOTO REMOCION CADMIO GRANOS CACAO8937',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.90.25',
      nombre: 'SPGR.INCREM.COMPETITIV.SECTOR CACAO 8940',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.90.26',
      nombre: 'SPGR.PRODUCCION NUCLEOTIDOS 8941',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.90.27',
      nombre: 'SPGR.ESTRATEG.MANEJO AGUAS RESIDUAL 8942',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.90.89',
      nombre: 'BIENES EN ESPECIE RECIB.EMPRESA PUBLICACONVENIO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.28.90.90',
      nombre: 'OTRAS TRANSFERENCIAS SPGR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.4.30.05.01',
      nombre: 'LOCALSUBVENC.POR RECURSOS TRANSF.SPGRCACAO 8860',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.7.05.08.00',
      nombre: 'Funcionamiento',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.7.05.08.01',
      nombre: 'DEVOLUCION IVA DIAN IES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.00.00.00',
      nombre: 'OTROS INGRESOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.00.00',
      nombre: 'FINANCIEROS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.11.00',
      nombre: 'RENDIM.EFECTIVO INVERS.DE ADMON.DE LIQUID.COSTO AM',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.11.91',
      nombre: 'RENDIMIENTOS COSTO AMORTIZ.9701 FDO.ASEGURADOR UIS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.11.93',
      nombre: 'RENDIMIENTOS COSTO AMORTIZ.9703 FDO ALTO COSTO Y P',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.11.94',
      nombre: 'RENDIMIENTOS COSTO AMORTIZ.9704 FDO.RVA.REC.UIS AS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.11.95',
      nombre: 'RENDIMIENTOS COSTO AMORTIZ.9705 FDO.RVA.REC.PROPIO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.13.00',
      nombre: 'Intereses, dividendos y participaciones de inversi',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.13.01',
      nombre: 'ACCIONES DE PARTICIPACIONES DE INVERSION AL COSTO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.16.00',
      nombre: 'GCIA.POR VALORAC.INSTRUMENT.DERIV.VR.MCDO.VR.RAZON',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.16.02',
      nombre: 'REND.E INVER.ADMON.LIQUIDEZ A COSTO AMORTIZADO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.16.91',
      nombre: 'REND.INVER.COSTO AMORTIZ.FDO.ASEGURADOR,FDO PRESTA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.16.93',
      nombre: 'REND.INVER.COSTO AMORTIZ.FDO ALTO COSTO Y PROMOC Y',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.16.94',
      nombre: 'REND.INVER.COSTO AMORTIZ.FDO RESERVA RECURSOS UIS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.16.95',
      nombre: 'REND.INVER.COSTO AMORTIZ.FDO RESERVA RECURSOS PROP',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.16.97',
      nombre: 'GANANC. V/R MCDO.FDO ALTO COSTO Y PROMOC Y PREV',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.16.98',
      nombre: 'GANANC. V/R MCDO. FONDO RESERVA RECURSOS UIS UISAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.16.99',
      nombre: 'GANANC. V/R MCDO. FONDO RESERVA RECURSOS PROPIOS U',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.20.00',
      nombre: 'Ganancia por baja en cuentas de cuentas por cobrar',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.20.01',
      nombre: 'EMBARGOS JUDICIALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.32.00',
      nombre: 'Rendimientos sobre recursos entregados en administ',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.32.01',
      nombre: 'RENDIMIENTOS ENCARGO FIDUC.PENSIONES BONO TIPO B',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.32.02',
      nombre: 'RENDTOS.ENCARGO FIDUC.PENSIONES BONOS TIPO BEFEC',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.33.00',
      nombre: 'Intereses de mora',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.33.01',
      nombre: 'INTERESES DE MORA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.33.02',
      nombre: 'INTERESES DE MORA  DIAN',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.90.00',
      nombre: 'Otros ingresos financieros',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.90.01',
      nombre: 'OTROS INGRESOS FINANCIEROS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.90.02',
      nombre: 'INTERESES Y RENDIMIENTOS DE DEUDORES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.90.03',
      nombre: 'N/A',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.90.04',
      nombre: 'N/A',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.90.91',
      nombre: 'RENDIMIENTOS FDO.ASEGURADOR Y FONDO PRESTADOR UISA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.90.92',
      nombre: 'OTROS INGRESOS FINANCIEROS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.90.94',
      nombre: 'RENDIMIENTOS FONDO RESERVA RECURSOS UIS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.02.90.96',
      nombre: 'DESCUENTOS POR PRONTO PAGO UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.00.00',
      nombre: 'INGRESOS DIVERSOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.03.00',
      nombre: 'Cuotas partes de pensiones',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.03.01',
      nombre: 'CUOTAS PARTES DE PENSIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.05.00',
      nombre: 'GANANCIA POR BAJA EN CUENTAS DE ACTIVOS NO FINANCI',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.05.01',
      nombre: 'UTILIDAD EN VENTA DE ACTIVOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.05.02',
      nombre: 'UTILIDAD EN VENTA DE PROPIEDADES,PLANTA Y EQUIPO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.07.00',
      nombre: 'Margen en la comercializaci de bienes y servicio',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.07.01',
      nombre: 'MARGEN COMERCIALIZACION BIENES Y SERVICIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.07.91',
      nombre: 'MARGEN COMERCIALIZACION BIENES Y SERV.UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.08.00',
      nombre: 'Honorarios',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.08.01',
      nombre: 'HONORARIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.08.02',
      nombre: 'SERVICIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.09.00',
      nombre: 'Excedentes financieros',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.09.01',
      nombre: 'EXCEDENTES FINANCIEROS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.13.00',
      nombre: 'Comisiones',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.13.01',
      nombre: 'COMISIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.17.00',
      nombre: 'Arrendamiento operativo',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.17.01',
      nombre: 'ARRENDAMIENTOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.25.00',
      nombre: 'Sobrantes',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.25.01',
      nombre: 'SOBRANTES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.25.91',
      nombre: 'SOBRANTES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.27.00',
      nombre: 'Aprovechamientos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.27.01',
      nombre: 'VENTA DE MATERIAL DE RECICLAJE E INSERVIBLE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.28.00',
      nombre: 'Indemnizaciones',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.28.01',
      nombre: 'INDEMNIZACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.28.02',
      nombre: 'INCAPACIDADES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.28.03',
      nombre: 'SENTENCIAS CONDENATORIAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.28.04',
      nombre: 'INCUMPLIMIENTO DE CONTRATOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.28.92',
      nombre: 'INCAPACIDADES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.60.00',
      nombre: 'SENTENCIAS A FAVOR DE LA ENTIDAD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.60.01',
      nombre: 'FALLO JUDICIALPERJUICIOS A FAVOR ENTIDAD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.90.00',
      nombre: 'Otros ingresos diversos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.90.01',
      nombre: 'OTROS INGRESOS ORDINARIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.90.02',
      nombre: 'PATENTES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.90.03',
      nombre: 'INCUMPLIMIENTO DE BECAS DE SOSTENIMIENTO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.90.04',
      nombre: 'VENTA DE PLIEGOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.90.05',
      nombre: 'MULTAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.90.06',
      nombre: 'APORTE O SUBSIDIOS PROYECTOS CONTRAPRESTACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.90.07',
      nombre: 'AVALUO PROPIEDAD PLANTA Y EQUIPO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.90.08',
      nombre: 'OTROS ING.ORD.ESTAMPILLA PROUIS VIG.ANTERIOR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.90.09',
      nombre: 'RECUPERACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.90.10',
      nombre: 'TRASLADO RECIBIDO DE UISALUD POR GTOS.FUNCIONAMIEN',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.90.11',
      nombre: 'TRASLADO PUBLICACIONES A TIENDA UNIVERSITARIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.90.12',
      nombre: 'GANANCIA POR BAJA DE CTAS DE ACTIVOS FINANCIEROS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.90.91',
      nombre: 'OTROS INGRESOS ORDINARIOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.90.93',
      nombre: 'OTROS INGRESOS DIVERSOS TRIBUTACION COOPERATIVAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.90.97',
      nombre: 'AVALUO PROPIEDAD PLANTA Y EQUIPO UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.90.98',
      nombre: 'TRASLADO RECIBIDO UIS PARA GTOS FUNCIONAMIENTO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.08.90.99',
      nombre: 'RECUPERACIONES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.30.00.00',
      nombre: 'REVERSIﾓN DE LAS PﾉRDIDAS POR DETERIORO DE VALOR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.30.02.00',
      nombre: 'Cuentas por cobrar',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.30.02.01',
      nombre: 'PRESTACION DE SERVICIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.30.02.02',
      nombre: 'OTROS DEUDORES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.30.02.03',
      nombre: 'TRANSFERENCIAS POR COBRAR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.30.02.91',
      nombre: 'PRESTACION DE SERVICIOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.30.06.00',
      nombre: 'Propiedades, planta y equipo',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.30.06.01',
      nombre: 'TERRENOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.31.00.00',
      nombre: 'REVERSION DE PROVISIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.31.01.00',
      nombre: 'LITIGIOS Y DEMANDAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.31.01.01',
      nombre: 'CIVIL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '4.8.31.01.02',
      nombre: 'ADMINISTRATIVAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.0.00.00.00',
      nombre: 'GASTOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.00.00.00',
      nombre: 'DE ADMINISTRACIﾓN Y OPERACIﾓN',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.00.00',
      nombre: 'SUELDOS Y SALARIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.01.00',
      nombre: 'Sueldos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.01.01',
      nombre: 'SUELDOS DEL PERSONAL DIRECTIVO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.01.02',
      nombre: 'SUELDOS DEL PERSONAL DOCENTE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.01.03',
      nombre: 'SUELDOS DEL PERSONAL ASESORES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.01.04',
      nombre: 'SUELDOS DEL PERSONAL EJECUTIVO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.01.05',
      nombre: 'SUELDOS DEL PERSONAL PROFESIONAL ADMINISTRATIVO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.01.06',
      nombre: 'SUELDOS DEL PERSONAL TECNICO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.01.07',
      nombre: 'SUELDOS DEL PERSONAL ADMINISTRATIVO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.01.08',
      nombre: 'SUELDOS DEL PERSONAL OPERATIVO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.01.09',
      nombre: 'PRIMA TECNICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.01.10',
      nombre: 'SUELDOS DEL PERSONAL PROFESIONAL ADMINISTR.TEMPORA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.01.11',
      nombre: 'SUELDOS DEL PERSONAL ADMINISTRATIVO TEMPORAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.01.12',
      nombre: 'SUELDOS DEL PERSONAL TECNICO TEMPORAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.01.13',
      nombre: 'SUELDOS DEL PERSONAL OPERATIVO TEMPORAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.01.80',
      nombre: 'SUELDOS PERSONAL PROFES ADMINISTR TEMPORAL UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.01.81',
      nombre: 'SUELDOS DEL PERSONAL ADMINISTR TEMPORAL UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.01.94',
      nombre: 'SUELDOS DEL PERSONAL EJECUTIVO UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.01.95',
      nombre: 'SUELDOS PERSONAL PROFESION.ADMON UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.01.97',
      nombre: 'SUELDOS DEL PERSONAL ADMON. UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.03.00',
      nombre: 'Horas extras y festivos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.03.01',
      nombre: 'HORAS EXTRAS Y FESTIVOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.03.91',
      nombre: 'HORAS EXTRAS Y FESTIVOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.05.00',
      nombre: 'Gastos de representaci',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.05.01',
      nombre: 'GASTOS DE REPRESENTACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.10.00',
      nombre: 'Prima t馗nica',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.10.09',
      nombre: 'PRIMA TECNICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.19.00',
      nombre: 'Bonificaciones',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.19.01',
      nombre: 'BONIFICACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.19.91',
      nombre: 'BONIFICACIONES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.23.00',
      nombre: 'Auxilio de transporte',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.23.01',
      nombre: 'AUXILIO DE TRANSPORTE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.23.91',
      nombre: 'AUXILIO DE TRANSPORTE UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.60.00',
      nombre: 'Subsidio de alimentaci',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.60.01',
      nombre: 'SUBSIDIO DE ALIMENTACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.01.60.91',
      nombre: 'SUBSIDIO DE ALIMENTACION UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.02.00.00',
      nombre: 'CONTRIBUCIONES IMPUTADAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.02.01.00',
      nombre: 'Incapacidades',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.02.01.01',
      nombre: 'INCAPACIDADES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.02.01.91',
      nombre: 'INCAPACIDADES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.02.02.00',
      nombre: 'Subsidio familiar',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.02.02.01',
      nombre: 'SUBSIDIO FAMILIAR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.02.02.91',
      nombre: 'SUBSIDIO FAMILIAR UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.02.90.00',
      nombre: 'Otras contribuciones imputadas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.02.90.01',
      nombre: 'AMORTIZACION CALCULO ACTUARIAL PENSIONES ACTUALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.02.90.02',
      nombre: 'AMORTIZ.CALC.ACTUARIAL DE CUOTAS PARTES DE PENSION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.02.90.05',
      nombre: 'CUOTAS PARTES DE BONOS PENSIONALES EMITIDOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.02.90.06',
      nombre: 'AUXILIO EDUCATIVO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.02.90.07',
      nombre: 'AUXILIO DE CONECTIVIDAD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.02.90.08',
      nombre: 'AUXILIO Y SERVICIOS FUNERARIOS PERSONAL ACTIVO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.02.90.96',
      nombre: 'AUXILIO EDUCATIVO UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.02.90.97',
      nombre: 'AUXILIO DE CONECTIVIDAD UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.03.00.00',
      nombre: 'CONTRIBUCIONES EFECTIVAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.03.03.00',
      nombre: 'Cotizaciones a seguridad social en salud',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.03.03.01',
      nombre: 'COTIZACIONES A SEGURIDAD SOCIAL EN SALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.03.03.91',
      nombre: 'COTIZAC.SEGURIDAD SOCIAL EN SALUD UIS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.03.04.00',
      nombre: 'Aportes sindicales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.03.04.01',
      nombre: 'APORTES SINDICALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.03.05.00',
      nombre: 'Cotizaciones a riesgos laborales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.03.05.01',
      nombre: 'COTIZACIONES A RIESGOS PROFESIONALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.03.05.91',
      nombre: 'COTIZACIONES A RIESGOS PROFESIONALES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.03.06.00',
      nombre: 'Cotizaciones a entidades administradoras del r馮im',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.03.06.01',
      nombre: 'COTIZACIONES A ENTID.ADMIN.DEL REG.DE PRIMA MEDIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.03.06.91',
      nombre: 'COTIZAC.A ENTID.ADMIN.DEL REG.DE PRIMA MEDIA UISAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.03.07.00',
      nombre: 'Cotizaciones a entidades administradoras del r馮im',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.03.07.01',
      nombre: 'COTIZACIONES A ENTID.ADMIN.DEL REG.DE AHORRO INDIV',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.03.07.91',
      nombre: 'COTIZAC A ENTID. ADMIN.REG.DE AHORRO INDIV UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.03.90.00',
      nombre: 'Otras contribuciones efectivas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.03.90.01',
      nombre: 'APORTES  FAVUIS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.03.90.02',
      nombre: 'APOYO O SUBSIDIOS A OTROS ORGANISMOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.04.00.00',
      nombre: 'APORTES SOBRE LA NﾓMINA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.04.01.00',
      nombre: 'Aportes al ICBF',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.04.01.01',
      nombre: 'APORTES AL I.C.B.F.',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.04.01.91',
      nombre: 'APORTES AL ICBF UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.07.00.00',
      nombre: 'PRESTACIONES SOCIALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.07.01.00',
      nombre: 'Vacaciones',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.07.01.01',
      nombre: 'VACACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.07.01.91',
      nombre: 'VACACIONES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.07.02.00',
      nombre: 'Cesant僘s',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.07.02.01',
      nombre: 'CESANTIAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.07.02.91',
      nombre: 'CESANTIAS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.07.03.00',
      nombre: 'Intereses a las cesant僘s',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.07.03.01',
      nombre: 'INTERESES A LAS CESANTIAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.07.03.91',
      nombre: 'INTERESES A LAS CESANTIAS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.07.04.00',
      nombre: 'Prima de vacaciones',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.07.04.01',
      nombre: 'PRIMA DE VACACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.07.04.91',
      nombre: 'PRIMA DE VACACIONES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.07.05.00',
      nombre: 'Prima de navidad',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.07.05.01',
      nombre: 'PRIMA DE NAVIDAD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.07.05.91',
      nombre: 'PRIMA DE NAVIDAD UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.07.06.00',
      nombre: 'Prima de servicios',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.07.06.01',
      nombre: 'PRIMA DE SERVICIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.07.06.91',
      nombre: 'PRIMA DE SERVICIOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.07.90.00',
      nombre: 'Otras primas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.07.90.01',
      nombre: 'OTRAS PRIMAS  PRIMA DE ANTIGUEDAD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.08.00.00',
      nombre: 'GASTOS DE PERSONAL DIVERSOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.08.01.00',
      nombre: 'Remuneraci por servicios t馗nicos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.08.01.01',
      nombre: 'REMUNERACION SERVICIOS TECNICOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.08.01.91',
      nombre: 'REMUNERACION SERVICIOS TECNICOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.08.03.00',
      nombre: 'Capacitaci, bienestar social y est匇ulos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.08.03.01',
      nombre: 'CAPACITACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.08.03.91',
      nombre: 'CAPACITACION, BIENESTAR SOCIAL Y ESTIMULOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.08.04.00',
      nombre: 'Dotaci y suministro a trabajadores',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.08.04.01',
      nombre: 'DOTACION Y SUMINISTRO A TRABAJADORES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.08.04.91',
      nombre: 'DOTACION Y SUMINISTRO A TRABAJADORES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.08.05.00',
      nombre: 'Gastos deportivos y de recreaci',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.08.05.01',
      nombre: 'GASTOS DEPORTIVOS Y DE RECREACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.08.07.00',
      nombre: 'Gastos de viaje',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.08.07.01',
      nombre: 'GASTOS DE VIAJE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.08.07.91',
      nombre: 'GASTOS DE VIAJE UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.08.10.00',
      nombre: 'Vi疸icos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.08.10.01',
      nombre: 'VIATICOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.08.10.91',
      nombre: 'VIATICOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.08.90.00',
      nombre: 'Otros gastos de personal diversos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.08.90.01',
      nombre: 'BONIFICACION POR SERVICIOS PRESTADOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.08.90.02',
      nombre: 'OTROS SUELDOS Y SALARIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.08.90.03',
      nombre: 'APRENDICES SENA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.00.00',
      nombre: 'GENERALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.04.00',
      nombre: 'Loza y cristaler僘',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.04.01',
      nombre: 'LOZA Y CRISTALERIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.06.00',
      nombre: 'Estudios y proyectos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.06.01',
      nombre: 'ESTUDIOS Y PROYECTOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.12.00',
      nombre: 'Obras y mejoras en propiedad ajena',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.12.01',
      nombre: 'OBRAS Y MEJORAS EN PROPIEDAD AJENA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.13.00',
      nombre: 'Vigilancia y seguridad',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.13.01',
      nombre: 'VIGILANCIA Y SEGURIDAD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.13.91',
      nombre: 'VIGILANCIA Y SEGURIDAD UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.14.00',
      nombre: 'Materiales y suministros',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.14.01',
      nombre: 'MATERIALES Y SUMINISTROS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.14.91',
      nombre: 'MATERIALES Y SUMINISTROS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.15.00',
      nombre: 'Mantenimiento',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.15.01',
      nombre: 'MANTENIMIENTO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.15.02',
      nombre: 'MATENIMIENTO PROPIEDADES DE INVERSION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.15.91',
      nombre: 'MANTENIMIENTO PLANTA FISICA UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.16.00',
      nombre: 'Reparaciones',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.16.01',
      nombre: 'EQUIPO DE LABORATORIO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.16.02',
      nombre: 'EQUIPOS Y MAQUINAS DE OFICINA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.16.03',
      nombre: 'MAQUINARIA Y EQUIPO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.16.04',
      nombre: 'EQUIPO AUTOMOTOR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.16.05',
      nombre: 'MUEBLES Y ENSERES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.16.06',
      nombre: 'LIBROS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.16.07',
      nombre: 'EQUIPOS DE COMUNICACION Y COMPUTACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.16.08',
      nombre: 'REPARACIﾓN Y MANTENIMIENTO SERVICIOS TECNICOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.16.91',
      nombre: 'REPARACION EQ.MEDICO Y CIENTIFICO UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.16.92',
      nombre: 'REPARACION EQUIPOS Y MAQUINAS DE OFICINA UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.16.93',
      nombre: 'REPARACION MAQUINARIA Y EQUIPO UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.16.95',
      nombre: 'REPARACION MUEBLES Y ENSERES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.16.97',
      nombre: 'REPARACION EQ.COMUNICAC.Y COMPUTAC.UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.16.98',
      nombre: 'REPARACIﾓN Y MANTENIMIENTO SERVICIOS TECNICOS UISA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.17.00',
      nombre: 'Servicios p炻licos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.17.01',
      nombre: 'SERVICIOS PUBLICOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.17.91',
      nombre: 'SERVICIOS PUBLICOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.18.00',
      nombre: 'Arrendamiento operativo',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.18.01',
      nombre: 'ARRENDAMIENTO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.19.00',
      nombre: 'Vi疸icos y gastos de viaje',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.19.01',
      nombre: 'VIATICOS Y GASTOS DE VIAJE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.19.91',
      nombre: 'VIATICOS Y GASTOS DE VIAJE UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.20.00',
      nombre: 'Publicidad y propaganda',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.20.01',
      nombre: 'PUBLICIDAD Y PROPAGANDA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.20.91',
      nombre: 'PUBLICIDAD Y PROPAGANDA UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.21.00',
      nombre: 'Impresos, publicaciones, suscripciones y afiliacio',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.21.01',
      nombre: 'IMPRESOS,PUBLICACIONES,SUSCRIPCIONES Y AFILIACION.',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.21.91',
      nombre: 'IMPRESOS PUBLICAC SUSCRIPC Y AFILIAC UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.22.00',
      nombre: 'Fotocopias',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.22.01',
      nombre: 'FOTOCOPIAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.23.00',
      nombre: 'Comunicaciones y transporte',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.23.01',
      nombre: 'COMUNICACIONES Y TRANSPORTE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.23.91',
      nombre: 'COMUNICACIONES Y TRANSPORTE UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.25.00',
      nombre: 'Seguros generales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.25.01',
      nombre: 'SEGUROS GENERALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.25.91',
      nombre: 'SEGUROS GENERALES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.27.00',
      nombre: 'Promoci y divulgaci',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.27.01',
      nombre: 'PROMOCION Y DIVULGACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.32.00',
      nombre: 'Dises y estudios',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.32.01',
      nombre: 'DISENOS ARQUITECTO.,ESTRUCT METALICA.,ELECTRICOS,O',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.33.00',
      nombre: 'Seguridad industrial',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.33.01',
      nombre: 'SEGURIDAD INDUSTRIAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.33.91',
      nombre: 'SEGURIDAD INDUSTRIAL UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.36.00',
      nombre: 'Implementos deportivos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.36.01',
      nombre: 'IMPLEMENTOS DEPORTIVOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.36.91',
      nombre: 'IMPLEMENTOS DEPORTIVOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.37.00',
      nombre: 'Eventos culturales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.37.01',
      nombre: 'EVENTOS CULTURALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.39.00',
      nombre: 'Participaciones y compensaciones',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.39.01',
      nombre: 'PARTICIPACIONES Y COMPENSACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.40.00',
      nombre: 'Contratos de administraci',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.40.01',
      nombre: 'CONTRATOS DE ADMINISTRACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.46.00',
      nombre: 'Combustibles y lubricantes',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.46.01',
      nombre: 'ELEMENTOS DE CONSUMO  COMBUSTIBLES Y LUBRICANTES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.46.91',
      nombre: 'ELEM.DE CONSUMOCOMBUSTIBLES Y LUBRICANTES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.49.00',
      nombre: 'Servicios de aseo, cafeter僘, restaurante y lavand',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.49.01',
      nombre: 'SERV.DE ASEO,CAFETERIA,RESTAURANTE Y LAVANDERIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.49.91',
      nombre: 'SERV.DE ASEO,CAFET.,RESTAURANTE Y LAVANDERIA UISAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.50.00',
      nombre: 'Procesamiento de informaci',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.50.01',
      nombre: 'PROCESAMIENTO DE INFORMACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.54.00',
      nombre: 'Organizaci de eventos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.54.01',
      nombre: 'ORGANIZACION DE EVENTOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.55.00',
      nombre: 'Elementos de aseo, lavander僘 y cafeter僘',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.55.01',
      nombre: 'ELEMENTOS DE CONSUMO  ASEO,LAVANDERIA Y CAFETERIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.55.91',
      nombre: 'ELEM.DE CONSUMOASEO,LAVANDERIA Y CAFET UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.57.00',
      nombre: 'Concursos y licitaciones',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.57.01',
      nombre: 'CONCURSOS Y LICITACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.59.00',
      nombre: 'Licencias y salvoconductos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.59.01',
      nombre: 'LICENCIAS Y SALVOCONDUCTOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.64.00',
      nombre: 'Gastos legales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.64.01',
      nombre: 'GASTOS LEGALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.65.00',
      nombre: 'Intangibles',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.65.01',
      nombre: 'INTANGIBLES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.65.91',
      nombre: 'INTANGIBLES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.79.00',
      nombre: 'Honorarios',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.79.01',
      nombre: 'HONORARIOS(P.J)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.79.02',
      nombre: 'HONORARIOS(P.N)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.79.91',
      nombre: 'HONORARIOS UISALUD (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.79.92',
      nombre: 'HONORARIOS UISALUD (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.80.00',
      nombre: 'Servicios',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.80.01',
      nombre: 'SERVICIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.80.92',
      nombre: 'SERVICIOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.90.00',
      nombre: 'Otros gastos generales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.90.01',
      nombre: 'OTROS GASTOS GENERALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.90.02',
      nombre: 'ELEMENTOS DE CONSUMO  REACTIVOS QUIMICOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.90.03',
      nombre: 'ELEMENTOS DE CONSUMO  MATERIALES DE LABORATORIO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.90.04',
      nombre: 'ELEMENTOS DE CONSUMO  DROGAS Y MEDICAMENTOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.90.05',
      nombre: 'ELEMENTOS DE CONSUMO  COMESTIBLES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.90.06',
      nombre: 'ELEMENTOS DE CONSUMO  HERRAMIENTAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.90.07',
      nombre: 'AUXILIARES ESTUDIANTILES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.90.08',
      nombre: 'BECAS POSTGRADO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.90.09',
      nombre: 'SUBSIDIO SOSTENIMIENTO ESTUDIANTES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.90.10',
      nombre: 'CREDITOS CONDONABLES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.90.11',
      nombre: 'PRACTICAS DOCENTES,SALIDAS DE CAMPO,MOVILIDAD ESTU',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.90.12',
      nombre: 'ESTIMULOS PREMIOS Y MERITOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.90.13',
      nombre: 'INSCRIPCION Y CAPACITACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.90.14',
      nombre: 'INSCRIPCION EVENTOS DEPORTIVOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.90.15',
      nombre: 'GASTOS DE IMPORTACIﾓN',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.90.91',
      nombre: 'OTROS GASTOS GENERALES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.90.92',
      nombre: 'ELEM.DE CONSUMO  REACTIVOS QUIMICOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.90.93',
      nombre: 'ELEM.DE CONSUMO  MATERIALES DE LABORAT.UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.90.95',
      nombre: 'ELEM.DE CONSUMO  COMESTIBLES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.90.96',
      nombre: 'ELEM.DE CONSUMO  HERRAMIENTAS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.11.90.97',
      nombre: 'AUXILIARES ESTUDIANTILES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.00.00',
      nombre: 'IMPUESTOS, CONTRIBUCIONES Y TASAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.01.00',
      nombre: 'Impuesto predial unificado',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.01.01',
      nombre: 'IMPUESTO PREDIAL UNIFICADO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.02.00',
      nombre: 'Cuota de fiscalizaci y auditaje',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.02.01',
      nombre: 'CUOTA DE FISCALIZACION Y AUDITAJE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.06.00',
      nombre: 'Valorizaci',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.06.01',
      nombre: 'VALORIZACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.10.00',
      nombre: 'Tasas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.10.01',
      nombre: 'TASAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.11.00',
      nombre: 'Impuesto sobre veh兤ulos automotores',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.11.01',
      nombre: 'IMPUESTO SOBRE VEHICULOS AUTOMOTORES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.12.00',
      nombre: 'Impuesto de registro',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.12.01',
      nombre: 'IMPUESTO DE REGISTRO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.19.00',
      nombre: 'Registro y salvoconducto',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.19.01',
      nombre: 'REGITRO Y SALVOCONDUCTO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.24.00',
      nombre: 'Gravamen a los movimientos financieros',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.24.01',
      nombre: 'GRAVAMEN A LOS MOVIMIENTOS FINANCIEROS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.24.91',
      nombre: 'GRAVAMEN A LOS MOVIMIENTOS FINANCIEROS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.25.00',
      nombre: 'Impuesto de timbre',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.25.01',
      nombre: 'IMPUESTO DE TIMBRE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.25.91',
      nombre: 'IMPUESTO DE TIMBRE UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.26.00',
      nombre: 'Contribuciones',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.26.01',
      nombre: 'CONTRIBUCION PARA EL I.C.F.E.S.',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.26.02',
      nombre: 'CONTRIBUCION ESPECIAL OBRA PUBLICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.26.03',
      nombre: 'LEY 2277 DE 2022 ART.95 ICETEX',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.27.00',
      nombre: 'Licencias',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.27.01',
      nombre: 'LICENCIAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.30.00',
      nombre: 'Impuesto nacional al consumo',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.30.01',
      nombre: 'IMPUESTO AL CONSUMO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.34.00',
      nombre: 'PORCENTAJE Y SOBRETASA AMBIENTAL AL IMPTO PREDIAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.34.01',
      nombre: 'PORCENTAJE Y SOBRETASA AMBIENTAL AL IMPTO PREDIAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.90.00',
      nombre: 'Otros impuestos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.90.01',
      nombre: 'OTROS IMPUESTOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.90.02',
      nombre: 'IMPUESTO AL CONSUMO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.90.03',
      nombre: 'IMPUESTO SOBRE EL SERVICIO DE ALUMBRADO PUBLICO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.90.04',
      nombre: 'DEVOLUCION IVA PARA ENTIDADES DE EDUCACION SUPERIO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.90.05',
      nombre: 'IMPUESTO SALUDABLE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.90.91',
      nombre: 'OTROS IMPUESTOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.90.92',
      nombre: 'IMPUESTO AL CONSUMO UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.1.20.90.94',
      nombre: 'DEVOLUCION IVA ENTIDADES EDUC. SUP. UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.00.00.00',
      nombre: 'DETERIORO, DEPRECIACIONES, AMORTIZACIONES Y PROVIS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.47.00.00',
      nombre: 'DETERIORO DE CUENTAS POR COBRAR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.47.02.00',
      nombre: 'Prestaci de servicios',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.47.02.01',
      nombre: 'PRESTACION DE SERVICIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.47.90.00',
      nombre: 'Otras cuentas por cobrar',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.47.90.01',
      nombre: 'OTROS DEUDORES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.47.90.91',
      nombre: 'OTROS DEUDORES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.60.00.00',
      nombre: 'DEPRECIACIﾓN DE PROPIEDADES, PLANTA Y EQUIPO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.60.01.00',
      nombre: 'Edificaciones',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.60.01.01',
      nombre: 'DEPRECIACION EDIFICACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.60.02.00',
      nombre: 'Plantas, ductos y t佖eles',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.60.02.01',
      nombre: 'DEPRECIACION PLANTAS, DUCTOS Y TⅤELES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.60.03.00',
      nombre: 'Redes, l匤eas y cables',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.60.03.01',
      nombre: 'DEPRECIACION REDES, L仼EAS Y CABLES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.62.00.00',
      nombre: 'DEPRECIACIﾓN DE PROPIEDADES DE INVERSIﾓN',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.62.01.00',
      nombre: 'Edificaciones',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.62.01.01',
      nombre: 'DEPRECIACION EDIFICACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.66.00.00',
      nombre: 'AMORTIZACIﾓN DE ACTIVOS INTANGIBLES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.66.02.00',
      nombre: 'Patentes',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.66.02.01',
      nombre: 'PATENTES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.68.00.00',
      nombre: 'PROVISIﾓN LITIGIOS Y DEMANDAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.68.01.00',
      nombre: 'CIVILES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.68.01.01',
      nombre: 'CIVIL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.68.03.00',
      nombre: 'Administrativas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.68.03.01',
      nombre: 'ADMINISTRATIVAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.68.05.00',
      nombre: 'Laborales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.68.05.01',
      nombre: 'LABORAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.68.90.00',
      nombre: 'Otros litigios y demandas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.68.90.01',
      nombre: 'OTROS LITIGIOS Y DEMANDAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.73.00.00',
      nombre: 'PROVISIONES DIVERSAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.73.90.00',
      nombre: 'Otras provisiones diversas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.3.73.90.91',
      nombre: 'PRESTACIONES MEDICAS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.4.23.00.00',
      nombre: 'OTRAS TRANSFERENCIAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.4.23.90.00',
      nombre: 'OTRAS TRANSFERENCIAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.4.23.90.01',
      nombre: 'TRANSFERENCIA CANCELACION CONTRATO DE COMODATO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.00.00.00',
      nombre: 'OTROS GASTOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.02.00.00',
      nombre: 'COMISIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.02.37.00',
      nombre: 'Comisiones sobre recursos entregados en administra',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.02.37.01',
      nombre: 'COMISIONES SOBRE RECURSOS ENTREGADOS EN ADMISNITRA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.02.38.00',
      nombre: 'COMISIONES Y OTROS GASTOS BANCARIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.02.38.01',
      nombre: 'COMISIONES Y OTROS GASTOS BANCARIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.02.38.91',
      nombre: 'COMISIONES Y OTROS GASTOS BANCARIOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.02.40.00',
      nombre: 'Comisiones servicios financieros',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.02.40.01',
      nombre: 'COMISIONES SERVICIOS FINANCIEROS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.02.40.91',
      nombre: 'COMISIONES SERVICIOS FINANCIEROS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.02.90.00',
      nombre: 'Otras comisiones',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.02.90.01',
      nombre: 'OTRAS COMISIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.03.02.00',
      nombre: 'Cuentas por cobrar',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.03.02.01',
      nombre: 'PRESTACION DE SERVICIO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.04.00.00',
      nombre: 'FINANCIEROS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.04.01.00',
      nombre: 'Actualizaci financiera de provisiones',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.04.01.01',
      nombre: 'CIVILES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.04.01.03',
      nombre: 'ADMINISTRATIVAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.04.11.00',
      nombre: 'P駻dida por valoraci de inversiones de administr',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.04.11.01',
      nombre: 'PERDIDA EN NEGOCIACION Y VENTA DE INVERSIONES EN T',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.04.11.91',
      nombre: 'PERDIDA NEGOCIACION FDO.ASEGURADOR Y FONDO PRESTAD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.04.11.94',
      nombre: 'PERDIDA EN NEGOCIACION FONDO RESERVA RECURSOS UIS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.04.11.95',
      nombre: 'PERDIDA EN NEGOCIACION FDO.RESERVA RECURSOS PROPIO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.04.11.96',
      nombre: 'PERDIDA INVERS.CTO.AMORTIZ.FDO.ASEGURADOR Y FONDO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.04.11.97',
      nombre: 'PERDIDA INVERS.CTO.AMORTIZ.FDO. ALTO COSTO Y PROMO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.04.11.98',
      nombre: 'PERDIDA INVERS.CTO.AMORTIZ.FDO.RESERVA RECURSOS UI',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.04.11.99',
      nombre: 'PERDIDA INVERS.CTO.AMORTIZ.FDO.RESERVA RECURSOS PR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.04.23.00',
      nombre: 'P駻dida por baja en cuentas de cuentas por cobrar',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.04.23.01',
      nombre: 'P餝DIDA POR BAJA EN CUENTAS DE CUENTAS POR COBRAR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.04.23.91',
      nombre: 'P餝DIDA POR BAJA CUENTAS POR COBRAR UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.04.90.00',
      nombre: 'Otros gastos financieros',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.04.90.01',
      nombre: 'PERDIDA VALORIC.FDO.DE INVERSION COLECTIVAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.04.90.91',
      nombre: 'PERDI.VALORIC.INVER.COLECTIVA FDO.ASEGURADOR Y FON',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.04.90.92',
      nombre: 'PERDI.VALORIC.INVER.COLECTIVA FDO.PRESTADOR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.04.90.93',
      nombre: 'PERDI.VALORIC.INVER.COLECTIVA FDO.ALTO COSTO Y PRO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.04.90.94',
      nombre: 'PERDI.VALORIC.INVER.COLECTIVA FDO.RESERVA RECURSOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.04.90.95',
      nombre: 'PERDI.VALORIC.INVER.COLECTIVA FDO.RESERVA RECURSOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.05.68.00',
      nombre: 'PERDIDA POR VALORAC. DE LAS INVERS. DE ADMON DE LI',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.05.68.01',
      nombre: 'PERDIDA POR VALORAC. DE LAS INVERS. DE ADMON DE LI',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.05.90.93',
      nombre: 'GASTOS FINANCIEROS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.90.00.00',
      nombre: 'GASTOS DIVERSOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.90.12.00',
      nombre: 'Sentencias',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.90.12.01',
      nombre: 'SENTENCIAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.90.12.91',
      nombre: 'SENTENCIAS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.90.13.00',
      nombre: 'Laudos arbitrales y conciliaciones extrajudiciales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.90.13.01',
      nombre: 'LAUDOS ARBITRALES Y CONCILIACIOES EXTRAJUDICIALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.90.19.00',
      nombre: 'P駻dida por baja en cuentas de activos no financie',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.90.19.01',
      nombre: 'PERDIDA POR BAJA EN CUENTAS DE ACTIVOS NO FINANCIE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.90.19.91',
      nombre: 'PERDIDA POR BAJA EN CUENTAS DE ACTIVOS NO FINANCIE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.90.90.00',
      nombre: 'Otros gastos diversos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.90.90.01',
      nombre: 'OTROS GASTOS DIVERSOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.90.90.02',
      nombre: 'GASTOS VIGENCIAS ANTERIORES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.90.90.03',
      nombre: 'TRASLADO A UISALUDGTOS DE FUNCIONAMIENTO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.90.90.91',
      nombre: 'OTROS GASTOS DIVERSOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.90.90.92',
      nombre: 'GASTOS VIGENCIAS ANTERIORES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.8.90.90.93',
      nombre: 'GASTOS FUNCIONAMIENTO UISALUD TRASLADO A UIS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.9.00.00.00',
      nombre: 'CIERRE DE INGRESOS, GASTOS Y COSTOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.9.05.00.00',
      nombre: 'CIERRE DE INGRESOS, GASTOS Y COSTOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.9.05.01.00',
      nombre: 'Cierre de ingresos, gastos y costos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.9.05.01.01',
      nombre: 'CIERRE DE INGRESOS, GASTOS Y COSTOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '5.9.05.01.91',
      nombre: 'CIERRE DE INGRESOS,GASTOS Y COSTOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.2.05.00.00',
      nombre: 'BIENES PRODUCIDOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.2.05.07.00',
      nombre: 'Impresos y publicaciones',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.2.05.07.01',
      nombre: 'PUBLICACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.2.10.00.00',
      nombre: 'BIENES COMERCIALIZADOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.2.10.03.00',
      nombre: 'Impresos y publicaciones',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.2.10.03.01',
      nombre: 'INSTITUTO DE LENGUAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.2.10.03.06',
      nombre: 'BODEGA GENERALPUBLICACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.2.10.03.07',
      nombre: 'BODEGA CORTE (PAPEL) PUBLICACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.2.10.03.08',
      nombre: 'BODEGA GRAN FORMATOPUBLICACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.2.10.03.09',
      nombre: 'BODEGA PLATICOPUBLICACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.2.10.03.10',
      nombre: 'PRODUCTO TERMINADOPUBLICACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.2.10.25.02',
      nombre: 'COMEDORES Y CAFETERIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.2.10.90.00',
      nombre: 'Otras ventas de bienes comercializados',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.2.10.90.02',
      nombre: 'TIENDA UNIVERSITARIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.00.00.00',
      nombre: 'COSTO DE VENTAS DE SERVICIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.05.00.00',
      nombre: 'SERVICIOS EDUCATIVOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.05.08.00',
      nombre: 'Educaci formal  Superior formaci profesional',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.05.08.01',
      nombre: 'EDUCACION FORMALSUPERIOR FORMACION PROFESIONAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.05.09.00',
      nombre: 'Educaci formal  Superior postgrado',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.05.09.01',
      nombre: 'EDUCACION FORMAL  SUPERIOR POSTGRADO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.00.00',
      nombre: 'SERVICIOS DE SALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.01.00',
      nombre: 'Urgencias  Consulta y procedimientos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.01.01',
      nombre: 'URGENCIAS  CONSULTA Y PROCEDIMIENTOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.15.00',
      nombre: 'Servicios ambulatorios  Consulta externa y proced',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.15.01',
      nombre: 'SERV. AMBULATORIOS  CONSULTA EXT. Y PROCEDIMIENTO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.16.00',
      nombre: 'Servicios ambulatorios  Consulta especializada',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.16.01',
      nombre: 'SERVICIOS AMBULATORIOSCONSULTA ESPECIALIZADA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.17.00',
      nombre: 'Servicios ambulatorios  Actividades de salud oral',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.17.01',
      nombre: 'SERVICIOS AMBULATORIOS  ACTIVIDADES DE SALUD ORAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.18.00',
      nombre: 'Servicios ambulatorios  Actividades de promoci',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.18.01',
      nombre: 'SERV. AMBULATORIOSACTIV. DE PROMOCION Y PREVENCIO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.19.00',
      nombre: 'Servicios ambulatorios  Otras actividades extramu',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.19.01',
      nombre: 'SERV. AMBULATORIOSOTRAS ACTIVIDADES EXTRAMURALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.25.00',
      nombre: 'Hospitalizaci  Estancia general',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.25.01',
      nombre: 'HOSPITALIZACION  ESTANCIA GENERAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.29.00',
      nombre: 'Hospitalizaci  Salud mental',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.29.01',
      nombre: 'HOSPITALIZACION  SALUD MENTAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.40.00',
      nombre: 'Apoyo diagntico  Laboratorio cl匤ico',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.40.01',
      nombre: 'APOYO DIAGNOSTICO  LABORATORIO CLINICO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.41.00',
      nombre: 'Apoyo diagntico  Imagenolog僘',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.41.01',
      nombre: 'APOYO DIAGNOSTICO  IMAGENOLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.42.00',
      nombre: 'Apoyo diagntico  Anatom僘 patolica',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.42.01',
      nombre: 'APOYO DIAGNOSTICO  ANATOMIA PATOLOGICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.43.00',
      nombre: 'Apoyo diagntico  Otras unidades de apoyo diagn・',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.43.01',
      nombre: 'APOYO DIAGNOSTICOOTRAS UNID. DE APOYO DIAGNOSTICO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.50.00',
      nombre: 'Apoyo terap騏tico  Rehabilitaci y terapias',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.50.01',
      nombre: 'APOYO TERAPEUTICO  REHABILITACION Y TERAPIAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.53.00',
      nombre: 'Apoyo terap騏tico  Unidad renal',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.53.01',
      nombre: 'APOYO TERAPEUTICO  UNIDAD RENAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.57.00',
      nombre: 'Apoyo terap騏tico  Otras unidades de apoyo terap・',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.57.01',
      nombre: 'APOYO TERAPEUTICOOTRAS UNID. DE APOYO TERAPEUTICO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.67.00',
      nombre: 'Servicios conexos a la salud  Otros servicios',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '6.3.10.67.01',
      nombre: 'SERVICIOS CONEXOS A LA SALUD OTROS SERVICIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.0.00.00.00',
      nombre: 'COSTOS DE TRANSFORMACIﾓN',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.00.00.00',
      nombre: 'SERVICIOS EDUCATIVOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.00.00',
      nombre: 'EDUCACIﾓN FORMAL  SUPERIOR  FORMACIﾓN PROFESIONA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.01.00',
      nombre: 'Materiales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.01.01',
      nombre: 'MATERIALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.00',
      nombre: 'Generales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.01',
      nombre: 'ELEMENTOS DE LENCERIA Y ROPERIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.02',
      nombre: 'LOZA Y CRISTALERIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.03',
      nombre: 'ESTUDIOS Y PROYECTOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.04',
      nombre: 'COMISIONES Y HONORARIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.05',
      nombre: 'SANCIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.06',
      nombre: 'VIGILANCIA Y SEGURIDAD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.07',
      nombre: 'MATERIALES Y SUMINISTROS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.08',
      nombre: 'PAPELERIA Y UTILES DE ESCRITORIO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.09',
      nombre: 'MANTENIMIENTO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.10',
      nombre: 'REPARACION EQUIPO DE LABORATORIO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.11',
      nombre: 'REPARACION EQUIPOS Y MAQUINAS DE OFICINA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.12',
      nombre: 'REPARACION MAQUINARIA Y EQUIPO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.13',
      nombre: 'REPARACION EQUIPO AUTOMOTOR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.14',
      nombre: 'REPARACION MUEBLES Y ENSERES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.15',
      nombre: 'REPARACION LIBROS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.16',
      nombre: 'REPARACION EQUIPOS DE COMUNICACION Y COMPUTACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.17',
      nombre: 'SERVICIOS PUBLICOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.18',
      nombre: 'ARRENDAMIENTO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.19',
      nombre: 'VIATICOS Y GASTOS DE VIAJE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.20',
      nombre: 'PUBLICIDAD Y PROPAGANDA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.21',
      nombre: 'IMPRESOS,PUBLICACIONES,SUSCRIPC. Y AFILIACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.22',
      nombre: 'FOTOCOPIAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.23',
      nombre: 'COMUNICACIONES Y TRANSPORTE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.24',
      nombre: 'SEGUROS GENERALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.25',
      nombre: 'IMPREVISTOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.26',
      nombre: 'PROMOCION Y DIVULGACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.27',
      nombre: 'INSCRIPCION Y CAPACITACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.28',
      nombre: 'MATERIALES DE EDUCACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.29',
      nombre: 'IMPLEMENTOS DEPORTIVOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.30',
      nombre: 'EVENTOS CULTURALES  ACADEMICOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.31',
      nombre: 'SEGURIDAD INDUSTRIAL Y SALUD OCUPACIONAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.32',
      nombre: 'CONTRATOS DE ADMINISTRACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.33',
      nombre: 'SOSTENIMIENTO DE SEMOVIENTES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.34',
      nombre: 'ELEMENTOS DE CONSUMO  COMBUSTIBLES Y LUBRICANTES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.35',
      nombre: 'SERV.DE ASEO,CAFETERIA,RESTAURANTE Y LAVANDERIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.37',
      nombre: 'ORGANIZACION DE EVENTOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.38',
      nombre: 'ELEMENTOS DE CONSUMO  ASEO,LAVANDERIA Y CAFETERIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.39',
      nombre: 'CONCURSOS Y LICITACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.40',
      nombre: 'ELEMENTOS DE CONSUMO  REACTIVOS QUIMICOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.41',
      nombre: 'ELEMENTOS DE CONSUMO  MATERIALES DE LABORATORIO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.42',
      nombre: 'ELEMENTOS DE CONSUMO  DROGAS Y MEDICAMENTOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.43',
      nombre: 'ELEMENTOS DE CONSUMO  COMESTIBLES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.44',
      nombre: 'ELEMENTOS DE CONSUMO  HERRAMIENTAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.45',
      nombre: 'AUXILIARES ESTUDIANTILES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.46',
      nombre: 'BECAS POSTGRADO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.47',
      nombre: 'PRACTICAS DOCENTES,SALIDAS DE CAMPO Y MOVILIDAD ES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.48',
      nombre: 'GASTOS DE IMPORTACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.49',
      nombre: 'SERVICIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.50',
      nombre: 'SUBSIDIO SOSTENIMIENTO ESTUDIANTES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.02.51',
      nombre: 'AUXILIO DE RODAMIENTO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.00',
      nombre: 'Sueldos y salarios',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.01',
      nombre: 'SUELDOS DEL PERSONAL DIRECTIVO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.02',
      nombre: 'SUELDOS DEL PERSONAL DOCENTE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.03',
      nombre: 'SUELDOS DEL PERSONAL ASESORES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.04',
      nombre: 'SUELDOS DEL PERSONAL EJECUTIVO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.05',
      nombre: 'SUELDOS DEL PERSONAL PROFESIONAL ADMINISTRATIVO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.06',
      nombre: 'SUELDOS DEL PERSONAL TECNICO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.07',
      nombre: 'SUELDOS DEL PERSONAL ADMINISTRATIVO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.08',
      nombre: 'SUELDOS DEL PERSONAL OPERATIVO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.09',
      nombre: 'HORAS EXTRAS Y FESTIVOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.10',
      nombre: 'GASTOS DE REPRESENTACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.13',
      nombre: 'PRIMA TECNICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.18',
      nombre: 'BONIFICACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.19',
      nombre: 'BONIFICACIONES ESPECIALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.20',
      nombre: 'AUXILIO DE TRANSPORTE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.23',
      nombre: 'CAPACITACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.24',
      nombre: 'DOTACION Y SUMINISTRO A TRABAJADORES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.25',
      nombre: 'GASTOS DEPORTIVOS Y DE RECREACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.26',
      nombre: 'CONTRATOS DE PERSONAL TEMPORAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.27',
      nombre: 'VIATICOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.28',
      nombre: 'GASTOS DE VIAJE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.29',
      nombre: 'COMISIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.30',
      nombre: 'BONIFICACION POR SERVICIOS PRESTADOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.32',
      nombre: 'SUBSIDIO DE ALIMENTACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.33',
      nombre: 'HORAS CATEDRA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.34',
      nombre: 'SUELDOS DEL PERSONAL PROFESIONAL ADMINISTR.TEMPORA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.35',
      nombre: 'SUELDOS DEL PERSONAL ADMINISTRATIVO TEMPORAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.36',
      nombre: 'SUELDOS DEL PERSONAL TECNICO TEMPORAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.37',
      nombre: 'SUELDOS DEL PERSONAL OPERATIVO TEMPORAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.38',
      nombre: 'AUXILIO DE CONECTIVIDAD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.91',
      nombre: 'APRENDICES SENA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.03.92',
      nombre: 'CREDITOS CONDONABLES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.04.00',
      nombre: 'Contribuciones imputadas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.04.01',
      nombre: 'INCAPACIDADES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.04.02',
      nombre: 'SUBSIDIO FAMILIAR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.04.03',
      nombre: 'AUXILIO Y SERVICIOS FUNERARIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.04.04',
      nombre: 'PENSIONES DE JUBILACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.04.05',
      nombre: 'CUOTAS PARTES DE PENSIONES DE JUBILACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.04.06',
      nombre: 'INDEMNIZACIONES SUSTITUTIVAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.04.07',
      nombre: 'AMORTIZACION CALCULO ACTUARIAL PENSIONES ACTUALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.04.08',
      nombre: 'AMORTIZACION CALCULO ACTUARIAL FUTURAS PENSIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.04.09',
      nombre: 'AMORT.CALCULO ACTUARIAL CUOTAS PARTES DE PENSION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.04.10',
      nombre: 'AMORT.LIQ.PROVIS.DE CUOTAS PARTES DE BONOS PENSION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.04.11',
      nombre: 'AMORT.DE CUOTAS PARTES DE BONOS PENSION. EMITIDOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.04.12',
      nombre: 'CUOTAS PARTES DE BONOS PENSIONALES EMITIDOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.04.13',
      nombre: 'AUXILIO EDUCATIVO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.05.00',
      nombre: 'Contribuciones efectivas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.05.01',
      nombre: 'COTIZACIONES A SEGURIDAD SOCIAL EN SALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.05.02',
      nombre: 'APORTES SINDICALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.05.03',
      nombre: 'COTIZACIONES A RIESGOS PROFESIONALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.05.04',
      nombre: 'COTIZACIONES A ENTID.ADMIN.DEL REG.DE PRIMA MEDIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.05.05',
      nombre: 'COTIZACIONES A ENTID.ADMIN.DEL REG.DE AHORRO INDIV',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.05.06',
      nombre: 'APORTES  FAVUIS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.06.00',
      nombre: 'Aportes sobre la nina',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.06.01',
      nombre: 'APORTES AL I.C.B.F.',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.07.00',
      nombre: 'Depreciaci y amortizaci',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.07.01',
      nombre: 'DEPRECIACION EDIFICACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.07.02',
      nombre: 'DEPRECIACION REDES, LINEAS Y CABLES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.07.03',
      nombre: 'DEPRECIACION MAQUINARIA Y EQUIPO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.07.04',
      nombre: 'DEPRECIACION EQUIPO MEDICO Y CIENTIFICO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.07.05',
      nombre: 'DEPRECIACION MUEBLES,ENSERES Y EQUIPO DE OFICINA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.07.06',
      nombre: 'DEPRECIACION EQUIPO DE COMUNICACION Y COMPUTACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.07.07',
      nombre: 'DEPRECIACION EQUIPO DE TRANSP,TRACCION Y ELEVACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.07.08',
      nombre: 'AMORTIZACION DE INTANGIBLES "SOFTWARE"',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.07.09',
      nombre: 'PLANTAS,DUCTOS Y TUNELES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.07.10',
      nombre: 'AMORTIZACION DE PATENTES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.07.12',
      nombre: 'DEPRECIACION LIBROS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.08.00',
      nombre: 'Impuestos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.08.01',
      nombre: 'IMPUESTO PREDIAL UNIFICADO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.08.02',
      nombre: 'CUOTA DE FISCALIZACION Y AUDITAJE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.08.03',
      nombre: 'GRAVAMEN A LOS MOVIMIENTOS FINANCIEROS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.08.04',
      nombre: 'MULTAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.08.05',
      nombre: 'SANCIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.08.06',
      nombre: 'IMPUESTO SOBRE VEHICULOS AUTOMOTORES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.08.07',
      nombre: 'IMPUESTO DE REGISTRO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.08.08',
      nombre: 'CONTRIBUCION PARA EL I.C.F.E.S',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.08.09',
      nombre: 'OTROS IMPUESTOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.08.10',
      nombre: 'IMPUESTO AL CONSUMO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.08.34',
      nombre: 'PORCENTAJE Y SOBRETASA AMBIENTAL AL IMPTO PREDIAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.09.00',
      nombre: 'Prestaciones sociales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.09.14',
      nombre: 'PRIMA DE VACACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.09.15',
      nombre: 'PRIMA DE NAVIDAD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.09.16',
      nombre: 'OTRAS PRIMAS  ANTIGUEDAD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.09.17',
      nombre: 'VACACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.09.21',
      nombre: 'CESANTIAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.09.22',
      nombre: 'INTERESES A LAS CESANTIAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.09.31',
      nombre: 'PRIMA DE SERVICIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.10.00',
      nombre: 'Gastos de personal diversos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.10.11',
      nombre: 'REMUNERACION SERVICIOS TECNICOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.10.12',
      nombre: 'HONORARIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.10.23',
      nombre: 'CAPACITACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.10.25',
      nombre: 'GASTOS DEPORTIVOS Y DE RECREACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.10.27',
      nombre: 'VIATICOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.10.28',
      nombre: 'GASTOS DE VIAJE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.10.30',
      nombre: 'BONIFICACION POR SERVICIOS PRESTADOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.95.00',
      nombre: 'Traslado de costos (Cr)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.08.95.01',
      nombre: 'TRASLADO DE COSTOS (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.00.00',
      nombre: 'EDUCACIﾓN FORMAL  SUPERIOR  POSTGRADO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.01.00',
      nombre: 'Materiales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.01.01',
      nombre: 'MATERIALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.00',
      nombre: 'Generales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.01',
      nombre: 'ELEMENTOS DE LENCERIA Y ROPERIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.02',
      nombre: 'LOZA Y CRISTALERIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.03',
      nombre: 'ESTUDIOS Y PROYECTOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.04',
      nombre: 'COMISIONES Y HONORARIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.05',
      nombre: 'SANCIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.06',
      nombre: 'VIGILANCIA Y SEGURIDAD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.07',
      nombre: 'MATERIALES Y SUMINISTROS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.08',
      nombre: 'PAPELERIA Y UTILES DE ESCRITORIO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.09',
      nombre: 'MANTENIMIENTO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.10',
      nombre: 'REPARACION EQUIPO DE LABORATORIO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.11',
      nombre: 'REPARACION EQUIPOS Y MAQUINAS DE OFICINA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.12',
      nombre: 'REPARACION MAQUINARIA Y EQUIPO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.13',
      nombre: 'REPARACION EQUIPO AUTOMOTOR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.14',
      nombre: 'REPARACION MUEBLES Y ENSERES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.15',
      nombre: 'REPARACION LIBROS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.16',
      nombre: 'REPARACION EQUIPOS DE COMUNICACION Y COMPUTACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.17',
      nombre: 'SERVICIOS PUBLICOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.18',
      nombre: 'ARRENDAMIENTO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.19',
      nombre: 'VIATICOS Y GASTOS DE VIAJE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.20',
      nombre: 'PUBLICIDAD Y PROPAGANDA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.21',
      nombre: 'IMPRESOS,PUBLICACIONES,SUSCRIPC. Y AFILIACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.22',
      nombre: 'FOTOCOPIAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.23',
      nombre: 'COMUNICACIONES Y TRANSPORTE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.24',
      nombre: 'SEGUROS GENERALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.25',
      nombre: 'IMPREVISTOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.26',
      nombre: 'PROMOCION Y DIVULGACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.27',
      nombre: 'INSCRIPCION Y CAPACITACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.28',
      nombre: 'MATERIALES DE EDUCACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.29',
      nombre: 'IMPLEMENTOS DEPORTIVOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.30',
      nombre: 'EVENTOS CULTURALES  ACADEMICOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.31',
      nombre: 'SEGURIDAD INDUSTRIAL Y SALUD OCUPACIONAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.32',
      nombre: 'CONTRATOS DE ADMINISTRACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.33',
      nombre: 'SOSTENIMIENTO DE SEMOVIENTES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.34',
      nombre: 'ELEMENTOS DE CONSUMO  COMBUSTIBLES Y LUCRICANTES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.35',
      nombre: 'SERV.DE ASEO,CAFETERIA,RESTAURANTE Y LAVANDERIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.37',
      nombre: 'ORGANIZACION DE EVENTOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.38',
      nombre: 'ELEMENTOS DE CONSUMO  ASEO,LAVANDERIA Y CAFETERIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.39',
      nombre: 'CONCURSOS Y LICITACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.40',
      nombre: 'ELEMENTOS DE CONSUMO  REACTIVOS QUIMICOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.41',
      nombre: 'ELEMENTOS DE CONSUMO  MATERIALES DE LABORATORIO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.42',
      nombre: 'ELEMENTOS DE CONSUMO  DROGAS Y MEDICAMENTOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.43',
      nombre: 'ELEMENTOS DE CONSUMO  COMESTIBLES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.44',
      nombre: 'ELEMENTOS DE CONSUMO  HERRAMIENTAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.45',
      nombre: 'AUXILIARES ESTUDIANTILES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.46',
      nombre: 'BECAS POSTGRADO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.47',
      nombre: 'PRACTICAS DOCENTES,SALIDAS DE CAMPO Y MOVILIDAD ES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.48',
      nombre: 'GASTOS DE IMPORTACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.49',
      nombre: 'SERVICIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.50',
      nombre: 'SUBSIDIO SOSTENIMIENTO ESTUDIANTES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.02.52',
      nombre: 'SUBSIDIO ESTUDIANTES PROGR.POSTGRADO/DOCTORADO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.00',
      nombre: 'Sueldos y salarios',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.01',
      nombre: 'SUELDOS DEL PERSONAL DIRECTIVO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.02',
      nombre: 'SUELDOS DEL PERSONAL DOCENTE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.03',
      nombre: 'SUELDOS DEL PERSONAL ASESORES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.04',
      nombre: 'SUELDOS DEL PERSONAL EJECUTIVO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.05',
      nombre: 'SUELDOS DEL PERSONAL PROFESIONAL ADMINISTRATIVO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.06',
      nombre: 'SUELDOS DEL PERSONAL TECNICO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.07',
      nombre: 'SUELDOS DEL PERSONAL ADMINISTRATIVO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.08',
      nombre: 'SUELDOS DEL PERSONAL OPERATIVO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.09',
      nombre: 'HORAS EXTRAS Y FESTIVOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.10',
      nombre: 'GASTOS DE REPRESENTACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.11',
      nombre: 'REMUNERACION SERVICIOS TECNICOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.12',
      nombre: 'HONORARIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.13',
      nombre: 'PRIMA TECNICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.14',
      nombre: 'PRIMA DE VACACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.15',
      nombre: 'PRIMA DE NAVIDAD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.16',
      nombre: 'OTRAS PRIMAS  ANTIGUEDAD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.17',
      nombre: 'VACACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.18',
      nombre: 'BONIFICACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.19',
      nombre: 'BONIFICACIONES ESPECIALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.20',
      nombre: 'AUXILIO DE TRANSPORTE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.21',
      nombre: 'CESANTIAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.22',
      nombre: 'INTERESES A LAS CESANTIAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.23',
      nombre: 'CAPACITACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.24',
      nombre: 'DOTACION Y SUMINISTROS A TRABAJADORES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.25',
      nombre: 'GASTOS DEPORTIVOS Y DE RECREACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.26',
      nombre: 'CONTRATOS DE PERSONAL TEMPORAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.27',
      nombre: 'VIATICOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.28',
      nombre: 'GASTOS DE VIAJE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.29',
      nombre: 'COMISIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.30',
      nombre: 'BONIFICACION POR SERVICIOS PRESTADOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.31',
      nombre: 'PRIMA DE SERVICIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.32',
      nombre: 'SUBSIDIO DE ALIMENTACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.33',
      nombre: 'HORAS CATEDRA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.03.91',
      nombre: 'APRENDICES SENA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.04.00',
      nombre: 'Contribuciones imputadas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.04.01',
      nombre: 'INCAPACIDADES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.04.02',
      nombre: 'SUBSIDIO FAMILIAR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.04.03',
      nombre: 'AUXILIO Y SERVICIOS FUNERARIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.04.04',
      nombre: 'PENSIONES DE JUBILACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.04.05',
      nombre: 'CUOTAS PARTES DE PENSIONES DE JUBILACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.04.06',
      nombre: 'INDEMNIZACIONES SUSTITUTIVAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.04.07',
      nombre: 'AMORTIZACION CALCULO ACTUARIAL PENSIONES ACTUALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.04.08',
      nombre: 'AMORTIZACION CALCULO ACTUARIAL FUTURAS PENSIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.04.09',
      nombre: 'AMORT.CALCULO ACTUARIAL CUOTAS PARTES DE PENSION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.04.10',
      nombre: 'AMORT.LIQ.PROVIS.DE CUOTAS PARTES DE BONOS PENSION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.04.11',
      nombre: 'AMORT.DE CUOTAS PARTES DE BONOS PENSION. EMITIDOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.04.12',
      nombre: 'CUOTAS PARTES DE BONOS PENSIONALES EMITIDOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.04.13',
      nombre: 'AUXILIO EDUCATIVO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.05.00',
      nombre: 'Contribuciones efectivas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.05.01',
      nombre: 'COTIZACIONES A SEGURIDAD SOCIAL EN SALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.05.02',
      nombre: 'APORTES SINDICALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.05.03',
      nombre: 'COTIZACIONES A RIESGOS PROFESIONALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.05.04',
      nombre: 'COTIZACIONES A ENTID.ADMIN.DEL REG.DE PRIMA MEDIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.05.05',
      nombre: 'COTIZACIONES A ENTID.ADMIN.DEL REG.DE AHORRO INDIV',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.05.06',
      nombre: 'APORTES  FAVUIS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.06.00',
      nombre: 'Aportes sobre la nina',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.06.01',
      nombre: 'APORTES AL I.C.B.F.',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.07.00',
      nombre: 'Depreciaci y amortizaci',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.07.01',
      nombre: 'DEPRECIACION EDIFICACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.07.02',
      nombre: 'DEPRECIACION REDES, LINEAS Y CABLES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.07.03',
      nombre: 'DEPRECIACION MAQUINARIA Y EQUIPO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.07.04',
      nombre: 'DEPRECIACION EQUIPO MEDICO Y CIENTIFICO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.07.05',
      nombre: 'DEPRECIACION MUEBLES,ENSERES Y EQUIPO DE OFICINA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.07.06',
      nombre: 'DEPRECIACION EQUIPO DE COMUNICACION Y COMPUTACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.07.07',
      nombre: 'DEPRECIACION EQUIPO DE TRANSP.TRACCION Y ELEVACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.07.08',
      nombre: 'AMORTIZACION DE INTANGIBLES "SOFTWARE"',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.08.00',
      nombre: 'Impuestos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.08.01',
      nombre: 'IMPUESTO PREDIAL UNIFICADO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.08.02',
      nombre: 'CUOTA DE FISCALIZACION Y AUDITAJE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.08.03',
      nombre: 'GRAVAMEN A LOS MOVIMIENTOS FINANCIEROS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.08.04',
      nombre: 'MULTAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.08.05',
      nombre: 'SANCIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.08.06',
      nombre: 'IMPUESTO SOBRE VEHICULOS AUTOMOTORES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.08.07',
      nombre: 'IMPUESTO DE REGISTRO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.08.08',
      nombre: 'CONTRIBUCION PARA EL I.C.F.E.S',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.08.09',
      nombre: 'OTROS IMPUESTOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.08.10',
      nombre: 'IMPUESTO AL CONSUMO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.09.00',
      nombre: 'Prestaciones sociales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.09.17',
      nombre: 'VACACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.09.21',
      nombre: 'CESANTIAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.10.00',
      nombre: 'Gastos de personal diversos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.10.11',
      nombre: 'REMUNERACION SERVICIOS TECNICOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.10.12',
      nombre: 'HONORARIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.10.23',
      nombre: 'CAPACITACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.10.27',
      nombre: 'VIATICOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.10.28',
      nombre: 'GASTOS DE VIAJE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.95.00',
      nombre: 'Traslado de costos (Cr)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.2.09.95.01',
      nombre: 'TRASLADO DE COSTOS (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.00.00.00',
      nombre: 'SERVICIOS DE SALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.01.00.00',
      nombre: 'URGENCIAS  CONSULTA Y PROCEDIMIENTOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.01.02.00',
      nombre: 'Generales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.01.02.01',
      nombre: 'URGENCIASCONSULTA Y PROCEDIM.ADULTOS (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.01.02.02',
      nombre: 'URGENCIASCONSULTA Y PROCEDIM.PEDRIATRIA (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.01.04.00',
      nombre: 'Contribuciones imputadas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.01.04.01',
      nombre: 'URGENCIASCONSULTA Y PROCEDIM.ADULTOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.01.04.02',
      nombre: 'URGENCIASCONSULTA Y PROCEDIM.PEDRIATRIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.01.10.00',
      nombre: 'Gastos de personal diversos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.01.10.01',
      nombre: 'URGENCIASCONSULTA Y PROCEDIM.ADULTOS (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.01.95.00',
      nombre: 'Traslado de costos (Cr)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.01.95.01',
      nombre: 'TRASLADO DE COSTOS (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.10.00.00',
      nombre: 'SERVICIOS AMBULATORIOS  CONSULTA EXTERNA Y PROCED',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.10.01.00',
      nombre: 'MATERIALES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.10.01.01',
      nombre: 'MEDICAMENTOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.10.01.03',
      nombre: 'MATERIALES Y SUMINISTROS MEDICOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.10.02.00',
      nombre: 'Generales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.10.02.19',
      nombre: 'VIATICOS Y GASTOS DE VIAJE UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.10.03.00',
      nombre: 'Sueldos y salarios',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.10.03.14',
      nombre: 'PRIMA DE VACACIONESUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.10.03.15',
      nombre: 'PRIMA DE NAVIDADUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.10.03.27',
      nombre: 'VIATICOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.10.04.00',
      nombre: 'Contribuciones imputadas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.10.04.01',
      nombre: 'INCAPACIDADES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.10.04.97',
      nombre: 'CONSULTA EXTERNA ESPECIALISTAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.10.04.98',
      nombre: 'CONSULTA EXTERNA CLINICAS HOSPITALES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.10.08.00',
      nombre: 'Impuestos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.10.08.09',
      nombre: 'OTROS IMPUESTOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.10.10.00',
      nombre: 'Gastos de personal diversos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.10.10.97',
      nombre: 'CONSULTA EXTERNA ESPECIALISTAS (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.10.95.00',
      nombre: 'Traslado de costos (Cr)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.10.95.01',
      nombre: 'TRASLADO DE COSTOS (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.00.00',
      nombre: 'SERVICIOS AMBULATORIOS  CONSULTA ESPECIALIZADA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.02.00',
      nombre: 'Generales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.02.04',
      nombre: 'CARDIOLOGIA (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.02.24',
      nombre: 'GASTROENTEROLOGIA (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.02.29',
      nombre: 'MEDICINA ALIVIO DEL DOLOR Y MEDICINA PALEATIVA (PJ',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.02.32',
      nombre: 'INFECTOLOGIA (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.02.41',
      nombre: 'MEDICINA LABORAL (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.02.44',
      nombre: 'NEUMOLOGIA (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.02.47',
      nombre: 'NEUROLOGIA (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.02.56',
      nombre: 'OFTALMOLOGIA (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.02.63',
      nombre: 'OPTOMETRIA (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.02.67',
      nombre: 'ORTOPEDIA Y TRAUMATOLOGIA (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.02.68',
      nombre: 'ORTOPEDIA Y TRAUMATOLOGIA PEDIATRICA (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.02.76',
      nombre: 'PSICOLOGIA (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.02.87',
      nombre: 'UROLOGIA (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.03.00',
      nombre: 'Sueldos y salarios',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.03.05',
      nombre: 'SUELDOS PERSONAL PROFESIONAL UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.03.07',
      nombre: 'SUELDOS DEL PERSONAL ADMON. UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.03.14',
      nombre: 'PRIMA DE VACACIONES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.03.15',
      nombre: 'PRIMA DE NAVIDADUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.03.17',
      nombre: 'VACACIONES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.03.18',
      nombre: 'BONIFICACIONES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.03.21',
      nombre: 'CESANTIASUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.03.22',
      nombre: 'INTERESES A LAS CESANTIASUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.03.31',
      nombre: 'PRIMA DE SERVICIOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.03.91',
      nombre: 'PRIMA DE NAVIDADUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.03.95',
      nombre: 'SUELDOS PERSONAL PROFESIONAL UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.03.97',
      nombre: 'SUELDOS DEL PERSONAL ADMON. UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.00',
      nombre: 'Contribuciones imputadas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.01',
      nombre: 'ALERGOLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.02',
      nombre: 'SUBSIDIO FAMILIARUISALUD (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.03',
      nombre: 'AUDIOLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.04',
      nombre: 'CARDIOLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.05',
      nombre: 'CIRUGIA DE CABEZA Y CUELLO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.06',
      nombre: 'CIRUGIA GENERAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.08',
      nombre: 'CIRUGIA ONCOLOGICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.10',
      nombre: 'CIRUGIA PEDIATRICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.11',
      nombre: 'CIRUGIA PLASTICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.12',
      nombre: 'CIRUGIA VASCULAR Y ANGIOLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.13',
      nombre: 'COLOPROCTOLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.14',
      nombre: 'DERMATOLOGIA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.16',
      nombre: 'ENDOCRINOLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.17',
      nombre: 'ENDOCRINOLOGIA PEDIATRICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.18',
      nombre: 'ENDODONCIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.19',
      nombre: 'ENDOSCOPIA DIGESTIVA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.20',
      nombre: 'ENFERMERIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.24',
      nombre: 'GASTROENTEROLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.25',
      nombre: 'GASTROENTEROLOGIA PEDIATRICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.27',
      nombre: 'GINECOLOGIA OBSTETRICIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.28',
      nombre: 'GINECOLOGIA ONCOLOGICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.29',
      nombre: 'MEDICINA ALIVIO DEL DOLOR Y MEDICINA PALEATIVA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.32',
      nombre: 'INFECTOLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.33',
      nombre: 'INMUNOLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.36',
      nombre: 'MEDICINA ALTERNATIVA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.37',
      nombre: 'MEDICINA DOMICILIARIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.39',
      nombre: 'MEDICINA GENERAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.40',
      nombre: 'MEDICINA INTERNA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.41',
      nombre: 'MEDICINA LABORAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.42',
      nombre: 'NEFROLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.43',
      nombre: 'NEFROLOGIA PEDIATRICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.44',
      nombre: 'NEUMOLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.45',
      nombre: 'NEUMOLOGIA PEDIATRICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.46',
      nombre: 'NEUROPSIQUIATRIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.47',
      nombre: 'NEUROLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.48',
      nombre: 'NEUROLOGIA PEDIATRICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.49',
      nombre: 'NEUROPSICOLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.50',
      nombre: 'NUTRICION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.51',
      nombre: 'BIOLOGIAGENETICA CLINICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.56',
      nombre: 'OFTALMOLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.57',
      nombre: 'OFTALMOLOGIA (GLAUCOMA)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.58',
      nombre: 'OFTALMOLOGIA (OCULOPLASTIA)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.59',
      nombre: 'OFTALMOLOGIA (RETINA)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.60',
      nombre: 'OFTALMOLOGIA ONCOLOGICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.61',
      nombre: 'OFTALMOLOGIA PEDIATRICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.63',
      nombre: 'OPTOMETRIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.64',
      nombre: 'ORTOPEDIA (MANO)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.66',
      nombre: 'ORTOPEDIA ONCOLOGICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.67',
      nombre: 'ORTOPEDIA Y TRAUMATOLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.68',
      nombre: 'ORTOPEDIA Y TRAUMATOLOGIA PEDIATRICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.69',
      nombre: 'OTORRINOLARINGOLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.70',
      nombre: 'OTORRINOLARINGOLOGIA PEDIATRICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.72',
      nombre: 'PEDIATRIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.73',
      nombre: 'PEDIATRIA Y NEUROLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.76',
      nombre: 'PSICOLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.77',
      nombre: 'PSIQUIATRIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.82',
      nombre: 'REUMATOLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.83',
      nombre: 'SALUD OCUPACIONAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.86',
      nombre: 'TRABAJO SOCIAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.87',
      nombre: 'UROLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.88',
      nombre: 'UROLOGIA PEDIATRICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.89',
      nombre: 'DEPORTOLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.90',
      nombre: 'GINECOLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.91',
      nombre: 'MASTOLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.04.99',
      nombre: 'SUBSIDIO FAMILIARUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.07.00',
      nombre: 'Depreciaci y amortizaci',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.07.01',
      nombre: 'DEPRECIACION EDIFICACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.07.03',
      nombre: 'DEPRECIACION MAQUINARIA Y EQUIPO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.07.04',
      nombre: 'DEPRECIACION EQUIPO MEDICO Y CIENTIFICO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.07.05',
      nombre: 'DEPRECIACION MUEBLES,ENSERES Y EQUIPO DE OFICINA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.07.06',
      nombre: 'DEPRECIACION EQUIPO DE COMUNICACION Y COMPUTACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.07.08',
      nombre: 'AMORTIZACION DE INTANGIBLES "SOFTWARE"',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.09.00',
      nombre: 'Prestaciones sociales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.09.14',
      nombre: 'PRIMA DE VACACIONES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.09.15',
      nombre: 'PRIMA DE NAVIDADUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.09.21',
      nombre: 'CESANTIASUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.09.22',
      nombre: 'INTERESES A LAS CESANTIASUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.09.31',
      nombre: 'PRIMA DE SERVICIOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.00',
      nombre: 'Gastos de personal diversos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.01',
      nombre: 'ALERGOLOGIA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.03',
      nombre: 'AUDIOLOGIA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.04',
      nombre: 'CARDIOLOGIA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.05',
      nombre: 'CIRUGIA DE CABEZA Y CUELLO (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.06',
      nombre: 'CIRUGIA GENERAL (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.08',
      nombre: 'CIRUGIA ONCOLOGICA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.11',
      nombre: 'CIRUGIA PLASTICA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.12',
      nombre: 'CIRUGIA VASCULAR Y ANGIOLOGIA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.13',
      nombre: 'COLOPROCTOLOGIA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.16',
      nombre: 'ENDOCRINOLOGIA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.17',
      nombre: 'ENDOCRINOLOGIA PEDIATRICA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.18',
      nombre: 'ENDODONCIA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.24',
      nombre: 'GASTROENTEROLOGIA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.27',
      nombre: 'GINECOLOGIA OBSTETRICIA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.29',
      nombre: 'MEDICINA ALIVIO DEL DOLOR Y MEDICINA PALEATIVA (PN',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.32',
      nombre: 'INFECTOLOGIA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.36',
      nombre: 'MEDICINA ALTERNATIVA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.39',
      nombre: 'MEDICINA GENERAL (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.40',
      nombre: 'MEDICINA INTERNA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.41',
      nombre: 'MEDICINA LABORAL (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.42',
      nombre: 'NEFROLOGIA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.44',
      nombre: 'NEUMOLOGIA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.45',
      nombre: 'NEUMOLOGIA PEDIATRICA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.47',
      nombre: 'NEUROLOGIA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.48',
      nombre: 'NEUROLOGIA PEDIATRICA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.50',
      nombre: 'NUTRICION (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.51',
      nombre: 'BIOLOGIAGENETICA CLINICA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.56',
      nombre: 'OFTALMOLOGIA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.57',
      nombre: 'OFTALMOLOGIA (GLAUCOMA) (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.58',
      nombre: 'OFTALMOLOGIA (OCULOPLASTIA) (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.59',
      nombre: 'OFTALMOLOGIA (RETINA) (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.61',
      nombre: 'OFTALMOLOGIA PEDIATRICA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.63',
      nombre: 'OPTOMETRIA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.64',
      nombre: 'ORTOPEDIA (MANO) (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.66',
      nombre: 'ORTOPEDIA ONCOLOGICA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.67',
      nombre: 'ORTOPEDIA Y TRAUMATOLOGIA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.68',
      nombre: 'ORTOPEDIA Y TRAUMATOLOGIA PEDIATRICA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.69',
      nombre: 'OTORRINOLARINGOLOGIA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.70',
      nombre: 'OTORRINOLARINGOLOGIA PEDIATRICA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.71',
      nombre: 'GERIATRIA(PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.72',
      nombre: 'PEDIATRIA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.76',
      nombre: 'PSICOLOGIA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.77',
      nombre: 'PSIQUIATRIA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.82',
      nombre: 'REUMATOLOGIA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.86',
      nombre: 'TRABAJO SOCIAL (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.87',
      nombre: 'UROLOGIA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.10.88',
      nombre: 'UROLOGIA PEDIATRICA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.95.00',
      nombre: 'Traslado de costos (Cr)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.11.95.01',
      nombre: 'TRASLADO DE COSTOS (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.00.00',
      nombre: 'SERVICIOS AMBULATORIOS  SALUD ORAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.02.00',
      nombre: 'Generales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.02.01',
      nombre: 'ESTERILIZACI INSTRUMENTOS ODONTOLICOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.02.07',
      nombre: 'CIRUGIA MAXILOFACIAL(PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.02.09',
      nombre: 'CIRUGIA ORAL Y MAXILOFACIAL (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.02.18',
      nombre: 'ENDODONCIA (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.02.53',
      nombre: 'ODONTOLOGIA (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.02.74',
      nombre: 'PERIODONCIA (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.03.00',
      nombre: 'Sueldos y salarios',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.03.01',
      nombre: 'SUELDOS DE PERSONAL ODONTOLOGICO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.03.03',
      nombre: 'SUELDOS DE PERSONAL ASESORES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.03.05',
      nombre: 'SUELDOS PERSONAL PROFESIONAL UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.03.07',
      nombre: 'SUELDOS DEL PERSONAL ADMINISTRATIVO UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.03.12',
      nombre: 'HONORARIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.03.14',
      nombre: 'PRIMA DE VACACIONESUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.03.15',
      nombre: 'PRIMA DE NAVIDAD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.03.17',
      nombre: 'VACACIONESUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.03.18',
      nombre: 'BONIFICACIONESUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.03.20',
      nombre: 'AUXILIO DE TRANSPORTEUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.03.21',
      nombre: 'CESANTIASUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.03.22',
      nombre: 'INTERESES A LAS CESANTIASUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.03.31',
      nombre: 'PRIMA DE SERVICIOSUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.03.32',
      nombre: 'SUBSIDIO DE ALIMENTACIONUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.03.91',
      nombre: 'RIMA DE NAVIDADUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.03.95',
      nombre: 'SUELDOS PERSONAL PROFESIONAL UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.03.97',
      nombre: 'SUELDOS DEL PERSONAL ADMINISTRATIVO UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.04.00',
      nombre: 'Contribuciones imputadas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.04.99',
      nombre: 'SUBSIDIO FAMILIARUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.09.00',
      nombre: 'Prestaciones sociales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.09.14',
      nombre: 'PRIMA DE VACACIONESUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.09.15',
      nombre: 'PRIMA DE NAVIDADUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.09.18',
      nombre: 'BONIFICACIONESUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.09.20',
      nombre: 'AUXILIO DE TRANSPORTEUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.09.21',
      nombre: 'CESANTIASUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.09.22',
      nombre: 'INTERESES A LAS CESANTIASUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.09.31',
      nombre: 'PRIMA DE SERVICIOSUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.09.32',
      nombre: 'SUBSIDIO DE ALIMENTACIONUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.09.38',
      nombre: 'AUXILIO DE CONECTIVIDAD UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.10.00',
      nombre: 'Gastos de personal diversos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.10.07',
      nombre: 'CIRUGIA MAXILOFACIAL (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.10.09',
      nombre: 'CIRUGIA ORAL Y MAXILOFACIAL (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.10.18',
      nombre: 'ENDODONCIA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.10.53',
      nombre: 'ODONTOLOGIA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.10.74',
      nombre: 'PERIODONCIA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.95.00',
      nombre: 'Traslado de costos (Cr)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.12.95.01',
      nombre: 'TRASLADO DE COSTOS (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.13.00.00',
      nombre: 'SERVICIOS AMBULATORIOS  PROMOCIﾓN Y PREVENCIﾓN',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.13.02.00',
      nombre: 'Generales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.13.02.02',
      nombre: 'PROGRAMAS DE MEDICINA ASISTENCIAL (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.13.02.03',
      nombre: 'VACUNACION (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.13.04.00',
      nombre: 'Contribuciones imputadas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.13.04.01',
      nombre: 'PROGRAMAS DE SALUD ORAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.13.04.02',
      nombre: 'PROGRAMAS DE MEDICINA ASISTENCIAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.13.04.03',
      nombre: 'VACUNACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.13.95.00',
      nombre: 'Traslado de costos (Cr)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.13.95.01',
      nombre: 'TRASLADO DE COSTOS (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.14.00.00',
      nombre: 'SERVICIOS AMBULATORIOS  OTRAS ACTIVIDADES EXTRAMU',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.14.01.00',
      nombre: 'Materiales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.14.01.01',
      nombre: 'SUMINISTRO DE OXIGENO Y OTROS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.14.02.00',
      nombre: 'Generales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.14.02.01',
      nombre: 'MOVILIZACION PACIENTES (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.14.02.21',
      nombre: 'SERVICIO DE ENFERMERIA DOMICILIARIA (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.14.04.00',
      nombre: 'Contribuciones imputadas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.14.04.20',
      nombre: 'SERVICIO DE ENFERMERIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.14.04.21',
      nombre: 'SERVICIO DE ENFERMERIA DOMICILIARIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.14.10.00',
      nombre: 'Gastos de personal diversos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.14.10.01',
      nombre: 'MOVILIZACION PACIENTES (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.14.10.21',
      nombre: 'SERVICIO DE ENFERMERIA DOMICILIARIA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.14.95.00',
      nombre: 'Traslado de costos (Cr)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.14.95.01',
      nombre: 'TRASLADO DE COSTOS (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.20.00.00',
      nombre: 'HOSPITALIZACIﾓN  ESTANCIA GENERAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.20.02.00',
      nombre: 'Generales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.20.02.03',
      nombre: 'AUDIOLOGIA (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.20.04.00',
      nombre: 'Contribuciones imputadas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.20.04.03',
      nombre: 'AUDIOLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.20.04.04',
      nombre: 'CARDIOLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.20.04.12',
      nombre: 'CIRUGIA VASCULAR Y ANGIOLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.20.04.16',
      nombre: 'ENDOCRINOLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.20.04.30',
      nombre: 'HOSPITALES Y CLINICAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.20.04.44',
      nombre: 'NEUMOLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.20.04.47',
      nombre: 'NEUROLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.20.04.48',
      nombre: 'NEUROLOGIA PEDIATRICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.20.04.56',
      nombre: 'OFTALMOLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.20.04.57',
      nombre: 'OFTALMOLOGIA (GLAUCOMA)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.20.04.63',
      nombre: 'OPTOMETRIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.20.05.00',
      nombre: 'Contribuciones efectivas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.20.05.05',
      nombre: 'CONTRIBUCIONES EFECTIVAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.20.05.12',
      nombre: 'CONTRIBUCIONES EFECTIVAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.20.05.13',
      nombre: 'CONTRIBUCIONES EFECTIVAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.20.05.46',
      nombre: 'CONTRIBUCIONES EFECTIVAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.20.95.00',
      nombre: 'Traslado de costos (Cr)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.20.95.01',
      nombre: 'TRASLADO DE COSTOS (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.24.00.00',
      nombre: 'HOSPITALIZACIﾓN  SALUD MENTAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.24.02.00',
      nombre: 'Generales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.24.02.77',
      nombre: 'PSIQUIATRIA INFANTIL(PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.24.02.78',
      nombre: 'PSIQUIATRIA INFANTIL (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.24.04.00',
      nombre: 'Contribuciones imputadas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.24.04.77',
      nombre: 'PSIQUIATRIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.24.04.78',
      nombre: 'PSIQUIATRIA INFANTIL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.24.04.78',
      nombre: 'PSIQUIATRIA INFANTIL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.24.95.01',
      nombre: 'TRASLADO DE COSTOS (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.40.00.00',
      nombre: 'APOYO DIAGNﾓSTICO  LABORATORIO CLﾍNICO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.40.02.00',
      nombre: 'Generales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.40.02.31',
      nombre: 'PRUEBAS ESPECIALIZADASGENETICA (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.40.02.34',
      nombre: 'LABORATORIO CLINICO (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.40.04.00',
      nombre: 'Contribuciones imputadas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.40.04.34',
      nombre: 'LABORATORIO CLINICO',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.40.95.00',
      nombre: 'Traslado de costos (Cr)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.40.95.01',
      nombre: 'TRASLADO DE COSTOS (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.41.00.00',
      nombre: 'APOYO DIAGNﾓSTICO  IMAGENOLOGﾍA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.41.02.00',
      nombre: 'Generales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.41.02.01',
      nombre: 'ELECTROCARDIOGRAMA (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.41.02.19',
      nombre: 'ENDOSCOPIA DIGESTIVA (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.41.02.31',
      nombre: 'IMAGENES DIAGNOSTICAS  (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.41.02.80',
      nombre: 'RADIOLOGIA ORAL (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.41.02.94',
      nombre: 'ELECTROENCEFALOGRAMATOMOGRAFIA (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.41.02.96',
      nombre: 'RESONANCIA MAGNETICA (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.41.04.00',
      nombre: 'Contribuciones imputadas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.41.04.01',
      nombre: 'ELECTROCARDIOGRAMA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.41.04.19',
      nombre: 'ENDOSCOPIA DIGESTIVA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.41.04.31',
      nombre: 'IMﾁGENES DIAGNOSTICAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.41.04.35',
      nombre: 'MAMOGRAFIAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.41.04.79',
      nombre: 'RADIOLOGIARAYOS X (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.41.04.80',
      nombre: 'RADIOLOGIA ORAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.41.04.93',
      nombre: 'ECOGRAFIAESCANOGRAFIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.41.04.94',
      nombre: 'ELECTROENCEFALOGRAMATOMOGRAFIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.41.04.96',
      nombre: 'RESONANCIA MAGNETICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.41.95.00',
      nombre: 'Traslado de costos (Cr)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.41.95.01',
      nombre: 'TRASLADO DE COSTOS (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.42.00.00',
      nombre: 'APOYO DIAGNﾓSTICO  ANATOMﾍA PATOLﾓGICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.42.02.00',
      nombre: 'Generales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.42.02.71',
      nombre: 'PATOLOGIA (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.42.04.00',
      nombre: 'Contribuciones imputadas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.42.04.71',
      nombre: 'PATOLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.42.95.00',
      nombre: 'Traslado de costos (Cr)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.42.95.01',
      nombre: 'TRASLADO DE COSTOS (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.43.00.00',
      nombre: 'APOYO DIAGNﾓSTICO  OTRAS UNIDADES DE APOYO DIAGNﾓ',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.43.02.00',
      nombre: 'Generales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.43.02.01',
      nombre: 'LENTES Y MONTURAS (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.43.02.02',
      nombre: 'LINEA BLANCA  MATERIAL ORTOPEDICO (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.43.02.03',
      nombre: 'AUDIFONOS (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.43.04.00',
      nombre: 'Contribuciones imputadas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.43.04.01',
      nombre: 'LENTES Y MONTURAS (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.43.04.02',
      nombre: 'LINEA BLANCA  MATERIAL ORTOPEDICO (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.43.04.03',
      nombre: 'AUDIFONOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.43.04.41',
      nombre: 'MEDICINA NUCLEAR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.43.95.00',
      nombre: 'Traslado de costos (Cr)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.43.95.01',
      nombre: 'TRASLADO DE COSTOS (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.00.00',
      nombre: 'APOYO TERAPﾉUTICO  REHABILITACIﾓN Y TERAPIAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.02.00',
      nombre: 'Generales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.02.23',
      nombre: 'FISIOTERAPIA (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.02.38',
      nombre: 'MEDICINA FISICA Y REHABILITACION (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.03.00',
      nombre: 'Sueldos y salarios',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.03.05',
      nombre: 'SUELDOS PERSONAL PROFESIONAL UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.03.12',
      nombre: 'HONORARIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.03.14',
      nombre: 'PRIMA DE VACACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.03.15',
      nombre: 'PRIMA DE NAVIDAD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.03.17',
      nombre: 'VACACIONES',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.03.18',
      nombre: 'BONIFICACIONES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.03.21',
      nombre: 'CESANTIASUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.03.22',
      nombre: 'INTERESES A LAS CESANTIASUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.03.31',
      nombre: 'PRIMA DE SERVICIOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.03.91',
      nombre: 'PRIMA DE NAVIDADUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.03.92',
      nombre: 'PRIMA DE VACACIONESUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.03.95',
      nombre: 'SUELDOS PERSONAL PROFESIONAL UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.04.00',
      nombre: 'Contribuciones imputadas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.04.02',
      nombre: 'SUBSIDIO FAMILIAR',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.04.23',
      nombre: 'FISIOTERAPIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.04.38',
      nombre: 'MEDICINA FISICA Y REHABILITACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.04.84',
      nombre: 'TERAPIA DEL LENGUAJE',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.04.85',
      nombre: 'TERAPIA INFANTIL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.04.91',
      nombre: 'TERAPIA OCUPACIONALNEURALOTRAS AYUDAS TERAPEUTIC',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.04.92',
      nombre: 'SUBSIDIO FAMILIARUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.04.99',
      nombre: 'SUBSIDIO FAMILIARUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.09.00',
      nombre: 'Prestaciones sociales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.09.14',
      nombre: 'PRIMA DE VACACIONES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.09.15',
      nombre: 'PRIMA DE NAVIDAD UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.09.21',
      nombre: 'CESANTIASUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.09.22',
      nombre: 'INTERESES A LAS CESANTIASUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.09.31',
      nombre: 'PRIMA DE SERVICIOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.10.00',
      nombre: 'Gastos de personal diversos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.10.12',
      nombre: 'HONORARIOSUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.10.38',
      nombre: 'MEDICINA FISICA Y REHABILITACION (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.95.00',
      nombre: 'Traslado de costos (Cr)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.49.95.01',
      nombre: 'TRASLADO DE COSTOS (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.52.00.00',
      nombre: 'APOYO TERAPﾉUTICO  UNIDAD RENAL',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.52.02.00',
      nombre: 'Generales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.52.02.01',
      nombre: 'SERVICIO DIALISIS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.52.04.00',
      nombre: 'Contribuciones imputadas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.52.04.01',
      nombre: 'SERVICIO DIALISIS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.52.95.00',
      nombre: 'Traslado de costos (Cr)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.52.95.01',
      nombre: 'TRASLADO DE COSTOS (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.56.00.00',
      nombre: 'APOYO TERAPﾉUTICO  OTRAS UNIDADES DE APOYO TERAPﾉ',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.56.01.00',
      nombre: 'Materiales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.56.01.08',
      nombre: 'CIRUGIA ONCOLOGICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.56.01.29',
      nombre: 'HEMATO ONCOLOGIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.56.01.62',
      nombre: 'ONCOLOGIA CLINICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.56.01.81',
      nombre: 'RADIOTERAPIA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.56.02.00',
      nombre: 'Generales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.56.02.03',
      nombre: 'VACUNACION (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.56.02.04',
      nombre: 'APOYO DXPROGRAMA DE P.P.Y P. (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.56.02.08',
      nombre: 'CIRUGIA ONCOLOGICA (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.56.02.29',
      nombre: 'HEMATO ONCOLOGIA  (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.56.02.62',
      nombre: 'ONCOLOGIA CLINICA  (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.56.02.81',
      nombre: 'RADIOTERAPIA  (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.56.04.00',
      nombre: 'Contribuciones imputadas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.56.04.03',
      nombre: 'VACUNACION',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.56.04.04',
      nombre: 'APOYO DXPROGRAMA DE P.P.Y P.',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.56.10.00',
      nombre: 'Gastos de personal diversos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.56.10.04',
      nombre: 'APOYO DXPROGRAMA DE P.P.Y P. (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.56.10.08',
      nombre: 'CIRUGIA ONCOLOGICA (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.56.10.62',
      nombre: 'ONCOLOGIA CLINICA  (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.56.10.81',
      nombre: 'RADIOTERAPIA  (PN)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.56.95.00',
      nombre: 'Traslado de costos (Cr)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.56.95.01',
      nombre: 'TRASLADO DE COSTOS (CR)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.84.00.00',
      nombre: 'SERVICIOS CONEXOS A LA SALUD  INVESTIGACIﾓN CIENT',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.84.02.00',
      nombre: 'Generales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.84.02.01',
      nombre: 'ATENCION MEDICA INTEGRAL PERS.JURIDICA (PJ)',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.00.00',
      nombre: 'SERVICIOS CONEXOS A LA SALUD  OTROS SERVICIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.02.00',
      nombre: 'Generales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.02.01',
      nombre: 'AUXILIO PARA PROTESIS AUDITIVAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.02.04',
      nombre: 'COMISIONES Y HONORARIOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.02.23',
      nombre: 'SERVICIO AMBULANCIAS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.02.50',
      nombre: 'REEMBOLSO SERVICIOS MEDICOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.02.51',
      nombre: 'REEMBOLSO MATERIALES MEDICOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.02.52',
      nombre: 'REEMBOLSO SEGUROS MEDICOS',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.03.00',
      nombre: 'Sueldos y salarios',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.03.01',
      nombre: 'SUELDOS DE PERSONAL REGENTE DE FARMACIA UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.03.02',
      nombre: 'SUELDOS DE PERSONAL AUXILIAR ENFERMERIA UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.03.03',
      nombre: 'SUELDOS DE PERSONAL AUXILIAR FARMACIA UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.03.12',
      nombre: 'HONORARIOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.03.13',
      nombre: 'REMUNERACION SERVICIOS TECNICOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.03.14',
      nombre: 'PRIMA DE VACACIONES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.03.15',
      nombre: 'PRIMA DE NAVIDAD UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.03.17',
      nombre: 'VACACIONES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.03.18',
      nombre: 'BONIFICACIONES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.03.20',
      nombre: 'AUXILIO DE TRANSPORTEUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.03.21',
      nombre: 'CESANTIASUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.03.22',
      nombre: 'INTERESES A LAS CESANTIASUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.03.23',
      nombre: 'HORAS EXTRAS Y FESTIVOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.03.31',
      nombre: 'PRIMA DE SERVICIOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.03.32',
      nombre: 'SUBSIDIO DE ALIMENTACIONUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.03.38',
      nombre: 'AUXILIO DE CONECTIVIDAD UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.03.91',
      nombre: 'PRIMA DE NAVIDADUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.03.92',
      nombre: 'PRIMA DE VACACIONESUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.03.93',
      nombre: 'BONIFICACIONES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.04.00',
      nombre: 'Contribuciones imputadas',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.04.01',
      nombre: 'ATENCION MEDICA INTEGRAL PERS.JURIDICA',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.04.02',
      nombre: 'SUBSIDIO FAMILIARUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.04.03',
      nombre: 'INCAPACIDADESLICENCIA MATERNIDAD UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.09.00',
      nombre: 'Prestaciones sociales',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.09.14',
      nombre: 'PRIMA DE VACACIONES UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.09.15',
      nombre: 'PRIMA DE NAVIDAD UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.09.21',
      nombre: 'CESANTIASUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.09.22',
      nombre: 'INTERESES A LAS CESANTIASUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.09.31',
      nombre: 'PRIMA DE SERVICIOS UISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.10.00',
      nombre: 'Gastos de personal diversos',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.10.12',
      nombre: 'HONORARIOSUISALUD',
      corriente: 'false',
      noCorriente: 'true',
    },
    {
      codigo: '7.3.87.95.00',
      nombre: 'Traslado de costos (Cr)',
      corriente: 'false',
      noCorriente: 'true',
    },
  ];

  modeloDatosReporte = [
    {
      codigo: '1.1',
    },
    {
      codigo: '1.1.05',
    },
    {
      codigo: '1.1.10',
    },
    {
      codigo: '1.1.32',
    },
    {
      codigo: '1.2',
      tipo: 'C',
    },
    {
      codigo: '1.2.01',
    },
    {
      codigo: '1.2.21',
    },
    {
      codigo: '1.2.23',
    },
    {
      codigo: '1.2.24',
    },
    {
      codigo: '1.2.80',
    },
    {
      codigo: '1.3',
    },
    {
      codigo: '1.3.17',
    },
    {
      codigo: '1.3.19',
    },
    {
      codigo: '1.3.22',
    },
    {
      codigo: '1.3.24',
    },
    {
      codigo: '1.3.37',
    },
    {
      codigo: '1.3.84',
    },
    {
      codigo: '1.3.85',
    },
    {
      codigo: '1.3.86',
    },
    {
      codigo: '1.3.90',
    },
    {
      codigo: '1.4',
    },
    {
      codigo: '1.5',
    },
    {
      codigo: '1.5.05',
    },
    {
      codigo: '1.5.10',
    },
    {
      codigo: '1.5.14',
    },
    {
      codigo: '1.5.30',
    },
    {
      codigo: '1.9',
      tipo: 'C',
    },
    {
      codigo: '1.9.04',
    },
    {
      codigo: '1.9.05',
    },
    {
      codigo: '1.9.06',
    },
    {
      codigo: '1.9.09',
    },
    {
      codigo: '1.9.26',
    },
    {
      codigo: '1.9.51',
      tipo: 'C',
    },
    {
      codigo: '1.9.52',
    },
    {
      codigo: '1.9.70',
    },
    {
      codigo: '1.9.75',
    },
    {
      codigo: 'subtotal1',
    },
    {
      codigo: '1.2',
      tipo: 'N',
    },
    {
      codigo: '1.2.01',
      tipo: 'N',
    },
    {
      codigo: '1.2.21',
      tipo: 'N',
    },
    {
      codigo: '1.2.23',
      tipo: 'N',
    },
    {
      codigo: '1.2.80',
      tipo: 'N',
    },
    {
      codigo: '1.6',
    },
    {
      codigo: '1.6.05',
    },
    {
      codigo: '1.6.15',
    },
    {
      codigo: '1.6.25',
    },
    {
      codigo: '1.6.35',
    },
    {
      codigo: '1.6.40',
    },
    {
      codigo: '1.6.45',
    },
    {
      codigo: '1.6.50',
    },
    {
      codigo: '1.6.55',
    },
    {
      codigo: '1.6.60',
    },
    {
      codigo: '1.6.65',
    },
    {
      codigo: '1.6.70',
    },
    {
      codigo: '1.6.75',
    },
    {
      codigo: '1.6.81',
    },
    {
      codigo: '1.6.85',
    },
    {
      codigo: '1.6.95',
    },
    {
      codigo: '1.7',
    },
    {
      codigo: '1.7.10',
    },
    {
      codigo: '1.7.15',
    },
    {
      codigo: '1.9',
      tipo: 'N',
    },
    {
      codigo: '1.9.51',
      tipo: 'N',
    },
    {
      codigo: '1.9.70.02',
    },
    {
      codigo: 'subtotal2',
    },
    {
      codigo: 'totalactivos',
    },
    {
      codigo: '2.4',
    },
    {
      codigo: '2.4.01',
    },
    {
      codigo: '2.4.07',
    },
    {
      codigo: '2.4.24',
    },
    {
      codigo: '2.4.36',
    },
    {
      codigo: '2.4.40',
    },
    {
      codigo: '2.4.60',
    },
    {
      codigo: '2.4.81',
    },
    {
      codigo: '2.4.90',
    },
    {
      codigo: '2.5',
      tipo: 'C',
    },
    {
      codigo: '2.5.11',
    },
    {
      codigo: '2.5.12',
    },
    {
      codigo: '2.5.14',
    },
    {
      codigo: '2.7',
      tipo: 'C',
    },
    {
      codigo: '2.7.01',
    },
    {
      codigo: '2.9',
    },
    {
      codigo: '2.9.02',
    },
    {
      codigo: '2.9.10',
    },
    {
      codigo: '2.9.90',
    },
    {
      codigo: 'subtotal3',
    },
    {
      codigo: '2.5',
      tipo: 'N',
    },
    {
      codigo: '2.5.11',
      tipo: 'N',
    },
    {
      codigo: '2.5.12',
      tipo: 'N',
    },
    {
      codigo: '2.5.14',
      tipo: 'N',
    },
    {
      codigo: '2.7',
      tipo: 'N',
    },
    {
      codigo: '2.7.90',
    },
    {
      codigo: 'subtotal4',
    },
    {
      codigo: 'totalpasivos',
    },
    {
      codigo: '3.1.05',
    },
    {
      codigo: '3.1.09',
    },
    {
      codigo: '3.1.09.01',
    },
    {
      codigo: '3.1.10',
    },
    {
      codigo: '3.1.10.01.00',
    },
    {
      codigo: '3.1.45',
    },
    {
      codigo: '3.1.51',
    },
    {
      codigo: '3.1.51.01.02',
    },
    {
      codigo: 'totalpatrimonio',
    },
    {
      codigo: 'totalambos',
    },
    {
      codigo: '8',
    },
    {
      codigo: '8.1 ',
    },
    {
      codigo: '8.1.20 ',
    },
    {
      codigo: '8.1.20.01 ',
    },
    {
      codigo: '8.1.20.02 ',
    },
    {
      codigo: '8.1.90 ',
    },
    {
      codigo: '8.1.90.90 ',
    },
    {
      codigo: '8.3 ',
    },
    {
      codigo: '8.3.47 ',
    },
    {
      codigo: '8.3.47.04 ',
    },
    {
      codigo: '8.3.61 ',
      nombre: 'RESPONSABILIDADES EN PROCESO ',
    },
    {
      codigo: '8.3.61.01 ',
      nombre: 'INTERNAS ',
    },
    {
      codigo: '8.9 ',
      nombre: 'DEUDORAS POR CONTRA (CR) ',
    },
    {
      codigo: '8.9.05 ',
      nombre: 'DERECHOS CONTINGENTES POR CONTRA (CR) ',
    },
    {
      codigo: '8.9.05.06 ',
      nombre: 'LITIGIOS Y MECANISMOS ALTERNATIVOS DE SOLUCIÓN DE CONFLICTOS ',
    },
    {
      codigo: '8.9.05.90 ',
      nombre: 'OTROS DERECHOS CONTINGENTES ',
    },
    {
      codigo: '8.9.15 ',
      nombre: 'DEUDORAS DE CONTROL POR CONTRA (CR) ',
    },
    {
      codigo: '8.9.15.16 ',
      nombre: 'Ejecuci de proyectos de inversi',
    },
    {
      codigo: '8.9.15.18 ',
      nombre: 'Bienes entregados a terceros',
    },

    {
      codigo: '8.9.15.21 ',
      nombre: 'RESPONSABILIDADES EN PROCESO ',
    },

    {
      codigo: '9 ',
      nombre: 'CUENTAS DE ORDEN ACREEDORAS ',
    },
    {
      codigo: '9.1 ',
      nombre: 'RESPONSABILIDADES CONTINGENTES ',
    },
    {
      codigo: '9.1.10 ',
      nombre: 'BIENES RECIBIDOS EN GARANTIA',
    },
    {
      codigo: '9.1.10.01 ',
      nombre: 'INVERSIONES',
    },
    {
      codigo: '9.1.20 ',
      nombre: 'LITIGIOS Y MECANISMOS ALTERNATIVOS DE SOLUCIÓN DE CONFLICTOS ',
    },
    {
      codigo: '9.1.20.04 ',
      nombre: '	ADMINISTRATIVOS',
    },
    {
      codigo: '9.1.20.05 ',
      nombre: 'OBLIGACIONES FISCALES ',
    },
    {
      codigo: '9.1.90 ',
      nombre: 'OTRAS RESPONSABILIDADES CONTINGENTES ',
    },
    {
      codigo: '9.1.90.01 ',
      nombre: 'CUENTAS EN PARTICIPACIÓN ',
    },
    {
      codigo: '9.1.90.90 ',
      nombre: 'Otros pasivos contingentes',
    },
    {
      codigo: '9.3 ',
      nombre: 'ACREEDORAS DE CONTROL ',
    },
    {
      codigo: '9.3.13 ',
      nombre: 'MERCANCIAS RECIBIDAS EN CONSIGNACION',
    },
    {
      codigo: '9.3.13.01 ',
      nombre: 'MERCANCIAS RECIBIDAS EN CONSIGNACION',
    },
    {
      codigo: '9.3.46 ',
      nombre: 'BIENES RECIBIDOS DE TERCEROS ',
    },
    {
      codigo: '9.3.46.19 ',
      nombre: 'PROPIEDADES, PLANTA Y EQUIPO ',
    },
    {
      codigo: '9.3.46.90 ',
      nombre: 'OTROS BIENES RECIBIDOS DE TERCEROS ',
    },
    {
      codigo: '9.3.90 ',
      nombre: 'OTRAS CUENTAS ACREEDORAS DE CONTROL ',
    },
    {
      codigo: '9.3.90.12 ',
      nombre: 'FACTURACION GLOSADA ADQUIS.SERVICIOS SALUD',
    },
    {
      codigo: '9.3.90.13 ',
    },
    {
      codigo: '9.3.90.90 ',
    },
    {
      codigo: '9.9 ',
    },
    {
      codigo: '9.9.05 ',
    },
    {
      codigo: '9.9.05.05 ',
    },
    {
      codigo: '9.9.05.90 ',
    },
    {
      codigo: '9.9.15 ',
    },
    {
      codigo: '9.9.15.03 ',
    },
    {
      codigo: '9.9.15.06 ',
    },
    {
      codigo: '9.9.15.90 ',
    },
    {
      codigo: 'totalochoynueve',
    },
  ];

  modeloDatosReporte2 = [
    {
      CODIGO: '4 ',
      NOMBRE: 'INGRESOS ',
    },
    {
      CODIGO: '4.3 ',
      NOMBRE: 'VENTA DE SERVICIOS ',
    },
    {
      CODIGO: '4.3.05 ',
      NOMBRE: 'SERVICIOS EDUCATIVOS ',
    },
    {
      CODIGO: '4.3.05.14 ',
      NOMBRE: 'EDUCACIÓN FORMAL - SUPERIOR FORMACIÓN PROFESIONAL ',
    },
    {
      CODIGO: '4.3.05.15 ',
      NOMBRE: 'EDUCACIÓN FORMAL- SUPERIOR POSTGRADOS ',
    },
    {
      CODIGO: '4.3.05.27 ',
      NOMBRE: 'EDUCACIÓN NO FORMAL - FORMACIÓN EXTENSIVA ',
    },
    {
      CODIGO: '4.3.05.50 ',
      NOMBRE: 'SERVICIOS CONEXOS A LA EDUCACIÓN ',
    },
    {
      CODIGO: '4.3.11 ',
      NOMBRE: 'ADMINISTRACIÓN DEL SISTEMA DE SEGURIDAD SOCIAL EN SALUD ',
    },
    {
      CODIGO: '4.3.11.05 ',
      NOMBRE: '',
    },
    {
      CODIGO: '4.3.11.90 ',
      NOMBRE:
        'OTROS INGRESOS POR LA ADMINISTRACIÓN DEL SISTEMA DE SEGURIDAD SOCIAL EN SALUD ',
    },
    {
      CODIGO: '4.3.90 ',
      NOMBRE: 'SERVICIOS ',
    },
    {
      CODIGO: '4.3.90.07 ',
      NOMBRE: 'PUBLICIDAD Y PROPAGANDA ',
    },
    {
      CODIGO: '4.3.95 ',
      NOMBRE: 'DEVOLUCIONES, REBAJAS Y DESCUENTOS EN VENTA DE SERVICIOS (DB) ',
    },
    {
      CODIGO: '4.3.95.01 ',
      NOMBRE: 'SERVICIOS EDUCATIVOS ',
    },
    {
      CODIGO: '4.4 ',
      NOMBRE: 'TRANSFERENCIAS ',
    },
    {
      CODIGO: '4.4.13 ',
      NOMBRE: 'SISTEMA GENERAL DE REGALÍAS ',
    },
    {
      CODIGO: '4.4.13.01 ',
      NOMBRE: 'ASIGNACIONES DIRECTAS ',
    },
    {
      CODIGO: '4.4.28 ',
      NOMBRE: 'OTRAS TRANSFERENCIAS ',
    },
    {
      CODIGO: '4.4.28.02 ',
      NOMBRE: 'PARA PROYECTOS DE INVERSIÓN ',
    },
    {
      CODIGO: '4.4.28.03 ',
      NOMBRE: 'PARA GASTOS DE FUNCIONAMIENTO ',
    },
    {
      CODIGO: '4.8 ',
      NOMBRE: 'OTROS INGRESOS ',
    },
    {
      CODIGO: '4.8.02 ',
      NOMBRE: 'FINANCIEROS ',
    },
    {
      CODIGO: '4.8.02.11 ',
      NOMBRE: 'RENDIM.EFECTIVO INVERS.DE ADMON.DE LIQUID.COSTO AM ',
    },
    {
      CODIGO: '4.8.02.16 ',
      NOMBRE: 'GCIA.POR VALORAC.INSTRUMENT.DERIV.VR.MCDO.VR.RAZON',
    },
    {
      CODIGO: '4.8.02.32 ',
      NOMBRE: 'Rendimientos sobre recursos entregados en administ',
    },
    {
      CODIGO: '4.8.02.90 ',
      NOMBRE: 'Otros ingresos financierost',
    },
    {
      CODIGO: '4.8.05 ',
      NOMBRE: 'FINANCIEROS ',
    },
    {
      CODIGO: '4.8.05.04 ',
      NOMBRE: 'INTERESES DE DEUDORES ',
    },
    {
      CODIGO: '4.8.05.07 ',
      NOMBRE: 'RENDIMIENTO POR REAJUSTE MONETARIO ',
    },
    {
      CODIGO: '4.8.05.13 ',
      NOMBRE: 'INTERESES DE MORA ',
    },
    {
      CODIGO: '4.8.05.22 ',
      NOMBRE: 'INTERESES SOBRE DEPÓSITOS EN INSTITUCIONES FINANCIERAS ',
    },
    {
      CODIGO: '4.8.05.35 ',
      NOMBRE: 'RENDIMIENTOS SOBRE RECURSOS ENTREGADOS EN ADMINISTRACIÓN ',
    },
    {
      CODIGO: '4.8.05.90 ',
      NOMBRE: 'OTROS INGRESOS FINANCIEROS ',
    },
    {
      CODIGO: '4.8.08 ',
      NOMBRE: 'OTROS INGRESOS ORDINARIOS ',
    },
    {
      CODIGO: '4.8.08.02 ',
      NOMBRE: 'VENTA DE PLIEGOS ',
    },
    {
      CODIGO: '4.8.08.03 ',
      NOMBRE: 'CUOTAS PARTES DE PENSIONES ',
    },
    {
      CODIGO: '4.8.08.05 ',
      NOMBRE: 'UTILIDAD EN VENTA DE ACTIVOS ',
    },
    {
      CODIGO: '4.8.08.06 ',
      NOMBRE: 'PUBLICACIONES ',
    },
    {
      CODIGO: '4.8.08.08 ',
      NOMBRE: 'HONORARIOS ',
    },
    {
      CODIGO: '4.8.08.17 ',
      NOMBRE: 'ARRENDAMIENTOS ',
    },
    {
      CODIGO: '4.8.08.19 ',
      NOMBRE: 'DONACIONES ',
    },
    {
      CODIGO: '4.8.08.25 ',
      NOMBRE: 'SOBRANTES ',
    },
    {
      CODIGO: '4.8.08.27 ',
      NOMBRE: 'APROVECHAMIENTO ',
    },
    {
      CODIGO: '4.8.08.28 ',
      NOMBRE: 'INDEMNIZACIONES ',
    },
    {
      CODIGO: '4.8.08.90 ',
      NOMBRE: 'OTROS INGRESOS ORDINARIOS ',
    },
    {
      CODIGO: '4.8.10 ',
      NOMBRE: 'EXTRAORDINARIOS ',
    },
    {
      CODIGO: '4.8.10.07 ',
      NOMBRE: 'SOBRANTES ',
    },
    {
      CODIGO: '4.8.10.08 ',
      NOMBRE: 'RECUPERACIONES ',
    },
    {
      CODIGO: '4.8.10.47 ',
      NOMBRE: 'APROVECHAMIENTOS ',
    },
    {
      CODIGO: '4.8.10.49 ',
      NOMBRE: 'INDEMNIZACIONES ',
    },
    {
      CODIGO: '4.8.10.90 ',
      NOMBRE: 'OTROS INGRESOS EXTRAORDINARIOS ',
    },
    {
      CODIGO: '4.8.15 ',
      NOMBRE: 'AJUSTE DE EJERCICIOS ANTERIORES ',
    },
    {
      CODIGO: '4.8.15.57 ',
      NOMBRE: 'TRANSFERENCIAS ',
    },
    {
      CODIGO: '4.8.15.59 ',
      NOMBRE: 'OTROS INGRESOS ',
    },
    {
      CODIGO: '5 ',
      NOMBRE: 'GASTOS ',
    },
    {
      CODIGO: '5.1 ',
      NOMBRE: 'DE ADMINISTRACIÓN ',
    },
    {
      CODIGO: '5.1.01 ',
      NOMBRE: 'SUELDOS Y SALARIOS ',
    },
    {
      CODIGO: '5.1.01.01 ',
      NOMBRE: 'SUELDOS DEL PERSONAL ',
    },
    {
      CODIGO: '5.1.01.03 ',
      NOMBRE: 'HORAS EXTRAS Y FESTIVOS ',
    },
    {
      CODIGO: '5.1.01.05 ',
      NOMBRE: 'GASTOS DE REPRESENTACIÓN ',
    },
    {
      CODIGO: '5.1.01.06 ',
      NOMBRE: 'REMUNERACIÓN SERVICIOS TÉCNICOS ',
    },
    {
      CODIGO: '5.1.01.09 ',
      NOMBRE: 'HONORARIOS ',
    },
    {
      CODIGO: '5.1.01.13 ',
      NOMBRE: 'PRIMA DE VACACIONES ',
    },
    {
      CODIGO: '5.1.01.14 ',
      NOMBRE: 'PRIMA DE NAVIDAD ',
    },
    {
      CODIGO: '5.1.01.17 ',
      NOMBRE: 'VACACIONES ',
    },
    {
      CODIGO: '5.1.01.19 ',
      NOMBRE: 'BONIFICACIONES ',
    },
    {
      CODIGO: '5.1.01.23 ',
      NOMBRE: 'AUXILIO DE TRANSPORTE ',
    },
    {
      CODIGO: '5.1.01.24 ',
      NOMBRE: 'CESANTÍAS ',
    },
    {
      CODIGO: '5.1.01.25 ',
      NOMBRE: 'INTERESES A LAS CESANTÍAS ',
    },
    {
      CODIGO: '5.1.01.30 ',
      NOMBRE: 'CAPACITACIÓN, BIENESTAR SOCIAL Y ESTÍMULOS ',
    },
    {
      CODIGO: '5.1.01.31 ',
      NOMBRE: 'DOTACIÓN Y SUMINISTRO A TRABAJADORES ',
    },
    {
      CODIGO: '5.1.01.33 ',
      NOMBRE: 'GASTOS DEPORTIVOS Y DE RECREACIÓN ',
    },
    {
      CODIGO: '5.1.01.47 ',
      NOMBRE: 'VIÁTICOS ',
    },
    {
      CODIGO: '5.1.01.48 ',
      NOMBRE: 'GASTOS DE VIAJE ',
    },
    {
      CODIGO: '5.1.01.50 ',
      NOMBRE: 'BONIFICACIÓN POR SERVICIOS PRESTADOS ',
    },
    {
      CODIGO: '5.1.01.52 ',
      NOMBRE: 'PRIMA DE SERVICIOS ',
    },
    {
      CODIGO: '5.1.01.60 ',
      NOMBRE: 'SUBSIDIO DE ALIMENTACIÓN ',
    },
    {
      CODIGO: '5.1.01.64 ',
      NOMBRE: 'OTRAS PRIMAS ',
    },
    {
      CODIGO: '5.1.01.90 ',
      NOMBRE: 'OTROS SUELDOS Y SALARIOS ',
    },
    {
      CODIGO: '5.1.02 ',
      NOMBRE: 'CONTRIBUCIONES IMPUTADAS ',
    },
    {
      CODIGO: '5.1.02.01 ',
      NOMBRE: 'INCAPACIDADES ',
    },
    {
      CODIGO: '5.1.02.02 ',
      NOMBRE: 'SUBSIDIO FAMILIAR ',
    },
    {
      CODIGO: '5.1.02.07 ',
      NOMBRE: 'CUOTAS PARTES DE PENSIONES ',
    },
    {
      CODIGO: '5.1.02.90 ',
      NOMBRE: 'OTRAS CONTRIBUCIONES IMPUTADAS ',
    },
    {
      CODIGO: '5.1.03 ',
      NOMBRE: 'CONTRIBUCIONES EFECTIVAS ',
    },
    {
      CODIGO: '5.1.03.03 ',
      NOMBRE: 'COTIZACIONES A SEGURIDAD SOCIAL EN SALUD ',
    },
    {
      CODIGO: '5.1.03.04 ',
      NOMBRE: 'APORTES SINDICALES ',
    },
    {
      CODIGO: '5.1.03.05 ',
      NOMBRE: 'COTIZACIONES A RIESGOS PROFESIONALES ',
    },
    {
      CODIGO: '5.1.03.06 ',
      NOMBRE:
        'COTIZACIONES A ENTIDADES ADMINISTRADORAS DEL RÉGIMEN DE PRIMA MEDIA ',
    },
    {
      CODIGO: '5.1.03.07 ',
      NOMBRE:
        'COTIZACIONES A ENTIDADES ADMINISTRADORAS DEL RÉGIMEN DE AHORRO INDIVIDUAL ',
    },
    {
      CODIGO: '5.1.03.90 ',
      NOMBRE: 'OTRAS CONTRIBUCIONES EFECTIVAS ',
    },
    {
      CODIGO: '5.1.04 ',
      NOMBRE: 'APORTES SOBRE LA NÓMINA ',
    },
    {
      CODIGO: '5.1.04.01 ',
      NOMBRE: 'APORTES AL ICBF ',
    },
    {
      CODIGO: '5.1.07 ',
      NOMBRE: 'PRESTACIONES SOCIALES ',
    },
    {
      CODIGO: '5.1.07.01 ',
      NOMBRE: 'vacaciones ',
    },
    {
      CODIGO: '5.1.07.02 ',
      NOMBRE: 'CESANTIAS ',
    },
    {
      CODIGO: '5.1.07.03 ',
      NOMBRE: 'INTERESES DE LAS CESANTIAS ',
    },
    {
      CODIGO: '5.1.07.04 ',
      NOMBRE: 'PRIMA DE VACACIONES ',
    },
    {
      CODIGO: '5.1.07.05 ',
      NOMBRE: 'PRIMA DE NAVIDAD',
    },
    {
      CODIGO: '5.1.07.06',
      NOMBRE: 'PRIMA DE SERVICIOS',
    },
    {
      CODIGO: '5.1.08 ',
      NOMBRE: 'GASTOS DE PERSONAL DIVERSOS ',
    },
    {
      CODIGO: '5.1.08.01 ',
      NOMBRE: 'renumeracion por servicios tecnicos',
    },
    {
      CODIGO: '5.1.08.03 ',
      NOMBRE: 'capacitacion bienestar social',
    },
    {
      CODIGO: '5.1.08.04 ',
      NOMBRE: 'dotacion y suministro a trabajadores',
    },
    {
      CODIGO: '5.1.08.05 ',
      NOMBRE: 'gastos deportivos y de recreacion',
    },
    {
      CODIGO: '5.1.08.07 ',
      NOMBRE: 'gastos de viaje',
    },
    {
      CODIGO: '5.1.08.10 ',
      NOMBRE: 'gastos de viaje',
    },
    {
      CODIGO: '5.1.08.90 ',
      NOMBRE: 'otros gastos de personal diversos',
    },
    {
      CODIGO: '5.1.11 ',
      NOMBRE: 'GENERALES ',
    },
    {
      CODIGO: '5.1.11.06 ',
      NOMBRE: 'ESTUDIOS Y PROYECTOS ',
    },
    {
      CODIGO: '5.1.11.11 ',
      NOMBRE: 'COMISIONES, HONORARIOS Y SERVICIOS ',
    },
    {
      CODIGO: '5.1.11.12 ',
      NOMBRE: 'OBRAS Y MEJORAS EN PROPIEDAD AJENA ',
    },
    {
      CODIGO: '5.1.11.13 ',
      NOMBRE: 'VIGILANCIA Y SEGURIDAD ',
    },
    {
      CODIGO: '5.1.11.14 ',
      NOMBRE: 'MATERIALES Y SUMINISTROS ',
    },
    {
      CODIGO: '5.1.11.15 ',
      NOMBRE: 'MANTENIMIENTO ',
    },
    {
      CODIGO: '5.1.11.16 ',
      NOMBRE: 'REPARACIONES ',
    },
    {
      CODIGO: '5.1.11.17 ',
      NOMBRE: 'SERVICIOS PÚBLICOS ',
    },
    {
      CODIGO: '5.1.11.18 ',
      NOMBRE: 'ARRENDAMIENTO ',
    },
    {
      CODIGO: '5.1.11.19 ',
      NOMBRE: 'VIÁTICOS Y GASTOS DE VIAJE ',
    },
    {
      CODIGO: '5.1.11.20 ',
      NOMBRE: 'PUBLICIDAD Y PROPAGANDA ',
    },
    {
      CODIGO: '5.1.11.21 ',
      NOMBRE: 'IMPRESOS, PUBLICACIONES, SUSCRIPCIONES Y AFILIACIONES ',
    },
    {
      CODIGO: '5.1.11.22 ',
      NOMBRE: 'FOTOCOPIAS ',
    },
    {
      CODIGO: '5.1.11.23 ',
      NOMBRE: 'COMUNICACIONES Y TRANSPORTE ',
    },
    {
      CODIGO: '5.1.11.25 ',
      NOMBRE: 'SEGUROS GENERALES ',
    },
    {
      CODIGO: '5.1.11.33 ',
      NOMBRE: 'SEGURIDAD INDUSTRIAL ',
    },
    {
      CODIGO: '5.1.11.36 ',
      NOMBRE: 'IMPLEMENTOS DEPORTIVOS ',
    },
    {
      CODIGO: '5.1.11.37 ',
      NOMBRE: 'EVENTOS CULTURALES ',
    },
    {
      CODIGO: '5.1.11.46 ',
      NOMBRE: 'COMBUSTIBLES Y LUBRICANTES ',
    },
    {
      CODIGO: '5.1.11.49 ',
      NOMBRE: 'SERVICIOS DE ASEO, CAFETERÍA, RESTAURANTE Y LAVANDERÍA ',
    },
    {
      CODIGO: '5.1.11.55 ',
      NOMBRE: 'ELEMENTOS DE ASEO, LAVANDERÍA Y CAFETERÍA ',
    },
    {
      CODIGO: '5.1.11.64 ',
      NOMBRE: 'GASTOS LEGALES ',
    },
    {
      CODIGO: '5.1.11.65 ',
      NOMBRE: 'INTANGIBLES ',
    },
    {
      CODIGO: '5.1.11.79 ',
      NOMBRE: 'HONORARIOS ',
    },
    {
      CODIGO: '5.1.11.80 ',
      NOMBRE: 'SERVICIOS ',
    },
    {
      CODIGO: '5.1.11.90 ',
      NOMBRE: 'OTROS GASTOS GENERALES ',
    },
    {
      CODIGO: '5.1.20 ',
      NOMBRE: 'IMPUESTOS, CONTRIBUCIONES Y TASAS ',
    },
    {
      CODIGO: '5.1.20.01 ',
      NOMBRE: 'IMPUESTO PREDIAL UNIFICADO ',
    },
    {
      CODIGO: '5.1.20.02 ',
      NOMBRE: 'CUOTA DE FISCALIZACIÓN Y AUDITAJE ',
    },
    {
      CODIGO: '5.1.20.06 ',
      NOMBRE: 'VALORIZACIÓN ',
    },
    {
      CODIGO: '5.1.20.08 ',
      NOMBRE: 'SANCIONES ',
    },
    {
      CODIGO: '5.1.20.10 ',
      NOMBRE: 'TASAS ',
    },
    {
      CODIGO: '5.1.20.11 ',
      NOMBRE: 'IMPUESTO SOBRE VEHÍCULOS AUTOMOTORES ',
    },
    {
      CODIGO: '5.1.20.12 ',
      NOMBRE: 'IMPUESTO DE REGISTRO ',
    },
    {
      CODIGO: '5.1.20.24 ',
      NOMBRE: 'GRAVAMEN A LOS MOVIMIENTOS FINANCIEROS ',
    },
    {
      CODIGO: '5.1.20.26 ',
      NOMBRE: 'CONTRIBUCIONES ',
    },
    {
      CODIGO: '5.1.20.27 ',
      NOMBRE: 'LICENCIAS ',
    },
    {
      CODIGO: '5.1.20.90 ',
      NOMBRE: 'OTROS IMPUESTOS ',
    },
    {
      CODIGO: '5.3 ',
      NOMBRE: 'DETERIORO, DEPRECIACIONES, AMORTIZACIONES Y PROVIS ',
    },
    {
      CODIGO: '5.3.60 ',
      NOMBRE: 'DEPRECIACIﾓN DE PROPIEDADES, PLANTA Y EQUIPO ',
    },
    {
      CODIGO: '5.3.60.01 ',
      NOMBRE: 'Edificaciones ',
    },
    {
      CODIGO: '5.3.60.02 ',
      NOMBRE: 'Plantas, ductos y t佖eles ',
    },
    {
      CODIGO: '5.3.62 ',
      NOMBRE: 'DEPRECIACIﾓN DE PROPIEDADES DE INVERSIﾓN ',
    },
    {
      CODIGO: '5.3.62.01 ',
      NOMBRE: 'Edificaciones ',
    },
    {
      CODIGO: '5.8 ',
      NOMBRE: 'OTROS GASTOS ',
    },
    {
      CODIGO: '5.8.02 ',
      NOMBRE: 'COMISIONES ',
    },
    {
      CODIGO: '5.8.02.37 ',
      NOMBRE: 'COMISIONES SOBRE RECURSOS ENTREGADOS EN ADMINISTRACIÓN ',
    },
    {
      CODIGO: '5.8.02.38 ',
      NOMBRE: 'COMISIONES Y OTROS GASTOS BANCARIOS ',
    },
    {
      CODIGO: '5.8.02.40 ',
      NOMBRE: 'COMISIONES Y servicios financieros',
    },
    {
      CODIGO: '5.8.02.90 ',
      NOMBRE: 'OTRAS COMISIONES ',
    },
    {
      CODIGO: '5.8.08 ',
      NOMBRE: 'OTROS GASTOS ORDINARIOS ',
    },
    {
      CODIGO: '5.8.08.02 ',
      NOMBRE: 'PÉRDIDA EN RETIRO DE ACTIVOS ',
    },
    {
      CODIGO: '5.8.08.12 ',
      NOMBRE: 'SENTENCIAS ',
    },
    {
      CODIGO: '5.8.08.90 ',
      NOMBRE: 'OTROS GASTOS ORDINARIOS ',
    },
    {
      CODIGO: '5.8.10 ',
      NOMBRE: 'EXTRAORDINARIOS ',
    },
    {
      CODIGO: '5.8.10.06 ',
      NOMBRE: 'PÉRDIDAS EN SINIESTROS ',
    },
    {
      CODIGO: '5.8.10.90 ',
      NOMBRE: 'OTROS GASTOS EXTRAORDINARIOS ',
    },
    {
      CODIGO: '5.8.15 ',
      NOMBRE: 'AJUSTE DE EJERCICIOS ANTERIORES ',
    },
    {
      CODIGO: '5.8.15.88 ',
      NOMBRE: 'GASTOS DE ADMINISTRACIÓN ',
    },
    {
      CODIGO: '5.8.15.90 ',
      NOMBRE: 'PROVISIONES, DEPRECIACIONES Y AMORTIZACIONES ',
    },
    {
      CODIGO: '5.8.15.93 ',
      NOMBRE: 'OTROS GASTOS ',
    },
    {
      CODIGO: '5.9 ',
      NOMBRE: 'CIERRE DE INGRESOS, GASTOS Y COSTOS ',
    },
    {
      CODIGO: '5.9.05 ',
      NOMBRE: 'CIERRE DE INGRESOS, GASTOS Y COSTOS',
    },
    {
      CODIGO: '5.9.05.01 ',
      NOMBRE: 'Cierre de ingresos, gastos y costos',
    },
    {
      CODIGO: '6 ',
      NOMBRE: 'COSTOS DE VENTAS Y OPERACIÓN ',
    },
    {
      CODIGO: '6.3 ',
      NOMBRE: 'COSTO DE VENTAS DE SERVICIOS ',
    },
    {
      CODIGO: '6.3.05 ',
      NOMBRE: 'SERVICIOS EDUCATIVOS ',
    },
    {
      CODIGO: '6.3.05.08 ',
      NOMBRE: 'EDUCACIÓN FORMAL - SUPERIOR FORMACIÓN PROFESIONAL ',
    },
    {
      CODIGO: '6.3.05.09 ',
      NOMBRE: 'EDUCACIÓN FORMAL - SUPERIOR POSTGRADO ',
    },
    {
      CODIGO: '6.3.10 ',
      NOMBRE: 'SERVICIOS DE SALUD ',
    },
    {
      CODIGO: '6.3.10.15 ',
      NOMBRE: 'SERVICIOS AMBULATORIOS - CONSULTA EXTERNA Y PROCEDIMIENTOS ',
    },
    {
      CODIGO: '6.3.10.16 ',
      NOMBRE: 'SERVICIOS AMBULATORIOS - CONSULTA ESPECIALIZADA ',
    },
    {
      CODIGO: '6.3.10.17 ',
      NOMBRE: 'SERVICIOS AMBULATORIOS - ACTIVIDADES DE SALUD ORAL ',
    },
    {
      CODIGO: '6.3.10.50 ',
      NOMBRE: 'APOYO TERAPÉUTICO - REHABILITACIÓN Y TERAPIAS ',
    },
    {
      CODIGO: '6.3.10.67 ',
      NOMBRE: 'SERVICIOS CONEXOS A LA SALUD OTROS SERVICIOS ',
    },
    {
      CODIGO: '7 ',
      NOMBRE: 'COSTOS DE PRODUCCIÓN ',
    },
    {
      CODIGO: '7.2 ',
      NOMBRE: 'SERVICIOS EDUCATIVOS ',
    },
    {
      CODIGO: '7.2.08 ',
      NOMBRE: 'EDUCACIÓN FORMAL  SUPERIOR - FORMACIÓN PROFESIONAL ',
    },
    {
      CODIGO: '7.2.08.02 ',
      NOMBRE: 'GENERALES ',
    },
    {
      CODIGO: '7.2.08.03 ',
      NOMBRE: 'SUELDOS Y SALARIOS ',
    },
    {
      CODIGO: '7.2.08.04 ',
      NOMBRE: 'CONTRIBUCIONES IMPUTADAS ',
    },
    {
      CODIGO: '7.2.08.05 ',
      NOMBRE: 'CONTRIBUCIONES EFECTIVAS ',
    },
    {
      CODIGO: '7.2.08.06 ',
      NOMBRE: 'APORTES SOBRE LA NÓMINA ',
    },
    {
      CODIGO: '7.2.08.07 ',
      NOMBRE: 'DEPRECIACIÓN Y AMORTIZACIÓN ',
    },
    {
      CODIGO: '7.2.08.08 ',
      NOMBRE: 'IMPUESTOS ',
    },
    {
      CODIGO: '7.2.08.09 ',
      NOMBRE: 'PRESTACIONES SOCIALES ',
    },
    {
      CODIGO: '7.2.08.10 ',
      NOMBRE: 'REMUNERACION SERVICIOS TECNICOS',
    },
    {
      CODIGO: '7.2.08.95 ',
      NOMBRE: 'TRASLADO DE COSTOS (CR) ',
    },
    {
      CODIGO: '7.2.09 ',
      NOMBRE: 'EDUCACIÓN FORMAL - SUPERIOR - POSTGRADO ',
    },
    {
      CODIGO: '7.2.09.02 ',
      NOMBRE: 'GENERALES ',
    },
    {
      CODIGO: '7.2.09.03 ',
      NOMBRE: 'SUELDOS Y SALARIOS ',
    },
    {
      CODIGO: '7.2.09.05 ',
      NOMBRE: 'CONTRIBUCIONES EFECTIVAS ',
    },
    {
      CODIGO: '7.2.09.08 ',
      NOMBRE: 'IMPUESTOS ',
    },
    {
      CODIGO: '7.2.09.10 ',
      NOMBRE: 'GASTOS DE PERSONAL DIVERSOS ',
    },
    {
      CODIGO: '7.2.09.95 ',
      NOMBRE: 'TRASLADO DE COSTOS (CR) ',
    },
    {
      CODIGO: '7.3 ',
      NOMBRE: 'SERVICIOS DE SALUD ',
    },
    {
      CODIGO: '7.3.01 ',
      NOMBRE: 'URGENCIAS CONSULTA Y PROCEDIMIENTOS ',
    },
    {
      CODIGO: '7.3.10 ',
      NOMBRE: 'SERVICIOS AMBULATORIOS - CONSULTA EXTERNA Y PROCEDIMIENTOS ',
    },
    {
      CODIGO: '7.3.10.01 ',
      NOMBRE: 'MATERIALES UISSALUD ',
    },
    {
      CODIGO: '7.3.10.04 ',
      NOMBRE: 'CONTRIBUCIONES IMPUTADAS ',
    },
    {
      CODIGO: '7.3.10.10 ',
      NOMBRE: 'GASTOS DE PERSONAL DIVERSOS',
    },
    {
      CODIGO: '7.3.10.95 ',
      NOMBRE: 'TRASLADO DE COSTOS (CR) ',
    },
    {
      CODIGO: '7.3.11 ',
      NOMBRE: 'SERVICIOS AMBULATORIOS - CONSULTA ESPECIALIZADA ',
    },
    {
      CODIGO: '7.3.11.02 ',
      NOMBRE: 'GENERALES ',
    },
    {
      CODIGO: '7.3.11.03 ',
      NOMBRE: 'SUELDOS Y SALARIOS ',
    },
    {
      CODIGO: '7.3.11.04 ',
      NOMBRE: 'CONTRIBUCIONES IMPUTADAS ',
    },
    {
      CODIGO: '7.3.11.05 ',
      NOMBRE: 'CONTRIBUCIONES EFECTIVAS ',
    },
    {
      CODIGO: '7.3.11.07 ',
      NOMBRE: 'DEPRECIACIÓN Y AMORTIZACIÓN ',
    },
    {
      CODIGO: '7.3.11.09 ',
      NOMBRE: 'PRESTACIONES SOCIALES',
    },
    {
      CODIGO: '7.3.11.10 ',
      NOMBRE: 'GASTOS DE PERSONAL DIVERSOS',
    },
    {
      CODIGO: '7.3.11.95 ',
      NOMBRE: 'TRASLADO DE COSTOS (CR) ',
    },
    {
      CODIGO: '7.3.12 ',
      NOMBRE: 'SERVICIOS AMBULATORIOS - SALUD ORAL ',
    },
    {
      CODIGO: '7.3.12.01 ',
      NOMBRE: 'MATERIALES ',
    },
    {
      CODIGO: '7.3.12.02 ',
      NOMBRE: 'GENERALES ',
    },
    {
      CODIGO: '7.3.12.03 ',
      NOMBRE: 'SUELDOS Y SALARIOS ',
    },
    {
      CODIGO: '7.3.12.04 ',
      NOMBRE: 'CONTRIBUCIONES IMPUTADAS ',
    },
    {
      CODIGO: '7.3.12.09 ',
      NOMBRE: 'PRESTACIONES SOCIALES ',
    },
    {
      CODIGO: '7.3.12.10 ',
      NOMBRE: 'GASTOS DE PERSONAL DIVERSOS ',
    },
    {
      CODIGO: '7.3.12.95 ',
      NOMBRE: 'TRASLADO DE COSTOS (CR) ',
    },
    {
      CODIGO: '7.3.14 ',
      NOMBRE: '	SERVICIOS AMBULATORIOS - OTRAS ACTIVIDADES EXTRAMU ',
    },
    {
      CODIGO: '7.3.14.01 ',
      NOMBRE: '	suministro de oxigeno ',
    },
    {
      CODIGO: '7.3.14.02 ',
      NOMBRE: '	generales ',
    },
    {
      CODIGO: '7.3.14.04 ',
      NOMBRE: '	contribuciones imputadas ',
    },
    {
      CODIGO: '7.3.20 ',
      NOMBRE: 'HOSPITALIZACIﾓN - ESTANCIA GENERAL ',
    },
    {
      CODIGO: '7.3.20.02 ',
      NOMBRE: 'GENERALES',
    },
    {
      CODIGO: '7.3.24 ',
      NOMBRE: 'HOSPITALIZACION SALUD MENTAL ',
    },
    {
      CODIGO: '7.3.24.02 ',
      NOMBRE: 'HPSIQUIATRIA INFANTIL pn ',
    },
    {
      CODIGO: '7.3.40 ',
      NOMBRE: 'APOYO DIAGNﾓSTICO - LABORATORIO CLﾍNICO',
    },
    {
      CODIGO: '7.3.40.02 ',
      NOMBRE: 'GENERALES',
    },
    {
      CODIGO: '7.3.41 ',
      NOMBRE: 'APOYO DIAGNﾓSTICO - IMAGENOLOGﾍA',
    },
    {
      CODIGO: '7.3.41.02 ',
      NOMBRE: 'GENERALES',
    },
    {
      CODIGO: '7.3.41.04 ',
      NOMBRE: 'CONTRIBUCIONES IMPUTADAS',
    },
    {
      CODIGO: '7.3.42 ',
      NOMBRE: 'APOYO DIAGNﾓSTICO - ANATOMﾍA PATOLﾓGICA',
    },
    {
      CODIGO: '7.3.42.02 ',
      NOMBRE: 'GENERALES',
    },

    {
      CODIGO: '7.3.43 ',
      NOMBRE: 'APOYO DIAGNﾓSTICO - OTRAS UNIDADES DE APOYO DIAGNﾓ',
    },
    {
      CODIGO: '7.3.43.01 ',
      NOMBRE: 'LENTES Y MONTURAS',
    },
    {
      CODIGO: '7.3.43.02 ',
      NOMBRE: 'MATERIAL ORTOPEDICO',
    },
    {
      CODIGO: '7.3.43.04 ',
      NOMBRE: 'CONTRIBUCIONES IMPUTADAS',
    },
    {
      CODIGO: '7.3.49 ',
      NOMBRE: 'APOYO TERAPÉUTICO - REHABILITACIÓN Y TERAPIAS ',
    },
    {
      CODIGO: '7.3.49.02 ',
      NOMBRE: 'GENERALES ',
    },
    {
      CODIGO: '7.3.49.03 ',
      NOMBRE: 'SUELDOS Y SALARIOS ',
    },
    {
      CODIGO: '7.3.49.04 ',
      NOMBRE: 'CONTRIBUCIONES IMPUTADAS ',
    },
    {
      CODIGO: '7.3.49.09',
      NOMBRE: 'PRESTACIONES SOCIALES ',
    },
    {
      CODIGO: '7.3.49.10',
      NOMBRE: 'GASTOS DE PERSONAL DIVERSOS',
    },
    {
      CODIGO: '7.3.49.95 ',
      NOMBRE: 'TRASLADO DE COSTOS (CR) ',
    },
    {
      CODIGO: '7.3.56 ',
      NOMBRE: 'APOYO TERAPﾉUTICO - OTRAS UNIDADES DE APOYO TERAPﾉ',
    },
    {
      CODIGO: '7.3.56.02 ',
      NOMBRE: 'generales',
    },
    {
      CODIGO: '7.3.56.10 ',
      NOMBRE: 'Gastos de personal diversos',
    },
    {
      CODIGO: '7.3.87 ',
      NOMBRE: 'SERVICIOS CONEXOS A LA SALUD  OTROS SERVICIOS ',
    },
    {
      CODIGO: '7.3.87.02 ',
      NOMBRE: 'GENERALES ',
    },
    {
      CODIGO: '7.3.87.03 ',
      NOMBRE: 'SUELDOS Y SALARIOS ',
    },
    {
      CODIGO: '7.3.87.04 ',
      NOMBRE: 'CONTRIBUCIONES IMPUTADAS',
    },
    {
      CODIGO: '7.3.87.09 ',
      NOMBRE: 'PRESTACIONES SOCIALES',
    },
    {
      CODIGO: '7.3.87.10 ',
      NOMBRE: 'GASTOS DE PERSONAL',
    },
    {
      CODIGO: '7.3.87.95 ',
      NOMBRE: 'TRASLADO DE COSTOS (CR) ',
    },
  ];

  modeloPorcentajes = [
    {
      codigo: '1.1.05 ',
      NOMBRE: 'CAJA ',
      ' SALDO INICIAL(Pesos) ': 471304100,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 19500000,
      ' SALDO FINAL(Pesos) ': 451804100,
      ' SALDO FINAL CORRIENTE(Pesos) ': 451804100,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.1.05.02 ',
      NOMBRE: 'CAJA MENOR ',
      ' SALDO INICIAL(Pesos) ': 471304100,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 19500000,
      ' SALDO FINAL(Pesos) ': 451804100,
      ' SALDO FINAL CORRIENTE(Pesos) ': 451804100,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.1.10 ',
      NOMBRE: 'DEPÓSITOS EN INSTITUCIONES FINANCIERAS ',
      ' SALDO INICIAL(Pesos) ': 120502522552,
      ' MOVIMIENTO DEBITO(Pesos) ': 420364660501,
      ' MOVIMIENTO CREDITO(Pesos) ': 413902593213,
      ' SALDO FINAL(Pesos) ': 126964589840,
      ' SALDO FINAL CORRIENTE(Pesos) ': 126964589840,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.1.10.05 ',
      NOMBRE: 'CUENTA CORRIENTE ',
      ' SALDO INICIAL(Pesos) ': 28664358929,
      ' MOVIMIENTO DEBITO(Pesos) ': 222896395554,
      ' MOVIMIENTO CREDITO(Pesos) ': 216779894462,
      ' SALDO FINAL(Pesos) ': 34780860021,
      ' SALDO FINAL CORRIENTE(Pesos) ': 34780860021,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.1.10.06 ',
      NOMBRE: 'CUENTA DE AHORRO ',
      ' SALDO INICIAL(Pesos) ': 91838163623,
      ' MOVIMIENTO DEBITO(Pesos) ': 197468264947,
      ' MOVIMIENTO CREDITO(Pesos) ': 197122698751,
      ' SALDO FINAL(Pesos) ': 92183729819,
      ' SALDO FINAL CORRIENTE(Pesos) ': 92183729819,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.2.21 ',
      NOMBRE:
        'INVERSIONES DE ADMINISTRACIÓN DE LIQUIDEZ A VALOR DE MERCADO (VALOR RAZONABLE) CON CAMBIOS EN EL RESULTADO ',
      ' SALDO INICIAL(Pesos) ': 79578147179,
      ' MOVIMIENTO DEBITO(Pesos) ': 89932794066,
      ' MOVIMIENTO CREDITO(Pesos) ': 86496588727,
      ' SALDO FINAL(Pesos) ': 83014352518,
      ' SALDO FINAL CORRIENTE(Pesos) ': 76159671118,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 6854681400,
      porcentajeCorriente: 0.917427755658111,
      porcentajeNoCorriente: 0.082572244341889,
    },
    {
      codigo: '1.2.21.01 ',
      NOMBRE: 'TÍTULOS DE TESORERÍA (TES) ',
      ' SALDO INICIAL(Pesos) ': 334466336,
      ' MOVIMIENTO DEBITO(Pesos) ': 1991761872,
      ' MOVIMIENTO CREDITO(Pesos) ': 98676640,
      ' SALDO FINAL(Pesos) ': 2227551568,
      ' SALDO FINAL CORRIENTE(Pesos) ': 318481568,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 1909070000,
      porcentajeCorriente: 0.142973824972298,
      porcentajeNoCorriente: 0.857026175027702,
    },
    {
      codigo: '1.2.21.03 ',
      NOMBRE: 'BONOS Y TÍTULOS EMITIDOS POR EL SECTOR PRIVADO ',
      ' SALDO INICIAL(Pesos) ': 2786486485,
      ' MOVIMIENTO DEBITO(Pesos) ': 56537815,
      ' MOVIMIENTO CREDITO(Pesos) ': 36431900,
      ' SALDO FINAL(Pesos) ': 2806592400,
      ' SALDO FINAL CORRIENTE(Pesos) ': 2806592400,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.2.21.07 ',
      NOMBRE:
        'BONOS Y TÍTULOS EMITIDOS POR LAS ENTIDADES PÚBLICAS NO FINANCIERAS ',
      ' SALDO INICIAL(Pesos) ': 4867047000,
      ' MOVIMIENTO DEBITO(Pesos) ': 150845250,
      ' MOVIMIENTO CREDITO(Pesos) ': 72280850,
      ' SALDO FINAL(Pesos) ': 4945611400,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 4945611400,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.2.21.16 ',
      NOMBRE: 'FONDOS DE INVERSIÓN COLECTIVA ',
      ' SALDO INICIAL(Pesos) ': 71590147358,
      ' MOVIMIENTO DEBITO(Pesos) ': 87733649129,
      ' MOVIMIENTO CREDITO(Pesos) ': 86289199337,
      ' SALDO FINAL(Pesos) ': 73034597150,
      ' SALDO FINAL CORRIENTE(Pesos) ': 73034597150,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.2.23 ',
      NOMBRE: 'INVERSIONES DE ADMINISTRACIÓN DE LIQUIDEZ A COSTO AMORTIZADO ',
      ' SALDO INICIAL(Pesos) ': 38233794379,
      ' MOVIMIENTO DEBITO(Pesos) ': 23570061811,
      ' MOVIMIENTO CREDITO(Pesos) ': 21366119759,
      ' SALDO FINAL(Pesos) ': 40437736431,
      ' SALDO FINAL CORRIENTE(Pesos) ': 17643256547,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 22794479884,
      porcentajeCorriente: 0.436306729905744,
      porcentajeNoCorriente: 0.563693270094256,
    },
    {
      codigo: '1.2.23.02 ',
      NOMBRE: 'CERTIFICADOS DE DEPÓSITO A TÉRMINO (CDT) ',
      ' SALDO INICIAL(Pesos) ': 38233794379,
      ' MOVIMIENTO DEBITO(Pesos) ': 23570061811,
      ' MOVIMIENTO CREDITO(Pesos) ': 21366119759,
      ' SALDO FINAL(Pesos) ': 40437736431,
      ' SALDO FINAL CORRIENTE(Pesos) ': 17643256547,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 22794479884,
      porcentajeCorriente: 0.436306729905744,
      porcentajeNoCorriente: 0.563693270094256,
    },
    {
      codigo: '1.2.24 ',
      NOMBRE: 'INVERSIONES DE ADMINISTRACIÓN DE LIQUIDEZ AL COSTO ',
      ' SALDO INICIAL(Pesos) ': 341217083,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 341217083,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 341217083,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.2.24.13 ',
      NOMBRE: 'ACCIONES ORDINARIAS ',
      ' SALDO INICIAL(Pesos) ': 12220888,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 12220888,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 12220888,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.2.24.15 ',
      NOMBRE: 'CUOTAS O PARTES DE INTERÉS SOCIAL ',
      ' SALDO INICIAL(Pesos) ': 328996195,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 328996195,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 328996195,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.2.80 ',
      NOMBRE: 'DETERIORO ACUMULADO DE INVERSIONES (CR) ',
      ' SALDO INICIAL(Pesos) ': -12220888,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': -12220888,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': -12220888,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.2.80.42 ',
      NOMBRE: 'INVERSIONES DE ADMINISTRACIÓN DE LIQUIDEZ AL COSTO ',
      ' SALDO INICIAL(Pesos) ': -12220888,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': -12220888,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': -12220888,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.3.17 ',
      NOMBRE: 'PRESTACIÓN DE SERVICIOS ',
      ' SALDO INICIAL(Pesos) ': 7130441390,
      ' MOVIMIENTO DEBITO(Pesos) ': 29318555665,
      ' MOVIMIENTO CREDITO(Pesos) ': 24918396919,
      ' SALDO FINAL(Pesos) ': 11530600136,
      ' SALDO FINAL CORRIENTE(Pesos) ': 11530600136,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.3.17.01 ',
      NOMBRE: 'SERVICIOS EDUCATIVOS ',
      ' SALDO INICIAL(Pesos) ': 864600907,
      ' MOVIMIENTO DEBITO(Pesos) ': 12097468552,
      ' MOVIMIENTO CREDITO(Pesos) ': 10633614782,
      ' SALDO FINAL(Pesos) ': 2328454677,
      ' SALDO FINAL CORRIENTE(Pesos) ': 2328454677,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.3.17.90 ',
      NOMBRE: 'OTROS SERVICIOS ',
      ' SALDO INICIAL(Pesos) ': 6265840483,
      ' MOVIMIENTO DEBITO(Pesos) ': 17221087113,
      ' MOVIMIENTO CREDITO(Pesos) ': 14284782137,
      ' SALDO FINAL(Pesos) ': 9202145459,
      ' SALDO FINAL CORRIENTE(Pesos) ': 9202145459,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.3.19 ',
      NOMBRE: 'PRESTACIÓN DE SERVICIOS DE SALUD ',
      ' SALDO INICIAL(Pesos) ': 134983068,
      ' MOVIMIENTO DEBITO(Pesos) ': 260410534,
      ' MOVIMIENTO CREDITO(Pesos) ': 219977818,
      ' SALDO FINAL(Pesos) ': 175415784,
      ' SALDO FINAL CORRIENTE(Pesos) ': 175415784,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.3.19.14 ',
      NOMBRE:
        'SERVICIOS DE SALUD POR ENTIDADES CON RÉGIMEN ESPECIAL - SIN FACTURAR O CON FACTURACIÓN PENDIENTE DE RADICAR ',
      ' SALDO INICIAL(Pesos) ': 134983068,
      ' MOVIMIENTO DEBITO(Pesos) ': 260410534,
      ' MOVIMIENTO CREDITO(Pesos) ': 219977818,
      ' SALDO FINAL(Pesos) ': 175415784,
      ' SALDO FINAL CORRIENTE(Pesos) ': 175415784,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.3.22 ',
      NOMBRE: 'ADMINISTRACIÓN DE LA SEGURIDAD SOCIAL EN SALUD ',
      ' SALDO INICIAL(Pesos) ': 21150677,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 21150677,
      ' SALDO FINAL CORRIENTE(Pesos) ': 21150677,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.3.22.20 ',
      NOMBRE: 'INCAPACIDADES  ',
      ' SALDO INICIAL(Pesos) ': 21150677,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 21150677,
      ' SALDO FINAL CORRIENTE(Pesos) ': 21150677,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.3.37 ',
      NOMBRE: 'TRANSFERENCIAS POR COBRAR ',
      ' SALDO INICIAL(Pesos) ': 21139022733,
      ' MOVIMIENTO DEBITO(Pesos) ': 61116149846,
      ' MOVIMIENTO CREDITO(Pesos) ': 68153840768,
      ' SALDO FINAL(Pesos) ': 14101331811,
      ' SALDO FINAL CORRIENTE(Pesos) ': 14101331811,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.3.37.12 ',
      NOMBRE: 'OTRAS TRANSFERENCIAS ',
      ' SALDO INICIAL(Pesos) ': 21139022733,
      ' MOVIMIENTO DEBITO(Pesos) ': 61115058816,
      ' MOVIMIENTO CREDITO(Pesos) ': 68152749738,
      ' SALDO FINAL(Pesos) ': 14101331811,
      ' SALDO FINAL CORRIENTE(Pesos) ': 14101331811,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.3.84 ',
      NOMBRE: 'OTRAS CUENTAS POR COBRAR ',
      ' SALDO INICIAL(Pesos) ': 43839912448,
      ' MOVIMIENTO DEBITO(Pesos) ': 26714571474,
      ' MOVIMIENTO CREDITO(Pesos) ': 28453439103,
      ' SALDO FINAL(Pesos) ': 42101044819,
      ' SALDO FINAL CORRIENTE(Pesos) ': 42101044819,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.3.84.08 ',
      NOMBRE: 'CUOTAS PARTES DE PENSIONES ',
      ' SALDO INICIAL(Pesos) ': 32315290697,
      ' MOVIMIENTO DEBITO(Pesos) ': 583776614,
      ' MOVIMIENTO CREDITO(Pesos) ': 903447673,
      ' SALDO FINAL(Pesos) ': 31995619638,
      ' SALDO FINAL CORRIENTE(Pesos) ': 31995619638,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.3.84.13 ',
      NOMBRE: 'DEVOLUCIÓN IVA PARA ENTIDADES DE EDUCACIÓN SUPERIOR ',
      ' SALDO INICIAL(Pesos) ': 17787000,
      ' MOVIMIENTO DEBITO(Pesos) ': 11006886078,
      ' MOVIMIENTO CREDITO(Pesos) ': 11006886078,
      ' SALDO FINAL(Pesos) ': 17787000,
      ' SALDO FINAL CORRIENTE(Pesos) ': 17787000,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.3.84.90 ',
      NOMBRE: 'OTRAS CUENTAS POR COBRAR ',
      ' SALDO INICIAL(Pesos) ': 11506834751,
      ' MOVIMIENTO DEBITO(Pesos) ': 15123908782,
      ' MOVIMIENTO CREDITO(Pesos) ': 16543105352,
      ' SALDO FINAL(Pesos) ': 10087638181,
      ' SALDO FINAL CORRIENTE(Pesos) ': 10087638181,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.3.85 ',
      NOMBRE: 'CUENTAS POR COBRAR DE DIFÍCIL RECAUDO ',
      ' SALDO INICIAL(Pesos) ': 1758950463,
      ' MOVIMIENTO DEBITO(Pesos) ': 419798686,
      ' MOVIMIENTO CREDITO(Pesos) ': 25573577,
      ' SALDO FINAL(Pesos) ': 2153175572,
      ' SALDO FINAL CORRIENTE(Pesos) ': 2153175572,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.3.85.02 ',
      NOMBRE: 'PRESTACIÓN DE SERVICIOS ',
      ' SALDO INICIAL(Pesos) ': 326167760,
      ' MOVIMIENTO DEBITO(Pesos) ': 406250000,
      ' MOVIMIENTO CREDITO(Pesos) ': 545486,
      ' SALDO FINAL(Pesos) ': 731872274,
      ' SALDO FINAL CORRIENTE(Pesos) ': 731872274,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.3.85.90 ',
      NOMBRE: 'OTRAS CUENTAS POR COBRAR DE DIFÍCIL RECAUDO ',
      ' SALDO INICIAL(Pesos) ': 1432782703,
      ' MOVIMIENTO DEBITO(Pesos) ': 13548686,
      ' MOVIMIENTO CREDITO(Pesos) ': 25028091,
      ' SALDO FINAL(Pesos) ': 1421303298,
      ' SALDO FINAL CORRIENTE(Pesos) ': 1421303298,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.3.86 ',
      NOMBRE: 'DETERIORO ACUMULADO DE CUENTAS POR COBRAR (CR) ',
      ' SALDO INICIAL(Pesos) ': -5247070801,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': -5247070801,
      ' SALDO FINAL CORRIENTE(Pesos) ': -5247070801,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.3.86.02 ',
      NOMBRE: 'PRESTACIÓN DE SERVICIOS ',
      ' SALDO INICIAL(Pesos) ': -48461633,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': -48461633,
      ' SALDO FINAL CORRIENTE(Pesos) ': -48461633,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.3.86.90 ',
      NOMBRE: 'OTRAS CUENTAS POR COBRAR ',
      ' SALDO INICIAL(Pesos) ': -5198609168,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': -5198609168,
      ' SALDO FINAL CORRIENTE(Pesos) ': -5198609168,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.5.05 ',
      NOMBRE: 'BIENES PRODUCIDOS ',
      ' SALDO INICIAL(Pesos) ': 529645670,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 529645670,
      ' SALDO FINAL CORRIENTE(Pesos) ': 529645670,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.5.05.06 ',
      NOMBRE: 'IMPRESOS Y PUBLICACIONES ',
      ' SALDO INICIAL(Pesos) ': 529645670,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 529645670,
      ' SALDO FINAL CORRIENTE(Pesos) ': 529645670,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.5.10 ',
      NOMBRE: 'MERCANCÍAS EN EXISTENCIA ',
      ' SALDO INICIAL(Pesos) ': 848169676,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 848169676,
      ' SALDO FINAL CORRIENTE(Pesos) ': 848169676,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.5.10.04 ',
      NOMBRE: 'IMPRESOS Y PUBLICACIONES ',
      ' SALDO INICIAL(Pesos) ': 635773502,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 635773502,
      ' SALDO FINAL CORRIENTE(Pesos) ': 635773502,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.5.10.90 ',
      NOMBRE: 'OTRAS MERCANCÍAS EN EXISTENCIA ',
      ' SALDO INICIAL(Pesos) ': 212396174,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 212396174,
      ' SALDO FINAL CORRIENTE(Pesos) ': 212396174,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.5.14 ',
      NOMBRE: 'MATERIALES Y SUMINISTROS ',
      ' SALDO INICIAL(Pesos) ': 2470824325,
      ' MOVIMIENTO DEBITO(Pesos) ': 5089657426,
      ' MOVIMIENTO CREDITO(Pesos) ': 5049878405,
      ' SALDO FINAL(Pesos) ': 2510603346,
      ' SALDO FINAL CORRIENTE(Pesos) ': 2510603346,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.5.14.03 ',
      NOMBRE: 'MEDICAMENTOS ',
      ' SALDO INICIAL(Pesos) ': 873727835,
      ' MOVIMIENTO DEBITO(Pesos) ': 3979397378,
      ' MOVIMIENTO CREDITO(Pesos) ': 3863981142,
      ' SALDO FINAL(Pesos) ': 989144071,
      ' SALDO FINAL CORRIENTE(Pesos) ': 989144071,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.5.14.05 ',
      NOMBRE: 'MATERIALES REACTIVOS Y DE LABORATORIO ',
      ' SALDO INICIAL(Pesos) ': 984140287,
      ' MOVIMIENTO DEBITO(Pesos) ': 71038160,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 1055178447,
      ' SALDO FINAL CORRIENTE(Pesos) ': 1055178447,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.5.14.08 ',
      NOMBRE: 'VÍVERES Y RANCHO ',
      ' SALDO INICIAL(Pesos) ': 612956203,
      ' MOVIMIENTO DEBITO(Pesos) ': 1039221888,
      ' MOVIMIENTO CREDITO(Pesos) ': 1185897263,
      ' SALDO FINAL(Pesos) ': 466280828,
      ' SALDO FINAL CORRIENTE(Pesos) ': 466280828,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.5.30 ',
      NOMBRE: 'EN PODER DE TERCEROS ',
      ' SALDO INICIAL(Pesos) ': 33033515,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 33033515,
      ' SALDO FINAL CORRIENTE(Pesos) ': 33033515,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.5.30.90 ',
      NOMBRE: 'OTROS INVENTARIOS EN PODER DE TERCEROS ',
      ' SALDO INICIAL(Pesos) ': 33033515,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 33033515,
      ' SALDO FINAL CORRIENTE(Pesos) ': 33033515,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.6.05 ',
      NOMBRE: 'TERRENOS ',
      ' SALDO INICIAL(Pesos) ': 661934750355,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 661934750355,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 661934750355,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.05.01 ',
      NOMBRE: 'URBANOS ',
      ' SALDO INICIAL(Pesos) ': 659977552355,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 659977552355,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 659977552355,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.05.02 ',
      NOMBRE: 'RURALES ',
      ' SALDO INICIAL(Pesos) ': 1957198000,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 1957198000,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 1957198000,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.15 ',
      NOMBRE: 'CONSTRUCCIONES EN CURSO ',
      ' SALDO INICIAL(Pesos) ': 231054282493,
      ' MOVIMIENTO DEBITO(Pesos) ': 29218428883,
      ' MOVIMIENTO CREDITO(Pesos) ': 700125000,
      ' SALDO FINAL(Pesos) ': 259572586376,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 259572586376,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.15.01 ',
      NOMBRE: 'EDIFICACIONES ',
      ' SALDO INICIAL(Pesos) ': 231054282493,
      ' MOVIMIENTO DEBITO(Pesos) ': 29218428883,
      ' MOVIMIENTO CREDITO(Pesos) ': 700125000,
      ' SALDO FINAL(Pesos) ': 259572586376,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 259572586376,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.25 ',
      NOMBRE: 'PROPIEDADES, PLANTA Y EQUIPO EN TRÁNSITO ',
      ' SALDO INICIAL(Pesos) ': 3931902942,
      ' MOVIMIENTO DEBITO(Pesos) ': 155187994,
      ' MOVIMIENTO CREDITO(Pesos) ': 153383593,
      ' SALDO FINAL(Pesos) ': 3933707343,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 3933707343,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
     {
      codigo: '1.6.25.03 ',
      NOMBRE: 'EQUIPO MÉDICO Y CIENTÍFICO ',
      ' SALDO INICIAL(Pesos) ': 52254864,
      ' MOVIMIENTO DEBITO(Pesos) ': 2067760,
      ' MOVIMIENTO CREDITO(Pesos) ': 10505629,
      ' SALDO FINAL(Pesos) ': 43816995,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 43816995,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.25.04 ',
      NOMBRE: 'EQUIPO MÉDICO Y CIENTÍFICO ',
      ' SALDO INICIAL(Pesos) ': 52254864,
      ' MOVIMIENTO DEBITO(Pesos) ': 2067760,
      ' MOVIMIENTO CREDITO(Pesos) ': 10505629,
      ' SALDO FINAL(Pesos) ': 43816995,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 43816995,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
     {
      codigo: '1.6.25.05 ',
      NOMBRE: 'EQUIPO DE COMUNICACION Y COMPUTACION',
      ' SALDO INICIAL(Pesos) ': 52254864,
      ' MOVIMIENTO DEBITO(Pesos) ': 2067760,
      ' MOVIMIENTO CREDITO(Pesos) ': 10505629,
      ' SALDO FINAL(Pesos) ': 43816995,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 43816995,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.25.07 ',
      NOMBRE: 'MUEBLES, ENSERES Y EQUIPO DE OFICINA ',
      ' SALDO INICIAL(Pesos) ': 67166356,
      ' MOVIMIENTO DEBITO(Pesos) ': 107692586,
      ' MOVIMIENTO CREDITO(Pesos) ': 120833744,
      ' SALDO FINAL(Pesos) ': 54025198,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 54025198,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.25.12 ',
      NOMBRE: 'COMPONENTES DE PROPIEDADES, PLANTA Y EQUIPO ',
      ' SALDO INICIAL(Pesos) ': 0,
      ' MOVIMIENTO DEBITO(Pesos) ': 45427648,
      ' MOVIMIENTO CREDITO(Pesos) ': 22044220,
      ' SALDO FINAL(Pesos) ': 23383428,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 23383428,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.25.90 ',
      NOMBRE: 'OTRAS MAQUINARIAS, PLANTA Y EQUIPO EN TRÁNSITO ',
      ' SALDO INICIAL(Pesos) ': 3812481722,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 3812481722,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 3812481722,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.40 ',
      NOMBRE: 'EDIFICACIONES ',
      ' SALDO INICIAL(Pesos) ': 772509534276,
      ' MOVIMIENTO DEBITO(Pesos) ': 170080000,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 772679614276,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 772679614276,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.40.01 ',
      NOMBRE: 'EDIFICIOS Y CASAS ',
      ' SALDO INICIAL(Pesos) ': 715828938453,
      ' MOVIMIENTO DEBITO(Pesos) ': 170080000,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 715999018453,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 715999018453,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.40.02 ',
      NOMBRE: 'OFICINAS ',
      ' SALDO INICIAL(Pesos) ': 2427364482,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 2427364482,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 2427364482,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.40.12 ',
      NOMBRE: 'HOTELES, HOSTALES Y PARADORES ',
      ' SALDO INICIAL(Pesos) ': 2488370000,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 2488370000,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 2488370000,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.40.17 ',
      NOMBRE: 'PARQUEADEROS Y GARAJES ',
      ' SALDO INICIAL(Pesos) ': 22151563551,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 22151563551,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 22151563551,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.40.19 ',
      NOMBRE: 'INSTALACIONES DEPORTIVAS Y RECREACIONALES ',
      ' SALDO INICIAL(Pesos) ': 19669698869,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 19669698869,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 19669698869,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
     {
      codigo: '1.6.40.24 ',
      NOMBRE: 'TANQUES DE ALMACENAMIENTO ',
      ' SALDO INICIAL(Pesos) ': 19669698869,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 19669698869,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 19669698869,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.40.90 ',
      NOMBRE: 'OTRAS EDIFICACIONES ',
      ' SALDO INICIAL(Pesos) ': 9943598921,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 9943598921,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 9943598921,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.45 ',
      NOMBRE: 'PLANTAS, DUCTOS Y TÚNELES ',
      ' SALDO INICIAL(Pesos) ': 690185831,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 690185831,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 690185831,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.45.13 ',
      NOMBRE: 'ACUEDUCTO Y CANALIZACIÓN ',
      ' SALDO INICIAL(Pesos) ': 690185831,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 690185831,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 690185831,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.50 ',
      NOMBRE: 'REDES, LÍNEAS Y CABLES ',
      ' SALDO INICIAL(Pesos) ': 12231293859,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 12231293859,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 12231293859,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.50.10 ',
      NOMBRE: 'LÍNEAS Y CABLES DE TELECOMUNICACIONES ',
      ' SALDO INICIAL(Pesos) ': 919857941,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 919857941,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 919857941,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.50.90 ',
      NOMBRE: 'OTRAS REDES, LÍNEAS Y CABLES ',
      ' SALDO INICIAL(Pesos) ': 11311435918,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 11311435918,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 11311435918,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.55 ',
      NOMBRE: 'MAQUINARIA Y EQUIPO ',
      ' SALDO INICIAL(Pesos) ': 17028478740,
      ' MOVIMIENTO DEBITO(Pesos) ': 552434462,
      ' MOVIMIENTO CREDITO(Pesos) ': 39155322,
      ' SALDO FINAL(Pesos) ': 17541757880,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 17541757880,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.55.90 ',
      NOMBRE: 'OTRA MAQUINARIA Y EQUIPO ',
      ' SALDO INICIAL(Pesos) ': 17028478740,
      ' MOVIMIENTO DEBITO(Pesos) ': 552434462,
      ' MOVIMIENTO CREDITO(Pesos) ': 39155322,
      ' SALDO FINAL(Pesos) ': 17541757880,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 17541757880,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.60 ',
      NOMBRE: 'EQUIPO MÉDICO Y CIENTÍFICO ',
      ' SALDO INICIAL(Pesos) ': 149256112606,
      ' MOVIMIENTO DEBITO(Pesos) ': 681848478,
      ' MOVIMIENTO CREDITO(Pesos) ': 1166249766,
      ' SALDO FINAL(Pesos) ': 148771711318,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 148771711318,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.60.02 ',
      NOMBRE: 'EQUIPO DE LABORATORIO ',
      ' SALDO INICIAL(Pesos) ': 148398089193,
      ' MOVIMIENTO DEBITO(Pesos) ': 560538478,
      ' MOVIMIENTO CREDITO(Pesos) ': 1166249766,
      ' SALDO FINAL(Pesos) ': 147792377905,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 147792377905,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.60.90 ',
      NOMBRE: 'OTRO EQUIPO MÉDICO Y CIENTÍFICO ',
      ' SALDO INICIAL(Pesos) ': 858023413,
      ' MOVIMIENTO DEBITO(Pesos) ': 121310000,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 979333413,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 979333413,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.65 ',
      NOMBRE: 'MUEBLES, ENSERES Y EQUIPO DE OFICINA ',
      ' SALDO INICIAL(Pesos) ': 62031054393,
      ' MOVIMIENTO DEBITO(Pesos) ': 2119208661,
      ' MOVIMIENTO CREDITO(Pesos) ': 911064925,
      ' SALDO FINAL(Pesos) ': 63239198129,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 63239198129,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.65.01 ',
      NOMBRE: 'MUEBLES Y ENSERES ',
      ' SALDO INICIAL(Pesos) ': 53727749941,
      ' MOVIMIENTO DEBITO(Pesos) ': 1937578162,
      ' MOVIMIENTO CREDITO(Pesos) ': 628153933,
      ' SALDO FINAL(Pesos) ': 55037174170,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 55037174170,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.65.02 ',
      NOMBRE: 'EQUIPO Y MÁQUINA DE OFICINA ',
      ' SALDO INICIAL(Pesos) ': 3785638222,
      ' MOVIMIENTO DEBITO(Pesos) ': 68236030,
      ' MOVIMIENTO CREDITO(Pesos) ': 74502572,
      ' SALDO FINAL(Pesos) ': 3779371680,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 3779371680,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.65.90 ',
      NOMBRE: 'OTROS MUEBLES, ENSERES Y EQUIPO DE OFICINA ',
      ' SALDO INICIAL(Pesos) ': 4517666230,
      ' MOVIMIENTO DEBITO(Pesos) ': 113394469,
      ' MOVIMIENTO CREDITO(Pesos) ': 208408420,
      ' SALDO FINAL(Pesos) ': 4422652279,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 4422652279,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.70 ',
      NOMBRE: 'EQUIPOS DE COMUNICACIÓN Y COMPUTACIÓN ',
      ' SALDO INICIAL(Pesos) ': 66106937107,
      ' MOVIMIENTO DEBITO(Pesos) ': 3870473668,
      ' MOVIMIENTO CREDITO(Pesos) ': 1390523281,
      ' SALDO FINAL(Pesos) ': 68586887494,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 68586887494,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.70.01 ',
      NOMBRE: 'EQUIPO DE COMUNICACIÓN ',
      ' SALDO INICIAL(Pesos) ': 13504665403,
      ' MOVIMIENTO DEBITO(Pesos) ': 337943731,
      ' MOVIMIENTO CREDITO(Pesos) ': 227432097,
      ' SALDO FINAL(Pesos) ': 13615177037,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 13615177037,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.70.02 ',
      NOMBRE: 'EQUIPO DE COMPUTACIÓN ',
      ' SALDO INICIAL(Pesos) ': 52602271704,
      ' MOVIMIENTO DEBITO(Pesos) ': 3532529937,
      ' MOVIMIENTO CREDITO(Pesos) ': 1163091184,
      ' SALDO FINAL(Pesos) ': 54971710457,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 54971710457,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.75 ',
      NOMBRE: 'EQUIPOS DE TRANSPORTE, TRACCIÓN Y ELEVACIÓN ',
      ' SALDO INICIAL(Pesos) ': 1807299455,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 1807299455,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 1807299455,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.75.02 ',
      NOMBRE: 'TERRESTRE ',
      ' SALDO INICIAL(Pesos) ': 1807299455,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 1807299455,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 1807299455,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.81 ',
      NOMBRE: 'BIENES DE ARTE Y CULTURA ',
      ' SALDO INICIAL(Pesos) ': 7657012541,
      ' MOVIMIENTO DEBITO(Pesos) ': 1300217840,
      ' MOVIMIENTO CREDITO(Pesos) ': 41224472,
      ' SALDO FINAL(Pesos) ': 8916005909,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 8916005909,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.81.01 ',
      NOMBRE: 'OBRAS DE ARTE ',
      ' SALDO INICIAL(Pesos) ': 939026369,
      ' MOVIMIENTO DEBITO(Pesos) ': 1280000000,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 2219026369,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 2219026369,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.81.07 ',
      NOMBRE: 'LIBROS Y PUBLICACIONES DE INVESTIGACIÓN Y CONSULTA ',
      ' SALDO INICIAL(Pesos) ': 6717986172,
      ' MOVIMIENTO DEBITO(Pesos) ': 20217840,
      ' MOVIMIENTO CREDITO(Pesos) ': 41224472,
      ' SALDO FINAL(Pesos) ': 6696979540,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 6696979540,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.85 ',
      NOMBRE: 'DEPRECIACIÓN ACUMULADA DE PROPIEDADES, PLANTA Y EQUIPO (CR) ',
      ' SALDO INICIAL(Pesos) ': -224749085860,
      ' MOVIMIENTO DEBITO(Pesos) ': 2179752485,
      ' MOVIMIENTO CREDITO(Pesos) ': 7863801166,
      ' SALDO FINAL(Pesos) ': -230433134541,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': -230433134541,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.85.01 ',
      NOMBRE: 'EDIFICACIONES ',
      ' SALDO INICIAL(Pesos) ': -67557544209,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 1739988986,
      ' SALDO FINAL(Pesos) ': -69297533195,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': -69297533195,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.85.02 ',
      NOMBRE: 'PLANTAS, DUCTOS Y TÚNELES ',
      ' SALDO INICIAL(Pesos) ': -470541665,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 6901858,
      ' SALDO FINAL(Pesos) ': -477443523,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': -477443523,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.85.03 ',
      NOMBRE: 'REDES, LÍNEAS Y CABLES ',
      ' SALDO INICIAL(Pesos) ': -1901051998,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 114790973,
      ' SALDO FINAL(Pesos) ': -2015842971,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': -2015842971,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.85.04 ',
      NOMBRE: 'MAQUINARIA Y EQUIPO ',
      ' SALDO INICIAL(Pesos) ': -9640662890,
      ' MOVIMIENTO DEBITO(Pesos) ': 25637860,
      ' MOVIMIENTO CREDITO(Pesos) ': 276069162,
      ' SALDO FINAL(Pesos) ': -9891094192,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': -9891094192,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.85.05 ',
      NOMBRE: 'EQUIPO MÉDICO Y CIENTÍFICO ',
      ' SALDO INICIAL(Pesos) ': -75481237611,
      ' MOVIMIENTO DEBITO(Pesos) ': 892532152,
      ' MOVIMIENTO CREDITO(Pesos) ': 2627832335,
      ' SALDO FINAL(Pesos) ': -77216537794,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': -77216537794,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.85.06 ',
      NOMBRE: 'MUEBLES, ENSERES Y EQUIPO DE OFICINA ',
      ' SALDO INICIAL(Pesos) ': -29941324423,
      ' MOVIMIENTO DEBITO(Pesos) ': 474470388,
      ' MOVIMIENTO CREDITO(Pesos) ': 1640716302,
      ' SALDO FINAL(Pesos) ': -31107570337,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': -31107570337,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.85.07 ',
      NOMBRE: 'EQUIPOS DE COMUNICACIÓN Y COMPUTACIÓN ',
      ' SALDO INICIAL(Pesos) ': -34151979616,
      ' MOVIMIENTO DEBITO(Pesos) ': 787112085,
      ' MOVIMIENTO CREDITO(Pesos) ': 1419808950,
      ' SALDO FINAL(Pesos) ': -34784676481,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': -34784676481,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.85.08 ',
      NOMBRE: 'EQUIPOS DE TRANSPORTE, TRACCIÓN Y ELEVACIÓN ',
      ' SALDO INICIAL(Pesos) ': -877909347,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 37692600,
      ' SALDO FINAL(Pesos) ': -915601947,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': -915601947,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.85.12 ',
      NOMBRE: 'BIENES DE ARTE Y CULTURA ',
      ' SALDO INICIAL(Pesos) ': -4726834101,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': -4726834101,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': -4726834101,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.95 ',
      NOMBRE: 'DETERIORO ACUMULADO DE PROPIEDADES, PLANTA Y EQUIPO (CR) ',
      ' SALDO INICIAL(Pesos) ': -441921612,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': -441921612,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': -441921612,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.6.95.01 ',
      NOMBRE: 'TERRENOS ',
      ' SALDO INICIAL(Pesos) ': -441921612,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': -441921612,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': -441921612,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.7.10 ',
      NOMBRE: 'BIENES DE USO PÚBLICO EN SERVICIO ',
      ' SALDO INICIAL(Pesos) ': 9864851627,
      ' MOVIMIENTO DEBITO(Pesos) ': 236962200,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 10101813827,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 10101813827,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.7.10.01 ',
      NOMBRE: 'RED CARRETERA ',
      ' SALDO INICIAL(Pesos) ': 9864851627,
      ' MOVIMIENTO DEBITO(Pesos) ': 236962200,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 10101813827,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 10101813827,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.7.15 ',
      NOMBRE: 'BIENES HISTÓRICOS Y CULTURALES ',
      ' SALDO INICIAL(Pesos) ': 4057649818,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 4057649818,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 4057649818,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.7.15.90 ',
      NOMBRE: 'OTROS BIENES HISTÓRICOS Y CULTURALES ',
      ' SALDO INICIAL(Pesos) ': 4057649818,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 4057649818,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 4057649818,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.9 ',
      NOMBRE: 'OTROS ACTIVOS ',
      ' SALDO INICIAL(Pesos) ': 323190434588,
      ' MOVIMIENTO DEBITO(Pesos) ': 56348497564,
      ' MOVIMIENTO CREDITO(Pesos) ': 53889330199,
      ' SALDO FINAL(Pesos) ': 325649601953,
      ' SALDO FINAL CORRIENTE(Pesos) ': 63636041137,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 262013560816,
      porcentajeCorriente: 0.195412617596825,
      porcentajeNoCorriente: 0.804587382403175,
    },
    {
      codigo: '1.9.04 ',
      NOMBRE: 'PLAN DE ACTIVOS PARA BENEFICIOS POSEMPLEO ',
      ' SALDO INICIAL(Pesos) ': 279919835313,
      ' MOVIMIENTO DEBITO(Pesos) ': 50377776752,
      ' MOVIMIENTO CREDITO(Pesos) ': 46849234242,
      ' SALDO FINAL(Pesos) ': 283448377823,
      ' SALDO FINAL CORRIENTE(Pesos) ': 34810783969,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 248637593854,
      porcentajeCorriente: 0.122811724083098,
      porcentajeNoCorriente: 0.877188275916902,
    },
    {
      codigo: '1.9.04.04 ',
      NOMBRE: 'ENCARGOS FIDUCIARIOS ',
      ' SALDO INICIAL(Pesos) ': 119768218460,
      ' MOVIMIENTO DEBITO(Pesos) ': 49751319248,
      ' MOVIMIENTO CREDITO(Pesos) ': 45596319234,
      ' SALDO FINAL(Pesos) ': 123923218474,
      ' SALDO FINAL CORRIENTE(Pesos) ': 34184326471,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 89738892003,
      porcentajeCorriente: 0.275850860653463,
      porcentajeNoCorriente: 0.724149139346537,
    },
    {
      codigo: '1.9.04.12 ',
      NOMBRE: 'CUENTAS POR COBRAR ',
      ' SALDO INICIAL(Pesos) ': 160151616853,
      ' MOVIMIENTO DEBITO(Pesos) ': 626457504,
      ' MOVIMIENTO CREDITO(Pesos) ': 1252915008,
      ' SALDO FINAL(Pesos) ': 159525159349,
      ' SALDO FINAL CORRIENTE(Pesos) ': 626457498,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 158898701851,
      porcentajeCorriente: 0.00392701377360465,
      porcentajeNoCorriente: 0.996072986226395,
    },
    {
      codigo: '1.9.05 ',
      NOMBRE: 'BIENES Y SERVICIOS PAGADOS POR ANTICIPADO ',
      ' SALDO INICIAL(Pesos) ': 4186873999,
      ' MOVIMIENTO DEBITO(Pesos) ': 225454404,
      ' MOVIMIENTO CREDITO(Pesos) ': 2001496068,
      ' SALDO FINAL(Pesos) ': 2410832335,
      ' SALDO FINAL CORRIENTE(Pesos) ': 2410014534,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 817801,
      porcentajeCorriente: 0.999660780640724,
      porcentajeNoCorriente: 0.000339219359275766,
    },
    {
      codigo: '1.9.05.05 ',
      NOMBRE: 'IMPRESOS, PUBLICACIONES, SUSCRIPCIONES Y AFILIACIONES ',
      ' SALDO INICIAL(Pesos) ': 3097019357,
      ' MOVIMIENTO DEBITO(Pesos) ': 186695769,
      ' MOVIMIENTO CREDITO(Pesos) ': 1472437692,
      ' SALDO FINAL(Pesos) ': 1811277434,
      ' SALDO FINAL CORRIENTE(Pesos) ': 1810459633,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 817801,
      porcentajeCorriente: 0.999548494899429,
      porcentajeNoCorriente: 0.000451505100570916,
    },
    {
      codigo: '1.9.05.15 ',
      NOMBRE: 'OTROS BENEFICIOS A LOS EMPLEADOS ',
      ' SALDO INICIAL(Pesos) ': 1089854642,
      ' MOVIMIENTO DEBITO(Pesos) ': 4474965,
      ' MOVIMIENTO CREDITO(Pesos) ': 494774706,
      ' SALDO FINAL(Pesos) ': 599554901,
      ' SALDO FINAL CORRIENTE(Pesos) ': 599554901,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.9.06 ',
      NOMBRE: 'AVANCES Y ANTICIPOS ENTREGADOS ',
      ' SALDO INICIAL(Pesos) ': 20683554760,
      ' MOVIMIENTO DEBITO(Pesos) ': 706134967,
      ' MOVIMIENTO CREDITO(Pesos) ': 3030473924,
      ' SALDO FINAL(Pesos) ': 18359215803,
      ' SALDO FINAL CORRIENTE(Pesos) ': 18359215803,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.9.06.04 ',
      NOMBRE: 'ANTICIPO PARA ADQUISICIÓN DE BIENES Y SERVICIOS ',
      ' SALDO INICIAL(Pesos) ': 20683554760,
      ' MOVIMIENTO DEBITO(Pesos) ': 706134967,
      ' MOVIMIENTO CREDITO(Pesos) ': 3030473924,
      ' SALDO FINAL(Pesos) ': 18359215803,
      ' SALDO FINAL CORRIENTE(Pesos) ': 18359215803,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.9.08 ',
      NOMBRE: 'RECURSOS ENTREGADOS EN ADMINISTRACIÓN ',
      ' SALDO INICIAL(Pesos) ': 175356148,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 175356148,
      ' SALDO FINAL CORRIENTE(Pesos) ': 175356148,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.9.08.03 ',
      NOMBRE: 'ENCARGO FIDUCIARIO - FIDUCIA DE ADMINISTRACIÓN Y PAGOS ',
      ' SALDO INICIAL(Pesos) ': 175356148,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 175356148,
      ' SALDO FINAL CORRIENTE(Pesos) ': 175356148,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.9.09 ',
      NOMBRE: 'DEPÓSITOS ENTREGADOS EN GARANTÍA ',
      ' SALDO INICIAL(Pesos) ': 2311290690,
      ' MOVIMIENTO DEBITO(Pesos) ': 4260443419,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 6571734109,
      ' SALDO FINAL CORRIENTE(Pesos) ': 6571734109,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.9.09.03 ',
      NOMBRE: 'DEPÓSITOS JUDICIALES ',
      ' SALDO INICIAL(Pesos) ': 2311290690,
      ' MOVIMIENTO DEBITO(Pesos) ': 4260443419,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 6571734109,
      ' SALDO FINAL CORRIENTE(Pesos) ': 6571734109,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.9.26 ',
      NOMBRE: 'DERECHOS EN FIDEICOMISO ',
      ' SALDO INICIAL(Pesos) ': 1018,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 1018,
      ' SALDO FINAL CORRIENTE(Pesos) ': 1018,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.9.26.03 ',
      NOMBRE: 'FIDUCIA MERCANTIL - PATRIMONIO AUTÓNOMO ',
      ' SALDO INICIAL(Pesos) ': 1018,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 1018,
      ' SALDO FINAL CORRIENTE(Pesos) ': 1018,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '1.9.51 ',
      NOMBRE: 'PROPIEDADES DE INVERSIÓN ',
      ' SALDO INICIAL(Pesos) ': 2749979191,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 2749979191,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 2749979191,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.9.51.01 ',
      NOMBRE: 'TERRENOS ',
      ' SALDO INICIAL(Pesos) ': 1431660000,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 1431660000,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 1431660000,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.9.51.02 ',
      NOMBRE: 'EDIFICACIONES ',
      ' SALDO INICIAL(Pesos) ': 1318319191,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 1318319191,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 1318319191,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.9.52 ',
      NOMBRE: 'DEPRECIACIÓN ACUMULADA DE PROPIEDADES DE INVERSIÓN (CR) ',
      ' SALDO INICIAL(Pesos) ': -863565728,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 5689363,
      ' SALDO FINAL(Pesos) ': -869255091,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': -869255091,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.9.52.01 ',
      NOMBRE: 'EDIFICACIONES ',
      ' SALDO INICIAL(Pesos) ': -863565728,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 5689363,
      ' SALDO FINAL(Pesos) ': -869255091,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': -869255091,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.9.70 ',
      NOMBRE: 'ACTIVOS INTANGIBLES ',
      ' SALDO INICIAL(Pesos) ': 19453203428,
      ' MOVIMIENTO DEBITO(Pesos) ': 481919059,
      ' MOVIMIENTO CREDITO(Pesos) ': 3690000,
      ' SALDO FINAL(Pesos) ': 19931432487,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 19931432487,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.9.70.03 ',
      NOMBRE: 'PATENTES ',
      ' SALDO INICIAL(Pesos) ': 2030965520,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 2030965520,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 2030965520,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.9.70.08 ',
      NOMBRE: 'SOFTWARES ',
      ' SALDO INICIAL(Pesos) ': 17422237908,
      ' MOVIMIENTO DEBITO(Pesos) ': 481919059,
      ' MOVIMIENTO CREDITO(Pesos) ': 3690000,
      ' SALDO FINAL(Pesos) ': 17900466967,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 17900466967,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.9.75 ',
      NOMBRE: 'AMORTIZACIÓN ACUMULADA DE ACTIVOS INTANGIBLES (CR) ',
      ' SALDO INICIAL(Pesos) ': -8075267531,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 455359689,
      ' SALDO FINAL(Pesos) ': -8530627220,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': -8530627220,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.9.75.03 ',
      NOMBRE: 'PATENTES ',
      ' SALDO INICIAL(Pesos) ': -648339255,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': -648339255,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': -648339255,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.9.75.08 ',
      NOMBRE: 'SOFTWARES ',
      ' SALDO INICIAL(Pesos) ': -7426928276,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 455359689,
      ' SALDO FINAL(Pesos) ': -7882287965,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': -7882287965,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '1.9.86 ',
      NOMBRE: 'ACTIVOS DIFERIDOS ',
      ' SALDO INICIAL(Pesos) ': 2649173300,
      ' MOVIMIENTO DEBITO(Pesos) ': 70682109,
      ' MOVIMIENTO CREDITO(Pesos) ': 1317300059,
      ' SALDO FINAL(Pesos) ': 1402555350,
      ' SALDO FINAL CORRIENTE(Pesos) ': 1308935556,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 93619794,
      porcentajeCorriente: 0.933250552999566,
      porcentajeNoCorriente: 0.0667494470004339,
    },
    {
      codigo: '1.9.86.09 ',
      NOMBRE: 'SEGUROS CON COBERTURA MAYOR A DOCE MESES ',
      ' SALDO INICIAL(Pesos) ': 2649173300,
      ' MOVIMIENTO DEBITO(Pesos) ': 70682109,
      ' MOVIMIENTO CREDITO(Pesos) ': 1317300059,
      ' SALDO FINAL(Pesos) ': 1402555350,
      ' SALDO FINAL CORRIENTE(Pesos) ': 1308935556,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 93619794,
      porcentajeCorriente: 0.933250552999566,
      porcentajeNoCorriente: 0.0667494470004339,
    },
    {
      codigo: '2.4.01 ',
      NOMBRE: 'ADQUISICIÓN DE BIENES Y SERVICIOS NACIONALES ',
      ' SALDO INICIAL(Pesos) ': 3884142656,
      ' MOVIMIENTO DEBITO(Pesos) ': 19866901263,
      ' MOVIMIENTO CREDITO(Pesos) ': 18632035500,
      ' SALDO FINAL(Pesos) ': 2649276893,
      ' SALDO FINAL CORRIENTE(Pesos) ': 2649276893,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.01.01 ',
      NOMBRE: 'BIENES Y SERVICIOS ',
      ' SALDO INICIAL(Pesos) ': 3884142656,
      ' MOVIMIENTO DEBITO(Pesos) ': 19866901263,
      ' MOVIMIENTO CREDITO(Pesos) ': 18632035500,
      ' SALDO FINAL(Pesos) ': 2649276893,
      ' SALDO FINAL CORRIENTE(Pesos) ': 2649276893,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.07 ',
      NOMBRE: 'RECURSOS A FAVOR DE TERCEROS ',
      ' SALDO INICIAL(Pesos) ': 1856671714,
      ' MOVIMIENTO DEBITO(Pesos) ': 2532918341,
      ' MOVIMIENTO CREDITO(Pesos) ': 3091497335,
      ' SALDO FINAL(Pesos) ': 2415250708,
      ' SALDO FINAL CORRIENTE(Pesos) ': 2415250708,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.07.01 ',
      NOMBRE: 'DEDUCCIÓN DE IMPUESTOS ',
      ' SALDO INICIAL(Pesos) ': 396160978,
      ' MOVIMIENTO DEBITO(Pesos) ': 31645028,
      ' MOVIMIENTO CREDITO(Pesos) ': 26645028,
      ' SALDO FINAL(Pesos) ': 391160978,
      ' SALDO FINAL CORRIENTE(Pesos) ': 391160978,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.07.03 ',
      NOMBRE: 'IMPUESTOS ',
      ' SALDO INICIAL(Pesos) ': 251090478,
      ' MOVIMIENTO DEBITO(Pesos) ': 705967657,
      ' MOVIMIENTO CREDITO(Pesos) ': 1125850546,
      ' SALDO FINAL(Pesos) ': 670973367,
      ' SALDO FINAL CORRIENTE(Pesos) ': 670973367,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.07.20 ',
      NOMBRE: 'RECAUDOS POR CLASIFICAR ',
      ' SALDO INICIAL(Pesos) ': 5584829,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 5584829,
      ' SALDO FINAL CORRIENTE(Pesos) ': 5584829,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.07.22 ',
      NOMBRE: 'ESTAMPILLAS ',
      ' SALDO INICIAL(Pesos) ': 680961176,
      ' MOVIMIENTO DEBITO(Pesos) ': 1351518544,
      ' MOVIMIENTO CREDITO(Pesos) ': 1447472085,
      ' SALDO FINAL(Pesos) ': 776914717,
      ' SALDO FINAL CORRIENTE(Pesos) ': 776914717,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.07.90 ',
      NOMBRE: 'OTROS RECURSOS A FAVOR DE TERCEROS ',
      ' SALDO INICIAL(Pesos) ': 522874253,
      ' MOVIMIENTO DEBITO(Pesos) ': 443787112,
      ' MOVIMIENTO CREDITO(Pesos) ': 491529676,
      ' SALDO FINAL(Pesos) ': 570616817,
      ' SALDO FINAL CORRIENTE(Pesos) ': 570616817,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.24 ',
      NOMBRE: 'DESCUENTOS DE NÓMINA ',
      ' SALDO INICIAL(Pesos) ': 3808952346,
      ' MOVIMIENTO DEBITO(Pesos) ': 13887705176,
      ' MOVIMIENTO CREDITO(Pesos) ': 13722664388,
      ' SALDO FINAL(Pesos) ': 3643911558,
      ' SALDO FINAL CORRIENTE(Pesos) ': 3643911558,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.24.01 ',
      NOMBRE: 'APORTES A FONDOS PENSIONALES ',
      ' SALDO INICIAL(Pesos) ': 870702091,
      ' MOVIMIENTO DEBITO(Pesos) ': 2231948030,
      ' MOVIMIENTO CREDITO(Pesos) ': 2148658230,
      ' SALDO FINAL(Pesos) ': 787412291,
      ' SALDO FINAL CORRIENTE(Pesos) ': 787412291,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.24.02 ',
      NOMBRE: 'APORTES A SEGURIDAD SOCIAL EN SALUD ',
      ' SALDO INICIAL(Pesos) ': 444879972,
      ' MOVIMIENTO DEBITO(Pesos) ': 3628745820,
      ' MOVIMIENTO CREDITO(Pesos) ': 3665904420,
      ' SALDO FINAL(Pesos) ': 482038572,
      ' SALDO FINAL CORRIENTE(Pesos) ': 482038572,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.24.04 ',
      NOMBRE: 'SINDICATOS ',
      ' SALDO INICIAL(Pesos) ': 5237597,
      ' MOVIMIENTO DEBITO(Pesos) ': 15980890,
      ' MOVIMIENTO CREDITO(Pesos) ': 15457805,
      ' SALDO FINAL(Pesos) ': 4714512,
      ' SALDO FINAL CORRIENTE(Pesos) ': 4714512,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.24.05 ',
      NOMBRE: 'COOPERATIVAS ',
      ' SALDO INICIAL(Pesos) ': 641241282,
      ' MOVIMIENTO DEBITO(Pesos) ': 2114912182,
      ' MOVIMIENTO CREDITO(Pesos) ': 2111718719,
      ' SALDO FINAL(Pesos) ': 638047819,
      ' SALDO FINAL CORRIENTE(Pesos) ': 638047819,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.24.06 ',
      NOMBRE: 'FONDOS DE EMPLEADOS ',
      ' SALDO INICIAL(Pesos) ': 1619033546,
      ' MOVIMIENTO DEBITO(Pesos) ': 5155324191,
      ' MOVIMIENTO CREDITO(Pesos) ': 5040061311,
      ' SALDO FINAL(Pesos) ': 1503770666,
      ' SALDO FINAL CORRIENTE(Pesos) ': 1503770666,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.24.07 ',
      NOMBRE: 'LIBRANZAS ',
      ' SALDO INICIAL(Pesos) ': 177229083,
      ' MOVIMIENTO DEBITO(Pesos) ': 590841024,
      ' MOVIMIENTO CREDITO(Pesos) ': 592489072,
      ' SALDO FINAL(Pesos) ': 178877131,
      ' SALDO FINAL CORRIENTE(Pesos) ': 178877131,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.24.11 ',
      NOMBRE: 'EMBARGOS JUDICIALES ',
      ' SALDO INICIAL(Pesos) ': 50628775,
      ' MOVIMIENTO DEBITO(Pesos) ': 149953039,
      ' MOVIMIENTO CREDITO(Pesos) ': 148374831,
      ' SALDO FINAL(Pesos) ': 49050567,
      ' SALDO FINAL CORRIENTE(Pesos) ': 49050567,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.36 ',
      NOMBRE: 'RETENCIÓN EN LA FUENTE E IMPUESTO DE TIMBRE ',
      ' SALDO INICIAL(Pesos) ': 2151731049,
      ' MOVIMIENTO DEBITO(Pesos) ': 4449372624,
      ' MOVIMIENTO CREDITO(Pesos) ': 3664172067,
      ' SALDO FINAL(Pesos) ': 1366530492,
      ' SALDO FINAL CORRIENTE(Pesos) ': 1366530492,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.36.03 ',
      NOMBRE: 'HONORARIOS ',
      ' SALDO INICIAL(Pesos) ': 282065181,
      ' MOVIMIENTO DEBITO(Pesos) ': 602990712,
      ' MOVIMIENTO CREDITO(Pesos) ': 508062554,
      ' SALDO FINAL(Pesos) ': 187137023,
      ' SALDO FINAL CORRIENTE(Pesos) ': 187137023,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.36.05 ',
      NOMBRE: 'SERVICIOS ',
      ' SALDO INICIAL(Pesos) ': 42892213,
      ' MOVIMIENTO DEBITO(Pesos) ': 81204109,
      ' MOVIMIENTO CREDITO(Pesos) ': 77072976,
      ' SALDO FINAL(Pesos) ': 38761080,
      ' SALDO FINAL CORRIENTE(Pesos) ': 38761080,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.36.06 ',
      NOMBRE: 'ARRENDAMIENTOS ',
      ' SALDO INICIAL(Pesos) ': 203910,
      ' MOVIMIENTO DEBITO(Pesos) ': 8258026,
      ' MOVIMIENTO CREDITO(Pesos) ': 8263206,
      ' SALDO FINAL(Pesos) ': 209090,
      ' SALDO FINAL CORRIENTE(Pesos) ': 209090,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.36.08 ',
      NOMBRE: 'COMPRAS ',
      ' SALDO INICIAL(Pesos) ': 248277484,
      ' MOVIMIENTO DEBITO(Pesos) ': 438049474,
      ' MOVIMIENTO CREDITO(Pesos) ': 350866331,
      ' SALDO FINAL(Pesos) ': 161094341,
      ' SALDO FINAL CORRIENTE(Pesos) ': 161094341,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.36.15 ',
      NOMBRE: 'RENTAS DE TRABAJO ',
      ' SALDO INICIAL(Pesos) ': 938538900,
      ' MOVIMIENTO DEBITO(Pesos) ': 1565672900,
      ' MOVIMIENTO CREDITO(Pesos) ': 912472100,
      ' SALDO FINAL(Pesos) ': 285338100,
      ' SALDO FINAL CORRIENTE(Pesos) ': 285338100,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.36.25 ',
      NOMBRE: 'IMPUESTO A LAS VENTAS RETENIDO ',
      ' SALDO INICIAL(Pesos) ': 379745556,
      ' MOVIMIENTO DEBITO(Pesos) ': 734985896,
      ' MOVIMIENTO CREDITO(Pesos) ': 612374356,
      ' SALDO FINAL(Pesos) ': 257134016,
      ' SALDO FINAL CORRIENTE(Pesos) ': 257134016,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.36.26 ',
      NOMBRE: 'CONTRATOS DE CONSTRUCCIÓN ',
      ' SALDO INICIAL(Pesos) ': 106595151,
      ' MOVIMIENTO DEBITO(Pesos) ': 293482214,
      ' MOVIMIENTO CREDITO(Pesos) ': 466774791,
      ' SALDO FINAL(Pesos) ': 279887728,
      ' SALDO FINAL CORRIENTE(Pesos) ': 279887728,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.36.27 ',
      NOMBRE: 'RETENCIÓN DE IMPUESTO DE INDUSTRIA Y COMERCIO POR COMPRAS ',
      ' SALDO INICIAL(Pesos) ': 148223404,
      ' MOVIMIENTO DEBITO(Pesos) ': 673053304,
      ' MOVIMIENTO CREDITO(Pesos) ': 653937168,
      ' SALDO FINAL(Pesos) ': 129107268,
      ' SALDO FINAL CORRIENTE(Pesos) ': 129107268,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.36.98 ',
      NOMBRE: 'IMPUESTO DE TIMBRE ',
      ' SALDO INICIAL(Pesos) ': 5189250,
      ' MOVIMIENTO DEBITO(Pesos) ': 51675989,
      ' MOVIMIENTO CREDITO(Pesos) ': 74348585,
      ' SALDO FINAL(Pesos) ': 27861846,
      ' SALDO FINAL CORRIENTE(Pesos) ': 27861846,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.81 ',
      NOMBRE: 'ADMINISTRACIÓN DE LA SEGURIDAD SOCIAL EN SALUD ',
      ' SALDO INICIAL(Pesos) ': 1090729638,
      ' MOVIMIENTO DEBITO(Pesos) ': 269049569,
      ' MOVIMIENTO CREDITO(Pesos) ': 258540373,
      ' SALDO FINAL(Pesos) ': 1080220442,
      ' SALDO FINAL CORRIENTE(Pesos) ': 1080220442,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.81.06 ',
      NOMBRE: 'INCAPACIDADES POR ENFERMEDAD GENERAL LIQUIDADAS ',
      ' SALDO INICIAL(Pesos) ': 1090729638,
      ' MOVIMIENTO DEBITO(Pesos) ': 269049569,
      ' MOVIMIENTO CREDITO(Pesos) ': 258540373,
      ' SALDO FINAL(Pesos) ': 1080220442,
      ' SALDO FINAL CORRIENTE(Pesos) ': 1080220442,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.90 ',
      NOMBRE: 'OTRAS CUENTAS POR PAGAR ',
      ' SALDO INICIAL(Pesos) ': 13260650197,
      ' MOVIMIENTO DEBITO(Pesos) ': 80928983553,
      ' MOVIMIENTO CREDITO(Pesos) ': 76245382146,
      ' SALDO FINAL(Pesos) ': 8577048790,
      ' SALDO FINAL CORRIENTE(Pesos) ': 8577048790,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.90.27 ',
      NOMBRE: 'VIÁTICOS Y GASTOS DE VIAJE ',
      ' SALDO INICIAL(Pesos) ': 1366000,
      ' MOVIMIENTO DEBITO(Pesos) ': 1757652030,
      ' MOVIMIENTO CREDITO(Pesos) ': 1766173148,
      ' SALDO FINAL(Pesos) ': 9887118,
      ' SALDO FINAL CORRIENTE(Pesos) ': 9887118,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.90.50 ',
      NOMBRE: 'APORTES AL ICBF Y SENA ',
      ' SALDO INICIAL(Pesos) ': 884794326,
      ' MOVIMIENTO DEBITO(Pesos) ': 1746177100,
      ' MOVIMIENTO CREDITO(Pesos) ': 1381887600,
      ' SALDO FINAL(Pesos) ': 520504826,
      ' SALDO FINAL CORRIENTE(Pesos) ': 520504826,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.90.51 ',
      NOMBRE: 'SERVICIOS PÚBLICOS ',
      ' SALDO INICIAL(Pesos) ': 756240,
      ' MOVIMIENTO DEBITO(Pesos) ': 3269264356,
      ' MOVIMIENTO CREDITO(Pesos) ': 3269264356,
      ' SALDO FINAL(Pesos) ': 756240,
      ' SALDO FINAL CORRIENTE(Pesos) ': 756240,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.90.54 ',
      NOMBRE: 'HONORARIOS ',
      ' SALDO INICIAL(Pesos) ': 7987179318,
      ' MOVIMIENTO DEBITO(Pesos) ': 28301061341,
      ' MOVIMIENTO CREDITO(Pesos) ': 24618295543,
      ' SALDO FINAL(Pesos) ': 4304413520,
      ' SALDO FINAL CORRIENTE(Pesos) ': 4304413520,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.90.55 ',
      NOMBRE: 'SERVICIOS ',
      ' SALDO INICIAL(Pesos) ': 324460618,
      ' MOVIMIENTO DEBITO(Pesos) ': 2869919222,
      ' MOVIMIENTO CREDITO(Pesos) ': 4364389784,
      ' SALDO FINAL(Pesos) ': 1818931180,
      ' SALDO FINAL CORRIENTE(Pesos) ': 1818931180,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.4.90.90 ',
      NOMBRE: 'OTRAS CUENTAS POR PAGAR ',
      ' SALDO INICIAL(Pesos) ': 4062093695,
      ' MOVIMIENTO DEBITO(Pesos) ': 42612264967,
      ' MOVIMIENTO CREDITO(Pesos) ': 40472727178,
      ' SALDO FINAL(Pesos) ': 1922555906,
      ' SALDO FINAL CORRIENTE(Pesos) ': 1922555906,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.5 ',
      NOMBRE: 'BENEFICIOS A LOS EMPLEADOS ',
      ' SALDO INICIAL(Pesos) ': 461081304540,
      ' MOVIMIENTO DEBITO(Pesos) ': 67116933656,
      ' MOVIMIENTO CREDITO(Pesos) ': 51063657602,
      ' SALDO FINAL(Pesos) ': 445028028486,
      ' SALDO FINAL CORRIENTE(Pesos) ': 24790550089,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 420237478397,
    },
    {
      codigo: '2.5.11 ',
      NOMBRE: 'BENEFICIOS A LOS EMPLEADOS A CORTO PLAZO ',
      ' SALDO INICIAL(Pesos) ': 17333170413,
      ' MOVIMIENTO DEBITO(Pesos) ': 44462705777,
      ' MOVIMIENTO CREDITO(Pesos) ': 37217211644,
      ' SALDO FINAL(Pesos) ': 10087676280,
      ' SALDO FINAL CORRIENTE(Pesos) ': 10087676280,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.5.11.01 ',
      NOMBRE: 'NÓMINA POR PAGAR ',
      ' SALDO INICIAL(Pesos) ': 8952389805,
      ' MOVIMIENTO DEBITO(Pesos) ': 27797010274,
      ' MOVIMIENTO CREDITO(Pesos) ': 25699976151,
      ' SALDO FINAL(Pesos) ': 6855355682,
      ' SALDO FINAL CORRIENTE(Pesos) ': 6855355682,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.5.11.03 ',
      NOMBRE: 'INTERESES SOBRE CESANTÍAS ',
      ' SALDO INICIAL(Pesos) ': 501542,
      ' MOVIMIENTO DEBITO(Pesos) ': 31438240,
      ' MOVIMIENTO CREDITO(Pesos) ': 31438240,
      ' SALDO FINAL(Pesos) ': 501542,
      ' SALDO FINAL CORRIENTE(Pesos) ': 501542,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.5.11.06 ',
      NOMBRE: 'PRIMA DE SERVICIOS ',
      ' SALDO INICIAL(Pesos) ': 5093896110,
      ' MOVIMIENTO DEBITO(Pesos) ': 5093896110,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 0,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
    },
    {
      codigo: '2.5.11.09 ',
      NOMBRE: 'BONIFICACIONES ',
      ' SALDO INICIAL(Pesos) ': 3001979,
      ' MOVIMIENTO DEBITO(Pesos) ': 795046583,
      ' MOVIMIENTO CREDITO(Pesos) ': 795046583,
      ' SALDO FINAL(Pesos) ': 3001979,
      ' SALDO FINAL CORRIENTE(Pesos) ': 3001979,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.5.11.10 ',
      NOMBRE: 'OTRAS PRIMAS ',
      ' SALDO INICIAL(Pesos) ': 97577154,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 97577154,
      ' SALDO FINAL CORRIENTE(Pesos) ': 97577154,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.5.11.11 ',
      NOMBRE: 'APORTES A RIESGOS LABORALES ',
      ' SALDO INICIAL(Pesos) ': 127934900,
      ' MOVIMIENTO DEBITO(Pesos) ': 525811600,
      ' MOVIMIENTO CREDITO(Pesos) ': 534845300,
      ' SALDO FINAL(Pesos) ': 136968600,
      ' SALDO FINAL CORRIENTE(Pesos) ': 136968600,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.5.11.22 ',
      NOMBRE: 'APORTES A FONDOS PENSIONALES - EMPLEADOR ',
      ' SALDO INICIAL(Pesos) ': 2154275828,
      ' MOVIMIENTO DEBITO(Pesos) ': 5567412611,
      ' MOVIMIENTO CREDITO(Pesos) ': 5450012811,
      ' SALDO FINAL(Pesos) ': 2036876028,
      ' SALDO FINAL CORRIENTE(Pesos) ': 2036876028,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.5.11.23 ',
      NOMBRE: 'APORTES A SEGURIDAD SOCIAL EN SALUD - EMPLEADOR ',
      ' SALDO INICIAL(Pesos) ': 832756316,
      ' MOVIMIENTO DEBITO(Pesos) ': 4607408496,
      ' MOVIMIENTO CREDITO(Pesos) ': 4661210696,
      ' SALDO FINAL(Pesos) ': 886558516,
      ' SALDO FINAL CORRIENTE(Pesos) ': 886558516,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.5.11.90 ',
      NOMBRE: 'OTROS BENEFICIOS A LOS EMPLEADOS A CORTO PLAZO ',
      ' SALDO INICIAL(Pesos) ': 70836779,
      ' MOVIMIENTO DEBITO(Pesos) ': 44681863,
      ' MOVIMIENTO CREDITO(Pesos) ': 44681863,
      ' SALDO FINAL(Pesos) ': 70836779,
      ' SALDO FINAL CORRIENTE(Pesos) ': 70836779,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.5.12 ',
      NOMBRE: 'BENEFICIOS A LOS EMPLEADOS A LARGO PLAZO ',
      ' SALDO INICIAL(Pesos) ': 9635064950,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 9635064950,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 9635064950,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '2.5.12.90 ',
      NOMBRE: 'OTROS BENEFICIOS A LOS EMPLEADOS A LARGO PLAZO ',
      ' SALDO INICIAL(Pesos) ': 9635064950,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 9635064950,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 9635064950,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '2.5.14 ',
      NOMBRE: 'BENEFICIOS POSEMPLEO - PENSIONES ',
      ' SALDO INICIAL(Pesos) ': 434113069177,
      ' MOVIMIENTO DEBITO(Pesos) ': 22654227879,
      ' MOVIMIENTO CREDITO(Pesos) ': 13846445958,
      ' SALDO FINAL(Pesos) ': 425305287256,
      ' SALDO FINAL CORRIENTE(Pesos) ': 14702873809,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 410602413447,
      porcentajeCorriente: 0.0345701646548072,
      porcentajeNoCorriente: 0.965429835345193,
    },
    {
      codigo: '2.5.14.05 ',
      NOMBRE: 'CUOTAS PARTES DE PENSIONES ',
      ' SALDO INICIAL(Pesos) ': 740224092,
      ' MOVIMIENTO DEBITO(Pesos) ': 282024794,
      ' MOVIMIENTO CREDITO(Pesos) ': 187822356,
      ' SALDO FINAL(Pesos) ': 646021654,
      ' SALDO FINAL CORRIENTE(Pesos) ': 646021654,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.5.14.10 ',
      NOMBRE: 'CÁLCULO ACTUARIAL DE PENSIONES ACTUALES ',
      ' SALDO INICIAL(Pesos) ': 404965805381,
      ' MOVIMIENTO DEBITO(Pesos) ': 13553075287,
      ' MOVIMIENTO CREDITO(Pesos) ': 4839495804,
      ' SALDO FINAL(Pesos) ': 396252225898,
      ' SALDO FINAL CORRIENTE(Pesos) ': 11109775455,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 385142450443,
      porcentajeCorriente: 0.028037130718503,
      porcentajeNoCorriente: 0.971962869281497,
    },
    {
      codigo: '2.5.14.14 ',
      NOMBRE: 'CÁLCULO ACTUARIAL DE CUOTAS PARTES DE PENSIONES ',
      ' SALDO INICIAL(Pesos) ': 28407039704,
      ' MOVIMIENTO DEBITO(Pesos) ': 187822356,
      ' MOVIMIENTO CREDITO(Pesos) ': 187822356,
      ' SALDO FINAL(Pesos) ': 28407039704,
      ' SALDO FINAL CORRIENTE(Pesos) ': 2947076700,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 25459963004,
      porcentajeCorriente: 0.103744590450409,
      porcentajeNoCorriente: 0.896255409549591,
    },
    {
      codigo: '2.7 ',
      NOMBRE: 'PROVISIONES ',
      ' SALDO INICIAL(Pesos) ': 20874186225,
      ' MOVIMIENTO DEBITO(Pesos) ': 827886266,
      ' MOVIMIENTO CREDITO(Pesos) ': 15247887885,
      ' SALDO FINAL(Pesos) ': 35294187844,
      ' SALDO FINAL CORRIENTE(Pesos) ': 35294187844,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
    },
    {
      codigo: '2.7.01 ',
      NOMBRE: 'LITIGIOS Y DEMANDAS ',
      ' SALDO INICIAL(Pesos) ': 1392552804,
      ' MOVIMIENTO DEBITO(Pesos) ': 147639530,
      ' MOVIMIENTO CREDITO(Pesos) ': 560046731,
      ' SALDO FINAL(Pesos) ': 1804960005,
      ' SALDO FINAL CORRIENTE(Pesos) ': 1804960005,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.7.01.90 ',
      NOMBRE: 'OTROS LITIGIOS Y DEMANDAS ',
      ' SALDO INICIAL(Pesos) ': 1392552804,
      ' MOVIMIENTO DEBITO(Pesos) ': 147639530,
      ' MOVIMIENTO CREDITO(Pesos) ': 560046731,
      ' SALDO FINAL(Pesos) ': 1804960005,
      ' SALDO FINAL CORRIENTE(Pesos) ': 1804960005,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.7.90 ',
      NOMBRE: 'PROVISIONES DIVERSAS ',
      ' SALDO INICIAL(Pesos) ': 19481633421,
      ' MOVIMIENTO DEBITO(Pesos) ': 680246736,
      ' MOVIMIENTO CREDITO(Pesos) ': 14687841154,
      ' SALDO FINAL(Pesos) ': 33489227839,
      ' SALDO FINAL CORRIENTE(Pesos) ': 33489227839,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.7.90.90 ',
      NOMBRE: 'OTRAS PROVISIONES DIVERSAS ',
      ' SALDO INICIAL(Pesos) ': 19481633421,
      ' MOVIMIENTO DEBITO(Pesos) ': 680246736,
      ' MOVIMIENTO CREDITO(Pesos) ': 14687841154,
      ' SALDO FINAL(Pesos) ': 33489227839,
      ' SALDO FINAL CORRIENTE(Pesos) ': 33489227839,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.9 ',
      NOMBRE: 'OTROS PASIVOS ',
      ' SALDO INICIAL(Pesos) ': 42057666494,
      ' MOVIMIENTO DEBITO(Pesos) ': 26547835221,
      ' MOVIMIENTO CREDITO(Pesos) ': 22373380323,
      ' SALDO FINAL(Pesos) ': 37883211596,
      ' SALDO FINAL CORRIENTE(Pesos) ': 37883211596,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
    },
    {
      codigo: '2.9.02 ',
      NOMBRE: 'RECURSOS RECIBIDOS EN ADMINISTRACIÓN ',
      ' SALDO INICIAL(Pesos) ': 2752781360,
      ' MOVIMIENTO DEBITO(Pesos) ': 2105776440,
      ' MOVIMIENTO CREDITO(Pesos) ': 8224220729,
      ' SALDO FINAL(Pesos) ': 8871225649,
      ' SALDO FINAL CORRIENTE(Pesos) ': 8871225649,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.9.02.01 ',
      NOMBRE: 'EN ADMINISTRACIÓN ',
      ' SALDO INICIAL(Pesos) ': 2752781360,
      ' MOVIMIENTO DEBITO(Pesos) ': 2105776440,
      ' MOVIMIENTO CREDITO(Pesos) ': 8224220729,
      ' SALDO FINAL(Pesos) ': 8871225649,
      ' SALDO FINAL CORRIENTE(Pesos) ': 8871225649,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.9.10 ',
      NOMBRE: 'INGRESOS RECIBIDOS POR ANTICIPADO ',
      ' SALDO INICIAL(Pesos) ': 18006005455,
      ' MOVIMIENTO DEBITO(Pesos) ': 20910898516,
      ' MOVIMIENTO CREDITO(Pesos) ': 10591098117,
      ' SALDO FINAL(Pesos) ': 7686205056,
      ' SALDO FINAL CORRIENTE(Pesos) ': 7686205056,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.9.10.05 ',
      NOMBRE: 'ARRENDAMIENTO OPERATIVO ',
      ' SALDO INICIAL(Pesos) ': 9457500,
      ' MOVIMIENTO DEBITO(Pesos) ': 7818490,
      ' MOVIMIENTO CREDITO(Pesos) ': 4665990,
      ' SALDO FINAL(Pesos) ': 6305000,
      ' SALDO FINAL CORRIENTE(Pesos) ': 6305000,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.9.10.26 ',
      NOMBRE: 'SERVICIOS EDUCATIVOS ',
      ' SALDO INICIAL(Pesos) ': 17995836555,
      ' MOVIMIENTO DEBITO(Pesos) ': 20903080026,
      ' MOVIMIENTO CREDITO(Pesos) ': 10586432127,
      ' SALDO FINAL(Pesos) ': 7679188656,
      ' SALDO FINAL CORRIENTE(Pesos) ': 7679188656,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.9.10.90 ',
      NOMBRE: 'OTROS INGRESOS RECIBIDOS POR ANTICIPADO ',
      ' SALDO INICIAL(Pesos) ': 711400,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 711400,
      ' SALDO FINAL CORRIENTE(Pesos) ': 711400,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.9.90 ',
      NOMBRE: 'OTROS PASIVOS DIFERIDOS ',
      ' SALDO INICIAL(Pesos) ': 21298879679,
      ' MOVIMIENTO DEBITO(Pesos) ': 3531160265,
      ' MOVIMIENTO CREDITO(Pesos) ': 3558061477,
      ' SALDO FINAL(Pesos) ': 21325780891,
      ' SALDO FINAL CORRIENTE(Pesos) ': 21325780891,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '2.9.90.02 ',
      NOMBRE: 'INGRESO DIFERIDO POR TRANSFERENCIAS CONDICIONADAS ',
      ' SALDO INICIAL(Pesos) ': 21298879679,
      ' MOVIMIENTO DEBITO(Pesos) ': 3531160265,
      ' MOVIMIENTO CREDITO(Pesos) ': 3558061477,
      ' SALDO FINAL(Pesos) ': 21325780891,
      ' SALDO FINAL CORRIENTE(Pesos) ': 21325780891,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 0,
      porcentajeCorriente: 1,
      porcentajeNoCorriente: 0,
    },
    {
      codigo: '3 ',
      NOMBRE: 'PATRIMONIO ',
      ' SALDO INICIAL(Pesos) ': 1834946315859,
      ' MOVIMIENTO DEBITO(Pesos) ': 245266087,
      ' MOVIMIENTO CREDITO(Pesos) ': 611722050,
      ' SALDO FINAL(Pesos) ': 1835312771822,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 1835312771822,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '3.1.05 ',
      NOMBRE: 'CAPITAL FISCAL ',
      ' SALDO INICIAL(Pesos) ': 515159303923,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 515159303923,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 515159303923,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '3.1.05.06 ',
      NOMBRE: 'CAPITAL FISCAL ',
      ' SALDO INICIAL(Pesos) ': 515159303923,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': 515159303923,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 515159303923,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '3.1.09 ',
      NOMBRE: 'RESULTADOS DE EJERCICIOS ANTERIORES ',
      ' SALDO INICIAL(Pesos) ': 1504666670645,
      ' MOVIMIENTO DEBITO(Pesos) ': 245266087,
      ' MOVIMIENTO CREDITO(Pesos) ': 611722050,
      ' SALDO FINAL(Pesos) ': 1505033126608,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 1505033126608,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '3.1.09.01 ',
      NOMBRE: 'UTILIDADES O EXCEDENTES ACUMULADOS ',
      ' SALDO INICIAL(Pesos) ': 1504666670645,
      ' MOVIMIENTO DEBITO(Pesos) ': 245266087,
      ' MOVIMIENTO CREDITO(Pesos) ': 611722050,
      ' SALDO FINAL(Pesos) ': 1505033126608,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': 1505033126608,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '3.1.51 ',
      NOMBRE: 'GANANCIAS O PÉRDIDAS POR  BENEFICIOS POSEMPLEO ',
      ' SALDO INICIAL(Pesos) ': -184879658709,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': -184879658709,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': -184879658709,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
    {
      codigo: '3.1.51.01 ',
      NOMBRE:
        'GANANCIAS O PÉRDIDAS ACTUARIALES POR PLANES DE BENEFICIOS POSEMPLEO ',
      ' SALDO INICIAL(Pesos) ': -184879658709,
      ' MOVIMIENTO DEBITO(Pesos) ': 0,
      ' MOVIMIENTO CREDITO(Pesos) ': 0,
      ' SALDO FINAL(Pesos) ': -184879658709,
      ' SALDO FINAL CORRIENTE(Pesos) ': 0,
      ' SALDO FINAL NO CORRIENTE(Pesos) ': -184879658709,
      porcentajeCorriente: 0,
      porcentajeNoCorriente: 1,
    },
  ];

  modeloReporteChip = [
    {
      codigo: '1 ',
    },
    {
      codigo: '1.1 ',
    },
    {
      codigo: '1.1.05 ',
    },
    {
      codigo: '1.1.05.02 ',
    },
    {
      codigo: '1.1.10 ',
    },
    {
      codigo: '1.1.10.05 ',
    },
    {
      codigo: '1.1.10.06 ',
    },
    {
      codigo: '1.2 ',
    },
    {
      codigo: '1.2.21 ',
    },
    {
      codigo: '1.2.21.01 ',
    },
    {
      codigo: '1.2.21.03 ',
    },
    {
      codigo: '1.2.21.07 ',
    },
    {
      codigo: '1.2.21.16 ',
    },
    {
      codigo: '1.2.23 ',
    },
    {
      codigo: '1.2.23.02 ',
    },
    {
      codigo: '1.2.24 ',
    },
    {
      codigo: '1.2.24.13 ',
    },
    {
      codigo: '1.2.24.15 ',
    },
    {
      codigo: '1.2.80 ',
    },
    {
      codigo: '1.2.80.42 ',
    },
    {
      codigo: '1.3 ',
    },
    {
      codigo: '1.3.17 ',
    },
    {
      codigo: '1.3.17.01 ',
    },
    {
      codigo: '1.3.17.90 ',
    },
    {
      codigo: '1.3.19 ',
    },
    {
      codigo: '1.3.19.14 ',
    },
    {
      codigo: '1.3.22 ',
    },
    {
      codigo: '1.3.22.20 ',
    },
    {
      codigo: '1.3.37 ',
    },
    {
      codigo: '1.3.37.12 ',
    },
    {
      codigo: '1.3.84 ',
    },
    {
      codigo: '1.3.84.08 ',
    },
    {
      codigo: '1.3.84.13 ',
    },
    {
      codigo: '1.3.84.90 ',
    },
    {
      codigo: '1.3.85 ',
    },
    {
      codigo: '1.3.85.02 ',
    },
    {
      codigo: '1.3.85.90 ',
    },
    {
      codigo: '1.3.86 ',
    },
    {
      codigo: '1.3.86.02 ',
    },
    {
      codigo: '1.3.86.90 ',
    },
    {
      codigo: '1.5 ',
    },
    {
      codigo: '1.5.05 ',
    },
    {
      codigo: '1.5.05.06 ',
    },
    {
      codigo: '1.5.10 ',
    },
    {
      codigo: '1.5.10.04 ',
    },
    {
      codigo: '1.5.10.90 ',
    },
    {
      codigo: '1.5.14 ',
    },
    {
      codigo: '1.5.14.03 ',
    },
    {
      codigo: '1.5.14.05 ',
    },
    {
      codigo: '1.5.14.08 ',
    },
    {
      codigo: '1.5.30 ',
    },
    {
      codigo: '1.5.30.90 ',
    },
    {
      codigo: '1.6 ',
    },
    {
      codigo: '1.6.05 ',
    },
    {
      codigo: '1.6.05.01 ',
    },
    {
      codigo: '1.6.05.02 ',
    },
    {
      codigo: '1.6.15 ',
    },
    {
      codigo: '1.6.15.01 ',
    },
    {
      codigo: '1.6.15.90 ',
    },
    {
      codigo: '1.6.25 ',
    },
    {
      codigo: '1.6.25.03 ',
    },
    {
      codigo: '1.6.25.04 ',
    },
     {
      codigo: '1.6.25.05 ',
    },
    {
      codigo: '1.6.25.07 ',
    },
    {
      codigo: '1.6.25.12',
    },
    {
      codigo: '1.6.25.90 ',
    },
    {
      codigo: '1.6.40 ',
    },
    {
      codigo: '1.6.40.01 ',
    },
    {
      codigo: '1.6.40.02 ',
    },
    {
      codigo: '1.6.40.12 ',
    },
    {
      codigo: '1.6.40.17 ',
    },
    {
      codigo: '1.6.40.19 ',
    },
      {
      codigo: '1.6.40.24 ',
    },
    {
      codigo: '1.6.40.90 ',
    },
    {
      codigo: '1.6.45 ',
    },
    {
      codigo: '1.6.45.13 ',
    },
    {
      codigo: '1.6.50 ',
    },
    {
      codigo: '1.6.50.10 ',
    },
    {
      codigo: '1.6.50.90 ',
    },
    {
      codigo: '1.6.55 ',
    },
    {
      codigo: '1.6.55.90 ',
    },
    {
      codigo: '1.6.60 ',
    },
    {
      codigo: '1.6.60.02 ',
    },
    {
      codigo: '1.6.60.90 ',
    },
    {
      codigo: '1.6.65 ',
    },
    {
      codigo: '1.6.65.01 ',
    },
    {
      codigo: '1.6.65.02 ',
    },
    {
      codigo: '1.6.65.90 ',
    },
    {
      codigo: '1.6.70 ',
    },
    {
      codigo: '1.6.70.01 ',
    },
    {
      codigo: '1.6.70.02 ',
    },
    {
      codigo: '1.6.75 ',
    },
    {
      codigo: '1.6.75.02 ',
    },
    {
      codigo: '1.6.81 ',
    },
    {
      codigo: '1.6.81.01 ',
    },
    {
      codigo: '1.6.81.07 ',
    },
    {
      codigo: '1.6.85 ',
    },
    {
      codigo: '1.6.85.01 ',
    },
    {
      codigo: '1.6.85.02 ',
    },
    {
      codigo: '1.6.85.03 ',
    },
    {
      codigo: '1.6.85.04 ',
    },
    {
      codigo: '1.6.85.05 ',
    },
    {
      codigo: '1.6.85.06 ',
    },
    {
      codigo: '1.6.85.07 ',
    },
    {
      codigo: '1.6.85.08 ',
    },
    {
      codigo: '1.6.85.12 ',
    },
    {
      codigo: '1.6.95 ',
    },
    {
      codigo: '1.6.95.01 ',
    },
    {
      codigo: '1.7 ',
    },
    {
      codigo: '1.7.10 ',
    },
    {
      codigo: '1.7.10.01 ',
    },
    {
      codigo: '1.7.15 ',
    },
    {
      codigo: '1.7.15.90 ',
    },
    {
      codigo: '1.9 ',
    },
    {
      codigo: '1.9.02 ',
    },
    {
      codigo: '1.9.02.04 ',
    },
    {
      codigo: '1.9.04 ',
    },
    {
      codigo: '1.9.04.04 ',
    },
    {
      codigo: '1.9.04.12 ',
    },
    {
      codigo: '1.9.05 ',
    },
    {
      codigo: '1.9.05.05 ',
    },
    {
      codigo: '1.9.05.15 ',
    },
    {
      codigo: '1.9.05.90 ',
    },
    {
      codigo: '1.9.06 ',
    },
    {
      codigo: '1.9.06.04 ',
    },
    {
      codigo: '1.9.08 ',
    },
    {
      codigo: '1.9.08.03 ',
    },
    {
      codigo: '1.9.09 ',
    },
    {
      codigo: '1.9.09.03 ',
    },
    {
      codigo: '1.9.26 ',
    },
    {
      codigo: '1.9.26.03 ',
    },
    {
      codigo: '1.9.51 ',
    },
    {
      codigo: '1.9.51.01 ',
    },
    {
      codigo: '1.9.51.02 ',
    },
    {
      codigo: '1.9.52 ',
    },
    {
      codigo: '1.9.52.01 ',
    },
    {
      codigo: '1.9.70 ',
    },
    {
      codigo: '1.9.70.03 ',
    },
    {
      codigo: '1.9.70.08 ',
    },
    {
      codigo: '1.9.75 ',
    },
    {
      codigo: '1.9.75.03 ',
    },
    {
      codigo: '1.9.75.08 ',
    },
    {
      codigo: '1.9.86 ',
    },
    {
      codigo: '1.9.86.09 ',
    },
    {
      codigo: '2 ',
    },
    {
      codigo: '2.4 ',
    },
    {
      codigo: '2.4.01 ',
    },
    {
      codigo: '2.4.01.01 ',
    },
    {
      codigo: '2.4.07 ',
    },
    {
      codigo: '2.4.07.01 ',
    },
    {
      codigo: '2.4.07.03 ',
    },
    {
      codigo: '2.4.07.20 ',
    },
    {
      codigo: '2.4.07.22 ',
    },
    {
      codigo: '2.4.07.90 ',
    },
    {
      codigo: '2.4.24 ',
    },
    {
      codigo: '2.4.24.01 ',
    },
    {
      codigo: '2.4.24.02 ',
    },
    {
      codigo: '2.4.24.04 ',
    },
    {
      codigo: '2.4.24.05 ',
    },
    {
      codigo: '2.4.24.06 ',
    },
    {
      codigo: '2.4.24.07 ',
    },
    {
      codigo: '2.4.24.11 ',
    },
    {
      codigo: '2.4.36 ',
    },
    {
      codigo: '2.4.36.03 ',
    },
    {
      codigo: '2.4.36.05 ',
    },
    {
      codigo: '2.4.36.06 ',
    },
    {
      codigo: '2.4.36.08 ',
    },
    {
      codigo: '2.4.36.15 ',
    },
    {
      codigo: '2.4.36.25 ',
    },
    {
      codigo: '2.4.36.26 ',
    },
    {
      codigo: '2.4.36.27 ',
    },
    {
      codigo: '2.4.36.98 ',
    },
    {
      codigo: '2.4.40 ',
    },
    {
      codigo: '2.4.40.03 ',
    },
    {
      codigo: '2.4.40.75 ',
    },
    // {
    //   codigo: '2.4.60 ',
    // },
    // {
    //   codigo: '2.4.60.02 ',
    // },
    {
      codigo: '2.4.81 ',
    },
    {
      codigo: '2.4.81.06 ',
    },
    {
      codigo: '2.4.90 ',
    },
    {
      codigo: '2.4.90.26 ',
    },
    {
      codigo: '2.4.90.27 ',
    },
    {
      codigo: '2.4.90.28 ',
    },
    {
      codigo: '2.4.90.50 ',
    },
    {
      codigo: '2.4.90.51 ',
    },
    {
      codigo: '2.4.90.54 ',
    },
    {
      codigo: '2.4.90.55 ',
    },
    {
      codigo: '2.4.90.58 ',
    },
    {
      codigo: '2.4.90.90 ',
    },
    {
      codigo: '2.5 ',
    },
    {
      codigo: '2.5.11 ',
    },
    {
      codigo: '2.5.11.01 ',
    },
    {
      codigo: '2.5.11.02 ',
    },
    {
      codigo: '2.5.11.03 ',
    },
    {
      codigo: '2.5.11.06 ',
    },
    {
      codigo: '2.5.11.09 ',
    },
    {
      codigo: '2.5.11.10 ',
    },
    {
      codigo: '2.5.11.11 ',
    },
    {
      codigo: '2.5.11.22 ',
    },
    {
      codigo: '2.5.11.23 ',
    },
    {
      codigo: '2.5.11.90 ',
    },
    {
      codigo: '2.5.12 ',
    },
    {
      codigo: '2.5.12.90 ',
    },
    {
      codigo: '2.5.14 ',
    },
    {
      codigo: '2.5.14.01 ',
    },
    {
      codigo: '2.5.14.05 ',
    },
    {
      codigo: '2.5.14.10 ',
    },
    {
      codigo: '2.5.14.14 ',
    },
    {
      codigo: '2.7 ',
    },
    {
      codigo: '2.7.01 ',
    },
    {
      codigo: '2.7.01.90 ',
    },
    {
      codigo: '2.7.90 ',
    },
    {
      codigo: '2.7.90.90 ',
    },
    {
      codigo: '2.9 ',
    },
    {
      codigo: '2.9.02 ',
    },
    {
      codigo: '2.9.02.01 ',
    },
    {
      codigo: '2.9.10 ',
    },
    {
      codigo: '2.9.10.26 ',
    },
    // {
    //   codigo: '2.9.10.05 ',
    // },
    {
      codigo: '2.9.10.90 ',
    },
    {
      codigo: '2.9.90 ',
    },
    {
      codigo: '2.9.90.02 ',
    },
    {
      codigo: '3 ',
    },
    {
      codigo: '3.1 ',
    },
    {
      codigo: '3.1.05 ',
    },
    {
      codigo: '3.1.05.06 ',
    },
    {
      codigo: '3.1.09 ',
    },
    {
      codigo: '3.1.09.01 ',
    },
      {
      codigo: '3.1.10 ',
    },
      {
      codigo: '3.1.10.01 ',
    },
    {
      codigo: '3.1.51 ',
    },
    {
      codigo: '3.1.51.01 ',
    },
    {
      codigo: '4 ',
    },
    {
      codigo: '4.3 ',
    },
    {
      codigo: '4.3.05 ',
    },
    {
      codigo: '4.3.05.14 ',
    },
    {
      codigo: '4.3.05.15 ',
    },
    {
      codigo: '4.3.05.27 ',
    },
    {
      codigo: '4.3.05.50 ',
    },
    {
      codigo: '4.3.11 ',
    },
    {
      codigo: '4.3.11.05 ',
    },
    {
      codigo: '4.3.11.90 ',
    },
    {
      codigo: '4.3.90 ',
    },
    {
      codigo: '4.3.90.07 ',
    },
    {
      codigo: '4.3.90.90 ',
    },
    {
      codigo: '4.3.95 ',
    },
    {
      codigo: '4.3.95.01 ',
    },
    {
      codigo: '4.3.95.12 ',
    },
    {
      codigo: '4.3.95.90 ',
    },
    {
      codigo: '4.4 ',
    },
    {
      codigo: '4.4.28 ',
    },
    {
      codigo: '4.4.28.03 ',
    },
    {
      codigo: '4.4.28.05 ',
    },
    {
      codigo: '4.4.28.30 ',
    },
    {
      codigo: '4.4.28.90 ',
    },
    {
      codigo: '4.8 ',
    },
    {
      codigo: '4.8.02 ',
    },
    {
      codigo: '4.8.02.01 ',
    },
    {
      codigo: '4.8.02.11 ',
    },
    {
      codigo: '4.8.02.16 ',
    },
    {
      codigo: '4.8.02.32 ',
    },
    {
      codigo: '4.8.02.90 ',
    },
    {
      codigo: '4.8.08 ',
    },
    {
      codigo: '4.8.08.03 ',
    },
    {
      codigo: '4.8.08.05 ',
    },
    {
      codigo: '4.8.08.08 ',
    },
    {
      codigo: '4.8.08.17 ',
    },
    {
      codigo: '4.8.08.25 ',
    },
    {
      codigo: '4.8.08.28 ',
    },
    {
      codigo: '4.8.08.90 ',
    },
    {
      codigo: '4.8.31 ',
    },
    {
      codigo: '4.8.31.01 ',
    },
    {
      codigo: '5 ',
    },
    {
      codigo: '5.1 ',
    },
    {
      codigo: '5.1.01 ',
    },
    {
      codigo: '5.1.01.01 ',
    },
    {
      codigo: '5.1.01.03 ',
    },
    {
      codigo: '5.1.01.05 ',
    },
    {
      codigo: '5.1.01.10 ',
    },
    {
      codigo: '5.1.01.19 ',
    },
    {
      codigo: '5.1.01.23 ',
    },
    {
      codigo: '5.1.01.60 ',
    },
    {
      codigo: '5.1.02 ',
    },
    {
      codigo: '5.1.02.01 ',
    },
    {
      codigo: '5.1.02.02 ',
    },
    {
      codigo: '5.1.02.90 ',
    },
    {
      codigo: '5.1.03 ',
    },
    {
      codigo: '5.1.03.03 ',
    },
    {
      codigo: '5.1.03.04 ',
    },
    {
      codigo: '5.1.03.05 ',
    },
    {
      codigo: '5.1.03.06 ',
    },
    {
      codigo: '5.1.03.07 ',
    },
    {
      codigo: '5.1.03.90 ',
    },
    {
      codigo: '5.1.04 ',
    },
    {
      codigo: '5.1.04.01 ',
    },
    {
      codigo: '5.1.07 ',
    },
    {
      codigo: '5.1.07.01 ',
    },
    {
      codigo: '5.1.07.02 ',
    },
    {
      codigo: '5.1.07.03 ',
    },
    {
      codigo: '5.1.07.04 ',
    },
    {
      codigo: '5.1.07.05 ',
    },
    {
      codigo: '5.1.07.06 ',
    },
    {
      codigo: '5.1.07.90 ',
    },
    {
      codigo: '5.1.08 ',
    },
    {
      codigo: '5.1.08.01 ',
    },
    {
      codigo: '5.1.08.03 ',
    },
    {
      codigo: '5.1.08.04 ',
    },
    {
      codigo: '5.1.08.07 ',
    },
    {
      codigo: '5.1.08.10 ',
    },
    {
      codigo: '5.1.08.90 ',
    },
    {
      codigo: '5.1.11 ',
    },
    {
      codigo: '5.1.11.12 ',
    },
    {
      codigo: '5.1.11.13 ',
    },
    {
      codigo: '5.1.11.14 ',
    },
    {
      codigo: '5.1.11.15 ',
    },
    {
      codigo: '5.1.11.16 ',
    },
    {
      codigo: '5.1.11.17 ',
    },
    {
      codigo: '5.1.11.18 ',
    },
    {
      codigo: '5.1.11.19 ',
    },
    {
      codigo: '5.1.11.21 ',
    },
    {
      codigo: '5.1.11.23 ',
    },
    {
      codigo: '5.1.11.25 ',
    },
    {
      codigo: '5.1.11.33 ',
    },
    {
      codigo: '5.1.11.36 ',
    },
    {
      codigo: '5.1.11.37 ',
    },
    {
      codigo: '5.1.11.46 ',
    },
    {
      codigo: '5.1.11.49 ',
    },
    {
      codigo: '5.1.11.55 ',
    },
    {
      codigo: '5.1.11.64 ',
    },
    {
      codigo: '5.1.11.65 ',
    },
    {
      codigo: '5.1.11.79 ',
    },
    {
      codigo: '5.1.11.80 ',
    },
    {
      codigo: '5.1.11.90 ',
    },
    {
      codigo: '5.1.20 ',
    },
    {
      codigo: '5.1.20.01 ',
    },
    {
      codigo: '5.1.20.02 ',
    },
    {
      codigo: '5.1.20.11 ',
    },
    {
      codigo: '5.1.20.24 ',
    },
    {
      codigo: '5.1.20.90 ',
    },
    {
      codigo: '5.3 ',
    },
    {
      codigo: '5.3.60 ',
    },
    {
      codigo: '5.3.60.01 ',
    },
    {
      codigo: '5.3.60.02 ',
    },
    {
      codigo: '5.3.62 ',
    },
    {
      codigo: '5.3.62.01 ',
    },
    {
      codigo: '5.3.68 ',
    },
    {
      codigo: '5.3.68.03 ',
    },
    {
      codigo: '5.3.68.05 ',
    },
    {
      codigo: '5.8 ',
    },
    {
      codigo: '5.8.02 ',
    },
    {
      codigo: '5.8.02.40 ',
    },
    {
      codigo: '5.8.02.90 ',
    },
    {
      codigo: '5.8.03 ',
    },
    {
      codigo: '5.8.03.90 ',
    },
    {
      codigo: '5.8.04 ',
    },
    {
      codigo: '5.8.04.11 ',
    },
    {
      codigo: '5.8.90 ',
    },
    {
      codigo: '5.8.90.12 ',
    },
    {
      codigo: '5.8.90.19 ',
    },
    {
      codigo: '5.8.90.90 ',
    },
    {
      codigo: '6 ',
    },
    {
      codigo: '6.3 ',
    },
    {
      codigo: '6.3.05 ',
    },
    {
      codigo: '6.3.05.08 ',
    },
    {
      codigo: '6.3.05.09 ',
    },
    {
      codigo: '6.3.10 ',
    },
    {
      codigo: '6.3.10.01 ',
    },
    {
      codigo: '6.3.10.15 ',
    },
    {
      codigo: '6.3.10.16 ',
    },
    {
      codigo: '6.3.10.17 ',
    },
    {
      codigo: '6.3.10.18 ',
    },
    {
      codigo: '6.3.10.19 ',
    },
    {
      codigo: '6.3.10.25 ',
    },
    {
      codigo: '6.3.10.29 ',
    },
    {
      codigo: '6.3.10.40 ',
    },
    {
      codigo: '6.3.10.41 ',
    },
    {
      codigo: '6.3.10.42 ',
    },
    {
      codigo: '6.3.10.43 ',
    },
    {
      codigo: '6.3.10.50 ',
    },
    {
      codigo: '6.3.10.53 ',
    },
    {
      codigo: '6.3.10.56 ',
    },
    {
      codigo: '6.3.10.67 ',
    },
    {
      codigo: '7 ',
    },
    {
      codigo: '7.2 ',
    },
    {
      codigo: '7.2.08 ',
    },
    {
      codigo: '7.2.08.02 ',
    },
    {
      codigo: '7.2.08.03 ',
    },
    {
      codigo: '7.2.08.04 ',
    },
    {
      codigo: '7.2.08.05 ',
    },
    {
      codigo: '7.2.08.06 ',
    },
    {
      codigo: '7.2.08.07 ',
    },
    {
      codigo: '7.2.08.08 ',
    },
    {
      codigo: '7.2.08.09 ',
    },
    {
      codigo: '7.2.08.10 ',
    },
    {
      codigo: '7.2.08.95 ',
    },
    {
      codigo: '7.2.09 ',
    },
    {
      codigo: '7.2.09.02 ',
    },
    {
      codigo: '7.2.09.03 ',
    },
    {
      codigo: '7.2.09.05 ',
    },
    {
      codigo: '7.2.09.08 ',
    },
    {
      codigo: '7.2.09.10 ',
    },
    {
      codigo: '7.2.09.95 ',
    },
    {
      codigo: '7.3 ',
    },
    {
      codigo: '7.3.01 ',
    },
    {
      codigo: '7.3.01.02 ',
    },
    {
      codigo: '7.3.01.04 ',
    },
    {
      codigo: '7.3.01.10 ',
    },
    {
      codigo: '7.3.01.95 ',
    },
    {
      codigo: '7.3.10 ',
    },
    {
      codigo: '7.3.10.01 ',
    },
    {
      codigo: '7.3.10.10 ',
    },
    {
      codigo: '7.3.10.95 ',
    },
    {
      codigo: '7.3.11 ',
    },
    {
      codigo: '7.3.11.02 ',
    },
    {
      codigo: '7.3.11.03 ',
    },
    {
      codigo: '7.3.11.04 ',
    },
    {
      codigo: '7.3.11.07 ',
    },
    {
      codigo: '7.3.11.09 ',
    },
    {
      codigo: '7.3.11.10 ',
    },
    {
      codigo: '7.3.11.95 ',
    },
    {
      codigo: '7.3.12 ',
    },
    {
      codigo: '7.3.12.02 ',
    },
    {
      codigo: '7.3.12.03 ',
    },
    {
      codigo: '7.3.12.04 ',
    },
    {
      codigo: '7.3.12.09 ',
    },
    {
      codigo: '7.3.12.10 ',
    },
    {
      codigo: '7.3.12.95 ',
    },
    {
      codigo: '7.3.13 ',
    },
    {
      codigo: '7.3.13.95 ',
    },
    {
      codigo: '7.3.14 ',
    },
    {
      codigo: '7.3.14.01 ',
    },
    {
      codigo: '7.3.14.02 ',
    },
    {
      codigo: '7.3.14.10 ',
    },
    {
      codigo: '7.3.14.95 ',
    },
    {
      codigo: '7.3.20 ',
    },
    {
      codigo: '7.3.20.02 ',
    },
    {
      codigo: '7.3.20.04 ',
    },
    {
      codigo: '7.3.20.95 ',
    },
    {
      codigo: '7.3.24 ',
    },
    {
      codigo: '7.3.24.02 ',
    },
    {
      codigo: '7.3.24.95 ',
    },
    {
      codigo: '7.3.40 ',
    },
    {
      codigo: '7.3.40.02 ',
    },
    {
      codigo: '7.3.40.95 ',
    },
    {
      codigo: '7.3.41 ',
    },
    {
      codigo: '7.3.41.02 ',
    },
    {
      codigo: '7.3.41.04 ',
    },
    {
      codigo: '7.3.41.95 ',
    },
    {
      codigo: '7.3.42 ',
    },
    {
      codigo: '7.3.42.02 ',
    },
    {
      codigo: '7.3.42.95 ',
    },
    {
      codigo: '7.3.43 ',
    },
    {
      codigo: '7.3.43.02 ',
    },
    {
      codigo: '7.3.43.04 ',
    },
    {
      codigo: '7.3.43.95 ',
    },
    {
      codigo: '7.3.49 ',
    },
    {
      codigo: '7.3.49.02 ',
    },
    {
      codigo: '7.3.49.03 ',
    },
    {
      codigo: '7.3.49.04 ',
    },
    {
      codigo: '7.3.49.09 ',
    },
    {
      codigo: '7.3.49.10 ',
    },
    {
      codigo: '7.3.49.95 ',
    },
    {
      codigo: '7.3.52 ',
    },
    {
      codigo: '7.3.52.02 ',
    },
    {
      codigo: '7.3.52.95 ',
    },
    {
      codigo: '7.3.56 ',
    },
    {
      codigo: '7.3.56.02 ',
    },
    {
      codigo: '7.3.56.10 ',
    },
    {
      codigo: '7.3.56.95 ',
    },
    {
      codigo: '7.3.84 ',
    },
    {
      codigo: '7.3.84.02 ',
    },
    {
      codigo: '7.3.87 ',
    },
    {
      codigo: '7.3.87.02 ',
    },
    {
      codigo: '7.3.87.03 ',
    },
    {
      codigo: '7.3.87.04 ',
    },
    {
      codigo: '7.3.87.09 ',
    },
    {
      codigo: '7.3.87.10 ',
    },
    {
      codigo: '7.3.87.95 ',
    },
    {
      codigo: '8 ',
    },
    {
      codigo: '8.1 ',
    },
    {
      codigo: '8.1.20 ',
    },
    {
      codigo: '8.1.20.04 ',
    },
    {
      codigo: '8.1.90 ',
    },
    {
      codigo: '8.1.90.02 ',
    },
    {
      codigo: '8.1.90.90 ',
    },
    {
      codigo: '8.3 ',
    },
    {
      codigo: '8.3.47 ',
    },
    {
      codigo: '8.3.47.04 ',
    },
    {
      codigo: '8.3.55 ',
    },
    {
      codigo: '8.3.55.10 ',
    },
    {
      codigo: '8.3.61 ',
    },
    {
      codigo: '8.3.61.01 ',
    },
    {
      codigo: '8.9 ',
    },
    {
      codigo: '8.9.05 ',
    },
    {
      codigo: '8.9.05.06 ',
    },
    {
      codigo: '8.9.05.90 ',
    },
    {
      codigo: '8.9.15 ',
    },
    {
      codigo: '8.9.15.16 ',
    },
    {
      codigo: '8.9.15.18 ',
    },
    {
      codigo: '8.9.15.21 ',
    },
    {
      codigo: '9 ',
    },
    {
      codigo: '9.1 ',
    },
    {
      codigo: '9.1.20 ',
    },
    {
      codigo: '9.1.20.90 ',
    },
    {
      codigo: '9.1.90 ',
    },
    {
      codigo: '9.1.90.90 ',
    },
    {
      codigo: '9.3 ',
    },
    {
      codigo: '9.3.90 ',
    },
    {
      codigo: '9.3.90.12 ',
    },
    {
      codigo: '9.3.90.90 ',
    },
    {
      codigo: '9.9 ',
    },
    {
      codigo: '9.9.05 ',
    },
    {
      codigo: '9.9.05.05 ',
    },
    {
      codigo: '9.9.05.90 ',
    },
    {
      codigo: '9.9.15 ',
    },
    {
      codigo: '9.9.15.90 ',
    },
  ];

  constructor(private router: Router, private dialog: MatDialog) {
    this.tablaFiltro = null;
  }

  ngOnInit(): void {
    // if (localStorage.getItem('datosTabla')) {
    //   this.datosTabla = JSON.parse(localStorage.getItem('datosTabla')!);
    //   this.validartabla = 1;
    //   this.mostrarTabla = true;
    //   this.consultarTabla();
    // }
    if (localStorage.getItem('modeloDeDatosContabilidad')) {
      this.modeloDeDatosContabilidad = JSON.parse(
        localStorage.getItem('modeloDeDatosContabilidad')!
      );
    }
    if (localStorage.getItem('ruta')) {
      this.titulo = localStorage.getItem('ruta');
    } else {
      if (this.titulo == '') {
        this.router.navigate(['/']);
      }
    }
    this.filterSubject.pipe(debounceTime(500)).subscribe((value) => {
      this.filterValue = value.replace(/\./g, '\\.');
      const filterSequence = this.filterValue.split('\\.');
      if (value.length === 0) {
        this.dataTareasPaginated = [...this.datosTabla.slice(0, this.pageSize)];
      } else {
        this.dataTareasPaginated = this.datosTabla.filter((tarea: any) => {
          const tareaSequence = tarea.codigo.split('.');
          return (
            tareaSequence.slice(0, filterSequence.length).join('.') ===
            filterSequence.join('.')
          );
        });
      }
      this.selectAll = false;
      this.seleccionados = [];
      this.dataTareasPaginated.forEach((row: any) => {
        row.tipo = this.selectAll;
      });
    });
  }
  recibirValor(valor: any) {
    if (valor.accion === 'nuevos') {
      this.datosTabla = this.datosTabla.map((obj: any, index: any) => {
        const objetoNuevo = valor.data.find(
          (nuevo: any) => nuevo.codigo === obj.codigo
        );
        if (objetoNuevo) {
          this.modeloDeDatosContabilidad.push(objetoNuevo);
          return objetoNuevo;
        }
        return obj;
      });
      localStorage.setItem(
        'modeloDeDatosContabilidad',
        JSON.stringify(this.modeloDeDatosContabilidad)
      );
      this.mostrarNuevos = false;
      setTimeout(() => {
        this.cuadrarSaldosCorrientesyNoCorrientes(0);
      }, 500);
    } else {
      this.corrientesNoCorrientes = [];
      valor.data.forEach((nuevo: any) => {
        const obj = this.datosTabla.find(
          (obj: any) => obj.codigo === nuevo.codigo
        );
        if (obj) {
          Object.assign(obj, nuevo);
        }
      });
      this.datosTabla.forEach((element: any) => {
        if (element.corriente === 'true' && element.noCorriente === 'true') {
          this.corrientesNoCorrientes.push(element);
        }
      });
      this.mostrarNuevos = false;
      this.cuadrarSaldosCorrientesyNoCorrientes(1);
    }
  }
  cuadrarSaldosCorrientesyNoCorrientes(numero = 0) {
    console.log('recorrido2', this.recorrido2);
    if (this.recorrido2 === 0) {
      this.ejecutarModeloDeResumidos(this.contadormodelo);
    } else {
      //cambiar condicion recordar que es mayor a
      //  0 no menor
      console.log('corrientesNoCorrientes', this.corrientesNoCorrientes);
      if (this.corrientesNoCorrientes.length > 0) {
        if (numero === 0) {
          let obj2 = {
            accion: 'corrientes',
            data: this.corrientesNoCorrientes,
          };
          this.mostrarNuevos = true;
          this.codigosNoexistentes = obj2;
          console.log('askd hola', this.codigosNoexistentes);
        } else {
          let obj = {
            data: this.corrientesNoCorrientes.filter(
              (item: any) => item.nuevoSaldo !== 0
            ),
            configuracion: true,
          };
          console.log(obj.data.length);
          if (obj.data.length > 0) {
            const dialogRef = this.dialog.open(ModalTablaComponent, {
              panelClass: 'my-custom-dialog',
              data: obj,
            });

            dialogRef.afterClosed().subscribe((result: any) => {
              if (result) {
                result.forEach((obj: any, index: any) => {
                  const objetoNuevo = this.datosTabla.map((nuevo: any) =>
                    nuevo.codigo.trim() === obj.codigo.trim() ? obj : nuevo
                  );
                });
                for (let i = 0; i < this.datosTabla.length; i++) {
                  const corrienteCopia = this.corrientesCopia.find(
                    (c: any) => c.codigo === this.datosTabla[i].codigo
                  );
                  if (corrienteCopia) {
                    if (
                      this.datosTabla[i].corriente === 'true' &&
                      this.datosTabla[i].noCorriente === 'false'
                    ) {
                      this.datosTabla[i].tipoDeCuenta =
                        this.datosTabla[i].nuevoSaldo;
                    } else if (
                      this.datosTabla[i].corriente === 'false' &&
                      this.datosTabla[i].noCorriente === 'true'
                    ) {
                      this.datosTabla[i].compartidoTipo =
                        this.datosTabla[i].nuevoSaldo;
                    }
                  }
                }
                this.ejecutarModeloDeResumidos(this.contadormodelo);
              }
            });
          } else {
            for (let i = 0; i < this.datosTabla.length; i++) {
              const corrienteCopia = this.corrientesCopia.find(
                (c: any) => c.codigo === this.datosTabla[i].codigo
              );
              if (corrienteCopia) {
                if (
                  this.datosTabla[i].corriente === 'true' &&
                  this.datosTabla[i].noCorriente === 'false'
                ) {
                  this.datosTabla[i].tipoDeCuenta =
                    this.datosTabla[i].nuevoSaldo;
                } else if (
                  this.datosTabla[i].corriente === 'false' &&
                  this.datosTabla[i].noCorriente === 'true'
                ) {
                  this.datosTabla[i].compartidoTipo =
                    this.datosTabla[i].nuevoSaldo;
                }
              }
            }
            this.ejecutarModeloDeResumidos(this.contadormodelo);
          }
        }
      } else {
        for (let i = 0; i < this.datosTabla.length; i++) {
          const corrienteCopia = this.corrientesCopia.find(
            (c: any) => c.codigo === this.datosTabla[i].codigo
          );
          if (corrienteCopia) {
            if (
              this.datosTabla[i].corriente === 'true' &&
              this.datosTabla[i].noCorriente === 'false'
            ) {
              this.datosTabla[i].tipoDeCuenta = this.datosTabla[i].nuevoSaldo;
            } else if (
              this.datosTabla[i].corriente === 'false' &&
              this.datosTabla[i].noCorriente === 'true'
            ) {
              this.datosTabla[i].compartidoTipo = this.datosTabla[i].nuevoSaldo;
            }
          }
        }
        this.ejecutarModeloDeResumidos(this.contadormodelo);
      }
    }
  }
  toggleAllSelection() {
    this.selectAll = !this.selectAll;
    if (this.baseInformes) {
      this.seleccionadosNewTable = [];
      this.dataTareasPaginated.forEach((row: any) => {
        const editable = this.puedeEditarDistribucion(row);
        row.tipo = this.selectAll && editable;
        if (row.tipo) {
          this.seleccionadosNewTable.push(row);
        }
      });
      return;
    }
    this.dataTareasPaginated.forEach((row: any) => {
      if (this.selectAll) {
        this.seleccionados.push(row);
      }
      row.tipo = this.selectAll;
    });
    if (this.selectAll == false) {
      this.seleccionados = [];
    }
  }
  fileUpload(event: any) {
    this.reporteActivo = '';
    this.tablaInicialGuardada = [];
    this.reporteChipGuardado = [];
    this.datosReporteActual = [];
    localStorage.removeItem('reporteChipModificado');
    if (!this.displayedColumns.includes('tipo')) {
      this.displayedColumns = ['tipo', ...this.displayedColumns];
    }
    this.currentPage = 1;
    this.pageSize = 100;
    this.cargandoPaginaSpinner = 0;
    const selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload = (event: any) => {
      let binaryData = event.target.result;
      let workbook = XLSX.read(binaryData, { type: 'binary' });
      workbook.SheetNames.forEach((sheet) => {
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        this.convertedJson = JSON.stringify(data, undefined, 4);
        this.datosTabla = data;
        this.datosTabla2Recorrido = data;
        this.datosHijosTabla = data;
      });
      console.log(this.datosTabla);
      setTimeout(() => {
        this.separarNumerosDelNombre(this.datosTabla);
      }, 1000);
      this.validartabla = 1;
    };
  }

  separarNumerosDelNombre(objetos: any) {
    objetos.forEach((objeto: any) => {
      // Eliminar espacios en blanco de la propiedad nombre
      objeto.nombre = objeto.nombre.trim();

      // Utilizar expresión regular para extraer el número de las palabras
      const regex = /\d+/; // Expresión regular para buscar números en la cadena
      const matches = objeto.nombre.match(regex);
      const codigo = matches ? matches[0] : ''; // Si se encuentran coincidencias, asignar el primer número como código, de lo contrario, asignar una cadena vacía
      const nombre = objeto.nombre.replace(regex, '').trim(); // Reemplazar el número encontrado con una cadena vacía para obtener solo el nombre

      objeto.codigo = codigo;
      objeto.nombre = nombre;
      objeto.tipo = false;
      objeto.color = '';
    });
    this.agregarEstructuraCodigo(objetos);
  }
  agregarEstructuraCodigo(objetos: any) {
    objetos.forEach((objeto: any) => {
      const codigoExistente = objeto.codigo.replace(/\./g, ''); // Eliminar cualquier punto existente en el código
      const chunks = codigoExistente.match(/\d{1,2}/g) || []; // Dividir el código en grupos de uno o dos dígitos
      let codigoEstructurado = '';
      for (let i = 0; i < chunks.length; i++) {
        codigoEstructurado += chunks[i];
        if (i < chunks.length - 1) {
          codigoEstructurado += '.';
        }
      }
      objeto.codigo = codigoEstructurado;
    });
    let codigosSeparados = this.separarPrimerGrupoCodigoConPunto(objetos);
    codigosSeparados = this.procesarSaldo(codigosSeparados);
    this.datosTabla = codigosSeparados;
    this.elementosUnificados = codigosSeparados;
    this.datosTabla2Recorrido = codigosSeparados;
    this.siguientepasoAgregarEstructura();
  }
  siguientepasoAgregarEstructura() {
    let modeloCodigo: any = [];
    let datosCodigos: any = [];
    let datosCodigosModelo: any = [];
    for (
      let index = 0;
      index < this.modeloDeDatosContabilidad.length;
      index++
    ) {
      modeloCodigo.push(this.modeloDeDatosContabilidad[index].codigo.trim());
    }

    for (let index = 0; index < this.datosTabla.length; index++) {
      datosCodigos.push(this.datosTabla[index].codigo.trim());
    }

    for (
      let index = 0;
      index < this.modeloDeDatosSistemaContaduria.length;
      index++
    ) {
      datosCodigosModelo.push(
        this.modeloDeDatosSistemaContaduria[index].codigo.trim()
      );
    }

    const codigosNoEnArray2 = datosCodigos.filter(
      (codigo: any) => !modeloCodigo.includes(codigo)
    );
    const codigosNoEnArray3 = codigosNoEnArray2.filter(
      (codigo: any) => !datosCodigosModelo.includes(codigo)
    );
    this.codigosNoexistentes = codigosNoEnArray3;
    console.log('askd hola', this.codigosNoexistentes);
    for (let index = 0; index < this.datosTabla.length; index++) {
      const codigo = this.datosTabla[index].codigo.trim();

      const indiceModelo = this.modeloDeDatosContabilidad.findIndex(
        (item: any) => item.codigo.trim() === codigo
      );

      if (indiceModelo !== -1) {
        this.datosTabla[index].corriente =
          this.modeloDeDatosContabilidad[indiceModelo].corriente === 'true'
            ? true
            : false;

        this.datosTabla[index].noCorriente =
          this.modeloDeDatosContabilidad[indiceModelo].noCorriente === 'true'
            ? true
            : false;
      }
    }
    let datosEliminados: any = [];
    this.datosTabla = this.datosTabla.filter((objeto: any) => {
      const nombreSubstring = objeto.nombre.substring(0, 5);
      // const codigoArray = objeto.codigo.split('.');
      // if (codigoArray[0] === '1' || codigoArray[0] === '2') {
      //   objeto.tipoDeCuenta = true;
      // } else {
      //   objeto.tipoDeCuenta = false;
      // }
      if (
        nombreSubstring === 'LOCAL' &&
        objeto.credito === 0 &&
        objeto.debito === 0 &&
        objeto.nuevoSaldo === 0 &&
        objeto.saldoAnterior === 0
      ) {
        datosEliminados.push(objeto.codigo);
        return false; // Eliminar el objeto del arreglo
      }
      return true;
    });
    this.codigosNoexistentes = this.codigosNoexistentes.filter(
      (objeto: any) => {
        return !datosEliminados.some((objeto2: any) => objeto2 === objeto);
      }
    );
    let codigosNuevos = [];
    for (let index = 0; index < this.codigosNoexistentes.length; index++) {
      const data = this.datosTabla.find((objeto: any) => {
        return objeto.codigo === this.codigosNoexistentes[index];
      });
      codigosNuevos.push(data);
    }
    if (this.recorrido2 === 0) {
      if (this.codigosNoexistentes.length > 0) {
        let obj2 = {
          accion: 'nuevos',
          data: codigosNuevos,
        };
        this.mostrarNuevos = true;
        this.codigosNoexistentes = obj2;
        console.log('askd hola', this.codigosNoexistentes);
      } else {
        this.cuadrarSaldosCorrientesyNoCorrientes();
      }
    } else {
      this.cuadrarSaldosCorrientesyNoCorrientes();
    }
  }
  separarPrimerGrupoCodigoConPunto(objetos: any[]) {
    const codigosSeparados = objetos.map((objeto) => {
      const codigo = objeto.codigo;
      const partesCodigo = codigo.split('.');
      if (partesCodigo.length >= 2) {
        const nuevoCodigo =
          partesCodigo[0].substr(0, 1) +
          '.' +
          partesCodigo[0].substr(1) +
          '.' +
          partesCodigo.slice(1).join('.');
        return { ...objeto, codigo: nuevoCodigo };
      } else {
        return objeto;
      }
    });
    return codigosSeparados;
  }
  procesarSaldo(objetos: any[]) {
    objetos.forEach((objeto) => {
      // Procesar nuevoSaldo
      if (typeof objeto.nuevoSaldo === 'string') {
        objeto.nuevoSaldo = objeto.nuevoSaldo.replace(/,/g, ''); // Eliminar comas
        if (objeto.nuevoSaldo.includes('DB')) {
          objeto.tipoSaldoNuevo = 'DB';
          objeto.nuevoSaldo = parseFloat(
            objeto.nuevoSaldo.replace(/\s/g, '').replace('DB', '')
          );
        } else if (objeto.nuevoSaldo.includes('CR')) {
          objeto.tipoSaldoNuevo = 'CR';
          objeto.nuevoSaldo = parseFloat(
            objeto.nuevoSaldo.replace(/\s/g, '').replace('CR', '')
          );
        }
      } else {
        objeto.tipoSaldoNuevo = null;
      }

      // Procesar saldoAnterior
      if (typeof objeto.saldoAnterior === 'string') {
        objeto.saldoAnterior = objeto.saldoAnterior.replace(/,/g, ''); // Eliminar comas
        if (objeto.saldoAnterior.includes('DB')) {
          objeto.tipoSaldoAnterior = 'DB';
          objeto.saldoAnterior = parseFloat(
            objeto.saldoAnterior.replace(/\s/g, '').replace('DB', '')
          );
        } else if (objeto.saldoAnterior.includes('CR')) {
          objeto.tipoSaldoAnterior = 'CR';
          objeto.saldoAnterior = parseFloat(
            objeto.saldoAnterior.replace(/\s/g, '').replace('CR', '')
          );
        }
      } else {
        objeto.tipoSaldoAnterior = null;
      }
    });

    return objetos;
  }
  organizarYSumarPorPrograma(
    datos: any[],
    programas: { PROGRAMA: string }[]
  ): { PROGRAMA: string; cantidad: number; totalValor20191: number }[] {
    const resultados: {
      [programa: string]: { cantidad: number; totalValor20191: number };
    } = {};

    // Crear un mapa para acceder rápidamente a los índices de los programas
    const indiceProgramas: { [programa: string]: number } = {};
    programas.forEach((programa, index) => {
      indiceProgramas[programa.PROGRAMA] = index;
    });

    // Inicializar los resultados con los programas en el mismo orden que la lista proporcionada
    programas.forEach((programa) => {
      const nombrePrograma = programa.PROGRAMA;
      resultados[nombrePrograma] = { cantidad: 0, totalValor20191: 0 };
    });

    datos.forEach((item) => {
      const programa = item['PROGRAMA'];
      const resolucion = item['resolucion'];
      const valor20191 = parseInt(item['valor20191']);

      if (indiceProgramas[programa] !== undefined && resolucion !== 'null') {
        resultados[programa].cantidad++;
        resultados[programa].totalValor20191 += valor20191;
      }
    });

    // Convertir los resultados a un array de objetos con el nombre del programa
    const resultadosArray = programas.map((programa) => {
      const nombrePrograma = programa.PROGRAMA;
      return { PROGRAMA: nombrePrograma, ...resultados[nombrePrograma] };
    });

    return resultadosArray;
  }

  corregirCodigos(): void {
    this.datosTabla = this.datosTabla.map((item: any) => {
      let division;
      if (
        item.SUBCLASE !== undefined &&
        item.SUBCLASE !== null &&
        item.SUBCLASE !== ''
      ) {
        const y = item.SUBCLASE.toString();
        division = y.slice(0, 2);
      }
      if (
        (item.DIVISION === undefined ||
          item.DIVISION === null ||
          item.DIVISION === '') &&
        division !== undefined
      ) {
        item.DIVISION = division;
      }
      return item;
    });

    console.log('Proceso terminado');
  }
  eliminarComas(arrayDeObjetos: any[]) {
    const camposAEliminarComas = [
      'credito',
      'debito',
      'nuevoSaldo',
      'tipoDeCuenta',
      'compartidoTipo',
      'saldoAnterior',
    ];
    return arrayDeObjetos.map((objeto) => {
      Object.keys(objeto).forEach((key) => {
        if (
          camposAEliminarComas.includes(key) &&
          typeof objeto[key] === 'string' &&
          objeto[key].includes(',')
        ) {
          objeto[key] = objeto[key].replace(/,/g, '');
        }
      });
      return objeto;
    });
  }
  exportexcel() {
    this.exportarLibroInstitucional();
    return;
    // Obtener la tabla
    const tabla: any = document.getElementById('excel-table');

    // Obtener los datos de la tabla en un arreglo de arreglos
    const datos = this.getTablaData(tabla);
    if (datos.length === 0) {
      Swal.fire('Sin información', 'No hay datos para exportar.', 'info');
      return;
    }

    datos[0] = [
      'Código',
      'Nombre de la cuenta',
      'Saldo anterior',
      'Débito',
      'Crédito',
      'Saldo actual',
      'Tipo saldo actual',
      'Tipo saldo anterior',
      'Valor corriente',
      'Valor no corriente',
      'Es corriente',
      'Es no corriente',
    ];
    // Crear una hoja de Excel
    const hoja: any = XLSXStyle.utils.aoa_to_sheet(datos);

    // Configurar el ancho de las columnas
    if (hoja) {
      const anchoColumnas = [
        { wch: 18 },
        { wch: 48 },
        { wch: 22 },
        { wch: 22 },
        { wch: 22 },
        { wch: 22 },
        { wch: 18 },
        { wch: 18 },
        { wch: 22 },
        { wch: 22 },
        { wch: 15 },
        { wch: 18 },
      ];
      hoja['!cols'] = anchoColumnas;
      hoja['!rows'] = datos.map((_fila: any, index: number) => ({
        hpt: index === 0 ? 28 : 21,
      }));
      hoja['!autofilter'] = { ref: hoja['!ref'] };
      hoja['!freeze'] = { xSplit: 0, ySplit: 1, topLeftCell: 'A2' };
    } else {
      console.error('La hoja de Excel es undefined.');
    }

    // Configurar estilo de los encabezados
    const encabezadosRange = XLSXStyle.utils.decode_range(hoja['!ref']);
    for (let i = encabezadosRange.s.c; i <= encabezadosRange.e.c; i++) {
      const ref = XLSXStyle.utils.encode_cell({ r: 0, c: i });
      hoja[ref].s = {
        fill: { patternType: 'solid', fgColor: { rgb: '155E75' } },
        font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 11 },
        alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
        border: {
          top: { style: 'thin', color: { rgb: '155E75' } },
          bottom: { style: 'medium', color: { rgb: '0F766E' } },
          left: { style: 'thin', color: { rgb: 'D4E4E8' } },
          right: { style: 'thin', color: { rgb: 'D4E4E8' } },
        },
      };
    }

    // Configurar estilo de las celdas de datos
    const datosRange = XLSXStyle.utils.decode_range(hoja['!ref']);
    for (let i = datosRange.s.r + 1; i <= datosRange.e.r; i++) {
      for (let j = datosRange.s.c; j <= datosRange.e.c; j++) {
        const ref = XLSXStyle.utils.encode_cell({ r: i, c: j });
        const celda = hoja[ref];
        if (!celda) {
          continue;
        }

        if ([2, 3, 4, 5, 8, 9].includes(j)) {
          const valorNumerico = Number(String(celda.v ?? 0).replace(/,/g, ''));
          if (Number.isFinite(valorNumerico)) {
            celda.t = 'n';
            celda.v = valorNumerico;
            celda.z = '#,##0.00;[Red]-#,##0.00;0.00';
          }
        }

        celda.s = {
          border: {
            bottom: { style: 'thin', color: { rgb: 'DCE3EA' } },
          },
          fill: {
            patternType: 'solid',
            fgColor: { rgb: i % 2 === 0 ? 'F1F7F8' : 'FFFFFF' },
          },
          font: {
            color: { rgb: j === 0 ? '155E75' : '26374A' },
            bold: j === 0,
            sz: 10,
          },
          alignment: { vertical: 'center', horizontal: j >= 2 && j <= 9 ? 'right' : 'left' },
          numFmt: [2, 3, 4, 5, 8, 9].includes(j)
            ? '#,##0.00;[Red]-#,##0.00;0.00'
            : undefined,
        };
      }
    }
    // Crear un libro de Excel y agregar la hoja
    if (datos.length > 0) {
      // Crear un libro de Excel y agregar la hoja
      const libro = XLSXStyle.utils.book_new();
      const nombreHoja = this.reporteActivo === 'chip'
        ? 'Reporte CHIP'
        : this.reporteActivo === 'balance'
          ? 'Balance'
          : this.reporteActivo === 'resultados'
            ? 'Resultados'
            : 'Información procesada';
      XLSXStyle.utils.book_append_sheet(libro, hoja, nombreHoja);
      libro.Props = {
        Title: nombreHoja,
        Subject: 'Reporte contable',
        Author: 'Herramienta contable',
        CreatedDate: new Date(),
      };

      // Descargar el archivo Excel
      const nombreArchivo = `${nombreHoja.replace(/\s+/g, '_')}.xlsx`;
      XLSXStyle.writeFile(libro, nombreArchivo, {
        bookType: 'xlsx',
        cellStyles: true,
        compression: true,
      });
      Swal.fire({
        icon: 'success',
        title: 'Excel generado',
        text: `${nombreArchivo} se descargó correctamente.`,
        confirmButtonColor: '#177447',
        timer: 2200,
        timerProgressBar: true,
      });
    } else {
      console.error('No hay datos en la tabla para generar el archivo Excel.');
    }
  }

  getTablaData(tabla: HTMLElement): any[][] {
    // Obtener las filas de la tabla
    const filas = Array.from(tabla.querySelectorAll('tr'));

    // Obtener los encabezados de columna
    const encabezados = filas.shift()?.querySelectorAll('th');

    // Obtener los datos de la tabla en un arreglo de arreglos
    // Obtener los datos de la tabla en un arreglo de arreglos
    const datos = filas.map((fila) =>
      Array.from(fila.querySelectorAll('td, th')).map((celda, index) => {
        // Parse numerical values for columns other than column A (index 0) and B (index 1)
        if (this.mostrarReporte == 'ReporteProgramacion') {
          if (index !== 0 && index !== 1) {
            const textContent = celda.textContent;
            const numericValue =
              textContent !== null ? parseFloat(textContent) : null;
            return numericValue !== null && !isNaN(numericValue)
              ? numericValue
              : textContent;
          } else {
            return celda.textContent; // Keep column A (index 0) and B (index 1) as textContent
          }
        } else {
          if (index !== 0 && index !== 1) {
            const textContent = celda.textContent;
            const numericValue =
              textContent !== null ? parseFloat(textContent) : null;
            return numericValue !== null && !isNaN(numericValue)
              ? numericValue
              : textContent;
          } else {
            return celda.textContent; // Keep column A (index 0) and B (index 1) as textContent
          }
        }
      })
    );

    // Agregar los encabezados de columna al inicio del arreglo de arreglos
    if (encabezados) {
      datos.unshift(
        Array.from(encabezados).map((encabezado) => encabezado.textContent)
      );
    }

    return datos;
  }

  ejecutarModeloDeResumidos(contadorValor: any) {
    this.datosTabla = this.eliminarComas(this.datosTabla);
    const busqueda = this.datosTabla.reduce((acc: any, codigo: any) => {
      acc[codigo.codigo.trim().slice(0, contadorValor)] =
        ++acc[codigo.codigo.trim().slice(0, contadorValor)] || 0;
      return acc;
    }, {});
    const duplicados = this.datosTabla.filter((codigo: any) => {
      return busqueda[codigo.codigo.trim().slice(0, contadorValor)];
    });
    let unicos: any = [];
    for (var i = 0; i < duplicados.length; i++) {
      const elemento = duplicados[i].codigo.trim().slice(0, contadorValor);
      if (
        !unicos.includes(duplicados[i].codigo.trim().slice(0, contadorValor))
      ) {
        unicos.push(elemento);
        this.unicosmodelo = unicos;
      }
    }
    if (contadorValor == 0) {
      console.log(localStorage.getItem('1'));
    } else {
      let x = unicos.filter((element: any) => element.length == contadorValor);
      unicos = x;
      this.unicosmodelo = x;
    }
    let arreglosDuplicados: any = [];
    if (unicos) {
      unicos.forEach((element: any) => {
        const arreglosSeparados = this.datosTabla.filter(
          (campo: any) =>
            campo.codigo.trim().slice(0, contadorValor) == element.trim()
        );
        arreglosDuplicados.push(arreglosSeparados);
      });
      let element1;
      let element2;
      for (let index = 0; index < arreglosDuplicados.length; index++) {
        element1 = arreglosDuplicados[index].length;
        element2 = arreglosDuplicados[index];
        let x = 0;
        let y = 0;
        let w = 0;
        let p = 0;
        let n = 0;
        let c = 0;
        for (let i = 0; i < element1; i++) {
          const element = element2[i];
          // REVISARRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
          if (p == 0) {
            if (element.saldoAnterior == undefined) {
              p = 0;
            } else {
              const codigoArray = element.codigo.split('.');
              if (
                codigoArray[0] === '1' &&
                element.tipoSaldoAnterior === 'CR'
              ) {
                p = p - Math.round(element.saldoAnterior);
              } else {
                if (
                  (codigoArray[0] === '3' ||
                    codigoArray[0] === '2' ||
                    codigoArray[0] === '4' ||
                    codigoArray[0] === '5' ||
                    codigoArray[0] === '6' ||
                    codigoArray[0] === '7') &&
                  element.tipoSaldoAnterior === 'DB'
                ) {
                  p = p - Math.round(element.saldoAnterior);
                } else {
                  p = p + Math.round(element.saldoAnterior);
                }
              }
            }
            localStorage.setItem(
              element.codigo.trim().slice(0, contadorValor),
              JSON.stringify({
                codigo: element.codigo.trim().slice(0, contadorValor),
                credito: y,
                nuevoSaldo: x,
                debito: w,
                saldoAnterior: p,
                corriente: c,
                noCorriente: n,
              })
            );
          } else {
            if (
              element.saldoAnterior == undefined ||
              element.saldoAnterior == null
            ) {
              p = p + 0;
            } else {
              const codigoArray = element.codigo.split('.');

              if (
                codigoArray[0] === '1' &&
                element.tipoSaldoAnterior === 'CR'
              ) {
                p = p - Math.round(element.saldoAnterior);
              } else {
                if (
                  (codigoArray[0] === '3' ||
                    codigoArray[0] === '2' ||
                    codigoArray[0] === '4' ||
                    codigoArray[0] === '5' ||
                    codigoArray[0] === '6' ||
                    codigoArray[0] === '7') &&
                  element.tipoSaldoAnterior === 'DB'
                ) {
                  p = p - Math.round(element.saldoAnterior);
                } else {
                  p = p + Math.round(element.saldoAnterior);
                }
              }
              localStorage.setItem(
                element.codigo.trim().slice(0, contadorValor),
                JSON.stringify({
                  codigo: element.codigo.trim().slice(0, contadorValor),
                  credito: y,
                  nuevoSaldo: x,
                  debito: w,
                  saldoAnterior: p,
                  corriente: c,
                  noCorriente: n,
                })
              );
            }
          }
          if (w == 0) {
            if (element.debito == undefined) {
              w = 0;
            } else {
              const debitoNumero = parseFloat(element.debito); // convierte a número decimal
              w = w + Math.round(debitoNumero);
            }
            localStorage.setItem(
              element.codigo.trim().slice(0, contadorValor),
              JSON.stringify({
                codigo: element.codigo.trim().slice(0, contadorValor),
                credito: y,
                nuevoSaldo: x,
                debito: w,
                saldoAnterior: p,
                corriente: c,
                noCorriente: n,
              })
            );
          } else {
            if (element.debito == undefined || element.debito == null) {
              w = w + 0;
            } else {
              const debitoNumero = parseFloat(element.debito); // convierte a número decimal
              w = w + Math.round(debitoNumero);

              localStorage.setItem(
                element.codigo.trim().slice(0, contadorValor),
                JSON.stringify({
                  codigo: element.codigo.trim().slice(0, contadorValor),
                  credito: y,
                  nuevoSaldo: x,
                  debito: w,
                  saldoAnterior: p,
                  corriente: c,
                  noCorriente: n,
                })
              );
            }
          }
          if (c == 0) {
            if (element.tipoDeCuenta == undefined) {
              c = 0;
            } else {
              const codigoArray = element.codigo.split('.');
              if (
                codigoArray[0] === '1' &&
                element.tipoSaldoAnterior === 'CR'
              ) {
                c = c - Math.round(element.tipoDeCuenta);
              } else {
                if (
                  (codigoArray[0] === '3' ||
                    codigoArray[0] === '4' ||
                    codigoArray[0] === '5' ||
                    codigoArray[0] === '6' ||
                    codigoArray[0] === '7') &&
                  element.tipoSaldoAnterior === 'DB'
                ) {
                  c = c - Math.round(element.tipoDeCuenta);
                } else {
                  c = c + Math.round(element.tipoDeCuenta);
                }
              }
            }
            localStorage.setItem(
              element.codigo.trim().slice(0, contadorValor),
              JSON.stringify({
                codigo: element.codigo.trim().slice(0, contadorValor),
                credito: y,
                nuevoSaldo: x,
                debito: w,
                saldoAnterior: p,
                corriente: c,
                noCorriente: n,
              })
            );
          } else {
            if (
              element.tipoDeCuenta == undefined ||
              element.tipoDeCuenta == null
            ) {
              c = c + 0;
            } else {
              const codigoArray = element.codigo.split('.');
              if (codigoArray[0] === '1' && element.tipoSaldoNuevo === 'CR') {
                c = c - Math.round(element.tipoDeCuenta);
              } else {
                if (
                  (codigoArray[0] === '3' ||
                    codigoArray[0] === '2' ||
                    codigoArray[0] === '4' ||
                    codigoArray[0] === '5' ||
                    codigoArray[0] === '6' ||
                    codigoArray[0] === '7') &&
                  element.tipoSaldoNuevo === 'DB'
                ) {
                  c = c - Math.round(element.tipoDeCuenta);
                } else {
                  c = c + Math.round(element.tipoDeCuenta);
                }
              }
              localStorage.setItem(
                element.codigo.trim().slice(0, contadorValor),
                JSON.stringify({
                  codigo: element.codigo.trim().slice(0, contadorValor),
                  credito: y,
                  nuevoSaldo: x,
                  debito: w,
                  saldoAnterior: p,
                  corriente: c,
                  noCorriente: n,
                })
              );
            }
          }
          if (x == 0) {
            if (element.nuevoSaldo == undefined) {
              x = 0;
            } else {
              const codigoArray = element.codigo.split('.');
              if (codigoArray[0] === '1' && element.tipoSaldoNuevo === 'CR') {
                x = x - Math.round(element.nuevoSaldo);
              } else {
                if (
                  (codigoArray[0] === '3' ||
                    codigoArray[0] === '2' ||
                    codigoArray[0] === '4' ||
                    codigoArray[0] === '5' ||
                    codigoArray[0] === '6' ||
                    codigoArray[0] === '7') &&
                  element.tipoSaldoNuevo === 'DB'
                ) {
                  x = x - Math.round(element.nuevoSaldo);
                } else {
                  x = x + Math.round(element.nuevoSaldo);
                }
              }
            }
            localStorage.setItem(
              element.codigo.trim().slice(0, contadorValor),
              JSON.stringify({
                codigo: element.codigo.trim().slice(0, contadorValor),
                credito: y,
                nuevoSaldo: x,
                debito: w,
                saldoAnterior: p,
                corriente: c,
                noCorriente: n,
              })
            );
          } else {
            if (element.nuevoSaldo == undefined || element.nuevoSaldo == null) {
              x = x + 0;
            } else {
              const codigoArray = element.codigo.split('.');
              if (codigoArray[0] === '1' && element.tipoSaldoNuevo === 'CR') {
                x = x - Math.round(element.nuevoSaldo);
              } else {
                if (
                  (codigoArray[0] === '3' ||
                    codigoArray[0] === '2' ||
                    codigoArray[0] === '4' ||
                    codigoArray[0] === '5' ||
                    codigoArray[0] === '6' ||
                    codigoArray[0] === '7') &&
                  element.tipoSaldoNuevo === 'DB'
                ) {
                  x = x - Math.round(element.nuevoSaldo);
                } else {
                  x = x + Math.round(element.nuevoSaldo);
                }
              }

              // x = x + element.nuevoSaldo;
              localStorage.setItem(
                element.codigo.trim().slice(0, contadorValor),
                JSON.stringify({
                  codigo: element.codigo.trim().slice(0, contadorValor),
                  credito: y,
                  nuevoSaldo: x,
                  debito: w,
                  saldoAnterior: p,
                  corriente: c,
                  noCorriente: n,
                })
              );
            }
          }
          if (n == 0) {
            if (element.compartidoTipo == undefined) {
              n = 0;
            } else {
              const codigoArray = element.codigo.split('.');
              if (codigoArray[0] === '1' && element.tipoSaldoNuevo === 'CR') {
                n = n - Math.round(element.compartidoTipo);
              } else {
                if (
                  (codigoArray[0] === '3' ||
                    codigoArray[0] === '2' ||
                    codigoArray[0] === '4' ||
                    codigoArray[0] === '5' ||
                    codigoArray[0] === '6' ||
                    codigoArray[0] === '7') &&
                  element.tipoSaldoNuevo === 'DB'
                ) {
                  n = n - Math.round(element.compartidoTipo);
                } else {
                  n = n + Math.round(element.compartidoTipo);
                }
              }
            }
            localStorage.setItem(
              element.codigo.trim().slice(0, contadorValor),
              JSON.stringify({
                codigo: element.codigo.trim().slice(0, contadorValor),
                credito: y,
                nuevoSaldo: x,
                debito: w,
                saldoAnterior: p,
                corriente: c,
                noCorriente: n,
              })
            );
          } else {
            if (
              element.compartidoTipo == undefined ||
              element.compartidoTipo == null
            ) {
              n = n + 0;
            } else {
              const codigoArray = element.codigo.split('.');
              if (codigoArray[0] === '1' && element.tipoSaldoNuevo === 'CR') {
                n = n - Math.round(element.compartidoTipo);
              } else {
                if (
                  (codigoArray[0] === '3' ||
                    codigoArray[0] === '2' ||
                    codigoArray[0] === '4' ||
                    codigoArray[0] === '5' ||
                    codigoArray[0] === '6' ||
                    codigoArray[0] === '7') &&
                  element.tipoSaldoNuevo === 'DB'
                ) {
                  n = n - Math.round(element.compartidoTipo);
                } else {
                  n = n + Math.round(element.compartidoTipo);
                }
              }

              // x = x + element.nuevoSaldo;
              localStorage.setItem(
                element.codigo.trim().slice(0, contadorValor),
                JSON.stringify({
                  codigo: element.codigo.trim().slice(0, contadorValor),
                  credito: y,
                  nuevoSaldo: x,
                  debito: w,
                  saldoAnterior: p,
                  corriente: c,
                  noCorriente: n,
                })
              );
            }
          }
          if (y == 0) {
            if (element.credito == undefined) {
              y = 0;
            } else {
              const credito = parseFloat(element.credito); // convierte a número decimal
              y = y + Math.round(credito);
            }
            localStorage.setItem(
              element.codigo.trim().slice(0, contadorValor),
              JSON.stringify({
                codigo: element.codigo.trim().slice(0, contadorValor),
                credito: y,
                nuevoSaldo: x,
                debito: w,
                saldoAnterior: p,
                corriente: c,
                noCorriente: n,
              })
            );
          } else {
            if (element.credito == undefined || element.credito == null) {
              y = y + 0;
            } else {
              const credito = parseFloat(element.credito); // convierte a número decimal
              y = y + Math.round(credito);
              localStorage.setItem(
                element.codigo.trim().slice(0, contadorValor),
                JSON.stringify({
                  codigo: element.codigo.trim().slice(0, contadorValor),
                  credito: y,
                  nuevoSaldo: x,
                  debito: w,
                  saldoAnterior: p,
                  corriente: c,
                  noCorriente: n,
                })
              );
            }
          }
        }
      }
      // this.callback(contadorValor)
      this.extrayendoDuplicadosSumadosMODELO(contadorValor);
    }
  }

  extrayendoDuplicadosSumadosMODELO(contadorValor: any) {
    let arraydeDuplicados: any = [];
    this.unicosmodelo.forEach((element: any) => {
      let x: any = localStorage.getItem(element);
      x = JSON.parse(x);
      arraydeDuplicados = [...arraydeDuplicados, x];
      localStorage.setItem(
        'duplicadosIngresos',
        JSON.stringify(arraydeDuplicados)
      );
    });
    for (let index = 0; index < arraydeDuplicados.length; index++) {
      let x = this.modeloDeDatosSistemaContaduria.filter(
        (element: any) =>
          element.codigo.trim() == arraydeDuplicados[index].codigo
      );
      x.forEach((element: any) => {
        element.credito = arraydeDuplicados[index].credito;
        element.debito = arraydeDuplicados[index].debito;
        element.saldoAnterior = arraydeDuplicados[index].saldoAnterior;
        element.tipoDeCuenta = arraydeDuplicados[index].corriente;
        element.compartidoTipo = arraydeDuplicados[index].noCorriente;
        element.nuevoSaldo = arraydeDuplicados[index].nuevoSaldo;
        this.elementosUnificados = this.modeloDeDatosSistemaContaduria.map(
          (element1: any) =>
            element1.codigo == element.codigo ? element : element1
        );
      });
    }
    console.log(this.modeloDeDatosSistemaContaduria);
    this.elementosUnificados.forEach((element: any) => {
      element.codigo = element.codigo.trim();
    });
    this.datosTabla.forEach((element: any) => {
      element.codigo = element.codigo.trim();
    });
    if (contadorValor == 0) {
      this.modeloDeDatosSistemaContaduria.forEach((element: any) => {
        let x = this.datosTabla.filter(
          (element1: any) => element1.codigo !== element.codigo.trim()
        );
        this.datosTabla = this.datosTabla.filter(
          (element1: any) => element1.codigo != element.codigo.trim()
        );
      });
      const mergedArray = this.datosTabla.concat(this.elementosUnificados);
      mergedArray.sort((a: any, b: any) => {
        const aCodeArray: any = a.codigo.split('.');
        const bCodeArray: any = b.codigo.split('.');

        const maxLength = Math.max(aCodeArray.length, bCodeArray.length);
        for (let i = 0; i < maxLength; i++) {
          const aCodePart = parseInt(aCodeArray[i]) || 0;
          const bCodePart = parseInt(bCodeArray[i]) || 0;

          if (aCodePart !== bCodePart) {
            return aCodePart - bCodePart;
          }
        }

        if (aCodeArray.length < bCodeArray.length) {
          return -1; // a viene antes que b
        } else if (aCodeArray.length > bCodeArray.length) {
          return 1;
        } else {
          return 0;
        }
      });
      mergedArray.filter((objeto: any) => {
        const codigoArray = objeto.codigo.split('.');
        if (
          codigoArray[0] === '1' ||
          codigoArray[0] === '5' ||
          codigoArray[0] === '6' ||
          codigoArray[0] === '7' ||
          codigoArray[0] === '8'
        ) {
          objeto.nuevoSaldo =
            (objeto.saldoAnterior ? Math.round(objeto.saldoAnterior) : 0) +
            (objeto.debito ? Math.round(objeto.debito) : 0) -
            (objeto.credito ? Math.round(objeto.credito) : 0);
        } else {
          objeto.nuevoSaldo =
            (objeto.saldoAnterior ? Math.round(objeto.saldoAnterior) : 0) +
            (objeto.credito ? Math.round(objeto.credito) : 0) -
            (objeto.debito ? Math.round(objeto.debito) : 0);
        }
        objeto.compartidoTipo = (objeto.nuevoSaldo ? Math.round(objeto.nuevoSaldo) : 0) -( objeto.tipoDeCuenta ? Math.round(objeto.tipoDeCuenta) : 0);
      });

      mergedArray.filter((objeto: any) => {
        objeto.nuevoSaldo = objeto.nuevoSaldo
          ? Math.round(objeto.nuevoSaldo)
          : 0;
        objeto.saldoAnterior = objeto.saldoAnterior
          ? Math.round(objeto.saldoAnterior)
          : 0;
        objeto.debito = objeto.debito ? Math.round(objeto.debito) : 0;
        objeto.credito = objeto.credito ? Math.round(objeto.credito) : 0;
      });

      this.datosTabla = mergedArray;
      this.baseInformes = mergedArray;
      this.datosTabla334 = mergedArray;
      if (this.contadorAlert === 1) {
        // this.showAlert(mergedArray);
      }
      this.contadorAlert++;
      if (this.recorrido2 === 0) {
        this.objSuma = {
          4: JSON.parse(localStorage.getItem('4') ?? '{}'),
          5: JSON.parse(localStorage.getItem('5') ?? '{}'),
          6: JSON.parse(localStorage.getItem('6') ?? '{}'),
          7: JSON.parse(localStorage.getItem('7') ?? '{}'),
        };
        this.datosTabla = this.datosTabla.filter((objeto: any) => {
          if (objeto.codigo === '3.1.10.01') {
            objeto.debito =
              this.objSuma['5'].nuevoSaldo +
              this.objSuma['6'].nuevoSaldo +
              this.objSuma['7'].nuevoSaldo;
            objeto.credito = this.objSuma['4'].nuevoSaldo;
            objeto.tipoSaldoNuevo = 'CR';
            let x = [];
            const sumatoria =
              (objeto.saldoAnterior || 0) +
              (objeto.credito || 0) -
              (objeto.debito || 0);
            x.push(sumatoria);
            objeto.nuevoSaldo = x[0];
          }
          return true;
        });
      }
      console.log('hola aca acaba todo??????????');
      if (this.recorrido2 === 1) {
        this.actualizarTabla();
      } else {
        for (let i = 0; i < this.datosTabla.length; i++) {
          if (this.datosTabla[i].corriente && !this.datosTabla[i].noCorriente) {
            this.datosTabla[i].tipoDeCuenta = this.datosTabla[i].nuevoSaldo;
            for (
              let index = 0;
              index < this.datosTabla2Recorrido.length;
              index++
            ) {
              if (
                this.datosTabla2Recorrido[index].codigo ===
                this.datosTabla[i].codigo
              ) {
                this.datosTabla2Recorrido[index].nuevoSaldo =
                  this.datosTabla[i].nuevoSaldo;
              }
            }
          } else {
            if (
              !this.datosTabla[i].corriente &&
              this.datosTabla[i].noCorriente
            ) {
              this.datosTabla[i].compartidoTipo = this.datosTabla[i].nuevoSaldo;
              for (
                let index = 0;
                index < this.datosTabla2Recorrido.length;
                index++
              ) {
                if (
                  this.datosTabla2Recorrido[index].codigo ===
                  this.datosTabla[i].codigo
                ) {
                  this.datosTabla2Recorrido[index].compartidoTipo =
                    this.datosTabla[i].nuevoSaldo;
                }
              }
            }
          }

          for (let i = 0; i < this.datosTabla.length; i++) {
            if (
              this.datosTabla[i].corriente &&
              !this.datosTabla[i].noCorriente
            ) {
              this.corrientes.push(this.datosTabla[i]);
              this.rowColors[this.datosTabla[i].codigo] = 'bg-success1';
            }
            if (
              this.datosTabla[i].corriente &&
              this.datosTabla[i].noCorriente
            ) {
              // console.log(this.datosTabla[i])
              // this.corrientesNoCorrientes.push(this.datosTabla[i]);
              this.rowColors[this.datosTabla[i].codigo] = 'bg-yellow';
            }
            if (
              this.datosTabla[i].noCorriente &&
              !this.datosTabla[i].corriente
            ) {
              this.noCorrientes.push(this.datosTabla[i]);
              this.rowColors[this.datosTabla[i].codigo] = 'bg-success2';
            }
          }
        }
        for (let index = 0; index < this.datosTabla.length; index++) {
          const codigo = this.datosTabla[index].codigo.trim();

          const indiceModelo = this.modeloDeDatosContabilidad.findIndex(
            (item: any) => item.codigo.trim() === codigo
          );

          if (indiceModelo !== -1) {
            this.datosTabla[index].corriente =
              this.modeloDeDatosContabilidad[indiceModelo].corriente === 'true'
                ? true
                : false;

            this.datosTabla[index].noCorriente =
              this.modeloDeDatosContabilidad[indiceModelo].noCorriente ===
              'true'
                ? true
                : false;
          }
        }
        for (let i = 0; i < this.datosTabla.length; i++) {
          if (this.datosTabla[i].corriente && !this.datosTabla[i].noCorriente) {
            this.corrientes.push(this.datosTabla[i]);
            this.rowColors[this.datosTabla[i].codigo] = 'bg-success1';
          }
          if (this.datosTabla[i].corriente && this.datosTabla[i].noCorriente) {
            this.corrientesCopia.push(this.datosTabla[i]);
            this.corrientesNoCorrientes.push(this.datosTabla[i]);
            this.rowColors[this.datosTabla[i].codigo] = 'bg-yellow';
          }
          if (this.datosTabla[i].noCorriente && !this.datosTabla[i].corriente) {
            this.noCorrientes.push(this.datosTabla[i]);
            this.rowColors[this.datosTabla[i].codigo] = 'bg-success2';
          }
        }
        this.contadormodelo = 18;
        this.ejecucion = 0;
        this.rowColors = {};
        this.corrientes = [];
        this.mostrarTabla = false;
        this.dataTareasPaginated = [];
        this.selectAll = false;
        this.noCorrientes = [];
        this.padres = [];
        this.elementosUnificados = [];
        this.resultados = [];
        this.datosTabla2 = [];
        this.unicosmodelo = [];
        this.baseInformes = [];
        this.validartabla = 0;
        this.recorrido2 = 1;
        this.datosTabla = this.datosTabla2Recorrido;
        this.siguientepasoAgregarEstructura();
      }
    } else {
      if (contadorValor > 0) {
        console.log('ejecutando', contadorValor);
        this.ejecutarModeloDeResumidos(contadorValor - 1);
      }
    }
  }

  showAlert(data: any) {
    Swal.fire({
      title: 'Proceso terminado',
      text: '¿Usuario desea ejecutar un modelo prederteminado para calculo de corrientes y no corrientes ?, Tenga en cuenta que esto afectara lo que realizo manualmente en las cuentas que son corrientes y no corrientes en el sistema.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result: any) => {
      if (result.isConfirmed) {
        for (const selectedRow of this.modeloPorcentajes) {
          const index = this.datosTabla.findIndex(
            (row: any) => row.codigo === selectedRow.codigo.trim()
          );
          if (index !== -1) {
            if (selectedRow.porcentajeCorriente === 1) {
              this.datosTabla[index].tipoDeCuenta =
                this.datosTabla[index].tipoDeCuenta +
                this.datosTabla[index].compartidoTipo;
              this.datosTabla[index].compartidoTipo = 0;
              this.baseInformes = this.datosTabla;
              this.datosTabla334 = this.datosTabla;
            }
            if (
              selectedRow.porcentajeCorriente !== 0 &&
              selectedRow.porcentajeCorriente !== 1 &&
              selectedRow.porcentajeCorriente
            ) {
              let suma =
                this.datosTabla[index].tipoDeCuenta +
                this.datosTabla[index].compartidoTipo;
              this.datosTabla[index].tipoDeCuenta = (
                suma * selectedRow.porcentajeCorriente
              ).toFixed(2);
              this.datosTabla[index].compartidoTipo = (
                suma - this.datosTabla[index].tipoDeCuenta
              ).toFixed(2);
              this.baseInformes = this.datosTabla;
              this.datosTabla334 = this.datosTabla;
            }
            // row.tipoDeCuenta = result.cuentaCorriente === 'si';
            // row.compartidoTipo = result.cuentaCorrienteNoCorriente === 'si';
            // this.datosTabla[index] = row;
          }
        }
      }
    });
  }

  actualizarTabla() {
    let modeloCodigo: any = [];
    let datosCodigos: any = [];
    let datosCodigosModelo: any = [];
    for (
      let index = 0;
      index < this.modeloDeDatosContabilidad.length;
      index++
    ) {
      modeloCodigo.push(this.modeloDeDatosContabilidad[index].codigo.trim());
    }

    for (let index = 0; index < this.datosTabla.length; index++) {
      datosCodigos.push(this.datosTabla[index].codigo.trim());
    }

    for (
      let index = 0;
      index < this.modeloDeDatosSistemaContaduria.length;
      index++
    ) {
      datosCodigosModelo.push(
        this.modeloDeDatosSistemaContaduria[index].codigo.trim()
      );
    }

    const codigosNoEnArray2 = datosCodigos.filter(
      (codigo: any) => !modeloCodigo.includes(codigo)
    );
    const codigosNoEnArray3 = codigosNoEnArray2.filter(
      (codigo: any) => !datosCodigosModelo.includes(codigo)
    );
    for (let index = 0; index < this.datosTabla.length; index++) {
      const codigo = this.datosTabla[index].codigo.trim();

      const indiceModelo = this.modeloDeDatosContabilidad.findIndex(
        (item: any) => item.codigo.trim() === codigo
      );

      if (indiceModelo !== -1) {
        this.datosTabla[index].corriente =
          this.modeloDeDatosContabilidad[indiceModelo].corriente === 'true'
            ? true
            : false;

        this.datosTabla[index].noCorriente =
          this.modeloDeDatosContabilidad[indiceModelo].noCorriente === 'true'
            ? true
            : false;
      }
    }
    for (let i = 0; i < this.datosTabla.length; i++) {
      if (this.datosTabla[i].corriente && !this.datosTabla[i].noCorriente) {
        this.corrientes.push(this.datosTabla[i]);
        this.rowColors[this.datosTabla[i].codigo] = 'bg-success1';
      }
      if (this.datosTabla[i].corriente && this.datosTabla[i].noCorriente) {
        this.corrientesNoCorrientes.push(this.datosTabla[i]);
        this.rowColors[this.datosTabla[i].codigo] = 'bg-yellow';
      }
      if (this.datosTabla[i].noCorriente && !this.datosTabla[i].corriente) {
        this.noCorrientes.push(this.datosTabla[i]);
        this.rowColors[this.datosTabla[i].codigo] = 'bg-success2';
      }
    }
    this.consultarTabla();
    setTimeout(() => {
      this.cargandoPaginaSpinner = 1;
      this.mostrarTabla = true;
    }, 0);
  }

  consultarTabla() {
    // for (let index = 0; index < this.datosTabla.length; index++) {
    //   this.datosTabla[index].tipo = false;
    // }
    this.dataTareasPaginated = this.datosTabla.slice(0, this.pageSize);
    this.onPageChange({
      pageIndex: this.currentPage - 1,
      pageSize: this.pageSize,
    });
    this.secuenciaDecodigosExistentes();
  }
  consultarTabla2() {
    // for (let index = 0; index < this.datosTabla.length; index++) {
    //   this.datosTabla[index].tipo = false;
    // }
    this.dataTareasPaginated = this.datosTabla.slice(0, this.pageSize);
    this.onPageChange({
      pageIndex: this.currentPage - 1,
      pageSize: this.pageSize,
    });
  }

  secuenciaDecodigosExistentes() {
    // for (let index = 0; index < this.datosTabla.length; index++) {
    //   if (
    //     this.datosTabla[index].codigo.trim() ===
    //     this.modeloDeDatosContabilidad[index].codigo.trim()
    //   ) {
    //     this.datosTabla[index].tipoDeCuenta =
    //       this.modeloDeDatosContabilidad[index].corriente === 'true'
    //         ? true
    //         : false;
    //     this.datosTabla[index].compartidoTipo =
    //       this.modeloDeDatosContabilidad[index].noCorriente === 'true'
    //         ? true
    //         : false;
    //   } else {
    //     console.log('codigos nuevos', this.datosTabla[index].codigo);
    //   }
    // }
    // for (let i = 0; i < this.datosTabla.length; i++) {
    //   if (
    //     this.datosTabla[i].tipoDeCuenta &&
    //     !this.datosTabla[i].compartidoTipo
    //   ) {
    //     this.corrientes.push(this.datosTabla[i]);
    //     this.rowColors[this.datosTabla[i].codigo] = 'bg-success1';
    //   } else {
    //     if (
    //       this.datosTabla[i].compartidoTipo &&
    //       this.datosTabla[i].tipoDeCuenta
    //     ) {
    //       this.corrientesNoCorrientes.push(this.datosTabla[i]);
    //       this.rowColors[this.datosTabla[i].codigo] = 'bg-yellow';
    //     } else {
    //       if (
    //         this.datosTabla[i].compartidoTipo &&
    //         !this.datosTabla[i].tipoDeCuenta
    //       ) {
    //         this.noCorrientes.push(this.datosTabla[i]);
    //         this.rowColors[this.datosTabla[i].codigo] = 'bg-success2';
    //       } else {
    //         this.padres.push(this.datosTabla[i]);
    //         this.rowColors[this.datosTabla[i].codigo] = 'bg-danger1';
    //       }
    //     }
    //   }
    // }
    // this.formatearNumeros();
    this.datosTabla2 = this.datosTabla;
  }

  formatearNumeros(): any[] {
    for (const objeto of this.datosTabla) {
      if (objeto.credito == null || undefined) {
        objeto.credito = 0;
      } else {
        objeto.credito = formatNumber(objeto.credito, 'en-US');
      }
      if (objeto.debito == null || undefined) {
        objeto.debito = 0;
      } else {
        objeto.debito = formatNumber(objeto.debito, 'en-US');
      }
      if (objeto.nuevoSaldo == null || undefined) {
        objeto.nuevoSaldo = 0;
      } else {
        objeto.nuevoSaldo = formatNumber(objeto.nuevoSaldo, 'en-US');
      }
      if (objeto.saldoAnterior == null || undefined) {
        objeto.saldoAnterior = 0;
      } else {
        objeto.saldoAnterior = formatNumber(objeto.saldoAnterior, 'en-US');
      }
      if (objeto.tipoDeCuenta == null || undefined) {
        objeto.tipoDeCuenta = 0;
      } else {
        objeto.tipoDeCuenta = formatNumber(objeto.tipoDeCuenta, 'en-US');
      }
      if (objeto.compartidoTipo == null || undefined) {
        objeto.compartidoTipo = 0;
      } else {
        objeto.compartidoTipo = formatNumber(objeto.compartidoTipo, 'en-US');
      }
    }

    return this.datosTabla;
  }

  miFuncion(parametro: string) {
    this.mostrarTabla = false;
    if (this.datosReporteActual.length === 0) {
      this.datosReporteActual = this.datosTabla;
    }
    const datosBase = this.datosReporteActual;
    const tieneSaldo = (valor: any) => {
      const numero = Number(String(valor ?? 0).replace(/,/g, ''));
      return Number.isFinite(numero) && numero !== 0;
    };

    switch (parametro) {
      case 'c':
        this.datosTabla = datosBase.filter(
          (item: any) => tieneSaldo(item.tipoDeCuenta)
        );
        break;
      case 'n':
        this.datosTabla = datosBase.filter(
          (item: any) => tieneSaldo(item.compartidoTipo)
        );
        break;
      case 'com':
        this.datosTabla = datosBase.filter(
          (item: any) =>
            tieneSaldo(item.tipoDeCuenta) && tieneSaldo(item.compartidoTipo)
        );
        break;
      case 'd':
        this.datosTabla = datosBase.filter(
          (item: any) =>
            !tieneSaldo(item.tipoDeCuenta) && !tieneSaldo(item.compartidoTipo)
        );
        break;
      default:
        this.datosTabla = datosBase;
        break;
    }
    this.currentPage = 1;
    this.selectAll = false;
    this.seleccionados = [];
    this.seleccionadosNewTable = [];
    this.mostrarTabla = true;
    this.consultarTabla2();
  }
  generarReporteGeneral() {
    this.mostrarTabla = false;
    this.asegurarTablaInicial();
    this.datosTabla = this.clonarDatos(this.tablaInicialGuardada);
    let suma1 = {
      1: JSON.parse(localStorage.getItem('1.1.05') ?? '{}'),
      2: JSON.parse(localStorage.getItem('1.1.10') ?? '{}'),
      3: JSON.parse(localStorage.getItem('1.1.32') ?? '{}'),
    };
    let suma2 = {
      2: JSON.parse(localStorage.getItem('1.2.21') ?? '{}'),
      3: JSON.parse(localStorage.getItem('1.2.23') ?? '{}'),
      4: JSON.parse(localStorage.getItem('1.2.24') ?? '{}'),
      5: JSON.parse(localStorage.getItem('1.2.80') ?? '{}'),
    };
    let suma2N = {
      1: JSON.parse(localStorage.getItem('1.2.01') ?? '{}'),
      2: JSON.parse(localStorage.getItem('1.2.21') ?? '{}'),
      3: JSON.parse(localStorage.getItem('1.2.23') ?? '{}'),
      4: JSON.parse(localStorage.getItem('1.2.80') ?? '{}'),
    };
    let suma9N = {
      1: JSON.parse(localStorage.getItem('1.9.51') ?? '{}'),
      2: JSON.parse(localStorage.getItem('1.9.70.02') ?? '{}'),
    };
    let suma3 = {
      1: JSON.parse(localStorage.getItem('1.3.17') ?? '{}'),
      2: JSON.parse(localStorage.getItem('1.3.19') ?? '{}'),
      3: JSON.parse(localStorage.getItem('1.3.22') ?? '{}'),
      4: JSON.parse(localStorage.getItem('1.3.24') ?? '{}'),
      5: JSON.parse(localStorage.getItem('1.3.37') ?? '{}'),
      6: JSON.parse(localStorage.getItem('1.3.84') ?? '{}'),
      7: JSON.parse(localStorage.getItem('1.3.85') ?? '{}'),
      8: JSON.parse(localStorage.getItem('1.3.86') ?? '{}'),
      9: JSON.parse(localStorage.getItem('1.3.90') ?? '{}'),
    };
    let suma5 = {
      1: JSON.parse(localStorage.getItem('1.5.05') ?? '{}'),
      2: JSON.parse(localStorage.getItem('1.5.10') ?? '{}'),
      3: JSON.parse(localStorage.getItem('1.5.14') ?? '{}'),
      4: JSON.parse(localStorage.getItem('1.5.30') ?? '{}'),
    };
    let suma9 = {
      1: JSON.parse(localStorage.getItem('1.9.04') ?? '{}'),
      2: JSON.parse(localStorage.getItem('1.9.05') ?? '{}'),
      3: JSON.parse(localStorage.getItem('1.9.06') ?? '{}'),
      4: JSON.parse(localStorage.getItem('1.9.09') ?? '{}'),
      5: JSON.parse(localStorage.getItem('1.9.26') ?? '{}'),
      6: JSON.parse(localStorage.getItem('1.9.51') ?? '{}'),
      7: JSON.parse(localStorage.getItem('1.9.52') ?? '{}'),
      8: JSON.parse(localStorage.getItem('1.9.70') ?? '{}'),
      9: JSON.parse(localStorage.getItem('1.9.75') ?? '{}'),
    };
    let suma6 = {
      1: JSON.parse(localStorage.getItem('1.6.05') ?? '{}'),
      2: JSON.parse(localStorage.getItem('1.6.15') ?? '{}'),
      3: JSON.parse(localStorage.getItem('1.6.25') ?? '{}'),
      4: JSON.parse(localStorage.getItem('1.6.35') ?? '{}'),
      5: JSON.parse(localStorage.getItem('1.6.40') ?? '{}'),
      6: JSON.parse(localStorage.getItem('1.6.45') ?? '{}'),
      7: JSON.parse(localStorage.getItem('1.6.50') ?? '{}'),
      8: JSON.parse(localStorage.getItem('1.6.55') ?? '{}'),
      9: JSON.parse(localStorage.getItem('1.6.60') ?? '{}'),
      10: JSON.parse(localStorage.getItem('1.6.65') ?? '{}'),
      11: JSON.parse(localStorage.getItem('1.6.70') ?? '{}'),
      12: JSON.parse(localStorage.getItem('1.6.75') ?? '{}'),
      13: JSON.parse(localStorage.getItem('1.6.81') ?? '{}'),
      14: JSON.parse(localStorage.getItem('1.6.85') ?? '{}'),
      15: JSON.parse(localStorage.getItem('1.6.95') ?? '{}'),
    };
    let sumaTOTAL1 = {
      1: JSON.parse(localStorage.getItem('1.1') ?? '{}'),
      2: JSON.parse(localStorage.getItem('1.2') ?? '{}'),
      3: JSON.parse(localStorage.getItem('1.3') ?? '{}'),
      5: JSON.parse(localStorage.getItem('1.5') ?? '{}'),
      6: JSON.parse(localStorage.getItem('1.9') ?? '{}'),
    };
    console.log(sumaTOTAL1);
    let sumaTOTAL2 = {
      1: JSON.parse(localStorage.getItem('1.6') ?? '{}'),
      2: JSON.parse(localStorage.getItem('1.7') ?? '{}'),
    };
    let sumaTOTALActivos = {
      1: JSON.parse(localStorage.getItem('1') ?? '{}'),
    };
    let suma24 = {
      1: JSON.parse(localStorage.getItem('2.4.01') ?? '{}'),
      2: JSON.parse(localStorage.getItem('2.4.07') ?? '{}'),
      3: JSON.parse(localStorage.getItem('2.4.24') ?? '{}'),
      4: JSON.parse(localStorage.getItem('2.4.36') ?? '{}'),
      5: JSON.parse(localStorage.getItem('2.4.60') ?? '{}'),
      6: JSON.parse(localStorage.getItem('2.4.90') ?? '{}'),
      7: JSON.parse(localStorage.getItem('2.4.40') ?? '{}'),
      8: JSON.parse(localStorage.getItem('2.4.81') ?? '{}'),
    };
    let suma25 = {
      1: JSON.parse(localStorage.getItem('2.5.11') ?? '{}'),
      2: JSON.parse(localStorage.getItem('2.5.14') ?? '{}'),
      3: JSON.parse(localStorage.getItem('2.5.12') ?? '{}'),
    };
    let suma27 = {
      1: JSON.parse(localStorage.getItem('2.7.01') ?? '{}'),
    };
    let suma27N = {
      1: JSON.parse(localStorage.getItem('2.7.90') ?? '{}'),
    };
    let sumaTotalPasivos = {
      1: JSON.parse(localStorage.getItem('2') ?? '{}'),
    };
    let sumacorrientePasivos = {
      1: JSON.parse(localStorage.getItem('2.4') ?? '{}'),
      2: JSON.parse(localStorage.getItem('2.5') ?? '{}'),
      3: JSON.parse(localStorage.getItem('2.7.01') ?? '{}'),
      4: JSON.parse(localStorage.getItem('2.9') ?? '{}'),
    };
    let sumanoccorientesPasivos = {
      1: JSON.parse(localStorage.getItem('2.7.90') ?? '{}'),
    };
    let sumaTotalPatrimonio = {
      1: JSON.parse(localStorage.getItem('3.1.05') ?? '{}'),
      2: JSON.parse(localStorage.getItem('3.1.09') ?? '{}'),
      3: JSON.parse(localStorage.getItem('3.1.10') ?? '{}'),
      4: JSON.parse(localStorage.getItem('3.1.45') ?? '{}'),
      5: JSON.parse(localStorage.getItem('3.1.51') ?? '{}'),
    };
    let sumaTotalPatrimonioyPasivos = {
      1: JSON.parse(localStorage.getItem('3') ?? '{}'),
      2: JSON.parse(localStorage.getItem('2') ?? '{}'),
    };
    let sumaTotalochoynueve = {
      1: JSON.parse(localStorage.getItem('8') ?? '{}'),
      2: JSON.parse(localStorage.getItem('9') ?? '{}'),
    };
    let suma29 = {
      1: JSON.parse(localStorage.getItem('2.9.02') ?? '{}'),
      2: JSON.parse(localStorage.getItem('2.9.10') ?? '{}'),
      3: JSON.parse(localStorage.getItem('2.9.90') ?? '{}'),
    };
    console.log(suma24);
    let x: any = [];
    let obj: any;
    this.modeloDatosReporte.forEach((element: any) => {
      if (element.codigo === '1.1') {
        console.log(suma1[1].credito + suma1[2].credito + suma1[3].credito);
        obj = {
          codigo: '1.1',
          nombre: 'EFECTIVO',
          credito: suma1[1].credito + suma1[2].credito + suma1[3].credito,
          debito: suma1[1].debito + suma1[2].debito + suma1[3].debito,
          saldoAnterior:
            suma1[1].saldoAnterior +
            suma1[2].saldoAnterior +
            suma1[3].saldoAnterior,
          tipoDeCuenta:
            suma1[1].corriente + suma1[2].corriente + suma1[3].corriente,
          compartidoTipo:
            suma1[1].noCorriente + suma1[2].noCorriente + suma1[3].noCorriente,
          nuevoSaldo:
            suma1[1].nuevoSaldo + suma1[2].nuevoSaldo + suma1[3].nuevoSaldo,
        };
        x.push(obj);
        console.log(x);
      } else {
        if (element.codigo === '1.2' && element.tipo == 'C') {
          obj = {
            codigo: '1.2',
            nombre: 'INVERSIONES E INSTRUMENTOS DERIVADOS',
            credito:
              suma2[2].credito +
              suma2[3].credito +
              suma2[4].credito +
              suma2[5].credito,
            debito:
              suma2[2].debito +
              suma2[3].debito +
              suma2[4].debito +
              suma2[5].debito,
            saldoAnterior:
              suma2[2].saldoAnterior +
              suma2[3].saldoAnterior +
              suma2[4].saldoAnterior +
              suma2[5].saldoAnterior,
            tipoDeCuenta:
              suma2[2].corriente +
              suma2[3].corriente +
              suma2[4].corriente +
              suma2[5].corriente,
            compartidoTipo:
              suma2[2].noCorriente +
              suma2[3].noCorriente +
              suma2[4].noCorriente +
              suma2[5].noCorriente,
            nuevoSaldo:
              suma2[2].nuevoSaldo +
              suma2[3].nuevoSaldo +
              suma2[4].nuevoSaldo +
              suma2[5].nuevoSaldo,
          };
          x.push(obj);
        } else {
          if (element.codigo === '1.3') {
            obj = {
              codigo: '1.3',
              nombre: 'CUENTAS POR COBRAR',
              credito:
                suma3[1].credito +
                suma3[2].credito +
                suma3[3].credito +
                suma3[4].credito +
                suma3[5].credito +
                suma3[6].credito +
                suma3[7].credito +
                suma3[8].credito,
              debito:
                suma3[1].debito +
                suma3[2].debito +
                suma3[3].debito +
                suma3[4].debito +
                suma3[5].debito +
                suma3[6].debito +
                suma3[7].debito +
                suma3[8].debito,
              saldoAnterior:
                suma3[1].saldoAnterior +
                suma3[2].saldoAnterior +
                suma3[3].saldoAnterior +
                suma3[4].saldoAnterior +
                suma3[5].saldoAnterior +
                suma3[6].saldoAnterior +
                suma3[7].saldoAnterior +
                suma3[8].saldoAnterior,
              tipoDeCuenta:
                suma3[1].corriente +
                suma3[2].corriente +
                suma3[3].corriente +
                suma3[4].corriente +
                suma3[5].corriente +
                suma3[6].corriente +
                suma3[7].corriente +
                suma3[8].corriente,
              compartidoTipo:
                suma3[1].noCorriente +
                suma3[2].noCorriente +
                suma3[3].noCorriente +
                suma3[4].noCorriente +
                suma3[5].noCorriente +
                suma3[6].noCorriente +
                suma3[7].noCorriente +
                suma3[8].noCorriente,
              nuevoSaldo:
                suma3[1].nuevoSaldo +
                suma3[2].nuevoSaldo +
                suma3[3].nuevoSaldo +
                suma3[4].nuevoSaldo +
                suma3[5].nuevoSaldo +
                suma3[6].nuevoSaldo +
                suma3[7].nuevoSaldo +
                suma3[8].nuevoSaldo,
            };
            x.push(obj);
          } else {
            if (element.codigo === '1.5') {
              obj = {
                codigo: '1.5',
                nombre: 'INVENTARIOS',
                credito:
                  suma5[1].credito +
                  suma5[2].credito +
                  suma5[3].credito +
                  suma5[4].credito,
                debito:
                  suma5[1].debito +
                  suma5[2].debito +
                  suma5[3].debito +
                  suma5[4].debito,
                saldoAnterior:
                  suma5[1].saldoAnterior +
                  suma5[2].saldoAnterior +
                  suma5[3].saldoAnterior +
                  suma5[4].saldoAnterior,
                tipoDeCuenta:
                  suma5[1].corriente +
                  suma5[2].corriente +
                  suma5[3].corriente +
                  suma5[4].corriente,
                compartidoTipo:
                  suma5[1].noCorriente +
                  suma5[2].noCorriente +
                  suma5[3].noCorriente +
                  suma5[4].noCorriente,
                nuevoSaldo:
                  suma5[1].nuevoSaldo +
                  suma5[2].nuevoSaldo +
                  suma5[3].nuevoSaldo +
                  suma5[4].nuevoSaldo,
              };
              x.push(obj);
            } else {
              if (element.codigo === '1.9.8.7.5.7.8.9' && element.tipo == 'C') {
                obj = {
                  codigo: '1.9',
                  nombre: 'OTROS ACTIVOS',
                  credito:
                    suma9[1].credito +
                    suma9[2].credito +
                    suma9[3].credito +
                    suma9[4].credito +
                    suma9[5].credito +
                    suma9[6].credito +
                    suma9[7].credito +
                    suma9[8].credito +
                    suma9[9].credito,
                  debito:
                    suma9[1].debito +
                    suma9[2].debito +
                    suma9[3].debito +
                    suma9[4].debito +
                    suma9[5].debito +
                    suma9[6].debito +
                    suma9[7].debito +
                    suma9[8].debito +
                    suma9[9].debito,
                  saldoAnterior:
                    suma9[1].saldoAnterior +
                    suma9[2].saldoAnterior +
                    suma9[3].saldoAnterior +
                    suma9[4].saldoAnterior +
                    suma9[5].saldoAnterior +
                    suma9[6].saldoAnterior +
                    suma9[7].saldoAnterior +
                    suma9[8].saldoAnterior +
                    suma9[9].saldoAnterior,
                  tipoDeCuenta:
                    suma9[1].corriente +
                    suma9[2].corriente +
                    suma9[3].corriente +
                    suma9[4].corriente +
                    suma9[5].corriente +
                    suma9[6].corriente +
                    suma9[7].corriente +
                    suma9[8].corriente +
                    suma9[9].corriente,
                  compartidoTipo:
                    suma9[1].noCorriente +
                    suma9[2].noCorriente +
                    suma9[3].noCorriente +
                    suma9[4].noCorriente +
                    suma9[5].noCorriente +
                    suma9[6].noCorriente +
                    suma9[7].noCorriente +
                    suma9[8].noCorriente +
                    suma9[9].noCorriente,
                  nuevoSaldo:
                    suma9[1].nuevoSaldo +
                    suma9[2].nuevoSaldo +
                    suma9[3].nuevoSaldo +
                    suma9[4].nuevoSaldo +
                    suma9[5].nuevoSaldo +
                    suma9[6].nuevoSaldo +
                    suma9[7].nuevoSaldo +
                    suma9[8].nuevoSaldo +
                    suma9[9].nuevoSaldo,
                };
                x.push(obj);
              } else {
                if (element.codigo === 'subtotal1') {
                  obj = {
                    codigo: 'subtotal 1',
                    nombre: 'Sub Total ( 1 ) Activo Corriente',
                    credito:
                      sumaTOTAL1[1].credito +
                      sumaTOTAL1[2].credito +
                      sumaTOTAL1[3].credito +
                      sumaTOTAL1[5].credito +
                      sumaTOTAL1[6].credito,
                    debito:
                      sumaTOTAL1[1].debito +
                      sumaTOTAL1[2].debito +
                      sumaTOTAL1[3].debito +
                      sumaTOTAL1[5].debito +
                      sumaTOTAL1[6].debito,
                    saldoAnterior:
                      sumaTOTAL1[1].saldoAnterior +
                      sumaTOTAL1[2].saldoAnterior +
                      sumaTOTAL1[3].saldoAnterior +
                      sumaTOTAL1[5].saldoAnterior +
                      sumaTOTAL1[6].saldoAnterior,
                    tipoDeCuenta:
                      sumaTOTAL1[1].corriente +
                      sumaTOTAL1[2].corriente +
                      sumaTOTAL1[3].corriente +
                      sumaTOTAL1[5].corriente +
                      sumaTOTAL1[6].corriente,
                    compartidoTipo:
                      sumaTOTAL1[1].noCorriente +
                      sumaTOTAL1[2].noCorriente +
                      sumaTOTAL1[3].noCorriente +
                      sumaTOTAL1[5].noCorriente +
                      sumaTOTAL1[6].noCorriente,
                    nuevoSaldo:
                      sumaTOTAL1[1].nuevoSaldo +
                      sumaTOTAL1[2].nuevoSaldo +
                      sumaTOTAL1[3].nuevoSaldo +
                      sumaTOTAL1[5].nuevoSaldo +
                      sumaTOTAL1[6].nuevoSaldo,
                  };
                  x.push(obj);
                } else {
                  if (element.codigo === '1.2' && element.tipo == 'N') {
                    obj = {
                      //  codigo: '1.2',
                      //  credito: suma2N[1].credito + suma2N[2].credito + suma2N[3].credito + suma2N[4].credito,
                      //  debito: suma2N[1].debito + suma2N[2].debito + suma2N[3].debito + suma2N[4].debito,
                      //  saldoAnterior:  suma2N[1].saldoAnterior + suma2N[2].saldoAnterior + suma2N[3].saldoAnterior + suma2N[4].saldoAnterior,
                      //  tipoDeCuenta: suma2N[1].corriente + suma2N[2].corriente + suma2N[3].corriente + suma2N[4].corriente,
                      //  compartidoTipo: suma2N[1].noCorriente + suma2N[2].noCorriente + suma2N[3].noCorriente  + suma2N[4].noCorriente,
                      //  nuevoSaldo: suma2N[1].nuevoSaldo + suma2N[2].nuevoSaldo + suma2N[3].nuevoSaldo + suma2N[4].nuevoSaldo,
                      codigo: '1.2',
                      nombre: 'INVERSIONES E INSTRUMENTOS DERIVADOS',
                      credito: 0,
                      debito: 0,
                      saldoAnterior: 0,
                      tipoDeCuenta: 0,
                      compartidoTipo: 0,
                      nuevoSaldo: 0,
                    };
                    x.push(obj);
                  } else {
                    if (element.codigo === '1.6') {
                      obj = {
                        codigo: '1.6',
                        nombre: 'PROPIEDADES, PLANTA Y EQUIPO',
                        credito:
                          suma6[1].credito +
                          suma6[2].credito +
                          suma6[3].credito +
                          suma6[4].credito +
                          suma6[5].credito +
                          suma6[6].credito +
                          suma6[7].credito +
                          suma6[8].credito +
                          suma6[9].credito +
                          suma6[10].credito +
                          suma6[11].credito +
                          suma6[12].credito +
                          suma6[13].credito +
                          suma6[14].credito +
                          suma6[15].credito,
                        debito:
                          suma6[1].debito +
                          suma6[2].debito +
                          suma6[3].debito +
                          suma6[4].debito +
                          suma6[5].debito +
                          suma6[6].debito +
                          suma6[7].debito +
                          suma6[8].debito +
                          suma6[9].debito +
                          suma6[10].debito +
                          suma6[11].debito +
                          suma6[12].debito +
                          suma6[13].debito +
                          suma6[14].debito +
                          suma6[15].debito,
                        saldoAnterior:
                          suma6[1].saldoAnterior +
                          suma6[2].saldoAnterior +
                          suma6[3].saldoAnterior +
                          suma6[4].saldoAnterior +
                          suma6[5].saldoAnterior +
                          suma6[6].saldoAnterior +
                          suma6[7].saldoAnterior +
                          suma6[8].saldoAnterior +
                          suma6[9].saldoAnterior +
                          suma6[10].saldoAnterior +
                          suma6[11].saldoAnterior +
                          suma6[12].saldoAnterior +
                          suma6[13].saldoAnterior +
                          suma6[14].saldoAnterior +
                          suma6[15].saldoAnterior,
                        tipoDeCuenta:
                          suma6[1].corriente +
                          suma6[2].corriente +
                          suma6[3].corriente +
                          suma6[4].corriente +
                          suma6[5].corriente +
                          suma6[6].corriente +
                          suma6[7].corriente +
                          suma6[8].corriente +
                          suma6[9].corriente +
                          suma6[10].corriente +
                          suma6[11].corriente +
                          suma6[12].corriente +
                          suma6[13].corriente +
                          suma6[14].corriente +
                          suma6[15].corriente,
                        compartidoTipo:
                          suma6[1].noCorriente +
                          suma6[2].noCorriente +
                          suma6[3].noCorriente +
                          suma6[4].noCorriente +
                          suma6[5].noCorriente +
                          suma6[6].noCorriente +
                          suma6[7].noCorriente +
                          suma6[8].noCorriente +
                          suma6[9].noCorriente +
                          suma6[10].noCorriente +
                          suma6[11].noCorriente +
                          suma6[12].noCorriente +
                          suma6[13].noCorriente +
                          suma6[14].noCorriente +
                          suma6[15].noCorriente,
                        nuevoSaldo:
                          suma6[1].nuevoSaldo +
                          suma6[2].nuevoSaldo +
                          suma6[3].nuevoSaldo +
                          suma6[4].nuevoSaldo +
                          suma6[5].nuevoSaldo +
                          suma6[6].nuevoSaldo +
                          suma6[7].nuevoSaldo +
                          suma6[8].nuevoSaldo +
                          suma6[9].nuevoSaldo +
                          suma6[10].nuevoSaldo +
                          suma6[11].nuevoSaldo +
                          suma6[12].nuevoSaldo +
                          suma6[13].nuevoSaldo +
                          suma6[14].nuevoSaldo +
                          suma6[15].nuevoSaldo,
                      };
                      x.push(obj);
                    } else {
                      if (element.codigo === '1.9' && element.tipo == 'N') {
                        obj = {
                          // codigo: '1.9',
                          // credito: suma9N[1].credito + suma9N[2].credito ,
                          // debito: suma9N[1].debito + suma9N[2].debito ,
                          // saldoAnterior:  suma9N[1].saldoAnterior + suma9N[2].saldoAnterior,
                          // tipoDeCuenta: suma9N[1].corriente + suma9N[2].corriente,
                          // compartidoTipo: suma9N[1].noCorriente + suma9N[2].noCorriente,
                          // nuevoSaldo: suma9N[1].nuevoSaldo + suma9N[2].nuevoSaldo ,
                          codigo: '1.9',
                          nombre: 'OTROS ACTIVOS',
                          credito: 0,
                          debito: 0,
                          saldoAnterior: 0,
                          tipoDeCuenta: 0,
                          compartidoTipo: 0,
                          nuevoSaldo: 0,
                        };
                        x.push(obj);
                      } else {
                        if (element.codigo === 'subtotal2') {
                          obj = {
                            codigo: 'subtotal2',
                            nombre: 'Sub Total ( 2 ) Activo no Corriente',
                            saldoAnterior:
                              sumaTOTAL2[1].saldoAnterior +
                              sumaTOTAL2[2].saldoAnterior,
                            credito:
                              sumaTOTAL2[1].credito + sumaTOTAL2[2].credito,
                            debito: sumaTOTAL2[1].debito + sumaTOTAL2[2].debito,
                            tipoDeCuenta:
                              sumaTOTAL2[1].corriente + sumaTOTAL2[2].corriente,
                            compartidoTipo:
                              sumaTOTAL2[1].noCorriente +
                              sumaTOTAL2[2].noCorriente,
                            nuevoSaldo:
                              sumaTOTAL2[1].nuevoSaldo +
                              sumaTOTAL2[2].nuevoSaldo,
                          };
                          x.push(obj);
                        } else {
                          if (element.codigo === 'totalactivos') {
                            obj = {
                              codigo: 'totalactivos',
                              nombre: 'TOTAL ACTIVOS ',
                              saldoAnterior: sumaTOTALActivos[1].saldoAnterior,
                              credito: sumaTOTALActivos[1].credito,
                              debito: sumaTOTALActivos[1].debito,
                              tipoDeCuenta: sumaTOTALActivos[1].corriente,
                              compartidoTipo: sumaTOTALActivos[1].noCorriente,
                              nuevoSaldo: sumaTOTALActivos[1].nuevoSaldo,
                            };
                            x.push(obj);
                          } else {
                            if (element.codigo === '2.4') {
                              obj = {
                                codigo: '2.4',
                                nombre: 'CUENTAS POR PAGAR',
                                credito:
                                  suma24[1].credito +
                                  suma24[2].credito +
                                  suma24[3].credito +
                                  suma24[4].credito +
                                  suma24[5].credito +
                                  suma24[6].credito +
                                  suma24[7].credito +
                                  suma24[8].credito,
                                debito:
                                  suma24[1].debito +
                                  suma24[2].debito +
                                  suma24[3].debito +
                                  suma24[4].debito +
                                  suma24[5].debito +
                                  suma24[6].debito +
                                  suma24[7].debito +
                                  suma24[8].debito,
                                saldoAnterior:
                                  suma24[1].saldoAnterior +
                                  suma24[2].saldoAnterior +
                                  suma24[3].saldoAnterior +
                                  suma24[4].saldoAnterior +
                                  suma24[5].saldoAnterior +
                                  suma24[6].saldoAnterior +
                                  suma24[7].saldoAnterior +
                                  suma24[8].saldoAnterior,
                                tipoDeCuenta:
                                  suma24[1].corriente +
                                  suma24[2].corriente +
                                  suma24[3].corriente +
                                  suma24[4].corriente +
                                  suma24[5].corriente +
                                  suma24[6].corriente +
                                  suma24[7].corriente +
                                  suma24[8].corriente,
                                compartidoTipo:
                                  suma24[1].noCorriente +
                                  suma24[2].noCorriente +
                                  suma24[3].noCorriente +
                                  suma24[4].noCorriente +
                                  suma24[5].noCorriente +
                                  suma24[6].noCorriente +
                                  suma24[7].noCorriente +
                                  suma24[8].noCorriente,
                                nuevoSaldo:
                                  suma24[1].nuevoSaldo +
                                  suma24[2].nuevoSaldo +
                                  suma24[3].nuevoSaldo +
                                  suma24[4].nuevoSaldo +
                                  suma24[5].nuevoSaldo +
                                  suma24[6].nuevoSaldo +
                                  suma24[7].nuevoSaldo +
                                  suma24[8].nuevoSaldo,
                              };
                              x.push(obj);
                            } else {
                              if (
                                element.codigo === '2.5' &&
                                element.tipo === 'C'
                              ) {
                                obj = {
                                  codigo: '2.5',
                                  nombre:
                                    'OBLIGACIONES LABORALES Y DE SEGURIDAD SOCIAL INTEGRAL',
                                  credito:
                                    suma25[1].credito +
                                    suma25[2].credito +
                                    suma25[3].credito,
                                  saldoAnterior:
                                    suma25[1].saldoAnterior +
                                    suma25[2].saldoAnterior +
                                    suma25[3].saldoAnterior,
                                  debito:
                                    suma25[1].debito +
                                    suma25[2].debito +
                                    suma25[3].debito,
                                  tipoDeCuenta:
                                    suma25[1].corriente +
                                    suma25[2].corriente +
                                    suma25[3].corriente,
                                  compartidoTipo:
                                    suma25[1].noCorriente +
                                    suma25[2].noCorriente +
                                    suma25[3].noCorriente,
                                  nuevoSaldo:
                                    suma25[1].nuevoSaldo +
                                    suma25[2].nuevoSaldo +
                                    suma25[3].nuevoSaldo,
                                };
                                x.push(obj);
                              } else {
                                if (element.codigo === '2.9') {
                                  obj = {
                                    codigo: '2.9',
                                    nombre: 'OTROS PASIVOS',
                                    credito:
                                      suma29[1].credito +
                                      suma29[2].credito +
                                      suma29[3].credito,
                                    debito:
                                      suma29[1].debito +
                                      suma29[2].debito +
                                      suma29[3].debito,
                                    saldoAnterior:
                                      suma29[1].saldoAnterior +
                                      suma29[2].saldoAnterior +
                                      suma29[3].saldoAnterior,
                                    tipoDeCuenta:
                                      suma29[1].corriente +
                                      suma29[2].corriente +
                                      suma29[3].corriente,
                                    compartidoTipo:
                                      suma29[1].noCorriente +
                                      suma29[2].noCorriente +
                                      suma29[3].noCorriente,
                                    nuevoSaldo:
                                      suma29[1].nuevoSaldo +
                                      suma29[2].nuevoSaldo +
                                      suma29[3].nuevoSaldo,
                                  };
                                  x.push(obj);
                                } else {
                                  if (
                                    element.codigo === '2.7' &&
                                    element.tipo === 'C'
                                  ) {
                                    obj = {
                                      codigo: '2.7',
                                      nombre: 'PASIVOS ESTIMADOS',
                                      credito: suma27[1].credito,
                                      debito: suma27[1].debito,
                                      saldoAnterior: suma27[1].saldoAnterior,
                                      tipoDeCuenta: suma27[1].corriente,
                                      compartidoTipo: suma27[1].noCorriente,
                                      nuevoSaldo: suma27[1].nuevoSaldo,
                                    };
                                    x.push(obj);
                                  } else {
                                    if (
                                      element.codigo === '2.7' &&
                                      element.tipo === 'N'
                                    ) {
                                      obj = {
                                        codigo: '2.7',
                                        nombre: 'PASIVOS ESTIMADOS',
                                        credito: suma27N[1].credito,
                                        debito: suma27N[1].debito,
                                        saldoAnterior: suma27N[1].saldoAnterior,
                                        tipoDeCuenta: suma27N[1].corriente,
                                        compartidoTipo: suma27N[1].noCorriente,
                                        nuevoSaldo: suma27N[1].nuevoSaldo,
                                      };
                                      x.push(obj);
                                    } else {
                                      if (element.codigo === 'totalpasivos') {
                                        obj = {
                                          codigo: 'totalpasivos',
                                          nombre: 'TOTAL PASIVO',
                                          credito: sumaTotalPasivos[1].credito,
                                          saldoAnterior:
                                            sumaTotalPasivos[1].saldoAnterior,
                                          debito: sumaTotalPasivos[1].debito,
                                          tipoDeCuenta:
                                            sumaTotalPasivos[1].corriente,
                                          compartidoTipo:
                                            sumaTotalPasivos[1].noCorriente,
                                          nuevoSaldo:
                                            sumaTotalPasivos[1].nuevoSaldo,
                                        };
                                        x.push(obj);
                                      } else {
                                        if (
                                          element.codigo === 'totalpatrimonio'
                                        ) {
                                          obj = {
                                            codigo: 'totalpatrimonio',
                                            nombre: 'TOTAL PATRIMONIO ',
                                            credito:
                                              sumaTotalPatrimonio[2].credito +
                                              sumaTotalPatrimonio[3].credito +
                                              sumaTotalPatrimonio[4].credito +
                                              sumaTotalPatrimonio[5].credito,
                                            debito:
                                              sumaTotalPatrimonio[1].debito +
                                              sumaTotalPatrimonio[2].debito +
                                              sumaTotalPatrimonio[4].debito +
                                              sumaTotalPatrimonio[5].debito,
                                            saldoAnterior:
                                              sumaTotalPatrimonio[1]
                                                .saldoAnterior +
                                              sumaTotalPatrimonio[2]
                                                .saldoAnterior +
                                              sumaTotalPatrimonio[3]
                                                .saldoAnterior +
                                              sumaTotalPatrimonio[4]
                                                .saldoAnterior +
                                              sumaTotalPatrimonio[5]
                                                .saldoAnterior,
                                            tipoDeCuenta:
                                              sumaTotalPatrimonio[1].corriente +
                                              sumaTotalPatrimonio[2].corriente +
                                              sumaTotalPatrimonio[3].corriente +
                                              sumaTotalPatrimonio[4].corriente +
                                              sumaTotalPatrimonio[5].corriente,
                                            compartidoTipo:
                                              sumaTotalPatrimonio[1]
                                                .noCorriente +
                                              sumaTotalPatrimonio[2]
                                                .noCorriente +
                                              sumaTotalPatrimonio[3]
                                                .noCorriente +
                                              sumaTotalPatrimonio[4]
                                                .noCorriente +
                                              sumaTotalPatrimonio[5]
                                                .noCorriente,
                                            nuevoSaldo:
                                              sumaTotalPatrimonio[1]
                                                .nuevoSaldo +
                                              sumaTotalPatrimonio[2]
                                                .nuevoSaldo +
                                              sumaTotalPatrimonio[3]
                                                .nuevoSaldo +
                                              sumaTotalPatrimonio[4]
                                                .nuevoSaldo +
                                              sumaTotalPatrimonio[5].nuevoSaldo,
                                          };
                                          x.push(obj);
                                        } else {
                                          if (element.codigo === 'totalambos') {
                                            obj = {
                                              codigo: 'totalambos',
                                              nombre:
                                                'TOTAL  PASIVO Y PATRIMONIO ',
                                              credito:
                                                sumaTotalPatrimonio[4].credito +
                                                sumaTotalPatrimonio[2].credito -
                                                sumaTotalPatrimonio[3]
                                                  .nuevoSaldo +
                                                sumaTotalPatrimonioyPasivos[2]
                                                  .credito,
                                              saldoAnterior:
                                                sumaTotalPatrimonio[1]
                                                  .saldoAnterior +
                                                sumaTotalPatrimonio[2]
                                                  .saldoAnterior +
                                                sumaTotalPatrimonio[3]
                                                  .saldoAnterior +
                                                sumaTotalPatrimonio[4]
                                                  .saldoAnterior -
                                                sumaTotalPatrimonio[5]
                                                  .saldoAnterior +
                                                sumaTotalPatrimonioyPasivos[2]
                                                  .saldoAnterior,
                                              debito:
                                                sumaTotalPatrimonio[1].debito +
                                                sumaTotalPatrimonio[2].debito +
                                                sumaTotalPatrimonio[4].debito +
                                                sumaTotalPatrimonioyPasivos[2]
                                                  .debito,
                                              tipoDeCuenta:
                                                sumaTotalPatrimonio[1]
                                                  .corriente +
                                                sumaTotalPatrimonio[2]
                                                  .corriente +
                                                sumaTotalPatrimonio[3]
                                                  .corriente +
                                                sumaTotalPatrimonio[4]
                                                  .corriente -
                                                sumaTotalPatrimonio[5]
                                                  .corriente +
                                                sumaTotalPatrimonioyPasivos[2]
                                                  .corriente,
                                              compartidoTipo:
                                                sumaTotalPatrimonio[1]
                                                  .noCorriente +
                                                sumaTotalPatrimonio[2]
                                                  .noCorriente +
                                                sumaTotalPatrimonio[3]
                                                  .noCorriente +
                                                sumaTotalPatrimonio[4]
                                                  .noCorriente -
                                                sumaTotalPatrimonio[5]
                                                  .noCorriente +
                                                sumaTotalPatrimonioyPasivos[2]
                                                  .noCorriente,
                                              nuevoSaldo:
                                                sumaTotalPatrimonio[1]
                                                  .nuevoSaldo +
                                                sumaTotalPatrimonio[2]
                                                  .nuevoSaldo +
                                                sumaTotalPatrimonio[3]
                                                  .nuevoSaldo +
                                                sumaTotalPatrimonio[4]
                                                  .nuevoSaldo -
                                                sumaTotalPatrimonio[5]
                                                  .nuevoSaldo +
                                                sumaTotalPatrimonioyPasivos[2]
                                                  .nuevoSaldo,
                                            };
                                            x.push(obj);
                                          } else {
                                            if (
                                              element.codigo ===
                                              'totalochoynueve'
                                            ) {
                                              obj = {
                                                codigo: 'totalochoynueve',
                                                nombre:
                                                  'Total Cuentas de Orden',
                                                saldoAnterior:
                                                  sumaTotalochoynueve[1]
                                                    .saldoAnterior +
                                                  sumaTotalochoynueve[2]
                                                    .saldoAnterior,
                                                credito:
                                                  sumaTotalochoynueve[1]
                                                    .credito +
                                                  sumaTotalochoynueve[2]
                                                    .credito,
                                                debito:
                                                  sumaTotalochoynueve[1]
                                                    .debito +
                                                  sumaTotalochoynueve[2].debito,
                                                tipoDeCuenta:
                                                  sumaTotalochoynueve[1]
                                                    .corriente +
                                                  sumaTotalochoynueve[2]
                                                    .corriente,
                                                compartidoTipo:
                                                  sumaTotalochoynueve[1]
                                                    .noCorriente +
                                                  sumaTotalochoynueve[2]
                                                    .noCorriente,
                                                nuevoSaldo:
                                                  sumaTotalochoynueve[1]
                                                    .nuevoSaldo +
                                                  sumaTotalochoynueve[2]
                                                    .nuevoSaldo,
                                              };
                                              x.push(obj);
                                            } else {
                                              if (
                                                element.codigo === 'subtotal3'
                                              ) {
                                                obj = {
                                                  codigo: 'subtotal3',
                                                  nombre:
                                                    'Sub Total (3) Total Pasivo Corriente',
                                                  saldoAnterior:
                                                    sumacorrientePasivos[1]
                                                      .saldoAnterior +
                                                    sumacorrientePasivos[2]
                                                      .saldoAnterior +
                                                    sumacorrientePasivos[3]
                                                      .saldoAnterior +
                                                    sumacorrientePasivos[4]
                                                      .saldoAnterior,
                                                  credito:
                                                    sumacorrientePasivos[1]
                                                      .credito +
                                                    sumacorrientePasivos[2]
                                                      .credito +
                                                    sumacorrientePasivos[3]
                                                      .credito +
                                                    sumacorrientePasivos[4]
                                                      .credito,
                                                  debito:
                                                    sumacorrientePasivos[1]
                                                      .debito +
                                                    sumacorrientePasivos[2]
                                                      .debito +
                                                    sumacorrientePasivos[3]
                                                      .debito +
                                                    sumacorrientePasivos[4]
                                                      .debito,
                                                  tipoDeCuenta:
                                                    sumacorrientePasivos[1]
                                                      .corriente +
                                                    sumacorrientePasivos[2]
                                                      .corriente +
                                                    sumacorrientePasivos[3]
                                                      .corriente +
                                                    sumacorrientePasivos[4]
                                                      .corriente,
                                                  compartidoTipo:
                                                    sumacorrientePasivos[1]
                                                      .noCorriente +
                                                    sumacorrientePasivos[2]
                                                      .noCorriente +
                                                    sumacorrientePasivos[3]
                                                      .noCorriente +
                                                    sumacorrientePasivos[4]
                                                      .noCorriente,
                                                  nuevoSaldo:
                                                    sumacorrientePasivos[1]
                                                      .nuevoSaldo +
                                                    sumacorrientePasivos[2]
                                                      .nuevoSaldo +
                                                    sumacorrientePasivos[3]
                                                      .nuevoSaldo +
                                                    sumacorrientePasivos[4]
                                                      .nuevoSaldo,
                                                };
                                                x.push(obj);
                                              } else {
                                                if (
                                                  element.codigo === '1.9.51' &&
                                                  element.tipo == 'N'
                                                ) {
                                                  obj = {
                                                    codigo: '1.9.51',
                                                    nombre:
                                                      'PROPIEDADES DE INVERSION',
                                                    saldoAnterior: 0,
                                                    credito: 0,
                                                    debito: 0,
                                                    tipoDeCuenta: 0,
                                                    compartidoTipo: 0,
                                                    nuevoSaldo: 0,
                                                  };
                                                  x.push(obj);
                                                } else {
                                                  if (
                                                    element.codigo ===
                                                      '1.2.01' &&
                                                    element.tipo == 'N'
                                                  ) {
                                                    obj = {
                                                      codigo: '1.2.01',
                                                      nombre:
                                                        '	INVERSIONES ADMINISTRACIÓN DE LIQUIDEZ EN TÍTULOS DE DEUDA',
                                                      saldoAnterior: 0,
                                                      credito: 0,
                                                      debito: 0,
                                                      tipoDeCuenta: 0,
                                                      compartidoTipo: 0,
                                                      nuevoSaldo: 0,
                                                    };
                                                    x.push(obj);
                                                  } else {
                                                    if (
                                                      element.codigo ===
                                                        '1.2.21' &&
                                                      element.tipo == 'N'
                                                    ) {
                                                      obj = {
                                                        codigo: '1.2.21',
                                                        nombre:
                                                          '	INVERSIONES DE ADMINISTRACION DE LIQUIDEZ VALOR',
                                                        saldoAnterior: 0,
                                                        credito: 0,
                                                        debito: 0,
                                                        tipoDeCuenta: 0,
                                                        compartidoTipo: 0,
                                                        nuevoSaldo: 0,
                                                      };
                                                      x.push(obj);
                                                    } else {
                                                      if (
                                                        element.codigo ===
                                                          '1.2.23' &&
                                                        element.tipo == 'N'
                                                      ) {
                                                        obj = {
                                                          codigo: '1.2.23',
                                                          nombre:
                                                            '	INVERSIONES DE ADMINISTRACION DE LIQUIDEZ COSTO',
                                                          saldoAnterior: 0,
                                                          credito: 0,
                                                          debito: 0,
                                                          tipoDeCuenta: 0,
                                                          compartidoTipo: 0,
                                                          nuevoSaldo: 0,
                                                        };
                                                        x.push(obj);
                                                      } else {
                                                        if (
                                                          element.codigo ===
                                                            '1.2.80' &&
                                                          element.tipo == 'N'
                                                        ) {
                                                          obj = {
                                                            codigo: '1.2.80',
                                                            nombre:
                                                              'DETERIORO ACUMULADO DE INVERSIONES (CR)',
                                                            saldoAnterior: 0,
                                                            credito: 0,
                                                            debito: 0,
                                                            tipoDeCuenta: 0,
                                                            compartidoTipo: 0,
                                                            nuevoSaldo: 0,
                                                          };
                                                          x.push(obj);
                                                        } else {
                                                          if (
                                                            element.codigo ===
                                                              '2.5.11' &&
                                                            element.tipo == 'N'
                                                          ) {
                                                            obj = {
                                                              codigo: '2.5.11',
                                                              nombre:
                                                                '	BENEFICIOS A LOS EMPLEADOS A CORTO PLAZO',
                                                              saldoAnterior: 0,
                                                              credito: 0,
                                                              debito: 0,
                                                              tipoDeCuenta: 0,
                                                              compartidoTipo: 0,
                                                              nuevoSaldo: 0,
                                                            };
                                                            x.push(obj);
                                                          } else {
                                                            if (
                                                              element.codigo ===
                                                                '2.5.12' &&
                                                              element.tipo ==
                                                                'N'
                                                            ) {
                                                              obj = {
                                                                codigo:
                                                                  '2.5.12',
                                                                nombre:
                                                                  '	BENEFICIOS A LOS EMPLEADOS A LARGO PLAZO',
                                                                saldoAnterior: 0,
                                                                credito: 0,
                                                                debito: 0,
                                                                tipoDeCuenta: 0,
                                                                compartidoTipo: 0,
                                                                nuevoSaldo: 0,
                                                              };
                                                              x.push(obj);
                                                            } else {
                                                              if (
                                                                element.codigo ===
                                                                  '2.5.14' &&
                                                                element.tipo ==
                                                                  'N'
                                                              ) {
                                                                obj = {
                                                                  codigo:
                                                                    '2.5.14',
                                                                  nombre:
                                                                    '	BENEFICIOS POS EMPLEO PENSIONES',
                                                                  saldoAnterior: 0,
                                                                  credito: 0,
                                                                  debito: 0,
                                                                  tipoDeCuenta: 0,
                                                                  compartidoTipo: 0,
                                                                  nuevoSaldo: 0,
                                                                };
                                                                x.push(obj);
                                                              } else {
                                                                if (
                                                                  element.codigo ===
                                                                    '2.5' &&
                                                                  element.tipo ==
                                                                    'N'
                                                                ) {
                                                                  obj = {
                                                                    codigo:
                                                                      '2.5',
                                                                    nombre:
                                                                      '	OBLIGACIONES LABORALES Y DE SEGURIDAD SOCIAL INTEGRAL',
                                                                    saldoAnterior: 0,
                                                                    credito: 0,
                                                                    debito: 0,
                                                                    tipoDeCuenta: 0,
                                                                    compartidoTipo: 0,
                                                                    nuevoSaldo: 0,
                                                                  };
                                                                  x.push(obj);
                                                                } else {
                                                                  if (
                                                                    element.codigo ===
                                                                    'subtotal4'
                                                                  ) {
                                                                    obj = {
                                                                      codigo:
                                                                        'subtotal4',
                                                                      nombre:
                                                                        'Sub Total (4) Total Pasivo No Corriente',
                                                                      saldoAnterior:
                                                                        sumanoccorientesPasivos[1]
                                                                          .saldoAnterior,
                                                                      credito:
                                                                        sumanoccorientesPasivos[1]
                                                                          .credito,
                                                                      debito:
                                                                        sumanoccorientesPasivos[1]
                                                                          .debito,
                                                                      tipoDeCuenta:
                                                                        sumanoccorientesPasivos[1]
                                                                          .corriente,
                                                                      compartidoTipo:
                                                                        sumanoccorientesPasivos[1]
                                                                          .noCorriente,
                                                                      nuevoSaldo:
                                                                        sumanoccorientesPasivos[1]
                                                                          .nuevoSaldo,
                                                                    };
                                                                    x.push(obj);
                                                                  } else {
                                                                    let y =
                                                                      this.datosTabla.filter(
                                                                        (
                                                                          codigo: any
                                                                        ) =>
                                                                          codigo.codigo ==
                                                                          element.codigo.trim()
                                                                      );
                                                                    x.push(
                                                                      y[0]
                                                                    );
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        // let y = this.datosTabla.filter(
        //   (codigo: any) => codigo.codigo == element.codigo
        // );
        // x.push(y[0]);
        // console.log(x);
      }
    });
    this.datosTabla = x;
    this.prepararVistaReporte('balance');
    this.mostrarTabla = true;
    this.consultarTabla();
    this.mostrarReporteGenerado('Balance de comprobación');
  }

  exportarLibroInstitucional(): void {
    const datosReporte = this.clonarDatos(
      this.datosReporteActual.length > 0
        ? this.datosReporteActual
        : this.datosTabla
    );

    if (datosReporte.length === 0) {
      Swal.fire('Sin información', 'No hay datos para exportar.', 'info');
      return;
    }

    const libro = XLSXStyle.utils.book_new();
    libro.Props = {
      Title: 'Informe contable - Universidad Industrial de Santander',
      Subject: this.nombreReporteActual(),
      Author: 'Universidad Industrial de Santander',
      Company: 'Universidad Industrial de Santander',
      CreatedDate: new Date(),
    };

    XLSXStyle.utils.book_append_sheet(
      libro,
      this.crearHojaPortada(datosReporte.length),
      'Portada'
    );
    XLSXStyle.utils.book_append_sheet(
      libro,
      this.crearHojaResumen(datosReporte),
      'Resumen'
    );
    XLSXStyle.utils.book_append_sheet(
      libro,
      this.crearHojaContable(datosReporte, this.nombreReporteActual()),
      'Reporte'
    );

    const conCorriente = datosReporte.filter(
      (item: any) => this.valorNumerico(item.tipoDeCuenta) !== 0
    );
    const conNoCorriente = datosReporte.filter(
      (item: any) => this.valorNumerico(item.compartidoTipo) !== 0
    );
    XLSXStyle.utils.book_append_sheet(
      libro,
      this.crearHojaContable(conCorriente, 'Cuentas corrientes'),
      'Corriente'
    );
    XLSXStyle.utils.book_append_sheet(
      libro,
      this.crearHojaContable(conNoCorriente, 'Cuentas no corrientes'),
      'No corriente'
    );

    const cambios = this.obtenerCambiosChip();
    if (cambios.length > 0) {
      XLSXStyle.utils.book_append_sheet(
        libro,
        this.crearHojaCambios(cambios),
        'Cambios CHIP'
      );
    }

    if (this.tablaInicialGuardada.length > 0) {
      XLSXStyle.utils.book_append_sheet(
        libro,
        this.crearHojaContable(
          this.tablaInicialGuardada,
          'Información procesada original'
        ),
        'Información original'
      );
    }

    const fecha = new Date();
    const sello = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
    const archivo = `UIS_${this.nombreReporteActual().replace(/[^a-zA-Z0-9]+/g, '_')}_${sello}.xlsx`;
    XLSXStyle.writeFile(libro, archivo, {
      bookType: 'xlsx',
      cellStyles: true,
      compression: true,
    });

    Swal.fire({
      icon: 'success',
      title: 'Informe institucional generado',
      text: `${archivo} se descargó correctamente.`,
      confirmButtonColor: '#176b4d',
      timer: 2600,
      timerProgressBar: true,
    });
  }

  nombreReporteActual(): string {
    switch (this.reporteActivo) {
      case 'chip': return 'Reporte CHIP';
      case 'balance': return 'Balance de comprobación';
      case 'resultados': return 'Estado de resultados';
      case 'original': return 'Información procesada';
      default: return 'Informe contable';
    }
  }

  valorNumerico(valor: any): number {
    const numero = Number(String(valor ?? 0).replace(/,/g, ''));
    return Number.isFinite(numero) ? numero : 0;
  }

  crearHojaPortada(totalRegistros: number): any {
    const filas = [
      ['UNIVERSIDAD INDUSTRIAL DE SANTANDER'],
      ['INFORME CONTABLE INSTITUCIONAL'],
      [''],
      [this.nombreReporteActual()],
      [''],
      ['Fecha de generación', new Date().toLocaleString('es-CO')],
      ['Registros incluidos', totalRegistros],
      ['Estado', 'Generado correctamente'],
      [''],
      ['Documento generado por la Herramienta de Procesamiento Contable UIS'],
    ];
    const hoja: any = XLSXStyle.utils.aoa_to_sheet(filas);
    hoja['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: 7 } },
      { s: { r: 9, c: 0 }, e: { r: 9, c: 7 } },
    ];
    hoja['!cols'] = [{ wch: 28 }, { wch: 28 }, ...Array(6).fill({ wch: 14 })];
    hoja['!rows'] = [{ hpt: 42 }, { hpt: 30 }, { hpt: 16 }, { hpt: 34 }];
    const titulo = hoja['A1'];
    titulo.s = {
      fill: { patternType: 'solid', fgColor: { rgb: '146B45' } },
      font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 22 },
      alignment: { horizontal: 'center', vertical: 'center' },
    };
    hoja['A2'].s = {
      fill: { patternType: 'solid', fgColor: { rgb: 'E5F2EB' } },
      font: { bold: true, color: { rgb: '174A35' }, sz: 14 },
      alignment: { horizontal: 'center', vertical: 'center' },
    };
    hoja['A4'].s = {
      font: { bold: true, color: { rgb: '174A35' }, sz: 18 },
      alignment: { horizontal: 'center', vertical: 'center' },
    };
    ['A6', 'A7', 'A8'].forEach((ref) => hoja[ref].s = {
      font: { bold: true, color: { rgb: '486457' } },
      fill: { patternType: 'solid', fgColor: { rgb: 'F1F6F3' } },
    });
    hoja['A10'].s = {
      font: { italic: true, color: { rgb: '6C7D74' }, sz: 10 },
      alignment: { horizontal: 'center' },
    };
    return hoja;
  }

  crearHojaResumen(datos: any[]): any {
    const sumar = (campo: string) => datos.reduce(
      (total: number, item: any) => total + this.valorNumerico(item[campo]), 0
    );
    const filas = [
      ['UNIVERSIDAD INDUSTRIAL DE SANTANDER'],
      ['Resumen ejecutivo', this.nombreReporteActual()],
      [''],
      ['Indicador', 'Valor'],
      ['Total de cuentas', datos.length],
      ['Saldo anterior', sumar('saldoAnterior')],
      ['Débitos', sumar('debito')],
      ['Créditos', sumar('credito')],
      ['Saldo actual', sumar('nuevoSaldo')],
      ['Total corriente', sumar('tipoDeCuenta')],
      ['Total no corriente', sumar('compartidoTipo')],
      ['Cuentas con saldo corriente', datos.filter((x: any) => this.valorNumerico(x.tipoDeCuenta) !== 0).length],
      ['Cuentas con saldo no corriente', datos.filter((x: any) => this.valorNumerico(x.compartidoTipo) !== 0).length],
    ];
    const hoja: any = XLSXStyle.utils.aoa_to_sheet(filas);
    hoja['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }];
    hoja['!cols'] = [{ wch: 38 }, { wch: 28 }, { wch: 15 }, { wch: 15 }];
    hoja['A1'].s = this.estiloTituloInstitucional();
    ['A4', 'B4'].forEach((ref) => hoja[ref].s = this.estiloEncabezado());
    for (let fila = 4; fila < filas.length; fila++) {
      const valor = hoja[XLSXStyle.utils.encode_cell({ r: fila, c: 1 })];
      if (valor && typeof valor.v === 'number' && fila >= 5 && fila <= 10) {
        valor.z = '#,##0.00;[Red](#,##0.00);-';
        valor.s = this.estiloCeldaNumerica(fila);
      }
    }
    return hoja;
  }

  crearHojaContable(datos: any[], titulo: string): any {
    const encabezados = ['Código', 'Nombre de la cuenta', 'Saldo anterior', 'Débito', 'Crédito', 'Saldo actual', 'Tipo anterior', 'Tipo actual', 'Corriente', 'No corriente'];
    const filas = datos.map((item: any) => [
      String(item.codigo ?? ''),
      String(item.nombre ?? ''),
      this.valorNumerico(item.saldoAnterior),
      this.valorNumerico(item.debito),
      this.valorNumerico(item.credito),
      this.valorNumerico(item.nuevoSaldo),
      item.tipoSaldoAnterior ?? '',
      item.tipoSaldoNuevo ?? '',
      this.valorNumerico(item.tipoDeCuenta),
      this.valorNumerico(item.compartidoTipo),
    ]);
    const contenido = [
      ['UNIVERSIDAD INDUSTRIAL DE SANTANDER'],
      [titulo],
      [`Generado: ${new Date().toLocaleString('es-CO')}`],
      [''],
      encabezados,
      ...filas,
    ];
    const hoja: any = XLSXStyle.utils.aoa_to_sheet(contenido);
    hoja['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 9 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 9 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 9 } },
    ];
    hoja['!cols'] = [{ wch: 18 }, { wch: 48 }, ...Array(4).fill({ wch: 21 }), { wch: 16 }, { wch: 16 }, { wch: 21 }, { wch: 21 }];
    hoja['!rows'] = contenido.map((_x: any, i: number) => ({ hpt: i === 0 ? 30 : i === 4 ? 28 : 20 }));
    hoja['!autofilter'] = { ref: `A5:J${contenido.length}` };
    hoja['!freeze'] = { xSplit: 0, ySplit: 5, topLeftCell: 'A6' };
    hoja['A1'].s = this.estiloTituloInstitucional();
    hoja['A2'].s = { font: { bold: true, color: { rgb: '174A35' }, sz: 15 }, alignment: { horizontal: 'center' } };
    hoja['A3'].s = { font: { italic: true, color: { rgb: '718078' }, sz: 9 }, alignment: { horizontal: 'center' } };
    for (let col = 0; col < encabezados.length; col++) {
      hoja[XLSXStyle.utils.encode_cell({ r: 4, c: col })].s = this.estiloEncabezado();
    }
    for (let fila = 5; fila < contenido.length; fila++) {
      const codigo = String(contenido[fila][0]);
      const nivel = Math.max(0, codigo.split('.').length - 1);
      const esPadre = nivel <= 2;
      for (let col = 0; col < encabezados.length; col++) {
        const celda = hoja[XLSXStyle.utils.encode_cell({ r: fila, c: col })];
        if (!celda) continue;
        celda.s = {
          fill: { patternType: 'solid', fgColor: { rgb: esPadre ? 'E3F0E9' : fila % 2 === 0 ? 'F6F9F7' : 'FFFFFF' } },
          font: { bold: esPadre, color: { rgb: esPadre ? '174A35' : '283B32' }, sz: 10 },
          alignment: { vertical: 'center', horizontal: [2,3,4,5,8,9].includes(col) ? 'right' : 'left', indent: col === 1 ? Math.min(nivel, 5) : 0 },
          border: { bottom: { style: 'thin', color: { rgb: 'DCE6E0' } } },
        };
        if ([2,3,4,5,8,9].includes(col)) {
          celda.z = '#,##0.00;[Red](#,##0.00);-';
          celda.s.numFmt = '#,##0.00;[Red](#,##0.00);-';
        }
      }
    }
    return hoja;
  }

  obtenerCambiosChip(): any[] {
    if (this.reporteChipGuardado.length === 0 || this.tablaInicialGuardada.length === 0) return [];
    return this.reporteChipGuardado.reduce((cambios: any[], actual: any) => {
      const original = this.tablaInicialGuardada.find(
        (item: any) => String(item.codigo).trim() === String(actual.codigo).trim()
      );
      if (!original) return cambios;
      const corrienteAntes = this.valorNumerico(original.tipoDeCuenta);
      const corrienteAhora = this.valorNumerico(actual.tipoDeCuenta);
      const noCorrienteAntes = this.valorNumerico(original.compartidoTipo);
      const noCorrienteAhora = this.valorNumerico(actual.compartidoTipo);
      if (corrienteAntes !== corrienteAhora || noCorrienteAntes !== noCorrienteAhora) {
        cambios.push([actual.codigo, actual.nombre, corrienteAntes, corrienteAhora, corrienteAhora - corrienteAntes, noCorrienteAntes, noCorrienteAhora, noCorrienteAhora - noCorrienteAntes]);
      }
      return cambios;
    }, []);
  }

  crearHojaCambios(cambios: any[]): any {
    const contenido = [
      ['UNIVERSIDAD INDUSTRIAL DE SANTANDER'],
      ['Trazabilidad de modificaciones - Reporte CHIP'],
      [''],
      ['Código', 'Cuenta', 'Corriente original', 'Corriente modificada', 'Diferencia corriente', 'No corriente original', 'No corriente modificada', 'Diferencia no corriente'],
      ...cambios,
    ];
    const hoja: any = XLSXStyle.utils.aoa_to_sheet(contenido);
    hoja['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }, { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } }];
    hoja['!cols'] = [{ wch: 18 }, { wch: 45 }, ...Array(6).fill({ wch: 22 })];
    hoja['!autofilter'] = { ref: `A4:H${contenido.length}` };
    hoja['A1'].s = this.estiloTituloInstitucional();
    for (let col = 0; col < 8; col++) hoja[XLSXStyle.utils.encode_cell({ r: 3, c: col })].s = this.estiloEncabezado();
    for (let fila = 4; fila < contenido.length; fila++) {
      for (let col = 0; col < 8; col++) {
        const celda = hoja[XLSXStyle.utils.encode_cell({ r: fila, c: col })];
        if (!celda) continue;
        celda.s = col >= 2 ? this.estiloCeldaNumerica(fila) : { border: { bottom: { style: 'thin', color: { rgb: 'DCE6E0' } } } };
        if (col >= 2) celda.z = '#,##0.00;[Red](#,##0.00);-';
      }
    }
    return hoja;
  }

  estiloTituloInstitucional(): any {
    return {
      fill: { patternType: 'solid', fgColor: { rgb: '146B45' } },
      font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 16 },
      alignment: { horizontal: 'center', vertical: 'center' },
    };
  }

  estiloEncabezado(): any {
    return {
      fill: { patternType: 'solid', fgColor: { rgb: '1B5E46' } },
      font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 10 },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      border: { bottom: { style: 'medium', color: { rgb: 'D5A928' } } },
    };
  }

  estiloCeldaNumerica(fila: number): any {
    return {
      fill: { patternType: 'solid', fgColor: { rgb: fila % 2 === 0 ? 'F2F7F4' : 'FFFFFF' } },
      font: { color: { rgb: '283B32' }, sz: 10 },
      alignment: { horizontal: 'right', vertical: 'center' },
      border: { bottom: { style: 'thin', color: { rgb: 'DCE6E0' } } },
      numFmt: '#,##0.00;[Red](#,##0.00);-',
    };
  }

  generarReporteSecundario() {
    this.mostrarTabla = false;
    this.asegurarTablaInicial();
    this.datosTabla = this.clonarDatos(this.tablaInicialGuardada);
    let x: any = [];
    this.modeloDatosReporte2.forEach((element) => {
      let y = this.datosTabla.filter(
        (codigo: any) => codigo.codigo == element.CODIGO.trim()
      );
      x.push(y[0]);
    });
    console.log(x);
    this.datosTabla = x;
    this.prepararVistaReporte('resultados');
    this.mostrarTabla = true;
    this.consultarTabla();
    this.mostrarReporteGenerado('Resultados');
  }

  generarReporteChip() {
    this.mostrarTabla = false;
    this.asegurarTablaInicial();
    const chipPersistido = this.reporteChipGuardado.length > 0
      ? this.reporteChipGuardado
      : this.tablaInicialGuardada;
    this.datosTabla = this.clonarDatos(chipPersistido);
    let x: any = [];
    this.modeloReporteChip.forEach((element) => {
      let y = this.datosTabla.filter(
        (codigo: any) => codigo.codigo == element.codigo.trim()
      );
      x.push(y[0]);
    });
    console.log(x);
    this.datosTabla = x;
    this.prepararVistaReporte('chip');
    this.mostrarTabla = true;
    this.consultarTabla();
    this.mostrarReporteGenerado('Reporte CHIP');
  }

  mostrarReporteGenerado(nombreReporte: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Reporte generado',
      text: `${nombreReporte} se generó correctamente.`,
      confirmButtonText: 'Ver reporte',
      confirmButtonColor: '#177447',
      timer: 2600,
      timerProgressBar: true,
    });
  }

  asegurarTablaInicial(): void {
    if (this.tablaInicialGuardada.length === 0) {
      this.tablaInicialGuardada = this.clonarDatos(this.datosTabla);
    }
  }

  clonarDatos(datos: any[]): any[] {
    return JSON.parse(JSON.stringify(datos || []));
  }

  mostrarInformacionOriginal(): void {
    if (this.tablaInicialGuardada.length === 0) {
      return;
    }
    this.datosTabla = this.clonarDatos(this.tablaInicialGuardada);
    this.prepararVistaReporte('original');
    this.mostrarTabla = true;
    this.consultarTabla();
  }

  prepararVistaReporte(tipo: 'balance' | 'chip' | 'resultados' | 'original'): void {
    this.reporteActivo = tipo;
    this.currentPage = 1;
    this.pageSize = 100;
    this.selectAll = false;
    this.seleccionados = [];
    this.seleccionadosNewTable = [];
    this.datosTabla = this.datosTabla.filter((item: any) => !!item);
    this.datosTabla.forEach((item: any) => (item.tipo = false));
    this.datosReporteActual = this.datosTabla;

    const columnasSinSeleccion = this.displayedColumns.filter(
      (columna: string) => columna !== 'tipo'
    );
    this.displayedColumns = tipo === 'chip'
      ? ['tipo', ...columnasSinSeleccion]
      : columnasSinSeleccion;
  }
  secuenciaDecodigosNuevos() {}
  applyFilter(event: any) {
    const value = (event.target as HTMLInputElement).value;
    this.filterSubject.next(value);
  }
  onSort(event: any) {
    this.datosTabla.sort((a: any, b: any) => {
      const isAsc = event.direction === 'asc';
      switch (
        event.active
        // case 'completed':
        //   return isAsc
        //     ? Number(a.completed) - Number(b.completed)
        //     : Number(b.completed) - Number(a.completed);
        // default:
        // return 0;
      ) {
      }
    });
    this.dataTareasPaginated = this.datosTabla.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
  }
  seleccionadosTabla(row: any) {
    if (this.baseInformes) {
      if (!this.puedeEditarDistribucion(row)) {
        return;
      }
      if (this.seleccionadosNewTable.includes(row)) {
        // Si el row ya está en la lista de seleccionados, lo eliminamos
        this.seleccionadosNewTable = this.seleccionadosNewTable.filter(
          (selectedRow: any) => selectedRow !== row
        );
      } else {
        // Si el row no está en la lista de seleccionados, lo agregamos
        this.seleccionadosNewTable.push(row);
      }
      return;
    }
    if (this.seleccionados.includes(row)) {
      // Si el row ya está en la lista de seleccionados, lo eliminamos
      this.seleccionados = this.seleccionados.filter(
        (selectedRow: any) => selectedRow !== row
      );
    } else {
      // Si el row no está en la lista de seleccionados, lo agregamos
      this.seleccionados.push(row);
    }
  }

  puedeEditarDistribucion(row: any): boolean {
    return !!row &&
      String(row.codigo || '').trim().length === 9 &&
      Number(row.tipoDeCuenta) !== 0 &&
      Number(row.compartidoTipo) !== 0;
  }

  openDialogAjusteReporte() {
    const dialogRef = this.dialog.open(ModalTablaComponent, {
      panelClass: ['my-custom-dialog', 'account-adjustment-dialog'],
      width: 'min(920px, 94vw)',
      maxWidth: '94vw',
      maxHeight: '88vh',
      data: {
        tipo: 'ajustarCorrienteNoCorriente',
        data: this.seleccionadosNewTable,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) {
        return;
      }

      result.forEach((ajuste: any) => {
        const cuenta = this.datosTabla.find(
          (item: any) => item.codigo.trim() === ajuste.codigo.trim()
        );
        if (cuenta) {
          cuenta.tipoDeCuenta = Number(ajuste.tipoDeCuenta) || 0;
          cuenta.compartidoTipo = Number(ajuste.compartidoTipo) || 0;
        }
      });

      this.seleccionadosNewTable = [];
      this.selectAll = false;
      this.datosTabla.forEach((item: any) => (item.tipo = false));
      // Preparación original: recalcular desde las cuentas de este nivel
      // para que el modelo vuelva a sumar corriente y no corriente hacia arriba.
      this.datosTabla = this.datosTabla.filter(
        (item: any) => String(item.codigo || '').trim().length === 9
      );
      this.contadormodelo = 18;
      this.ejecucion = 0;
      this.ejecutarModeloDeResumidosReporte(this.contadormodelo);
      this.datosReporteActual = this.datosTabla;
      this.reporteChipGuardado = this.clonarDatos(this.datosTabla);
      localStorage.setItem(
        'reporteChipModificado',
        JSON.stringify(this.reporteChipGuardado)
      );
    });
  }

  openDialogAfter() {
    const dialogRef = this.dialog.open(ModalTablaComponent, {
      panelClass: 'my-custom-dialog',
      data: {
        tipo: 'despues',
        data: this.seleccionadosNewTable,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        let objetosCambiadosCompartidos: any = [];
        this.datosTabla.filter((objeto: any) => {
          if (result.some((resObj: any) => resObj.codigo === objeto.codigo)) {
            const codigoArray = objeto.codigo.split('.');
            if (
              codigoArray[0] === '1' ||
              codigoArray[0] === '5' ||
              codigoArray[0] === '6' ||
              codigoArray[0] === '7' ||
              codigoArray[0] === '8'
            ) {
              objeto.nuevoSaldoDespues = objeto.nuevoSaldo;
              objeto.nuevoSaldo =
                (objeto.saldoAnterior ? Math.round(objeto.saldoAnterior) : 0) +
                (objeto.debito ? Math.round(objeto.debito) : 0) -
                (objeto.credito ? Math.round(objeto.credito) : 0);
              if (objeto.tipoDeCuenta !== 0 && objeto.compartidoTipo !== 0) {
                if (objetosCambiadosCompartidos.includes(objeto)) {
                  // Si el row ya está en la lista de seleccionados, lo eliminamos
                  objetosCambiadosCompartidos =
                    objetosCambiadosCompartidos.filter(
                      (selectedRow: any) => selectedRow !== objeto
                    );
                } else {
                  // Si el row no está en la lista de seleccionados, lo agregamos
                  objetosCambiadosCompartidos.push(objeto);
                }
              }
              if (objeto.tipoDeCuenta === 0) {
                objeto.compartidoTipo = objeto.nuevoSaldo;
              } else {
                if (objeto.tipoDeCuenta !== 0 && objeto.compartidoTipo !== 0) {
                  return;
                }
                objeto.tipoDeCuenta = objeto.nuevoSaldo;
              }
            } else {
              objeto.nuevoSaldoDespues = objeto.nuevoSaldo;
              objeto.nuevoSaldo =
                (objeto.saldoAnterior ? Math.round(objeto.saldoAnterior) : 0) +
                (objeto.credito ? Math.round(objeto.credito) : 0) -
                (objeto.debito ? Math.round(objeto.debito) : 0);
              if (objeto.tipoDeCuenta !== 0 && objeto.compartidoTipo !== 0) {
                if (objetosCambiadosCompartidos.includes(objeto)) {
                  // Si el row ya está en la lista de seleccionados, lo eliminamos
                  objetosCambiadosCompartidos =
                    objetosCambiadosCompartidos.filter(
                      (selectedRow: any) => selectedRow !== objeto
                    );
                } else {
                  // Si el row no está en la lista de seleccionados, lo agregamos
                  objetosCambiadosCompartidos.push(objeto);
                }
              }
              if (objeto.tipoDeCuenta === 0) {
                objeto.compartidoTipo = objeto.nuevoSaldo;
              } else {
                if (objeto.tipoDeCuenta !== 0 && objeto.compartidoTipo !== 0) {
                  return;
                }
                objeto.tipoDeCuenta = objeto.nuevoSaldo;
              }
            }
          }
        });
        if (objetosCambiadosCompartidos.length > 0) {
          const dialogRef = this.dialog.open(ModalTablaComponent, {
            panelClass: 'my-custom-dialog',
            data: {
              tipo: 'compartidoCuenta',
              data: objetosCambiadosCompartidos,
            },
          });
          dialogRef.afterClosed().subscribe((result: any) => {
            if (result) {
              result.forEach((obj: any, index: any) => {
                console.log(obj);
                const objetoNuevo = this.datosTabla.map((nuevo: any) =>
                  nuevo.codigo.trim() === obj.codigo.trim() ? obj : nuevo
                );
              });
              console.log(this.datosTabla);
              const filteredArray = this.datosTabla.filter(
                (item: any) => item.codigo.length === 9
              );
              this.datosTabla = filteredArray;
              console.log(this.datosTabla);
              this.contadormodelo = 18;
              this.ejecucion = 0;
              this.ejecutarModeloDeResumidosReporte(this.contadormodelo);
            }
          });
        } else {
          const filteredArray = this.datosTabla.filter(
            (item: any) => item.codigo.length === 9
          );
          this.datosTabla = filteredArray;
          this.contadormodelo = 18;
          this.ejecucion = 0;
          this.ejecutarModeloDeResumidosReporte(this.contadormodelo);
        }

        // this.baseInformes = this.datosTabla;
        // this.datosTabla334 = this.datosTabla;
        // console.log(this.datosTabla);
      }
    });
  }
  onPageChange(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.dataTareasPaginated = this.datosTabla.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
  }
  openDialog() {
    const dialogRef = this.dialog.open(ModalTablaComponent, {
      panelClass: 'my-custom-dialog',
      data: null,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log(result);
        for (const selectedRow of this.seleccionados) {
          const index = this.datosTabla.findIndex(
            (row: any) => row.codigo === selectedRow.codigo
          );
          if (index !== -1) {
            const row = this.datosTabla[index];
            row.tipoDeCuenta = result.cuentaCorriente === 'si';
            row.compartidoTipo = result.cuentaCorrienteNoCorriente === 'si';
            this.datosTabla[index] = row;
          }
        }
        localStorage.setItem('datosTabla', JSON.stringify(this.datosTabla));
      }
    });
  }

  ejecutarModeloDeResumidosReporte(contadorValor: any) {
    this.datosTabla = this.eliminarComas(this.datosTabla);
    const busqueda = this.datosTabla.reduce((acc: any, codigo: any) => {
      acc[codigo.codigo.trim().slice(0, contadorValor)] =
        ++acc[codigo.codigo.trim().slice(0, contadorValor)] || 0;
      return acc;
    }, {});
    const duplicados = this.datosTabla.filter((codigo: any) => {
      return busqueda[codigo.codigo.trim().slice(0, contadorValor)];
    });
    let unicos: any = [];
    for (var i = 0; i < duplicados.length; i++) {
      const elemento = duplicados[i].codigo.trim().slice(0, contadorValor);
      if (
        !unicos.includes(duplicados[i].codigo.trim().slice(0, contadorValor))
      ) {
        unicos.push(elemento);
        this.unicosmodelo = unicos;
      }
    }
    if (contadorValor == 0) {
      console.log(localStorage.getItem('1'));
    } else {
      let x = unicos.filter((element: any) => element.length == contadorValor);
      unicos = x;
      this.unicosmodelo = x;
    }
    let arreglosDuplicados: any = [];
    if (unicos) {
      console.log(unicos);
      if (contadorValor === 6) {
        unicos.push(
          '1.2.23',
          '1.2.16',
          '1.2.80',
          '1.3.19',
          '1.3.22',
          '1.3.37',
          '1.5.05',
          '1.5.30',
          '1.6.45',
          '1.6.55',
          '1.6.75',
          '1.6.95',
          '1.7.10',
          '1.9.02',
          '1.9.06',
          '1.9.09',
          '1.9.52',
          '1.9.86',
          '1.9.26',
          '2.4.01',
          '2.4.60',
          '2.4.81',
          '2.9.02',
          '2.9.90'
        );
      }

      unicos.forEach((element: any) => {
        const arreglosSeparados = this.datosTabla.filter(
          (campo: any) =>
            campo.codigo.trim().slice(0, contadorValor) == element.trim()
        );
        arreglosDuplicados.push(arreglosSeparados);
      });
      let element1;
      let element2;
      for (let index = 0; index < arreglosDuplicados.length; index++) {
        element1 = arreglosDuplicados[index].length;
        element2 = arreglosDuplicados[index];
        let x = 0;
        let y = 0;
        let w = 0;
        let p = 0;
        let n = 0;
        let c = 0;
        for (let i = 0; i < element1; i++) {
          const element = element2[i];
          // REVISARRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
          if (p == 0) {
            if (element.saldoAnterior == undefined) {
              p = 0;
            } else {
              p = p + Math.round(element.saldoAnterior);
            }
            localStorage.setItem(
              element.codigo.trim().slice(0, contadorValor),
              JSON.stringify({
                codigo: element.codigo.trim().slice(0, contadorValor),
                credito: y,
                nuevoSaldo: x,
                debito: w,
                saldoAnterior: p,
                corriente: c,
                noCorriente: n,
              })
            );
          } else {
            if (
              element.saldoAnterior == undefined ||
              element.saldoAnterior == null
            ) {
              if (element.codigo.trim().slice(0, contadorValor) === '1.2.23') {
                console.log(element);
              }
              p = p + 0;
            } else {
              p = p + Math.round(element.saldoAnterior);

              localStorage.setItem(
                element.codigo.trim().slice(0, contadorValor),
                JSON.stringify({
                  codigo: element.codigo.trim().slice(0, contadorValor),
                  credito: y,
                  nuevoSaldo: x,
                  debito: w,
                  saldoAnterior: p,
                  corriente: c,
                  noCorriente: n,
                })
              );
            }
          }
          if (w == 0) {
            if (element.debito == undefined) {
              w = 0;
            } else {
              const debitoNumero = parseFloat(element.debito); // convierte a número decimal
              w = w + Math.round(debitoNumero);
            }
            localStorage.setItem(
              element.codigo.trim().slice(0, contadorValor),
              JSON.stringify({
                codigo: element.codigo.trim().slice(0, contadorValor),
                credito: y,
                nuevoSaldo: x,
                debito: w,
                saldoAnterior: p,
                corriente: c,
                noCorriente: n,
              })
            );
          } else {
            if (element.debito == undefined || element.debito == null) {
              w = w + 0;
            } else {
              const debitoNumero = parseFloat(element.debito); // convierte a número decimal
              w = w + Math.round(debitoNumero);

              localStorage.setItem(
                element.codigo.trim().slice(0, contadorValor),
                JSON.stringify({
                  codigo: element.codigo.trim().slice(0, contadorValor),
                  credito: y,
                  nuevoSaldo: x,
                  debito: w,
                  saldoAnterior: p,
                  corriente: c,
                  noCorriente: n,
                })
              );
            }
          }
          if (c == 0) {
            if (element.tipoDeCuenta == undefined) {
              c = 0;
            } else {
              c = c + Math.round(element.tipoDeCuenta);
            }
            localStorage.setItem(
              element.codigo.trim().slice(0, contadorValor),
              JSON.stringify({
                codigo: element.codigo.trim().slice(0, contadorValor),
                credito: y,
                nuevoSaldo: x,
                debito: w,
                saldoAnterior: p,
                corriente: c,
                noCorriente: n,
              })
            );
          } else {
            if (
              element.tipoDeCuenta == undefined ||
              element.tipoDeCuenta == null
            ) {
              c = c + 0;
            } else {
              c = c + Math.round(element.tipoDeCuenta);

              localStorage.setItem(
                element.codigo.trim().slice(0, contadorValor),
                JSON.stringify({
                  codigo: element.codigo.trim().slice(0, contadorValor),
                  credito: y,
                  nuevoSaldo: x,
                  debito: w,
                  saldoAnterior: p,
                  corriente: c,
                  noCorriente: n,
                })
              );
            }
          }
          if (x == 0) {
            if (element.nuevoSaldo == undefined) {
              x = 0;
            } else {
              x = x + Math.round(element.nuevoSaldo);
            }
            localStorage.setItem(
              element.codigo.trim().slice(0, contadorValor),
              JSON.stringify({
                codigo: element.codigo.trim().slice(0, contadorValor),
                credito: y,
                nuevoSaldo: x,
                debito: w,
                saldoAnterior: p,
                corriente: c,
                noCorriente: n,
              })
            );
          } else {
            if (element.nuevoSaldo == undefined || element.nuevoSaldo == null) {
              x = x + 0;
            } else {
              x = x + Math.round(element.nuevoSaldo);

              // x = x + element.nuevoSaldo;
              localStorage.setItem(
                element.codigo.trim().slice(0, contadorValor),
                JSON.stringify({
                  codigo: element.codigo.trim().slice(0, contadorValor),
                  credito: y,
                  nuevoSaldo: x,
                  debito: w,
                  saldoAnterior: p,
                  corriente: c,
                  noCorriente: n,
                })
              );
            }
          }
          if (n == 0) {
            if (element.compartidoTipo == undefined) {
              n = 0;
            } else {
              n = n + Math.round(element.compartidoTipo);
            }
            localStorage.setItem(
              element.codigo.trim().slice(0, contadorValor),
              JSON.stringify({
                codigo: element.codigo.trim().slice(0, contadorValor),
                credito: y,
                nuevoSaldo: x,
                debito: w,
                saldoAnterior: p,
                corriente: c,
                noCorriente: n,
              })
            );
          } else {
            if (
              element.compartidoTipo == undefined ||
              element.compartidoTipo == null
            ) {
              n = n + 0;
            } else {
              n = n + Math.round(element.compartidoTipo);

              localStorage.setItem(
                element.codigo.trim().slice(0, contadorValor),
                JSON.stringify({
                  codigo: element.codigo.trim().slice(0, contadorValor),
                  credito: y,
                  nuevoSaldo: x,
                  debito: w,
                  saldoAnterior: p,
                  corriente: c,
                  noCorriente: n,
                })
              );
            }
          }
          if (y == 0) {
            if (element.credito == undefined) {
              y = 0;
            } else {
              const credito = parseFloat(element.credito); // convierte a número decimal
              y = y + Math.round(credito);
            }
            localStorage.setItem(
              element.codigo.trim().slice(0, contadorValor),
              JSON.stringify({
                codigo: element.codigo.trim().slice(0, contadorValor),
                credito: y,
                nuevoSaldo: x,
                debito: w,
                saldoAnterior: p,
                corriente: c,
                noCorriente: n,
              })
            );
          } else {
            if (element.credito == undefined || element.credito == null) {
              y = y + 0;
            } else {
              const credito = parseFloat(element.credito); // convierte a número decimal
              y = y + Math.round(credito);
              localStorage.setItem(
                element.codigo.trim().slice(0, contadorValor),
                JSON.stringify({
                  codigo: element.codigo.trim().slice(0, contadorValor),
                  credito: y,
                  nuevoSaldo: x,
                  debito: w,
                  saldoAnterior: p,
                  corriente: c,
                  noCorriente: n,
                })
              );
            }
          }
        }
      }
      // this.callback(contadorValor)
      this.extrayendoDuplicadosSumadosMODELOReporte(contadorValor);
    }
  }

  extrayendoDuplicadosSumadosMODELOReporte(contadorValor: any) {
    let arraydeDuplicados: any = [];
    this.unicosmodelo.forEach((element: any) => {
      let x: any = localStorage.getItem(element);
      x = JSON.parse(x);
      arraydeDuplicados = [...arraydeDuplicados, x];
      localStorage.setItem(
        'duplicadosIngresos',
        JSON.stringify(arraydeDuplicados)
      );
    });
    console.log(arraydeDuplicados);
    for (let index = 0; index < arraydeDuplicados.length; index++) {
      console.log(arraydeDuplicados[index]);
      let x = this.modeloDeDatosSistemaContaduria.filter(
        (element: any) =>
          element.codigo.trim() == arraydeDuplicados[index].codigo
      );
      x.forEach((element: any) => {
        element.credito = arraydeDuplicados[index].credito;
        element.debito = arraydeDuplicados[index].debito;
        element.saldoAnterior = arraydeDuplicados[index].saldoAnterior;
        element.tipoDeCuenta = arraydeDuplicados[index].corriente;
        element.compartidoTipo = arraydeDuplicados[index].noCorriente;
        element.nuevoSaldo = arraydeDuplicados[index].nuevoSaldo;
        this.elementosUnificados = this.modeloDeDatosSistemaContaduria.map(
          (element1: any) =>
            element1.codigo == element.codigo ? element : element1
        );
      });
    }
    this.elementosUnificados.forEach((element: any) => {
      element.codigo = element.codigo.trim();
    });
    this.datosTabla.forEach((element: any) => {
      element.codigo = element.codigo.trim();
    });
    if (contadorValor == 0) {
      this.modeloDeDatosSistemaContaduria.forEach((element: any) => {
        let x = this.datosTabla.filter(
          (element1: any) => element1.codigo !== element.codigo.trim()
        );
        this.datosTabla = this.datosTabla.filter(
          (element1: any) => element1.codigo != element.codigo.trim()
        );
      });
      const mergedArray = this.datosTabla.concat(this.elementosUnificados);
      mergedArray.sort((a: any, b: any) => {
        const aCodeArray: any = a.codigo.split('.');
        const bCodeArray: any = b.codigo.split('.');

        const maxLength = Math.max(aCodeArray.length, bCodeArray.length);
        for (let i = 0; i < maxLength; i++) {
          const aCodePart = parseInt(aCodeArray[i]) || 0;
          const bCodePart = parseInt(bCodeArray[i]) || 0;

          if (aCodePart !== bCodePart) {
            return aCodePart - bCodePart;
          }
        }

        if (aCodeArray.length < bCodeArray.length) {
          return -1; // a viene antes que b
        } else if (aCodeArray.length > bCodeArray.length) {
          return 1;
        } else {
          return 0;
        }
      });
      mergedArray.filter((objeto: any) => {
        const codigoArray = objeto.codigo.split('.');
        if (
          codigoArray[0] === '1' ||
          codigoArray[0] === '5' ||
          codigoArray[0] === '6' ||
          codigoArray[0] === '7' ||
          codigoArray[0] === '8'
        ) {
          objeto.nuevoSaldo =
            (objeto.saldoAnterior ? Math.round(objeto.saldoAnterior) : 0) +
            (objeto.debito ? Math.round(objeto.debito) : 0) -
            (objeto.credito ? Math.round(objeto.credito) : 0);
        } else {
          objeto.nuevoSaldo =
            (objeto.saldoAnterior ? Math.round(objeto.saldoAnterior) : 0) +
            (objeto.credito ? Math.round(objeto.credito) : 0) -
            (objeto.debito ? Math.round(objeto.debito) : 0);
        }
      });

      mergedArray.filter((objeto: any) => {
        objeto.nuevoSaldo = objeto.nuevoSaldo
          ? Math.round(objeto.nuevoSaldo)
          : 0;
        objeto.saldoAnterior = objeto.saldoAnterior
          ? Math.round(objeto.saldoAnterior)
          : 0;
        objeto.debito = objeto.debito ? Math.round(objeto.debito) : 0;
        objeto.credito = objeto.credito ? Math.round(objeto.credito) : 0;
      });

      this.datosTabla = mergedArray;
      this.baseInformes = mergedArray;
      this.datosTabla334 = mergedArray;
      if (this.contadorAlert === 1) {
        // this.showAlert(mergedArray);
      }
      this.contadorAlert++;
      if (this.recorrido2 === 0) {
        this.objSuma = {
          4: JSON.parse(localStorage.getItem('4') ?? '{}'),
          5: JSON.parse(localStorage.getItem('5') ?? '{}'),
          6: JSON.parse(localStorage.getItem('6') ?? '{}'),
          7: JSON.parse(localStorage.getItem('7') ?? '{}'),
        };
        let obj12 = {
          1: JSON.parse(localStorage.getItem('1.2.23.02') ?? '{}'),
        };
        this.datosTabla = this.datosTabla.filter((objeto: any) => {
          if (objeto.codigo === '3.1.10.01') {
            objeto.debito =
              this.objSuma['5'].nuevoSaldo +
              this.objSuma['6'].nuevoSaldo +
              this.objSuma['7'].nuevoSaldo;
            objeto.credito = this.objSuma['4'].nuevoSaldo;
            objeto.tipoSaldoNuevo = 'CR';
            let x = [];
            const sumatoria =
              (objeto.saldoAnterior || 0) +
              (objeto.credito || 0) -
              (objeto.debito || 0);
            x.push(sumatoria);
            objeto.nuevoSaldo = x[0];
          }
          return true;
        });
      }
      console.log('hola aca acaba todo??????????');
      if (this.recorrido2 === 1) {
        this.actualizarTabla();
      } else {
        for (let i = 0; i < this.datosTabla.length; i++) {
          if (this.datosTabla[i].corriente && !this.datosTabla[i].noCorriente) {
            this.datosTabla[i].tipoDeCuenta = this.datosTabla[i].nuevoSaldo;
            for (
              let index = 0;
              index < this.datosTabla2Recorrido.length;
              index++
            ) {
              if (
                this.datosTabla2Recorrido[index].codigo ===
                this.datosTabla[i].codigo
              ) {
                this.datosTabla2Recorrido[index].nuevoSaldo =
                  this.datosTabla[i].nuevoSaldo;
              }
            }
          } else {
            if (
              !this.datosTabla[i].corriente &&
              this.datosTabla[i].noCorriente
            ) {
              this.datosTabla[i].compartidoTipo = this.datosTabla[i].nuevoSaldo;
              for (
                let index = 0;
                index < this.datosTabla2Recorrido.length;
                index++
              ) {
                if (
                  this.datosTabla2Recorrido[index].codigo ===
                  this.datosTabla[i].codigo
                ) {
                  this.datosTabla2Recorrido[index].compartidoTipo =
                    this.datosTabla[i].nuevoSaldo;
                }
              }
            }
          }

          for (let i = 0; i < this.datosTabla.length; i++) {
            if (
              this.datosTabla[i].corriente &&
              !this.datosTabla[i].noCorriente
            ) {
              this.corrientes.push(this.datosTabla[i]);
              this.rowColors[this.datosTabla[i].codigo] = 'bg-success1';
            }
            if (
              this.datosTabla[i].corriente &&
              this.datosTabla[i].noCorriente
            ) {
              // console.log(this.datosTabla[i])
              // this.corrientesNoCorrientes.push(this.datosTabla[i]);
              this.rowColors[this.datosTabla[i].codigo] = 'bg-yellow';
            }
            if (
              this.datosTabla[i].noCorriente &&
              !this.datosTabla[i].corriente
            ) {
              this.noCorrientes.push(this.datosTabla[i]);
              this.rowColors[this.datosTabla[i].codigo] = 'bg-success2';
            }
          }
        }
        for (let index = 0; index < this.datosTabla.length; index++) {
          const codigo = this.datosTabla[index].codigo.trim();

          const indiceModelo = this.modeloDeDatosContabilidad.findIndex(
            (item: any) => item.codigo.trim() === codigo
          );

          if (indiceModelo !== -1) {
            this.datosTabla[index].corriente =
              this.modeloDeDatosContabilidad[indiceModelo].corriente === 'true'
                ? true
                : false;

            this.datosTabla[index].noCorriente =
              this.modeloDeDatosContabilidad[indiceModelo].noCorriente ===
              'true'
                ? true
                : false;
          }
        }
        for (let i = 0; i < this.datosTabla.length; i++) {
          if (this.datosTabla[i].corriente && !this.datosTabla[i].noCorriente) {
            this.corrientes.push(this.datosTabla[i]);
            this.rowColors[this.datosTabla[i].codigo] = 'bg-success1';
          }
          if (this.datosTabla[i].corriente && this.datosTabla[i].noCorriente) {
            this.corrientesCopia.push(this.datosTabla[i]);
            this.corrientesNoCorrientes.push(this.datosTabla[i]);
            this.rowColors[this.datosTabla[i].codigo] = 'bg-yellow';
          }
          if (this.datosTabla[i].noCorriente && !this.datosTabla[i].corriente) {
            this.noCorrientes.push(this.datosTabla[i]);
            this.rowColors[this.datosTabla[i].codigo] = 'bg-success2';
          }
        }
        this.contadormodelo = 18;
        this.ejecucion = 0;
        this.rowColors = {};
        this.corrientes = [];
        this.mostrarTabla = false;
        this.dataTareasPaginated = [];
        this.selectAll = false;
        this.noCorrientes = [];
        this.padres = [];
        this.elementosUnificados = [];
        this.resultados = [];
        this.datosTabla2 = [];
        this.unicosmodelo = [];
        this.baseInformes = [];
        this.validartabla = 0;
        this.recorrido2 = 1;
        this.datosTabla = this.datosTabla2Recorrido;
        this.siguientepasoAgregarEstructura();
      }
    } else {
      if (contadorValor > 0) {
        console.log('ejecutando', contadorValor);
        this.ejecutarModeloDeResumidosReporte(contadorValor - 1);
      }
    }
  }
}
