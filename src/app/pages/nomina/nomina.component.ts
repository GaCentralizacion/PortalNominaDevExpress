import { Component, OnInit } from '@angular/core';
import { locale } from 'devextreme/localization';
import { take } from 'rxjs';
import { CatalogosSicossService } from 'src/app/shared/services/catalogosSicoss.service';
import { ConsultaPolizaNominaService } from 'src/app/shared/services/consulta-poliza-nomina.service';
import { ConsultaPolizaSicossService } from 'src/app/shared/services/consulta-poliza-sicoss.service';
import { Loading, Report } from 'notiflix';
import { exportDataGrid } from 'devextreme/excel_exporter'
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2'
import { ExcelClass } from 'src/app/shared/services/excelClass.service';
import { MesesServices } from 'src/app/shared/services/meses.service';
import themes from 'devextreme/ui/themes';

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
  popupPagasVisible:boolean = false
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

  lstPeriodosSicos:any;
  lstTipoNominaSicoss:any
  empresasSeleccionadas:any=[]

  formDataValidacion: any = {
    periodoId: 0,
    periodo: 0,
    tipoNomina: 0,
    fechaInicio: '',
    fechaFin: ''
  };
  
  positionEditorOptions: any
  positionEditorOptionsTipo: any
  positionEditorOptionsCalenda: any
  popupCentrosTrabajoVisible:boolean = false

  allMode: string;
  checkBoxesMode: string;

  opcionSeleccionada:number = 0
  nombreSucursal:string = ''

  constructor(
    private nominaService: ConsultaPolizaNominaService, 
    private catSicoss: CatalogosSicossService, 
    private polSicoss:ConsultaPolizaSicossService, 
    private consultaSicoss: ConsultaPolizaSicossService,
    private _mesService: MesesServices
    ) { 
    
    locale(navigator.language);
    this.allMode = 'allPages';
    this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';
    
    let fecha = new Date()
    this.anioActual = fecha.getFullYear()
    this.mesActual = fecha.getMonth()+1
    this.lstMeses = this._mesService.meses()

    // this.nominaService.ListaEmpresasPoliza().pipe(take(2)).subscribe(resp => {
    //   console.log(resp);
    
    //   this.lstEmpresas = resp.slice(0,2) // quitar el slice
    //   console.log(this.lstEmpresas)
    // })

    this.catSicoss.LugaresTrabajo().subscribe(resp => {
      this.lstEmpresas = resp
    })

    this.positionEditorOptionsCalenda = {
      displayFormat:'yyyy/MM/dd'
    }

    /**Relacionamos el evento clic con el metodo del mismo nombre */
    this.CerrarPaga = this.CerrarPaga.bind(this)
  }

  async ngOnInit(): Promise<void> {
    this.Anios()
    this.FechasPaga(this.anioActual, this.mesActual);
    this.lstPeriodosSicos = await this.PeriodoSicoss()
    this.lstTipoNominaSicoss = await this.TipoNomina()

    this.positionEditorOptions = { 
      dataSource:this.lstPeriodosSicos,
      displayExpr: "Descripcion",
      valueExpr: "Periodo_ID"
    }
    this.positionEditorOptionsTipo = { 
      dataSource:this.lstTipoNominaSicoss,
      displayExpr: "Descripcion",
      valueExpr: "TipoNomina_ID"
    }
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
  }

  PeriodoSicoss(){
    return new Promise((resolve, reject) =>{
      this.catSicoss.PeriodosSicoss().subscribe(resp => {
        resolve(resp)
      })
    })
  }

  TipoNomina (){
    return new Promise((resolve, reject) => {
      this.catSicoss.TipoNominaSicoss().subscribe(resp =>{
        resolve(resp)
      })
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
      confirmButtonText: 'Generar póliza',
      denyButtonText: `Consulta paga`,
      cancelButtonText:'Cancelar',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        //this.CerrarPagas(1)
        this.opcionSeleccionada = 1 
        this.OpenListaEmpresas()
       
      }

      if (result.isDenied) {
        //this.CerrarPagas(2)
        this.opcionSeleccionada = 0
        this.OpenListaEmpresas()
        
      }
    })

  }

  OpenListaEmpresas(){
    this.empresasSeleccionadas = []
    this.popupCentrosTrabajoVisible = true
  }

  PruebaSeleccion(){
    console.log(this.empresasSeleccionadas);
    this.popupCentrosTrabajoVisible = false
    this.CerrarPagas(this.opcionSeleccionada)
    
  }

  /**
   * 
   * @param opcion 1: se envia a bpro, 2 consulta pagas abiertas
   */
  CerrarPagas(opcion: number){
    this.popupVisible = true;
    //Loading.hourglass(`Espere por favor, obteniendo datos`);
    let polizaProcesada
    this.speedValue = 0
    this.sucursalProcesada = 'En proceso'
    let dato:any
    let values_response:any = []
    setTimeout( async () => {
      for (let i = 0; i < this.empresasSeleccionadas.length; i++) {
        const element = this.empresasSeleccionadas[i];
        //values_response.push(this.CalculoNomina(element,opcion))
        //  setTimeout( async () => {

           dato = this.lstEmpresas.find((x:any) => x.Centro_ID === Number(element))

            this.sucursalProcesada = dato.Descripcion.substring(0, 12)//element.sucursal.substring(0, 12)
            polizaProcesada = await this.CalculoNomina(Number(element),opcion) //await this.CalculoNomina(element.Centro_ID,opcion)
            this.speedValue =  Number((((i+1)*100)/this.empresasSeleccionadas.length).toFixed(0))  
        
           if(this.speedValue === 100){
             setTimeout(() => {
               this.popupVisible = false;
             }, 2000);
           }
              
        //  }, i*2000);

    }  

    //let values = await Promise.all(values_response)

    this.FechasPaga(this.anioActual, this.mesActual);
   // Loading.remove()

    }, 1000);
  }

  CalculoNomina(idLugarTrabajo:number, opcion: number){

    return new Promise((resolve) =>{

      this.polSicoss.CalculoPolizaSicoss(this.mesActual, this.anioActual, this.periodoId, this.periodo, this.tipoNomina, idLugarTrabajo,opcion).subscribe(resp =>{resolve(true)})
   
    })

    // return new Promise((resolve) => {
    //   this.nominaService.CalculoNomina(this.mesActual,this.anioActual,this.fechaPagaSeleccionada,this.tipoPagaSeleccionada,idLugarTrabajo).subscribe(resp => resolve(true))
    // })
  }

  ModalPagas(){
    this.formDataValidacion = {
      periodoId: 0,
      periodo: 0,
      tipoNomina: 0,
      fechaInicio: '',
      fechaFin: ''
    };
    this.popupPagasVisible = true
  }

  async InsertaPaga(opcion:number){

    let fechaInicio = `${this.formDataValidacion.fechaInicio.getFullYear()}/${this.formDataValidacion.fechaInicio.getMonth() + 1}/${this.formDataValidacion.fechaInicio.getDate()}`;
    let fechaFin = `${this.formDataValidacion.fechaFin.getFullYear()}/${this.formDataValidacion.fechaFin.getMonth() + 1}/${this.formDataValidacion.fechaFin.getDate()}`;

    let respuesta:any
    respuesta = await this.EjecutaInsertaPaga(this.formDataValidacion.periodoId, this.formDataValidacion.periodo, this.formDataValidacion.tipoNomina, fechaInicio, fechaFin, opcion)
    //console.log(respuesta);
    
    Report.success(
      'Acción ejecutada',
      respuesta.msj,
      'Ok'
    )

    this.FechasPaga(this.anioActual, this.mesActual);
    this.popupPagasVisible = false

  }

  EjecutaInsertaPaga(periodoId:number,periodo:number,tipoNomina:number,fechaInicio:string,fechaFin:string, opcion:number){
    return new Promise((resolve, reject) => {
      this.consultaSicoss.InsertaBorraFechapaga(periodoId,periodo,tipoNomina,fechaInicio,fechaFin, opcion).subscribe((resp:any) => {
        resolve(resp[0])
      })
    
    })
  }

   onExporting(e:any){

    let excel = new ExcelClass()
    let msj = excel.onExporting(e,'data','Calendario pagas nómina')

   }



}
