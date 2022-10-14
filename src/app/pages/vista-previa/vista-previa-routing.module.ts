import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaPreviaComponent } from './vista-previa.component';

const routes: Routes = [
  {
    path:'previa', component:VistaPreviaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VistaPreviaRoutingModule { }
