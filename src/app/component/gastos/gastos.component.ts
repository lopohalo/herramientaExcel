import { Component, OnInit } from '@angular/core';
import { elementAt, filter } from 'rxjs';
import {
  formatNumber
}
  from '@angular/common';
import * as numeral from 'numeral';
import * as XLSX from 'xlsx'
import { Router } from '@angular/router';

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.scss']
})
export class GastosComponent implements OnInit {
  title = 'herramientaExcel';
  validartabla = 0
  rutaVerificacionBotones:any =''
  contadorPrimerArreglo = 0
  baseInformes:any
  cargandoPaginaSpinner:any = ''
  arregloGrande = []
  mostrarReporte: any = ''
  mostrarBoton = 0
  contadormodelo = 19
  convertedJson!: string;
  fileName = 'tabla.xlsx';
  ejecucion = 0
  datosTabla: any = []
  datosDuplicados: any = []
  sinDuplicados: any = []
  sinDuplicadosTABLA: any = []
  unicosmodelo = []
  titulo:any = ''
  elementosUnificados: any
  modeloInformacion = [
    
    {
        "CODIGOPRESUPUESTAL": "2",
        "CONCEPTO": "GASTOS ",
        "APROPIACIONINICIAL" : "0",
        "PAGOS" : "0",
        "PRESUPUESTODEFINITIVO" : "0",
        "EJECUTADOCOMOOBLIGACION" :"0",
        "COMPROMETIDO" : "0",
        "OBLIGACIONES" : "0"
    },
,

    {
        "CODIGOPRESUPUESTAL": "2.1",
        "CONCEPTO": "FUNCIONAMIENTO ",
          "APROPIACIONINICIAL" : "0",
        "PAGOS" : "0",
        "PRESUPUESTODEFINITIVO" : "0",
        "EJECUTADOCOMOOBLIGACION" :"0",
        "COMPROMETIDO" : "0",
        "OBLIGACIONES" : "0"
    }
,

    {
        "CODIGOPRESUPUESTAL": "2.1.1",
        "CONCEPTO": "GASTOS DE PERSONAL ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

    {
        "CODIGOPRESUPUESTAL": "2.1.1.01 ",
        "CONCEPTO": "PLANTA DE PERSONAL PERMANENTE ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

    {
        "CODIGOPRESUPUESTAL": "2.1.1.01.01 ",
        "CONCEPTO": "FACTORES CONSTITUTIVOS DE SALARIO ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.1.1.01.01.001 ",
        "CONCEPTO": "FACTORES SALARIALES COMUNES ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.1.1.01.02 ",
        "CONCEPTO": "CONTRIBUCIONES INHERENTES A LA NOMINA ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

   
    {
        "CODIGOPRESUPUESTAL": "2.1.1.01.03 ",
        "CONCEPTO": "REMUNERACIONES NO CONSTITUTIVAS DE FACTOR SALARIAL ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

   
    {
        "CODIGOPRESUPUESTAL": "2.1.1.01.03.001 ",
        "CONCEPTO": "PRESTACIONES SOCIALES ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

   
    {
        "CODIGOPRESUPUESTAL": "2.1.1.02 ",
        "CONCEPTO": "PERSONAL SUPERNUMERARIO Y PLANTA TEMPORAL ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.1.1.02.01 ",
        "CONCEPTO": "FACTORES CONSTITUTIVOS DE SALARIO ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

   
    {
        "CODIGOPRESUPUESTAL": "2.1.1.02.01.001 ",
        "CONCEPTO": "FACTORES SALARIALES COMUNES ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.1.1.02.02 ",
        "CONCEPTO": "CONTRIBUCIONES INHERENTES A LA NOMINA ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

   
    {
        "CODIGOPRESUPUESTAL": "2.1.1.02.03 ",
        "CONCEPTO": "REMUNERACIONES NO CONSTITUTIVAS DE FACTOR SALARIAL ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

   
    {
        "CODIGOPRESUPUESTAL": "2.1.1.02.03.001 ",
        "CONCEPTO": "PRESTACIONES SOCIALES ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

   
    {
        "CODIGOPRESUPUESTAL": "2.1.2 ",
        "CONCEPTO": "ADQUISICION DE BIENES Y SERVICIOS ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.1.2.02 ",
        "CONCEPTO": "ADQUISICIONES DIFERENTES DE ACTIVOS ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.1.2.02.01 ",
        "CONCEPTO": "MATERIALES Y SUMINISTROS ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,
{
  "CODIGOPRESUPUESTAL": "2.1.2.02.01.003 ",
  "CONCEPTO": "",
  "APROPIACIONINICIAL" : "0",
"PAGOS" : "0",
"PRESUPUESTODEFINITIVO" : "0",
"EJECUTADOCOMOOBLIGACION" :"0",
"COMPROMETIDO" : "0",
"OBLIGACIONES" : "0"
}
,

    
    {
        "CODIGOPRESUPUESTAL": "2.1.2.02.02 ",
        "CONCEPTO": "ADQUISICION DE SERVICIOS ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.1.2.02.03 ",
        "CONCEPTO": "GASTOS IMPREVISTOS ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

    {
        "CODIGOPRESUPUESTAL": "2.1.3 ",
        "CONCEPTO": "TRANSFERENCIAS CORRIENTES ",
        "APROPIACIONINICIAL" : "0",
        "PAGOS" : "0",
        "PRESUPUESTODEFINITIVO" : "0",
        "EJECUTADOCOMOOBLIGACION" :"0",
        "COMPROMETIDO" : "0",
        "OBLIGACIONES" : "0"
    }
,

    {
        "CODIGOPRESUPUESTAL": "2.1.3.04 ",
        "CONCEPTO": "A ORGANIZACIONES NACIONALES ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

   
    {
        "CODIGOPRESUPUESTAL": "2.1.3.04.05 ",
        "CONCEPTO": "A OTRAS ORGANIZACIONES NACIONALES ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.1.3.07 ",
        "CONCEPTO": "PRESTACIONES PARA CUBRIR RIESGOS SOCIALES ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.1.3.07.02 ",
        "CONCEPTO": "PRESTACIONES SOCIALES RELACIONADAS CON EL EMPLEO ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.1.7 ",
        "CONCEPTO": "DISMINUCION DE PASIVOS ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.1.7.01 ",
        "CONCEPTO": "CESANTIAS ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.1.8 ",
        "CONCEPTO": "GASTOS POR TRIBUTOS, TASAS, CONTRIBUCIONES, MULTAS, SANCIONES E INTERESES DE MORA ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

   
    {
        "CODIGOPRESUPUESTAL": "2.1.8.01 ",
        "CONCEPTO": "IMPUESTOS ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.3 ",
        "CONCEPTO": "INVERSION ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.3.2 ",
        "CONCEPTO": "ADQUISICION DE BIENES Y SERVICIOS ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

   
    {
        "CODIGOPRESUPUESTAL": "2.3.2.01 ",
        "CONCEPTO": "ADQUISICION DE ACTIVOS NO FINANCIEROS ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

   
    {
        "CODIGOPRESUPUESTAL": "2.3.2.01.01 ",
        "CONCEPTO": "ACTIVOS FIJOS ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.3.2.01.01.001 ",
        "CONCEPTO": "EDIFICACIONES Y ESTRUCTURAS ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.3.2.01.01.003 ",
        "CONCEPTO": "MAQUINARIA Y EQUIPO ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

   
    {
        "CODIGOPRESUPUESTAL": "2.3.2.01.01.004 ",
        "CONCEPTO": "ACTIVOS FIJOS NO CLASIFICADOS COMO MAQUINARIA Y EQUIPO ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.3.2.01.01.005 ",
        "CONCEPTO": "OTROS ACTIVOS FIJOS ",
        "APROPIACIONINICIAL" : "0",
      "PAGOS" : "0",
      "PRESUPUESTODEFINITIVO" : "0",
      "EJECUTADOCOMOOBLIGACION" :"0",
      "COMPROMETIDO" : "0",
      "OBLIGACIONES" : "0"
    },
    {
      "CODIGOPRESUPUESTAL": "2.1.1.01.01.001.08",
      "CONCEPTO": "OPRESTACIONES SOCIALES",
      "APROPIACIONINICIAL" : "0",
    "PAGOS" : "0",
    "PRESUPUESTODEFINITIVO" : "0",
    "EJECUTADOCOMOOBLIGACION" :"0",
    "COMPROMETIDO" : "0",
    "OBLIGACIONES" : "0"
    },
    {
      "CODIGOPRESUPUESTAL": "2.1.1.01.01.002",
      "CONCEPTO": "FACTORES SALARIALES ESPECIALES",
      "APROPIACIONINICIAL" : "0",
    "PAGOS" : "0",
    "PRESUPUESTODEFINITIVO" : "0",
    "EJECUTADOCOMOOBLIGACION" :"0",
    "COMPROMETIDO" : "0",
    "OBLIGACIONES" : "0"
    },
    {
      "CODIGOPRESUPUESTAL": "2.1.1.01.01.002.12",
      "CONCEPTO": "PRIMA DE ANTIGÃœEDAD",
      "APROPIACIONINICIAL" : "0",
    "PAGOS" : "0",
    "PRESUPUESTODEFINITIVO" : "0",
    "EJECUTADOCOMOOBLIGACION" :"0",
    "COMPROMETIDO" : "0",
    "OBLIGACIONES" : "0"
    },
    {
      "CODIGOPRESUPUESTAL": "2.1.1.02.01.001.08",
      "CONCEPTO": "PRESTACIONES SOCIALES",
      "APROPIACIONINICIAL" : "0",
    "PAGOS" : "0",
    "PRESUPUESTODEFINITIVO" : "0",
    "EJECUTADOCOMOOBLIGACION" :"0",
    "COMPROMETIDO" : "0",
    "OBLIGACIONES" : "0"
    },
    {
      "CODIGOPRESUPUESTAL": "2.1.3.13.01",
      "CONCEPTO": "FALLOS NACIONALES",
      "APROPIACIONINICIAL" : "0",
    "PAGOS" : "0",
    "PRESUPUESTODEFINITIVO" : "0",
    "EJECUTADOCOMOOBLIGACION" :"0",
    "COMPROMETIDO" : "0",
    "OBLIGACIONES" : "0"
    },
    {
      "CODIGOPRESUPUESTAL": "2.1.5",
      "CONCEPTO": "GASTOS DE COMERCIALIZACION Y PRODUCCION",
      "APROPIACIONINICIAL" : "0",
    "PAGOS" : "0",
    "PRESUPUESTODEFINITIVO" : "0",
    "EJECUTADOCOMOOBLIGACION" :"0",
    "COMPROMETIDO" : "0",
    "OBLIGACIONES" : "0"
    },
    {
      "CODIGOPRESUPUESTAL": "2.1.5.01",
      "CONCEPTO": "MATERIALES Y SUMINISTROS",
      "APROPIACIONINICIAL" : "0",
    "PAGOS" : "0",
    "PRESUPUESTODEFINITIVO" : "0",
    "EJECUTADOCOMOOBLIGACION" :"0",
    "COMPROMETIDO" : "0",
    "OBLIGACIONES" : "0"
    },
    {
      "CODIGOPRESUPUESTAL": "2.1.5.02",
      "CONCEPTO": "ADQUISICION DE SERVICIOS",
      "APROPIACIONINICIAL" : "0",
    "PAGOS" : "0",
    "PRESUPUESTODEFINITIVO" : "0",
    "EJECUTADOCOMOOBLIGACION" :"0",
    "COMPROMETIDO" : "0",
    "OBLIGACIONES" : "0"
    },
    {
      "CODIGOPRESUPUESTAL": "2.1.3.07.02.001 ",
      "CONCEPTO": "",
      "APROPIACIONINICIAL" : "0",
    "PAGOS" : "0",
    "PRESUPUESTODEFINITIVO" : "0",
    "EJECUTADOCOMOOBLIGACION" :"0",
    "COMPROMETIDO" : "0",
    "OBLIGACIONES" : "0"
  },
  {
    "CODIGOPRESUPUESTAL": "2.1.1.01.01.001.04",
    "CONCEPTO": "",
    "APROPIACIONINICIAL" : "0",
  "PAGOS" : "0",
  "PRESUPUESTODEFINITIVO" : "0",
  "EJECUTADOCOMOOBLIGACION" :"0",
  "COMPROMETIDO" : "0",
  "OBLIGACIONES" : "0"
},
{
  "CODIGOPRESUPUESTAL": "2.1.3.07.02.010",
  "CONCEPTO": "",
  "APROPIACIONINICIAL" : "0",
"PAGOS" : "0",
"PRESUPUESTODEFINITIVO" : "0",
"EJECUTADOCOMOOBLIGACION" :"0",
"COMPROMETIDO" : "0",
"OBLIGACIONES" : "0"
},
{
  "CODIGOPRESUPUESTAL": "2.1.3.08",
  "CONCEPTO": "",
  "APROPIACIONINICIAL" : "0",
"PAGOS" : "0",
"PRESUPUESTODEFINITIVO" : "0",
"EJECUTADOCOMOOBLIGACION" :"0",
"COMPROMETIDO" : "0",
"OBLIGACIONES" : "0"
},
{
  "CODIGOPRESUPUESTAL": "2.1.3.13",
  "CONCEPTO": "",
  "APROPIACIONINICIAL" : "0",
"PAGOS" : "0",
"PRESUPUESTODEFINITIVO" : "0",
"EJECUTADOCOMOOBLIGACION" :"0",
"COMPROMETIDO" : "0",
"OBLIGACIONES" : "0"
},
{
  "CODIGOPRESUPUESTAL": "2.1.8.04",
  "CONCEPTO": "",
  "APROPIACIONINICIAL" : "0",
"PAGOS" : "0",
"PRESUPUESTODEFINITIVO" : "0",
"EJECUTADOCOMOOBLIGACION" :"0",
"COMPROMETIDO" : "0",
"OBLIGACIONES" : "0"
},
{
  "CODIGOPRESUPUESTAL": "2.1.3.07.02.002",
  "CONCEPTO": "",
  "APROPIACIONINICIAL" : "0",
"PAGOS" : "0",
"PRESUPUESTODEFINITIVO" : "0",
"EJECUTADOCOMOOBLIGACION" :"0",
"COMPROMETIDO" : "0",
"OBLIGACIONES" : "0"
},
{
  "CODIGOPRESUPUESTAL": "2.99",
  "CONCEPTO": "",
  "APROPIACIONINICIAL" : "0",
"PAGOS" : "0",
"PRESUPUESTODEFINITIVO" : "0",
"EJECUTADOCOMOOBLIGACION" :"0",
"COMPROMETIDO" : "0",
"OBLIGACIONES" : "0"
},
{
  "CODIGOPRESUPUESTAL": "2.3.1",
  "CONCEPTO": "",
  "APROPIACIONINICIAL" : "0",
"PAGOS" : "0",
"PRESUPUESTODEFINITIVO" : "0",
"EJECUTADOCOMOOBLIGACION" :"0",
"COMPROMETIDO" : "0",
"OBLIGACIONES" : "0"
},
{
  "CODIGOPRESUPUESTAL": "2.3.1.01",
  "CONCEPTO": "",
  "APROPIACIONINICIAL" : "0",
"PAGOS" : "0",
"PRESUPUESTODEFINITIVO" : "0",
"EJECUTADOCOMOOBLIGACION" :"0",
"COMPROMETIDO" : "0",
"OBLIGACIONES" : "0"
},
{
  "CODIGOPRESUPUESTAL": "2.3.1.01.01",
  "CONCEPTO": "",
  "APROPIACIONINICIAL" : "0",
"PAGOS" : "0",
"PRESUPUESTODEFINITIVO" : "0",
"EJECUTADOCOMOOBLIGACION" :"0",
"COMPROMETIDO" : "0",
"OBLIGACIONES" : "0"
},
{
  "CODIGOPRESUPUESTAL": "2.3.1.01.01.001",
  "CONCEPTO": "",
  "APROPIACIONINICIAL" : "0",
"PAGOS" : "0",
"PRESUPUESTODEFINITIVO" : "0",
"EJECUTADOCOMOOBLIGACION" :"0",
"COMPROMETIDO" : "0",
"OBLIGACIONES" : "0"
},
{
  "CODIGOPRESUPUESTAL": "2.3.1.01.01.001.07",
  "CONCEPTO": "",
  "APROPIACIONINICIAL" : "0",
"PAGOS" : "0",
"PRESUPUESTODEFINITIVO" : "0",
"EJECUTADOCOMOOBLIGACION" :"0",
"COMPROMETIDO" : "0",
"OBLIGACIONES" : "0"
},
{
  "CODIGOPRESUPUESTAL": "2.3.2.01.01.003.03.01",
  "CONCEPTO": "",
  "APROPIACIONINICIAL" : "0",
"PAGOS" : "0",
"PRESUPUESTODEFINITIVO" : "0",
"EJECUTADOCOMOOBLIGACION" :"0",
"COMPROMETIDO" : "0",
"OBLIGACIONES" : "0"
},
{
  "CODIGOPRESUPUESTAL": "2.3.2.01.01.003.02",
  "CONCEPTO": "",
  "APROPIACIONINICIAL" : "0",
"PAGOS" : "0",
"PRESUPUESTODEFINITIVO" : "0",
"EJECUTADOCOMOOBLIGACION" :"0",
"COMPROMETIDO" : "0",
"OBLIGACIONES" : "0"
},
{
  "CODIGOPRESUPUESTAL": "2.3.2.01.01.003.03.01",
  "CONCEPTO": "",
  "APROPIACIONINICIAL" : "0",
"PAGOS" : "0",
"PRESUPUESTODEFINITIVO" : "0",
"EJECUTADOCOMOOBLIGACION" :"0",
"COMPROMETIDO" : "0",
"OBLIGACIONES" : "0"
},
{
  "CODIGOPRESUPUESTAL": "2.3.2.01.01.003.06",
  "CONCEPTO": "",
  "APROPIACIONINICIAL" : "0",
"PAGOS" : "0",
"PRESUPUESTODEFINITIVO" : "0",
"EJECUTADOCOMOOBLIGACION" :"0",
"COMPROMETIDO" : "0",
"OBLIGACIONES" : "0"
},
{
  "CODIGOPRESUPUESTAL": "2.3.2.02",
  "CONCEPTO": "",
  "APROPIACIONINICIAL" : "0",
"PAGOS" : "0",
"PRESUPUESTODEFINITIVO" : "0",
"EJECUTADOCOMOOBLIGACION" :"0",
"COMPROMETIDO" : "0",
"OBLIGACIONES" : "0"
},
{
  "CODIGOPRESUPUESTAL": "2.3.2.02.01",
  "CONCEPTO": "",
  "APROPIACIONINICIAL" : "0",
"PAGOS" : "0",
"PRESUPUESTODEFINITIVO" : "0",
"EJECUTADOCOMOOBLIGACION" :"0",
"COMPROMETIDO" : "0",
"OBLIGACIONES" : "0"
},
{
  "CODIGOPRESUPUESTAL": "2.3.2.02.02",
  "CONCEPTO": "",
  "APROPIACIONINICIAL" : "0",
"PAGOS" : "0",
"PRESUPUESTODEFINITIVO" : "0",
"EJECUTADOCOMOOBLIGACION" :"0",
"COMPROMETIDO" : "0",
"OBLIGACIONES" : "0"
},
{
  "CODIGOPRESUPUESTAL": "2.3.2.01.01.005.02",
  "CONCEPTO": "",
  "APROPIACIONINICIAL" : "0",
"PAGOS" : "0",
"PRESUPUESTODEFINITIVO" : "0",
"EJECUTADOCOMOOBLIGACION" :"0",
"COMPROMETIDO" : "0",
"OBLIGACIONES" : "0"
},
{
  "CODIGOPRESUPUESTAL": "2.3.2.01.01.005.02.03",
  "CONCEPTO": "",
  "APROPIACIONINICIAL" : "0",
"PAGOS" : "0",
"PRESUPUESTODEFINITIVO" : "0",
"EJECUTADOCOMOOBLIGACION" :"0",
"COMPROMETIDO" : "0",
"OBLIGACIONES" : "0"
},
{
  "CODIGOPRESUPUESTAL": "2.3.2.01.01.005.02.03.01",
  "CONCEPTO": "",
  "APROPIACIONINICIAL" : "0",
"PAGOS" : "0",
"PRESUPUESTODEFINITIVO" : "0",
"EJECUTADOCOMOOBLIGACION" :"0",
"COMPROMETIDO" : "0",
"OBLIGACIONES" : "0"
},
{
  "CODIGOPRESUPUESTAL": "2.1.1.01.01.001.06",
  "CONCEPTO": "",
  "APROPIACIONINICIAL" : "0",
"PAGOS" : "0",
"PRESUPUESTODEFINITIVO" : "0",
"EJECUTADOCOMOOBLIGACION" :"0",
"COMPROMETIDO" : "0",
"OBLIGACIONES" : "0"
},
{
  "CODIGOPRESUPUESTAL": "2.1.1.02.01.001.07",
  "CONCEPTO": "",
  "APROPIACIONINICIAL" : "0",
"PAGOS" : "0",
"PRESUPUESTODEFINITIVO" : "0",
"EJECUTADOCOMOOBLIGACION" :"0",
"COMPROMETIDO" : "0",
"OBLIGACIONES" : "0"
},
{
  "CODIGOPRESUPUESTAL": "2.3.2.01.01.001.02",
  "CONCEPTO": "",
  "APROPIACIONINICIAL" : "0",
"PAGOS" : "0",
"PRESUPUESTODEFINITIVO" : "0",
"EJECUTADOCOMOOBLIGACION" :"0",
"COMPROMETIDO" : "0",
"OBLIGACIONES" : "0"
},
{
  "CODIGOPRESUPUESTAL": "2.3.2.01.01.001.02.07",
  "CONCEPTO": "",
  "APROPIACIONINICIAL" : "0",
"PAGOS" : "0",
"PRESUPUESTODEFINITIVO" : "0",
"EJECUTADOCOMOOBLIGACION" :"0",
"COMPROMETIDO" : "0",
"OBLIGACIONES" : "0"
},
]

  codigosModeloReporte = [
    {
        "CODIGO": "2 "
    },
    {
        "CODIGO": "2.1 "
    },
    {
        "CODIGO": "2.1.1 "
    },
    {
        "CODIGO": "2.1.1.01 "
    },
    {
        "CODIGO": "2.1.1.01.01 "
    },
    {
        "CODIGO": "2.1.1.01.01.001 "
    },
    {
        "CODIGO": "2.1.1.01.01.001.01 "
    },
    {
        "CODIGO": "2.1.1.01.01.001.01 "
    },
    {
        "CODIGO": "2.1.1.01.01.001.02 "
    },
    {
        "CODIGO": "2.1.1.01.01.001.02 "
    },
    {
        "CODIGO": "2.1.1.01.01.001.04 "
    },
    {
        "CODIGO": "2.1.1.01.01.001.04 "
    },
    {
        "CODIGO": "2.1.1.01.01.001.05 "
    },
    {
        "CODIGO": "2.1.1.01.01.001.05 "
    },
    {
        "CODIGO": "2.1.1.01.01.001.06 "
    },
    {
        "CODIGO": "2.1.1.01.01.001.06 "
    },
    {
        "CODIGO": "2.1.1.01.01.001.07 "
    },
    {
        "CODIGO": "2.1.1.01.01.001.07 "
    },
    {
        "CODIGO": "2.1.1.01.01.001.08 "
    },
    {
        "CODIGO": "2.1.1.01.01.001.08.01 "
    },
    {
        "CODIGO": "2.1.1.01.01.001.08.01 "
    },
    {
        "CODIGO": "2.1.1.01.01.001.08.02 "
    },
    {
        "CODIGO": "2.1.1.01.01.001.08.02 "
    },
    {
        "CODIGO": "2.1.1.01.01.001.09 "
    },
    {
        "CODIGO": "2.1.1.01.01.001.09 "
    },
    {
        "CODIGO": "2.1.1.01.01.002 "
    },
    {
        "CODIGO": "2.1.1.01.01.002.12 "
    },
    {
        "CODIGO": "2.1.1.01.01.002.12.01 "
    },
    {
        "CODIGO": "2.1.1.01.01.002.12.01 "
    },
    {
        "CODIGO": "2.1.1.01.02 "
    },
    {
        "CODIGO": "2.1.1.01.02.001 "
    },
    {
        "CODIGO": "2.1.1.01.02.001 "
    },
    {
        "CODIGO": "2.1.1.01.02.002 "
    },
    {
        "CODIGO": "2.1.1.01.02.002 "
    },
    {
        "CODIGO": "2.1.1.01.02.003 "
    },
    {
        "CODIGO": "2.1.1.01.02.003 "
    },
    {
        "CODIGO": "2.1.1.01.02.005 "
    },
    {
        "CODIGO": "2.1.1.01.02.005 "
    },
    {
        "CODIGO": "2.1.1.01.02.006 "
    },
    {
        "CODIGO": "2.1.1.01.02.006 "
    },
    {
        "CODIGO": "2.1.1.01.03 "
    },
    {
        "CODIGO": "2.1.1.01.03.001 "
    },
    {
        "CODIGO": "2.1.1.01.03.001.01 "
    },
    {
        "CODIGO": "2.1.1.01.03.001.01 "
    },
    {
        "CODIGO": "2.1.1.01.03.001.04 "
    },
    {
        "CODIGO": "2.1.1.01.03.001.04 "
    },
    {
        "CODIGO": "2.1.1.01.03.020 "
    },
    {
        "CODIGO": "2.1.1.01.03.020 "
    },
    {
        "CODIGO": "2.1.1.01.03.083 "
    },
    {
        "CODIGO": "2.1.1.01.03.083 "
    },
    {
        "CODIGO": "2.1.1.01.03.097 "
    },
    {
        "CODIGO": "2.1.1.01.03.097 "
    },
    {
        "CODIGO": "2.1.1.02 "
    },
    {
        "CODIGO": "2.1.1.02.01 "
    },
    {
        "CODIGO": "2.1.1.02.01.001 "
    },
    {
        "CODIGO": "2.1.1.02.01.001.01 "
    },
    {
        "CODIGO": "2.1.1.02.01.001.01 "
    },
    {
        "CODIGO": "2.1.1.02.01.001.02 "
    },
    {
        "CODIGO": "2.1.1.02.01.001.02 "
    },
    {
        "CODIGO": "2.1.1.02.01.001.04 "
    },
    {
        "CODIGO": "2.1.1.02.01.001.04 "
    },
    {
        "CODIGO": "2.1.1.02.01.001.05 "
    },
    {
        "CODIGO": "2.1.1.02.01.001.05 "
    },
    {
        "CODIGO": "2.1.1.02.01.001.06 "
    },
    {
        "CODIGO": "2.1.1.02.01.001.06 "
    },
    {
        "CODIGO": "2.1.1.02.01.001.07 "
    },
    {
        "CODIGO": "2.1.1.02.01.001.07 "
    },
    {
        "CODIGO": "2.1.1.02.01.001.08 "
    },
    {
        "CODIGO": "2.1.1.02.01.001.08.01 "
    },
    {
        "CODIGO": "2.1.1.02.01.001.08.01 "
    },
    {
        "CODIGO": "2.1.1.02.01.001.08.02 "
    },
    {
        "CODIGO": "2.1.1.02.01.001.08.02 "
    },
    {
        "CODIGO": "2.1.1.02.02 "
    },
    {
        "CODIGO": "2.1.1.02.02.001 "
    },
    {
        "CODIGO": "2.1.1.02.02.001 "
    },
    {
        "CODIGO": "2.1.1.02.02.002 "
    },
    {
        "CODIGO": "2.1.1.02.02.002 "
    },
    {
        "CODIGO": "2.1.1.02.02.003 "
    },
    {
        "CODIGO": "2.1.1.02.02.003 "
    },
    {
        "CODIGO": "2.1.1.02.02.005 "
    },
    {
        "CODIGO": "2.1.1.02.02.005 "
    },
    {
        "CODIGO": "2.1.1.02.02.006 "
    },
    {
        "CODIGO": "2.1.1.02.02.006 "
    },
    {
        "CODIGO": "2.1.1.02.03 "
    },
    {
        "CODIGO": "2.1.1.02.03.001 "
    },
    {
        "CODIGO": "2.1.1.02.03.001.01 "
    },
    {
        "CODIGO": "2.1.1.02.03.001.01 "
    },
    {
        "CODIGO": "2.1.2 "
    },
    {
        "CODIGO": "2.1.2.02 "
    },
    {
        "CODIGO": "2.1.2.02.01 "
    },
    {
        "CODIGO": "2.1.2.02.01.000 "
    },
    {
        "CODIGO": "2.1.2.02.01.000 "
    },
    {
        "CODIGO": "2.1.2.02.01.002 "
    },
    {
        "CODIGO": "2.1.2.02.01.002 "
    },
    {
        "CODIGO": "2.1.2.02.01.003 "
    },
    {
        "CODIGO": "2.1.2.02.01.003 "
    },
    {
        "CODIGO": "2.1.2.02.01.004 "
    },
    {
        "CODIGO": "2.1.2.02.01.004 "
    },
    {
        "CODIGO": "2.1.2.02.02 "
    },
    {
        "CODIGO": "2.1.2.02.02.005 "
    },
    {
        "CODIGO": "2.1.2.02.02.005 "
    },
    {
        "CODIGO": "2.1.2.02.02.006 "
    },
    {
        "CODIGO": "2.1.2.02.02.006 "
    },
    {
        "CODIGO": "2.1.2.02.02.007 "
    },
    {
        "CODIGO": "2.1.2.02.02.007 "
    },
    {
        "CODIGO": "2.1.2.02.02.008 "
    },
    {
        "CODIGO": "2.1.2.02.02.008 "
    },
    {
        "CODIGO": "2.1.2.02.02.009 "
    },
    {
        "CODIGO": "2.1.2.02.02.009 "
    },
    {
        "CODIGO": "2.1.3 "
    },
    {
        "CODIGO": "2.1.3.04 "
    },
    {
        "CODIGO": "2.1.3.04.05 "
    },
    {
        "CODIGO": "2.1.3.04.05.002 "
    },
    {
        "CODIGO": "2.1.3.04.05.002 "
    },
    {
        "CODIGO": "2.1.3.07 "
    },
    {
        "CODIGO": "2.1.3.07.02 "
    },
    {
        "CODIGO": "2.1.3.07.02.001 "
    },
    {
        "CODIGO": "2.1.3.07.02.001.02 "
    },
    {
        "CODIGO": "2.1.3.07.02.001.02 "
    },
    {
        "CODIGO": "2.1.3.07.02.002 "
    },
    {
        "CODIGO": "2.1.3.07.02.002.02 "
    },
    {
        "CODIGO": "2.1.3.07.02.002.02 "
    },
    {
        "CODIGO": "2.1.3.07.02.003 "
    },
    {
        "CODIGO": "2.1.3.07.02.003.02 "
    },
    {
        "CODIGO": "2.1.3.07.02.003.02 "
    },
    {
        "CODIGO": "2.1.3.07.02.010 "
    },
    {
        "CODIGO": "2.1.3.07.02.010.01 "
    },
    {
        "CODIGO": "2.1.3.07.02.010.01 "
    },
    {
        "CODIGO": "2.1.3.07.02.010.02 "
    },
    {
        "CODIGO": "2.1.3.07.02.010.02 "
    },
    {
        "CODIGO": "2.1.3.08 "
    },
    {
        "CODIGO": "2.1.3.08.02 "
    },
    {
        "CODIGO": "2.1.3.08.02 "
    },
    {
        "CODIGO": "2.1.3.13 "
    },
    {
        "CODIGO": "2.1.3.13.01 "
    },
    {
        "CODIGO": "2.1.3.13.01.001 "
    },
    {
        "CODIGO": "2.1.3.13.01.001 "
    },
    {
        "CODIGO": "2.1.5 "
    },
    {
        "CODIGO": "2.1.5.01 "
    },
    {
        "CODIGO": "2.1.5.01.00 "
    },
    {
        "CODIGO": "2.1.5.01.00 "
    },
    {
        "CODIGO": "2.1.5.01.02 "
    },
    {
        "CODIGO": "2.1.5.01.02 "
    },
    {
        "CODIGO": "2.1.5.01.03 "
    },
    {
        "CODIGO": "2.1.5.01.03 "
    },
    {
        "CODIGO": "2.1.5.01.04 "
    },
    {
        "CODIGO": "2.1.5.01.04 "
    },
    {
        "CODIGO": "2.1.5.02 "
    },
    {
        "CODIGO": "2.1.5.02.05 "
    },
    {
        "CODIGO": "2.1.5.02.05 "
    },
    {
        "CODIGO": "2.1.5.02.06 "
    },
    {
        "CODIGO": "2.1.5.02.06 "
    },
    {
        "CODIGO": "2.1.5.02.07 "
    },
    {
        "CODIGO": "2.1.5.02.07 "
    },
    {
        "CODIGO": "2.1.5.02.08 "
    },
    {
        "CODIGO": "2.1.5.02.08 "
    },
    {
        "CODIGO": "2.1.5.02.09 "
    },
    {
        "CODIGO": "2.1.5.02.09 "
    },
    {
        "CODIGO": "2.1.7 "
    },
    {
        "CODIGO": "2.1.7.01 "
    },
    {
        "CODIGO": "2.1.7.01.01 "
    },
    {
        "CODIGO": "2.1.7.01.01 "
    },
    {
        "CODIGO": "2.1.8 "
    },
    {
        "CODIGO": "2.1.8.01 "
    },
    {
        "CODIGO": "2.1.8.01.51 "
    },
    {
        "CODIGO": "2.1.8.01.51 "
    },
    {
        "CODIGO": "2.1.8.01.52 "
    },
    {
        "CODIGO": "2.1.8.01.52 "
    },
    {
        "CODIGO": "2.1.8.01.53 "
    },
    {
        "CODIGO": "2.1.8.01.53 "
    },
    {
        "CODIGO": "2.1.8.03 "
    },
    {
        "CODIGO": "2.1.8.03 "
    },
    {
        "CODIGO": "2.1.8.04 "
    },
    {
        "CODIGO": "2.1.8.04.01 "
    },
    {
        "CODIGO": "2.1.8.04.01 "
    }
]
codigoModeloReporteReservas = 
[
    {
        "CODIGO": "2"
    },
    {
        "CODIGO": "2.1"
    },
    {
        "CODIGO": "2.1.1"
    },
    {
        "CODIGO": "2.1.1.01"
    },
    {
        "CODIGO": "2.1.1.01.01"
    },
    {
        "CODIGO": "2.1.1.01.01.001"
    },
    {
        "CODIGO": "2.1.1.01.01.001.06"
    },
    {
        "CODIGO": "2.1.1.01.01.001.08"
    },
    {
        "CODIGO": "2.1.1.01.01.001.08.01"
    },
    {
        "CODIGO": "2.1.1.01.01.001.08.02"
    },
    {
        "CODIGO": "2.1.1.01.02"
    },
    {
        "CODIGO": "2.1.1.01.02.003"
    },
    {
        "CODIGO": "2.1.1.01.03"
    },
    {
        "CODIGO": "2.1.1.01.03.001"
    },
    {
        "CODIGO": "2.1.1.01.03.001.01"
    },
    {
        "CODIGO": "2.1.1.01.03.020"
    },
    {
        "CODIGO": "2.1.1.02"
    },
    {
        "CODIGO": "2.1.1.02.01"
    },
    {
        "CODIGO": "2.1.1.02.01.001"
    },
    {
        "CODIGO": "2.1.1.02.01.001.07"
    },
    {
        "CODIGO": "2.1.2"
    },
    {
        "CODIGO": "2.1.2.02"
    },
    {
        "CODIGO": "2.1.2.02.01"
    },
    {
        "CODIGO": "2.1.2.02.01.003"
    },
    {
        "CODIGO": "2.1.2.02.02"
    },
    {
        "CODIGO": "2.1.2.02.02.006"
    },
    {
        "CODIGO": "2.1.2.02.02.007"
    },
    {
        "CODIGO": "2.1.2.02.02.008"
    },
    {
        "CODIGO": "2.1.2.02.02.009"
    },
    {
        "CODIGO": "2.1.5"
    },
    {
        "CODIGO": "2.1.5.01"
    },
    {
        "CODIGO": "2.1.5.01.03"
    },
    {
        "CODIGO": "2.1.5.02"
    },
    {
        "CODIGO": "2.1.5.02.06"
    },
    {
        "CODIGO": "2.1.5.02.08"
    },
    {
        "CODIGO": "2.1.5.02.09"
    },
    {
        "CODIGO": "2.1.7"
    },
    {
        "CODIGO": "2.1.7.01"
    },
    {
        "CODIGO": "2.1.7.01.01"
    },
    {
        "CODIGO": "2.99"
    }
]
codigoModeloEjecReservas = [
  {
      "codigo": 2
  },
  {
      "codigo": "2.1"
  },
  {
      "codigo": "2.1.1"
  },
  {
      "codigo": "2.1.1.01"
  },
  {
      "codigo": "2.1.1.01.01"
  },
  {
      "codigo": "2.1.1.01.01.001"
  },
  {
      "codigo": "2.1.1.01.01.001.06"
  },
  {
      "codigo": "2.1.1.01.01.001.08"
  },
  {
      "codigo": "2.1.1.01.01.001.08.01"
  },
  {
      "codigo": "2.1.1.01.01.001.08.02"
  },
  {
      "codigo": "2.1.1.01.02"
  },
  {
      "codigo": "2.1.1.01.02.003"
  },
  {
      "codigo": "2.1.1.01.03"
  },
  {
      "codigo": "2.1.1.01.03.001"
  },
  {
      "codigo": "2.1.1.01.03.001.01"
  },
  {
      "codigo": "2.1.1.01.03.020"
  },
  {
      "codigo": "2.1.1.02"
  },
  {
      "codigo": "2.1.1.02.01"
  },
  {
      "codigo": "2.1.1.02.01.001"
  },
  {
      "codigo": "2.1.1.02.01.001.07"
  },
  {
      "codigo": "2.1.2"
  },
  {
      "codigo": "2.1.2.02"
  },
  {
      "codigo": "2.1.2.02.01"
  },
  {
      "codigo": "2.1.2.02.01.003"
  },
  {
      "codigo": "2.1.2.02.02"
  },
  {
      "codigo": "2.1.2.02.02.006"
  },
  {
      "codigo": "2.1.2.02.02.007"
  },
  {
      "codigo": "2.1.2.02.02.008"
  },
  {
      "codigo": "2.1.2.02.02.009"
  },
  {
      "codigo": "2.1.5"
  },
  {
      "codigo": "2.1.5.01"
  },
  {
      "codigo": "2.1.5.01.03"
  },
  {
      "codigo": "2.1.5.02"
  },
  {
      "codigo": "2.1.5.02.06"
  },
  {
      "codigo": "2.1.5.02.08"
  },
  {
      "codigo": "2.1.5.02.09"
  },
  {
      "codigo": "2.1.7"
  },
  {
      "codigo": "2.1.7.01"
  },
  {
      "codigo": "2.1.7.01.01"
  },
  {
      "codigo": "2.3"
  },
  {
      "codigo": "2.3.2"
  },
  {
      "codigo": "2.3.2.01"
  },
  {
      "codigo": "2.3.2.01.01"
  },
  {
      "codigo": "2.3.2.01.01.001"
  },
  {
      "codigo": "2.3.2.01.01.001.02"
  },
  {
      "codigo": "2.3.2.01.01.001.02.07"
  },
  {
      "codigo": "2.3.2.01.01.003"
  },
  {
      "codigo": "2.3.2.01.01.003.03"
  },
  {
      "codigo": "2.3.2.01.01.003.03.01"
  },
  {
      "codigo": "2.3.2.01.01.003.03.02"
  },
  {
      "codigo": "2.3.2.01.01.003.06"
  },
  {
      "codigo": "2.3.2.01.01.003.06.02"
  },
  {
      "codigo": "2.3.2.01.01.005"
  },
  {
      "codigo": "2.3.2.01.01.005.02"
  },
  {
      "codigo": "2.3.2.01.01.005.02.03"
  },
  {
      "codigo": "2.3.2.01.01.005.02.03.01"
  },
  {
      "codigo": "2.3.2.01.01.005.02.03.01.01"
  },
  {
      "codigo": "2.3.2.01.01.005.02.03.01.02"
  },
  {
      "codigo": "2.3.2.01.01.005.02.05"
  },
  {
      "codigo": "2.3.2.02"
  },
  {
      "codigo": "2.3.2.02.01"
  },
  {
      "codigo": "2.3.2.02.01.003"
  },
  {
      "codigo": "2.3.2.02.01.004"
  },
  {
      "codigo": "2.3.2.02.02"
  },
  {
      "codigo": "2.3.2.02.02.007"
  },
  {
      "codigo": "2.3.2.02.02.008"
  },
  {
      "codigo": "2.3.2.02.02.009"
  }
]
codigosModeloReporteCuentas = [
  {
      "codigo": "2"
  },
  {
      "codigo": "2.1"
  },
  {
      "codigo": "2.1.1"
  },
  {
      "codigo": "2.1.1.01"
  },
  {
      "codigo": "2.1.1.01.01"
  },
  {
      "codigo": "2.1.1.01.01.001"
  },
  {
      "codigo": "2.1.1.01.01.001.07"
  },
  {
      "codigo": "2.1.1.01.02"
  },
  {
      "codigo": "2.1.1.01.02.002"
  },
  {
      "codigo": "2.1.2"
  },
  {
      "codigo": "2.1.2.02"
  },
  {
      "codigo": "2.1.2.02.01"
  },
  {
      "codigo": "2.1.2.02.01.002"
  },
  {
      "codigo": "2.1.2.02.01.003"
  },
  {
      "codigo": "2.1.2.02.02"
  },
  {
      "codigo": "2.1.2.02.02.006"
  },
  {
      "codigo": "2.1.2.02.02.007"
  },
  {
      "codigo": "2.1.2.02.02.008"
  },
  {
      "codigo": "2.1.2.02.02.009"
  },
  {
      "codigo": "2.1.3"
  },
  {
      "codigo": "2.1.3.07"
  },
  {
      "codigo": "2.1.3.07.02"
  },
  {
      "codigo": "2.1.3.07.02.010"
  },
  {
      "codigo": "2.1.3.07.02.010.01"
  },
  {
      "codigo": "2.1.5"
  },
  {
      "codigo": "2.1.5.02"
  },
  {
      "codigo": "2.1.5.02.08"
  },
  {
      "codigo": "2.3"
  },
  {
      "codigo": "2.3.1"
  },
  {
      "codigo": "2.3.1.01"
  },
  {
      "codigo": "2.3.1.01.01"
  },
  {
      "codigo": "2.3.1.01.01.001"
  },
  {
      "codigo": "2.3.1.01.01.001.07"
  },
  {
      "codigo": "2.3.2"
  },
  {
      "codigo": "2.3.2.01"
  },
  {
      "codigo": "2.3.2.01.01"
  },
  {
      "codigo": "2.3.2.01.01.003"
  },
  {
      "codigo": "2.3.2.01.01.003.02"
  },
  {
      "codigo": "2.3.2.01.01.003.02.08"
  },
  {
      "codigo": "2.3.2.01.01.003.03"
  },
  {
      "codigo": "2.3.2.01.01.003.03.01"
  },
  {
      "codigo": "2.3.2.01.01.003.03.02"
  },
  {
      "codigo": "2.3.2.01.01.003.06"
  },
  {
      "codigo": "2.3.2.01.01.003.06.02"
  },
  {
      "codigo": "2.3.2.01.01.005"
  },
  {
      "codigo": "2.3.2.01.01.005.02"
  },
  {
      "codigo": "2.3.2.01.01.005.02.03"
  },
  {
      "codigo": "2.3.2.01.01.005.02.03.01"
  },
  {
      "codigo": "2.3.2.01.01.005.02.03.01.02"
  },
  {
      "codigo": "2.3.2.01.01.005.02.05"
  },
  {
      "codigo": "2.3.2.02"
  },
  {
      "codigo": "2.3.2.02.01"
  },
  {
      "codigo": "2.3.2.02.01.003"
  },
  {
      "codigo": "2.3.2.02.02"
  },
  {
      "codigo": "2.3.2.02.02.007"
  },
  {
      "codigo": "2.3.2.02.02.009"
  },
  {
      "codigo": "2.3.2.02.02.010"
  }
]
constructor(private router: Router) { }

ngOnInit(): void {
  if(localStorage.getItem('ruta')){
    this.titulo = localStorage.getItem('ruta')
  }else{
    if(this.titulo == ''){
      this.router.navigate(['/'])
     }
  }
 
}

  fileUpload(event: any) {
    this.cargandoPaginaSpinner = 0
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
        this.cargandoPaginaSpinner = 1
      })
      console.log(this.datosTabla)
      this.validartabla = 1
    }
  }
  exportexcel1(): void {
    let element = document.getElementById('excel-table');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    // Recorremos solo la columna B y definimos las celdas como texto
    const sheetData: any = worksheet['!ref']; // Obtenemos la referencia de todas las celdas
    const range = XLSX.utils.decode_range(sheetData);
    const anchoColumnas = [{ wch: 40 }, { wch: 20 }, { wch: 50 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 40 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
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
    if(this.mostrarReporte == 'Ejecucion' || this.mostrarReporte == 'ReporteEjecucion'){
     // Obtener el elemento de la tabla
const tabla:any = document.getElementById('excel-table');

// Obtener los datos de la tabla
const tablaData:any = this.getTablaData2(tabla);

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
    }else{
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
   const anchoColumnas = [{ wch: 20 }, { wch: 20 }, { wch: 40 }, { wch: 25 }, { wch: 25 }, { wch: 20 }, { wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
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
   console.error('No hay datos en la tabla para generar el archivo Excel.');
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
      // Parse numerical values for columns other than columns B (index 1) and H (index 7)
      if (index !== 1 && index !== 6) {
        const textContent = celda.textContent;
        const numericValue = textContent !== null ? parseFloat(textContent) : null;
        return numericValue !== null && !isNaN(numericValue) ? numericValue : textContent;
      } else {
        return celda.textContent; // Keep columns B (index 1) and H (index 7) as textContent
      }
    })
  );

  // Agregar los encabezados de columna al inicio del arreglo de arreglos
  if (encabezados) {
    datos.unshift(Array.from(encabezados).map((encabezado) => encabezado.textContent));
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
      // Parse numerical values for columns other than column B (index 1)
      if (index !== 1) {
        const textContent = celda.textContent;
        const numericValue = textContent !== null ? parseFloat(textContent) : null;
        return numericValue !== null && !isNaN(numericValue) ? numericValue : textContent;
      } else {
        return celda.textContent; // Keep column B (index 1) as textContent
      }
    })
  );

  // Agregar los encabezados de columna al inicio del arreglo de arreglos
  if (encabezados) {
    datos.unshift(Array.from(encabezados).map((encabezado) => encabezado.textContent));
  }

  return datos;
  }

  ejecutarResumenIngresos() {
    this.datosTabla.forEach((element:any) => {
      element.FUENTESDEFINANCIACION = '1.2.1.0.00'
      element.SITUACIONDEFONDOS = 'c'
      element.POLITICAPUBLICA = '0'
      element.TERCERO = '1'
    });
    const busqueda = this.datosTabla.reduce((acc: any, codigo: any) => {
      acc[codigo.CODIGOPRESUPUESTAL.trim()] = ++acc[codigo.CODIGOPRESUPUESTAL.trim()] || 0;
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
    let arreglosDuplicados: any = []
    unicos.forEach((element: any) => {
      const arreglosSeparados = this.datosTabla.filter((campo: any) => campo.CODIGOPRESUPUESTAL.trim() == element.trim())
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
      let c = 0
      let o = 0
      for (let i = 0; i < element1; i++) {
        const element = element2[i]
        if (p == 0) {
          if (element.EJECUTADOCOMOOBLIGACION == undefined) {
            p = 0
          } else {
            p = element.EJECUTADOCOMOOBLIGACION
          }
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim(), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim(),  valor: x, definitivo: w , PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c}))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim(),   valor: x, definitivo: w, PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c })
        } else {
          p = p + element.EJECUTADOCOMOOBLIGACION
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim(), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim(), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c }))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim(), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c })
        }
        if (o == 0) {
          if (element.OBLIGACIONES == undefined) {
            o = 0
          } else {
            o = element.OBLIGACIONES
          }
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim(), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim(),  valor: x, definitivo: w , PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c, OBLIGACIONES: o}))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim(),   valor: x, definitivo: w, PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c, OBLIGACIONES: o})
        } else {
          o = o + element.OBLIGACIONES
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim(), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim(), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c ,OBLIGACIONES: o}))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim(), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c, OBLIGACIONES: o })
        }
        if (w == 0) {
          if (element.PRESUPUESTODEFINITIVO == undefined) {
            w = 0
          } else {
            w = element.PRESUPUESTODEFINITIVO
          }
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim(), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim(),  valor: x, definitivo: w , PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c, OBLIGACIONES: o}))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim(),   valor: x, definitivo: w, PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c, OBLIGACIONES: o })
        } else {
          w = w + element.PRESUPUESTODEFINITIVO
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim(), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim(), valor: x, definitivo: w , PAGOS: y, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c, OBLIGACIONES: o }))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim(), valor: x, definitivo: w , PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c, OBLIGACIONES: o})
        }
        if (y == 0) {
          if (element.PAGOS == undefined) {
            y = 0
          } else {
            y = element.PAGOS
          }
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim(), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim(),  valor: x, definitivo: w , PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c, OBLIGACIONES: o}))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim(),   valor: x, definitivo: w, PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c, OBLIGACIONES: o })
        } else {
          y = y + element.PAGOS
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim(), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim(), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c, OBLIGACIONES: o }))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim(), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c, OBLIGACIONES: o })
        }
        if (c == 0) {
          if (element.COMPROMETIDO == undefined) {
            c = 0
          } else {
            c = element.COMPROMETIDO
          }
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim(), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim(),  valor: x, definitivo: w , PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c, OBLIGACIONES: o}))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim(),   valor: x, definitivo: w, PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c, OBLIGACIONES: o })
        } else {
          c = c + element.COMPROMETIDO
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim(), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim(), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c , OBLIGACIONES: o}))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim(), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c , OBLIGACIONES: o})
        }
        if (x == 0) {
          if (element.APROPIACIONINICIAL == undefined) {
            x = 0
          } else {
            x = element.APROPIACIONINICIAL
          }
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim(), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim(),  valor: x, definitivo: w , PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c, OBLIGACIONES: o}))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim(),   valor: x, definitivo: w, PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c,OBLIGACIONES: o })
        } else {
          x = x + element.APROPIACIONINICIAL
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim(), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim(),  valor: x, definitivo: w , PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c,OBLIGACIONES: o}))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim(),   valor: x, definitivo: w, PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c,OBLIGACIONES: o })
        }
      }
    }
    this.extrayendoDuplicadosSumados()
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
    })
    let arraydeDuplicados: any = []
    this.sinDuplicados.forEach((element: any) => {
      let x: any = localStorage.getItem(element.codigo)
      x = JSON.parse(x)
      arraydeDuplicados = [...arraydeDuplicados, x]
      localStorage.setItem('duplicadosIngresos', JSON.stringify(arraydeDuplicados))
    });
    for (let index = 0; index < arraydeDuplicados.length; index++) {
      let x = this.datosTabla.filter((element: any) => element.CODIGOPRESUPUESTAL.trim() == arraydeDuplicados[index].codigo)
      x.forEach((element: any) => {
        element.APROPIACIONINICIAL = arraydeDuplicados[index].valor
        element.PAGOS = arraydeDuplicados[index].PAGOS
        element.PRESUPUESTODEFINITIVO = arraydeDuplicados[index].definitivo
        element.EJECUTADOCOMOOBLIGACION = arraydeDuplicados[index].EJECUTADOCOMOOBLIGACION
        element.COMPROMETIDO = arraydeDuplicados[index].COMPROMETIDO
        element.OBLIGACIONES = arraydeDuplicados[index].OBLIGACIONES
        this.elementosUnificados = this.datosTabla.map((element1: any) => element1.CODIGOPRESUPUESTAL.trim() == element.CODIGOPRESUPUESTAL.trim() ? element : element1)
      });

      let objetoSinRepetidos: any = {};
      this.elementosUnificados.forEach(function (elemento: any) {
        objetoSinRepetidos[elemento.CODIGOPRESUPUESTAL.trim()] = elemento;
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
       this.ejecutarModeloDeResumidos(this.contadormodelo)
      localStorage.clear()
    }
  }

  ejecutarModeloDeResumidos(contadorValor: any) {
    const busqueda = this.datosTabla.reduce((acc: any, codigo: any) => {
      acc[codigo.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor)] = ++acc[codigo.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor)] || 0;
      return acc;
    }, {});
    const duplicados = this.datosTabla.filter((codigo: any) => {
      return busqueda[codigo.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor)];
    });
    let unicos: any = [];
    for (var i = 0; i < duplicados.length; i++) {
      const elemento = duplicados[i].CODIGOPRESUPUESTAL.trim().slice(0, contadorValor);
      if (!unicos.includes(duplicados[i].CODIGOPRESUPUESTAL.trim().slice(0, contadorValor))) {
        unicos.push(elemento);
        if(this.contadormodelo == 5){
          unicos.push("2.1.7","2.1.5","2.99","2.3.1","2.1.3")
        }
        if(this.contadormodelo == 8){
          unicos.push("2.1.5.02","2.1.3.13","2.1.8.04","2.1.5.01","2.1.1.01","2.1.3.08","2.1.1.02","2.1.2.02", "2.1.3.04", "2.1.3.07","2.1.7.01", "2.1.8.01", "2.3.2.01", "2.3.1.01")
        }
        if(this.contadormodelo == 11){
          unicos.push("2.1.3.13.01","2.3.2.02.02","2.3.2.02.01","2.3.2.02","2.3.1.01.01","2.1.1.01.01","2.1.1.01.02","2.1.1.01.03", "2.1.1.02.01", "2.1.1.02.02", "2.1.1.02.03", "2.1.2.02.01", "2.1.2.02.02", "2.1.2.02.03", "2.1.3.04.05", "2.1.3.07.02", "2.3.2.01.01")
        }
        if(this.contadormodelo == 15){
          unicos.push("2.1.1.01.01.002","2.3.1.01.01.001","2.1.2.02.01.003","2.1.3.07.02.001","2.1.3.07.02.002","2.1.3.07.02.010","2.1.1.01.01.001","2.1.1.01.03.001","2.1.1.02.01.001", "2.1.1.02.03.001", "2.3.2.01.01.001", "2.3.2.01.01.003", "2.3.2.01.01.004","2.3.2.01.01.005")
        }
        if(this.contadormodelo == 18){
          unicos.push("2.1.1.02.01.001.08","2.3.2.01.01.001.02.07","2.3.2.01.01.001.02","2.1.1.02.01.001.07","2.1.1.01.01.001.06","2.3.2.01.01.005.02.03.01","2.3.2.01.01.005.02.03","2.3.2.01.01.005.02","2.3.2.01.01.003.06","2.3.2.01.01.003.03.01","2.3.2.01.01.003.02","2.3.2.01.01.003.03.01","2.3.1.01.01.001.07", "2.1.1.01.01.001.04", "2.1.1.01.01.002.12", "2.1.1.01.01.001.08")
        }
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
    if(this.contadorPrimerArreglo == 0){
      this.contadorPrimerArreglo = 1
    this.arregloGrande = this.datosTabla 
    }
  
    let x = 0
    this.datosTabla.forEach((element:any) => {
     x = x + element.APROPIACIONINICIAL
   
    });
    unicos.forEach((element: any) => {
      const arreglosSeparados = this.arregloGrande.filter((campo: any) => campo.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor) == element.trim())
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
      let c = 0
      let o = 0
      for (let i = 0; i < element1; i++) {
        const element = element2[i]
        if (o == 0) {
          if (element.OBLIGACIONES == undefined) {
            o = 0
          } else {
            o = element.OBLIGACIONES
          }
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),  valor: x, definitivo: w , PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c, OBLIGACIONES: o}))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),   valor: x, definitivo: w, PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c, OBLIGACIONES: o})
        } else {
          o = o + element.OBLIGACIONES
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim(), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim(), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c ,OBLIGACIONES: o}))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim(), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c, OBLIGACIONES: o })
        }
        if (p == 0) {
          if (element.EJECUTADOCOMOOBLIGACION == undefined) {
            p = 0
          } else {
            p = element.EJECUTADOCOMOOBLIGACION
          }
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c, OBLIGACIONES: o }))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c , OBLIGACIONES: o})
        } else {
          p = p + element.EJECUTADOCOMOOBLIGACION
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c, OBLIGACIONES: o }))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c, OBLIGACIONES: o })
        }
        if (w == 0) {
          if (element.PRESUPUESTODEFINITIVO == undefined) {
            w = 0
          } else {
            w = element.PRESUPUESTODEFINITIVO
          }
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c, OBLIGACIONES: o }))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c , OBLIGACIONES: o})
        } else {
          w = w + element.PRESUPUESTODEFINITIVO
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), valor: x, definitivo: w , PAGOS: y, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c, OBLIGACIONES: o }))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), valor: x, definitivo: w , PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c, OBLIGACIONES: o})
        }
        if (y == 0) {
          if (element.PAGOS == undefined) {
            y = 0
          } else {
            y = element.PAGOS
          }
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c , OBLIGACIONES: o}))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c , OBLIGACIONES: o})
        } else {
          y = y + element.PAGOS
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c , OBLIGACIONES: o}))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c , OBLIGACIONES: o})
        }
        if (c == 0) {
          if (element.COMPROMETIDO == undefined) {
            c = 0
          } else {
            c = element.COMPROMETIDO
          }
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c, OBLIGACIONES: o }))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c, OBLIGACIONES: o })
        } else {
          c = c + element.COMPROMETIDO
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c, OBLIGACIONES: o }))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c, OBLIGACIONES: o })
        }
        if (x == 0) {
          if (element.APROPIACIONINICIAL == undefined) {
            x = 0
          } else {
            x = element.APROPIACIONINICIAL
          }
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c , OBLIGACIONES: o}))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c , OBLIGACIONES: o})
        } else {
        
          x = x + element.APROPIACIONINICIAL
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),  valor: x, definitivo: w , PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c, OBLIGACIONES: o}))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),   valor: x, definitivo: w, PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c , OBLIGACIONES: o})
        }
      }
    }

      this.contadormodelo = this.contadormodelo - 1
    

    this.extrayendoDuplicadosSumadosMODELO()
  }
  extrayendoDuplicadosSumadosMODELO() {
    let arraydeDuplicados: any = []
    this.unicosmodelo.forEach((element: any) => {
      let x: any = localStorage.getItem(element)
      if(x != null){
        x = JSON.parse(x)
        arraydeDuplicados = [...arraydeDuplicados, x]
      }
      localStorage.setItem('duplicadosIngresos', JSON.stringify(arraydeDuplicados))
    });
    for (let index = 0; index < arraydeDuplicados.length; index++) {
      let x = this.modeloInformacion.filter((element: any) => element.CODIGOPRESUPUESTAL.trim() == arraydeDuplicados[index].codigo)
      x.forEach((element: any) => {
        element.APROPIACIONINICIAL = arraydeDuplicados[index].valor
        element.PAGOS = arraydeDuplicados[index].PAGOS
        element.PRESUPUESTODEFINITIVO = arraydeDuplicados[index].definitivo
        element.EJECUTADOCOMOOBLIGACION = arraydeDuplicados[index].EJECUTADOCOMOOBLIGACION
        element.COMPROMETIDO = arraydeDuplicados[index].COMPROMETIDO
        element.OBLIGACIONES = arraydeDuplicados[index].OBLIGACIONES
        this.elementosUnificados = this.modeloInformacion.map((element1: any) => element1.CODIGOPRESUPUESTAL == element.CODIGOPRESUPUESTAL ? element : element1)
      });
    }
    this.modeloInformacion.forEach((element:any) => {
      //  let x =  this.datosTabla.filter((element1:any) => element1.RUBROPRESUPEUSTAL !== element.RUBROPRESUPEUSTAL.trim())
      this.datosTabla = this.datosTabla.filter((element1:any) => element1.CODIGOPRESUPUESTAL != element.CODIGOPRESUPUESTAL.trim())
      });
    this.elementosUnificados.forEach((element: any) => {
      element.CODIGOPRESUPUESTAL = element.CODIGOPRESUPUESTAL.trim()
    });
    this.datosTabla.forEach((element: any) => {
      element.CODIGOPRESUPUESTAL = element.CODIGOPRESUPUESTAL.trim()
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
      this.datosTabla = mergedArray
      this.baseInformes = mergedArray
      if(this.titulo == 'gastos'){
        this.actualizarTabla()
      }
    } else {
      this.ejecutarModeloDeResumidos(this.contadormodelo)
    }

  }
limpiarTabla(){
  this.datosTabla.forEach((element:any) => {
    console.log(element.APROPIACIONINICIAL, element.PRESUPUESTODEFINITIVO, element.PAGOS)
    if(this.titulo == 'pagos'){
      if(element.APROPIACIONINICIAL == 0 && element.PRESUPUESTODEFINITIVO == 0 && element.PAGOS == 0 && element.OBLIGACIONES == 0){
        this.datosTabla =   this.datosTabla.filter((x:any) => x.CODIGOPRESUPUESTAL !== element.CODIGOPRESUPUESTAL.trim())
     
       }
    }
    if(this.titulo == 'reservas' || this.titulo == 'cuentas'){
      if(element.APROPIACIONINICIAL == 0 && element.PRESUPUESTODEFINITIVO == 0 && element.PAGOS == 0){
        this.datosTabla =   this.datosTabla.filter((x:any) => x.CODIGOPRESUPUESTAL !== element.CODIGOPRESUPUESTAL.trim())
       }
    }
     
  });
}
  actualizarTabla() {
      for (let index = 0; index < this.datosTabla.length; index++) {
        if (this.datosTabla[index]) {
          let x = [];
          const sumatoria = (this.datosTabla[index].COMPROMETIDO || 0) + (this.datosTabla[index].EJECUTADOCOMOOBLIGACION || 0);
          x.push(sumatoria);
          this.datosTabla[index].COMPROMISO = x[0];
        }
      }
    Promise.resolve().then(() => {
      console.log('hola')
      // this.formatearNumeros();
    });
  }
  // formatearNumeros(): any[] {
  //   for (const objeto of this.datosTabla) {
  //     if (objeto.APROPIACIONINICIAL == null || objeto.APROPIACIONINICIAL == undefined) {
  //       objeto.APROPIACIONINICIAL = 0
  //     } else {
  //       objeto.APROPIACIONINICIAL = formatNumber(objeto.APROPIACIONINICIAL, 'en-US');
  //     }
  //     if (objeto.PAGOS == null || objeto.PAGOS ==  undefined) {
  //       objeto.PAGOS = 0
  //     } else {
  //       objeto.PAGOS = formatNumber(objeto.PAGOS, 'en-US');
  //     }
  //     if (objeto.PRESUPUESTODEFINITIVO == null || objeto.PRESUPUESTODEFINITIVO ==  undefined) {
  //       objeto.PRESUPUESTODEFINITIVO = 0
  //     } else {
  //       objeto.PRESUPUESTODEFINITIVO = formatNumber(objeto.PRESUPUESTODEFINITIVO, 'en-US');
  //     }
  //     if (objeto.EJECUTADOCOMOOBLIGACION == null ||  objeto.EJECUTADOCOMOOBLIGACION ==  undefined) {
  //       objeto.EJECUTADOCOMOOBLIGACION = 0
  //     } else {
  //       objeto.EJECUTADOCOMOOBLIGACION = formatNumber(objeto.EJECUTADOCOMOOBLIGACION, 'en-US');
  //     }
  //     if (objeto.COMPROMETIDO == null || objeto.COMPROMETIDO ==  undefined) {
  //       objeto.COMPROMETIDO = 0
  //     } else {
  //       objeto.COMPROMETIDO = formatNumber(objeto.COMPROMETIDO, 'en-US');
  //     }
  //     if (objeto.COMPROMISO == null || objeto.COMPROMISO == undefined) {
  //       objeto.COMPROMISO = 0
  //     } else {
  //       objeto.COMPROMISO = formatNumber(objeto.COMPROMISO, 'en-US');
  //     }
  //   }

  //   return this.datosTabla;
  // }
  ejecutarProgramacion(tipoReporte: any) {
    this.mostrarReporte = tipoReporte
    this.datosTabla = this.baseInformes
  }
  ejecutarREPORTEProgramacion(tipoReporte:any){
    console.log(tipoReporte)
    this.datosTabla = this.baseInformes
    let x:any = []
    if(this.titulo == 'cuentas'){
      this.codigosModeloReporteCuentas.forEach(element => {
        let y = this.datosTabla.filter((codigo:any) => codigo.CODIGOPRESUPUESTAL == element.codigo)
        x.push(y[0])
        console.log(x)
       });
       console.log(this.datosTabla)
    }else{
      if(this.titulo == "reservas" && tipoReporte == 'ReporteEjecucion'){
        this.codigoModeloEjecReservas.forEach(element => {
          let y = this.datosTabla.filter((codigo:any) => codigo.CODIGOPRESUPUESTAL == element.codigo)
          x.push(y[0])
         });
         console.log(x)
      }else{
        if(this.titulo == "reservas" && tipoReporte == 'ReporteProgramacion'){
          this.codigoModeloReporteReservas.forEach(element => {
            let y = this.datosTabla.filter((codigo:any) => codigo.CODIGOPRESUPUESTAL == element.CODIGO.trim())
            x.push(y[0])
           });
           console.log(x)
        }else{
          this.codigosModeloReporte.forEach(element => {
            let y = this.datosTabla.filter((codigo:any) => codigo.CODIGOPRESUPUESTAL == element.CODIGO.trim())
            x.push(y[0])
           });
           console.log(x)
        }
      }
    
    }

     this.datosTabla = x
     this.mostrarReporte = tipoReporte
     this.limpiarTabla()
  }
 

  irAIngresos() {
    localStorage.setItem('ruta','ingresos')
    this.titulo = 'ingresos'
    this.router.navigate(['/ingresos']);
  }

  irAGastos() {
    localStorage.setItem('ruta','gastos')
    this.titulo = 'gastos'
    this.router.navigate(['/gastos']);
  }

  irAReservar() {
    this.titulo = 'reservas'
    localStorage.setItem('ruta','reservas')
    this.router.navigate(['/gastos']);
  }

  irACuentasPorPagar() {
    this.titulo = 'cuentas'
    localStorage.setItem('ruta','cuentas')
    this.router.navigate(['/gastos']);
  }

}
