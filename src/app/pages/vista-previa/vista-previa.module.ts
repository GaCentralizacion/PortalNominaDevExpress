import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VistaPreviaRoutingModule } from './vista-previa-routing.module';
import { VistaPreviaComponent } from './vista-previa.component';
import { TituloModule } from 'src/app/shared/components/titulo/titulo.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DxButtonModule, DxDataGridModule, DxDropDownBoxModule, DxLoadIndicatorModule, DxLoadPanelModule, DxPivotGridModule, DxPopupModule, DxSelectBoxModule, DxSwitchModule, DxTemplateModule } from 'devextreme-angular';


@NgModule({
  declarations: [
    VistaPreviaComponent
  ],
  imports: [
    CommonModule,
    VistaPreviaRoutingModule,
    FlexLayoutModule,
    DxSelectBoxModule,
    DxDataGridModule,
    DxPopupModule,
    DxButtonModule,
    DxTemplateModule,
    DxSwitchModule,
    DxPivotGridModule,
    DxLoadIndicatorModule,
    DxLoadPanelModule,
    DxDropDownBoxModule,
    TituloModule
  ]
})
export class VistaPreviaModule { }
