import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ModalTablaComponent } from '../modall/modal.component';


@Component({
  selector: 'app-modal-tabla-nuevos',
  templateUrl: './modal-tabla.component.html',
  styleUrls: ['./modal-tabla.component.scss'],
  providers: [],
})
export class ModalTablaNuevasComponent implements OnInit {
  @Output() valorEnviado = new EventEmitter<string>();
  displayedColumns: string[] = [
    'tipo',
    'codigo',
    'nombre',
    'saldoAnterior',
    'credito',
    'debito',
    'nuevoSaldo',
    'tipoSaldoAnterior',
    'tipoSaldoNuevo',
    'corriente',
    'noCorriente',
  ];
  rowColors: any = {};
  corrientes: any = [];
  noCorrientes: any = [];
  corrientesNoCorrientes: any = [];
  codigosNoexistentes: any = [];
  padres: any = [];
  currentPage = 1;
  pageSize = 100;
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
  @Input() datosTabla: any;
  datosTabla2: any = [];
  datosTabla2Recorrido: any = [];
  unicosmodelo = [];
  accion2: any;
  elementosUnificados: any;
  private filterSubject = new Subject<string>();
  constructor(
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.accion2 = this.datosTabla.accion
    this.datosTabla = this.datosTabla.data
    if (this.accion2 === 'corrientes') {
      this.datosTabla = this.datosTabla.map((data: any) => {
        return {
          ...data,
          corriente: true,
          noCorriente: true
        };
      })
    }
    this.consultarTabla()
  }

  // onAccept() {
  //   let obj = {
  //     cuentaCorrienteNoCorriente: this.cuentaCorrienteNoCorriente,
  //     cuentaCorriente: this.cuentaCorriente
  //   }
  //     this.dialogRef.close(obj);
  // }
  toggleAllSelection() {
    this.selectAll = !this.selectAll;
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
  consultarTabla() {
    // for (let index = 0; index < this.datosTabla.length; index++) {
    //   this.datosTabla[index].tipo = false;
    // }
    this.dataTareasPaginated = this.datosTabla.slice(0, this.pageSize);
    this.onPageChange({
      pageIndex: this.currentPage - 1,
      pageSize: this.pageSize,
    });
  }
  seleccionadosTabla(row: any) {
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
  onPageChange(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.dataTareasPaginated = this.datosTabla.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
  }

  onCancel() {
    this.dialog.closeAll();
  }
  openDialog() {
    let obj = {
      data: this.datosTabla,
      configuracion: false
    }
    const dialogRef = this.dialog.open(ModalTablaComponent, {
      panelClass: 'my-custom-dialog',
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        for (const selectedRow of this.seleccionados) {
          const index = this.datosTabla.findIndex(
            (row: any) => row.codigo === selectedRow.codigo
          );
          if (index !== -1) {
            const row = this.datosTabla[index];
            row.corriente = result.cuentaCorriente === 'si' ? 'true' : 'false';
            row.noCorriente = result.cuentaCorrienteNoCorriente === 'si'  ? 'true' : 'false';
            this.datosTabla[index] = row;
          } 
        }
      }
    });
  }
  aceptar(): void {  
    let datos:any = []
    this.datosTabla.forEach((element: any) => {
      if(element.corriente === undefined || element.noCorriente === undefined){
         datos.push(element)
      }
    });
    if(datos.length > 0){
      alert('Faltan datos para seleccionar')
    } else {
      let obj:any = {
        data: this.datosTabla,
        accion: this.accion2
      }
      this.valorEnviado.emit(obj);
    }
    // Aquí puedes agregar la lógica que desees ejecutar cuando se haga clic en el botón
  }
}