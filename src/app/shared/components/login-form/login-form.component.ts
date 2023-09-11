import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DxFormModule } from 'devextreme-angular/ui/form';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import notify from 'devextreme/ui/notify';
import { AuthService } from '../../services';
import { AccesoService } from '../../services/acceso.service';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  loading = false;
  formData: any = {};
  result: {} = {};
  recoveryCode: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private accesoService: AccesoService,
    private route: ActivatedRoute
  ) {

    let datos = sessionStorage.getItem('login')
    if(datos !== undefined && datos !== null){
      let ev = new Event('click')
      this.onSubmit(ev)
    }
    
  }

  async onSubmit(e: Event) {

    let resp: any

    e.preventDefault();

    let datos = sessionStorage.getItem('login')
    
    const { email, password } = this.formData;
    this.loading = true;

    if(datos !== undefined && datos !== null){
      resp = JSON.parse(datos)
    }else{
     resp = await this.acceso(email, password);      
    }

    if (resp.estatus === 1) {

      sessionStorage.setItem('login', JSON.stringify(resp))

      const result = await this.authService.logIn(
        resp.NombreUsuario,
        password
      );

      if (!result.isOk) {
        this.loading = false;
        notify(result.message, 'error', 2000);
      }
      
    }
  }

  onCreateAccountClick = () => {
    this.router.navigate(['/create-account']);
  };

  acceso(email: string, password: string) {
    return new Promise((resolve) => {
      this.accesoService.permisos(email, password).subscribe((resp:any) => {
        resolve(resp[0]);
      });
    });
  }
}
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DxFormModule,
    DxLoadIndicatorModule
  ],
  declarations: [ LoginFormComponent ],
  exports: [ LoginFormComponent ]
})
export class LoginFormModule { }
