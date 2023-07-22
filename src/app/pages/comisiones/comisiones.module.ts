import {NgModule} from '@angular/core';
import { TituloModule } from 'src/app/shared/components/titulo/titulo.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ComisionesComponent } from './comisiones.component';
import { ComisionesRoutingModule } from './comisiones-routing.module';
import { DxAccordionModule, DxButtonModule, DxDataGridModule, DxFormModule, DxSelectBoxModule, DxTabPanelModule } from 'devextreme-angular';

@NgModule({
    declarations:[ComisionesComponent],
    imports:[
        TituloModule,
        FlexLayoutModule,
        ComisionesRoutingModule,
        DxAccordionModule,
        DxSelectBoxModule,
        DxButtonModule,
        DxDataGridModule,
        DxFormModule,
        DxTabPanelModule
    ],
    exports:[]
})

export class ComisionesModule{}