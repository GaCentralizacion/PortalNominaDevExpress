import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisualizaPolizaEmpleadoComponent } from './visualiza-poliza-empleado.component';

const routes: Routes = [
  {
    path:'vistaEmpleado', component:VisualizaPolizaEmpleadoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisualizaPolizaEmpleadoRoutingModule { }
