import {NgModule} from '@angular/core';
import { RepercusionComponent } from "./repercusion.component";
import { TituloModule } from 'src/app/shared/components/titulo/titulo.module';
import { BrowserModule } from '@angular/platform-browser';
import { DxAccordionModule, DxButtonModule, DxCalendarModule, DxCheckBoxModule, DxDataGridComponent, DxDataGridModule, DxDateBoxModule, DxFormModule, DxLoadPanelModule, DxSelectBoxModule, DxSliderModule, DxTabPanelModule, DxTagBoxModule, DxTemplateModule, DxTooltipModule } from 'devextreme-angular';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    declarations:[RepercusionComponent],
    imports:[
        TituloModule,
        BrowserModule,
        DxAccordionModule,
        DxCheckBoxModule,
        DxSliderModule,
        DxTagBoxModule,
        DxTemplateModule,
        DxCalendarModule,
        FlexLayoutModule,
        DxButtonModule,
        DxSelectBoxModule,
        DxLoadPanelModule,
        DxDataGridModule,
        DxDateBoxModule,
        DxTabPanelModule,
        DxFormModule,
        DxTooltipModule,
    ],
    exports:[]
})

export class RepercusionModule{}