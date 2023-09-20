import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ConfPagaComponent } from "./conf-pagas.component";

const routes:Routes = [
    {path:'confPaga',component:ConfPagaComponent}
]

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class ConfPagasRoutingModule{}