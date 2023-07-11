import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';

@Injectable({
    providedIn:'root'
})

export class ComisionesServices{
    constructor(private http: HttpClient){}


    ConsultaScoreCard(mes:number, anio:number){


        return `http://localhost:4204/api/report/balanceSucursal?idUsuario=3&periodoYear=${anio}&periodoMes=${mes}`

    }

    RangoPagoSeminuevoComisiones(anio:number, mes:number){

        let params = new HttpParams()
        .set('anio',anio)
        .set('mes',mes)

        return this.http.post(`${environment.apiNomina}api/repercusion/RangoPagoSeminuevoComisiones`, params)
    }


}
