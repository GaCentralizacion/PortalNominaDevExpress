import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';

@Injectable({
    providedIn:'root'
})
export class CatalogosSicossService{
    constructor(private http: HttpClient){}

    /**catalogo conceptos nomina */
    ConceptosPoliza(){

        return this.http.get(`${environment.apiNomina}api/catalogosSICOSS/ConceptosSabana`)

    }

    FechasPagas(anio:number, mes:number){
        
        const params = new HttpParams()
        .set('anio',anio)
        .set('mes',mes);

        return this.http.post(`${environment.apiNomina}api/catalogosSICOSS/FechasPagas`, params)
    }

    LugaresTrabajo(){

        return this.http.get(`${environment.apiNomina}api/catalogosSICOSS/LugaresTrabajo`)
    }

    LugaresTrabajoUsuario(idUsuario: number){
        const params = new HttpParams()
        .set('idUsuario',idUsuario)

        return this.http.post(`${environment.apiNomina}api/catalogosSICOSS/LugaresTrabajoUsuario`, params)
    }

    SicossGrupo(){
        return this.http.get(`${environment.apiNomina}api/catalogosSICOSS/SicossGrupo`)
    }

    PeriodosSicoss(){
        return this.http.get(`${environment.apiNomina}api/catalogosSICOSS/PeriodosSicoss`)
    }

    TipoNominaSicoss(){
        return this.http.get(`${environment.apiNomina}api/catalogosSICOSS/TipoNominaSicoss`)
    }

    RelacionWSFCentralizacion(){
        return this.http.get(`${environment.apiNomina}api/catalogosSICOSS/RelacionWSFCentralizacion`)
    }

}