import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA,NgModule} from '@angular/core';
import { ConfProrrateoNominaRoutingModule } from './conf-prorrateo-nomina-routing.module';
import { TituloModule } from 'src/app/shared/components/titulo/titulo.module';
import { CommonModule } from '@angular/common';
import { ConfProrrateoNominaComponent } from './conf-prorrateo-nomina.component';
import { DxSelectBoxModule, DxDataGridModule, DxPopupModule, DxLoadPanelModule, DxButtonModule, DxFormModule, DxTextAreaModule, DxDropDownBoxModule, DxNumberBoxModule } from 'devextreme-angular';
import { ProrrateoDetalleComponent } from './prorrateo-detalle/prorrateo-detalle.component';
import { AddProrrateoComponent } from './add-prorrateo/add-prorrateo.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    declarations:[ConfProrrateoNominaComponent, ProrrateoDetalleComponent, AddProrrateoComponent],
    imports:[
        CommonModule,
        TituloModule,
        ConfProrrateoNominaRoutingModule,
        DxSelectBoxModule,
        DxDataGridModule,
        DxPopupModule,
        DxLoadPanelModule,
        DxButtonModule,
        FormsModule,
        NgbModule,
        DxTextAreaModule,
        DxFormModule,
        DxDropDownBoxModule,
        DxNumberBoxModule,
        FlexLayoutModule
    ],
    exports:[],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})

export class ConfProrrateoNominaModule {}