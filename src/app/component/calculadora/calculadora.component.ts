import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { dataSeries } from './data';

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.component.html',
  styleUrls: ['./calculadora.component.scss'],
})
export class CaculadoraComponent implements OnInit {
  chartLabels: any = [];
  chartData: any = [];
  chartLabels1: any = [];
  chartData1: any = [
    {
      data: [
        10000000, 20000000, 30000000, 40000000, 50000000, 60000000, 70000000,
        80000000, 90000000, 100000000, 110000000, 120000000, 130000000,
        140000000, 150000000, 160000000, 170000000, 180000000, 190000000,
        200000000,
      ],
      label: '',
    },
  ];
  seleccionados: any = [];
  chartOptions = {
    responsive: true,
  };
  activeOptionButton = 'all';
  formularios: { form: FormGroup }[] = [];
  beneficiosAsignados: any[] = [];
  beneficiosAsignadosAcum: any[] = [];
  beneficiosTasaPactada: any[] = [];
  tablaKapital: any[] = [];
  totalesMesaMesIntereses: any = [];
  totalesMesaMesRendimientos: any = [];
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

  lista = [
    {
      mes: '1/01/2009"',
      ipc: '0,59%"',
    },
    {
      mes: '1/02/2009"',
      ipc: '1,43%"',
    },
    {
      mes: '1/03/2009"',
      ipc: '1,94%" ',
    },
    {
      mes: '1/04/2009"',
      ipc: '2,26%"',
    },
    {
      mes: '1/05/2009"',
      ipc: '2,28%"',
    },
    {
      mes: '1/06/2009"',
      ipc: '2,22%"',
    },
    {
      mes: '1/07/2009"',
      ipc: '2,18%"',
    },
    {
      mes: '1/08/2009"',
      ipc: '2,23%"',
    },
    {
      mes: '1/09/2009"',
      ipc: '2,12%"',
    },
    {
      mes: '1/10/2009"',
      ipc: '1.98%"',
    },
    {
      mes: '1/11/2009"',
      ipc: '1.92%"',
    },
    {
      mes: '1/12/2009"',
      ipc: '2.00%"',
    },
    {
      mes: '1/01/2010"',
      ipc: '0,69%"',
    },
    {
      mes: '1/02/2010"',
      ipc: '1,52%"',
    },
    {
      mes: '1/03/2010"',
      ipc: '1,77%"',
    },
    {
      mes: '1/04/2010"',
      ipc: '2,25%"',
    },
    {
      mes: '1/05/2010"',
      ipc: '2,35%"',
    },
    {
      mes: '1/06/2010"',
      ipc: '2,47%"',
    },
    {
      mes: '1/07/2010"',
      ipc: '2,42%"',
    },
    {
      mes: '1/08/2010"',
      ipc: '2,54%"',
    },
    {
      mes: '1/09/2010"',
      ipc: '2,4%"',
    },
    {
      mes: '1/10/2010"',
      ipc: '2,31%"',
    },
    {
      mes: '1/11/2010"',
      ipc: '2,51%"',
    },
    {
      mes: '1/12/2010"',
      ipc: '3,18%"',
    },
    {
      mes: '1/01/2011"',
      ipc: '0,9%"',
    },
    {
      mes: '1/02/2011"',
      ipc: '1,51%"',
    },
    {
      mes: '1/03/2011"',
      ipc: '1,79%"',
    },
    {
      mes: '1/04/2011"',
      ipc: '1,91%"',
    },
    {
      mes: '1/05/2011"',
      ipc: '2,19%"',
    },
    {
      mes: '1/06/2011"',
      ipc: '2,53%"',
    },
    {
      mes: '1/07/2011"',
      ipc: '2,67%"',
    },
    {
      mes: '1/08/2011"',
      ipc: '2,63%"',
    },
    {
      mes: '1/09/2011"',
      ipc: '2,96%"',
    },
    {
      mes: '1/10/2011"',
      ipc: '3,15%"',
    },
    {
      mes: '1/11/2011"',
      ipc: '3,29%"',
    },
    {
      mes: '1/12/2011"',
      ipc: '3,72%"',
    },
    {
      mes: '1/01/2012"',
      ipc: '0,73%"',
    },
    {
      mes: '1/02/2012"',
      ipc: '1,35%"',
    },
    {
      mes: '1/03/2012"',
      ipc: '1,47%"',
    },
    {
      mes: '1/04/2012"',
      ipc: '1,61%"',
    },
    {
      mes: '1/05/2012"',
      ipc: '1,91%"',
    },
    {
      mes: '1/06/2012"',
      ipc: '2,01%"',
    },
    {
      mes: '1/07/2012"',
      ipc: '1,98%"',
    },
    {
      mes: '1/08/2012"',
      ipc: '2,02%"',
    },
    {
      mes: '1/09/2012"',
      ipc: '2,32%"',
    },
    {
      mes: '1/10/2012"',
      ipc: '2,48%"',
    },
    {
      mes: '1/11/2012"',
      ipc: '2,35%"',
    },
    {
      mes: '1/12/2012"',
      ipc: '2,44%"',
    },
    {
      mes: '1/01/2013"',
      ipc: '0,3%"',
    },
    {
      mes: '1/02/2013"',
      ipc: '0,74%"',
    },
    {
      mes: '1/03/2013"',
      ipc: '0,95%"',
    },
    {
      mes: '1/04/2013"',
      ipc: '1,2%"',
    },
    {
      mes: '1/05/2013"',
      ipc: '1,48%"',
    },
    {
      mes: '1/06/2013"',
      ipc: '1,73%"',
    },
    {
      mes: '1/07/2013"',
      ipc: '1,77%"',
    },
    {
      mes: '1/08/2013"',
      ipc: '1,85%"',
    },
    {
      mes: '1/09/2013"',
      ipc: '2,16%"',
    },
    {
      mes: '1/10/2013"',
      ipc: '1,89%"',
    },
    {
      mes: '1/11/2013"',
      ipc: '1,66%"',
    },
    {
      mes: '1/12/2013"',
      ipc: '1,93%"',
    },
    {
      mes: '1/01/2014"',
      ipc: '0,49%"',
    },
    {
      mes: '1/02/2014"',
      ipc: '1,12%"',
    },
    {
      mes: '1/03/2014"',
      ipc: '1,52%"',
    },
    {
      mes: '1/04/2014"',
      ipc: '1,98%"',
    },
    {
      mes: '1/05/2014"',
      ipc: '2,48%"',
    },
    {
      mes: '1/06/2014"',
      ipc: '2,57%"',
    },
    {
      mes: '1/07/2014"',
      ipc: '2,73%"',
    },
    {
      mes: '1/08/2014"',
      ipc: '2,94%"',
    },
    {
      mes: '1/09/2014"',
      ipc: '3,08%"',
    },
    {
      mes: '1/10/2014"',
      ipc: '3,25%"',
    },
    {
      mes: '1/11/2014"',
      ipc: '3,39%"',
    },
    {
      mes: '1/12/2014"',
      ipc: '3,66%"',
    },
    {
      mes: '1/01/2015"',
      ipc: '0,64%"',
    },
    {
      mes: '1/02/2015"',
      ipc: '1,8%"',
    },
    {
      mes: '1/03/2015"',
      ipc: '2,4%"',
    },
    {
      mes: '1/04/2015"',
      ipc: '2,95%"',
    },
    {
      mes: '1/05/2015"',
      ipc: '3,22%"',
    },
    {
      mes: '1/06/2015"',
      ipc: '3,33%"',
    },
    {
      mes: '1/07/2015"',
      ipc: '3,52%"',
    },
    {
      mes: '1/08/2015"',
      ipc: '4,02%"',
    },
    {
      mes: '1/09/2015"',
      ipc: '4,76%"',
    },
    {
      mes: '1/10/2015"',
      ipc: '5,47%"',
    },
    {
      mes: '1/11/2015"',
      ipc: '6,11%"',
    },
    {
      mes: '1/12/2015"',
      ipc: '6,77%"',
    },
    {
      mes: '1/01/2016"',
      ipc: '1,49%"',
    },
    {
      mes: '1/02/2016"',
      ipc: '2,59%"',
    },
    {
      mes: '1/03/2016"',
      ipc: '3,55%"',
    },
    {
      mes: '1/04/2016"',
      ipc: '4,07%"',
    },
    {
      mes: '1/05/2016"',
      ipc: '4,6%"',
    },
    {
      mes: '1/06/2016"',
      ipc: '5.65%"',
    },
    {
      mes: '1/07/2016"',
      ipc: '5,65%"',
    },
    {
      mes: '1/08/2016"',
      ipc: '5,31%"',
    },
    {
      mes: '1/09/2016"',
      ipc: '5,25%"',
    },
    {
      mes: '1/10/2016"',
      ipc: '5,31%"',
    },
    {
      mes: '1/11/2016"',
      ipc: '5,31%"',
    },
    {
      mes: '1/12/2016"',
      ipc: '5,75%"',
    },
    {
      mes: '1/01/2017"',
      ipc: '1,02%"',
    },
    {
      mes: '1/02/2017"',
      ipc: '2,04%"',
    },
    {
      mes: '1/03/2017"',
      ipc: '2,5%"',
    },
    {
      mes: '1/04/2017"',
      ipc: '3%"',
    },
    {
      mes: '1/05/2017"',
      ipc: '3,23%"',
    },
    {
      mes: '1/06/2017"',
      ipc: '3,35%"',
    },
    {
      mes: '1/07/2017"',
      ipc: '3,3%"',
    },
    {
      mes: '1/08/2017"',
      ipc: '3,44%"',
    },
    {
      mes: '1/09/2017"',
      ipc: '3,49%"',
    },
    {
      mes: '1/10/2017"',
      ipc: '3,5%"',
    },
    {
      mes: '1/11/2017"',
      ipc: '3,69%"',
    },
    {
      mes: '1/12/2017"',
      ipc: '4,09%"',
    },
    {
      mes: '1/01/2018"',
      ipc: '0,63%"',
    },
    {
      mes: '1/02/2018"',
      ipc: '1,34%"',
    },
    {
      mes: '1/03/2018"',
      ipc: '1,58%"',
    },
    {
      mes: '1/04/2018"',
      ipc: '2,05%"',
    },
    {
      mes: '1/05/2018"',
      ipc: '2,31%"',
    },
    {
      mes: '1/06/2018"',
      ipc: '2,47%"',
    },
    {
      mes: '1/07/2018"',
      ipc: '2,34%"',
    },
    {
      mes: '1/08/2018"',
      ipc: '2,46%"',
    },
    {
      mes: '1/09/2018"',
      ipc: '2,63%"',
    },
    {
      mes: '1/10/2018"',
      ipc: '2,75%"',
    },
    {
      mes: '1/11/2018"',
      ipc: '2,87%"',
    },
    {
      mes: '1/12/2018"',
      ipc: '3,18%"',
    },
    {
      mes: '1/01/2019"',
      ipc: '0,6%"',
    },
    {
      mes: '1/02/2019"',
      ipc: '1,18%"',
    },
    {
      mes: '1/03/2019"',
      ipc: '1,62%"',
    },
    {
      mes: '1/04/2019"',
      ipc: '2,12%"',
    },
    {
      mes: '1/05/2019"',
      ipc: '2,44%"',
    },
    {
      mes: '1/06/2019"',
      ipc: '2,71%"',
    },
    {
      mes: '1/07/2019"',
      ipc: '2,94%"',
    },
    {
      mes: '1/08/2019"',
      ipc: '3,03%"',
    },
    {
      mes: '1/09/2019"',
      ipc: '3,26%"',
    },
    {
      mes: '1/10/2019"',
      ipc: '3,43%"',
    },
    {
      mes: '1/11/2019"',
      ipc: '3,54%"',
    },
    {
      mes: '1/12/2019"',
      ipc: '3,8%"',
    },
    {
      mes: '1/01/2020"',
      ipc: '3,62%"',
    },
    {
      mes: '1/02/2020"',
      ipc: '3,72%"',
    },
    {
      mes: '1/03/2020"',
      ipc: '3,86%"',
    },
    {
      mes: '1/04/2020"',
      ipc: '3,51%"',
    },
    {
      mes: '1/05/2020"',
      ipc: '2,85%"',
    },
    {
      mes: '1/06/2020"',
      ipc: '2,19%"',
    },
    {
      mes: '1/07/2020"',
      ipc: '1,97%"',
    },
    {
      mes: '1/08/2020"',
      ipc: '1,88%"',
    },
    {
      mes: '1/09/2020"',
      ipc: '1,97%"',
    },
    {
      mes: '1/10/2020"',
      ipc: '1,75%"',
    },
    {
      mes: '1/11/2020"',
      ipc: '1,49%"',
    },
    {
      mes: '1/12/2020"',
      ipc: '1,61%"',
    },
    {
      mes: '1/01/2021"',
      ipc: '1,6%"',
    },
    {
      mes: '1/02/2021"',
      ipc: '1,56%"',
    },
    {
      mes: '1/03/2021"',
      ipc: '1,51%"',
    },
    {
      mes: '1/04/2021"',
      ipc: '1,95%"',
    },
    {
      mes: '1/05/2021"',
      ipc: '3,3%"',
    },
    {
      mes: '1/06/2021"',
      ipc: '3,63%"',
    },
    {
      mes: '1/07/2021"',
      ipc: '3,97%"',
    },
    {
      mes: '1/08/2021"',
      ipc: '4,44%"',
    },
    {
      mes: '1/09/2021"',
      ipc: '4,51%"',
    },
    {
      mes: '1/10/2021"',
      ipc: '4,58%"',
    },
    {
      mes: '1/11/2021"',
      ipc: '5,26%"',
    },
    {
      mes: '1/12/2021"',
      ipc: '5,62%"',
    },
    {
      mes: '1/01/2022"',
      ipc: '6,94%"',
    },
    {
      mes: '1/02/2022"',
      ipc: '8,01%"',
    },
    {
      mes: '1/03/2022"',
      ipc: '8,53%"',
    },
    {
      mes: '1/04/2022"',
      ipc: '9,23%"',
    },
    {
      mes: '1/05/2022"',
      ipc: '9,07%"',
    },
    {
      mes: '1/06/2022"',
      ipc: '9,67%"',
    },
    {
      mes: '1/07/2022"',
      ipc: '10,21%"',
    },
    {
      mes: '1/08/2022"',
      ipc: '10,84%"',
    },
    {
      mes: '1/09/2022"',
      ipc: '11,44%"',
    },
    {
      mes: '1/10/2022"',
      ipc: '12,22%"',
    },
    {
      mes: '1/11/2022"',
      ipc: '12,53%"',
    },
    {
      mes: '1/12/2022"',
      ipc: '13,12%"',
    },
    {
      mes: '1/01/2023"',
      ipc: '13,25%"',
    },
    {
      mes: '1/02/2023"',
      ipc: '13,28%"',
    },
    {
      mes: '1/03/2023"',
      ipc: '13,34%"',
    },
    {
      mes: '1/04/2023"',
      ipc: '12,82%"',
    },
    {
      mes: '1/05/2023"',
      ipc: '12,36%"',
    },
    {
      mes: '1/06/2023"',
      ipc: '12,13%"',
    },
    {
      mes: '1/07/2023"',
      ipc: '11,78%"',
    },
    {
      mes: '1/08/2023"',
      ipc: '11.43%"',
    },
    {
      mes: '1/09/2023"',
      ipc: '10,49%"',
    },
    {
      mes: '1/10/2023"',
      ipc: '8,27%"',
    },
    {
      mes: '1/11/2023"',
      ipc: '8,78%"',
    },
    {
      mes: '1/12/2023"',
      ipc: '9,28%"',
    },
    {
      mes: '1/01/2024"',
      ipc: '8,35%"',
    },
    {
      mes: '1/02/2024"',
      ipc: '2,01%"',
    },
    {
      mes: '1/03/2024"',
      ipc: '2,73%"',
    },
    {
      mes: '1/04/2024"',
      ipc: '3,34%"',
    },
    {
      mes: '1/05/2024"',
      ipc: '3,78%"',
    },
    {
      mes: '1/06/2024"',
      ipc: '4,12%"',
    },
    {
      mes: '1/07/2024"',
      ipc: '4,32%"',
    },
    {
      mes: '1/08/2024"',
      ipc: '4,33%"',
    },
    {
      mes: '1/09/2024"',
      ipc: '4,58%"',
    },
    {
      mes: '1/10/2024"',
      ipc: '5,4%"',
    },
    {
      mes: '1/11/2024"',
      ipc: '4,72%"',
    },
    {
      mes: '1/12/2024"',
      ipc: '4,94%"',
    },
    {
      mes: '1/01/2025"',
      ipc: '5,22%"',
    },
    {
      mes: '1/02/2025"',
      ipc: '2,08%"',
    },
    {
      mes: '1/03/2025"',
      ipc: '3,74%"',
    },
    {
      mes: '1/04/2025"',
      ipc: '3,3%"',
    },
    {
      mes: '1/05/2025"',
      ipc: '3,63%"',
    },
    {
      mes: '1/06/2025"',
      ipc: '3,74%"',
    },
  ];
  constructor(private router: Router, private fb: FormBuilder) {}

