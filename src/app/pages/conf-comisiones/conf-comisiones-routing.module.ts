import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfComisionesComponent } from './conf-comisiones.component';

const routes: Routes=[
    {path:'configuraComision', component: ConfComisionesComponent}
]

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [RouterModule]
})

export class ConfComisionesRoutingModule {}