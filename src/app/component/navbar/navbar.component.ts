import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  titulo:string = ''
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.titulo = ''
  }

  irAIngresos() {
    this.titulo = 'Ingresos'
    localStorage.setItem('ruta','ingresos')
    this.router.navigate(['/ingresos']);
  }

  irAGastos() {
    localStorage.setItem('ruta','gastos')
    this.titulo = 'Gastos'
    this.router.navigate(['/gastos']);
  }

  irAReservar() {
    this.titulo = 'Reservas'
    localStorage.setItem('ruta','reservas')
    this.router.navigate(['/gastos']);
  }

  irACuentasPorPagar() {
    this.titulo = 'Cuentas por pagar'
    localStorage.setItem('ruta','cuentas')
    this.router.navigate(['/gastos']);
  }
}
