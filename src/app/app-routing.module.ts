import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IngresosComponent } from './component/ingresos/ingresos.component';
import { GastosComponent } from './component/gastos/gastos.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { PruebaComponent } from './component/prueba/prueba.component';
import { CaculadoraComponent } from './component/calculadora/calculadora.component';
import { BasegeneralComponent } from './component/pages/basegeneral/basegeneral.component';




const routes: Routes = [
    {path: "ingresos", component: IngresosComponent},
    {path: "gastos", component: GastosComponent},
    {path: "", component: GastosComponent},
    {path: "tabla", component: BasegeneralComponent},


]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }