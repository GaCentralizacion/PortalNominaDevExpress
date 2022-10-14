import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule, DxToolbarModule } from 'devextreme-angular';
import { TituloComponent } from './titulo.component';



@NgModule({
  declarations: [
    TituloComponent
  ],
  imports: [
    CommonModule,
    DxButtonModule,
    DxToolbarModule
  ],
  exports:[
    TituloComponent
  ]
})
export class TituloModule { }