  cambiarVista(index: number) {
    this.changeView[index] = !this.changeView[index];
  }

  ngOnInit(): void {
    this.agregarExperienciaPeriodo();
    this.changeView = new Array(this.formularios.length).fill(true);
  }

  agregarExperienciaPeriodo() {
    const nuevoFormPeriodos: any = this.fb.group({
      idTipoTitulo: ['', Validators.required],
      fechaEmision: ['', Validators.required],
      fechaVcto: ['', Validators.required],
      periocidad: ['', Validators.required],
      tipoTasa: ['', Validators.required],
      tasaDFT: ['', Validators.required],
      tasaFacial: ['', Validators.required],
      valorTitulo: ['', Validators.required],
      meses: ['', Validators.required],
      anios: [0],
      total: [''],
      totalAcumulado: [''],
      id: Math.random().toString(36).substr(2, 9), // agregar un id único
    });
    this.formularios.push({ form: nuevoFormPeriodos });
  }
  deleteExperienciaPeriodo(index: number) {
    this.formularios.splice(index, 1);
  }

  seleccionarFormulario(index: number) {
    if (this.seleccionados.includes(index)) {
      this.seleccionados.splice(this.seleccionados.indexOf(index), 1);
      this.chartData1 = this.chartData1.filter(
        (dataset: any) => dataset.label !== `Beneficio Mensual ${index}`
      );
    } else {
      this.seleccionados.push(index);
      const tablaBeneficios = this.beneficiosAsignados[index];
      this.chartData1.push({
        data: tablaBeneficios.map(
          (beneficio: any) => beneficio.beneficioMensual
        ),
        label: `Beneficio Mensual ${index}`,
      });
      this.chartLabels1 = tablaBeneficios.map(
        (beneficio: any) => `${beneficio.mes} ${beneficio.ano}`
      );
    }
    console.log(this.chartData1, this.chartLabels1);
  }

