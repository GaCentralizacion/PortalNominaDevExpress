import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ConfProrrateoNominaComponent } from "./conf-prorrateo-nomina.component";


const routes: Routes=[
    {path:'prorraNomina', component: ConfProrrateoNominaComponent}
]

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [RouterModule]
})

export class ConfProrrateoNominaRoutingModule {}