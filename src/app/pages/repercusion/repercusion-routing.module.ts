
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RepercusionComponent } from './repercusion.component';

const routes: Routes=[
    {path:'repercusion', component: RepercusionComponent}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class RepercusionRoutingModule{}