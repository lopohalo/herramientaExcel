import { Component, OnInit } from '@angular/core';
import { elementAt, filter } from 'rxjs';
import { formatNumber } from '@angular/common';
import * as numeral from 'numeral';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.scss'],
})
export class GastosComponent implements OnInit {
  title = 'herramientaExcel';
  validartabla = 0;
  rutaVerificacionBotones: any = '';
  contadorPrimerArreglo = 0;
  baseInformes: any;
  valor = 0;
  valorDefinitivo = 0;
  cargandoPaginaSpinner: any = '';
  arregloGrande = [];
  mostrarReporte: any = '';
  mostrarBoton = 0;
  contadormodelo = 28;
  convertedJson!: string;
  fileName = 'tabla.xlsx';
  ejecucion = 0;
  datosTabla: any = [];
  datosDuplicados: any = [];
  sinDuplicados: any = [];
  sinDuplicadosTABLA: any = [];
  unicosmodelo = [];
  titulo: any = '';
  elementosUnificados: any;
  modeloInformacion = [
    {
      CODIGOPRESUPUESTAL: '2',
      CONCEPTO: 'GASTOS ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    ,
    {
      CODIGOPRESUPUESTAL: '2.1',
      CONCEPTO: 'FUNCIONAMIENTO ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1',
      CONCEPTO: 'GASTOS DE PERSONAL ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.01 ',
      CONCEPTO: 'PLANTA DE PERSONAL PERMANENTE ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.01.01 ',
      CONCEPTO: 'FACTORES CONSTITUTIVOS DE SALARIO ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.01.01.001 ',
      CONCEPTO: 'FACTORES SALARIALES COMUNES ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.01.01.001.01 ',
      CONCEPTO: 'FACTORES SALARIALES COMUNES ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.01.01.001.02 ',
      CONCEPTO: 'FACTORES SALARIALES COMUNES ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.01.01.001.05 ',
      CONCEPTO: 'FACTORES SALARIALES COMUNES ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.01.01.001.07 ',
      CONCEPTO: 'FACTORES SALARIALES COMUNES ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.01.02 ',
      CONCEPTO: 'CONTRIBUCIONES INHERENTES A LA NOMINA ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.01.03 ',
      CONCEPTO: 'REMUNERACIONES NO CONSTITUTIVAS DE FACTOR SALARIAL ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.01.03.001 ',
      CONCEPTO: 'PRESTACIONES SOCIALES ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.01.03.020 ',
      CONCEPTO: 'fondo de ahorro ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.01.03.083',
      CONCEPTO: 'auxilio de rodamiento',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.02 ',
      CONCEPTO: 'PERSONAL SUPERNUMERARIO Y PLANTA TEMPORAL ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.02.01 ',
      CONCEPTO: 'FACTORES CONSTITUTIVOS DE SALARIO ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.02.01.001 ',
      CONCEPTO: 'FACTORES SALARIALES COMUNES ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.02.01.001.01',
      CONCEPTO: 'sueldo de profesionales',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.02.01.001.02',
      CONCEPTO: 'sueldo de administrativos',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.02.01.001.03',
      CONCEPTO: 'sueldo de tecnicos',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.02.01.001.04',
      CONCEPTO: 'sueldo de operativos',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.02.01.001.05',
      CONCEPTO: 'sueldo de catedras',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.02.01.001.06',
      CONCEPTO: 'prima de servicios',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.02.01.001.07',
      CONCEPTO: 'bonificacion por servicios',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.02.01.001.08',
      CONCEPTO: 'prima de navidad',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.02.02 ',
      CONCEPTO: 'CONTRIBUCIONES INHERENTES A LA NOMINA ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.02.03 ',
      CONCEPTO: 'REMUNERACIONES NO CONSTITUTIVAS DE FACTOR SALARIAL ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.02.03.001 ',
      CONCEPTO: 'PRESTACIONES SOCIALES ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.02.03.035 ',
      CONCEPTO: 'subsidio familiar ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.2 ',
      CONCEPTO: 'ADQUISICION DE BIENES Y SERVICIOS ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.2.02 ',
      CONCEPTO: 'ADQUISICIONES DIFERENTES DE ACTIVOS ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.2.02.01 ',
      CONCEPTO: 'MATERIALES Y SUMINISTROS ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.2.02.01.000 ',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.2.02.01.002 ',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.2.02.01.003 ',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.2.02.01.004 ',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.2.02.02 ',
      CONCEPTO: 'ADQUISICION DE SERVICIOS ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.2.02.03 ',
      CONCEPTO: 'GASTOS IMPREVISTOS ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.3 ',
      CONCEPTO: 'TRANSFERENCIAS CORRIENTES ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.3.04 ',
      CONCEPTO: 'A ORGANIZACIONES NACIONALES ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.3.04.05 ',
      CONCEPTO: 'A OTRAS ORGANIZACIONES NACIONALES ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.3.07 ',
      CONCEPTO: 'PRESTACIONES PARA CUBRIR RIESGOS SOCIALES ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.3.07.02 ',
      CONCEPTO: 'PRESTACIONES SOCIALES RELACIONADAS CON EL EMPLEO ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.3.07.02.003 ',
      CONCEPTO: 'BONOS',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.3.07.02.003.01 ',
      CONCEPTO: 'BONOS PENSIONALES',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.3.07.02.003.02 ',
      CONCEPTO: 'BONOS PENSIONALES',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.3.07.02.010.01',
      CONCEPTO: 'BONOS PENSIONALES',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.7 ',
      CONCEPTO: 'DISMINUCION DE PASIVOS ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.7.01 ',
      CONCEPTO: 'CESANTIAS ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.8 ',
      CONCEPTO:
        'GASTOS POR TRIBUTOS, TASAS, CONTRIBUCIONES, MULTAS, SANCIONES E INTERESES DE MORA ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.8.01 ',
      CONCEPTO: 'IMPUESTOS ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3 ',
      CONCEPTO: 'INVERSION ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.2 ',
      CONCEPTO: 'ADQUISICION DE BIENES Y SERVICIOS ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.2.01 ',
      CONCEPTO: 'ADQUISICION DE ACTIVOS NO FINANCIEROS ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.2.01.01 ',
      CONCEPTO: 'ACTIVOS FIJOS ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.2.01.01.001 ',
      CONCEPTO: 'EDIFICACIONES Y ESTRUCTURAS ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.2.01.01.003 ',
      CONCEPTO: 'MAQUINARIA Y EQUIPO ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.2.01.01.005 ',
      CONCEPTO: 'OTROS ACTIVOS FIJOS ',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.01.01.001.08',
      CONCEPTO: 'OPRESTACIONES SOCIALES',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.01.01.002',
      CONCEPTO: 'FACTORES SALARIALES ESPECIALES',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.01.01.002.12',
      CONCEPTO: 'PRIMA DE ANTIGÃœEDAD',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.02.01.001.08',
      CONCEPTO: 'PRESTACIONES SOCIALES',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.3.13.01',
      CONCEPTO: 'FALLOS NACIONALES',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.5',
      CONCEPTO: 'GASTOS DE COMERCIALIZACION Y PRODUCCION',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.5.01',
      CONCEPTO: 'MATERIALES Y SUMINISTROS',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.5.02',
      CONCEPTO: 'ADQUISICION DE SERVICIOS',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.3.07.02.001 ',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.01.01.001.04',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.3.07.02.010',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.3.08',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.3.13',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.8.04',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.3.07.02.002',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.99',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.1',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.1.01',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.1.01.01',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.1.01.01.001',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.1.01.01.001.07',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    // {
    //   "CODIGOPRESUPUESTAL": "2.3.2.01.01.003.03.01",
    //   "CONCEPTO": "",
    //   "APROPIACIONINICIAL" : "0",
    // "PAGOS" : "0",
    // "PRESUPUESTODEFINITIVO" : "0",
    // "EJECUTADOCOMOOBLIGACION" :"0",
    // "COMPROMETIDO" : "0",
    // "OBLIGACIONES" : "0"
    // },
    {
      CODIGOPRESUPUESTAL: '2.3.2.01.01.003.02',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.2.01.01.003.03',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.2.01.01.003.06',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.2.02',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.2.02.01',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.2.02.02',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.2.01.01.005.02',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.2.01.01.005.02.03',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.2.01.01.005.02.03.01',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.1.01.01.001.06',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    // {
    //   "CODIGOPRESUPUESTAL": "2.1.1.02.01.001.07",
    //   "CONCEPTO": "",
    //   "APROPIACIONINICIAL" : "0",
    // "PAGOS" : "0",
    // "PRESUPUESTODEFINITIVO" : "0",
    // "EJECUTADOCOMOOBLIGACION" :"0",
    // "COMPROMETIDO" : "0",
    // "OBLIGACIONES" : "0"
    // },
    {
      CODIGOPRESUPUESTAL: '2.3.2.01.01.001.02',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    // {
    //   "CODIGOPRESUPUESTAL": "2.3.2.01.01.001.02.07",
    //   "CONCEPTO": "",
    //   "APROPIACIONINICIAL" : "0",
    // "PAGOS" : "0",
    // "PRESUPUESTODEFINITIVO" : "0",
    // "EJECUTADOCOMOOBLIGACION" :"0",
    // "COMPROMETIDO" : "0",
    // "OBLIGACIONES" : "0"
    // },
    {
      CODIGOPRESUPUESTAL: '2.3.3',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.5',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.5.01',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.5.02',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.8',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.3.08',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.2.01.01.003.01',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.2.01.01.003.02',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.2.01.01.003.03',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.2.01.01.003.04',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.2.01.01.003.05',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.2.01.01.003.06',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.8.03.02',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.3.8.01.53',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.2.02.02.005',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.2.02.02.006',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.2.02.02.007',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.2.02.02.008',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
    {
      CODIGOPRESUPUESTAL: '2.1.2.02.02.009',
      CONCEPTO: '',
      APROPIACIONINICIAL: '0',
      PAGOS: '0',
      PRESUPUESTODEFINITIVO: '0',
      EJECUTADOCOMOOBLIGACION: '0',
      COMPROMETIDO: '0',
      OBLIGACIONES: '0',
    },
  ];

  codigosModeloReporte = [
    {
      CODIGO: '2 ',
    },
    {
      CODIGO: '2.1 ',
    },
    {
      CODIGO: '2.1.1 ',
    },
    {
      CODIGO: '2.1.1.01 ',
    },
    {
      CODIGO: '2.1.1.01.01 ',
    },
    {
      CODIGO: '2.1.1.01.01.001 ',
    },
    {
      CODIGO: '2.1.1.01.01.001.01 ',
    },
    {
      CODIGO: '2.1.1.01.01.001.02 ',
    },
    {
      CODIGO: '2.1.1.01.01.001.04 ',
    },
    {
      CODIGO: '2.1.1.01.01.001.05 ',
    },
    {
      CODIGO: '2.1.1.01.01.001.06 ',
    },
    {
      CODIGO: '2.1.1.01.01.001.07 ',
    },
    {
      CODIGO: '2.1.1.01.01.001.08 ',
    },
    {
      CODIGO: '2.1.1.01.01.001.08.01 ',
    },
    {
      CODIGO: '2.1.1.01.01.001.08.02 ',
    },
    {
      CODIGO: '2.1.1.01.01.001.09 ',
    },
    {
      CODIGO: '2.1.1.01.01.002 ',
    },
    {
      CODIGO: '2.1.1.01.01.002.12 ',
    },
    {
      CODIGO: '2.1.1.01.01.002.12.01 ',
    },
    {
      CODIGO: '2.1.1.01.02 ',
    },
    {
      CODIGO: '2.1.1.01.02.001 ',
    },
    {
      CODIGO: '2.1.1.01.02.002 ',
    },
    {
      CODIGO: '2.1.1.01.02.003 ',
    },
    {
      CODIGO: '2.1.1.01.02.005 ',
    },
    {
      CODIGO: '2.1.1.01.02.006 ',
    },
    {
      CODIGO: '2.1.1.01.03 ',
    },
    {
      CODIGO: '2.1.1.01.03.001 ',
    },
    {
      CODIGO: '2.1.1.01.03.001.01 ',
    },
    {
      CODIGO: '2.1.1.01.03.001.04 ',
    },
    {
      CODIGO: '2.1.1.01.03.020 ',
    },
    {
      CODIGO: '2.1.1.01.03.083 ',
    },
    {
      CODIGO: '2.1.1.01.03.097 ',
    },
    {
      CODIGO: '2.1.1.02 ',
    },
    {
      CODIGO: '2.1.1.02.01 ',
    },
    {
      CODIGO: '2.1.1.02.01.001 ',
    },
    {
      CODIGO: '2.1.1.02.01.001.01 ',
    },
    {
      CODIGO: '2.1.1.02.01.001.02 ',
    },
    {
      CODIGO: '2.1.1.02.01.001.03 ',
    },
    {
      CODIGO: '2.1.1.02.01.001.04 ',
    },
    {
      CODIGO: '2.1.1.02.01.001.05 ',
    },
    {
      CODIGO: '2.1.1.02.01.001.06 ',
    },
    {
      CODIGO: '2.1.1.02.01.001.07 ',
    },
    {
      CODIGO: '2.1.1.02.01.001.08 ',
    },
    {
      CODIGO: '2.1.1.02.01.001.08.01 ',
    },
    {
      CODIGO: '2.1.1.02.01.001.08.02 ',
    },
    {
      CODIGO: '2.1.1.02.02 ',
    },
    {
      CODIGO: '2.1.1.02.02.001 ',
    },
    {
      CODIGO: '2.1.1.02.02.002 ',
    },
    {
      CODIGO: '2.1.1.02.02.003 ',
    },
    {
      CODIGO: '2.1.1.02.02.005 ',
    },
    {
      CODIGO: '2.1.1.02.02.006 ',
    },
    {
      CODIGO: '2.1.1.02.03 ',
    },
    {
      CODIGO: '2.1.1.02.03.001 ',
    },
    {
      CODIGO: '2.1.1.02.03.001.01 ',
    },
    {
      CODIGO: '2.1.1.02.03.035 ',
    },
    {
      CODIGO: '2.1.2 ',
    },
    {
      CODIGO: '2.1.2.02 ',
    },
    {
      CODIGO: '2.1.2.02.01 ',
    },
    {
      CODIGO: '2.1.2.02.01.000 ',
    },
    {
      CODIGO: '2.1.2.02.01.001',
    },
    {
      CODIGO: '2.1.2.02.01.002 ',
    },
    {
      CODIGO: '2.1.2.02.01.003 ',
    },
    {
      CODIGO: '2.1.2.02.01.004 ',
    },
    {
      CODIGO: '2.1.2.02.02 ',
    },
    {
      CODIGO: '2.1.2.02.02.005 ',
    },
    {
      CODIGO: '2.1.2.02.02.006 ',
    },
    {
      CODIGO: '2.1.2.02.02.007 ',
    },
    {
      CODIGO: '2.1.2.02.02.008 ',
    },
    {
      CODIGO: '2.1.2.02.02.009 ',
    },
    {
      CODIGO: '2.1.3 ',
    },
    {
      CODIGO: '2.1.3.04 ',
    },
    {
      CODIGO: '2.1.3.04.05 ',
    },
    {
      CODIGO: '2.1.3.04.05.002 ',
    },
    {
      CODIGO: '2.1.3.07 ',
    },
    {
      CODIGO: '2.1.3.07.02 ',
    },
    {
      CODIGO: '2.1.3.07.02.001 ',
    },
    {
      CODIGO: '2.1.3.07.02.001.02 ',
    },
    {
      CODIGO: '2.1.3.07.02.002 ',
    },
    {
      CODIGO: '2.1.3.07.02.002.02 ',
    },
    {
      CODIGO: '2.1.3.07.02.003 ',
    },
    {
      CODIGO: '2.1.3.07.02.003.01 ',
    },
    {
      CODIGO: '2.1.3.07.02.003.02 ',
    },
    {
      CODIGO: '2.1.3.07.02.010 ',
    },
    {
      CODIGO: '2.1.3.07.02.010.01 ',
    },
    {
      CODIGO: '2.1.3.07.02.010.02 ',
    },
    {
      CODIGO: '2.1.3.08 ',
    },
    {
      CODIGO: '2.1.3.08.02 ',
    },
    {
      CODIGO: '2.1.3.13 ',
    },
    {
      CODIGO: '2.1.3.13.01 ',
    },
    {
      CODIGO: '2.1.3.13.01.001 ',
    },
    {
      CODIGO: '2.1.5 ',
    },
    {
      CODIGO: '2.1.5.01 ',
    },
    {
      CODIGO: '2.1.5.01.00 ',
    },
    {
      CODIGO: '2.1.5.01.02 ',
    },
    {
      CODIGO: '2.1.5.01.03 ',
    },
    {
      CODIGO: '2.1.5.01.04 ',
    },
    {
      CODIGO: '2.1.5.02 ',
    },
    {
      CODIGO: '2.1.5.02.05 ',
    },
    {
      CODIGO: '2.1.5.02.06 ',
    },
    {
      CODIGO: '2.1.5.02.07 ',
    },
    {
      CODIGO: '2.1.5.02.08 ',
    },
    {
      CODIGO: '2.1.5.02.09 ',
    },
    {
      CODIGO: '2.1.7 ',
    },
    {
      CODIGO: '2.1.7.01 ',
    },
    {
      CODIGO: '2.1.7.01.01 ',
    },
    {
      CODIGO: '2.1.8 ',
    },
    {
      CODIGO: '2.1.8.01 ',
    },
    {
      CODIGO: '2.1.8.01.51 ',
    },
    {
      CODIGO: '2.1.8.01.52 ',
    },
    {
      CODIGO: '2.1.8.01.53 ',
    },
    {
      CODIGO: '2.1.8.03 ',
    },
    {
      CODIGO: '2.1.8.04 ',
    },
    {
      CODIGO: '2.1.8.04.01 ',
    },
    {
      CODIGO: '2.99',
    },
  ];
  codigosModeloReporteEjecucionGastos = [
    {
      CODIGO: '2 ',
    },
    {
      CODIGO: '2.1 ',
    },
    {
      CODIGO: '2.1.1 ',
    },
    {
      CODIGO: '2.1.1.01 ',
    },
    {
      CODIGO: '2.1.1.01.01 ',
    },
    {
      CODIGO: '2.1.1.01.01.001 ',
    },
    {
      CODIGO: '2.1.1.01.01.001.01 ',
    },
    {
      CODIGO: '2.1.1.01.01.001.02 ',
    },
    {
      CODIGO: '2.1.1.01.01.001.04 ',
    },
    {
      CODIGO: '2.1.1.01.01.001.05 ',
    },
    {
      CODIGO: '2.1.1.01.01.001.06 ',
    },
    {
      CODIGO: '2.1.1.01.01.001.07 ',
    },
    {
      CODIGO: '2.1.1.01.01.001.08 ',
    },
    {
      CODIGO: '2.1.1.01.01.001.08.01 ',
    },
    {
      CODIGO: '2.1.1.01.01.001.08.02 ',
    },
    {
      CODIGO: '2.1.1.01.01.001.09 ',
    },
    {
      CODIGO: '2.1.1.01.01.002 ',
    },
    {
      CODIGO: '2.1.1.01.01.002.12 ',
    },
    {
      CODIGO: '2.1.1.01.01.002.12.01 ',
    },
    {
      CODIGO: '2.1.1.01.02 ',
    },
    {
      CODIGO: '2.1.1.01.02.001 ',
    },
    {
      CODIGO: '2.1.1.01.02.002 ',
    },
    {
      CODIGO: '2.1.1.01.02.003 ',
    },
    {
      CODIGO: '2.1.1.01.02.005 ',
    },
    {
      CODIGO: '2.1.1.01.02.006 ',
    },
    {
      CODIGO: '2.1.1.01.03 ',
    },
    {
      CODIGO: '2.1.1.01.03.001 ',
    },
    {
      CODIGO: '2.1.1.01.03.001.01 ',
    },
    {
      CODIGO: '2.1.1.01.03.001.04 ',
    },
    {
      CODIGO: '2.1.1.01.03.020 ',
    },
    {
      CODIGO: '2.1.1.01.03.083 ',
    },
    {
      CODIGO: '2.1.1.01.03.097 ',
    },
    {
      CODIGO: '2.1.1.02 ',
    },
    {
      CODIGO: '2.1.1.02.01 ',
    },
    {
      CODIGO: '2.1.1.02.01.001 ',
    },
    {
      CODIGO: '2.1.1.02.01.001.01 ',
    },
    {
      CODIGO: '2.1.1.02.01.001.02 ',
    },
    {
      CODIGO: '2.1.1.02.01.001.03 ',
    },
    {
      CODIGO: '2.1.1.02.01.001.04 ',
    },
    {
      CODIGO: '2.1.1.02.01.001.05 ',
    },
    {
      CODIGO: '2.1.1.02.01.001.06 ',
    },
    {
      CODIGO: '2.1.1.02.01.001.07 ',
    },
    {
      CODIGO: '2.1.1.02.01.001.08 ',
    },
    {
      CODIGO: '2.1.1.02.01.001.08.01 ',
    },
    {
      CODIGO: '2.1.1.02.01.001.08.02 ',
    },
    {
      CODIGO: '2.1.1.02.02 ',
    },
    {
      CODIGO: '2.1.1.02.02.001 ',
    },
    {
      CODIGO: '2.1.1.02.02.002 ',
    },
    {
      CODIGO: '2.1.1.02.02.003 ',
    },
    {
      CODIGO: '2.1.1.02.02.005 ',
    },
    {
      CODIGO: '2.1.1.02.02.006 ',
    },
    {
      CODIGO: '2.1.1.02.03 ',
    },
    {
      CODIGO: '2.1.1.02.03.001 ',
    },
    {
      CODIGO: '2.1.1.02.03.001.01 ',
    },
    {
      CODIGO: '2.1.1.02.03.035 ',
    },
    {
      CODIGO: '2.1.2 ',
    },
    {
      CODIGO: '2.1.2.02 ',
    },
    {
      CODIGO: '2.1.2.02.01 ',
    },
    {
      CODIGO: '2.1.2.02.01.000 ',
    },
    {
      CODIGO: '2.1.2.02.01.001',
    },
    {
      CODIGO: '2.1.2.02.01.002 ',
    },
    {
      CODIGO: '2.1.2.02.01.003 ',
    },
    {
      CODIGO: '2.1.2.02.01.004 ',
    },
    {
      CODIGO: '2.1.2.02.02 ',
    },
    {
      CODIGO: '2.1.2.02.02.005 ',
    },
    {
      CODIGO: '2.1.2.02.02.006',
    },
    {
      CODIGO: '2.1.2.02.02.007 ',
    },
    {
      CODIGO: '2.1.2.02.02.008 ',
    },
    {
      CODIGO: '2.1.2.02.02.009 ',
    },
    {
      CODIGO: '2.1.3 ',
    },
    {
      CODIGO: '2.1.3.04 ',
    },
    {
      CODIGO: '2.1.3.04.05 ',
    },
    {
      CODIGO: '2.1.3.04.05.002 ',
    },
    {
      CODIGO: '2.1.3.07 ',
    },
    {
      CODIGO: '2.1.3.07.02 ',
    },
    {
      CODIGO: '2.1.3.07.02.001 ',
    },
    {
      CODIGO: '2.1.3.07.02.001.02 ',
    },
    {
      CODIGO: '2.1.3.07.02.002 ',
    },
    {
      CODIGO: '2.1.3.07.02.002.02 ',
    },
    {
      CODIGO: '2.1.3.07.02.003 ',
    },
    {
      CODIGO: '2.1.3.07.02.003.01 ',
    },
    {
      CODIGO: '2.1.3.07.02.003.02 ',
    },
    {
      CODIGO: '2.1.3.07.02.010 ',
    },
    {
      CODIGO: '2.1.3.07.02.010.01 ',
    },
    {
      CODIGO: '2.1.3.07.02.010.02 ',
    },
    {
      CODIGO: '2.1.3.08 ',
    },
    {
      CODIGO: '2.1.3.08.02 ',
    },
    {
      CODIGO: '2.1.3.13 ',
    },
    {
      CODIGO: '2.1.3.13.01 ',
    },
    {
      CODIGO: '2.1.3.13.01.001 ',
    },
    {
      CODIGO: '2.1.5 ',
    },
    {
      CODIGO: '2.1.5.01 ',
    },
    {
      CODIGO: '2.1.5.01.00 ',
    },
    {
      CODIGO: '2.1.5.01.02 ',
    },
    {
      CODIGO: '2.1.5.01.03 ',
    },
    {
      CODIGO: '2.1.5.01.04 ',
    },
    {
      CODIGO: '2.1.5.02 ',
    },
    {
      CODIGO: '2.1.5.02.05 ',
    },
    {
      CODIGO: '2.1.5.02.06 ',
    },
    {
      CODIGO: '2.1.5.02.07 ',
    },
    {
      CODIGO: '2.1.5.02.08 ',
    },
    {
      CODIGO: '2.1.5.02.09 ',
    },
    {
      CODIGO: '2.1.7 ',
    },
    {
      CODIGO: '2.1.7.01 ',
    },
    {
      CODIGO: '2.1.7.01.01 ',
    },
    {
      CODIGO: '2.1.8 ',
    },
    {
      CODIGO: '2.1.8.01 ',
    },
    {
      CODIGO: '2.1.8.01.51 ',
    },
    {
      CODIGO: '2.1.8.01.52 ',
    },
    {
      CODIGO: '2.1.8.01.53 ',
    },
    {
      CODIGO: '2.1.8.03 ',
    },
    {
      CODIGO: '2.1.8.04 ',
    },
    {
      CODIGO: '2.1.8.04.01 ',
    },
    {
      CODIGO: '2.3',
    },
    {
      CODIGO: '2.3.1',
    },
    {
      CODIGO: '2.3.1.01',
    },
    {
      CODIGO: '2.3.1.01.01',
    },
    {
      CODIGO: '2.3.1.01.01.001',
    },
    {
      CODIGO: '2.3.1.01.01.001.07',
    },
    {
      CODIGO: '2.3.1.01.01.002.01.02.02',
    },
    {
      CODIGO: '2.3.2',
    },
    {
      CODIGO: '2.3.2.01',
    },
    {
      CODIGO: '2.3.2.01.01',
    },
    {
      CODIGO: '2.3.2.01.01.001',
    },
    {
      CODIGO: '2.3.2.01.01.001.02',
    },
    {
      CODIGO: '2.3.2.01.01.001.02.07',
    },
    {
      CODIGO: '2.3.2.01.01.001.03.19',
    },
    {
      CODIGO: '2.3.2.01.01.003',
    },
    {
      CODIGO: '2.3.2.01.01.003.01',
    },
    {
      CODIGO: '2.3.2.01.01.003.01.05',
    },
    {
      CODIGO: '2.3.2.01.01.003.02',
    },
    {
      CODIGO: '2.3.2.01.01.003.03',
    },
    {
      CODIGO: '2.3.2.01.01.003.03.01',
    },
    {
      CODIGO: '2.3.2.01.01.003.03.02',
    },
    {
      CODIGO: '2.3.2.01.01.003.04',
    },
    {
      CODIGO: '2.3.2.01.01.003.05',
    },
    {
      CODIGO: '2.3.2.01.01.003.05.02',
    },
    {
      CODIGO: '2.3.2.01.01.003.06',
    },
    {
      CODIGO: '2.3.2.01.01.003.06.01',
    },
    {
      CODIGO: '2.3.2.01.01.003.06.02',
    },
    {
      CODIGO: '2.3.2.01.01.005',
    },
    {
      CODIGO: '2.3.2.01.01.005.02',
    },
    {
      CODIGO: '2.3.2.01.01.005.02.03',
    },
    {
      CODIGO: '2.3.2.01.01.005.02.03.01.02',
    },
    {
      CODIGO: '2.3.2.01.01.005.02.05',
    },
    {
      CODIGO: '2.3.2.02',
    },
    {
      CODIGO: '2.3.2.02.01',
    },
    {
      CODIGO: '2.3.2.02.01.003',
    },
    {
      CODIGO: '2.3.2.02.01.004',
    },
    {
      CODIGO: '2.3.2.02.02',
    },
    {
      CODIGO: '2.3.2.02.02.008',
    },
    {
      CODIGO: '2.3.2.02.02.009',
    },
    {
      CODIGO: '2.3.3',
    },
    {
      CODIGO: '2.3.3.08',
    },
    {
      CODIGO: '2.3.3.08.02',
    },
    {
      CODIGO: '2.3.5',
    },
    {
      CODIGO: '2.3.5.01',
    },
    {
      CODIGO: '2.3.5.01.00',
    },
    {
      CODIGO: '2.3.5.01.02',
    },
    {
      CODIGO: '2.3.5.01.03',
    },
    {
      CODIGO: '2.3.5.01.04',
    },
    {
      CODIGO: '2.3.5.02',
    },
    {
      CODIGO: '2.3.5.02.06',
    },
    {
      CODIGO: '2.3.5.02.07',
    },
    {
      CODIGO: '2.3.5.02.08',
    },
    {
      CODIGO: '2.3.5.02.09',
    },
    {
      CODIGO: '2.3.8',
    },
    {
      CODIGO: '2.3.8.01.53',
    },
    {
      CODIGO: '2.3.8.03',
    },
    {
      CODIGO: '2.3.8.03.02',
    },
  ];
  codigoModeloReporteReservas = [
    {
      CODIGO: '2',
    },
    {
      CODIGO: '2.1',
    },
    {
      CODIGO: '2.1.1',
    },
    {
      CODIGO: '2.1.1.01',
    },
    {
      CODIGO: '2.1.1.01.01',
    },
    {
      CODIGO: '2.1.1.01.01.001',
    },
    {
      CODIGO: '2.1.1.01.01.001.06',
    },
    {
      CODIGO: '2.1.1.01.01.001.08',
    },
    {
      CODIGO: '2.1.1.01.01.001.08.01',
    },
    {
      CODIGO: '2.1.1.01.01.001.08.02',
    },
    {
      CODIGO: '2.1.1.01.02',
    },
    {
      CODIGO: '2.1.1.01.02.003',
    },
    {
      CODIGO: '2.1.1.01.03',
    },
    {
      CODIGO: '2.1.1.01.03.001',
    },
    {
      CODIGO: '2.1.1.01.03.001.01',
    },
    {
      CODIGO: '2.1.1.01.03.020',
    },
    {
      CODIGO: '2.1.1.02',
    },
    {
      CODIGO: '2.1.1.02.01',
    },
    {
      CODIGO: '2.1.1.02.01.001',
    },
    {
      CODIGO: '2.1.1.02.01.001.07',
    },
    {
      CODIGO: '2.1.2',
    },
    {
      CODIGO: '2.1.2.02',
    },
    {
      CODIGO: '2.1.2.02.01',
    },
    {
      CODIGO: '2.1.2.02.01.000',
    },
    {
      CODIGO: '2.1.2.02.01.001',
    },
    {
      CODIGO: '2.1.2.02.01.002',
    },
    {
      CODIGO: '2.1.2.02.01.003',
    },
    {
      CODIGO: '2.1.2.02.01.004',
    },
    {
      CODIGO: '2.1.2.02.02',
    },
    {
      CODIGO: '2.1.2.02.02.005',
    },
    {
      CODIGO: '2.1.2.02.02.006',
    },
    {
      CODIGO: '2.1.2.02.02.007',
    },
    {
      CODIGO: '2.1.2.02.02.008',
    },
    {
      CODIGO: '2.1.2.02.02.009',
    },
    {
      CODIGO: '2.1.5',
    },
    {
      CODIGO: '2.1.5.01',
    },
    {
      CODIGO: '2.1.5.01.03',
    },
    {
      CODIGO: '2.1.5.02',
    },
    {
      CODIGO: '2.1.5.02.06',
    },
    {
      CODIGO: '2.1.5.02.08',
    },
    {
      CODIGO: '2.1.5.02.09',
    },
    {
      CODIGO: '2.1.7',
    },
    {
      CODIGO: '2.1.7.01',
    },
    {
      CODIGO: '2.1.7.01.01',
    },
    {
      CODIGO: '2.99',
    },
  ];
  codigoModeloEjecReservas = [
    {
      codigo: 2,
    },
    {
      codigo: '2.1',
    },
    {
      codigo: '2.1.1',
    },
    {
      codigo: '2.1.1.01',
    },
    {
      codigo: '2.1.1.01.01',
    },
    {
      codigo: '2.1.1.01.01.001',
    },
    {
      codigo: '2.1.1.01.01.001.06',
    },
    {
      codigo: '2.1.1.01.01.001.08',
    },
    {
      codigo: '2.1.1.01.01.001.08.01',
    },
    {
      codigo: '2.1.1.01.01.001.08.02',
    },
    {
      codigo: '2.1.1.01.02',
    },
    {
      codigo: '2.1.1.01.02.003',
    },
    {
      codigo: '2.1.1.01.03',
    },
    {
      codigo: '2.1.1.01.03.001',
    },
    {
      codigo: '2.1.1.01.03.001.01',
    },
    {
      codigo: '2.1.1.01.03.020',
    },
    {
      codigo: '2.1.1.02',
    },
    {
      codigo: '2.1.1.02.01',
    },
    {
      codigo: '2.1.1.02.01.001',
    },
    {
      codigo: '2.1.1.02.01.001.07',
    },
    {
      codigo: '2.1.2',
    },
    {
      codigo: '2.1.2.02',
    },
    {
      codigo: '2.1.2.02.01',
    },
    {
      CODIGO: '2.1.2.02.01.000',
    },
    {
      CODIGO: '2.1.2.02.01.001',
    },
    {
      CODIGO: '2.1.2.02.01.002',
    },
    {
      CODIGO: '2.1.2.02.01.003',
    },
    {
      CODIGO: '2.1.2.02.01.004',
    },
    {
      codigo: '2.1.2.02.02',
    },
    {
      codigo: '2.1.2.02.02.005',
    },
    {
      codigo: '2.1.2.02.02.006',
    },
    {
      codigo: '2.1.2.02.02.007',
    },
    {
      codigo: '2.1.2.02.02.008',
    },
    {
      codigo: '2.1.2.02.02.009',
    },
    {
      codigo: '2.1.5',
    },
    {
      codigo: '2.1.5.01',
    },
    {
      codigo: '2.1.5.01.03',
    },
    {
      codigo: '2.1.5.02',
    },
    {
      codigo: '2.1.5.02.06',
    },
    {
      codigo: '2.1.5.02.08',
    },
    {
      codigo: '2.1.5.02.09',
    },
    {
      codigo: '2.1.7',
    },
    {
      codigo: '2.1.7.01',
    },
    {
      codigo: '2.1.7.01.01',
    },
    {
      codigo: '2.3',
    },
    {
      codigo: '2.3.2',
    },
    {
      codigo: '2.3.2.01',
    },
    {
      codigo: '2.3.2.01.01',
    },
    {
      codigo: '2.3.2.01.01.001',
    },
    //   {
    //       "codigo": "2.3.2.01.01.001.02"
    //   },
    {
      codigo: '2.3.2.01.01.001.02.07',
    },
    {
      codigo: '2.3.2.01.01.003',
    },
    {
      codigo: '2.3.2.01.01.003.03',
    },
    {
      codigo: '2.3.2.01.01.003.03.01',
    },
    {
      codigo: '2.3.2.01.01.003.03.02',
    },
    {
      codigo: '2.3.2.01.01.003.06',
    },
    {
      codigo: '2.3.2.01.01.003.06.02',
    },
    {
      codigo: '2.3.2.01.01.005',
    },
    {
      codigo: '2.3.2.01.01.005.02',
    },
    {
      codigo: '2.3.2.01.01.005.02.03.01.01',
    },
    {
      codigo: '2.3.2.01.01.005.02.03.01.02',
    },
    {
      codigo: '2.3.2.01.01.005.02.05',
    },
    {
      codigo: '2.3.2.02',
    },
    {
      codigo: '2.3.2.02.01',
    },
    {
      codigo: '2.3.2.02.01.003',
    },
    {
      codigo: '2.3.2.02.01.004',
    },
    {
      codigo: '2.3.2.02.02',
    },
    {
      codigo: '2.3.2.02.02.007',
    },
    {
      codigo: '2.3.2.02.02.008',
    },
    {
      codigo: '2.3.2.02.02.009',
    },
  ];
  codigosModeloReporteCuentas = [
    {
      CODIGO: '2',
    },
    {
      CODIGO: '2.1',
    },
    {
      CODIGO: '2.1.1',
    },
    {
      CODIGO: '2.1.1.01',
    },
    {
      CODIGO: '2.1.1.01.01',
    },
    {
      CODIGO: '2.1.1.01.01.001',
    },
    {
      CODIGO: '2.1.1.01.01.001.07',
    },
    {
      CODIGO: '2.1.1.01.02',
    },
    {
      CODIGO: '2.1.1.01.02.002',
    },
    {
      CODIGO: '2.1.2',
    },
    {
      CODIGO: '2.1.2.02',
    },
    {
      CODIGO: '2.1.2.02.01',
    },
    {
      CODIGO: '2.1.2.02.01.000',
    },
    {
      CODIGO: '2.1.2.02.01.001',
    },
    {
      CODIGO: '2.1.2.02.01.002',
    },
    {
      CODIGO: '2.1.2.02.01.003',
    },
    {
      CODIGO: '2.1.2.02.01.004',
    },
    {
      CODIGO: '2.1.2.02.02',
    },
    {
      CODIGO: '2.1.2.02.02.005',
    },
    {
      CODIGO: '2.1.2.02.02.006',
    },
    {
      CODIGO: '2.1.2.02.02.007',
    },
    {
      CODIGO: '2.1.2.02.02.008',
    },
    {
      CODIGO: '2.1.2.02.02.009',
    },
    {
      CODIGO: '2.1.3',
    },
    {
      CODIGO: '2.1.3.07',
    },
    {
      CODIGO: '2.1.3.07.02',
    },
    {
      CODIGO: '2.1.3.07.02.010',
    },
    {
      CODIGO: '2.1.3.07.02.010.01',
    },
    {
      CODIGO: '2.1.3.07.02.010.02',
    },
    {
      CODIGO: '2.1.5',
    },
    {
      CODIGO: '2.1.5.02',
    },
    {
      CODIGO: '2.1.5.02.08',
    },
    {
      CODIGO: '2.3',
    },
    {
      CODIGO: '2.3.1',
    },
    {
      CODIGO: '2.3.1.01',
    },
    {
      CODIGO: '2.3.1.01.01',
    },
    {
      CODIGO: '2.3.1.01.01.001',
    },
    {
      CODIGO: '2.3.1.01.01.001.07',
    },
    {
      CODIGO: '2.3.2',
    },
    {
      CODIGO: '2.3.2.01',
    },
    {
      CODIGO: '2.3.2.01.01',
    },
    {
      CODIGO: '2.3.2.01.01.003',
    },
    {
      CODIGO: '2.3.2.01.01.003.02',
    },
    {
      CODIGO: '2.3.2.01.01.003.02.08',
    },
    {
      CODIGO: '2.3.2.01.01.003.03',
    },
    {
      CODIGO: '2.3.2.01.01.003.03.01',
    },
    {
      CODIGO: '2.3.2.01.01.003.03.02',
    },
    {
      CODIGO: '2.3.2.01.01.003.06',
    },
    {
      CODIGO: '2.3.2.01.01.003.06.02',
    },
    {
      CODIGO: '2.3.2.01.01.005',
    },
    {
      CODIGO: '2.3.2.01.01.005.02',
    },
    {
      CODIGO: '2.3.2.01.01.005.02.03',
    },
    {
      CODIGO: '2.3.2.01.01.005.02.03.01',
    },
    {
      CODIGO: '2.3.2.01.01.005.02.03.01.02',
    },
    {
      CODIGO: '2.3.2.01.01.005.02.05',
    },
    {
      CODIGO: '2.3.2.02',
    },
    {
      CODIGO: '2.3.2.02.01',
    },
    {
      CODIGO: '2.3.2.02.01.003',
    },
    {
      CODIGO: '2.3.2.02.02',
    },
    {
      CODIGO: '2.3.2.02.02.007',
    },
    {
      CODIGO: '2.3.2.02.02.009',
    },
  ];
  constructor(private router: Router) {}

  ngOnInit(): void {
    if (localStorage.getItem('ruta')) {
      this.titulo = localStorage.getItem('ruta');
    } else {
      if (this.titulo == '') {
        this.router.navigate(['/']);
      }
    }
  }

  fileUpload(event: any) {
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
        this.cargandoPaginaSpinner = 1;
      });
      for (let index = 0; index < this.datosTabla.length; index++) {
        if(this.datosTabla[index].CODIGOPRESUPUESTAL.trim() === '2.1.1.02.03.035'){
          this.datosTabla[index].CODIGOPRESUPUESTAL = '2.1.1.02.03.001.01';
        }
        if(this.datosTabla[index].CODIGOPRESUPUESTAL.trim() === '2.3.1.01.01.002.01.02.02'){
          this.datosTabla[index].CODIGOPRESUPUESTAL = '2.3.1.01.01.001.07';
        }
        if(this.datosTabla[index].CODIGOPRESUPUESTAL.trim() === '2.3.2.01.01.004.01.01'){
          this.datosTabla[index].CODIGOPRESUPUESTAL = '2.3.2.01.01.003.04';
        }
        this.datosTabla[index].APROPIACIONINICIAL = isNaN(
          this.datosTabla[index].APROPIACIONINICIAL
        )
          ? 0
          : Number(this.datosTabla[index].APROPIACIONINICIAL);
        this.datosTabla[index].EJECUTADOCOMOOBLIGACION = isNaN(
          this.datosTabla[index].EJECUTADOCOMOOBLIGACION
        )
          ? 0
          : Number(this.datosTabla[index].EJECUTADOCOMOOBLIGACION);
        this.datosTabla[index].OBLIGACIONES = isNaN(
          this.datosTabla[index].OBLIGACIONES
        )
          ? 0
          : Number(this.datosTabla[index].OBLIGACIONES);
        this.datosTabla[index].PRESUPUESTODEFINITIVO = isNaN(
          this.datosTabla[index].PRESUPUESTODEFINITIVO
        )
          ? 0
          : Number(this.datosTabla[index].PRESUPUESTODEFINITIVO);
        this.datosTabla[index].COMPROMETIDO = isNaN(
          this.datosTabla[index].COMPROMETIDO
        )
          ? 0
          : Number(this.datosTabla[index].COMPROMETIDO);
        this.datosTabla[index].PAGOS = isNaN(this.datosTabla[index].PAGOS)
          ? 0
          : Number(this.datosTabla[index].PAGOS);
      }
      this.validartabla = 1;
    };
  }
  exportexcel1(): void {
    let element = document.getElementById('excel-table');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    // Recorremos solo la columna B y definimos las celdas como texto
    const sheetData: any = worksheet['!ref']; // Obtenemos la referencia de todas las celdas
    const range = XLSX.utils.decode_range(sheetData);
    const anchoColumnas = [
      { wch: 40 },
      { wch: 20 },
      { wch: 50 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 40 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
    ];
    worksheet['!cols'] = anchoColumnas;
    for (let R = range.s.r; R <= range.e.r; ++R) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: 1 }); // Columna B: c = 1
      const cell = worksheet[cellAddress];
      cell.t = 's'; // Definimos el tipo de celda como texto (string)
    }

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, this.fileName);
  }
  exportexcel() {
    if (
      this.mostrarReporte == 'Ejecucion' ||
      this.mostrarReporte == 'ReporteEjecucion'
    ) {
      // Obtener el elemento de la tabla
      const tabla: any = document.getElementById('excel-table');

      // Obtener los datos de la tabla
      const tablaData: any = this.getTablaData2(tabla);

      // Crear una hoja de cálculo y establecer los datos de la tabla
      const workbook: XLSX.WorkBook = XLSX.utils.book_new();
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(tablaData);

      // Recorrer solo la columna B y definir las celdas como texto
      const sheetData: any = worksheet['!ref']; // Obtener la referencia de todas las celdas
      const range = XLSX.utils.decode_range(sheetData);

      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: 1 }); // Columna B: c = 1
        const cell = worksheet[cellAddress];
        cell.t = 's'; // Definir el tipo de celda como texto (string)
      }

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      // Guardar el archivo de Excel
      XLSX.writeFile(workbook, this.fileName);
    } else {
      // Obtener la tabla
      const tabla: any = document.getElementById('excel-table');

      // Obtener los datos de la tabla en un arreglo de arreglos
      const datos = this.getTablaData(tabla);

      // Crear una hoja de Excel
      const hoja: any = XLSX.utils.aoa_to_sheet(datos);

      // Configurar el formato de la columna B como texto
      //  const range = XLSX.utils.decode_range(hoja['!ref']);
      //  for (let i = range.s.r + 1; i <= range.e.r; i++) {
      //    const celda = hoja[XLSX.utils.encode_cell({ r: i, c: 1 })];
      //    celda.z = '@';
      //  }

      // Configurar el ancho de las columnas
      if (hoja) {
        const anchoColumnas = [
          { wch: 20 },
          { wch: 20 },
          { wch: 40 },
          { wch: 25 },
          { wch: 25 },
          { wch: 20 },
          { wch: 25 },
          { wch: 20 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
        ];
        hoja['!cols'] = anchoColumnas;
      } else {
        console.error('La hoja de Excel es undefined.');
      }

      // Configurar estilo de los encabezados
      const encabezadosRange = XLSX.utils.decode_range(hoja['!ref']);
      for (let i = encabezadosRange.s.c; i <= encabezadosRange.e.c; i++) {
        const ref = XLSX.utils.encode_cell({ r: 0, c: i });
        hoja[ref].s = {
          fill: { fgColor: { rgb: '4682B4' } },
          font: { bold: true, color: { rgb: 'FFFFFF' } },
          border: {
            top: { style: 'thin', color: { auto: 1 } },
            bottom: { style: 'thin', color: { auto: 1 } },
            left: { style: 'thin', color: { auto: 1 } },
            right: { style: 'thin', color: { auto: 1 } },
          },
        };
      }

      // Configurar estilo de las celdas de datos
      const datosRange = XLSX.utils.decode_range(hoja['!ref']);
      for (let i = datosRange.s.r + 1; i <= datosRange.e.r; i++) {
        for (let j = datosRange.s.c; j <= datosRange.e.c; j++) {
          const ref = XLSX.utils.encode_cell({ r: i, c: j });
          hoja[ref].s = {
            border: {
              top: { style: 'thin', color: { auto: 1 } },
              bottom: { style: 'thin', color: { auto: 1 } },
              left: { style: 'thin', color: { auto: 1 } },
              right: { style: 'thin', color: { auto: 1 } },
            },
          };
        }
      }
      // Crear un libro de Excel y agregar la hoja
      if (datos.length > 0) {
        // Crear un libro de Excel y agregar la hoja
        const libro = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(libro, hoja, 'Tabla');

        // Descargar el archivo Excel
        XLSX.writeFile(libro, 'tabla.xlsx');
      } else {
        console.error(
          'No hay datos en la tabla para generar el archivo Excel.'
        );
      }
    }
  }
  getTablaData2(tabla: HTMLElement): any[][] {
    // Obtener las filas de la tabla
    const filas = Array.from(tabla.querySelectorAll('tr'));

    // Obtener los encabezados de columna
    const encabezados = filas.shift()?.querySelectorAll('th');

    // Obtener los datos de la tabla en un arreglo de arreglos
    const datos = filas.map((fila) =>
      Array.from(fila.querySelectorAll('td, th')).map((celda, index) => {
        // Parse numerical values for columns other than columns B (index 1), D (index 3), F (index 5) and H (index 7)
        if (this.mostrarReporte == 'ReporteEjecucion') {
          if (index !== 1 && index !== 3 && index !== 5 && index !== 6) {
            const textContent = celda.textContent;
            const numericValue =
              textContent !== null ? parseFloat(textContent) : null;
            return numericValue !== null && !isNaN(numericValue)
              ? numericValue
              : textContent;
          } else {
            return celda.textContent; // Keep columns B (index 1), F (index 5) and H (index 7) as textContent
          }
        } else {
          if (index !== 1 && index !== 3 && index !== 5 && index !== 6) {
            const textContent = celda.textContent;
            const numericValue =
              textContent !== null ? parseFloat(textContent) : null;
            return numericValue !== null && !isNaN(numericValue)
              ? numericValue
              : textContent;
          } else {
            return celda.textContent; // Keep columns B (index 1), F (index 5) and H (index 7) as textContent
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
  getTablaData(tabla: HTMLElement): any[][] {
    // Obtener las filas de la tabla
    const filas = Array.from(tabla.querySelectorAll('tr'));

    // Obtener los encabezados de columna
    const encabezados = filas.shift()?.querySelectorAll('th');

    // Obtener los datos de la tabla en un arreglo de arreglos
    const datos = filas.map((fila) =>
      Array.from(fila.querySelectorAll('td, th')).map((celda, index) => {
        // Parse numerical values for columns other than column D (index 3)
        if (this.mostrarReporte == 'ReporteEjecucion') {
          if (index !== 1 && index !== 3) {
            const textContent = celda.textContent;
            const numericValue =
              textContent !== null ? parseFloat(textContent) : null;
            return numericValue !== null && !isNaN(numericValue)
              ? numericValue
              : textContent;
          } else {
            return celda.textContent; // Keep column D (index 3) as textContent
          }
        } else {
          if (index !== 1 && index !== 3) {
            const textContent = celda.textContent;
            const numericValue =
              textContent !== null ? parseFloat(textContent) : null;
            return numericValue !== null && !isNaN(numericValue)
              ? numericValue
              : textContent;
          } else {
            return celda.textContent; // Keep column D (index 3) as textContent
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

  ejecutarResumenIngresos() {
    this.datosTabla.forEach((element: any) => {
      element.FUENTESDEFINANCIACION = '1.2.1.0.00';
      element.SITUACIONDEFONDOS = 'C';
      element.POLITICAPUBLICA = '0';
      element.TERCERO = '1';
    });
    const busqueda = this.datosTabla.reduce((acc: any, codigo: any) => {
      acc[codigo.CODIGOPRESUPUESTAL.trim()] =
        ++acc[codigo.CODIGOPRESUPUESTAL.trim()] || 0;
      return acc;
    }, {});
    const duplicados = this.datosTabla.filter((codigo: any) => {
      return busqueda[codigo.CODIGOPRESUPUESTAL.trim()];
    });
    const unicos: any = [];

    for (var i = 0; i < duplicados.length; i++) {
      const elemento = duplicados[i].CODIGOPRESUPUESTAL.trim();
      if (!unicos.includes(duplicados[i].CODIGOPRESUPUESTAL.trim())) {
        unicos.push(elemento);
      }
    }
    let arreglosDuplicados: any = [];
    unicos.forEach((element: any) => {
      const arreglosSeparados = this.datosTabla.filter(
        (campo: any) => campo.CODIGOPRESUPUESTAL.trim() == element.trim()
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
      let c = 0;
      let o = 0;
      for (let i = 0; i < element1; i++) {
        const element = element2[i];
        console.log()
        if (p == 0) {
          if (element.EJECUTADOCOMOOBLIGACION == undefined) {
            p = 0;
          } else {
            p = element.EJECUTADOCOMOOBLIGACION;
          }
          localStorage.setItem(
            element.CODIGOPRESUPUESTAL.trim(),
            JSON.stringify({
              codigo: element.CODIGOPRESUPUESTAL.trim(),
              valor: x,
              definitivo: w,
              PAGOS: y,
              EJECUTADOCOMOOBLIGACION: p,
              COMPROMETIDO: c,
            })
          );
          this.datosDuplicados.push({
            codigo: element.CODIGOPRESUPUESTAL.trim(),
            valor: x,
            definitivo: w,
            PAGOS: y,
            EJECUTADOCOMOOBLIGACION: p,
            COMPROMETIDO: c,
          });
        } else {
          p = p + element.EJECUTADOCOMOOBLIGACION;
          localStorage.setItem(
            element.CODIGOPRESUPUESTAL.trim(),
            JSON.stringify({
              codigo: element.CODIGOPRESUPUESTAL.trim(),
              PAGOS: y,
              valor: x,
              definitivo: w,
              EJECUTADOCOMOOBLIGACION: p,
              COMPROMETIDO: c,
            })
          );
          this.datosDuplicados.push({
            codigo: element.CODIGOPRESUPUESTAL.trim(),
            PAGOS: y,
            valor: x,
            definitivo: w,
            EJECUTADOCOMOOBLIGACION: p,
            COMPROMETIDO: c,
            OBLIGACIONES: o,
          });
        }
        if (o == 0) {
          if (element.OBLIGACIONES == undefined) {
            o = 0;
          } else {
            o = element.OBLIGACIONES;
          }
          localStorage.setItem(
            element.CODIGOPRESUPUESTAL.trim(),
            JSON.stringify({
              codigo: element.CODIGOPRESUPUESTAL.trim(),
              valor: x,
              definitivo: w,
              PAGOS: y,
              EJECUTADOCOMOOBLIGACION: p,
              COMPROMETIDO: c,
              OBLIGACIONES: o,
            })
          );
          this.datosDuplicados.push({
            codigo: element.CODIGOPRESUPUESTAL.trim(),
            valor: x,
            definitivo: w,
            PAGOS: y,
            EJECUTADOCOMOOBLIGACION: p,
            COMPROMETIDO: c,
            OBLIGACIONES: o,
          });
        } else {
          o = o + element.OBLIGACIONES;
          localStorage.setItem(
            element.CODIGOPRESUPUESTAL.trim(),
            JSON.stringify({
              codigo: element.CODIGOPRESUPUESTAL.trim(),
              PAGOS: y,
              valor: x,
              definitivo: w,
              EJECUTADOCOMOOBLIGACION: p,
              COMPROMETIDO: c,
              OBLIGACIONES: o,
            })
          );
          this.datosDuplicados.push({
            codigo: element.CODIGOPRESUPUESTAL.trim(),
            PAGOS: y,
            valor: x,
            definitivo: w,
            EJECUTADOCOMOOBLIGACION: p,
            COMPROMETIDO: c,
            OBLIGACIONES: o,
          });
        }
        if (w == 0) {
          if (element.PRESUPUESTODEFINITIVO == undefined) {
            w = 0;
          } else {
            w = element.PRESUPUESTODEFINITIVO;
          }
          localStorage.setItem(
            element.CODIGOPRESUPUESTAL.trim(),
            JSON.stringify({
              codigo: element.CODIGOPRESUPUESTAL.trim(),
              valor: x,
              definitivo: w,
              PAGOS: y,
              EJECUTADOCOMOOBLIGACION: p,
              COMPROMETIDO: c,
              OBLIGACIONES: o,
            })
          );
          this.datosDuplicados.push({
            codigo: element.CODIGOPRESUPUESTAL.trim(),
            valor: x,
            definitivo: w,
            PAGOS: y,
            EJECUTADOCOMOOBLIGACION: p,
            COMPROMETIDO: c,
            OBLIGACIONES: o,
          });
        } else {
          w = w + element.PRESUPUESTODEFINITIVO;
          localStorage.setItem(
            element.CODIGOPRESUPUESTAL.trim(),
            JSON.stringify({
              codigo: element.CODIGOPRESUPUESTAL.trim(),
              valor: x,
              definitivo: w,
              PAGOS: y,
              EJECUTADOCOMOOBLIGACION: p,
              COMPROMETIDO: c,
              OBLIGACIONES: o,
            })
          );
          this.datosDuplicados.push({
            codigo: element.CODIGOPRESUPUESTAL.trim(),
            valor: x,
            definitivo: w,
            PAGOS: y,
            EJECUTADOCOMOOBLIGACION: p,
            COMPROMETIDO: c,
            OBLIGACIONES: o,
          });
        }
        if (y == 0) {
          if (element.PAGOS == undefined) {
            y = 0;
          } else {
            y = element.PAGOS;
          }
          localStorage.setItem(
            element.CODIGOPRESUPUESTAL.trim(),
            JSON.stringify({
              codigo: element.CODIGOPRESUPUESTAL.trim(),
              valor: x,
              definitivo: w,
              PAGOS: y,
              EJECUTADOCOMOOBLIGACION: p,
              COMPROMETIDO: c,
              OBLIGACIONES: o,
            })
          );
          this.datosDuplicados.push({
            codigo: element.CODIGOPRESUPUESTAL.trim(),
            valor: x,
            definitivo: w,
            PAGOS: y,
            EJECUTADOCOMOOBLIGACION: p,
            COMPROMETIDO: c,
            OBLIGACIONES: o,
          });
        } else {
          y = y + element.PAGOS;
          localStorage.setItem(
            element.CODIGOPRESUPUESTAL.trim(),
            JSON.stringify({
              codigo: element.CODIGOPRESUPUESTAL.trim(),
              PAGOS: y,
              valor: x,
              definitivo: w,
              EJECUTADOCOMOOBLIGACION: p,
              COMPROMETIDO: c,
              OBLIGACIONES: o,
            })
          );
          this.datosDuplicados.push({
            codigo: element.CODIGOPRESUPUESTAL.trim(),
            PAGOS: y,
            valor: x,
            definitivo: w,
            EJECUTADOCOMOOBLIGACION: p,
            COMPROMETIDO: c,
            OBLIGACIONES: o,
          });
        }
        if (c == 0) {
          if (element.COMPROMETIDO == undefined) {
            c = 0;
          } else {
            c = element.COMPROMETIDO;
          }
          localStorage.setItem(
            element.CODIGOPRESUPUESTAL.trim(),
            JSON.stringify({
              codigo: element.CODIGOPRESUPUESTAL.trim(),
              valor: x,
              definitivo: w,
              PAGOS: y,
              EJECUTADOCOMOOBLIGACION: p,
              COMPROMETIDO: c,
              OBLIGACIONES: o,
            })
          );
          this.datosDuplicados.push({
            codigo: element.CODIGOPRESUPUESTAL.trim(),
            valor: x,
            definitivo: w,
            PAGOS: y,
            EJECUTADOCOMOOBLIGACION: p,
            COMPROMETIDO: c,
            OBLIGACIONES: o,
          });
        } else {
          c = c + element.COMPROMETIDO;
          localStorage.setItem(
            element.CODIGOPRESUPUESTAL.trim(),
            JSON.stringify({
              codigo: element.CODIGOPRESUPUESTAL.trim(),
              PAGOS: y,
              valor: x,
              definitivo: w,
              EJECUTADOCOMOOBLIGACION: p,
              COMPROMETIDO: c,
              OBLIGACIONES: o,
            })
          );
          this.datosDuplicados.push({
            codigo: element.CODIGOPRESUPUESTAL.trim(),
            PAGOS: y,
            valor: x,
            definitivo: w,
            EJECUTADOCOMOOBLIGACION: p,
            COMPROMETIDO: c,
            OBLIGACIONES: o,
          });
        }
        if (x == 0) {
          if (element.APROPIACIONINICIAL == undefined) {
            x = 0;
          } else {
            x = element.APROPIACIONINICIAL;
          }
          localStorage.setItem(
            element.CODIGOPRESUPUESTAL.trim(),
            JSON.stringify({
              codigo: element.CODIGOPRESUPUESTAL.trim(),
              valor: x,
              definitivo: w,
              PAGOS: y,
              EJECUTADOCOMOOBLIGACION: p,
              COMPROMETIDO: c,
              OBLIGACIONES: o,
            })
          );
          this.datosDuplicados.push({
            codigo: element.CODIGOPRESUPUESTAL.trim(),
            valor: x,
            definitivo: w,
            PAGOS: y,
            EJECUTADOCOMOOBLIGACION: p,
            COMPROMETIDO: c,
            OBLIGACIONES: o,
          });
        } else {
          x = x + element.APROPIACIONINICIAL;
          localStorage.setItem(
            element.CODIGOPRESUPUESTAL.trim(),
            JSON.stringify({
              codigo: element.CODIGOPRESUPUESTAL.trim(),
              valor: x,
              definitivo: w,
              PAGOS: y,
              EJECUTADOCOMOOBLIGACION: p,
              COMPROMETIDO: c,
              OBLIGACIONES: o,
            })
          );
          this.datosDuplicados.push({
            codigo: element.CODIGOPRESUPUESTAL.trim(),
            valor: x,
            definitivo: w,
            PAGOS: y,
            EJECUTADOCOMOOBLIGACION: p,
            COMPROMETIDO: c,
            OBLIGACIONES: o,
          });
        }
      }
    }
    this.extrayendoDuplicadosSumados();
  }
  elementoRepite(valor: any) {
    let vecesRepetidas = 0;
    for (let i of this.sinDuplicados) {
      if (i.codigo == valor) {
        vecesRepetidas++;
        if (vecesRepetidas > 0) {
          return true;
          break;
        }
      }
    }
    return false;
  }
  extrayendoDuplicadosSumados() {
    this.datosDuplicados.forEach((i: any) => {
      if (!this.elementoRepite(i.codigo)) {
        this.sinDuplicados.push(i);
      }
    });
    let arraydeDuplicados: any = [];
    this.sinDuplicados.forEach((element: any) => {
      let x: any = localStorage.getItem(element.codigo);
      x = JSON.parse(x);
      arraydeDuplicados = [...arraydeDuplicados, x];
      localStorage.setItem(
        'duplicadosIngresos',
        JSON.stringify(arraydeDuplicados)
      );
    });
    for (let index = 0; index < arraydeDuplicados.length; index++) {
      let x = this.datosTabla.filter(
        (element: any) =>
          element.CODIGOPRESUPUESTAL.trim() == arraydeDuplicados[index].codigo
      );
      x.forEach((element: any) => {
        element.APROPIACIONINICIAL = arraydeDuplicados[index].valor;
        element.PAGOS = arraydeDuplicados[index].PAGOS;
        element.PRESUPUESTODEFINITIVO = arraydeDuplicados[index].definitivo;
        element.EJECUTADOCOMOOBLIGACION =
          arraydeDuplicados[index].EJECUTADOCOMOOBLIGACION;
        element.COMPROMETIDO = arraydeDuplicados[index].COMPROMETIDO;
        element.OBLIGACIONES = arraydeDuplicados[index].OBLIGACIONES;
        this.elementosUnificados = this.datosTabla.map((element1: any) =>
          element1.CODIGOPRESUPUESTAL.trim() ==
          element.CODIGOPRESUPUESTAL.trim()
            ? element
            : element1
        );
      });

      let objetoSinRepetidos: any = {};
      this.elementosUnificados.forEach(function (elemento: any) {
        objetoSinRepetidos[elemento.CODIGOPRESUPUESTAL.trim()] = elemento;
      });

      let arregloSinRepetidos = Object.values(objetoSinRepetidos);
      this.datosTabla = arregloSinRepetidos;
    }
    if (this.ejecucion == 0) {
      this.ejecucion = 1;
      this.ejecutarResumenIngresos();
    } else {
      this.mostrarBoton = 1;
      this.ejecucion = 0;
      this.ejecutarModeloDeResumidos(this.contadormodelo);
      //   localStorage.clear()
    }
  }

  ejecutarModeloDeResumidos(contadorValor: any) {
    const busqueda = this.datosTabla.reduce((acc: any, codigo: any) => {
      acc[codigo.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor)] =
        ++acc[codigo.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor)] || 0;
      return acc;
    }, {});
    const duplicados = this.datosTabla.filter((codigo: any) => {
      return busqueda[codigo.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor)];
    });
    let unicos: any = [];
    for (var i = 0; i < duplicados.length; i++) {
      const elemento = duplicados[i].CODIGOPRESUPUESTAL.trim().slice(
        0,
        contadorValor
      );
      if (
        !unicos.includes(
          duplicados[i].CODIGOPRESUPUESTAL.trim().slice(0, contadorValor)
        )
      ) {
        unicos.push(elemento);
        console.log(unicos)
        if (this.contadormodelo == 5) {
          unicos.push(
            '2.1.7',
            '2.1.5',
            '2.1.2',
            '2.99',
            '2.3.1',
            '2.1.3',
            '2.3.2',
            '2.3.5',
            '2.3.3',
            '2.3.8'
          );
        }
        if (this.contadormodelo == 8) {
          unicos.push(
            '2.1.5.02',
            '2.1.3.13',
            '2.1.8.04',
            '2.1.5.01',
            '2.1.1.01',
            '2.1.3.08',
            '2.1.1.02',
            '2.1.2.02',
            '2.1.3.04',
            '2.1.3.07',
            '2.1.7.01',
            '2.1.8.01',
            '2.3.2.01',
            '2.3.1.01'
          );
        }
        if (this.contadormodelo == 11) {
          unicos.push(
            '2.1.3.13.01',
            '2.3.2.02.02',
            '2.3.2.02.01',
            '2.3.2.02',
            '2.3.1.01.01',
            '2.1.1.01.01',
            '2.1.1.01.02',
            '2.1.1.01.03',
            '2.1.1.02.01',
            '2.1.1.02.02',
            '2.1.1.02.03',
            '2.1.2.02.01',
            '2.1.2.02.02',
            '2.1.2.02.03',
            '2.1.3.04.05',
            '2.1.3.07.02',
            '2.3.2.01.01',
            '2.3.8.01.53',
            '2.3.8.03.02'
          );
        }
        if (this.contadormodelo == 15) {
          unicos.push(
            '2.1.3.07.02.003',
            '2.1.1.01.01.002',
            '2.3.1.01.01.001',
            '2.1.2.02.02.006',
            '2.1.2.02.01.003',
            '2.1.2.02.01.004',
            '2.1.2.02.01.001',
            '2.1.2.02.01.002',
            '2.1.2.02.01.000',
            '2.1.3.07.02.001',
            '2.1.3.07.02.002',
            '2.1.3.07.02.010',
            '2.1.1.01.01.001',
            '2.1.1.01.03.001',
            '2.1.1.02.01.001',
            '2.1.1.02.03.001',
            '2.1.1.02.03.035',
            '2.3.2.01.01.001',
            '2.3.2.01.01.003',
            '2.3.2.01.01.005',
            '2.1.1.01.03.083',
            '2.1.1.01.03.020',
            '2.1.2.02.02.005',
            '2.1.2.02.02.006',
            '2.1.2.02.02.007',
            '2.1.2.02.02.008',
            '2.1.2.02.02.009'
          );
        }
        if (this.contadormodelo == 18) {
          unicos.push(
            '2.1.3.07.02.003.01',
            '2.1.1.02.01.001.01',
            '2.1.3.07.02.003.02',
            '2.1.1.02.01.001.02',
            '2.1.1.02.01.001.03',
            '2.1.1.02.01.001.04',
            '2.1.1.02.01.001.05',
            '2.1.1.02.01.001.06',
            '2.1.1.02.01.001.07',
            '2.1.1.02.01.001.08',
            '2.1.1.01.01.001.01',
                 '2.1.1.01.01.001.08.01',
            '2.1.1.01.01.001.08.02',
            '2.1.1.01.01.001.02',
            '2.1.1.01.01.001.05',
            '2.1.1.01.01.001.07',
            '2.1.1.02.01.001.08',
            '2.3.2.01.01.001.02.07',
            '2.3.2.01.01.001.02',
            '2.3.2.01.01.003.03',
            '2.1.1.02.01.001.07',
            '2.1.1.01.01.001.06',
            '2.3.2.01.01.005.02.03.01',
            '2.3.2.01.01.005.02.03',
            '2.3.2.01.01.005.02',
            '2.3.2.01.01.003.06',
            '2.3.2.01.01.003.02',
            '2.3.1.01.01.001.07',
            '2.1.1.01.01.001.04',
            '2.1.1.01.01.002.12',
            '2.1.1.01.01.001.08',
            '2.3.2.01.01.003.03.01',
            '2.3.2.01.01.003.03.02',
            '2.3.2.01.01.003.05',
            '2.3.2.01.01.003.01',
            '2.3.2.01.01.003.02',
            '2.3.2.01.01.003.03',
            '2.3.2.01.01.003.04',
            '2.1.3.07.02.010.01',
            '2.1.3.07.02.010.02',
            '1.1.02.05.001.08.03.01',

          );
        }
        this.unicosmodelo = unicos;
      }
    }
    if (contadorValor == 1) {
      console.log('nada');
    } else {
      let x = unicos.filter((element: any) => element.length == contadorValor);
      unicos = x;
      this.unicosmodelo = x;
    }
    let arreglosDuplicados: any = [];
    if (this.contadorPrimerArreglo == 0) {
      this.contadorPrimerArreglo = 1;
      this.arregloGrande = this.datosTabla;
    }

    let x = 0;
    this.datosTabla.forEach((element: any) => {
      x = x + element.APROPIACIONINICIAL;
    });
    unicos.forEach((element: any) => {
      const arreglosSeparados = this.arregloGrande.filter(
        (campo: any) =>
          campo.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor) ==
          element.trim()
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
      let c = 0;
      let o = 0;
      for (let i = 0; i < element1; i++) {
        const element = element2[i];
        if (o == 0) {
          if (element.OBLIGACIONES == undefined) {
            o = 0;
          } else {
            o = element.OBLIGACIONES;
          }
          localStorage.setItem(
            element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
            JSON.stringify({
              codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
              valor: x,
              definitivo: w,
              PAGOS: y,
              EJECUTADOCOMOOBLIGACION: p,
              COMPROMETIDO: c,
              OBLIGACIONES: o,
            })
          );
          this.datosDuplicados.push({
            codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
            valor: x,
            definitivo: w,
            PAGOS: y,
            EJECUTADOCOMOOBLIGACION: p,
            COMPROMETIDO: c,
            OBLIGACIONES: o,
          });
        } else {
          o = o + element.OBLIGACIONES;
          localStorage.setItem(
            element.CODIGOPRESUPUESTAL.trim(),
            JSON.stringify({
              codigo: element.CODIGOPRESUPUESTAL.trim(),
              PAGOS: y,
              valor: x,
              definitivo: w,
              EJECUTADOCOMOOBLIGACION: p,
              COMPROMETIDO: c,
              OBLIGACIONES: o,
            })
          );
          this.datosDuplicados.push({
            codigo: element.CODIGOPRESUPUESTAL.trim(),
            PAGOS: y,
            valor: x,
            definitivo: w,
            EJECUTADOCOMOOBLIGACION: p,
            COMPROMETIDO: c,
            OBLIGACIONES: o,
          });
        }
        if (p == 0) {
          if (element.EJECUTADOCOMOOBLIGACION == undefined) {
            p = 0;
          } else {
            p = element.EJECUTADOCOMOOBLIGACION;
          }
          console.log;
          localStorage.setItem(
            element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
            JSON.stringify({
              codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
              PAGOS: y,
              valor: x,
              definitivo: w,
              EJECUTADOCOMOOBLIGACION: p,
              COMPROMETIDO: c,
              OBLIGACIONES: o,
            })
          );
          this.datosDuplicados.push({
            codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
            PAGOS: y,
            valor: x,
            definitivo: w,
            EJECUTADOCOMOOBLIGACION: p,
            COMPROMETIDO: c,
            OBLIGACIONES: o,
          });
        } else {
          p = p + element.EJECUTADOCOMOOBLIGACION;
          localStorage.setItem(
            element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
            JSON.stringify({
              codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
              PAGOS: y,
              valor: x,
              definitivo: w,
              EJECUTADOCOMOOBLIGACION: p,
              COMPROMETIDO: c,
              OBLIGACIONES: o,
            })
          );
          this.datosDuplicados.push({
            codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
            PAGOS: y,
            valor: x,
            definitivo: w,
            EJECUTADOCOMOOBLIGACION: p,
            COMPROMETIDO: c,
            OBLIGACIONES: o,
          });
        }
        if (w == 0) {
          if (element.PRESUPUESTODEFINITIVO == undefined) {
            w = 0;
          } else {
            w = element.PRESUPUESTODEFINITIVO;
          }
          localStorage.setItem(
            element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
            JSON.stringify({
              codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
              PAGOS: y,
              valor: x,
              definitivo: w,
              EJECUTADOCOMOOBLIGACION: p,
              COMPROMETIDO: c,
              OBLIGACIONES: o,
            })
          );
          this.datosDuplicados.push({
            codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
            PAGOS: y,
            valor: x,
            definitivo: w,
            EJECUTADOCOMOOBLIGACION: p,
            COMPROMETIDO: c,
            OBLIGACIONES: o,
          });
        } else {
          w = w + element.PRESUPUESTODEFINITIVO;
          localStorage.setItem(
            element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
            JSON.stringify({
              codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
              valor: x,
              definitivo: w,
              PAGOS: y,
              EJECUTADOCOMOOBLIGACION: p,
              COMPROMETIDO: c,
              OBLIGACIONES: o,
            })
          );
          this.datosDuplicados.push({
            codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
            valor: x,
            definitivo: w,
            PAGOS: y,
            EJECUTADOCOMOOBLIGACION: p,
            COMPROMETIDO: c,
            OBLIGACIONES: o,
          });
        }
        if (y == 0) {
          if (element.PAGOS == undefined) {
            y = 0;
          } else {
            y = element.PAGOS;
          }
          localStorage.setItem(
            element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
            JSON.stringify({
              codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
              PAGOS: y,
              valor: x,
              definitivo: w,
              EJECUTADOCOMOOBLIGACION: p,
              COMPROMETIDO: c,
              OBLIGACIONES: o,
            })
          );
          this.datosDuplicados.push({
            codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
            PAGOS: y,
            valor: x,
            definitivo: w,
            EJECUTADOCOMOOBLIGACION: p,
            COMPROMETIDO: c,
            OBLIGACIONES: o,
          });
        } else {
          y = y + element.PAGOS;
          localStorage.setItem(
            element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
            JSON.stringify({
              codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
              PAGOS: y,
              valor: x,
              definitivo: w,
              EJECUTADOCOMOOBLIGACION: p,
              COMPROMETIDO: c,
              OBLIGACIONES: o,
            })
          );
          this.datosDuplicados.push({
            codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
            PAGOS: y,
            valor: x,
            definitivo: w,
            EJECUTADOCOMOOBLIGACION: p,
            COMPROMETIDO: c,
            OBLIGACIONES: o,
          });
        }
        if (c == 0) {
          if (element.COMPROMETIDO == undefined) {
            c = 0;
          } else {
            c = element.COMPROMETIDO;
          }
          localStorage.setItem(
            element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
            JSON.stringify({
              codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
              PAGOS: y,
              valor: x,
              definitivo: w,
              EJECUTADOCOMOOBLIGACION: p,
              COMPROMETIDO: c,
              OBLIGACIONES: o,
            })
          );
          this.datosDuplicados.push({
            codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
            PAGOS: y,
            valor: x,
            definitivo: w,
            EJECUTADOCOMOOBLIGACION: p,
            COMPROMETIDO: c,
            OBLIGACIONES: o,
          });
        } else {
          c = c + element.COMPROMETIDO;
          localStorage.setItem(
            element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
            JSON.stringify({
              codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
              PAGOS: y,
              valor: x,
              definitivo: w,
              EJECUTADOCOMOOBLIGACION: p,
              COMPROMETIDO: c,
              OBLIGACIONES: o,
            })
          );
          this.datosDuplicados.push({
            codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
            PAGOS: y,
            valor: x,
            definitivo: w,
            EJECUTADOCOMOOBLIGACION: p,
            COMPROMETIDO: c,
            OBLIGACIONES: o,
          });
        }
        if (x == 0) {
          if (element.APROPIACIONINICIAL == undefined) {
            x = 0;
          } else {
            x = element.APROPIACIONINICIAL;
          }
          localStorage.setItem(
            element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
            JSON.stringify({
              codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
              PAGOS: y,
              valor: x,
              definitivo: w,
              EJECUTADOCOMOOBLIGACION: p,
              COMPROMETIDO: c,
              OBLIGACIONES: o,
            })
          );
          this.datosDuplicados.push({
            codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
            PAGOS: y,
            valor: x,
            definitivo: w,
            EJECUTADOCOMOOBLIGACION: p,
            COMPROMETIDO: c,
            OBLIGACIONES: o,
          });
        } else {
          x = x + element.APROPIACIONINICIAL;
          localStorage.setItem(
            element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
            JSON.stringify({
              codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
              valor: x,
              definitivo: w,
              PAGOS: y,
              EJECUTADOCOMOOBLIGACION: p,
              COMPROMETIDO: c,
              OBLIGACIONES: o,
            })
          );
          this.datosDuplicados.push({
            codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),
            valor: x,
            definitivo: w,
            PAGOS: y,
            EJECUTADOCOMOOBLIGACION: p,
            COMPROMETIDO: c,
            OBLIGACIONES: o,
          });
        }
      }
    }

    this.contadormodelo = this.contadormodelo - 1;

    this.extrayendoDuplicadosSumadosMODELO();
  }
  extrayendoDuplicadosSumadosMODELO() {
    let arraydeDuplicados: any = [];
    this.unicosmodelo.forEach((element: any) => {
      let x: any = localStorage.getItem(element);
      if (x != null) {
        x = JSON.parse(x);
        arraydeDuplicados = [...arraydeDuplicados, x];
      }
      localStorage.setItem(
        'duplicadosIngresos',
        JSON.stringify(arraydeDuplicados)
      );
    });
    for (let index = 0; index < arraydeDuplicados.length; index++) {
      if (arraydeDuplicados[index].codigo === '2.1.1.01.01.001.08.01') {
      }
      let x = this.modeloInformacion.filter(
        (element: any) =>
          element.CODIGOPRESUPUESTAL.trim() == arraydeDuplicados[index].codigo
      );
      x.forEach((element: any) => {
        element.APROPIACIONINICIAL = arraydeDuplicados[index].valor;
        element.PAGOS = arraydeDuplicados[index].PAGOS;
        element.PRESUPUESTODEFINITIVO = arraydeDuplicados[index].definitivo;
        element.EJECUTADOCOMOOBLIGACION =
          arraydeDuplicados[index].EJECUTADOCOMOOBLIGACION;
        element.COMPROMETIDO = arraydeDuplicados[index].COMPROMETIDO;
        element.OBLIGACIONES = arraydeDuplicados[index].OBLIGACIONES;
        // if(element.CODIGOPRESUPUESTAL == "1.1.02.05.001.08" && element.CODIGOPRESUPUESTAL == "1.1.02.05.001.09" && element.CODIGOPRESUPUESTAL == "1.1.02.05.001.02" && element.CODIGOPRESUPUESTAL == "1.1.02.05.001.00"){

        // }
        if (element.CODIGOPRESUPUESTAL == '2.1.2.02.01.003') {
          element.CPC = '3212102';
        } else {
          element.CPC = 0;
        }
        element.SITUACIONDEFONDOS = 0;
        element.POLITICAPUBLICA = 0;
        if (
          element.CODIGOPRESUPUESTAL == '2.1.1.01.01.001.04' ||
          element.CODIGOPRESUPUESTAL == '2.1.1.01.01.001.06' ||
          element.CODIGOPRESUPUESTAL == '2.1.1.02.01.001.07' ||
          element.CODIGOPRESUPUESTAL == '2.1.2.02.01.003'
        ) {
          element.FUENTESDEFINANCIACION = '1.2.1.0.00';
          element.SITUACIONDEFONDOS = 'C';
        } else {
          element.FUENTESDEFINANCIACION = 0;
        }
        if (element.CODIGOPRESUPUESTAL == '2.3') {
          this.valor = arraydeDuplicados[index].valor;
          this.valorDefinitivo = arraydeDuplicados[index].definitivo;
        }
        element.TERCERO = '1';
        this.elementosUnificados = this.modeloInformacion.map((element1: any) =>
          element1.CODIGOPRESUPUESTAL == element.CODIGOPRESUPUESTAL
            ? element
            : element1
        );
      });
    }
    this.modeloInformacion.forEach((element: any) => {
      //  let x =  this.datosTabla.filter((element1:any) => element1.RUBROPRESUPEUSTAL !== element.RUBROPRESUPEUSTAL.trim())
      this.datosTabla = this.datosTabla.filter(
        (element1: any) =>
          element1.CODIGOPRESUPUESTAL != element.CODIGOPRESUPUESTAL.trim()
      );
    });
    this.elementosUnificados.forEach((element: any) => {
      element.CODIGOPRESUPUESTAL = element.CODIGOPRESUPUESTAL.trim();
    });
    this.datosTabla.forEach((element: any) => {
      element.CODIGOPRESUPUESTAL = element.CODIGOPRESUPUESTAL.trim();
    });
    if (this.contadormodelo == 0) {
      const mergedArray = this.datosTabla.concat(this.elementosUnificados);
      mergedArray.sort((a: any, b: any) => {
        const aCodeArray: any = a.CODIGOPRESUPUESTAL.split('.');
        const bCodeArray: any = b.CODIGOPRESUPUESTAL.split('.');

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
          return 1; // b viene antes que a
        } else {
          return 0; // ambos códigos son iguales
        }
      });
      this.datosTabla = mergedArray;
      this.baseInformes = mergedArray;
      this.datosTabla.forEach((element: any) => {
        if (element.CODIGOPRESUPUESTAL == '2.99') {
          element.APROPIACIONINICIAL = this.valor;
          element.PRESUPUESTODEFINITIVO = this.valorDefinitivo;
        }
      });
      this.baseInformes.forEach((element: any) => {
        if (element.CODIGOPRESUPUESTAL == '2.99') {
          element.APROPIACIONINICIAL = this.valor;
          element.PRESUPUESTODEFINITIVO = this.valorDefinitivo;
        }
      });
      if (this.titulo == 'gastos') {
        this.actualizarTabla();
      }
    } else {
      this.ejecutarModeloDeResumidos(this.contadormodelo);
    }
  }
  limpiarTabla() {
    this.datosTabla.forEach((element: any) => {
      if (this.titulo == 'pagos') {
        if (
          element.APROPIACIONINICIAL == 0 &&
          element.PRESUPUESTODEFINITIVO == 0 &&
          element.PAGOS == 0 &&
          element.OBLIGACIONES == 0
        ) {
          this.datosTabla = this.datosTabla.filter(
            (x: any) =>
              x.CODIGOPRESUPUESTAL !== element.CODIGOPRESUPUESTAL.trim()
          );
        }
      }
      if (this.titulo == 'reservas' || this.titulo == 'cuentas') {
        if (
          element.APROPIACIONINICIAL == 0 &&
          element.PRESUPUESTODEFINITIVO == 0 &&
          element.PAGOS == 0
        ) {
          this.datosTabla = this.datosTabla.filter(
            (x: any) =>
              x.CODIGOPRESUPUESTAL !== element.CODIGOPRESUPUESTAL.trim()
          );
        }
      }
    });
  }
  actualizarTabla() {
    for (let index = 0; index < this.datosTabla.length; index++) {
      if (this.datosTabla[index]) {
        let x = [];
        const sumatoria =
          (this.datosTabla[index].COMPROMETIDO || 0) +
          (this.datosTabla[index].EJECUTADOCOMOOBLIGACION || 0);
        x.push(sumatoria);
        this.datosTabla[index].COMPROMISO = x[0];
      }
    }
    Promise.resolve().then(() => {
      console.log('hola');
      // this.formatearNumeros();
    });
  }
  // formatearNumeros(): any[] {
  //   for (const objeto of this.datosTabla) {
  //     objeto.APROPIACIONINICIAL = (objeto.APROPIACIONINICIAL != null && objeto.APROPIACIONINICIAL != undefined) ? objeto.APROPIACIONINICIAL.toString().replace(/\./g, ',') + (objeto.APROPIACIONINICIAL % 1 === 0 ? ',0' : '') : '0,00';
  //     objeto.PAGOS = (objeto.PAGOS != null && objeto.PAGOS != undefined) ? objeto.PAGOS.toString().replace(/\./g, ',') + (objeto.PAGOS % 1 === 0 ? ',0' : '') : '0,00';
  //     objeto.PRESUPUESTODEFINITIVO = (objeto.PRESUPUESTODEFINITIVO != null && objeto.PRESUPUESTODEFINITIVO != undefined) ? objeto.PRESUPUESTODEFINITIVO.toString().replace(/\./g, ',') + (objeto.PRESUPUESTODEFINITIVO % 1 === 0 ? ',0' : '') : '0,00';
  //     objeto.EJECUTADOCOMOOBLIGACION = (objeto.EJECUTADOCOMOOBLIGACION != null && objeto.EJECUTADOCOMOOBLIGACION != undefined) ? objeto.EJECUTADOCOMOOBLIGACION.toString().replace(/\./g, ',') + (objeto.EJECUTADOCOMOOBLIGACION % 1 === 0 ? ',0' : '') : '0,00';
  //     objeto.COMPROMETIDO = (objeto.COMPROMETIDO != null && objeto.COMPROMETIDO != undefined) ? objeto.COMPROMETIDO.toString().replace(/\./g, ',') + (objeto.COMPROMETIDO % 1 === 0 ? ',0' : '') : '0,00';
  //     objeto.COMPROMISO = (objeto.COMPROMISO != null && objeto.COMPROMISO != undefined) ? objeto.COMPROMISO.toString().replace(/\./g, ',') + (objeto.COMPROMISO % 1 === 0 ? ',0' : '') : '0,00';
  //   }
  //   return this.datosTabla;
  // }
  ejecutarProgramacion(tipoReporte: any) {
    this.mostrarReporte = tipoReporte;
    this.datosTabla = this.baseInformes;
  }
  ejecutarREPORTEProgramacion(tipoReporte: any) {
    console.log(tipoReporte);
    this.datosTabla = this.baseInformes;
    let x: any = [];
    if (this.titulo == 'cuentas') {
      this.codigosModeloReporteCuentas.forEach((element) => {
        let y = this.datosTabla.filter(
          (codigo: any) => codigo.CODIGOPRESUPUESTAL == element.CODIGO
        );
        x.push(y[0]);
        console.log(x);
      });
      console.log(this.datosTabla);
    } else {
      if (this.titulo == 'reservas' && tipoReporte == 'ReporteEjecucion') {
        this.codigoModeloEjecReservas.forEach((element) => {
          let y = this.datosTabla.filter(
            (codigo: any) => codigo.CODIGOPRESUPUESTAL == element.codigo
          );
          if (y.length >= 1) {
            x.push(y[0]);
          }
        });
        console.log(x);
      } else {
        if (this.titulo == 'reservas' && tipoReporte == 'ReporteProgramacion') {
          this.codigoModeloReporteReservas.forEach((element) => {
            let y = this.datosTabla.filter(
              (codigo: any) =>
                codigo.CODIGOPRESUPUESTAL == element.CODIGO.trim()
            );
            if (y.length >= 1) {
              x.push(y[0]);
            }
          });
        } else {
          if (this.titulo == 'gastos' && tipoReporte == 'ReporteProgramacion') {
            this.codigosModeloReporte.forEach((element) => {
              let y = this.datosTabla.filter(
                (codigo: any) =>
                  codigo.CODIGOPRESUPUESTAL == element.CODIGO.trim()
              );
              if (y.length >= 1) {
                x.push(y[0]);
              }
            });
          } else {
            if (this.titulo == 'gastos' && tipoReporte == 'ReporteEjecucion') {
              this.codigosModeloReporteEjecucionGastos.forEach((element) => {
                let y = this.datosTabla.filter(
                  (codigo: any) =>
                    codigo.CODIGOPRESUPUESTAL == element.CODIGO.trim()
                );
                if (y.length >= 1) {
                  x.push(y[0]);
                }
              });
            }
          }
        }
      }
    }
    this.datosTabla = x;
    if (this.titulo == 'gastos' && tipoReporte == 'ReporteEjecucion') {
      this.datosTabla.forEach((element: any) => {
        if (element.CODIGOPRESUPUESTAL) {
          if (
            element.CODIGOPRESUPUESTAL == '2.3.2.01.01.003.02' ||
            element.CODIGOPRESUPUESTAL == '2.3.2.01.01.005.02.03' ||
            element.CODIGOPRESUPUESTAL == '2.3.2.01.01.003.03.01' ||
            element.CODIGOPRESUPUESTAL == '2.3.2.01.01.003.03.02' ||
            element.CODIGOPRESUPUESTAL == '2.3.2.01.01.005.02.03.01' ||
            element.CODIGOPRESUPUESTAL == '2.3.1.01.01.001' ||
            element.CODIGOPRESUPUESTAL == '2.3.1.01.01.001.07' ||
            element.CODIGOPRESUPUESTAL == '2.3.2.01.01.001.02.07'
          ) {
            element.FUENTESDEFINANCIACION = '1.2.1.0.00';
            element.CPC = 0;
            element.SITUACIONDEFONDOS = 'C';
            element.POLITICAPUBLICA = 0;
            element.TERCERO = 1;
          }
        }
      });
    }
    for (let i = 0; i < this.datosTabla.length; i++) {
      if (this.datosTabla[i] == undefined) {
        console.log('hola');
      }
      if (this.datosTabla[i].CODIGOPRESUPUESTAL) {
        if (
          (this.titulo == 'gastos' && tipoReporte == 'ReporteEjecucion') ||
          (this.titulo == 'gastos' && tipoReporte == 'ReporteProgramacion')
        ) {
          if (
            this.datosTabla[i].CODIGOPRESUPUESTAL &&
            this.datosTabla[i].APROPIACIONINICIAL !== 0 &&
            this.datosTabla[i].PAGOS !== '0' &&
            this.datosTabla[i].COMPROMETIDO !== '0' &&
            this.datosTabla[i].EJECUTADOCOMOOBLIGACION !== 0 &&
            this.datosTabla[i].COMPROMETIDO !== 0 &&
            this.datosTabla[i].PRESUPUESTODEFINITIVO !== 0 &&
            this.datosTabla[i].COMPROMISO !== 0
          ) {
            if (
              this.datosTabla[i].APROPIACIONINICIAL !== undefined ||
              this.datosTabla[i].APROPIACIONINICIAL !== null
            ) {
              this.datosTabla[i].APROPIACIONINICIAL = parseFloat(
                this.datosTabla[i].APROPIACIONINICIAL.toFixed(2)
              );
            }
            if (
              this.datosTabla[i].PAGOS !== undefined ||
              this.datosTabla[i].PAGOS !== null
            ) {
              this.datosTabla[i].PAGOS = parseFloat(
                this.datosTabla[i].PAGOS.toFixed(2)
              );
            }
            if (
              this.datosTabla[i].COMPROMISO !== undefined ||
              this.datosTabla[i].COMPROMISO !== null
            ) {
              this.datosTabla[i].COMPROMISO = parseFloat(
                this.datosTabla[i].COMPROMISO.toFixed(2)
              );
            }
            if (
              this.datosTabla[i].PRESUPUESTODEFINITIVO !== undefined ||
              this.datosTabla[i].PRESUPUESTODEFINITIVO !== null
            ) {
              this.datosTabla[i].PRESUPUESTODEFINITIVO = parseFloat(
                this.datosTabla[i].PRESUPUESTODEFINITIVO.toFixed(2)
              );
            }
            if (
              this.datosTabla[i].EJECUTADOCOMOOBLIGACION !== undefined ||
              this.datosTabla[i].EJECUTADOCOMOOBLIGACION !== null
            ) {
              this.datosTabla[i].EJECUTADOCOMOOBLIGACION = parseFloat(
                this.datosTabla[i].EJECUTADOCOMOOBLIGACION.toFixed(2)
              );
            }
            if (
              this.datosTabla[i].COMPROMETIDO !== undefined ||
              this.datosTabla[i].COMPROMETIDO !== null
            ) {
              this.datosTabla[i].COMPROMETIDO = parseFloat(
                this.datosTabla[i].COMPROMETIDO.toFixed(2)
              );
            }
          }
        }
        if (
          (this.titulo == 'reservas' && tipoReporte == 'ReporteEjecucion') ||
          (this.titulo == 'reservas' && tipoReporte == 'ReporteProgramacion')
        ) {
          this.datosTabla[i].CPC = '0';
          if (this.datosTabla[i].CODIGOPRESUPUESTAL == '2.1.2.02.01.003') {
            this.datosTabla[i].CPC = '3212102';
          }
          if (
            this.datosTabla[i].CODIGOPRESUPUESTAL == '2.3.2.01.01.001.02.07'
          ) {
            this.datosTabla[i].FUENTESDEFINANCIACION = '1.2.1.0.00';
          }
          if (this.datosTabla[i].CODIGOPRESUPUESTAL == '2.1.2.02.02.006') {
            this.datosTabla[i].CPC = '64134';
          }
          if (this.datosTabla[i].CODIGOPRESUPUESTAL == '2.1.2.02.02.007') {
            this.datosTabla[i].CPC = '71332';
          }
          if (this.datosTabla[i].CODIGOPRESUPUESTAL == '2.1.2.02.02.008') {
            this.datosTabla[i].CPC = '8715303';
          }
          if (this.datosTabla[i].CODIGOPRESUPUESTAL == '2.1.2.02.02.009') {
            this.datosTabla[i].CPC = '97990';
          }
          if (this.datosTabla[i].CODIGOPRESUPUESTAL == '2.1.5.01.03') {
            this.datosTabla[i].CPC = '4826201';
          }
          if (this.datosTabla[i].CODIGOPRESUPUESTAL == '2.1.5.02.06') {
            this.datosTabla[i].CPC = '64134';
          }
          if (this.datosTabla[i].CODIGOPRESUPUESTAL == '2.1.5.02.08') {
            this.datosTabla[i].CPC = '8733101';
          }
          if (this.datosTabla[i].CODIGOPRESUPUESTAL == '2.1.5.02.09') {
            this.datosTabla[i].CPC = '92920';
          }
          if (this.datosTabla[i].CODIGOPRESUPUESTAL == '2.3.2.02.01.003') {
            this.datosTabla[i].CPC = '3110101';
          }
          if (this.datosTabla[i].CODIGOPRESUPUESTAL == '2.3.2.02.01.004') {
            this.datosTabla[i].CPC = '4351001';
          }
          if (this.datosTabla[i].CODIGOPRESUPUESTAL == '2.3.2.02.02.007') {
            this.datosTabla[i].CPC = '71332';
          }
          if (this.datosTabla[i].CODIGOPRESUPUESTAL == '2.3.2.02.02.008') {
            this.datosTabla[i].CPC = '8363202';
          }
          if (this.datosTabla[i].CODIGOPRESUPUESTAL == '2.3.2.02.02.009') {
            this.datosTabla[i].CPC = '97990';
          }
          if (
            this.datosTabla[i].CODIGOPRESUPUESTAL &&
            this.datosTabla[i].APROPIACIONINICIAL !== 0 &&
            this.datosTabla[i].PAGOS !== '0' &&
            this.datosTabla[i].PRESUPUESTODEFINITIVO !== 0
          ) {
            if (
              this.datosTabla[i].APROPIACIONINICIAL !== undefined ||
              this.datosTabla[i].APROPIACIONINICIAL !== null
            ) {
              this.datosTabla[i].APROPIACIONINICIAL = parseFloat(
                this.datosTabla[i].APROPIACIONINICIAL.toFixed(2)
              );
            }
            if (
              this.datosTabla[i].PAGOS !== undefined ||
              this.datosTabla[i].PAGOS !== null
            ) {
              this.datosTabla[i].PAGOS = parseFloat(
                this.datosTabla[i].PAGOS.toFixed(2)
              );
            }

            if (
              this.datosTabla[i].PRESUPUESTODEFINITIVO !== undefined ||
              this.datosTabla[i].PRESUPUESTODEFINITIVO !== null
            ) {
              this.datosTabla[i].PRESUPUESTODEFINITIVO = parseFloat(
                this.datosTabla[i].PRESUPUESTODEFINITIVO.toFixed(2)
              );
            }
          }
        }
        if (
          (this.titulo == 'cuentas' && tipoReporte == 'ReporteEjecucion') ||
          (this.titulo == 'cuentas' && tipoReporte == 'ReporteProgramacion')
        ) {
          this.datosTabla[i].CPC = '0';
          if (this.datosTabla[i].CODIGOPRESUPUESTAL == '2.1.2.02.01.001') {
            this.datosTabla[i].CPC = '2111101';
          }
          if (this.datosTabla[i].CODIGOPRESUPUESTAL == '2.1.2.02.01.002') {
            this.datosTabla[i].CPC = '2822101';
          }
          if (this.datosTabla[i].CODIGOPRESUPUESTAL == '2.1.2.02.01.003') {
            this.datosTabla[i].CPC = '3526111';
          }
          if (this.datosTabla[i].CODIGOPRESUPUESTAL == '2.1.2.02.02.006') {
            this.datosTabla[i].CPC = '69210';
          }
          if (this.datosTabla[i].CODIGOPRESUPUESTAL == '2.1.2.02.02.007') {
            this.datosTabla[i].CPC = '72112';
          }
          if (this.datosTabla[i].CODIGOPRESUPUESTAL == '2.1.2.02.02.008') {
            this.datosTabla[i].CPC = '83113';
          }
          if (this.datosTabla[i].CODIGOPRESUPUESTAL == '2.1.2.02.02.009') {
            this.datosTabla[i].CPC = '95996';
          }
          if (this.datosTabla[i].CODIGOPRESUPUESTAL == '2.1.5.02.08') {
            this.datosTabla[i].CPC = '83113';
          }
          if (this.datosTabla[i].CODIGOPRESUPUESTAL == '2.3.2.02.01.003') {
            this.datosTabla[i].CPC = '3110101';
          }
          if (this.datosTabla[i].CODIGOPRESUPUESTAL == '2.3.2.02.02.007') {
            this.datosTabla[i].CPC = '71311';
          }
          if (this.datosTabla[i].CODIGOPRESUPUESTAL == '2.3.2.02.02.009') {
            this.datosTabla[i].CPC = '97990';
          }
          if (
            this.datosTabla[i].CODIGOPRESUPUESTAL &&
            this.datosTabla[i].APROPIACIONINICIAL !== '0' &&
            this.datosTabla[i].PRESUPUESTODEFINITIVO !== 0
          ) {
            if (
              this.datosTabla[i].APROPIACIONINICIAL !== undefined ||
              this.datosTabla[i].APROPIACIONINICIAL !== null
            ) {
              this.datosTabla[i].APROPIACIONINICIAL = parseFloat(
                this.datosTabla[i].APROPIACIONINICIAL.toFixed(2)
              );
            }
            if (
              this.datosTabla[i].PRESUPUESTODEFINITIVO !== undefined ||
              this.datosTabla[i].PRESUPUESTODEFINITIVO !== null
            ) {
              this.datosTabla[i].PRESUPUESTODEFINITIVO = parseFloat(
                this.datosTabla[i].PRESUPUESTODEFINITIVO.toFixed(2)
              );
            }
          }
        }
      }
    }
    console.log(this.datosTabla);
    this.mostrarReporte = tipoReporte;
    this.limpiarTabla();
  }

  irAIngresos() {
    localStorage.setItem('ruta', 'ingresos');
    this.titulo = 'ingresos';
    this.router.navigate(['/ingresos']);
  }

  irAGastos() {
    localStorage.setItem('ruta', 'gastos');
    this.titulo = 'gastos';
    this.router.navigate(['/gastos']);
  }

  irAReservar() {
    this.titulo = 'reservas';
    localStorage.setItem('ruta', 'reservas');
    this.router.navigate(['/gastos']);
  }

  irACuentasPorPagar() {
    this.titulo = 'cuentas';
    localStorage.setItem('ruta', 'cuentas');
    this.router.navigate(['/gastos']);
  }
}
