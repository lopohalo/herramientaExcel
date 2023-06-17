import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IngresosComponent } from './component/ingresos/ingresos.component';
import { GastosComponent } from './component/gastos/gastos.component';




const routes: Routes = [
    {path: "ingresos", component: IngresosComponent},
    {path: "", component: GastosComponent},

]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }