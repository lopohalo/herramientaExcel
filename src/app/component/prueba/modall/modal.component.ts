import { Component, Inject, LOCALE_ID, OnInit, Output } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import localeEs from '@angular/common/locales/es';
import { FormatNumberPipe } from './pipe';

@Component({
  selector: 'app-modal-tabla',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  providers: [FormatNumberPipe],
})
export class ModalTablaComponent implements OnInit {
  cuentaCorrienteNoCorriente: any = 'no';
  cuentaCorriente: any = 'no';
  mostrarCorrientesyNoCorrientes = false;
  valorCorriente = new Array(this.data.data.length).fill(null);
  valorNormalSaldo = new Array(this.data.data.length).fill(null);
  selectedAccountType = new Array(this.data.data.length).fill('current');
  objetos: any = [];
  objetosCopia: any = [];
  mostrarSaldoAnterior = false;
  mostrarCompartidosCorriente = false;
  mostrarAjusteCorrienteNoCorriente = false;
  valoresCorrientes: number[] = [];
  valoresNoCorrientes: number[] = [];
  saldosAnteriores: number[] = [];
  nuevosSaldos: number[] = [];
  saldosAnterioresOriginales: number[] = [];
  nuevosSaldosOriginales: number[] = [];
  totalesDistribucion: number[] = [];
  errorAjuste = '';
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private dialogRef1: MatDialogRef<ModalTablaComponent>,
    private dialog1: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.tipo === 'ajustarCorrienteNoCorriente') {
      this.mostrarAjusteCorrienteNoCorriente = true;
      this.valoresCorrientes = this.data.data.map(
        (item: any) => Number(item.tipoDeCuenta) || 0
      );
      this.valoresNoCorrientes = this.data.data.map(
        (item: any) => Number(item.compartidoTipo) || 0
      );
      this.saldosAnteriores = this.data.data.map(
        (item: any) => Number(item.saldoAnterior) || 0
      );
      this.nuevosSaldos = this.data.data.map(
        (item: any) => Number(item.nuevoSaldo) || 0
      );
      this.saldosAnterioresOriginales = [...this.saldosAnteriores];
      this.nuevosSaldosOriginales = [...this.nuevosSaldos];
      this.totalesDistribucion = this.data.data.map(
        (item: any) => Number(item.nuevoSaldo) || 0
      );
      return;
    }
    if (this.data && this.data.tipo === 'compartidoCuenta') {
      this.mostrarCompartidosCorriente = true;
    }
    if (this.data && this.data.tipo === 'despues') {
      this.mostrarSaldoAnterior = true;
    }
    if (this.data.configuracion) {
      this.objetosCopia = this.data.data;
      this.mostrarCorrientesyNoCorrientes = true;
    }
    console.log(this.data.data);
  }

  onAccept() {
    let obj = {
      cuentaCorrienteNoCorriente: this.cuentaCorrienteNoCorriente,
      cuentaCorriente: this.cuentaCorriente,
    };
    this.dialogRef1.close(obj);
  }

  totalDistribuido(index: number): number {
    return (Number(this.valoresCorrientes[index]) || 0) +
      (Number(this.valoresNoCorrientes[index]) || 0);
  }

  diferenciaAjuste(index: number): number {
    return this.totalesDistribucion[index] - this.totalDistribuido(index);
  }

  intercambiarDistribucion(index: number): void {
    const valorCorriente = Number(this.valoresCorrientes[index]) || 0;
    const valorNoCorriente = Number(this.valoresNoCorrientes[index]) || 0;
    this.valoresCorrientes[index] = valorNoCorriente;
    this.valoresNoCorrientes[index] = valorCorriente;
    this.errorAjuste = '';
  }

  actualizarDesdeCorriente(index: number): void {
    this.valoresNoCorrientes[index] =
      this.totalesDistribucion[index] -
      (Number(this.valoresCorrientes[index]) || 0);
  }

  actualizarDesdeNoCorriente(index: number): void {
    this.valoresCorrientes[index] =
      this.totalesDistribucion[index] -
      (Number(this.valoresNoCorrientes[index]) || 0);
  }

  actualizarSaldoAnterior(index: number): void {
    const saldoAnterior = Number(this.saldosAnteriores[index]) || 0;
    const diferencia = saldoAnterior - this.saldosAnterioresOriginales[index];
    const nuevoSaldo = this.nuevosSaldosOriginales[index] + diferencia;
    const totalAnterior = this.totalesDistribucion[index];
    const corrienteAnterior = Number(this.valoresCorrientes[index]) || 0;
    const proporcionCorriente = totalAnterior !== 0
      ? corrienteAnterior / totalAnterior
      : 0;

    this.nuevosSaldos[index] = nuevoSaldo;
    this.totalesDistribucion[index] = nuevoSaldo;
    this.valoresCorrientes[index] = nuevoSaldo * proporcionCorriente;
    this.valoresNoCorrientes[index] =
      nuevoSaldo - this.valoresCorrientes[index];
    this.errorAjuste = '';
  }

  guardarAjustes(): void {
    const resultado = this.data.data.map((item: any, index: number) => ({
      ...item,
      saldoAnterior: Number(this.saldosAnteriores[index]) || 0,
      nuevoSaldo: Number(this.nuevosSaldos[index]) || 0,
      tipoDeCuenta: Number(this.valoresCorrientes[index]) || 0,
      compartidoTipo: Number(this.valoresNoCorrientes[index]) || 0,
    }));
    this.dialogRef1.close(resultado);
  }

  verificarCorriente(): void {
    if (
      this.valorCorriente.every(
        (valor) => valor !== null && valor !== undefined
      )
    ) {
      this.data.data.forEach((item: any, index: any) => {
        console.log(item, index);
        item.tipoDeCuenta = this.valorCorriente[index];
        console.log(item.tipoDeCuenta);
        item.compartidoTipo = item.nuevoSaldo - item.tipoDeCuenta;
        console.log(item);
        this.objetos.push(item);
      });
      this.data.data = [];
      this.dialogRef1.close(this.objetos);
    } else {
      alert('Faltan datos para llenar por favor verifique');
    }
  }

  verificarCorrienteDespues(): void {
    if (
      this.valorNormalSaldo.every(
        (valor) => valor !== null && valor !== undefined
      )
    ) {
      this.data.data.forEach((item: any, index: any) => {
        if (this.selectedAccountType[index] === 'current') {
          item.tipoDeCuenta = this.valorNormalSaldo[index];
        } else {
          item.compartidoTipo = this.valorNormalSaldo[index];
        }
        console.log(item);
        this.objetos.push(item);
      });
      this.data.data = [];
      this.dialogRef1.close(this.objetos);
    } else {
      alert('Faltan datos para llenar por favor verifique');
    }
  }

  verificarSaldoAnterior() {
    this.data.data.forEach((item: any, index: any) => {
      console.log(item, index);
      item.saldoAnterior = this.valorNormalSaldo[index];
      console.log(item.tipoDeCuenta);
      this.objetos.push(item);
    });
    this.data.data = [];
    this.dialogRef1.close(this.objetos);
  }
  onCancel() {
    this.dialog1.closeAll();
  }
}
