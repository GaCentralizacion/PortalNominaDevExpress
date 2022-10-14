import { Component, HostBinding, OnInit } from '@angular/core';
import { AuthService, ScreenService, AppInfoService } from './shared/services';

import * as esMessages from 'devextreme/localization/messages/es.json';
import { locale,loadMessages } from 'devextreme/localization';
import config from "devextreme/core/config";
import { AccesoService } from './shared/services/acceso.service';
import { BehaviorSubject, from, Observable } from 'rxjs';

import notify from 'devextreme/ui/notify';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @HostBinding('class') get getClass() {
    return Object.keys(this.screen.sizes).filter(cl => this.screen.sizes[cl]).join(' ');
  }

  accesoUsuario$:any = new BehaviorSubject<boolean>(false);

  constructor(private authService: AuthService, private screen: ScreenService, public appInfo: AppInfoService, private accesoService: AccesoService) { 
    locale('es');
    this.initMessages();
  }

  async ngOnInit(): Promise<void> {

    let resp:any
    const queryP = window.location.search.substring(1)

    let atributo:any = document.getElementById('lgnUser');
    let idUsuario:number = Number(atributo.getAttribute('value'));
    let usuarioLogeado:any =  sessionStorage.getItem('login')

    usuarioLogeado = JSON.parse(usuarioLogeado)

    if(idUsuario >= 0){
      resp = await this.acceso(idUsuario)
      
      if(resp.idRol >= 0){
        sessionStorage.setItem('login', JSON.stringify(resp))
        this.accesoUsuario$.next(!this.accesoUsuario$.getValue())

        const result = await this.authService.logIn(
          resp.nombre.substring(0,15),
          '123'
        );
  
        if (!result.isOk) {
          notify(result.message, 'error', 2000);
        }

      }
    }

    if(usuarioLogeado.idUsuario){
      idUsuario = usuarioLogeado.idUsuario
      resp = await this.acceso(idUsuario)
      
      if(resp.idRol >= 0){
        sessionStorage.setItem('login', JSON.stringify(resp))
        this.accesoUsuario$.next(!this.accesoUsuario$.getValue())

        const result = await this.authService.logIn(
          resp.nombre.substring(0,15),
          '123'
        );
  
        if (!result.isOk) {
          notify(result.message, 'error', 2000);
        }

      }
    }

  }

  isAuthenticated() {

      return  this.authService.loggedIn;
 
  
  }

  initMessages() {
    loadMessages(esMessages)
  }

  acceso(idUsuario: number){
    return new Promise((resolve, reject) =>{
      this.accesoService.usuarioLogeado(idUsuario).subscribe((resp:any) =>{
        resolve(resp[0])
      })
    })
    
  }

}
