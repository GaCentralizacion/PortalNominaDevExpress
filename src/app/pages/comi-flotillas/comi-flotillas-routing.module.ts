import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComiFlotillasComponent } from './comi-flotillas.component';

const routes: Routes=[
    {path:'floti', component: ComiFlotillasComponent}
]

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [RouterModule]
})

export class ComiFlotillasRoutingModule {}