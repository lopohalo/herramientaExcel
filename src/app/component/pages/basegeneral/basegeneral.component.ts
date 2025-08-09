import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-basegeneral',
  templateUrl: './basegeneral.component.html',
  styleUrls: ['./basegeneral.component.scss'],
})
export class BasegeneralComponent implements OnInit {
  @Output() accionTareas = new EventEmitter<void>();
  dataTareas: any;
  constructor(private router: Router) {}

  ngOnInit(): void {
    const tareaEjemplo = {
      nemotecnico: 'MEC2025',
      clasetitulo: 'A',
      emisor: 'Empresa XYZ',
      sociedadComisionista: 'Comisionista ABC',
      tasaReferencia: 'DTF',
      spread: 2.5,
      periodicidad: 'Mensual',
      fechaEmision: '2025-01-15',
      fechaVcto: '2030-01-15',
      fechaCompra: '2025-07-01',
      valorNominal: 1000000,
      vrCompra: 950000,
      numeroInterno: 'INT-001',
      uaa: 'UAA-456',
    };
    this.dataTareas = [tareaEjemplo];
    this.consultarTareas();
  }

  consultarTareas() {
    this.accionTareas.emit();
  }
  eliminarTarea(tarea: any) {
    this.dataTareas = this.dataTareas.filter((item: any) => item.numeroInterno !== tarea.numeroInterno);
  }
  agregarTarea(tarea: any) {
    const newId = this.dataTareas && this.dataTareas.length > 0
      ? Math.max(...this.dataTareas.map((t: any) => t.id || 0)) + 1
      : 1;
    const nuevaTarea = {
      id: newId,
      nemotecnico: tarea.nemotecnico,
      clasetitulo: tarea.clasetitulo,
      emisor: tarea.emisor,
      sociedadComisionista: tarea.sociedadComisionista,
      tasaReferencia: tarea.tasaReferencia,
      spread: tarea.spread,
      periodicidad: tarea.periodicidad,
      fechaEmision: tarea.fechaEmision,
      fechaVcto: tarea.fechaVcto,
      fechaCompra: tarea.fechaCompra,
      valorNominal: tarea.valorNominal,
      vrCompra: tarea.vrCompra,
      numeroInterno: tarea.numeroInterno,
      uaa: tarea.uaa
    };
    this.dataTareas = [...this.dataTareas, nuevaTarea];
  }
  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['']);
  }
  editarTarea(tarea: any) {
    this.dataTareas = this.dataTareas.map((item: any) => {
      if (item.id === tarea.id) {
        return {
          id: item.id,
          nemotecnico: tarea.nemotecnico,
          clasetitulo: tarea.clasetitulo,
          emisor: tarea.emisor,
          sociedadComisionista: tarea.sociedadComisionista,
          tasaReferencia: tarea.tasaReferencia,
          spread: tarea.spread,
          periodicidad: tarea.periodicidad,
          fechaEmision: tarea.fechaEmision,
          fechaVcto: tarea.fechaVcto,
          fechaCompra: tarea.fechaCompra,
          valorNominal: tarea.valorNominal,
          vrCompra: tarea.vrCompra,
          numeroInterno: tarea.numeroInterno,
          uaa: tarea.uaa
        };
      }
      return item;
    });
  }
}
