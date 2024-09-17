import { Component, OnInit } from "@angular/core";
import { AsientoContable, Pagas } from "../visualiza-poliza/visualiza-poliza.model";
import { CatalogosSicossService } from "src/app/shared/services/catalogosSicoss.service";
import CustomStore from "devextreme/data/custom_store";
import { catchError, lastValueFrom, of } from "rxjs";
import { ConsultaPolizaNominaService } from "src/app/shared/services/consulta-poliza-nomina.service";
import { ConsultaPolizaSicossService } from "src/app/shared/services/consulta-poliza-sicoss.service";
import { CurrencyPipe } from "@angular/common";
import { ExcelClass } from 'src/app/shared/services/excelClass.service';
import { Loading, Report } from "notiflix";

@Component({
    selector: 'app-visualiza-poliza-empleado',
    templateUrl: './visualiza-poliza-empleado.component.html',
    styleUrls: ['./visualiza-poliza-empleado.component.scss'],
  })
  export class VisualizaPolizaEmpleadoComponent implements OnInit {

  lstMeses: { id: number; text: string }[];
  lstAnios: any = [];
  lstEmpresasPagadoras: any;
  lstEmpresas: any;
  anioActual: number;
  mesActual: number;
  lstQuincenas: Pagas[] = [];
  periodo: any;
  sucursal: string = '';
  lstAsientoContable: AsientoContable[] = [];
  loadingVisible: boolean = false;
  verAsiento: boolean = false;
  searchModeOption = 'contains';
  generaPivote: boolean = false;
  //camposPivote: campoPivote[] = [];
  
  pivotGridDataSource: any;

  gridBoxValue: any[]=[];
  gridAsientoFinal: any[] = []

  esAbierta:boolean = false
  searchExprOption: any = 'paga';

  objUsuario:any={}
  gridBoxPagaValue: any[]=[];

    constructor(private nominaService: ConsultaPolizaNominaService, private catSicoss: CatalogosSicossService, private sicoss:ConsultaPolizaSicossService){
      let fecha = new Date();
      this.anioActual = fecha.getFullYear();
      this.mesActual = fecha.getMonth() + 1;
      this.Pagas(this.anioActual, this.mesActual);
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
    }

    ngOnInit(): void {
      this.objUsuario = sessionStorage.getItem('login')
      this.objUsuario = JSON.parse(this.objUsuario)
      
      this.Anios();
      this.LugaresTrabajo();
      
        
    }

    AnioSelect(e: any) {
      this.anioActual = e.value;
      this.Pagas(e.value, this.mesActual);
    }
  
    MesSelect(e: any) {
      this.mesActual = e.value;
      this.Pagas(this.anioActual, e.value);
    }
  
    PeriodoSelected(e: any) {
      this.periodo = this.lstQuincenas.filter((x) => x.paga === e.value)[0];
    }
  
    SucursalSelect(e: any) {
      this.sucursal = e.value;
    }

    Pagas(anio: number, mes: number) {

      Loading.hourglass('Obteniendo pagas, espere por favor...')
      this.catSicoss.FechasPagas(anio,mes).subscribe((resp:any) => {
        this.lstQuincenas = []
        this.lstQuincenas = resp
        Loading.remove()
      })

    }

    Anios() {
      this.nominaService.ListaAnios().subscribe((resp) => {
        this.lstAnios = resp;
      });
    }
  
    LugaresTrabajo() {
  
      this.catSicoss.LugaresTrabajoUsuario(this.objUsuario.idUsuario).subscribe((resp) => {
        this.lstEmpresas = resp
        let source$ = of(resp)
        this.lstEmpresasPagadoras = new CustomStore({
          loadMode:'raw',
          key:'Centro_ID',
          load(){
            return lastValueFrom(source$)
          }
        })
      })
    }

    async AsientoContable() {
      this.loadingVisible = true;
      this.lstAsientoContable = [];
      this.gridAsientoFinal = [];
      this.verAsiento = false;
      this.generaPivote = false

      console.log(this.gridBoxPagaValue);
      
      if(this.gridBoxValue.length === 0){
        Report.warning('Aviso','Selecciona por lo menos una sucursal','Ok',()=>{this.loadingVisible = false;})

        return
      }
  
      for (let i = 0; i < this.gridBoxValue.length; i++) {
        const idSucursal = this.gridBoxValue[i];
  
          let respuesta:any=[]
          let con:any = []

          if(this.gridBoxPagaValue.length === 0){
            Report.warning('Aviso','Selecciona por lo menos una fecha de paga','Ok',()=>{this.loadingVisible = false;})
    
            return
          }

          for (let i = 0; i < this.gridBoxPagaValue.length; i++) {
            const paga = this.gridBoxPagaValue[i];
            
            con=await this.ConsultaAsiento(idSucursal, paga.fechasPaga, paga.frecuencia, paga.tipo)
            respuesta =respuesta.concat(con)
          }
          
          
          
          if(respuesta !== null){
            
            this.lstAsientoContable.push(respuesta);
  
            let nomSucursal = this.lstEmpresas.find((x:any) => x.Centro_ID === idSucursal)
            
            for (let j = i; j < this.lstAsientoContable.length; j++) {
              let element:any = this.lstAsientoContable[j];
      
              element.forEach((ele:any) => {
                ele.sucursal = nomSucursal?.Descripcion
              });
              
            }
          }
  
      }
  
      for (let i = 0; i < this.lstAsientoContable.length; i++) {
        const element:any = this.lstAsientoContable[i];
        
        element.forEach((ele:any) => {
        this.gridAsientoFinal.splice(0,0,ele)  
        });
        
      }
  
      this.loadingVisible = false
      this.verAsiento = true;
    }

    // ConsultaAsiento(idSucursal:number){
    //   return new Promise((resolve, reject) =>{
  
    //     this.sicoss.ConsultaAsientoPolizaBproEmpleadoSicoss(idSucursal, this.periodo.fechasPaga, this.periodo.frecuencia, this.periodo.tipo, this.esAbierta  )
    //     .pipe(
    //       catchError((err) =>{
    //         this.loadingVisible = false
    //         throw `${err}`
    //       })
    //     )
    //     .subscribe((resp:any) =>{
    //       resolve(resp)
    //     })
    //   })
    // }

    ConsultaAsiento(idSucursal:number, fechasPaga:string, frecuencia:number, tipo:number){
      return new Promise((resolve, reject) =>{
  
        this.sicoss.ConsultaAsientoPolizaBproEmpleadoSicoss(idSucursal, fechasPaga, frecuencia, tipo, this.esAbierta  )
        .pipe(
          catchError((err) =>{
            this.loadingVisible = false
            throw `${err}`
          })
        )
        .subscribe((resp:any) =>{
          resolve(resp)
        })
      })
    }

    customizeCurrency(data: any) {
      if (data.value !== undefined) {
        return new CurrencyPipe('en-US').transform(data.value.toString());
      } else {
        return data;
      }
    }
  
    customizeCurrencyTotalGral(data: any) {
      if (data.value !== undefined) {
        return `Total Gral: ${new CurrencyPipe('en-US').transform(data.value.toString())}`;
      } else {
        return data;
      }
    }
  
    customizeCurrencyTotal(data: any) {
      if (data.value !== undefined) {
        return `Total: ${new CurrencyPipe('en-US').transform(data.value.toString())}`;
      } else {
        return data;
      }
    }

    onContentReady(e: any) {
      e.component.option('loadPanel.enabled', false);
    }

    onCellPrepared(e: any) {
      if (e.rowType === 'data' && e.column.dataField === 'estatusCuenta') {
        if (e.data.estatusCuenta === 'ACTIVA') {
          e.cellElement.className += 'existe';
        } else {
          e.cellElement.className += 'noExiste';
        }
      }
  
      if (e.rowType === 'data' && e.column.dataField === 'existeBPRO') {
        if (e.data.existeBPRO !== false) {
          e.cellElement.className += 'existe';
        } else {
          e.cellElement.className += 'noExiste';
        }
      }
    }

    switchValueChanged(e: any) {
      const previousValue = e.previousValue;
      this.generaPivote = e.value;
  
      if (this.generaPivote) {
        this.pivotGridDataSource = {
          fields: [
            {
              caption: 'Lugar de trabajo',
              width: 250,
              dataField: 'sucursal',
              area: 'row',
              sortBySummaryField: 'Total',
            },
            {
              caption: 'Id RH',
              width: 250,
              dataField: 'id_hr',
              area: 'row',
              sortBySummaryField: 'Total',
            },
            {
            caption: 'ConceptoMeta',
            width: 250,
            dataField: 'concepto',
            area: 'row',
            sortBySummaryField: 'Total',
          }, {
            caption: 'Pagas',
            dataField: 'fechaPaga',
            dataType: 'string',
            area: 'column',
            selector:function(data:any){
              return `Fecha Paga ${data['fechaPaga']}`
            }
        }, {
            caption: 'Total Debe',
            dataField: 'debe',
            dataType: 'number',
            summaryType: 'sum',
            customizeText: function (cellInfo:any) {
              
              return new CurrencyPipe('en-US').transform(cellInfo.value.toString());
          },
            area: 'data',
          },
          {
            caption: 'Total Haber',
            dataField: 'haber',
            dataType: 'number',
            summaryType: 'sum',
            customizeText: function (cellInfo:any) {
              return new CurrencyPipe('en-US').transform(cellInfo.value.toString());
          },
            area: 'data',
          }],
          store: this.gridAsientoFinal,
        };
      }
    }

    EsPolizaAbierta(){
      if(this.lstAsientoContable.length >= 1){
        this.AsientoContable()
      }
    }

    onExporting(e:any){

      let excel = new ExcelClass()
      let msj = excel.onExporting(e,'datos', `Pólizas por empleado mes ${this.mesActual} año ${this.anioActual}`)
  
     }

    onExportingPivot(e:any){

      let excel = new ExcelClass()
      let msj = excel.onExportingPivot(e,'datos', `Pólizas pivote por empleado mes ${this.periodo.mes}`)
  
     }

  }