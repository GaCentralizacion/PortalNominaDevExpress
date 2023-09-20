import { NgModule } from '@angular/core';
import { ConfPagasRoutingModule } from './conf-pagas-routing.module';
import { TituloModule } from 'src/app/shared/components/titulo/titulo.module';
import { DxButtonModule, DxDataGridModule, DxFormModule, DxLoadPanelModule, DxPopupModule, DxSelectBoxModule } from 'devextreme-angular';
import { ConfPagaComponent } from './conf-pagas.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
declarations:[ConfPagaComponent],
imports:[
    TituloModule,
    FlexLayoutModule,
    ConfPagasRoutingModule,
    DxSelectBoxModule,
    DxDataGridModule,
    DxPopupModule,
    DxLoadPanelModule,
    DxButtonModule,
    DxFormModule
],
exports:[]
})

export class confPagasModule{}