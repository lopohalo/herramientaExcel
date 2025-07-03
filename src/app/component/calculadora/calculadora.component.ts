import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.component.html',
  styleUrls: ['./calculadora.component.scss'],
})
export class CaculadoraComponent implements OnInit {
  formularios: { form: FormGroup }[] = [];
  beneficiosAsignados: any[] = [];
  beneficiosAsignadosAcum: any[] = [];
  beneficiosTasaPactada: any[] = [];
  tablaKapital: any[] = [];
  totalesMesaMesIntereses: number = 0;
  totalesMesaMesRendimientos: number = 0;
  changeView = new Array(this.formularios.length).fill(true);
  flipped = new Array(this.formularios.length).fill(false);
  toggleProperty = false;
  claseEntidadList = [
    { id: 1, nombre: 'CDT' },
    { id: 2, nombre: 'BONO' },
    { id: 3, nombre: 'TES' },
    { id: 4, nombre: 'TIPS' },
  ];

  frecuencias = [
    { id: 1, nombre: 'MENSUAL' },
    { id: 2, nombre: 'TRIMESTRAL' },
    { id: 3, nombre: 'SEMESTRAL' },
    { id: 4, nombre: 'ANUAL' },
  ];

  tiposDeTasa = [
    { id: 1, nombre: 'FIJA SIMPLE' },
    { id: 2, nombre: 'INDEXADA' },
  ];
  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.agregarExperienciaPeriodo();
    this.changeView = new Array(this.formularios.length).fill(true);
  }
  agregarExperienciaPeriodo() {
    const nuevoFormPeriodos: any = this.fb.group({
      idTipoTitulo: ['', Validators.required],
      fechaEmision: ['', Validators.required],
      periocidad: ['', Validators.required],
      tipoTasa: ['', Validators.required],
      tasaDFT: ['', Validators.required],
      tasaFacial: ['', Validators.required],
      valorTitulo: ['', Validators.required],
      meses: ['', Validators.required],
      anios: [0],
      total: [''],
      totalAcumulado: [''],
    });
    this.formularios.push({ form: nuevoFormPeriodos });
  }
  deleteExperienciaPeriodo(index: number) {
    this.formularios.splice(index, 1);
  }
  calcular(i: any) {
    const formulario = this.formularios[i].form;
    if (formulario.invalid) {
      this.formularios[i].form.markAllAsTouched();
    } else {
      const dias =
        this.formularios[i].form.get('meses')?.value * 30 +
        this.formularios[i].form.get('anios')?.value * 360;
      const total = this.calcularPeriocidad(i, dias);
      const totalesMesaMes: any = this.calcularPeriocidadMesaMes(i, dias);
      const totalMesaMesRendmiento: any = this.calcularPeriocidadRendimientos(
        i,
        dias
      );
      const kapital: any = this.calcularKapital(i, dias);
      this.tablaKapital = kapital;
      this.totalesMesaMesIntereses =
        totalesMesaMes.sumaIntereses.toLocaleString('es-ES', {
          minimumFractionDigits: 2,
        });
      this.totalesMesaMesRendimientos =
        totalMesaMesRendmiento.sumaIntereses.toLocaleString('es-ES', {
          minimumFractionDigits: 2,
        });
      const tablaBeneficiosAcumulados: any = this.asignarBeneficiosMensuales(
        formulario.get('fechaEmision')?.value,
        dias,
        totalMesaMesRendmiento.beneficiosMensuales,
        formulario.get('periocidad')?.value
      );
      const tablaBeneficios: any = this.asignarBeneficiosMensuales(
        formulario.get('fechaEmision')?.value,
        dias,
        totalesMesaMes.beneficiosMensuales,
        formulario.get('periocidad')?.value
      );
      const tasaPactada = this.calcularTasaPactada(
        i,
        dias,
        totalesMesaMes.sumaIntereses
      );
      console.log(tasaPactada);
      this.beneficiosTasaPactada = tasaPactada;
      this.beneficiosAsignadosAcum = tablaBeneficiosAcumulados;
      this.beneficiosAsignados = tablaBeneficios;
      this.formularios[i].form
        .get('total')
        ?.setValue(total.toLocaleString('es-ES', { minimumFractionDigits: 2 }));
      this.formularios[i].form.get('totalAcumulado')?.setValue(
        totalMesaMesRendmiento.valorTotal.toLocaleString('es-ES', {
          minimumFractionDigits: 2,
        })
      );
      this.flipped[i] = !this.flipped[i];
    }
  }
  calcularPeriocidad(i: any, dias: any) {
    const periocidad = this.formularios[i].form.get('periocidad')?.value;
    const tasa = parseFloat(this.formularios[i].form.get('tasaFacial')?.value); // convertir a número
    const valorCdt = parseFloat(
      this.formularios[i].form.get('valorTitulo')?.value
    ); // convertir a número
    const diasNumerico = parseFloat(dias); // convertir a número

    switch (periocidad) {
      case 1: // mensual
        const meses = Math.round(diasNumerico / 30);
        const interes = valorCdt * (tasa / 100) * meses;
        const valorTotal = valorCdt + interes;
        return valorTotal;
      case 2: // trimestral
        const trimestres = Math.round(diasNumerico / 90);
        const interesTrimestral = valorCdt * (tasa / 100) * trimestres;
        const valorTotalTrimestral = valorCdt + interesTrimestral;
        return valorTotalTrimestral;
      case 3: // semestral
        const semestres = Math.round(diasNumerico / 180);
        const interesSemestral = valorCdt * (tasa / 100) * semestres;
        const valorTotalSemestral = valorCdt + interesSemestral;
        return valorTotalSemestral;
      case 4: // anual
        const anos = Math.round(diasNumerico / 360);
        const interesAnual = valorCdt * (tasa / 100) * anos;
        const valorTotalAnual = valorCdt + interesAnual;
        return valorTotalAnual;
      default:
        return 0; // devuelve 0 si no se selecciona una periocidad
    }
  }

  calcularPeriocidadMesaMes(i: any, dias: any) {
    const periocidad = this.formularios[i].form.get('periocidad')?.value;
    const tasa = parseFloat(this.formularios[i].form.get('tasaFacial')?.value); // convertir a número
    const valorCdt = parseFloat(
      this.formularios[i].form.get('valorTitulo')?.value
    ); // convertir a número
    const diasNumerico = parseFloat(dias); // convertir a número
    let beneficiosMensuales: any;
    let sumaIntereses;
    switch (periocidad) {
      case 1: // mensual
        const meses = Math.round(diasNumerico / 30);
        const interes = valorCdt * (tasa / 100) * meses;
        let valorTotal = valorCdt + interes;
        const beneficioMensual = interes / meses;
        beneficiosMensuales = [];
        sumaIntereses = 0;

        for (let i = 0; i < meses; i++) {
          valorTotal += beneficioMensual; // suma el beneficio mensual al valor total
          beneficiosMensuales.push(beneficioMensual);
          sumaIntereses += beneficioMensual; // suma los intereses mensuales
        }

        return { valorTotal, beneficiosMensuales, sumaIntereses };
      case 2: // trimestral
        const trimestres = Math.round(diasNumerico / 90);
        const interesTrimestral = valorCdt * (tasa / 100) * trimestres;
        const valorTotalTrimestral = valorCdt + interesTrimestral;
        const beneficioTrimestral = interesTrimestral / trimestres;
        beneficiosMensuales = [];
        sumaIntereses = 0;

        for (let i = 0; i < trimestres; i++) {
          beneficiosMensuales.push(beneficioTrimestral);
          sumaIntereses += beneficioTrimestral; // suma los intereses trimestrales
        }

        return { valorTotalTrimestral, beneficiosMensuales, sumaIntereses };
      case 3: // semestral
        const semestres = Math.round(diasNumerico / 180);
        const interesSemestral = valorCdt * (tasa / 100) * semestres;
        const valorTotalSemestral = valorCdt + interesSemestral;
        const beneficioSemestral = interesSemestral / semestres;
        beneficiosMensuales = [];
        sumaIntereses = 0;

        for (let i = 0; i < semestres; i++) {
          beneficiosMensuales.push(beneficioSemestral);
          sumaIntereses += beneficioSemestral; // suma los intereses semestrales
        }

        return { valorTotalSemestral, beneficiosMensuales, sumaIntereses };
      case 4: // anual
        const anos = Math.round(diasNumerico / 360);
        const interesAnual = valorCdt * (tasa / 100) * anos;
        const valorTotalAnual = valorCdt + interesAnual;
        const beneficioAnual = interesAnual / anos;
        beneficiosMensuales = [];
        sumaIntereses = 0;

        for (let i = 0; i < anos; i++) {
          beneficiosMensuales.push(beneficioAnual);
          sumaIntereses += beneficioAnual; // suma los intereses anuales
        }

        return { valorTotalAnual, beneficiosMensuales, sumaIntereses };
      default:
        return 0; // devuelve 0 si no se selecciona una periocidad
    }
  }

  calcularPeriocidadRendimientos(i: any, dias: any) {
    const periocidad = this.formularios[i].form.get('periocidad')?.value;
    const tasa = parseFloat(this.formularios[i].form.get('tasaFacial')?.value); // convertir a número
    let valorCdt = parseFloat(
      this.formularios[i].form.get('valorTitulo')?.value
    ); // convertir a número
    const diasNumerico = parseFloat(dias); // convertir a número
    let beneficiosMensuales: any = [];
    let valorCdtInicial;
    let sumaIntereses;
    let valorTotal: any;
    switch (periocidad) {
      case 1: // mensual
        const meses = Math.round(diasNumerico / 30);
        const tasaMensual = tasa / 100;
        valorCdtInicial = valorCdt;
        valorTotal = valorCdtInicial;
        beneficiosMensuales = [];
        sumaIntereses = 0;

        for (let i = 0; i < meses; i++) {
          const interes = valorTotal * tasaMensual;
          const beneficioMensual = interes;
          valorCdtInicial = valorCdt;
          valorTotal += beneficioMensual; // suma el beneficio mensual al valor total
          beneficiosMensuales.push(beneficioMensual);
          sumaIntereses += beneficioMensual; // suma los intereses mensuales
        }

        return { valorTotal, beneficiosMensuales, sumaIntereses };
      case 2: // trimestral
        const trimestres = Math.round(diasNumerico / 90);
        const tasaTrimestral = tasa / 100 / 4;
        valorCdtInicial = valorCdt;
        valorTotal = valorCdtInicial;
        beneficiosMensuales = [];
        sumaIntereses = 0;

        for (let i = 0; i < trimestres; i++) {
          const interesTrimestral = valorTotal * tasaTrimestral;
          const beneficioTrimestral = interesTrimestral;
          valorTotal += beneficioTrimestral; // suma el beneficio trimestral al valor total
          beneficiosMensuales.push(beneficioTrimestral);
          sumaIntereses += beneficioTrimestral; // suma los intereses trimestrales
        }

        return { valorTotal, beneficiosMensuales, sumaIntereses };

      case 3: // semestral
        const semestres = Math.round(diasNumerico / 180);
        const tasaSemestral = tasa / 100 / 2;
        valorCdtInicial = valorCdt;
        valorTotal = valorCdtInicial;
        beneficiosMensuales = [];
        sumaIntereses = 0;

        for (let i = 0; i < semestres; i++) {
          const interesSemestral = valorTotal * tasaSemestral;
          const beneficioSemestral = interesSemestral;
          valorTotal += beneficioSemestral; // suma el beneficio semestral al valor total
          beneficiosMensuales.push(beneficioSemestral);
          sumaIntereses += beneficioSemestral; // suma los intereses semestrales
        }

        return { valorTotal, beneficiosMensuales, sumaIntereses };

      case 4: // anual
        const anos = Math.round(diasNumerico / 360);
        const tasaAnual = tasa / 100;
        valorCdtInicial = valorCdt;
        valorTotal = valorCdtInicial;
        beneficiosMensuales = [];
        sumaIntereses = 0;

        for (let i = 0; i < anos; i++) {
          const interesAnual = valorTotal * tasaAnual;
          const beneficioAnual = interesAnual;
          valorTotal += beneficioAnual; // suma el beneficio anual al valor total
          beneficiosMensuales.push(beneficioAnual);
          sumaIntereses += beneficioAnual; // suma los intereses anuales
        }

        return { valorTotal, beneficiosMensuales, sumaIntereses };
      default:
        return 0; // devuelve 0 si no se selecciona una periocidad
    }
  }

  asignarBeneficiosMensuales(
    fechaEmision: any,
    dias: any,
    beneficiosMensuales: any,
    periodoBeneficios: 1 | 2 | 4 | 3
  ) {
    const meses: any = (dias / 30).toFixed(0);
    const nombresMeses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    const beneficiosAsignados = [];
    let frecuenciaBeneficios;
    switch (periodoBeneficios) {
      case 1:
        frecuenciaBeneficios = 1;
        break;
      case 2:
        frecuenciaBeneficios = 3;
        break;
      case 4:
        frecuenciaBeneficios = 12;
        break;
      case 3:
        frecuenciaBeneficios = 6;
        break;
      default:
        throw new Error('Período de beneficios no válido');
    }

    let fecha = new Date(fechaEmision);
    for (let i = 0; i < meses; i += frecuenciaBeneficios) {
      const mes = nombresMeses[fecha.getMonth()];
      const ano = fecha.getFullYear();
      const beneficioMensual =
        beneficiosMensuales[i % beneficiosMensuales.length];
      beneficiosAsignados.push({
        mes,
        ano,
        beneficioMensual,
      });
      fecha.setMonth(fecha.getMonth() + frecuenciaBeneficios);
    }

    return beneficiosAsignados;
  }

  calcularKapital(i: any, dias: any) {
    let valorCdt = parseFloat(
      this.formularios[i].form.get('valorTitulo')?.value
    );
    let tasa = parseFloat(this.formularios[i].form.get('tasaFacial')?.value);
    let periocidad = this.formularios[i].form.get('periocidad')?.value;

    let datoGanancias = valorCdt * (tasa / 100);
    let acumulado;
    let resultado = [];

    switch (periocidad) {
      case 1: // mensual
        let meses = Math.round(dias / 30);
        let beneficioMensual = datoGanancias;
        resultado.push({
          dato: 'mes',
          id: meses,
          valor: beneficioMensual,
        });
        beneficioMensual = beneficioMensual * 3;
        resultado.push({
          dato: 'mes',
          id: meses - 1,
          valor: beneficioMensual,
        });
        for (let i = meses - 2; i > 0; i--) {
          beneficioMensual = beneficioMensual + 20 * 1000000;
          resultado.push({
            dato: 'mes',
            id: i,
            valor: beneficioMensual,
          });
        }
        break;
      case 2: // trimestral
        let trimestres = Math.round(dias / 90);
        let beneficioTrimestral = datoGanancias;
        resultado.push({
          id: trimestres,
          dato: 'trimestre',
          valor: beneficioTrimestral,
        });
        beneficioTrimestral = beneficioTrimestral * 3;
        resultado.push({
          dato: 'trimestre',
          id: trimestres - 1,
          valor: beneficioTrimestral,
        });
        for (let i = trimestres - 2; i > 0; i--) {
          beneficioTrimestral = beneficioTrimestral + 20 * 1000000;
          resultado.push({
            dato: 'trimestre',
            id: i,
            valor: beneficioTrimestral,
          });
        }
        break;
      case 3: // semestral
        let semestres = Math.round(dias / 180);
        let beneficioSemestral = datoGanancias;
        resultado.push({
          dato: 'semestre',
          id: semestres,
          valor: beneficioSemestral,
        });
        beneficioSemestral = beneficioSemestral * 3;
        resultado.push({
          dato: 'semestre',
          id: semestres - 1,
          valor: beneficioSemestral,
        });
        for (let i = semestres - 2; i > 0; i--) {
          beneficioSemestral = beneficioSemestral + 20 * 1000000;
          resultado.push({
            dato: 'semestre',
            id: i,
            valor: beneficioSemestral,
          });
        }
        break;
      case 4: // anual
        let anos = Math.round(dias / 360);
        let beneficioAnual = datoGanancias;
        resultado.push({
          id: anos,
          dato: 'Año',
          valor: beneficioAnual,
        });
        beneficioAnual = beneficioAnual * 3;
        resultado.push({
          dato: 'Año',
          id: anos - 1,
          valor: beneficioAnual,
        });
        for (let i = anos - 2; i > 0; i--) {
          beneficioAnual = beneficioAnual + 20 * 1000000;
          resultado.push({
            dato: 'Año',
            id: i,
            valor: beneficioAnual,
          });
        }
        break;
    }

    return resultado;
  }

  calcularTasaPactada(i: any, dias: any, totalbeneficio: any) {
    const tasaPactada = this.formularios[i].form.get('tasaDFT')?.value;
    let valorCdt = parseFloat(
      this.formularios[i].form.get('valorTitulo')?.value
    );
    let beneficioTotal = totalbeneficio;
    let resultado = [];
    let acumulado;
    let interes;
    switch (this.formularios[i].form.get('periocidad')?.value) {
      case 1: // Mensual
        let meses = Math.round(dias / 30);
        console.log(beneficioTotal);
        acumulado = valorCdt;
        interes = 0;
        beneficioTotal = beneficioTotal;
        for (let j = 0; j < meses; j++) {
          interes = beneficioTotal * (tasaPactada / 100);
          acumulado = beneficioTotal + interes;
          resultado.push({
            mes: j + 1,
            valor: beneficioTotal,
            interes: interes,
            beneficioTotal: acumulado,
          });
          beneficioTotal = acumulado;
        }
        break;

      case 2: // Trimestral
        let trimestres = Math.round(dias / 90);
        console.log(beneficioTotal);
        acumulado = valorCdt;
        interes = 0;
        beneficioTotal = beneficioTotal;
        for (let j = 0; j < trimestres; j++) {
          interes = beneficioTotal * (tasaPactada / 100);
          acumulado = beneficioTotal + interes;
          resultado.push({
            mes: j + 1,
            valor: beneficioTotal,
            interes: interes,
            beneficioTotal: acumulado,
          });
          beneficioTotal = acumulado;
        }
        break;

      case 3: // Semestral
        let semestres = Math.round(dias / 180);
        console.log(beneficioTotal);
        acumulado = valorCdt;
        interes = 0;
        beneficioTotal = beneficioTotal;
        for (let j = 0; j < semestres; j++) {
          interes = beneficioTotal * (tasaPactada / 100);
          acumulado = beneficioTotal + interes;
          resultado.push({
            mes: j + 1,
            valor: beneficioTotal,
            interes: interes,
            beneficioTotal: acumulado,
          });
          beneficioTotal = acumulado;
        }
        break;

      case 4: // Anual
        let anios = Math.round(dias / 360);
        console.log(beneficioTotal);
        acumulado = valorCdt;
        interes = 0;
        beneficioTotal = beneficioTotal;
        for (let j = 0; j < anios; j++) {
          interes = beneficioTotal * (tasaPactada / 100);
          acumulado = beneficioTotal + interes;
          resultado.push({
            mes: j + 1,
            valor: beneficioTotal,
            interes: interes,
            beneficioTotal: acumulado,
          });
          beneficioTotal = acumulado;
        }
        break;

      default:
        break;
    }
    return resultado;
  }
  onChangeViewChange($event: any, i: any) {
    this.changeView[i] = $event.value;
  }
}