  calcular(i: any) {
    const formularioActual = this.formularios[i];
    const formularioExistente = localStorage.getItem('formulario');
    let fechaActual: Date;
    let fechaBeneficio: Date;

    if (formularioExistente) {
      const formulariosGuardados: any[] = JSON.parse(formularioExistente);
      const formularioExistenteEnGuardados = formulariosGuardados.find(
        (formulario: any) =>
          formulario.form.id === formularioActual.form.get('id')?.value
      );

      if (formularioExistenteEnGuardados?.form) {
        formularioExistenteEnGuardados.form.value = formularioActual.form.value;
        localStorage.setItem(
          'formulario',
          JSON.stringify(formulariosGuardados)
        );
      } else {
        formulariosGuardados.push({
          form: formularioActual.form.getRawValue(),
        });
        localStorage.setItem(
          'formulario',
          JSON.stringify(formulariosGuardados)
        );
      }
    } else {
      const nuevoFormulario = { form: formularioActual.form.getRawValue() };
      localStorage.setItem('formulario', JSON.stringify([nuevoFormulario]));
    }
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
      console.log(totalMesaMesRendmiento, totalesMesaMes);
      this.totalesMesaMesRendimientos.push(
        totalMesaMesRendmiento.sumaIntereses.toLocaleString('es-ES', {
          minimumFractionDigits: 2,
        })
      );
      let tablaBeneficiosAcumulados: any = this.asignarBeneficiosMensuales(
        formulario.get('fechaEmision')?.value,
        dias,
        totalMesaMesRendmiento.beneficiosMensuales,
        formulario.get('periocidad')?.value
      );
      console.log(tablaBeneficiosAcumulados);
      let tablaBeneficios: any = this.asignarBeneficiosMensuales(
        formulario.get('fechaEmision')?.value,
        dias,
        totalesMesaMes.beneficiosMensuales,
        formulario.get('periocidad')?.value
      );
      console.log(tablaBeneficios);

      const meses: any = {
        Enero: '01',
        Febrero: '02',
        Marzo: '03',
        Abril: '04',
        Mayo: '05',
        Junio: '06',
        Julio: '07',
        Agosto: '08',
        Septiembre: '09',
        Octubre: '10',
        Noviembre: '11',
        Diciembre: '12',
      };
      if (this.formularios[i].form.get('tipoTasa')?.value === 2) {
        tablaBeneficiosAcumulados.forEach((beneficio: any) => {
          const mes = meses[beneficio.mes];
          const ano = beneficio.ano;
          const beneficioMensual = beneficio.beneficioMensual;

          const ipc = this.lista.find((item) => {
            const fecha = item.mes.replace('"', '');
            const [dia, mesLista, anoLista] = fecha.split('/');
            return mesLista === mes.toString() && anoLista === ano.toString();
          });
          let ipcValor: any = 0;
          if (ipc) {
            ipcValor = ipc.ipc
              .replace(/"$/, '')
              .replace('%', '')
              .replace(',', '.');
          } else {
            fechaActual = new Date();
            fechaBeneficio = new Date(`${ano}-${mes}-01`);
            if (fechaBeneficio > fechaActual) {
              ipcValor = 3;
            }
          }
          ipcValor = parseFloat(ipcValor);
          const tasa = parseFloat(
            this.formularios[i].form.get('tasaFacial')?.value
          );
          console.log(ipcValor, tasa);
          const valorCdt = parseFloat(
            this.formularios[i].form.get('valorTitulo')?.value
          );
          let suma: any;
          if (
            beneficioMensual ===
              tablaBeneficiosAcumulados[0].beneficioMensual &&
            fechaBeneficio > fechaActual
          ) {
            suma = tasa.toFixed(2); // Agrega un valor adicional de 0.5
          } else {
            suma = (
              tasa -
              parseFloat(this.formularios[i].form.get('tasaDFT')?.value) +
              ipcValor
            ).toFixed(2);
          }
          const resultado = (valorCdt * parseFloat(suma)) / 4;
          const interes = resultado - beneficioMensual; // Calcula el interés
          tablaBeneficiosAcumulados[
            tablaBeneficiosAcumulados.indexOf(beneficio)
          ].beneficioMensual = resultado;
          tablaBeneficiosAcumulados[
            tablaBeneficiosAcumulados.indexOf(beneficio)
          ].interes = interes; // Agrega el interés a la tabla
        });
        console.log(tablaBeneficiosAcumulados);
        tablaBeneficios = tablaBeneficiosAcumulados;

        // Suma los intereses
        const sumaIntereses = tablaBeneficiosAcumulados.reduce(
          (a: any, b: any) => a + b.interes,
          0
        );
        this.totalesMesaMesIntereses.push(
          sumaIntereses.toLocaleString('es-ES', {
            minimumFractionDigits: 2,
          })
        );
        let total: any =
          sumaIntereses + this.formularios[i].form.get('valorTitulo')?.value;
        this.formularios[i].form
          .get('total')
          ?.setValue(
            total.toLocaleString('es-ES', { minimumFractionDigits: 2 })
          );
      }
      // this.beneficiosAsignadosAcum = tablaBeneficiosAcumulados;
      if (this.beneficiosAsignados[i]) {
        this.beneficiosAsignados[i] = tablaBeneficios;
      } else {
        this.beneficiosAsignados.push(tablaBeneficios);
      }
      if (this.chartLabels[i]) {
        this.chartLabels[i] = tablaBeneficios.map(
          (beneficio: any) => `${beneficio.mes} ${beneficio.ano}`
        );
      } else {
        this.chartLabels.push(
          tablaBeneficios.map(
            (beneficio: any) => `${beneficio.mes} ${beneficio.ano}`
          )
        );
      }

      if (this.chartData[i]) {
        this.chartData[i] = [
          {
            data: tablaBeneficios.map(
              (beneficio: any) => beneficio.beneficioMensual
            ),
            label: 'Beneficio Mensual',
          },
        ];
      } else {
        this.chartData.push([
          {
            data: tablaBeneficios.map(
              (beneficio: any) => beneficio.beneficioMensual
            ),
            label: 'Beneficio Mensual',
          },
        ]);
      }
      console.log(this.chartData, this.chartLabels);
      this.flipped[i] = !this.flipped[i];
    }
  }

  comparar() {}
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

  obtenerMeses(fechaEmision: any, fechaVencimiento: any) {
    const meses = [];
    let fecha = new Date(fechaEmision);
    while (fecha <= fechaVencimiento) {
      meses.push(new Date(fecha));
      fecha.setMonth(fecha.getMonth() + 1);
    }
    return meses;
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
    console.log(datoGanancias);
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

  // calcularTasaPactada(i: any, dias: any, totalbeneficio: any) {
  //   const tasaPactada = this.formularios[i].form.get('tasaDFT')?.value;
  //   let valorCdt = parseFloat(
  //     this.formularios[i].form.get('valorTitulo')?.value
  //   );
  //   let beneficioTotal = totalbeneficio;
  //   let resultado = [];
  //   let acumulado;
  //   let interes;
  //   switch (this.formularios[i].form.get('periocidad')?.value) {
  //     case 1: // Mensual
  //       let meses = Math.round(dias / 30);
  //       console.log(beneficioTotal);
  //       acumulado = valorCdt;
  //       interes = 0;
  //       beneficioTotal = beneficioTotal;
  //       for (let j = 0; j < meses; j++) {
  //         interes = beneficioTotal * (tasaPactada / 100);
  //         acumulado = beneficioTotal + interes;
  //         resultado.push({
  //           mes: j + 1,
  //           valor: beneficioTotal,
  //           interes: interes,
  //           beneficioTotal: acumulado,
  //         });
  //         beneficioTotal = acumulado;
  //       }
  //       break;

  //     case 2: // Trimestral
  //       let trimestres = Math.round(dias / 90);
  //       console.log(beneficioTotal);
  //       acumulado = valorCdt;
  //       interes = 0;
  //       beneficioTotal = beneficioTotal;
  //       for (let j = 0; j < trimestres; j++) {
  //         interes = beneficioTotal * (tasaPactada / 100);
  //         acumulado = beneficioTotal + interes;
  //         resultado.push({
  //           mes: j + 1,
  //           valor: beneficioTotal,
  //           interes: interes,
  //           beneficioTotal: acumulado,
  //         });
  //         beneficioTotal = acumulado;
  //       }
  //       break;

  //     case 3: // Semestral
  //       let semestres = Math.round(dias / 180);
  //       console.log(beneficioTotal);
  //       acumulado = valorCdt;
  //       interes = 0;
  //       beneficioTotal = beneficioTotal;
  //       for (let j = 0; j < semestres; j++) {
  //         interes = beneficioTotal * (tasaPactada / 100);
  //         acumulado = beneficioTotal + interes;
  //         resultado.push({
  //           mes: j + 1,
  //           valor: beneficioTotal,
  //           interes: interes,
  //           beneficioTotal: acumulado,
  //         });
  //         beneficioTotal = acumulado;
  //       }
  //       break;

  //     case 4: // Anual
  //       let anios = Math.round(dias / 360);
  //       console.log(beneficioTotal);
  //       acumulado = valorCdt;
  //       interes = 0;
  //       beneficioTotal = beneficioTotal;
  //       for (let j = 0; j < anios; j++) {
  //         interes = beneficioTotal * (tasaPactada / 100);
  //         acumulado = beneficioTotal + interes;
  //         resultado.push({
  //           mes: j + 1,
  //           valor: beneficioTotal,
  //           interes: interes,
  //           beneficioTotal: acumulado,
  //         });
  //         beneficioTotal = acumulado;
  //       }
  //       break;

  //     default:
  //       break;
  //   }
  //   return resultado;
  // }
  onChangeViewChange($event: any, i: any) {
    this.changeView[i] = $event.value;
  }

  exportExcel(i: any) {
    const datos = this.beneficiosAsignados[i];

    // Crear una hoja de Excel
    const hoja = XLSX.utils.json_to_sheet(datos);

    // Configurar el ancho de las columnas
    const anchoColumnas = [{ wch: 10 }, { wch: 10 }, { wch: 20 }, { wch: 20 }];
    hoja['!cols'] = anchoColumnas;

    // Configurar estilo de los encabezados
    for (let i = 0; i < hoja['!cols'].length; i++) {
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
    if (hoja['!rows']) {
      for (let i = 1; i < hoja['!rows'].length; i++) {
        for (let j = 0; j < hoja['!cols'].length; j++) {
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
    }

    // Crear un libro de Excel y agregar la hoja
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Tabla');

    // Descargar el archivo Excel
    XLSX.writeFile(libro, 'tabla.xlsx');
  }
}
