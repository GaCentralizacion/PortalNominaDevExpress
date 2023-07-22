import { NgModule } from "@angular/core";
import { ComiFlotillasComponent } from "./comi-flotillas.component";
import { ComiFlotillasRoutingModule } from "./comi-flotillas-routing.module";
import { DxAccordionModule, DxButtonModule, DxDataGridModule, DxFormModule, DxPopupModule, DxSelectBoxModule, DxTabPanelModule } from "devextreme-angular";
import { TituloModule } from "src/app/shared/components/titulo/titulo.module";
import { FlexLayoutModule } from "@angular/flex-layout";

@NgModule({
    declarations:[ComiFlotillasComponent],
    imports:[
        ComiFlotillasRoutingModule,
        DxAccordionModule,
        DxSelectBoxModule,
        DxButtonModule,
        DxDataGridModule,
        DxFormModule,
        DxTabPanelModule,
        DxPopupModule,
        TituloModule,
        FlexLayoutModule
    ],
    exports:[]
})

export class ComiFlotillasModule{}