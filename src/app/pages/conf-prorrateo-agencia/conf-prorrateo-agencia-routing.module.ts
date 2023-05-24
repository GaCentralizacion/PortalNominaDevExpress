
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfProrrateoAgenciaComponent } from './conf-prorrateo-agencia.component';

const routes: Routes=[
    {path:'configura', component: ConfProrrateoAgenciaComponent}
]

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [RouterModule]
})

export class ConfProrrateoAgenciaRoutingModule {}