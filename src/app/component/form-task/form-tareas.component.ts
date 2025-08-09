import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-tareas',
  templateUrl: './form-tareas.component.html',
  styleUrls: [],
})
export class FormTaskComponent implements OnInit {
  @Output() form: EventEmitter<any> = new EventEmitter();
  @Input() data: any;
  formData: FormGroup | any;
  options = [
    { name: 'Completado', value: true },
    { name: 'Por hacer', value: false },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.data.titulo === 'Editar') {
      this.buildFormulario();
      this.setFormulario(this.data);
    } else {
      this.buildFormulario();
    }
  }

  buildFormulario() {
    this.formData = this.fb.group({
      nemotecnico: ['', Validators.required],
      clasetitulo: ['', Validators.required],
      emisor: ['', Validators.required],
      sociedadComisionista: ['', Validators.required],
      tasaReferencia: ['', Validators.required],
      spread: ['', Validators.required],
      periodicidad: ['', Validators.required],
      fechaEmision: ['', Validators.required],
      fechaVcto: ['', Validators.required],
      fechaCompra: ['', Validators.required],
      valorNominal: ['', Validators.required],
      vrCompra: ['', Validators.required],
      numeroInterno: ['', Validators.required],
      uaa: ['', Validators.required],
    });
    this.form.emit(this.formData);
  }

  setFormulario(data: any) {
    const tarea = data.seleccionados[0];
    if (!tarea) return;
    this.formData.patchValue({
      nemotecnico: tarea.nemotecnico || '',
      clasetitulo: tarea.clasetitulo || '',
      emisor: tarea.emisor || '',
      sociedadComisionista: tarea.sociedadComisionista || '',
      tasaReferencia: tarea.tasaReferencia || '',
      spread: tarea.spread || '',
      periodicidad: tarea.periodicidad || '',
      fechaEmision: tarea.fechaEmision || '',
      fechaVcto: tarea.fechaVcto || '',
      fechaCompra: tarea.fechaCompra || '',
      valorNominal: tarea.valorNominal || '',
      vrCompra: tarea.vrCompra || '',
      numeroInterno: tarea.numeroInterno || '',
      uaa: tarea.uaa || ''
    });
  }
}
