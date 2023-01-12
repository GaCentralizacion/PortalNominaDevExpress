import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {

  constructor(private http: HttpClient) { }

  permisos(usuario:string, contrasena:string){

    const params = new HttpParams()
    .set('User',usuario)
    .set('pass',contrasena);

    return this.http.post(`${environment.apiNomina}api/acceso/permisos`,params)
    //return this.http.get('http://192.168.20.59:5600/api/consultaPolizaNomina/fechasPagas/',{params})
  }

  usuarioLogeado(idUsuario:number){
    
    const params = new HttpParams()
    .set('idEmpleado', idUsuario)

    return this.http.post(`${environment.apiNomina}api/acceso/UsuarioLogeado`,params)

  }
  
  MenuNomina(idRol:number){
    
    const params = new HttpParams()
    .set('idRol', idRol)

    return this.http.post(`${environment.apiNomina}api/acceso/MenuNomina`,params)

  }

  MenuNominaDetalle(items:number,idRol:number){
    
    const params = new HttpParams()
    .set('items', items)
    .set('idRol', idRol)

    return this.http.post(`${environment.apiNomina}api/acceso/MenuNominaDetalle`,params)

  }

}
