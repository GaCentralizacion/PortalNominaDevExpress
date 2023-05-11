import { Component, OnInit } from '@angular/core';
import { locale } from 'devextreme/localization';
import { take } from 'rxjs';
import { CatalogosSicossService } from 'src/app/shared/services/catalogosSicoss.service';
import { ConsultaPolizaNominaService } from 'src/app/shared/services/consulta-poliza-nomina.service';
import { ConsultaPolizaSicossService } from 'src/app/shared/services/consulta-poliza-sicoss.service';

import Swal from 'sweetalert2'
@Component({
  selector: 'app-nomina',
  templateUrl: './nomina.component.html',
  styleUrls: ['./nomina.component.scss']
})
export class NominaComponent implements OnInit {

  simpleProducts: string[] = [];
  lstQuincenas:any = []
  lstMeses:any = []
  lstAnios:any = []
  lstEmpresas:any = []
  anioActual:number = 0;
  mesActual:number = 0;
  popupVisible = false;
  loadingVisible = false;
  tituloModal:string = ''
  sucursalProcesada:string = 'En proceso'

  speedValue = 0;
  labelMode = 'floating';

  fechaPagaSeleccionada!:string
  frecuenciaSeleccionada!:string
  semQuin!:number
  tipoPagaSeleccionada!:string
  periodoId: any;
  periodo: any;
  tipoNomina: any;

  constructor(private nominaService: ConsultaPolizaNominaService, private catSicoss: CatalogosSicossService, private polSicoss:ConsultaPolizaSicossService) { 
    locale(navigator.language);
    
    let fecha = new Date()
    this.anioActual = fecha.getFullYear()
    this.mesActual = fecha.getMonth()+1
    this.lstMeses = [
      {
          id: 1,
          text: "Enero"
      },
      {
          id: 2,
          text: "Febrero"
      },
      {
          id: 3,
          text: "Marzo"
      },
      {
          id: 4,
          text: "Abril"
      }, {
          id: 5,
          text: "Mayo"
      }, {
          id: 6,
          text: "Junio"
      }, {
          id: 7,
          text: "Julio"
      }, {
          id: 8,
          text: "Agosto"
      }, {
          id: 9,
          text: "Septiembre"
      }, {
          id: 10,
          text: "Octubre"
      }, {
          id: 11,
          text: "Noviembre"
      }, {
          id: 12,
          text: "Diciembre"
      },
    ];

    // this.nominaService.ListaEmpresasPoliza().pipe(take(2)).subscribe(resp => {
    //   console.log(resp);
    
    //   this.lstEmpresas = resp.slice(0,2) // quitar el slice
    //   console.log(this.lstEmpresas)
    // })

    this.catSicoss.LugaresTrabajo().subscribe(resp => {
      this.lstEmpresas = resp
    })

    /**Relacionamos el evento clic con el metodo del mismo nombre */
    this.CerrarPaga = this.CerrarPaga.bind(this)
  }

  ngOnInit(): void {
    this.Anios()
    this.FechasPaga(this.anioActual, this.mesActual);
  }

  Anios(){
    this.nominaService.ListaAnios().subscribe(resp =>{
      this.lstAnios = resp
    })
  }

  FechasPaga(anio:any, mes:any){

    this.catSicoss.FechasPagas(anio,mes).subscribe(resp =>{
      this.lstQuincenas = []
      this.lstQuincenas = resp
    })
   
    // this.nominaService.FechasPagas(anio,mes).subscribe(resp => {
    //   this.lstQuincenas = []
    //   this.lstQuincenas = resp
    // })
  }

  AnioSelect(e:any){
    console.log(e)
    this.anioActual = e.value
    this.FechasPaga(e.value, this.mesActual)
  }

  MesSelect(e:any){
    this.mesActual = e.value
    this.FechasPaga(this.anioActual, e.value)
  }

  CerrarPaga(e:any){
    console.log(e.row.data);
    
    this.tituloModal = e.row.data.paga

    this.periodoId = e.row.data.frecuencia
    this.periodo = e.row.data.semQuin
    this.tipoNomina = e.row.data.tipo

    this.fechaPagaSeleccionada = e.row.data.fechasPaga
    //this.frecuenciaSeleccionada = e.row.data.frecuencia
    //this.semQuin = e.row.data.semQuin
    //this.tipoPagaSeleccionada  = e.row.data.tipo

    this.loadingVisible = true;
    setTimeout(() => {
      this.loadingVisible = false;
    }, 3000);

  }

  CerrarPagaDisabled(e:any){
    return e.row.data.apagado === 0

  }

  onShown() {
    setTimeout(() => {
      this.loadingVisible = false;
    }, 3000);
  }

  onHidden() {

    Swal.fire({
      title: '¿Qué deseas hacer?',
      text: "Si cierras la paga se enviará la información a BPRO para generar la póliza",
      icon: 'question',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      denyButtonColor: '#7066e0',
      confirmButtonText: 'Cerrar paga',
      denyButtonText: `Consulta paga abierta`,
      cancelButtonText:'Cancelar',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.CerrarPagas(1)
      }

      if (result.isDenied) {
        this.CerrarPagas(2)
      }
    })

  }

  /**
   * 
   * @param opcion 1: se envia a bpro, 2 consulta pagas abiertas
   */
  CerrarPagas(opcion: number){
    this.popupVisible = true;
    let polizaProcesada
    this.speedValue = 0
    this.sucursalProcesada = 'En proceso'
    setTimeout(async () => {
      for (let i = 0; i < this.lstEmpresas.length; i++) {
      
        // setTimeout(async () => {
          const element = this.lstEmpresas[i];
          this.sucursalProcesada = element.Descripcion.substring(0, 12)//element.sucursal.substring(0, 12)
          polizaProcesada = await this.CalculoNomina(element.Centro_ID,opcion)
          this.speedValue =  Number((((i+1)*100)/this.lstEmpresas.length).toFixed(0))  
        
          if(this.speedValue === 100){
            setTimeout(() => {
              this.popupVisible = false;
            }, 2000);
          }
              
        // }, i*2000);

    }  
    }, 2000);
  }

  CalculoNomina(idLugarTrabajo:number, opcion: number){

    return new Promise((resolve) =>{

      /**
       * opcion para consulta de informacion de pagas cerradas
       */
      if(opcion === 1){
        this.polSicoss.CalculoPolizaSicoss(this.mesActual, this.anioActual, this.periodoId, this.periodo, this.tipoNomina, idLugarTrabajo).subscribe(resp =>resolve(true))
      }
      
      /**
       * opcion para consulta de informacion de pagas abiertas
       */
      if(opcion === 2){
        this.polSicoss.CalculoPolizaAbiertaSicoss(this.mesActual, this.anioActual, this.periodoId, this.periodo, this.tipoNomina, idLugarTrabajo).subscribe(resp =>resolve(true))
      }
   
    })

    // return new Promise((resolve) => {
    //   this.nominaService.CalculoNomina(this.mesActual,this.anioActual,this.fechaPagaSeleccionada,this.tipoPagaSeleccionada,idLugarTrabajo).subscribe(resp => resolve(true))
    // })
  }

}
