import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DxFormModule, DxLoadIndicatorModule } from 'devextreme-angular';
import { LoginFormComponent } from '../login-form/login-form.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading = false;
  formData: any = {};


  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  async onSubmit(e: Event) {
    e.preventDefault();

  }

  onCreateAccountClick = () => {
    this.router.navigate(['/create-account']);
  }

}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DxFormModule,
    DxLoadIndicatorModule
  ],
  declarations: [ LoginComponent ],
  exports: [ LoginComponent ]
})
export class LoginModule { }