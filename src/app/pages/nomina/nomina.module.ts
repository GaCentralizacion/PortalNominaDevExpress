import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { DxButtonModule, DxCircularGaugeModule, DxDataGridModule, DxLinearGaugeModule, DxLoadPanelModule, DxPopupModule, DxSelectBoxModule, DxSliderModule,DxResponsiveBoxModule,DxDropDownBoxModule, DxTreeViewModule, DxToolbarModule, DxFormModule } from "devextreme-angular";
import { TituloModule } from "src/app/shared/components/titulo/titulo.module";
import { NominaRoutingModule } from "./nomina-routing.module";
import { NominaComponent } from "./nomina.component";


@NgModule({
    declarations:[NominaComponent],
    imports:[
        FlexLayoutModule,
        DxSelectBoxModule,
        DxDataGridModule,
        DxPopupModule,
        DxLoadPanelModule,
        DxButtonModule,
        DxCircularGaugeModule,
        DxLinearGaugeModule,
        DxSliderModule,
        DxResponsiveBoxModule,
        DxDropDownBoxModule,
        DxTreeViewModule,
        NominaRoutingModule,
        TituloModule,
        DxFormModule
     ],
    exports:[]
})
export class nominaModule{}