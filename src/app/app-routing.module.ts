import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent, ResetPasswordFormComponent, CreateAccountFormComponent, ChangePasswordFormComponent } from './shared/components';
import { AuthGuardService } from './shared/services';


const routes: Routes = [
  {
    path:'nomina',
    loadChildren:()=>import('./pages/nomina/nomina.module').then(module => module.nominaModule)
  }, 
  {
    path:'nomina',
    loadChildren:()=>import('./pages/poliza-generada/poliza-generada.module').then(module => module.PolizaGeneradaModule)
  }, 
  {
    path:'nomina',
    loadChildren:()=>import('./pages/visualiza-poliza/visualiza-poliza.module').then(module => module.VisualizaPolizaModule)
  },
  {
    path:'nomina',
    loadChildren:()=>import('./pages/visualiza-poliza-empleado/visualiza-poliza-empleado.module').then(module => module.VisualizaPolizaEmpleadoModule)
  },
  {
    path:'nomina',
    loadChildren:()=>import('./pages/vista-previa/vista-previa.module').then(module => module.VistaPreviaModule)
  },
  {
    path:'gasto',
    loadChildren:()=>import('./pages/conf-prorrateo-agencia/conf-prorrateo-agencia.module').then(module => module.ConfProrrateoAgenciaModule)
  },
  {
    path:'gasto',
    loadChildren:()=>import('./pages/repercusion/repercusion-routing.module').then(module => module.RepercusionRoutingModule)
  },
  {
    path:'comisiones',
    loadChildren:() => import('./pages/comisiones/comisiones.module').then(module => module.ComisionesModule)
  },
  {
    path:'comisiones',
    loadChildren:() => import('./pages/conf-comisiones/conf-comisiones.module').then(module => module.ConfComisionesModule)
  },
  {
    path:'comisiones',
    loadChildren:() => import('./pages/comi-flotillas/comi-flotillas.module').then(module => module.ComiFlotillasModule)
  },
  {
    path:'nomina',
    loadChildren:() => import('./pages/conf-pagas/conf-pagas.module').then(module => module.confPagasModule)
  },
  {
    path: 'login-form',
    component: LoginFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: ':idUsuario',
    component: LoginFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'reset-password',
    component: ResetPasswordFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'create-account',
    component: CreateAccountFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'change-password/:recoveryCode',
    component: ChangePasswordFormComponent,
    canActivate: [ AuthGuardService ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuardService],
  exports: [RouterModule]
})

export class AppRoutingModule { }
