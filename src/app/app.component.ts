import { Component, OnInit } from '@angular/core';
import { elementAt, filter } from 'rxjs';
import {
  formatNumber
 }
  from '@angular/common';
import * as numeral from 'numeral';
import * as XLSX from 'xlsx'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'herramientaExcel';
  validartabla = 0
  mostrarBoton = 0
  contadormodelo = 13
  convertedJson!: string;
  fileName = 'tabla.xlsx';
  ejecucion = 0
  datosTabla: any = []
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
      CONCEPTO: "INGRESOS ",
    },
    {
      RUBROPRESUPEUSTAL: "1.1 ",
      CONCEPTO: "INGRESOS CORRIENTES ",
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02 ",
      CONCEPTO: "INGRESOS NO TRIBUTARIOS ",
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.01 ",
      CONCEPTO: "CONTRIBUCIONES ",
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.01.001 ",
      CONCEPTO: "CONTRIBUCIONES SOCIALES ",
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.01.001.01 ",
      CONCEPTO: "SALUD ",
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02 ",
      CONCEPTO: "TASAS Y DERECHOS ADMINISTRATIVOS ",
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116 ",
      CONCEPTO: "DERECHOS PECUNIARIOS EDUCACION SUPERIOR ",
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.03 ",
      CONCEPTO: "MULTAS, SANCIONES E INTERESES DE MORA ",
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.03.001 ",
      CONCEPTO: "MULTAS Y SANCIONES ",
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05 ",
      CONCEPTO: "VENTA DE BIENES Y SERVICIOS ",
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.001 ",
      CONCEPTO: "VENTAS DE ESTABLECIMIENTOS DE MERCADO ",
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.001.08 ",
      CONCEPTO: "SERVICIOS PRESTADOS A LAS EMPRESAS Y SERVICIOS DE PRODUCCION  ",
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.001.09 ",
      CONCEPTO: "SERVICIOS PARA LA COMUNIDAD, SOCIALES Y PERSONALES "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.002 ",
      CONCEPTO: "VENTAS INCIDENTALES DE ESTABLECIMIENTOS NO DE MERCADO ",
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.002.03 ",
      CONCEPTO: "OTROS BIENES TRANSPORTABLES EXCEPTO PRODUCTOS METALICOS, MAQUINARIA Y EQUIPO ",
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06 ",
      CONCEPTO: "TRANSFERENCIAS CORRIENTES ",
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.006 ",
      CONCEPTO: "TRANSFERENCIAS DE OTRAS ENTIDADES DEL GOBIERNO GENERAL ",
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.009.02 ",
      CONCEPTO: "SISTEMA GENERAL DE PENSIONES ",
    },
    {
      RUBROPRESUPEUSTAL: "1.2 ",
      CONCEPTO: "RECURSOS DE CAPITAL ",
    },
    {
      RUBROPRESUPEUSTAL: "1.2.01 ",
      CONCEPTO: "DISPOSICION DE ACTIVOS ",
    },
    {
      RUBROPRESUPEUSTAL: "1.2.01.02 ",
      CONCEPTO: "DISPOSICION DE ACTIVOS NO FINANCIEROS ",
    },
    {
      RUBROPRESUPEUSTAL: "1.2.01.02.001 ",
      CONCEPTO: "DISPOSICION DE ACTIVOS FIJOS ",
    },
    {
      RUBROPRESUPEUSTAL: "1.2.05 ",
      CONCEPTO: "RENDIMIENTOS FINANCIEROS ",
    },
    {
      RUBROPRESUPEUSTAL: "1.2.05.02 ",
      CONCEPTO: "DEPOSITOS ",
    },
    {
      RUBROPRESUPEUSTAL: "1.2.08 ",
      CONCEPTO: "TRANSFERENCIAS DE CAPITAL ",
    },
    {
      RUBROPRESUPEUSTAL: "1.2.08.01 ",
      CONCEPTO: "DONACIONES ",
    },
    {
      RUBROPRESUPEUSTAL: "1.2.08.01.003 ",
      CONCEPTO: "DEL SECTOR PRIVADO ",
    },
    {
      RUBROPRESUPEUSTAL: "1.2.08.02 ",
      CONCEPTO: "INDEMNIZACIONES RELACIONADAS CON SEGUROS NO DE VIDA "
    },
    {
      RUBROPRESUPEUSTAL: "1.2.10 ",
      CONCEPTO: "RECURSOS DEL BALANCE ",
    },
    {
      RUBROPRESUPEUSTAL: "1.2.10.02 ",
      CONCEPTO: "SUPERAVIT FISCAL "
    },
    {
      RUBROPRESUPEUSTAL: "1.2.13 ",
      CONCEPTO: "REINTEGROS Y OTROS RECURSOS NO APROPIADOS ",
    },
    {
      RUBROPRESUPEUSTAL: "1.2.13.01 ",
      CONCEPTO: "REINTEGROS "
    }
  ]
  equivalenciaINGRESO = [
    {
      RUBROPRESUPEUSTAL: "1",
      CONCEPTO: "Ingresos"
    },
    {
      RUBROPRESUPEUSTAL: "1.1",
      CONCEPTO: "Ingresos Corrientes                                                                                                                                                                                     "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02",
      CONCEPTO: "Ingresos no tributarios"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.01",
      CONCEPTO: "Contribuciones"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.01.001",
      CONCEPTO: "Contribuciones sociales"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.01.001.01",
      CONCEPTO: "Salud "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.01.001.01.01",
      CONCEPTO: "Aportes empleado"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.01.001.01.01.01",
      CONCEPTO: "Aporte Pos-Empleados UIS (3.3%) Fondo Asegurador (9701)                                                                                                                                                 "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.01.001.01.01.02",
      CONCEPTO: "Aporte Pos-Empleados UIS (0.7%) Fondo Prestador (9702)                                                                                                                                                  "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.01.001.01.02",
      CONCEPTO: "Aportes empleador"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.01.001.01.02.01         ",
      CONCEPTO: "Aporte Pos-Empleador UIS (5.3%) Fondo Asegurador (9701)                                                                                                                                                 "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.01.001.01.02.02         ",
      CONCEPTO: "Aporte Pos-Empleador UIS (1,2%) Fondo Prestador (9702)                                                                                                                                                  "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.01.001.01.02.03         ",
      CONCEPTO: "Aporte Pos-Empleador UIS (0.5%)                                                                                                                                                                         "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.01.001.01.03",
      CONCEPTO: "Aportes no clasificables"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.01.001.01.03.01         ",
      CONCEPTO: "Plan Adicional-Afiliados (1.6%) Fondo Asegurador (9701)                                                                                                                                                 "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.01.001.01.03.02         ",
      CONCEPTO: "Plan Adicional-Afiliados (0.4%) Fondo Prestador (9702)                                                                                                                                                  "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.01.001.01.03.03         ",
      CONCEPTO: "Aporte Reserva Salud UIS(1%)                                                                                                                                                                           "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.01.001.01.03.04         ",
      CONCEPTO: "Aporte Reserva Salud-Empleados Y Pensionados (0.5%)                                                                                                                                                     "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.01.001.01.05",
      CONCEPTO: "Aporte pensionados"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.01.001.01.05.01         ",
      CONCEPTO: "Aporte Pos-Pensionados UIS (8.6%) Fondo Asegurador (9701)                                                                                                                                               "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.01.001.01.05.02         ",
      CONCEPTO: "Aporte Pos-Pensionados UIS (1.9%) Fondo Prestador (9702)                                                                                                                                                "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.01.001.01.05.03         ",
      CONCEPTO: "Aporte Pos-Pensionados UIS (0.5%)                                                                                                                                                                        "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.01.001.01.05.04         ",
      CONCEPTO: "Aporte Pos-Pensionados AFP (9%) Fondo Asegurador (9701)                                                                                                                                                 "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.01.001.01.05.05         ",
      CONCEPTO: "Aporte Pos-Pensionados AFP (2%) Fondo Prestador (9702)                                                                                                                                                  "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02 ",
      CONCEPTO: "Tasas y Derechos Administrativos"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116 ",
      CONCEPTO: "Derechos pecuniarios Educación Superior"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01",
      CONCEPTO: "Servicios de Educación Superior (Terciaria)"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.01",
      CONCEPTO: "Nivel Pregrado"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.01.01         ",
      CONCEPTO: "Inscripciones                                                                                                                                                                                           "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.01.01.01      ",
      CONCEPTO: "Inscripciones - Pregrado Presencial                                                                                                                                                                      "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.01.01.02      ",
      CONCEPTO: "Inscripciones - Pregrado a Distancia                                                                                                                                                                    "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.01.02         ",
      CONCEPTO: "Derechos De Grado                                                                                                                                                                                       "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.01.02.01      ",
      CONCEPTO: "Derechos de grado - Pregrado presencial"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.01.02.02      ",
      CONCEPTO: "Derechos de grado -  Pregrado a distancia"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.01.02.03      ",
      CONCEPTO: "Registro de diplomas Pregrado"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.01.03         ",
      CONCEPTO: "Matrículas                                                                                                                                                                                              "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.01.03.01      ",
      CONCEPTO: "Matrícula  Pregrado Presencial                                                                                                                                                                         "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.01.03.02      ",
      CONCEPTO: "Matrícula Pregrado A Distancia                                                                                                                                                                         "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.01.03.03      ",
      CONCEPTO: "Auxilios matrícula Nación                                                                                                                                                                           "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.01.03.04      ",
      CONCEPTO: "Auxilios matrícula Departamento                                                                                                                                                                         "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.01.03.05      ",
      CONCEPTO: "Reintegros Becas - Ser Pilo                                                                                                                                                                             "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.01.03.06      ",
      CONCEPTO: "Ingresos Recibidos Por Anticipado                                                                                                                                                                       "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.01.03.07",
      CONCEPTO: "Derechos Académicos Pregrado Presencial                                                                                                                                                                 "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.01.03.08",
      CONCEPTO: "Derechos Académicos Pregrado A Distancia                                                                                                                                                                "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.01.04         ",
      CONCEPTO: "Certificaciones, Constancias Académicas y Derechos Complementarios                                                                                                                                      "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.01.04.01",
      CONCEPTO: "Expedición de certificados - Pregrado Presencial"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.01.04.02",
      CONCEPTO: "Expedición de certificados - Pregrado a Distancia"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.01.04.03",
      CONCEPTO: "Validaciones y habilitaciones pregrado presencial"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.01.04.04",
      CONCEPTO: "Validaciones y habilitaciones pregrado a distancia"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.01.04.05",
      CONCEPTO: "Cursos Nivelación - Pregrado Presencial                                                                                                                                                                 "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.01.04.06",
      CONCEPTO: "Cursos Nivelación - Pregrado A Distancia                                                                                                                                                                "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.01.04.07",
      CONCEPTO: "Estudios de Transferencias -  Pregrado Presencial                                                                                                                                                       "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.01.04.08",
      CONCEPTO: "Estudios de Transferencias -  Pregrado a Distancia                                                                                                                                                      "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.01.04.09",
      CONCEPTO: "Cursos de Vacaciones - Pregrado Presencial                                                                                                                                                              "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.01.04.10",
      CONCEPTO: "Cursos de Vacaciones - Pregrado a Distancia                                                                                                                                                            "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.02",
      CONCEPTO: "Nivel Posgrado"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.02.01",
      CONCEPTO: "Inscripciones                                                                                                                                                                                           "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.02.01.01      ",
      CONCEPTO: "Inscripciones - Especialización                                                                                                                                                                         "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.02.01.02      ",
      CONCEPTO: "Inscripciones - Maestría                                                                                                                                                                                "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.02.01.03      ",
      CONCEPTO: "Inscripciones - Doctorado                                                                                                                                                                               "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.02.02",
      CONCEPTO: "Derechos de grado                                                                                                                                                                                       "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.02.02.01      ",
      CONCEPTO: "Derechos De Grado - Especialización                                                                                                                                                             "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.02.02.02      ",
      CONCEPTO: "Derechos De Grado - Maestría                                                                                                                                                                      "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.02.02.03      ",
      CONCEPTO: "Derechos De Grado - Doctorado                                                                                                                                                                           "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.02.02.04      ",
      CONCEPTO: "Registro de diplomas Posgrado"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.02.03         ",
      CONCEPTO: "Matrículas                                                                                                                                                                                              "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.02.03.01      ",
      CONCEPTO: "Matrículas Especialización                                                                                                                                                                              "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.02.03.02      ",
      CONCEPTO: "Matrículas Maestrías                                                                                                                                                                                     "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.02.03.03      ",
      CONCEPTO: "Matrículas Doctorado                                                                                                                                                                                    "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.02.03.04",
      CONCEPTO: "Derechos Académicos Especialización                                                                                                                                                                     "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.02.03.05",
      CONCEPTO: "Derechos Académicos Maestría                                                                                                                                                          "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.02.03.06",
      CONCEPTO: "Derechos Académicos Doctorado                                                                                                                                                                           "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.02.04         ",
      CONCEPTO: "Certificaciones, constancias académicas y derechos complementarios                                                                                                                                      "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.02.04.01     ",
      CONCEPTO: "Expedición de certificados - Especialización"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.02.04.02",
      CONCEPTO: "Expedición de certificados - Maestría"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.02.04.03",
      CONCEPTO: "Expedición de certificados – Doctorado"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.02.04.04",
      CONCEPTO: "Cursos de nivelación - Especialización "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.02.04.05",
      CONCEPTO: "Cursos de nivelación - Maestría"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.02.04.06",
      CONCEPTO: "Cursos de nivelación – Doctorado "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.02.04.07",
      CONCEPTO: "Estudios de transferencias - Especialización"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.02.04.08",
      CONCEPTO: "Estudios de transferencias - Maestría"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.01.02.04.09",
      CONCEPTO: "Estudios de transferencias – Doctorado"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.02",
      CONCEPTO: "Derechos complementarios asociados a la Educación "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.02.01            ",
      CONCEPTO: "Derechos de salud pregrado presencial"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.02.02            ",
      CONCEPTO: "Derechos de salud pregrado a distancia"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.02.03            ",
      CONCEPTO: "Derechos de salud Especialización"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.02.04            ",
      CONCEPTO: "Derechos de salud Maestría"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.02.116.02.05            ",
      CONCEPTO: "Derechos de salud Doctorado"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.03",
      CONCEPTO: "Multas, sanciones e intereses de mora"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.03.001",
      CONCEPTO: "Multas y sanciones"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.03.001.03        ",
      CONCEPTO: "Sanciones disciplinarias"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.03.001.04",
      CONCEPTO: "Sanciones contractuales"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.03.001.05               ",
      CONCEPTO: "Sanciones administrativas                                                                                                                                                                               "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.03.001.05.01",
      CONCEPTO: "Multas"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.03.002",
      CONCEPTO: "Intereses de Mora"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05                      ",
      CONCEPTO: "Venta de bienes y servicios                                                                                                                                                                             "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.001      ",
      CONCEPTO: "Venta de establecimientos de mercado"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.001.08       ",
      CONCEPTO: "Servicios prestados a las empresas y servicios de producción                                                                                                                                            "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.001.08.01            ",
      CONCEPTO: "Convenios                                                                                                                                                                                               "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.001.08.02            ",
      CONCEPTO: "Consultorías y asesorías"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.001.08.03",
      CONCEPTO: "Recursos Administrados"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.001.08.03.01",
      CONCEPTO: "Colciencias "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.001.08.03.02",
      CONCEPTO: "ICFES"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.001.08.03.03",
      CONCEPTO: "Departamento de Santander"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.001.08.03.04",
      CONCEPTO: "Ministerio de Salud"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.001.08.03.05",
      CONCEPTO: "Ecopetrol"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.001.08.03.06",
      CONCEPTO: "Ministerio de Educación Nacional"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.001.08.03.07",
      CONCEPTO: "IDEAM"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.001.08.03.08",
      CONCEPTO: "IDESAN"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.001.08.03.09",
      CONCEPTO: "FODESEP"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.001.08.03.10",
      CONCEPTO: "Municipios"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.001.08.03.11",
      CONCEPTO: "Otras Entidades"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.001.09     ",
      CONCEPTO: "Servicios para la comunidad, sociales y personales                                                                                                                                                      "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.001.09.01           ",
      CONCEPTO: "Venta Bonos SIDES"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.001.09.02",
      CONCEPTO: "Diplomados"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.001.09.03",
      CONCEPTO: "Seminarios y otros"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.001.09.04",
      CONCEPTO: "Cursos de capacitación"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.001.09.05",
      CONCEPTO: "Eventos académicos y culturales"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.001.09.06",
      CONCEPTO: "Análisis de ingeniería"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.001.09.07",
      CONCEPTO: "Ingresos por Contribución en Venta Externa de Bienes y Servicios                                                                                                                                        "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.002                  ",
      CONCEPTO: "Ventas incidentales de establecimientos no de mercado                                                                                                                                                   "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.002.00          ",
      CONCEPTO: "Agricultura, silvicultura y productos de la pesca"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.002.00.01            ",
      CONCEPTO: "Venta Productos Agrícolas                                                                                                                                                                               "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.002.02    ",
      CONCEPTO: "Productos Alimenticios, Bebidas y Tabaco, Textiles, Prendas de Vestir y Productos del Cuero"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.002.02.01            ",
      CONCEPTO: "Venta Productos Pecuarios                                                                                                                                                                               "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.002.03               ",
      CONCEPTO: "Otros Bienes Transportables (Excepto Productos Metálicos, Maquinaria Y Equipo)                                                                                                                          "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.002.03.01            ",
      CONCEPTO: "Venta - Libros y Otras Formas de Comunicación                                                                                                                                                           "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.002.03.02            ",
      CONCEPTO: "Venta - Publicaciones                                                                                                                                                                                   "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.002.06               ",
      CONCEPTO: "Servicios De Alojamiento, Servicios de Suministro de Comidas y Bebidas, Servicios de Transporte, y Servicios De Distribución De Electricidad, Gas Y Agua                                                "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.002.06.01            ",
      CONCEPTO: "Venta Producto - Comedores                                                                                                                                                                              "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.002.06.02            ",
      CONCEPTO: "Venta Producto - Cafetería                                                                                                                                                                              "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.002.07        ",
      CONCEPTO: "Servicios Financieros y Servicios Conexos, Servicios Inmobiliarios Y Servicios De Leasing                                                                                                               "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.002.07.01            ",
      CONCEPTO: "Arrendamiento de Bienes Muebles                                                                                                                                                                         "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.002.07.02            ",
      CONCEPTO: "Arrendamiento de Bienes Inmuebles                                                                                                                                                                       "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.002.08          ",
      CONCEPTO: "Servicios Prestados a las Empresas y Servicios de Producción                                                                                                                                            "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.002.08.01            ",
      CONCEPTO: "Publicidad y propaganda"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.002.08.02",
      CONCEPTO: "Fotocopias y copias heliográficas"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.002.09          ",
      CONCEPTO: "Servicios para la Comunidad, Sociales y Personales                                                                                                                                                      "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.002.09.01            ",
      CONCEPTO: "Venta Pliegos de Licitación                                                                                                                                                                           "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.002.09.02            ",
      CONCEPTO: "Servicios Médicos                                                                                                                                                                                       "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.002.09.03            ",
      CONCEPTO: "Exámenes de Laboratorio                                                                                                                                                                                 "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.002.09.04            ",
      CONCEPTO: "Venta Material de Reciclaje e Inservible                                                                                                                                                                "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.002.09.05            ",
      CONCEPTO: "Recobros UISALUD ARL                                                                                                                                                                              "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.002.09.06            ",
      CONCEPTO: "Servicios Red Universitaria                                                                                                                                                                             "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.002.09.08            ",
      CONCEPTO: "Cuotas Asistenciales                                                                                                                                                                                    "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.05.002.09.09            ",
      CONCEPTO: "Afiliaciones UISALUD                                                                                                                                                                              "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06          ",
      CONCEPTO: "Transferencias corrientes"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.002",
      CONCEPTO: "Asignaciones y distribuciones del Sistema General de Regalías"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.002.01.03",
      CONCEPTO: "Asignaciones del Sistema General de Regalías"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.002.01.03.03",
      CONCEPTO: "Asignación para la inversión regional"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.002.01.03.03.01",
      CONCEPTO: "Asignación para la inversión regional - departamentos "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.002.01.03.03.01.01",
      CONCEPTO: "Asignaciones directas del departamento de Santander SGR"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.002.01.03.06",
      CONCEPTO: "Asignación para la ciencia, tecnología e innovación"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.002.01.03.06.01",
      CONCEPTO: "Asignación para la ciencia, tecnología e innovación - convocatorias"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.002.01.03.06.01.01",
      CONCEPTO: "Fondo de ciencia, tecnología e innovación del Sistema General de Regalías"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.002.01.03.06.02",
      CONCEPTO: "Asignación para la ciencia, tecnología e innovación - ambiente y desarrollo sostenible - convocatorias"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.002.01.03.06.03",
      CONCEPTO: "Asignación para la ciencia, tecnología e innovación - convocatorias 2021"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.002.01.03.06.04",
      CONCEPTO: "Asignación para la ciencia, tecnología e innovación - convocatorias 2021 - ambiente y desarrollo sostenible"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.006       ",
      CONCEPTO: "Transferencias del Gobierno Nacional y Departamental "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.006.01         ",
      CONCEPTO: "Aportes Nación"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.006.01.01            ",
      CONCEPTO: "Nación - Funcionamiento                                                                                                                                                                      "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.006.01.02            ",
      CONCEPTO: "Nacion Funcionamiento - Ajuste Ipc                                                                                                                                                                      "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.006.01.03            ",
      CONCEPTO: "Nacion - Cesu (Art. 87 Ley 30 De 1992)                                                                                                                                                                  "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.006.01.04            ",
      CONCEPTO: "Nacion Descuento Por Votaciones Ley 403 De 1997                                                                                                                                                         "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.006.01.05            ",
      CONCEPTO: "Nacion Otros Aportes                                                                                                                                                                                    "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.006.01.06            ",
      CONCEPTO: "Nación - Cesantías                                                                                                                                                                         "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.006.01.07            ",
      CONCEPTO: "Nación - Inversión                                                                                                                                                                 "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.006.01.08",
      CONCEPTO: "Nación - ICFES                                                                                                                                                                   "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.006.01.09",
      CONCEPTO: "Nación - Deuda                                                                                                                                                                   "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.006.01.10",
      CONCEPTO: "Gobierno Nacional - Ingresos de Vigencias Anteriores"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.006.02               ",
      CONCEPTO: "Devolución IVA- Instituciones de Educación Superior                                                                                                                                                     "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.006.02.01               ",
      CONCEPTO: "Devolución IVA"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.006.06               ",
      CONCEPTO: "Otras unidades de gobierno                                                                                                                                                                              "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.006.06.01               ",
      CONCEPTO: "Aportes Departamento"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.006.06.01.01            ",
      CONCEPTO: "Departamento - Funcionamiento                                                                                                                                                                 "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.006.06.01.02           ",
      CONCEPTO: "Departamento - Inversión                                                                                                                                                                    "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.006.06.01.03",
      CONCEPTO: "Departamento Regionalización - Funcionamiento                                                                                                                                                           "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.006.06.01.04",
      CONCEPTO: "Departamento Regionalización - Inversión                                                                                                                                                         "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.006.06.01.05",
      CONCEPTO: "Departamento  - Cesantías                                                                                                                                                                     "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.006.06.01.06",
      CONCEPTO: "Gobierno Departamental - Ingresos Vigencias Anteriores                                                                                                                                                                           "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.006.06.02      ",
      CONCEPTO: "Aportes Municipio"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.006.06.02.01",
      CONCEPTO: "Aportes Municipio                                                                                                                                                                                 "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.006.07           ",
      CONCEPTO: "Transferencias del Recaudo de Estampilla"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.006.07.01            ",
      CONCEPTO: "Estampilla Pro-UIS                                                                                                                                                                    "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.006.07.02            ",
      CONCEPTO: "Estampilla Pro Universidad Nacional de Colombia y demás Universidades Estatales de Colombia"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.009",
      CONCEPTO: "Recursos del Sistema de Seguridad Social Integral"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.009.02",
      CONCEPTO: "Sistema General de Pensiones"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.009.02.02            ",
      CONCEPTO: "Cuotas partes pensionales"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.009.02.02.01        ",
      CONCEPTO: "Cuotas Partes Pensionales"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.009.02.03         ",
      CONCEPTO: "Concurrencia Pasivo Pensional                                                                                                   "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.009.02.03.01         ",
      CONCEPTO: "Nación - Pasivo Pensional"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.009.02.03.02",
      CONCEPTO: "Departamento - Pasivo Pensional"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.009.02.03.03",
      CONCEPTO: "Aporte UIS-Concurrencia Pasivo Pensional                                                            "
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.010",
      CONCEPTO: "Sentencias y conciliaciones"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.010.01",
      CONCEPTO: "Fallos nacionales"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.010.01.01",
      CONCEPTO: "Sentencias"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.010.01.02",
      CONCEPTO: "Conciliaciones"
    },
    {
      RUBROPRESUPEUSTAL: "1.1.02.06.010.01.03",
      CONCEPTO: "Laudos arbitrales"
    },
    {
      RUBROPRESUPEUSTAL: "1.2                  ",
      CONCEPTO: "Recursos De Capital"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.01",
      CONCEPTO: "Disposición De Activos"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.01.02",
      CONCEPTO: "Disposición de Activos No Financieros"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.01.02.001",
      CONCEPTO: "Disposición de Activos Fijos"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.01.02.001.01",
      CONCEPTO: "Disposición de Edificaciones y Estructuras"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.01.02.001.02",
      CONCEPTO: "Disposición de Maquinaria y Equipo"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.01.02.001.03",
      CONCEPTO: "Disposición de Otros Activos Fijos"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.01.02.001.03.02",
      CONCEPTO: "Disposición de Productos de la Propiedad Intelectual"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.05",
      CONCEPTO: "Rendimientos Financieros"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.05.02",
      CONCEPTO: "Depósitos"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.05.02.01",
      CONCEPTO: "Rendimientos sobre Depósitos                                                                                                                                "
    },
    {
      RUBROPRESUPEUSTAL: "1.2.05.02.02",
      CONCEPTO: "Rendimientos Fiducia Pasivo Pensional"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.05.02.03",
      CONCEPTO: "Rendimientos Fondo Asegurador y Prestador                                                                                                                                                               "
    },
    {
      RUBROPRESUPEUSTAL: "1.2.05.02.04",
      CONCEPTO: "Rendimientos Fondo Alto Costo y Promoción y Prevención                                                                                                                                                  "
    },
    {
      RUBROPRESUPEUSTAL: "1.2.05.02.05",
      CONCEPTO: "Rendimientos Fondo Reserva Recursos UIS                                                                                                                                                         "
    },
    {
      RUBROPRESUPEUSTAL: "1.2.05.02.06",
      CONCEPTO: "Rendimientos Fondo Reserva Recursos Propios                                                                                                                                                             "
    },
    {
      RUBROPRESUPEUSTAL: "1.2.05.05                      ",
      CONCEPTO: "Intereses por Préstamos"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.05.05.01                      ",
      CONCEPTO: "Intereses y Rendimientos Deudores"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.06",
      CONCEPTO: "Recursos Del Crédito Externo"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.06.01                         ",
      CONCEPTO: "Recursos de Contratos de Empréstitos Externos"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.06.01.001                  ",
      CONCEPTO: "Bancos Comerciales"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.06.01.002                  ",
      CONCEPTO: "Entidades de Fomento                                                                                                                                                              "
    },
    {
      RUBROPRESUPEUSTAL: "1.2.07",
      CONCEPTO: "Recursos Del Crédito Interno"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.07.01                      ",
      CONCEPTO: "Recursos de Contratos de Empréstitos Internos"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.07.01.001                  ",
      CONCEPTO: "Banca Comercial"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.07.01.002",
      CONCEPTO: "Nación"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.07.01.003                  ",
      CONCEPTO: "Banca de Fomento"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.08",
      CONCEPTO: "Transferencias de Capital"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.08.01                      ",
      CONCEPTO: "Donaciones"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.08.01.003",
      CONCEPTO: "Del sector privado"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.08.01.003.01",
      CONCEPTO: "No condicionadas a la adquisición de un activo "
    },
    {
      RUBROPRESUPEUSTAL: "1.2.08.01.003.01.01",
      CONCEPTO: "Donaciones en efectivo"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.08.01.003.02",
      CONCEPTO: "Condicionadas a la adquisición de un activo "
    },
    {
      RUBROPRESUPEUSTAL: "1.2.08.02                      ",
      CONCEPTO: "Indemnización Relacionada con Seguros No de Vida"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.10",
      CONCEPTO: "Recursos del Balance"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.10.02                      ",
      CONCEPTO: "Superávit Fiscal"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.13",
      CONCEPTO: "Reintegros y Otros Recursos No Apropiados"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.13.01             ",
      CONCEPTO: "Reintegros"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.13.01.01",
      CONCEPTO: "Reintegros                                                                                                                                                                                              "
    },
    {
      RUBROPRESUPEUSTAL: "1.2.13.01.02",
      CONCEPTO: "Reconocimiento de Incapacidades                                                                                                                                                                         "
    },
    {
      RUBROPRESUPEUSTAL: "1.2.13.02           ",
      CONCEPTO: "Recursos no apropiados"
    },
    {
      RUBROPRESUPEUSTAL: "1.2.13.02.01           ",
      CONCEPTO: "Ingresos Vigencias Anteriores"
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
      setTimeout(() => {
        this.corregirCodigos();
      }, 500);
      this.validartabla = 1
      console.log(this.datosTabla)
    }
  }


  corregirCodigos(): void {
    for (const userCode of this.datosTabla) {
      console.log(userCode)
      const matchingEquivalence = this.equivalenciaINGRESO.find((equivalence: any) =>
        equivalence.RUBROPRESUPEUSTAL.trim() === userCode.RUBROPRESUPEUSTAL.trim()
      );

      if (matchingEquivalence) {
        userCode.CONCEPTO = matchingEquivalence.CONCEPTO.trim();
      }
    }

    console.log(this.datosTabla);
  }
  exportexcel1(): void {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const hoja = XLSX.utils.aoa_to_sheet(this.datosTabla);

    // Configurar el formato de la columna B como texto
    hoja['B'] = hoja['B'].map((celda: any) => {
      celda.z = '@';
      return celda;
    });

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }

  exportexcel() {
    // Obtener la tabla
    const tabla: any = document.getElementById('excel-table');

    // Obtener los datos de la tabla en un arreglo de arreglos
    const datos = this.getTablaData(tabla);

    // Crear una hoja de Excel
    const hoja: any = XLSX.utils.aoa_to_sheet(datos);

    // Configurar el formato de la columna B como texto
    const range = XLSX.utils.decode_range(hoja['!ref']);
    for (let i = range.s.r + 1; i <= range.e.r; i++) {
      const celda = hoja[XLSX.utils.encode_cell({ r: i, c: 1 })];
      celda.z = '@';
    }

    // Configurar el ancho de las columnas
    const anchoColumnas = [{ wch: 40 }, { wch: 20 }, { wch: 50 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 40 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
    hoja['!cols'] = anchoColumnas;

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
        switch (j) {
          case 0:
            hoja[ref].s.fill = { fgColor: { rgb: 'C6EFCE' } };
            break;
          case 1:
            hoja[ref].s.fill = { fgColor: { rgb: 'FFC7CE' } };
            break;
          case 2:
            hoja[ref].s.fill = { fgColor: { rgb: 'FFEB9C' } };
            break;
          case 3:
            hoja[ref].s.fill = { fgColor: { rgb: 'B4A7D6' } };
            break;
          case 4:
            hoja[ref].s.fill = { fgColor: { rgb: 'F9CB9C' } };
            break;
          case 5:
            hoja[ref].s.fill = { fgColor: { rgb: 'F9CB9C' } };
            break;
          case 6:
            hoja[ref].s.fill = { fgColor: { rgb: 'CECEF6' } };
            break;
          case 7:
            hoja[ref].s.fill = { fgColor: { rgb: 'F6CECE' } };
            break;
          case 8:
            hoja[ref].s.fill = { fgColor: { rgb: 'E6B8AF' } };
            break;
          case 9:
            hoja[ref].s.fill = { fgColor: { rgb: 'E6B8AF' } };
            break;
          case 10:
            hoja[ref].s.fill = { fgColor: { rgb: 'E6B8AF' } };
            break;
          case 11:
            hoja[ref].s.fill = { fgColor: { rgb: 'E6B8AF' } };
            break;
        } 
        }
      }
      // Crear un libro de Excel y agregar la hoja
      const libro = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(libro, hoja, 'Tabla');

      // Descargar el archivo Excel
      XLSX.writeFile(libro, 'tabla.xlsx');
    }

    getTablaData(tabla: HTMLElement): any[][] {
      // Obtener las filas de la tabla
      const filas = Array.from(tabla.querySelectorAll('tr'));

      // Obtener los encabezados de columna
      const encabezados = filas.shift()?.querySelectorAll('th');

      // Obtener los datos de la tabla en un arreglo de arreglos
      const datos = filas.map((fila) =>
        Array.from(fila.querySelectorAll('td')).map((celda) => celda.innerText)
      );

      // Agregar los encabezados de columna al inicio del arreglo de arreglos
      if (encabezados) {
        datos.unshift(Array.from(encabezados).map((encabezado) => encabezado.innerText));
      }

      return datos;
    }





    ejecutarResumenIngresos() {
      const busqueda = this.datosTabla.reduce((acc: any, codigo: any) => {
        acc[codigo.RUBROPRESUPEUSTAL.trim()] = ++acc[codigo.RUBROPRESUPEUSTAL.trim()] || 0;
        return acc;
      }, {});
      const duplicados = this.datosTabla.filter((codigo: any) => {
        return busqueda[codigo.RUBROPRESUPEUSTAL.trim()];

      });
      const unicos: any = [];

      for (var i = 0; i < duplicados.length; i++) {

        const elemento = duplicados[i].RUBROPRESUPEUSTAL;

        if (!unicos.includes(duplicados[i].RUBROPRESUPEUSTAL.trim())) {
          unicos.push(elemento);
        }
      }
      let arreglosDuplicados: any = []
      unicos.forEach((element: any) => {
        const arreglosSeparados = duplicados.filter((campo: any) => campo.RUBROPRESUPEUSTAL.trim() == element)
        arreglosDuplicados.push(arreglosSeparados)
      })
      let element1
      let element2
      for (let index = 0; index < arreglosDuplicados.length; index++) {
        element1 = arreglosDuplicados[index].length;
        element2 = arreglosDuplicados[index]
        let x = 0
        let y = 0
        let w = 0
        let p = 0
        for (let i = 0; i < element1; i++) {
          const element = element2[i]
          if (p == 0) {
            if (element.POREJECUTAR == undefined) {
              p = 0
            } else {
              p = element.POREJECUTAR
            }
          } else {
            p = p + element.POREJECUTAR
            localStorage.setItem(element.RUBROPRESUPEUSTAL, JSON.stringify({ codigo: element.RUBROPRESUPEUSTAL, recaudo: y, valor: x, definitivo: w, ejecutar: p }))
            this.datosDuplicados.push({ codigo: element.RUBROPRESUPEUSTAL, recaudo: y, valor: x, definitivo: w, ejecutar: p })
          }
          if (w == 0) {
            if (element.PRESUPUESTODEFINITIVO == undefined) {
              w = 0
            } else {
              w = element.PRESUPUESTODEFINITIVO
            }
          } else {
            w = w + element.PRESUPUESTODEFINITIVO
            localStorage.setItem(element.RUBROPRESUPEUSTAL, JSON.stringify({ codigo: element.RUBROPRESUPEUSTAL, recaudo: y, valor: x, definitivo: w, ejecutar: p }))
            this.datosDuplicados.push({ codigo: element.RUBROPRESUPEUSTAL, recaudo: y, valor: x, definitivo: w, ejecutar: p })
          }
          if (y == 0) {
            if (element.RECAUDO == undefined) {
              y = 0
            } else {
              y = element.RECAUDO
            }
          } else {
            y = y + element.RECAUDO
            localStorage.setItem(element.RUBROPRESUPEUSTAL, JSON.stringify({ codigo: element.RUBROPRESUPEUSTAL, recaudo: y, valor: x, definitivo: w, ejecutar: p }))
            this.datosDuplicados.push({ codigo: element.RUBROPRESUPEUSTAL, recaudo: y, valor: x, definitivo: w, ejecutar: p })
          }
          if (x == 0) {
            if (element.APROPIACIONINICIAL == undefined) {
              x = 0
            } else {
              x = element.APROPIACIONINICIAL
            }

          } else {
            x = x + element.APROPIACIONINICIAL
            localStorage.setItem(element.RUBROPRESUPEUSTAL, JSON.stringify({ codigo: element.RUBROPRESUPEUSTAL, recaudo: y, valor: x, definitivo: w, ejecutar: p }))
            this.datosDuplicados.push({ codigo: element.RUBROPRESUPEUSTAL, recaudo: y, valor: x, definitivo: w, ejecutar: p })
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
        let x: any = localStorage.getItem(element.codigo)
        x = JSON.parse(x)
        arraydeDuplicados = [...arraydeDuplicados, x]
        localStorage.setItem('duplicadosIngresos', JSON.stringify(arraydeDuplicados))
      });
      for (let index = 0; index < arraydeDuplicados.length; index++) {
        let x = this.datosTabla.filter((element: any) => element.RUBROPRESUPEUSTAL.trim() == arraydeDuplicados[index].codigo)
        x.forEach((element: any) => {
          element.APROPIACIONINICIAL = arraydeDuplicados[index].valor
          element.RECAUDO = arraydeDuplicados[index].recaudo
          element.PRESUPUESTODEFINITIVO = arraydeDuplicados[index].definitivo
          element.POREJECUTAR = arraydeDuplicados[index].ejecutar
          this.elementosUnificados = this.datosTabla.map((element1: any) => element1.RUBROPRESUPEUSTAL.trim() == element.RUBROPRESUPEUSTAL.trim() ? element : element1)
        });

        let objetoSinRepetidos: any = {};
        this.elementosUnificados.forEach(function (elemento: any) {
          objetoSinRepetidos[elemento.RUBROPRESUPEUSTAL.trim()] = elemento;
        });

        let arregloSinRepetidos = Object.values(objetoSinRepetidos);
        this.datosTabla = arregloSinRepetidos
      }
      if (this.ejecucion == 0) {
        this.ejecucion = 1
        this.ejecutarResumenIngresos()
      } else {
        this.mostrarBoton = 1
        this.ejecucion = 0
        this.ejecutarSegundoResumen()
        localStorage.clear()
      }
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
        if (!this.elementoRepite(i.RUBROPRESUPEUSTAL.trim())) {
          this.sinDuplicadosTABLA.push(i);
        }
      })
    }
    elementoRepiteTABLA(valor: any) {
      let vecesRepetidas = 0;
      for (let i of this.sinDuplicadosTABLA) {
        if (i.RUBROPRESUPEUSTAL.trim() == valor) {
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
      for (let index = 0; index <= this.informacion.length; index++) {
        let x = this.datosTabla.filter((element: any) => element.RUBROPRESUPEUSTAL.trim() == this.informacion[index].CODIGO.trim())
        x.forEach((element: any) => {
          element.CPC = this.informacion[index].CPC
          element.TERCEROS = this.informacion[index].TERCEROS
          element.FUENTESDEFINANCIACION = this.informacion[index].FUENTESDEFINANCIACION
          element.POLITICAPUBLICA = this.informacion[index].POLITICAPUBLICA
          this.elementosUnificados = this.datosTabla.map((element1: any) => element1.RUBROPRESUPEUSTAL == element.RUBROPRESUPEUSTAL ? element : element1)
          if (index == this.informacion.length - 1) {
            this.ejecutarModeloDeResumidos(this.contadormodelo)
          }
        });
      }

    }
    ejecutarModeloDeResumidos(contadorValor: any) {
      const busqueda = this.datosTabla.reduce((acc: any, codigo: any) => {
        acc[codigo.RUBROPRESUPEUSTAL.trim().slice(0, contadorValor)] = ++acc[codigo.RUBROPRESUPEUSTAL.trim().slice(0, contadorValor)] || 0;
        return acc;
      }, {});
      const duplicados = this.datosTabla.filter((codigo: any) => {
        return busqueda[codigo.RUBROPRESUPEUSTAL.trim().slice(0, contadorValor)];
      });
      let unicos: any = [];
      for (var i = 0; i < duplicados.length; i++) {
        const elemento = duplicados[i].RUBROPRESUPEUSTAL.trim().slice(0, contadorValor);
        if (!unicos.includes(duplicados[i].RUBROPRESUPEUSTAL.trim().slice(0, contadorValor))) {
          unicos.push(elemento);
          this.unicosmodelo = unicos
        }
      }
      if (contadorValor == 1) {
        console.log('nada')
      } else {
        let x = unicos.filter((element: any) => element.length == contadorValor)
        unicos = x
        this.unicosmodelo = x
      }
      let arreglosDuplicados: any = []
      unicos.forEach((element: any) => {
        const arreglosSeparados = this.datosTabla.filter((campo: any) => campo.RUBROPRESUPEUSTAL.trim().slice(0, contadorValor) == element)
        arreglosDuplicados.push(arreglosSeparados)
      })
      let element1
      let element2
      for (let index = 0; index < arreglosDuplicados.length; index++) {
        element1 = arreglosDuplicados[index].length;
        element2 = arreglosDuplicados[index]
        let x = 0
        let y = 0
        let w = 0
        let p = 0
        for (let i = 0; i < element1; i++) {
          const element = element2[i]
          // REVISARRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
          if (p == 0) {
            if (element.POREJECUTAR == undefined) {
              p = 0
            } else {
              p = element.POREJECUTAR
            }
            localStorage.setItem(element.RUBROPRESUPEUSTAL.trim().slice(0, contadorValor), JSON.stringify({ codigo: element.RUBROPRESUPEUSTAL.trim().slice(0, contadorValor), recaudoMODELO: y, valor: x, definitivo: w, ejecutar: p }))
          } else {
            if (element.POREJECUTAR == undefined || element.POREJECUTAR == null) {
              p = p + 0
            } else {
              p = p + element.POREJECUTAR
              localStorage.setItem(element.RUBROPRESUPEUSTAL.trim().slice(0, contadorValor), JSON.stringify({ codigo: element.RUBROPRESUPEUSTAL.trim().slice(0, contadorValor), recaudoMODELO: y, valor: x, definitivo: w, ejecutar: p }))
            }
          }
          if (w == 0) {
            if (element.PRESUPUESTODEFINITIVO == undefined) {
              w = 0
            } else {
              w = element.PRESUPUESTODEFINITIVO
            }
            localStorage.setItem(element.RUBROPRESUPEUSTAL.trim().slice(0, contadorValor), JSON.stringify({ codigo: element.RUBROPRESUPEUSTAL.trim().slice(0, contadorValor), recaudoMODELO: y, valor: x, definitivo: w, ejecutar: p }))
          } else {
            if (element.PRESUPUESTODEFINITIVO == undefined || element.PRESUPUESTODEFINITIVO == null) {
              w = w + 0
            } else {
              w = w + element.PRESUPUESTODEFINITIVO
              localStorage.setItem(element.RUBROPRESUPEUSTAL.trim().slice(0, contadorValor), JSON.stringify({ codigo: element.RUBROPRESUPEUSTAL.trim().slice(0, contadorValor), recaudoMODELO: y, valor: x, definitivo: w, ejecutar: p }))
            }
          }
          if (y == 0) {
            if (element.RECAUDO == undefined) {
              y = 0
            } else {
              y = element.RECAUDO
            }
            localStorage.setItem(element.RUBROPRESUPEUSTAL.trim().slice(0, contadorValor), JSON.stringify({ codigo: element.RUBROPRESUPEUSTAL.trim().slice(0, contadorValor), recaudoMODELO: y, valor: x, definitivo: w, ejecutar: p }))
          } else {
            if (element.RECAUDO == undefined || element.RECAUDO == null) {
              y = y + 0
            } else {
              y = y + element.RECAUDO
              localStorage.setItem(element.RUBROPRESUPEUSTAL.trim().slice(0, contadorValor), JSON.stringify({ codigo: element.RUBROPRESUPEUSTAL.trim().slice(0, contadorValor), recaudoMODELO: y, valor: x, definitivo: w, ejecutar: p }))
            }
          }
          if (x == 0) {
            if (element.APROPIACIONINICIAL == undefined) {
              x = 0
            } else {
              x = element.APROPIACIONINICIAL
            }
            localStorage.setItem(element.RUBROPRESUPEUSTAL.trim().slice(0, contadorValor), JSON.stringify({ codigo: element.RUBROPRESUPEUSTAL.trim().slice(0, contadorValor), recaudoMODELO: y, valor: x, definitivo: w, ejecutar: p }))
          } else {
            if (element.APROPIACIONINICIAL == undefined || null) {
              x = x + 0
            } else {
              x = x + element.APROPIACIONINICIAL
              localStorage.setItem(element.RUBROPRESUPEUSTAL.trim().slice(0, contadorValor), JSON.stringify({ codigo: element.RUBROPRESUPEUSTAL.trim().slice(0, contadorValor), recaudoMODELO: y, valor: x, definitivo: w, ejecutar: p }))
            }
            this.datosDuplicados.push({ codigo: element.RUBROPRESUPEUSTAL.trim().slice(0, contadorValor), recaudoMODELO: y, valor: x, definitivo: w, ejecutar: p })
          }
        }
      }
      if (this.contadormodelo <= 9) {
        this.contadormodelo = this.contadormodelo - 1
      } else {
        this.contadormodelo = 9
      }

      this.extrayendoDuplicadosSumadosMODELO()
    }
    extrayendoDuplicadosSumadosMODELO() {
      let arraydeDuplicados: any = []
      this.unicosmodelo.forEach((element: any) => {
        let x: any = localStorage.getItem(element)
        x = JSON.parse(x)
        arraydeDuplicados = [...arraydeDuplicados, x]
        localStorage.setItem('duplicadosIngresos', JSON.stringify(arraydeDuplicados))
      });
      for (let index = 0; index < arraydeDuplicados.length; index++) {
        let x = this.modeloInformacion.filter((element: any) => element.RUBROPRESUPEUSTAL.trim() == arraydeDuplicados[index].codigo)
        x.forEach((element: any) => {
          element.APROPIACIONINICIAL = arraydeDuplicados[index].valor
          element.RECAUDO = arraydeDuplicados[index].recaudoMODELO
          element.PRESUPUESTODEFINITIVO = arraydeDuplicados[index].definitivo
          element.POREJECUTAR = arraydeDuplicados[index].ejecutar
          this.elementosUnificados = this.modeloInformacion.map((element1: any) => element1.RUBROPRESUPEUSTAL == element.RUBROPRESUPEUSTAL ? element : element1)
        });
      }
      this.elementosUnificados.forEach((element: any) => {
        element.RUBROPRESUPEUSTAL = element.RUBROPRESUPEUSTAL.trim()
      });
      this.datosTabla.forEach((element: any) => {
        element.RUBROPRESUPEUSTAL = element.RUBROPRESUPEUSTAL.trim()
      });
      if (this.contadormodelo == 0) {
        const mergedArray = this.datosTabla.concat(this.elementosUnificados);
        mergedArray.sort((a: any, b: any) => {
          const aCodeArray: any = a.RUBROPRESUPEUSTAL.split('.');
          const bCodeArray: any = b.RUBROPRESUPEUSTAL.split('.');

          for (let i = 0; i < Math.max(aCodeArray.length, bCodeArray.length); i++) {
            const aCodePart = aCodeArray[i] || 0;
            const bCodePart = bCodeArray[i] || 0;
            if (aCodePart !== bCodePart) {
              return aCodePart - bCodePart;
            }
          }
          return 0;
        }); // ordenar los objetos por código
        this.datosTabla = mergedArray
        this.actualizarTabla()
      } else {
        this.ejecutarModeloDeResumidos(this.contadormodelo)
      }

    }

    actualizarTabla() {
      this.datosTabla.forEach((element: any) => {
        element.RUBROPRESUPEUSTAL = element.RUBROPRESUPEUSTAL.trim()
      });
      this.formatearNumeros()
    }
    formatearNumeros(): any[] {
      for (const objeto of this.datosTabla) {
        if(objeto.APROPIACIONINICIAL == null || undefined){
          objeto.APROPIACIONINICIAL = 0
        } else{
          objeto.APROPIACIONINICIAL = formatNumber(objeto.APROPIACIONINICIAL, 'en-US');
        }
        if(objeto.PRESUPUESTODEFINITIVO == null || undefined){
          objeto.PRESUPUESTODEFINITIVO = 0
        } else{
          objeto.PRESUPUESTODEFINITIVO = formatNumber(objeto.PRESUPUESTODEFINITIVO, 'en-US');
        }
        if(objeto.RECAUDO == null || undefined){
          objeto.RECAUDO = 0
        } else{
          objeto.RECAUDO = formatNumber(objeto.RECAUDO, 'en-US');
        }
        if(objeto.POREJECUTAR == null || undefined){
          objeto.POREJECUTAR = 0
        } else{
          objeto.POREJECUTAR = formatNumber(objeto.POREJECUTAR, 'en-US');
        }
      }
    
      return this.datosTabla;
    }

  }
