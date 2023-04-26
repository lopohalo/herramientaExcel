import { Component, OnInit } from '@angular/core';
import { elementAt, filter } from 'rxjs';
import * as XLSX from 'xlsx'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'herramientaExcel';
  mostrarBoton = 0
  contadormodelo = 13
  convertedJson!: string;
  fileName = 'tabla.xlsx';
  ejecucion = 0
  datosTabla: any
  datosDuplicados: any = []
  sinDuplicados: any = []
  sinDuplicadosTABLA: any = []
  unicosmodelo = []
  elementosUnificados: any
  informacion = [
    {
      CODIGO: "1 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.01 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.01.001 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.01.001.01 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.01.001.01.01 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.01.001.01.01 ",
      CPC: "No aplica ",
      FUENTESDEFINANCIACION: "INGRESOS CORRIENTES DE LIBRE DESTINACION ",
      TERCEROS: "NO APLICA ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.1.02.01.001.01.02 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.01.001.01.02 ",
      CPC: "No aplica ",
      FUENTESDEFINANCIACION: "INGRESOS CORRIENTES DE LIBRE DESTINACION ",
      TERCEROS: "NO APLICA ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.1.02.01.001.01.03 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.01.001.01.03 ",
      CPC: "No aplica ",
      FUENTESDEFINANCIACION: "INGRESOS CORRIENTES DE LIBRE DESTINACION ",
      TERCEROS: "NO APLICA ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.1.02.01.001.01.05 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.01.001.01.05 ",
      CPC: "No aplica ",
      FUENTESDEFINANCIACION: "INGRESOS CORRIENTES DE LIBRE DESTINACION ",
      TERCEROS: "NO APLICA ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.1.02.02 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.02.116 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.02.116.01 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.02.116.01.01 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.02.116.01.01.01 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.02.116.01.01.01 ",
      CPC: "No aplica ",
      FUENTESDEFINANCIACION: "INGRESOS CORRIENTES DE LIBRE DESTINACION ",
      TERCEROS: "NO APLICA ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.1.02.02.116.01.01.02 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.02.116.01.01.02 ",
      CPC: "No aplica ",
      FUENTESDEFINANCIACION: "INGRESOS CORRIENTES DE LIBRE DESTINACION ",
      TERCEROS: "NO APLICA ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.1.02.02.116.01.01.03 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.02.116.01.01.03 ",
      CPC: "No aplica ",
      FUENTESDEFINANCIACION: "INGRESOS CORRIENTES DE LIBRE DESTINACION ",
      TERCEROS: "NO APLICA ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.1.02.02.116.01.01.04 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.02.116.01.01.04 ",
      CPC: "No aplica ",
      FUENTESDEFINANCIACION: "INGRESOS CORRIENTES DE LIBRE DESTINACION ",
      TERCEROS: "NO APLICA ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.1.02.02.116.01.02 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.02.116.01.02.01 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.02.116.01.02.01 ",
      CPC: "No aplica ",
      FUENTESDEFINANCIACION: "INGRESOS CORRIENTES DE LIBRE DESTINACION ",
      TERCEROS: "NO APLICA ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.1.02.02.116.01.02.02 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.02.116.01.02.02 ",
      CPC: "No aplica ",
      FUENTESDEFINANCIACION: "INGRESOS CORRIENTES DE LIBRE DESTINACION ",
      TERCEROS: "NO APLICA ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.1.02.02.116.01.02.03 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.02.116.01.02.03 ",
      CPC: "No aplica ",
      FUENTESDEFINANCIACION: "INGRESOS CORRIENTES DE LIBRE DESTINACION ",
      TERCEROS: "NO APLICA ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.1.02.02.116.01.02.04 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.02.116.01.02.04 ",
      CPC: "No aplica ",
      FUENTESDEFINANCIACION: "INGRESOS CORRIENTES DE LIBRE DESTINACION ",
      TERCEROS: "NO APLICA ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.1.02.02.116.02 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.02.116.02 ",
      CPC: "No aplica ",
      FUENTESDEFINANCIACION: "INGRESOS CORRIENTES DE LIBRE DESTINACION ",
      TERCEROS: "NO APLICA ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.1.02.03 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.03.001 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.03.001.05 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.03.001.05 ",
      CPC: "No aplica ",
      FUENTESDEFINANCIACION: "INGRESOS CORRIENTES DE LIBRE DESTINACION ",
      TERCEROS: "NO APLICA ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.1.02.05 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.05.001 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.05.001.08 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.05.001.08 ",
      CPC: "Servicios de consultoria en gestion administrativa ",
      FUENTESDEFINANCIACION: "INGRESOS CORRIENTES DE LIBRE DESTINACION ",
      TERCEROS: "NO APLICA ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.1.02.05.001.09 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.05.001.09 ",
      CPC: "Servicios de educacion superior nivel pregrado universitaria ",
      FUENTESDEFINANCIACION: "INGRESOS CORRIENTES DE LIBRE DESTINACION ",
      TERCEROS: "NO APLICA ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.1.02.05.002 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.05.002.03 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.05.002.03 ",
      CPC: "Libros publicados en fasciculos folletos hojas sueltas e impresos similares ",
      FUENTESDEFINANCIACION: "INGRESOS CORRIENTES DE LIBRE DESTINACION ",
      TERCEROS: "NO APLICA ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.1.02.05.002.06 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.05.002.06 ",
      CPC: "Servicios de suministro de comidas a la mesa en cafeterias ",
      FUENTESDEFINANCIACION: "INGRESOS CORRIENTES DE LIBRE DESTINACION ",
      TERCEROS: "NO APLICA ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.1.02.05.002.07 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.05.002.07 ",
      CPC: "Servicios de alquiler o arrendamiento con o sin opcion de compra relativos a bienes inmuebles no residenciales diferentes a vivienda  propios o arrendados ",
      FUENTESDEFINANCIACION: "INGRESOS CORRIENTES DE LIBRE DESTINACION ",
      TERCEROS: "NO APLICA ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.1.02.05.002.09 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.05.002.09 ",
      CPC: "Servicios medicos generales ",
      FUENTESDEFINANCIACION: "INGRESOS CORRIENTES DE LIBRE DESTINACION ",
      TERCEROS: "NO APLICA ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.1.02.06 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.06.006 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.06.006.01 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.06.006.01 ",
      CPC: "No aplica ",
      FUENTESDEFINANCIACION: "OTRAS TRANSFERENCIAS CORRIENTES DE OTRAS ENTIDADES CON DESTINACION ESPECIFICA LEGAL DEL GOBIERNO GENERAL ",
      TERCEROS: "MINISTERIO DE HACIENDA Y CREDITO PUBLICO ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.1.02.06.006.02 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.06.006.02 ",
      CPC: "No aplica ",
      FUENTESDEFINANCIACION: "OTRAS TRANSFERENCIAS CORRIENTES DE OTRAS ENTIDADES CON DESTINACION ESPECIFICA LEGAL DEL GOBIERNO GENERAL ",
      TERCEROS: "MINISTERIO DE HACIENDA Y CREDITO PUBLICO ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.1.02.06.006.06 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.06.006.06 ",
      CPC: "No aplica ",
      FUENTESDEFINANCIACION: "OTRAS TRANSFERENCIAS CORRIENTES DE OTRAS ENTIDADES CON DESTINACION ESPECIFICA LEGAL DEL GOBIERNO GENERAL ",
      TERCEROS: "MINISTERIO DE EDUCACION NACIONAL ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.1.02.06.006.07 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.06.006.07 ",
      CPC: "No aplica ",
      FUENTESDEFINANCIACION: "ESTAMPILLAS ",
      TERCEROS: "NO APLICA ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.1.02.06.009 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.06.009.02 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.06.009.02.02 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.06.009.02.02 ",
      CPC: "No aplica ",
      FUENTESDEFINANCIACION: "INGRESOS CORRIENTES DE LIBRE DESTINACION ",
      TERCEROS: "NO APLICA ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.1.02.06.009.02.03 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.1.02.06.009.02.03 ",
      CPC: "No aplica ",
      FUENTESDEFINANCIACION: "INGRESOS CORRIENTES DE LIBRE DESTINACION ",
      TERCEROS: "NO APLICA ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.2 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.2.01 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.2.01.02 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.2.01.02.001 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.2.01.02.001.03 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.2.01.02.001.03.02 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.2.01.02.001.03.02 ",
      CPC: "No aplica ",
      FUENTESDEFINANCIACION: "INGRESOS CORRIENTES DE LIBRE DESTINACION ",
      TERCEROS: "NO APLICA ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.2.05 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.2.05.02 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.2.05.02 ",
      CPC: "No aplica ",
      FUENTESDEFINANCIACION: "R.F. DE SISTEMA GENERAL DE SEGURIDAD SOCIAL EN SALUD - FONDOS ESPECIALES DEL MINISTERIO DE SALUD Y PROTECCION SOCIAL ",
      TERCEROS: "NO APLICA ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.2.08 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.2.08.01 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.2.08.01.003 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.2.08.01.003.01 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.2.08.01.003.01 ",
      CPC: "No aplica ",
      FUENTESDEFINANCIACION: "INGRESOS CORRIENTES DE LIBRE DESTINACION ",
      TERCEROS: "NO APLICA ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.2.08.02 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.2.08.02 ",
      CPC: "No aplica ",
      FUENTESDEFINANCIACION: "INGRESOS CORRIENTES DE LIBRE DESTINACION ",
      TERCEROS: "NO APLICA ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.2.10 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.2.10.02 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.2.10.02 ",
      CPC: "No aplica ",
      FUENTESDEFINANCIACION: "INGRESOS CORRIENTES DE LIBRE DESTINACION ",
      TERCEROS: "NO APLICA ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.2.13 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.2.13.01 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.2.13.01 ",
      CPC: "No aplica ",
      FUENTESDEFINANCIACION: "INGRESOS CORRIENTES DE LIBRE DESTINACION ",
      TERCEROS: "NO APLICA ",
      POLITICAPUBLICA: "NO APLICA "
    },
    {
      CODIGO: "1.2.13.02 ",
      CPC: "  ",
      FUENTESDEFINANCIACION: "  ",
      TERCEROS: "  ",
      POLITICAPUBLICA: "  "
    },
    {
      CODIGO: "1.2.13.02 ",
      CPC: "No aplica ",
      FUENTESDEFINANCIACION: "INGRESOS CORRIENTES DE LIBRE DESTINACION ",
      TERCEROS: "NO APLICA ",
      POLITICAPUBLICA: "NO APLICA "
    }
  ]
  modeloInformacion = [
    {
        RUBROPRESUPEUSTAL: "1 ",
        CONCEPTOPRESUPUESTAL: "INGRESOS ",
    },
    {
        RUBROPRESUPEUSTAL: "1.1 ",
        CONCEPTOPRESUPUESTAL: "INGRESOS CORRIENTES ",
    },
    {
        RUBROPRESUPEUSTAL: "1.1.02 ",
        CONCEPTOPRESUPUESTAL: "INGRESOS NO TRIBUTARIOS ",
    },
    {
        RUBROPRESUPEUSTAL: "1.1.02.01 ",
        CONCEPTOPRESUPUESTAL: "CONTRIBUCIONES ",
    },
    {
        RUBROPRESUPEUSTAL: "1.1.02.01.001 ",
        CONCEPTOPRESUPUESTAL: "CONTRIBUCIONES SOCIALES ",
    },
    {
        RUBROPRESUPEUSTAL: "1.1.02.01.001.01 ",
        CONCEPTOPRESUPUESTAL: "SALUD ",
    },
    {
        RUBROPRESUPEUSTAL: "1.1.02.02 ",
        CONCEPTOPRESUPUESTAL: "TASAS Y DERECHOS ADMINISTRATIVOS ",
    },
    {
        RUBROPRESUPEUSTAL: "1.1.02.02.116 ",
        CONCEPTOPRESUPUESTAL: "DERECHOS PECUNIARIOS EDUCACION SUPERIOR ",
    },
    {
        RUBROPRESUPEUSTAL: "1.1.02.03 ",
        CONCEPTOPRESUPUESTAL: "MULTAS, SANCIONES E INTERESES DE MORA ",
    },
    {
        RUBROPRESUPEUSTAL: "1.1.02.03.001 ",
        CONCEPTOPRESUPUESTAL: "MULTAS Y SANCIONES ",
    },
    {
        RUBROPRESUPEUSTAL: "1.1.02.05 ",
        CONCEPTOPRESUPUESTAL: "VENTA DE BIENES Y SERVICIOS ",
    },
    {
        RUBROPRESUPEUSTAL: "1.1.02.05.001 ",
        CONCEPTOPRESUPUESTAL: "VENTAS DE ESTABLECIMIENTOS DE MERCADO ",
    },
    {
        RUBROPRESUPEUSTAL: "1.1.02.05.001.08 ",
        CONCEPTOPRESUPUESTAL: "SERVICIOS PRESTADOS A LAS EMPRESAS Y SERVICIOS DE PRODUCCION  ",
    },
    {
        RUBROPRESUPEUSTAL: "1.1.02.05.001.09 ",
        CONCEPTOPRESUPUESTAL: "SERVICIOS PARA LA COMUNIDAD, SOCIALES Y PERSONALES "
    },
    {
        RUBROPRESUPEUSTAL: "1.1.02.05.002 ",
        CONCEPTOPRESUPUESTAL: "VENTAS INCIDENTALES DE ESTABLECIMIENTOS NO DE MERCADO ",
    },
    {
        RUBROPRESUPEUSTAL: "1.1.02.05.002.03 ",
        CONCEPTOPRESUPUESTAL: "OTROS BIENES TRANSPORTABLES EXCEPTO PRODUCTOS METALICOS, MAQUINARIA Y EQUIPO ",
    },
    {
        RUBROPRESUPEUSTAL: "1.1.02.06 ",
        CONCEPTOPRESUPUESTAL: "TRANSFERENCIAS CORRIENTES ",
    },
    {
        RUBROPRESUPEUSTAL: "1.1.02.06.006 ",
        CONCEPTOPRESUPUESTAL: "TRANSFERENCIAS DE OTRAS ENTIDADES DEL GOBIERNO GENERAL ",
    },
    {
        RUBROPRESUPEUSTAL: "1.1.02.06.009.02 ",
        CONCEPTOPRESUPUESTAL: "SISTEMA GENERAL DE PENSIONES ",
    },
    {
        RUBROPRESUPEUSTAL: "1.2 ",
        CONCEPTOPRESUPUESTAL: "RECURSOS DE CAPITAL ",
    },
    {
        RUBROPRESUPEUSTAL: "1.2.01 ",
        CONCEPTOPRESUPUESTAL: "DISPOSICION DE ACTIVOS ",
    },
    {
        RUBROPRESUPEUSTAL: "1.2.01.02 ",
        CONCEPTOPRESUPUESTAL: "DISPOSICION DE ACTIVOS NO FINANCIEROS ",
    },
    {
        RUBROPRESUPEUSTAL: "1.2.01.02.001 ",
        CONCEPTOPRESUPUESTAL: "DISPOSICION DE ACTIVOS FIJOS ",
    },
    {
        RUBROPRESUPEUSTAL: "1.2.05 ",
        CONCEPTOPRESUPUESTAL: "RENDIMIENTOS FINANCIEROS ",
    },
    {
        RUBROPRESUPEUSTAL: "1.2.05.02 ",
        CONCEPTOPRESUPUESTAL: "DEPOSITOS ",
    },
    {
        RUBROPRESUPEUSTAL: "1.2.08 ",
        CONCEPTOPRESUPUESTAL: "TRANSFERENCIAS DE CAPITAL ",
    },
    {
        RUBROPRESUPEUSTAL: "1.2.08.01 ",
        CONCEPTOPRESUPUESTAL: "DONACIONES ",
    },
    {
        RUBROPRESUPEUSTAL: "1.2.08.01.003 ",
        CONCEPTOPRESUPUESTAL: "DEL SECTOR PRIVADO ",
    },
    {
        RUBROPRESUPEUSTAL: "1.2.08.02 ",
        CONCEPTOPRESUPUESTAL: "INDEMNIZACIONES RELACIONADAS CON SEGUROS NO DE VIDA "
    },
    {
        RUBROPRESUPEUSTAL: "1.2.10 ",
        CONCEPTOPRESUPUESTAL: "RECURSOS DEL BALANCE ",
    },
    {
        RUBROPRESUPEUSTAL: "1.2.10.02 ",
        CONCEPTOPRESUPUESTAL: "SUPERAVIT FISCAL "
    },
    {
        RUBROPRESUPEUSTAL: "1.2.13 ",
        CONCEPTOPRESUPUESTAL: "REINTEGROS Y OTROS RECURSOS NO APROPIADOS ",
    },
    {
        RUBROPRESUPEUSTAL: "1.2.13.01 ",
        CONCEPTOPRESUPUESTAL: "REINTEGROS "
    }
]


  ngOnInit(): void {
  }

  fileUpload(event: any) {
    const selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile)
    fileReader.onload = (event: any) => {
      let binaryData = event.target.result;
      let workbook = XLSX.read(binaryData, { type: 'binary' })
      workbook.SheetNames.forEach(sheet => {
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        this.convertedJson = JSON.stringify(data, undefined, 4)
        this.datosTabla = data
      })
      console.log(this.datosTabla)
    }
  }
  exportexcel(): void {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }
  ejecutarResumenIngresos() {
    const busqueda = this.datosTabla.reduce((acc: any, codigo: any) => {
      acc[codigo.RUBROPRESUPEUSTAL] = ++acc[codigo.RUBROPRESUPEUSTAL] || 0;
      return acc;
    }, {});
    const duplicados = this.datosTabla.filter((codigo: any) => {
      return busqueda[codigo.RUBROPRESUPEUSTAL];

    });
    const unicos: any = [];

    for (var i = 0; i < duplicados.length; i++) {

      const elemento = duplicados[i].RUBROPRESUPEUSTAL;

      if (!unicos.includes(duplicados[i].RUBROPRESUPEUSTAL)) {
        unicos.push(elemento);
      }
    }
    let arreglosDuplicados: any = []
    unicos.forEach((element: any) => {
      const arreglosSeparados = duplicados.filter((campo: any) => campo.RUBROPRESUPEUSTAL == element)
      arreglosDuplicados.push(arreglosSeparados)
    })
    let element1
    let element2
    for (let index = 0; index < arreglosDuplicados.length; index++) {
      element1 = arreglosDuplicados[index].length;
      element2 = arreglosDuplicados[index]
      let x = 0
      let y = 0
      for (let i = 0; i < element1; i++) {
        const element = element2[i]
        if (x == 0) {
          x = element.APROPIACIONINICIAL
          y = element.RECAUDO
        } else {
          x = x + element.APROPIACIONINICIAL
          y = y + element.RECAUDO
          localStorage.setItem(element.RUBROPRESUPEUSTAL, JSON.stringify({ codigo: element.RUBROPRESUPEUSTAL, recaudo: y , valor: x }))
          this.datosDuplicados.push({ codigo: element.RUBROPRESUPEUSTAL, recaudo: y , valor: x })
        }
      }
    }
    this.extrayendoDuplicadosSumados()
  }


  extrayendoDuplicadosSumados() {
    this.datosDuplicados.forEach((i: any) => {
      if (!this.elementoRepite(i.codigo)) {
        this.sinDuplicados.push(i);
      }
    })
    let arraydeDuplicados: any = []
    this.sinDuplicados.forEach((element: any) => {
      console.log(localStorage.getItem(element.codigo))
      let x: any = localStorage.getItem(element.codigo)
      x = JSON.parse(x)
      arraydeDuplicados = [...arraydeDuplicados, x]
      console.log(arraydeDuplicados)
      localStorage.setItem('duplicadosIngresos', JSON.stringify(arraydeDuplicados))
    });
    for (let index = 0; index < arraydeDuplicados.length; index++) {
      let x = this.datosTabla.filter((element: any) => element.RUBROPRESUPEUSTAL == arraydeDuplicados[index].codigo)
      x.forEach((element: any) => {
        element.APROPIACIONINICIAL = arraydeDuplicados[index].valor
        element.RECAUDO = arraydeDuplicados[index].recaudo
        this.elementosUnificados = this.datosTabla.map((element1: any) => element1.RUBROPRESUPEUSTAL == element.RUBROPRESUPEUSTAL ? element : element1)
      });

      let objetoSinRepetidos: any = {};
      this.elementosUnificados.forEach(function (elemento: any) {
        objetoSinRepetidos[elemento.RUBROPRESUPEUSTAL] = elemento;
      });

      let arregloSinRepetidos = Object.values(objetoSinRepetidos);
      this.datosTabla = arregloSinRepetidos
      console.log(arregloSinRepetidos); // [1, 2, 3, 4, 5]
    }
    if (this.ejecucion == 0) {
      this.ejecucion = 1
      this.ejecutarResumenIngresos()
    } else {
      this.mostrarBoton = 1
      this.ejecucion = 0
      localStorage.clear()
    }
    console.log(this.ejecucion)

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
  extrayendoDuplicadosSumadosTABLA() {
    this.datosTabla.forEach((i: any) => {
      if (!this.elementoRepite(i.RUBROPRESUPEUSTAL)) {
        this.sinDuplicadosTABLA.push(i);
      }
    })
    console.log(this.sinDuplicadosTABLA)
  }
  elementoRepiteTABLA(valor: any) {
    let vecesRepetidas = 0;
    for (let i of this.sinDuplicadosTABLA) {
      if (i.RUBROPRESUPEUSTAL == valor) {
        vecesRepetidas++;
        if (vecesRepetidas > 0) {
          return true;
          break;
        }
      }
    }
    return false;
  }
  ejecutarSegundoResumen() {
    for (let index = 0; index < this.informacion.length; index++) {
      console.log(this.informacion[index])
      let x = this.datosTabla.filter((element: any) => element.RUBROPRESUPEUSTAL.trim() == this.informacion[index].CODIGO.trim())
      x.forEach((element: any) => {
        element.CPC = this.informacion[index].CPC
        element.TERCEROS = this.informacion[index].TERCEROS
        element.FUENTESDEFINANCIACION = this.informacion[index].FUENTESDEFINANCIACION
        element.POLITICAPUBLICA = this.informacion[index].POLITICAPUBLICA
        this.elementosUnificados = this.datosTabla.map((element1: any) => element1.RUBROPRESUPEUSTAL == element.RUBROPRESUPEUSTAL ? element : element1)
        console.log(this.elementosUnificados)
      });
    }
  }
  ejecutarModeloDeResumidos(contadorValor:any) {
    console.log(contadorValor)
    const busqueda = this.datosTabla.reduce((acc: any, codigo: any) => {
      acc[codigo.RUBROPRESUPEUSTAL.trim().slice(0,contadorValor)] = ++acc[codigo.RUBROPRESUPEUSTAL.trim().slice(0,contadorValor)] || 0;
      return acc;
    }, {});
    const duplicados = this.datosTabla.filter((codigo: any) => {
      return busqueda[codigo.RUBROPRESUPEUSTAL.trim().slice(0,contadorValor)];
    });
    let unicos: any = [];

    for (var i = 0; i < duplicados.length; i++) {

      const elemento = duplicados[i].RUBROPRESUPEUSTAL.trim().slice(0,contadorValor);
      if (!unicos.includes(duplicados[i].RUBROPRESUPEUSTAL.trim().slice(0,contadorValor))) {
        unicos.push(elemento);
        this.unicosmodelo = unicos
      }
    }


if(contadorValor == 1){
    console.log('nada')
}else {
  let x =  unicos.filter((element:any) => element.length == contadorValor)
  unicos = x
  this.unicosmodelo = x
}
 




    
    let arreglosDuplicados: any = []
    unicos.forEach((element: any) => {
      const arreglosSeparados = this.datosTabla.filter((campo: any) => campo.RUBROPRESUPEUSTAL.trim().slice(0,contadorValor) == element)
      arreglosDuplicados.push(arreglosSeparados)
    })
    let element1
    let element2
    for (let index = 0; index < arreglosDuplicados.length; index++) {
      element1 = arreglosDuplicados[index].length;
      element2 = arreglosDuplicados[index]
      let x = 0
      for (let i = 0; i < element1; i++) {
        const element = element2[i]
        if (x == 0) {
          x = element.APROPIACIONINICIAL
          localStorage.setItem(element.RUBROPRESUPEUSTAL.trim().slice(0,contadorValor), JSON.stringify({ codigo: element.RUBROPRESUPEUSTAL.trim().slice(0,contadorValor), valor: x }))
        } else {
          if(element.APROPIACIONINICIAL == undefined){
            x = x + 0
          } else {
            x = x + element.APROPIACIONINICIAL
            localStorage.setItem(element.RUBROPRESUPEUSTAL.trim().slice(0,contadorValor), JSON.stringify({ codigo: element.RUBROPRESUPEUSTAL.trim().slice(0,contadorValor), valor: x }))
          }
          this.datosDuplicados.push({ codigo: element.RUBROPRESUPEUSTAL.trim().slice(0,contadorValor), valor: x })
        }
      }

      
    }
    if(this.contadormodelo <= 9){
      this.contadormodelo = this.contadormodelo - 1
    } else{
      this.contadormodelo = 9
    } 
    
    this.extrayendoDuplicadosSumadosMODELO()
  }
  extrayendoDuplicadosSumadosMODELO() {
    let arraydeDuplicados: any = []
      this.unicosmodelo.forEach((element: any) => {
        console.log(element)
      console.log(localStorage.getItem(element))
      let x: any = localStorage.getItem(element)
      x = JSON.parse(x)
      arraydeDuplicados = [...arraydeDuplicados, x]
      localStorage.setItem('duplicadosIngresos', JSON.stringify(arraydeDuplicados))
    });
    for (let index = 0; index < arraydeDuplicados.length; index++) {
      console.log(arraydeDuplicados[index].codigo)
      let x = this.modeloInformacion.filter((element: any) => element.RUBROPRESUPEUSTAL.trim() == arraydeDuplicados[index].codigo)
      console.log(x)
      x.forEach((element: any) => {
        element.APROPIACIONINICIAL = arraydeDuplicados[index].valor
        this.elementosUnificados = this.modeloInformacion.map((element1: any) => element1.RUBROPRESUPEUSTAL == element.RUBROPRESUPEUSTAL ? element : element1)
      });
    }
    this.elementosUnificados.forEach((element:any) => {
      element.RUBROPRESUPEUSTAL = element.RUBROPRESUPEUSTAL.trim()
      console.log(this.elementosUnificados)
    });
    this.datosTabla.forEach((element:any) => {
      element.RUBROPRESUPEUSTAL = element.RUBROPRESUPEUSTAL.trim()
    });
    if(this.contadormodelo == 0){
      const mergedArray = this.datosTabla.concat(this.elementosUnificados);
      mergedArray.sort((a:any, b:any) => {
        const aCodeArray:any = a.RUBROPRESUPEUSTAL.split('.');
        console.log(aCodeArray)
        const bCodeArray:any = b.RUBROPRESUPEUSTAL.split('.');
        console.log(bCodeArray)
        
        for(let i = 0; i < Math.max(aCodeArray.length, bCodeArray.length); i++) {
          const aCodePart = aCodeArray[i] || 0;
          const bCodePart = bCodeArray[i] || 0;
          if (aCodePart !== bCodePart) {
            return aCodePart - bCodePart;
          }
        }
        return 0;
      }); // ordenar los objetos por código
      this.datosTabla = mergedArray
      console.log(mergedArray);
    }else{
      this.ejecutarModeloDeResumidos(this.contadormodelo)
    }

  }
 
}
