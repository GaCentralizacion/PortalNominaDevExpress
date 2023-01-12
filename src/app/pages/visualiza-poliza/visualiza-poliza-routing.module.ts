import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisualizaPolizaComponent } from './visualiza-poliza.component';

const routes: Routes = [
  {
    path:'vista', component:VisualizaPolizaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisualizaPolizaRoutingModule { }
