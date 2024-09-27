import { Component, Inject, LOCALE_ID, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import localeEs from '@angular/common/locales/es';
import { FormatNumberPipe } from './pipe';


@Component({
  selector: 'app-modal-tabla',
  templateUrl: './modal.component.html',
  styleUrls: [],
  providers: [FormatNumberPipe]
})
export class ModalTablaComponent implements OnInit {
    cuentaCorrienteNoCorriente: any = 'no'
    cuentaCorriente: any = 'no'
    mostrarCorrientesyNoCorrientes  = false
    valorCorriente = new Array(this.data.data.length).fill(null);
    objetos:any = []
    objetosCopia:any = []
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private dialogRef1: MatDialogRef<ModalTablaComponent>,
    private dialog1: MatDialog
  ) {
  }


  ngOnInit(): void {
    if(this.data.configuracion){
      this.objetosCopia =  this.data.data
       this.mostrarCorrientesyNoCorrientes = true
    }
    console.log(this.data.data)
  }

  onAccept() {
    let obj = {
      cuentaCorrienteNoCorriente: this.cuentaCorrienteNoCorriente,
      cuentaCorriente: this.cuentaCorriente
    }
      this.dialogRef1.close(obj);
  }
 
  checkValorCorriente(valor: number, nuevoSaldo: number) {
    if (valor > nuevoSaldo) {
      alert('El valor no puede ser mayor al nuevo saldo');
    }
  }
  verificarCorriente(): void {
    if (this.valorCorriente.every(valor => valor !== null && valor !== undefined)) {
      this.data.data.forEach((item:any, index:any) => {
        item.tipoDeCuenta = this.valorCorriente[index];
        item.compartidoTipo =   item.nuevoSaldo - this.valorCorriente[index];
        this.objetos.push(item);
      });
      this.data.data = [];
      this.dialogRef1.close(this.objetos);
    } else {
      alert('Faltan datos para llenar por favor verifique');
    }
}
  onCancel() {
    this.dialog1.closeAll();
  }
}