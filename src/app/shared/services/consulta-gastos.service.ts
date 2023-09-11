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

    SelFechaEjecucionRepercusion(anio: number, mes: number){
        let params = new HttpParams()
        .set('anio',anio)
        .set('mes',mes)

        return this.http.post(`${environment.apiNomina}api/repercusion/SelFechaEjecucion`, params)
    }

    ResumenInsertaBalanzaCentralizado(anio:number,mes:number,idDetalle:number,inserta:number){

        let params = new HttpParams()
        .set('anio', anio)
        .set('mes', mes)
        .set('idDetalle',idDetalle)
        .set('inserta', inserta)

        return this.http.post(`${environment.apiNomina}api/repercusion/ResumenInsertaBalanzaCentralizado`,params)
    }

    ResumenBalanzaComisionesBonos(mes:number,anio:number,quincena:number){

        let params = new HttpParams()
        .set('mes', mes)
        .set('anio',anio)
        .set('quincena', quincena)

        return this.http.post(`${environment.apiNomina}api/repercusion/ResumenBalanzaComisionesBonos`,params)
    }

    ConsultaOrdenesCompra(fecha:string){
        
        let params = new HttpParams()
        .set('fecha', fecha)

        return this.http.post(`${environment.apiNomina}api/repercusion/ConsultaOrdenesCompra`, params)

    }

    ConsultaOCError(oc:string, sucursal:string){
        
        let params = new HttpParams()
        .set('oc', oc)
        .set('sucursal', sucursal)

        return this.http.post(`${environment.apiNomina}api/repercusion/ConsultaOCError`, params)
    }

    ConsultaFacturacion(fecha:string){
        
        let params = new HttpParams()
        .set('fecha', fecha)

        return this.http.post(`${environment.apiNomina}api/repercusion/ConsultaFacturas`, params)

    }

    ConsultaFechaFacturacion(mes:number,anio:number,quincena:number,inserta:number){
        let params = new HttpParams()
        .set('mes', mes)
        .set('anio', anio)
        .set('quincena', quincena)
        .set('inserta', inserta)

        return this.http.post(`${environment.apiNomina}api/repercusion/ConsultaFechaFaturacion`, params)
    }

    ParametrosNotificacion(tabla:string){
        let params = new HttpParams()
        .set('tabla',tabla)

        return this.http.post(`${environment.apiNomina}api/repercusion/ParametrosNotificacion`, params)
    }

    ProrrateoBalanza(mes:number,anio:number,quincena:number,dia:number){
        let params = new HttpParams()
        .set('mes', mes)
        .set('anio', anio)
        .set('quincena', quincena)
        .set('dia', dia)

        return this.http.post(`${environment.apiNomina}api/repercusion/ProrrateoBalanza`, params)

    }

    InsertaOrdenCompraCentralizado(anio:number,mes:number,idDetalle:number,inserta:number){

        let params = new HttpParams()
        .set('anio', anio)
        .set('mes', mes)
        .set('idDetalle',idDetalle)
        .set('inserta', inserta)

        return this.http.post(`${environment.apiNomina}api/repercusion/InsertaOrdenCompraCentralizado`,params)
    }

    InsertaOrdenCompraNoCentralizado(anio:number,mes:number,idDetalle:number,inserta:number){

        let params = new HttpParams()
        .set('anio', anio)
        .set('mes', mes)
        .set('quincena',idDetalle)
        .set('inserta', inserta)

        return this.http.post(`${environment.apiNomina}api/repercusion/InsertaOrdenCompraNoCentralizado`,params)
    }

    InsertaSolicitudFacturacion(anio:number, mes:number, quincena:number, idUsuario:number){

        let params = new HttpParams()
        .set('anio',anio)
        .set('mes',mes)
        .set('quincena', quincena)
        .set('idUsuario',idUsuario)

        return this.http.post(`${environment.apiNomina}api/repercusion/InsertaSolicitudFacturacion`,params)

    }

    AuthApiBproOC(){
        let params = new HttpParams()
        return this.http.post(`${environment.apiNomina}api/repercusion/AuthApi`,params)
    }

}