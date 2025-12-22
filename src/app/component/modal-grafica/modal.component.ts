import { Component, Inject, LOCALE_ID, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import localeEs from '@angular/common/locales/es';
import { FormatNumberPipe } from './pipe';


@Component({
  selector: 'app-modal-grafica',
  templateUrl: './modal.component.html',
  styleUrls: [],
  providers: [FormatNumberPipe]
})
export class ModalTablaGraficaComponent implements OnInit {
  chartData1: any;
  chartLabels1: any;
  chartOptions: any = {
    responsive: true,
  };
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private dialogRef1: MatDialogRef<ModalTablaGraficaComponent>,
    private dialog1: MatDialog
  ) {
  }


  ngOnInit(): void {
    console.log(this.data)
    this.chartData1 = this.data.chartData1;
    this.chartLabels1 = this.data.chartLabels1;
  }

  cerrarModal() {
      this.dialogRef1.close();
  }

}