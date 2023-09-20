import { Component, OnInit } from "@angular/core";
import { MesesServices } from 'src/app/shared/services/meses.service';
import { CatalogosSicossService } from 'src/app/shared/services/catalogosSicoss.service';
import { ConsultaPolizaNominaService } from 'src/app/shared/services/consulta-poliza-nomina.service';
import { ConsultaPolizaSicossService } from 'src/app/shared/services/consulta-poliza-sicoss.service';
import { Loading, Report } from 'notiflix';

@Component({
    selector:'app-confPaga',
    templateUrl:'./conf-pagas.component.html',
    styleUrls:['./conf-pagas.component.scss']
})

export class ConfPagaComponent implements OnInit{

    labelMode = 'floating';
    lstQuincenas:any = []
    lstMeses:any = []
    lstAnios:any = []
    lstEmpresas:any = []
    anioActual:number = 0;
    mesActual:number = 0;

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
    lstPeriodosSicos: any;
    lstTipoNominaSicoss: any;

    constructor(
        private nominaService: ConsultaPolizaNominaService, 
        private catSicoss: CatalogosSicossService, 
        private polSicoss:ConsultaPolizaSicossService, 
        private consultaSicoss: ConsultaPolizaSicossService,
        private _mesService: MesesServices
    ){
        this.lstMeses = this._mesService.meses()
        let fecha = new Date()
        this.anioActual = fecha.getFullYear()
        this.mesActual = fecha.getMonth()+1
    }

    async ngOnInit(): Promise<void> {
        this.Anios()
        this.FechasPaga(this.anioActual, this.mesActual)
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

    AnioSelect(e:any){
        console.log(e)
        this.anioActual = e.value
        this.FechasPaga(e.value, this.mesActual)
    }
    
      MesSelect(e:any){
        this.mesActual = e.value
        this.FechasPaga(this.anioActual, e.value)
    }

    FechasPaga(anio:any, mes:any){

        this.catSicoss.FechasPagas(anio,mes).subscribe(resp =>{
          this.lstQuincenas = []
          this.lstQuincenas = resp
        })
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
    }

    EjecutaInsertaPaga(periodoId:number,periodo:number,tipoNomina:number,fechaInicio:string,fechaFin:string, opcion:number){
        return new Promise((resolve, reject) => {
          this.consultaSicoss.InsertaBorraFechapaga(periodoId,periodo,tipoNomina,fechaInicio,fechaFin, opcion).subscribe((resp:any) => {
            resolve(resp[0])
          })
        
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

}