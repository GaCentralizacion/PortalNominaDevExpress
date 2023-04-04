import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { VisualizaPolizaEmpleadoRoutingModule } from './visualiza-poliza-empleado-routing.module';
import { DxButtonModule, DxDataGridModule, DxPopupModule, DxSelectBoxModule, DxTemplateModule,DxLoadIndicatorModule, DxLoadPanelModule, DxSwitchModule, DxPivotGridModule, DxDropDownBoxModule} from 'devextreme-angular';
import { VisualizaPolizaEmpleadoComponent } from './visualiza-poliza-empleado.component';
import { TituloModule } from 'src/app/shared/components/titulo/titulo.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import {  } from 'devextreme-angular/ui/load-indicator';


@NgModule({
  declarations: [
    VisualizaPolizaEmpleadoComponent
  ],
  imports: [
    CommonModule,
    VisualizaPolizaEmpleadoRoutingModule,
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
    DxPivotGridModule
  ],
  providers:[
    CurrencyPipe
  ]
})
export class VisualizaPolizaEmpleadoModule { }
