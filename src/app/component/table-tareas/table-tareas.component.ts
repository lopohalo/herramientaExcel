import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { Tarea } from '../interfas/tarea-modelo';
import { ModalTablaComponents } from '../modales/modal-tabla/modal-tabla.component';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table-tareas',
  templateUrl: './table-tareas.component.html',
  styleUrls: ['./table-tareas.component.scss'],
})
export class TableTareasComponent implements OnInit {
  @Input() dataTareas: Tarea[] = [];
  @Input() accionTareas: EventEmitter<void> = new EventEmitter<void>();
  @Output() eliminarTarea = new EventEmitter<any>();
  @Output() agregarTarea = new EventEmitter<any>();
  @Output() editarTarea = new EventEmitter<any>();
  filterValue: string = '';
  displayedColumns: string[] = [
    'id',
    'nemotecnico',
    'clasetitulo',
    'emisor',
    'sociedadComisionista',
    'tasaReferencia',
    'spread',
    'periocidad',
    'fechaEmision',
    'fechaVcto',
    'fechaCompra',
    'valorNominal',
    'vrCompra',
    'numeroInterno',
    'uaa',
    'meses',
  ];
  currentPage = 1;
  pageSize = 5;
  seleccionados: Tarea[] = [];
  dataTareasPaginated: any = [];
  copiarDataTareas: any = [];

  constructor(private dialog: MatDialog, private router: Router) {}

  ngOnInit() {
    this.copiarDataTareas = this.dataTareas;
    this.consultarTabla();
  }

  consultarTabla() {
    for (let index = 0; index < this.dataTareas.length; index++) {
      this.dataTareas[index].selected = false;
    }
    this.dataTareasPaginated = this.dataTareas.slice(0, this.pageSize);
    this.onPageChange({
      pageIndex: this.currentPage - 1,
      pageSize: this.pageSize,
    });
  }

  seleccionadosTabla(row: Tarea) {
    this.dataTareas.forEach((tarea: Tarea) => {
      if (row.id !== tarea.id) {
        tarea.selected = false;
      }
    });
    row.selected = !row.selected;

    if (row.selected) {
      this.seleccionados = [row];
    } else {
      this.seleccionados = [];
    }
  }

  AgregaraCalculadora() {
    const tarea: any = {
      id: this.seleccionados[0].id,
      idTipoTitulo: this.seleccionados[0].idTipoTitulo,
      fechaEmision: this.seleccionados[0].fechaEmision,
      fechaVcto: this.seleccionados[0].fechaVcto,
      fechaCompra: this.seleccionados[0].fechaCompra, 
      periocidad: this.seleccionados[0].periocidad,
      tipoTasa: this.seleccionados[0].tipoTasa,
      tasaDFT: this.seleccionados[0].spread,
      tasaFacial: this.seleccionados[0].spread,
      valorTitulo: this.seleccionados[0].valorNominal,
      meses: this.seleccionados[0].meses,
      anios: 0,
      total: '',
      totalAcumulado: '',
    };
    const dataTareasCalcular = localStorage.getItem('dataTareasCalcular');
    if (dataTareasCalcular !== null) {
      const arreglo = JSON.parse(dataTareasCalcular);
      arreglo.push(tarea);
      localStorage.setItem('dataTareasCalcular', JSON.stringify(arreglo));
    } else {
      localStorage.setItem('dataTareasCalcular', JSON.stringify([tarea]));
    }
    this.router.navigate(['/']);
  }

  editTask(task: Tarea): void {}

  eliminarSeleccion(): void {
    Swal.fire({
      title: 'Esta seguro de eliminar esta tarea?',
      text: 'No podra revertir esta operación!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarTarea.emit(this.seleccionados);
      }
    });
  }

  applyFilter(valor: any) {
    console.log(valor);
    if (valor === '') {
      this.dataTareas = this.copiarDataTareas;
    } else {
      this.dataTareas = this.dataTareas.filter((row) => {
        return Object.values(row).some((value) => {
          return value.toString().toLowerCase().includes(valor.toLowerCase());
        });
      });
    }
    this.consultarTabla();
  }
  openDialog($event: string) {
    const dialogRef = this.dialog.open(ModalTablaComponents, {
      panelClass: 'my-custom-dialog',
      data: { seleccionados: this.seleccionados, titulo: $event },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if ($event === 'Editar') {
        this.editarTarea.emit(this.seleccionados[0]);
      } else {
        this.agregarTarea.emit(result.value);
      }
    });
  }
  onPageChange($event: any) {
    this.currentPage = $event.pageIndex + 1;
    this.pageSize = $event.pageSize;
    this.dataTareasPaginated = this.dataTareas.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
  }

  onSort($event: any) {
    const isAsc = $event.direction === 'asc';
    const col = $event.active;
    this.dataTareas.sort((a: any, b: any) => {
      let valA = a[col];
      let valB = b[col];
      // Try to compare as numbers if possible
      if (!isNaN(Number(valA)) && !isNaN(Number(valB))) {
        return isAsc
          ? Number(valA) - Number(valB)
          : Number(valB) - Number(valA);
      }
      // Otherwise compare as strings
      if (
        valA &&
        valB &&
        typeof valA === 'string' &&
        typeof valB === 'string'
      ) {
        return isAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return 0;
    });
    this.dataTareasPaginated = this.dataTareas.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
  }
}
