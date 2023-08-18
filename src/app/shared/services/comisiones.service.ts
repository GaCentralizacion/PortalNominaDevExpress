import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';

@Injectable({
    providedIn:'root'
})

export class ComisionesServices{
    constructor(private http: HttpClient){}


    ConsultaScoreCard(mes:number, anio:number){


        return `http://192.168.20.89:4202/api/report/balanceSucursal?idUsuario=3&periodoYear=${anio}&periodoMes=${mes}`

    }

    RangoPagoSeminuevoComisiones(anio:number, mes:number){

        let params = new HttpParams()
        .set('anio',anio)
        .set('mes',mes)

        return this.http.post(`${environment.apiNomina}api/repercusion/RangoPagoSeminuevoComisiones`, params)
    }

    ConfigMarkDevCenter( mes:number,anio:number,idDepto:string){

        let params = new HttpParams()
        .set('mes',mes)
        .set('anio',anio)
        .set('idDepto',idDepto)

        return this.http.post(`${environment.apiNomina}api/comisionesFlotillas/ConfigMarkDevCenter`, params)
    }

    AgregaEliminaConfMarkDev( idDepto:string,idEmpresa:number,idSucursal:string, anio:number,mes:number,accion:number){

        let params = new HttpParams()
        .set('idDepto',idDepto)
        .set('idEmpresa',idEmpresa)
        .set('idSucursal',idSucursal)
        .set('anio',anio)
        .set('mes',mes)
        .set('accion',accion)

        return this.http.post(`${environment.apiNomina}api/comisionesFlotillas/AgregaEliminaConfMarkDev`, params)
    }

    RangoPagoNuevoComisiones(anio:number, mes:number){

        let params = new HttpParams()
        .set('anio',anio)
        .set('mes',mes)

        return this.http.post(`${environment.apiNomina}api/repercusion/RangoPagoNuevoComisiones`, params)
    }

    ConfiguracionRangoNuevosComisiones( mes:number,anio:number,limInferior:number, limSuperior:number,porcentaje:number,accion:number){

        let params = new HttpParams()
        .set('mes',mes)
        .set('anio',anio)
        .set('limInferior',limInferior)
        .set('limSuperior',limSuperior)
        .set('porcentaje',porcentaje)
        .set('accion',accion)

        return this.http.post(`${environment.apiNomina}api/comisionesFlotillas/ConfiguracionRangoNuevosComisiones`, params)
    }
    ConfiguracionRangoSemiNuevosComisiones( mes:number,anio:number,limInferior:number, limSuperior:number,monto:number,accion:number){

        let params = new HttpParams()
        .set('mes',mes)
        .set('anio',anio)
        .set('limInferior',limInferior)
        .set('limSuperior',limSuperior)
        .set('monto',monto)
        .set('accion',accion)

        return this.http.post(`${environment.apiNomina}api/comisionesFlotillas/ConfiguracionRangoSemiNuevosComisiones`, params)
    }

    InfoDepartamentosComisiones(){
        return this.http.get(`${environment.apiNomina}api/comisionesFlotillas/InfoDepartamentosComisiones`)
    }

    SucursalesComisiones(){
        return this.http.get(`${environment.apiNomina}api/comisionesFlotillas/SucursalesComisiones`)
    }

    CatEmpresasComisiones(){
        return this.http.get(`${environment.apiNomina}api/comisionesFlotillas/CatEmpresasComisiones`)
    }

    CalculoGastoComisionesFlotillas(idSucursalWSF: number,anio: number,mes: number,detalle:number){
        let params = new HttpParams()
        .set('idSucursalWSF',idSucursalWSF)
        .set('anio',anio)
        .set('mes',mes)
        .set('detalle',detalle)

        return this.http.post(`${environment.apiNomina}api/comisionesFlotillas/CalculoGastoComisionesFlotillas`, params)
    }

    CalculoDetalleComisionesFlotillas(base:string,ip:string,nombreDepto:string,fechaInicio:string,fechafin:string,totalGasto:number){
        let params = new HttpParams()
        .set('base',base)
        .set('ip',ip)
        .set('nombreDepto',nombreDepto)
        .set('fechaInicio',fechaInicio)
        .set('fechafin',fechafin)
        .set('totalGasto',totalGasto)

        return this.http.post(`${environment.apiNomina}api/comisionesFlotillas/CalculoDetalleComisionesFlotillas`, params)
    }

}
