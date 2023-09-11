import {NgModule} from '@angular/core';
import { ConfProrrateoAgenciaComponent } from './conf-prorrateo-agencia.component';
import { TituloModule } from 'src/app/shared/components/titulo/titulo.module';
import { ConfProrrateoAgenciaRoutingModule } from './conf-prorrateo-agencia-routing.module';
import { DxButtonModule, DxDataGridModule, DxLoadPanelModule, DxNumberBoxModule, DxPopupModule, DxSelectBoxModule, DxSwitchModule } from 'devextreme-angular';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    declarations:[ConfProrrateoAgenciaComponent],
    imports:[
        TituloModule,
        DxPopupModule,
        DxDataGridModule,
        ConfProrrateoAgenciaRoutingModule,
        FlexLayoutModule,
        DxLoadPanelModule,
        DxButtonModule,
        DxSelectBoxModule,
        DxNumberBoxModule,
        DxSwitchModule
    ],
    exports:[]
})
export class ConfProrrateoAgenciaModule { }
