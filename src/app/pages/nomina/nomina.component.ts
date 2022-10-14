import { Component, OnInit } from '@angular/core';
import { locale } from 'devextreme/localization';
import { ConsultaPolizaNominaService } from 'src/app/shared/services/consulta-poliza-nomina.service';


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

  constructor(private nominaService: ConsultaPolizaNominaService) { 
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

    this.nominaService.ListaEmpresasPoliza().subscribe(resp => {
      console.log(resp);
      
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
   
    this.nominaService.FechasPagas(anio,mes).subscribe(resp => {
      this.lstQuincenas = []
      this.lstQuincenas = resp
    })
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

    this.fechaPagaSeleccionada = e.row.data.fechasPaga
    this.frecuenciaSeleccionada = e.row.data.frecuencia
    this.semQuin = e.row.data.semQuin
    this.tipoPagaSeleccionada  = e.row.data.tipo

    this.loadingVisible = true;
    setTimeout(() => {
      this.loadingVisible = false;
    }, 3000);

  }

  CerrarPagaDisabled(e:any){
    return e.row.data.apagado === 1

  }

  onShown() {
    setTimeout(() => {
      this.loadingVisible = false;
    }, 3000);
  }

  onHidden() {
    this.popupVisible = true;
    let polizaProcesada
    setTimeout(async () => {
      for (let i = 0; i < this.lstEmpresas.length; i++) {
      
        // setTimeout(async () => {
          const element = this.lstEmpresas[i];
          this.sucursalProcesada = element.sucursal.substring(0, 12)
          polizaProcesada = await this.CalculoNomina(element.workLocat)
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

  CalculoNomina(idLugarTrabajo:string){
    return new Promise((resolve) => {
      this.nominaService.CalculoNomina(this.mesActual,this.anioActual,this.fechaPagaSeleccionada,this.tipoPagaSeleccionada,idLugarTrabajo).subscribe(resp => resolve(true))
    })
  }

}
