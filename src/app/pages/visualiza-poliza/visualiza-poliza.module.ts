import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { VisualizaPolizaRoutingModule } from './visualiza-poliza-routing.module';
import { DxButtonModule, DxDataGridModule, DxPopupModule, DxSelectBoxModule, DxTemplateModule,DxLoadIndicatorModule, DxLoadPanelModule, DxSwitchModule, DxPivotGridModule, DxDropDownBoxModule, DxFormModule} from 'devextreme-angular';
import { VisualizaPolizaComponent } from './visualiza-poliza.component';
import { TituloModule } from 'src/app/shared/components/titulo/titulo.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import {  } from 'devextreme-angular/ui/load-indicator';


@NgModule({
  declarations: [
    VisualizaPolizaComponent
  ],
  imports: [
    CommonModule,
    VisualizaPolizaRoutingModule,
    TituloModule,
    DxSelectBoxModule,
    DxDataGridModule,
    DxPopupModule,
    DxButtonModule,
    DxTemplateModule,
    FlexLayoutModule,
    DxLoadIndicatorModule,
    DxLoadPanelModule,
    DxSwitchModule,
    DxDropDownBoxModule,
    DxPivotGridModule,
    DxFormModule
  ],
  providers:[
    CurrencyPipe
  ],
  exports:[
    VisualizaPolizaComponent
  ]
})
export class VisualizaPolizaModule { }
