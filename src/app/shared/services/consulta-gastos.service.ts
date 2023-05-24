import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';

@Injectable({
    providedIn:'root'
})

export class ConsultaGastosServices{
    constructor(private http: HttpClient){}

    Departamentos(){
        return this.http.get(`${environment.apiNomina}api/prorrateoAgencias/InfoDepartamentosAgencias`)
    }

    ListaDepartamentos(){
        return this.http.get(`${environment.apiNomina}api/prorrateoAgencias/DepartamentoAgencias`)
    }

    AgregaEliminaAgencia(id_departamento:number, opcion:number, idUsuario:number){

        let params = new HttpParams()
        .set('id_departamento',id_departamento)
        .set('opcion',opcion)
        .set('idUsuario',idUsuario)

        return this.http.post(`${environment.apiNomina}api/prorrateoAgencias/AgregaEliminaAgencia`, params)
    }

    GetSucursales(){
        return this.http.get(`${environment.apiNomina}api/porcentajeSucursal/Sucursales`)
    }

    InsertarSucFlotilla(IdFlotilla:number, idSucursal:number, porcentaje:number,idUsuario:number, porSucursal:number){

        let params = new HttpParams()
        .set('IdFlotilla',IdFlotilla)
        .set('idSucursal',idSucursal)
        .set('porcentaje',porcentaje)
        .set('idUsuario',idUsuario)
        .set('porSucursal',porSucursal)

        return this.http.post(`${environment.apiNomina}api/prorrateoAgencias/InsertarSucFlotillaAgencia`, params)
    }

    DetalleAgencias(idAgencias:number){

        let params = new HttpParams()
        .set('idAgencias',idAgencias)

        return this.http.post(`${environment.apiNomina}api/prorrateoAgencias/DetalleAgencias`, params)
    }

    EliminaSucFlotillaAgencia(idDetalleFlotilla:number,idUsuario:number){

        let params = new HttpParams()
        .set('idDetalleFlotilla',idDetalleFlotilla)
        .set('idUsuario',idUsuario)

        return this.http.post(`${environment.apiNomina}api/prorrateoAgencias/EliminaSucFlotillaAgencia`, params)
    }
}