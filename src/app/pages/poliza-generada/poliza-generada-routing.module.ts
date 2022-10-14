import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PolizaGeneradaComponent } from './poliza-generada.component';

const routes: Routes = [
  {path:'consultaGeneradas', component:PolizaGeneradaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolizaGeneradaRoutingModule { }
