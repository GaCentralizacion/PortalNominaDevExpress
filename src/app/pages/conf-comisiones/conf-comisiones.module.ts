import {NgModule} from '@angular/core';
import { TituloModule } from 'src/app/shared/components/titulo/titulo.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ConfComisionesComponent } from './conf-comisiones.component';
import { ConfComisionesRoutingModule } from './conf-comisiones-routing.module';
import { DxAccordionModule, DxButtonModule, DxDataGridModule, DxFormModule, DxPopupModule, DxSelectBoxModule, DxTabPanelModule } from 'devextreme-angular';

@NgModule({
    declarations:[ConfComisionesComponent],
    imports:[
        TituloModule,
        FlexLayoutModule,
        ConfComisionesRoutingModule,
        DxAccordionModule,
        DxSelectBoxModule,
        DxButtonModule,
        DxDataGridModule,
        DxFormModule,
        DxTabPanelModule,
        DxPopupModule
    ],
    exports:[]
})

export class ConfComisionesModule{}