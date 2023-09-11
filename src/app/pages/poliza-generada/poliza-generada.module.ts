import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PolizaGeneradaRoutingModule } from './poliza-generada-routing.module';
import { PolizaGeneradaComponent } from './poliza-generada.component';
import { DxButtonModule, DxDataGridModule, DxLoadIndicatorModule, DxLoadPanelModule, DxPopupModule, DxSelectBoxModule, DxTemplateModule, DxToolbarModule } from 'devextreme-angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TituloModule } from 'src/app/shared/components/titulo/titulo.module';


@NgModule({
  declarations: [PolizaGeneradaComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    PolizaGeneradaRoutingModule,
    DxSelectBoxModule,
    DxDataGridModule,
    DxPopupModule,
    DxButtonModule,
    DxTemplateModule,
    TituloModule,
    DxLoadIndicatorModule,
    DxLoadPanelModule,
  ]
})
export class PolizaGeneradaModule { }
