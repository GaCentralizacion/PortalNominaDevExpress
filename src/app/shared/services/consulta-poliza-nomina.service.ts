import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AsientoContable, LugarTrabajoModel, Pagas } from 'src/app/pages/visualiza-poliza/visualiza-poliza.model';
import { environment } from './../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ConsultaPolizaNominaService {

  constructor( private http: HttpClient) { }

  /**Obtiene las fechas de paga de nomina
   * @anio: año
   * @mes: mes
   */
  FechasPagas(anio:number, mes:number){

    const params = new HttpParams()
    .set('anio',anio)
    .set('mes',mes);

    return this.http.post<Pagas[]>(`${environment.apiNomina}api/nomina/fechasPaga`,params)
    //return this.http.get('http://192.168.20.59:5600/api/consultaPolizaNomina/fechasPagas/',{params})
  }

  /**Obtiene la lista de las empresas que a las que se les debe generar la nomina */
  ListaEmpresasPoliza(){
    return this.http.get<LugarTrabajoModel[]>(`${environment.apiNomina}api/nomina/ListaEmpresasPoliza`)
    //return this.http.get('http://192.168.20.59:5600/api/consultaPolizaNomina/ListaEmpresasPoliza')
  }

  /**Obtiene la lista de los ultimos 3 años */
  ListaAnios(){
    return this.http.get(`${environment.apiNomina}api/polizasNomina/anio`)
    //return this.http.get('http://192.168.20.59:5600/api/polizaNomina/Anio')
  }

  ConsultaBitacoraPolizas(mes:number, anio:number){
    const params = new HttpParams()
    .set('anio',anio)
    .set('mes',mes);

    return this.http.post(`${environment.apiNomina}api/nomina/ConsultaBitacoraPolizas/`,params)
    //return this.http.get('http://192.168.20.59:5600/api/consultaPolizaNomina/ConsultaBitacoraPolizas/',{params})
  }

  ConsultaPoliza(lugarTrabajo:string, idCabecero:number){
    const params = new HttpParams()
    .set('lugarTrabajo',lugarTrabajo)
    .set('idCabecero',idCabecero);

    return this.http.post(`${environment.apiNomina}api/nomina/ConsultaPoliza`,params)

  }


  ObtieneAsientoContable(lugarTrabajo:string, fechaPagaSelected:string, tipoSelected:string,frecuenciaSelected:string  ){
    const params = new HttpParams()
    .set('lugarTrabajo',lugarTrabajo)
    .set('fechaPagaSelected',fechaPagaSelected)
    .set('tipoSelected',tipoSelected)
    .set('frecuenciaSelected',frecuenciaSelected);

    return this.http.post<AsientoContable[]>(`${environment.apiNomina}api/nomina/ObtieneAsientoContablePaga`, params)
  }

  ReporteExcelMeta(lugarTrabajo: string, frecuencia: string, fechaPaga: string){
    const params = new HttpParams()
    .set('lugarTrabajo',lugarTrabajo)
    .set('frecuencia',frecuencia)
    .set('fechaPaga',fechaPaga)

    return this.http.post(`${environment.apiNomina}api/nomina/ReporteExcelMeta`, params)

  }

  ConsultaSabanaMeta(lugarTrabajo:string, fechaPagaSelected:string, tipoSelected:string,frecuenciaSelected:string  ){
    const params = new HttpParams()
    .set('lugarTrabajo',lugarTrabajo)
    .set('fechaPagaSelected',fechaPagaSelected)
    .set('tipoSelected',tipoSelected)
    .set('frecuenciaSelected',frecuenciaSelected);

    return this.http.post<AsientoContable[]>(`${environment.apiNomina}api/nomina/ConsultaSabanaMeta`, params)
  }

  ConsultaSabanaMetaGrupo(lugarTrabajo:string, fechaPagaSelected:string, tipoSelected:string,frecuenciaSelected:string  ){
    const params = new HttpParams()
    .set('lugarTrabajo',lugarTrabajo)
    .set('fechaPagaSelected',fechaPagaSelected)
    .set('tipoSelected',tipoSelected)
    .set('frecuenciaSelected',frecuenciaSelected);

    return this.http.post<AsientoContable[]>(`${environment.apiNomina}api/nomina/ConsultaSabanaMetaGrupo`, params)
  }

  GruposMeta(){
    return this.http.get(`${environment.apiNomina}api/nomina/MetaGrupo`)
  }

  CalculoNomina(mes:number, anio:number, fechaNomina:string ,tipoNomina:string ,lugarTrabajo:string ){
    const params = new HttpParams()
    .set('mes',mes)
    .set('anio',anio)
    .set('fechaNomina',fechaNomina)
    .set('tipoNomina',tipoNomina)
    .set('lugarTrabajo',lugarTrabajo);

    return this.http.post(`${environment.apiNomina}api/nomina/CalculoPolizaNomina`, params)
  }

  ConsultaAsientoPolizaBpro(idSucursal:string, fechaPaga:string, tipo:string ){
    const params = new HttpParams()
    .set('idSucursal',idSucursal)
    .set('fechaPaga',fechaPaga)
    .set('tipo',tipo)

    return this.http.post(`${environment.apiNomina}api/nomina/ConsultaAsientoPolizaBpro`, params)
  }

}
