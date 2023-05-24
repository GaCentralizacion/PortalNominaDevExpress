import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SideNavOuterToolbarModule, SideNavInnerToolbarModule, SingleCardModule } from './layouts';
import { FooterModule, ResetPasswordFormModule, CreateAccountFormModule, ChangePasswordFormModule, LoginFormModule } from './shared/components';
import { AuthService, ScreenService, AppInfoService } from './shared/services';
import { UnauthenticatedContentModule } from './unauthenticated-content';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { nominaModule } from './pages/nomina/nomina.module';
import { LoginModule } from './shared/components/login/login.component';
import { PolizaGeneradaModule } from './pages/poliza-generada/poliza-generada.module';
import { VisualizaPolizaModule } from './pages/visualiza-poliza/visualiza-poliza.module';
import { ConfProrrateoAgenciaModule } from './pages/conf-prorrateo-agencia/conf-prorrateo-agencia.module';
import { RepercusionModule } from './pages/repercusion/repercusion.module';

@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    BrowserModule,
    SideNavOuterToolbarModule,
    SideNavInnerToolbarModule,
    SingleCardModule,
    FooterModule,
    ResetPasswordFormModule,
    CreateAccountFormModule,
    ChangePasswordFormModule,
    LoginFormModule,
    UnauthenticatedContentModule,
    HttpClientModule,
    AppRoutingModule,
    nominaModule,
    LoginModule,
    PolizaGeneradaModule,
    VisualizaPolizaModule,
    ConfProrrateoAgenciaModule,
    RepercusionModule
  ],
  providers: [
    AuthService,
    ScreenService,
    AppInfoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
