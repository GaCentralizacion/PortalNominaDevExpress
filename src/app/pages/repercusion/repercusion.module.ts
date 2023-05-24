import {NgModule} from '@angular/core';
import { RepercusionComponent } from "./repercusion.component";
import { TituloModule } from 'src/app/shared/components/titulo/titulo.module';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    declarations:[RepercusionComponent],
    imports:[
        TituloModule,
        BrowserModule
    ],
    exports:[]
})

export class RepercusionModule{}