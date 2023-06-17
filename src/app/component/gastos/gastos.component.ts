import { Component } from '@angular/core';
import { elementAt, filter } from 'rxjs';
import {
  formatNumber
}
  from '@angular/common';
import * as numeral from 'numeral';
import * as XLSX from 'xlsx'

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.scss']
})
export class GastosComponent {
  title = 'herramientaExcel';
  validartabla = 0
  cargandoPaginaSpinner:any = ''
  mostrarReporte: any = ''
  mostrarBoton = 0
  contadormodelo = 15
  convertedJson!: string;
  fileName = 'tabla.xlsx';
  ejecucion = 0
  datosTabla: any = []
  datosDuplicados: any = []
  sinDuplicados: any = []
  sinDuplicadosTABLA: any = []
  unicosmodelo = []
  elementosUnificados: any
  modeloInformacion = [
    
    {
        "CODIGOPRESUPUESTAL": "2",
        "CONCEPTO": "GASTOS "
    },
,

    {
        "CODIGOPRESUPUESTAL": "2.1",
        "CONCEPTO": "FUNCIONAMIENTO "
    }
,

    {
        "CODIGOPRESUPUESTAL": "2.1.1",
        "CONCEPTO": "GASTOS DE PERSONAL "
    }
,

    {
        "CODIGOPRESUPUESTAL": "2.1.1.01 ",
        "CONCEPTO": "PLANTA DE PERSONAL PERMANENTE "
    }
,

    {
        "CODIGOPRESUPUESTAL": "2.1.1.01.01 ",
        "CONCEPTO": "FACTORES CONSTITUTIVOS DE SALARIO "
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.1.1.01.01.001 ",
        "CONCEPTO": "FACTORES SALARIALES COMUNES "
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.1.1.01.02 ",
        "CONCEPTO": "CONTRIBUCIONES INHERENTES A LA NOMINA "
    }
,

   
    {
        "CODIGOPRESUPUESTAL": "2.1.1.01.03 ",
        "CONCEPTO": "REMUNERACIONES NO CONSTITUTIVAS DE FACTOR SALARIAL "
    }
,

   
    {
        "CODIGOPRESUPUESTAL": "2.1.1.01.03.001 ",
        "CONCEPTO": "PRESTACIONES SOCIALES "
    }
,

   
    {
        "CODIGOPRESUPUESTAL": "2.1.1.02 ",
        "CONCEPTO": "PERSONAL SUPERNUMERARIO Y PLANTA TEMPORAL "
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.1.1.02.01 ",
        "CONCEPTO": "FACTORES CONSTITUTIVOS DE SALARIO "
    }
,

   
    {
        "CODIGOPRESUPUESTAL": "2.1.1.02.01.001 ",
        "CONCEPTO": "FACTORES SALARIALES COMUNES "
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.1.1.02.02 ",
        "CONCEPTO": "CONTRIBUCIONES INHERENTES A LA NOMINA "
    }
,

   
    {
        "CODIGOPRESUPUESTAL": "2.1.1.02.03 ",
        "CONCEPTO": "REMUNERACIONES NO CONSTITUTIVAS DE FACTOR SALARIAL "
    }
,

   
    {
        "CODIGOPRESUPUESTAL": "2.1.1.02.03.001 ",
        "CONCEPTO": "PRESTACIONES SOCIALES "
    }
,

   
    {
        "CODIGOPRESUPUESTAL": "2.1.2 ",
        "CONCEPTO": "ADQUISICION DE BIENES Y SERVICIOS "
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.1.2.02 ",
        "CONCEPTO": "ADQUISICIONES DIFERENTES DE ACTIVOS "
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.1.2.02.01 ",
        "CONCEPTO": "MATERIALES Y SUMINISTROS "
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.1.2.02.02 ",
        "CONCEPTO": "ADQUISICION DE SERVICIOS "
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.1.2.02.03 ",
        "CONCEPTO": "GASTOS IMPREVISTOS "
    }
,

    {
        "CODIGOPRESUPUESTAL": "2.1.3 ",
        "CONCEPTO": "TRANSFERENCIAS CORRIENTES "
    }
,

    {
        "CODIGOPRESUPUESTAL": "2.1.3.04 ",
        "CONCEPTO": "A ORGANIZACIONES NACIONALES "
    }
,

   
    {
        "CODIGOPRESUPUESTAL": "2.1.3.04.05 ",
        "CONCEPTO": "A OTRAS ORGANIZACIONES NACIONALES "
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.1.3.07 ",
        "CONCEPTO": "PRESTACIONES PARA CUBRIR RIESGOS SOCIALES "
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.1.3.07.02 ",
        "CONCEPTO": "PRESTACIONES SOCIALES RELACIONADAS CON EL EMPLEO "
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.1.7 ",
        "CONCEPTO": "DISMINUCION DE PASIVOS "
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.1.7.01 ",
        "CONCEPTO": "CESANTIAS "
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.1.8 ",
        "CONCEPTO": "GASTOS POR TRIBUTOS, TASAS, CONTRIBUCIONES, MULTAS, SANCIONES E INTERESES DE MORA "
    }
,

   
    {
        "CODIGOPRESUPUESTAL": "2.1.8.01 ",
        "CONCEPTO": "IMPUESTOS "
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.3 ",
        "CONCEPTO": "INVERSION "
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.3.2 ",
        "CONCEPTO": "ADQUISICION DE BIENES Y SERVICIOS "
    }
,

   
    {
        "CODIGOPRESUPUESTAL": "2.3.2.01 ",
        "CONCEPTO": "ADQUISICION DE ACTIVOS NO FINANCIEROS "
    }
,

   
    {
        "CODIGOPRESUPUESTAL": "2.3.2.01.01 ",
        "CONCEPTO": "ACTIVOS FIJOS "
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.3.2.01.01.001 ",
        "CONCEPTO": "EDIFICACIONES Y ESTRUCTURAS "
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.3.2.01.01.003 ",
        "CONCEPTO": "MAQUINARIA Y EQUIPO "
    }
,

   
    {
        "CODIGOPRESUPUESTAL": "2.3.2.01.01.004 ",
        "CONCEPTO": "ACTIVOS FIJOS NO CLASIFICADOS COMO MAQUINARIA Y EQUIPO "
    }
,

    
    {
        "CODIGOPRESUPUESTAL": "2.3.2.01.01.005 ",
        "CONCEPTO": "OTROS ACTIVOS FIJOS "
    }

]

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
    if(this.mostrarReporte == 'Ejecucion'){
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
 const range = XLSX.utils.decode_range(hoja['!ref']);
 for (let i = range.s.r + 1; i <= range.e.r; i++) {
   const celda = hoja[XLSX.utils.encode_cell({ r: i, c: 1 })];
   celda.z = '@';
 }

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
  const encabezados = filas[0]?.querySelectorAll('th');

  // Obtener los datos de la tabla en un arreglo de arreglos
  const datos = filas.map((fila) =>
    Array.from(fila.querySelectorAll('td, th')).map((celda) => celda.textContent)
  );

  // Agregar los encabezados de columna al inicio del arreglo de arreglos
  // if (encabezados) {
  //   datos.unshift(Array.from(encabezados).map((encabezado) => encabezado.textContent));
  // }

  return datos;
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
        if (w == 0) {
          if (element.PRESUPUESTODEFINITIVO == undefined) {
            w = 0
          } else {
            w = element.PRESUPUESTODEFINITIVO
          }
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim(), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim(),  valor: x, definitivo: w , PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c}))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim(),   valor: x, definitivo: w, PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c })
        } else {
          w = w + element.PRESUPUESTODEFINITIVO
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim(), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim(), valor: x, definitivo: w , PAGOS: y, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c }))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim(), valor: x, definitivo: w , PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c})
        }
        if (y == 0) {
          if (element.PAGOS == undefined) {
            y = 0
          } else {
            y = element.PAGOS
          }
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim(), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim(),  valor: x, definitivo: w , PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c}))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim(),   valor: x, definitivo: w, PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c })
        } else {
          y = y + element.PAGOS
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim(), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim(), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c }))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim(), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c })
        }
        if (c == 0) {
          if (element.COMPROMETIDO == undefined) {
            c = 0
          } else {
            c = element.COMPROMETIDO
          }
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim(), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim(),  valor: x, definitivo: w , PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c}))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim(),   valor: x, definitivo: w, PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c })
        } else {
          c = c + element.COMPROMETIDO
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim(), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim(), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c }))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim(), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c })
        }
        if (x == 0) {
          if (element.APROPIACIONINICIAL == undefined) {
            x = 0
          } else {
            x = element.APROPIACIONINICIAL
          }
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim(), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim(),  valor: x, definitivo: w , PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c}))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim(),   valor: x, definitivo: w, PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c })
        } else {
          x = x + element.APROPIACIONINICIAL
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim(), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim(),  valor: x, definitivo: w , PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c}))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim(),   valor: x, definitivo: w, PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c })
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
        element.FUENTESDEFINANCIACION = '1.2.1.0.00'
        element.SITUACIONDEFONDOS = 'c'
        element.POLITICAPUBLICA = '0'
        element.TERCERO = '1'
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
          unicos.push("2.1.7")
        }
        if(this.contadormodelo == 8){
          unicos.push("2.1.1.01","2.1.1.02","2.1.2.02", "2.1.3.04", "2.1.3.07","2.1.7.01", "2.1.8.01", "2.3.2.01")
        }
        if(this.contadormodelo == 11){
          unicos.push("2.1.1.01.01","2.1.1.01.02","2.1.1.01.03", "2.1.1.02.01", "2.1.1.02.02", "2.1.1.02.03", "2.1.2.02.01", "2.1.2.02.02", "2.1.2.02.03", "2.1.3.04.05", "2.1.3.07.02", "2.3.2.01.01")
        }
        if(this.contadormodelo == 15){
          unicos.push("2.1.1.01.01.001","2.1.1.01.03.001","2.1.1.02.01.001", "2.1.1.02.03.001", "2.3.2.01.01.001", "2.3.2.01.01.003", "2.3.2.01.01.004","2.3.2.01.01.005")
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
    unicos.forEach((element: any) => {
      const arreglosSeparados = this.datosTabla.filter((campo: any) => campo.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor) == element.trim())
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
      for (let i = 0; i < element1; i++) {
        const element = element2[i]
        if (p == 0) {
          if (element.EJECUTADOCOMOOBLIGACION == undefined) {
            p = 0
          } else {
            p = element.EJECUTADOCOMOOBLIGACION
          }
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c }))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c })
        } else {
          p = p + element.EJECUTADOCOMOOBLIGACION
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c }))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c })
        }
        if (w == 0) {
          if (element.PRESUPUESTODEFINITIVO == undefined) {
            w = 0
          } else {
            w = element.PRESUPUESTODEFINITIVO
          }
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c }))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c })
        } else {
          w = w + element.PRESUPUESTODEFINITIVO
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), valor: x, definitivo: w , PAGOS: y, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c }))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), valor: x, definitivo: w , PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c})
        }
        if (y == 0) {
          if (element.PAGOS == undefined) {
            y = 0
          } else {
            y = element.PAGOS
          }
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c }))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c })
        } else {
          y = y + element.PAGOS
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c }))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c })
        }
        if (c == 0) {
          if (element.COMPROMETIDO == undefined) {
            c = 0
          } else {
            c = element.COMPROMETIDO
          }
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c }))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c })
        } else {
          c = c + element.COMPROMETIDO
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c }))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c })
        }
        if (x == 0) {
          if (element.APROPIACIONINICIAL == undefined) {
            x = 0
          } else {
            x = element.APROPIACIONINICIAL
          }
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c }))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), PAGOS: y, valor: x, definitivo: w, EJECUTADOCOMOOBLIGACION: p, COMPROMETIDO: c })
        } else {
          x = x + element.APROPIACIONINICIAL
          localStorage.setItem(element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor), JSON.stringify({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),  valor: x, definitivo: w , PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c}))
          this.datosDuplicados.push({ codigo: element.CODIGOPRESUPUESTAL.trim().slice(0, contadorValor),   valor: x, definitivo: w, PAGOS: y, EJECUTADOCOMOOBLIGACION: p , COMPROMETIDO: c })
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
        this.elementosUnificados = this.modeloInformacion.map((element1: any) => element1.CODIGOPRESUPUESTAL == element.CODIGOPRESUPUESTAL ? element : element1)
      });
    }
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
      this.formatearNumeros();
    });
  }
  formatearNumeros(): any[] {
    for (const objeto of this.datosTabla) {
      if (objeto.APROPIACIONINICIAL == null || objeto.APROPIACIONINICIAL == undefined) {
        objeto.APROPIACIONINICIAL = 0
      } else {
        objeto.APROPIACIONINICIAL = formatNumber(objeto.APROPIACIONINICIAL, 'en-US');
      }
      if (objeto.PAGOS == null || objeto.PAGOS ==  undefined) {
        objeto.PAGOS = 0
      } else {
        objeto.PAGOS = formatNumber(objeto.PAGOS, 'en-US');
      }
      if (objeto.PRESUPUESTODEFINITIVO == null || objeto.PRESUPUESTODEFINITIVO ==  undefined) {
        objeto.PRESUPUESTODEFINITIVO = 0
      } else {
        objeto.PRESUPUESTODEFINITIVO = formatNumber(objeto.PRESUPUESTODEFINITIVO, 'en-US');
      }
      if (objeto.EJECUTADOCOMOOBLIGACION == null ||  objeto.EJECUTADOCOMOOBLIGACION ==  undefined) {
        objeto.EJECUTADOCOMOOBLIGACION = 0
      } else {
        objeto.EJECUTADOCOMOOBLIGACION = formatNumber(objeto.EJECUTADOCOMOOBLIGACION, 'en-US');
      }
      if (objeto.COMPROMETIDO == null || objeto.COMPROMETIDO ==  undefined) {
        objeto.COMPROMETIDO = 0
      } else {
        objeto.COMPROMETIDO = formatNumber(objeto.COMPROMETIDO, 'en-US');
      }
      if (objeto.COMPROMISO == null || objeto.COMPROMISO == undefined) {
        objeto.COMPROMISO = 0
      } else {
        objeto.COMPROMISO = formatNumber(objeto.COMPROMISO, 'en-US');
      }
    }

    return this.datosTabla;
  }
  ejecutarProgramacion(tipoReporte: any) {
    this.mostrarReporte = tipoReporte
  }

}
