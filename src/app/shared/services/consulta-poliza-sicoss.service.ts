import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';

@Injectable({
    providedIn:'root'
})

export class ConsultaPolizaSicossService{
    constructor(private http: HttpClient){}

    /**catalogo conceptos nomina */
    vistaPrevia(anio:number,mes:number,periodoId:number,periodo:number,centroId:number,tipoNomina:number){

        const params = new HttpParams()
        .set('anio',anio)
        .set('mes',mes)
        .set('periodoId',periodoId)
        .set('periodo',periodo)
        .set('centroId',centroId)
        .set('tipoNomina',tipoNomina)

        return this.http.post(`${environment.apiNomina}api/nominaSICOSS/VistaPreviaPoliza`, params)

    }

    CalculoPolizaSicoss(mes:number,anio:number,periodoId:number,periodo:number,tipoNomina:number,lugarTrabajo:number, inserta:number){

        const params = new HttpParams()
        .set('mes',mes)
        .set('anio',anio)
        .set('periodoId',periodoId)
        .set('periodo',periodo)
        .set('tipoNomina',tipoNomina)
        .set('lugarTrabajo',lugarTrabajo)
        .set('inserta',inserta)        

        return this.http.post(`${environment.apiNomina}api/nominaSICOSS/CalculoPolizaSicoss`, params)
    }

    
    SabanaGrupoSicoss(anio:number, mes:number, periodoId:number, periodo:number, centroId:number, tipoNomina:number, fechaPaga:number){
        
        const params = new HttpParams()
        .set('anio',anio)
        .set('mes',mes)
        .set('periodoId',periodoId)
        .set('periodo', periodo)
        .set('centroId',centroId)
        .set('tipoNomina',tipoNomina)
        .set('fechaPaga',fechaPaga)

        return this.http.post(`${environment.apiNomina}api/nominaSICOSS/ConsultaSabanaMetaGrupoSicoss`, params)

    }

    ConsultaAsientoPolizaBproSicoss(idSucursal:number, fechaPaga:string, tipo:number, periodo: number, tipoNomina:number, esAbierta: boolean ){

        const isOpen = esAbierta === true ? 1 : 0

        const params = new HttpParams()
        .set('idSucursal',idSucursal)
        .set('fechaPaga',fechaPaga)
        .set('tipo',tipo)
        .set('periodo', periodo)
        .set('tipoNomina', tipoNomina)
        .set('esAbierta', isOpen)
    
        return this.http.post(`${environment.apiNomina}api/nominaSICOSS/ConsultaAsientoPolizaBproSicoss`, params)
    }

    ConsultaBitacoraPolizasSICOSS(mes:number, anio: number){
        const params = new HttpParams()
        .set('mes', mes)
        .set('anio',anio)

        return this.http.post(`${environment.apiNomina}api/nominaSICOSS/ConsultaBitacoraPolizasSICOSS`, params)
    }

    ConsultaPolizaSICOSS(lugarTrabajo:string, idCabecero:number){
        const params = new HttpParams()
        .set('lugarTrabajo',lugarTrabajo)
        .set('idCabecero',idCabecero);
    
        return this.http.post(`${environment.apiNomina}api/nominaSICOSS/ConsultaPolizaSICOSS`,params)
    
    }

    ConsultaAsientoPolizaBproEmpleadoSicoss(idSucursal:number, fechaPaga:string, tipo:number, tipoNomina:number, esAbierta:boolean ){

        const isOpen = esAbierta === true ? 1 : 0

        const params = new HttpParams()
        .set('idSucursal',idSucursal)
        .set('fechaPaga',fechaPaga)
        .set('tipo',tipo)
        .set('tipoNomina', tipoNomina)
        .set('esAbierta', isOpen)
        
        return this.http.post(`${environment.apiNomina}api/nominaSICOSS/ConsultaAsientoPolizaBproEmpleadoSICOSS`, params)
    }

    CalculoPolizaAbiertaSicoss(mes:number,anio:number,periodoId:number,periodo:number,tipoNomina:number,lugarTrabajo:number){

        const params = new HttpParams()
        .set('mes',mes)
        .set('anio',anio)
        .set('periodoId',periodoId)
        .set('periodo',periodo)
        .set('tipoNomina',tipoNomina)
        .set('Lw',lugarTrabajo)

        return this.http.post(`${environment.apiNomina}api/nominaSICOSS/CalculoPolizaAbiertaSicoss`, params)
    }

    InsertaBorraFechapaga(periodoId:number, periodo:number, tipoNomina:number, fechInicio:string, fechFin:string, insertaBorra:number){
        const params = new HttpParams()
        .set('periodoId',periodoId)
        .set('periodo',periodo)
        .set('tipoNomina',tipoNomina)
        .set('fechInicio',fechInicio)
        .set('fechFin',fechFin)
        .set('insertaBorra',insertaBorra)

        return this.http.post(`${environment.apiNomina}api/nominaSICOSS/InsertaBorraFechaPaga`, params)
    }

}