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

    EmpleadosProrrateados(){
        return this.http.get(`${environment.apiNomina}api/nominaSICOSS/ObtieneProrrateoNomina`)
    }

    EmpleadosProrrateadosDetalle(idEmpleado:number){

        const params = new HttpParams()
        .set('idEmpleado',idEmpleado)
        return this.http.post(`${environment.apiNomina}api/nominaSICOSS/ObtieneProrrateoNominaDetalle`,params)
    }

    DepartamentoSicoss(centroId:number){

        const params = new HttpParams()
        .set('centroId',centroId)
        return this.http.post(`${environment.apiNomina}api/nominaSICOSS/DepartamentoSicoss`,params)
    }

    InsertaProrrateoNomina(idRh:number, idDepto:string, porcentaje:number){

        const params = new HttpParams()
        .set('idRh',idRh)
        .set('idDepto',idDepto)
        .set('porcentaje',porcentaje)

        return this.http.post(`${environment.apiNomina}api/nominaSICOSS/InsertaProrrateoSicoss`,params)
    }
  
    EliminaProrrateoNomina(idRh:number, idDepto:string){

        const params = new HttpParams()
        .set('idRh',idRh)
        .set('idDepto',idDepto)

        return this.http.post(`${environment.apiNomina}api/nominaSICOSS/EliminaProrrateo`,params)
    }

}