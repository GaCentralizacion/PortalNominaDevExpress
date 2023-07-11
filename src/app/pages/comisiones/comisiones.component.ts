import { Component, OnInit } from "@angular/core";
import { fromFetch } from "rxjs/fetch";
import { ConsultaPolizaNominaService } from "src/app/shared/services/consulta-poliza-nomina.service";
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CurrencyPipe } from "@angular/common";
import { ICalificacion } from "./comisiones.model";
import { ComisionesServices } from "src/app/shared/services/comisiones.service";
import { CatalogosSicossService } from "src/app/shared/services/catalogosSicoss.service";

@Component({
    selector: 'comisiones',
    templateUrl: './comisiones.component.html',
    styleUrls: ['./comisiones.component.scss'],
  })
  export class ComisionesComponent implements OnInit {

    readonly allowedPageSizes = [5, 10, 20, 30, 'all'];

    mes:number = new Date().getMonth()+1
    anio: number=new Date().getFullYear();

    lstAnios:any
    lstMeses:any
    data$: any;    

    objDepartamentos:any = []
    objCompanias:any = []

    lstCalificacionesCentralizado:ICalificacion[] = []
    lstCalificaciones:ICalificacion[] = []
    lstRangos:any

    lstRelacionSucursal:any

    lstCalificacionNoCentralizado :ICalificacion[]=[
      {
        idSucursalWSF:-1,
        idEmpresa:-1,
        idSucural:-1,
        nombre:'VW',
        calificacion: 0,
        monto:0
      },
      {
        idSucursalWSF:-2,
        idEmpresa:-2,
        idSucural:-2,
        nombre:'SEAT',
        calificacion: 0,
        monto:0
      }
    ]

    formData:any ={
      calificacionSeat:0,
      calificacionVw:0
    }

    constructor(private nominaService: ConsultaPolizaNominaService, private comisionesServices:ComisionesServices, private catSicossService:CatalogosSicossService){
      this.Anios()
      this.lstMeses = [
        {
          id: 1,
          text: 'Enero',
        },
        {
          id: 2,
          text: 'Febrero',
        },
        {
          id: 3,
          text: 'Marzo',
        },
        {
          id: 4,
          text: 'Abril',
        },
        {
          id: 5,
          text: 'Mayo',
        },
        {
          id: 6,
          text: 'Junio',
        },
        {
          id: 7,
          text: 'Julio',
        },
        {
          id: 8,
          text: 'Agosto',
        },
        {
          id: 9,
          text: 'Septiembre',
        },
        {
          id: 10,
          text: 'Octubre',
        },
        {
          id: 11,
          text: 'Noviembre',
        },
        {
          id: 12,
          text: 'Diciembre',
        },
      ];

      this.catSicossService.RelacionWSFCentralizacion().subscribe(resp => {
        this.lstRelacionSucursal = resp
        console.log(this.lstRelacionSucursal);
      })
    }

    ngOnInit(): void {
      this.ConsultaRangos()
      
      
    }

    Anios() {
      this.nominaService.ListaAnios().subscribe(async (resp) => {
        this.lstAnios = resp;
      });
    }

    async AnioSelect(e:any){
      this.anio = e.value;
      
      Loading.hourglass('Espere, consultando ScoredCard...')
      this.objDepartamentos = await this.GetResumenScored()
      this.lstRangos = await this.ConsultaRangos()
      Loading.remove()
    }

    async MesSelect(e:any){
      this.mes = e.value;
      Loading.hourglass('Espere, consultando ScoredCard...')
      this.objDepartamentos = await this.GetResumenScored()
      this.lstRangos = await this.ConsultaRangos()

      this.Operacion(this.objDepartamentos)
      Loading.remove()
      

    }

    Operacion(obj:any){
      this.lstCalificacionesCentralizado = []

      this.objDepartamentos = obj.departamentos.find((x:any) => x.idDepartamento === 20)
      this.objCompanias = obj.meses

      // console.log( this.objDepartamentos);
      // console.log( this.objCompanias);

      for (let i = 0; i < this.objDepartamentos.calificaciones.length; i++) {
        let califica:ICalificacion = {
          idSucursalWSF:0,
          idEmpresa:0,
          idSucural:0,
          nombre:'',
          calificacion:0,
          monto:0
        }

        const e = this.objDepartamentos.calificaciones[i];

        califica.nombre = e.nombre
        califica.calificacion = e.valor === null ? 0 : e.valor.toFixed(2)

        this.lstCalificacionesCentralizado.push(califica)
        
      }

      for (let i = 0; i < this.lstRangos.length; i++) {
        const el = this.lstRangos[i];
        
        for (let j = 0; j < this.lstCalificacionesCentralizado.length; j++) {
          const elCal = this.lstCalificacionesCentralizado[j];

          if(elCal.calificacion >= el.limiteInferior && elCal.calificacion <= el.limiteSuperior){
            elCal.monto = el.monto
          }
          
        }

      }

      /**BUSCAMOS EN ID SUCURSAL DE WSF Y LO ACTUALIZAMOS EN EL ARREGLO DE CALIFICAIONES */

      for (let i = 0; i < this.lstCalificacionesCentralizado.length; i++) {
        const element = this.lstCalificacionesCentralizado[i];

        let resultado = this.objCompanias.filter((x:any) => x.nombre === element.nombre)[0]

        if(resultado.idSucursal !== 207){
          let valoresCentralizados = this.lstRelacionSucursal.filter((x:any) => x.idSucursalWSF === resultado.idSucursal)[0]
          element.idEmpresa = valoresCentralizados.idEmpresaCentralizacion
          element.idSucural = valoresCentralizados.idSucursalCentralizacion
        }

        if(resultado.idSucural === 207){
          element.idEmpresa = 26
          element.idSucural = 53
        }
        

        element.idSucursalWSF = resultado.idSucursal
        
      }

      /** UNIMOS CENTRALIZADAS Y NO CENTRALIZADAS */

      this.lstCalificaciones = this.lstCalificacionesCentralizado.concat(this.lstCalificacionNoCentralizado) 

      console.log(this.lstCalificacionesCentralizado);
      

    }

    GetResumenScored(){
      this.objDepartamentos=[]
      return new Promise((resolve, reject) => {
        this.data$ = fromFetch(`http://localhost:4204/api/report/balanceSucursal?idUsuario=3&periodoYear=${this.anio}&periodoMes=${this.mes}`,{
          selector:response => response.json()
        })

        this.data$.subscribe((resp:any) =>{
          resolve(resp)
        })

      })
    }

    ConsultaRangos(){
      this.lstRangos = []
      return new Promise((resolve,reject) =>{
          this.comisionesServices.RangoPagoSeminuevoComisiones(this.anio, this.mes).subscribe((resp:any) =>{
            resolve( resp[0])
          
        })     
      })

    }

    customizeCurrency(data: any) {
      if (data !== undefined) {
        if (data.value === null || data.value === undefined) {
          return new CurrencyPipe('en-US').transform('0');
        }
  
        if (data.value !== null && data.value !== undefined) {
          return new CurrencyPipe('en-US').transform(data.value.toString());
        }
      } else {
        return data;
      }
    }

    BuscarEnRango(calificaciones: any[], LimiteMinimo: number, limiteMaximo: number): any[] {
      return calificaciones.filter((x) => x.calificacion >= LimiteMinimo && x.calificacion <= limiteMaximo);
    }

    ActualizaCalificacion(){

      this.lstCalificacionNoCentralizado.forEach(element => {

        if(element.nombre === 'VW'){
          element.calificacion = this.formData.calificacionVw
        }

        if(element.nombre === 'SEAT'){
          element.calificacion = this.formData.calificacionSeat
        }
        
      });

      for (let i = 0; i < this.lstRangos.length; i++) {
        const el = this.lstRangos[i];
        
        for (let j = 0; j < this.lstCalificacionNoCentralizado.length; j++) {
          const elCal = this.lstCalificacionNoCentralizado[j];

          if(elCal.calificacion >= el.limiteInferior && elCal.calificacion <= el.limiteSuperior){
            elCal.monto = el.monto
          }
          
        }

      }
      this.lstCalificaciones = []
      this.lstCalificaciones = this.lstCalificacionesCentralizado.concat(this.lstCalificacionNoCentralizado) 

    }


  }