import {Component, OnInit, ViewChild} from '@angular/core';
import {ConsultaPolizaNominaService} from 'src/app/shared/services/consulta-poliza-nomina.service';
import {campoPivote, LugarTrabajoModel, Pagas, pagasSicoss} from '../visualiza-poliza/visualiza-poliza.model';
import {catchError, finalize, findIndex, from, lastValueFrom, map, of} from 'rxjs';
import { filter, find } from 'rxjs/operators'; 
import {CurrencyPipe} from '@angular/common';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { DxDataGridComponent } from 'devextreme-angular';
import { dxPivotGridSummaryCell } from 'devextreme/ui/pivot_grid';
import CustomStore from 'devextreme/data/custom_store';
import { CatalogosSicossService } from 'src/app/shared/services/catalogosSicoss.service';
import { ConsultaPolizaSicossService } from 'src/app/shared/services/consulta-poliza-sicoss.service';

@Component({selector: 'app-vista-previa', templateUrl: './vista-previa.component.html', styleUrls: ['./vista-previa.component.scss']})
export class VistaPreviaComponent implements OnInit {
  @ViewChild('drillDownDataGrid')
  drillDownDataGrid!: DxDataGridComponent;
    lstMeses : {
        id: number;
        text: string
    }[];
    lstAnios : any = [];
    lstEmpresasPagadoras : any;
    anioActual : number;
    mesActual : number;
    lstQuincenas : Pagas[] = [];
    // periodo : pagasSicoss = {
    //     fechasPaga: '',
    //     semQuin: 0,
    //     tipo: 0,
    //     frecuencia: 0,
    //     paga: '',
    //     apagado: 0,
    //     anio:0,
    //     mes:0
    // };
    periodo:any
    sucursal : string = '';
    searchModeOption = 'contains';
    lstDatosSabana : any[] = [];
    loadingVisible : boolean = false;
    verAsiento : boolean = false;
    generaPivote : boolean = false;
    camposPivote : campoPivote[] = [];
    pivotGridDataSource : any;

    showTotalsPrior = false;
    rowsDataFieldArea = false;
    treeHeaderLayout = true;
    lstGrupoPivote : any;

    drillDownDataSource: any;
    salesPopupVisible = false;
    salesPopupTitle = '';
    lstGruposMeta : any =[];
    columnasDownDrill: any = [];

    gridBoxValue: any[]=[];
    grupos: any;
    arrColores!: any[];

    catalogoConceptos!:any

    constructor(private nominaService : ConsultaPolizaNominaService, private catSicoss: CatalogosSicossService, private sicoss:ConsultaPolizaSicossService) {
      //this.catalogoConceptos = 
      this.CatalogoConceptos()
      this.LugaresTrabajo();
        let fecha = new Date();
        this.anioActual = fecha.getFullYear();
        this.mesActual = fecha.getMonth() + 1;

        this.lstMeses = [
            {
                id: 1,
                text: 'Enero'
            },
            {
                id: 2,
                text: 'Febrero'
            },
            {
                id: 3,
                text: 'Marzo'
            },
            {
                id: 4,
                text: 'Abril'
            }, {
                id: 5,
                text: 'Mayo'
            }, {
                id: 6,
                text: 'Junio'
            }, {
                id: 7,
                text: 'Julio'
            }, {
                id: 8,
                text: 'Agosto'
            }, {
                id: 9,
                text: 'Septiembre'
            }, {
                id: 10,
                text: 'Octubre'
            }, {
                id: 11,
                text: 'Noviembre'
            }, {
                id: 12,
                text: 'Diciembre'
            },
        ];

    }

    async ngOnInit(): Promise<void> {
     // this.catalogoConceptos = await this.CatalogoConceptos()
        this.Anios();
        
        this.Pagas(this.anioActual, this.mesActual);
        this.GruposMeta()

    }

    CatalogoConceptos(){
      //return new Promise((resolve, reject) => {
        this.catSicoss.ConceptosPoliza().subscribe(resp =>{
          this.catalogoConceptos = resp
          //resolve(resp)
        })
      //})
    }

    GruposMeta(){
      //this.nominaService.GruposMeta().subscribe(resp =>{
      this.catSicoss.SicossGrupo().subscribe(resp =>{
        this.lstGruposMeta = resp
      
        this.arrColores = []

        this.grupos = this.lstGruposMeta.reduce(function (a:any,b:any){ if(a.indexOf(b.nombre_grupo) === -1){a.push(b.nombre_grupo)} return a},[])
 
       for (let i = 0; i < this.grupos.length; i++) {
         let conceptoColor = {
           concepto:'',
           color:''
         }
         const concepto = this.grupos[i];
         conceptoColor.concepto = concepto
         conceptoColor.color = this.Color()
         this.arrColores.push(conceptoColor)
 
       }
      })
    }

    Pagas(anio : number, mes : number) {

        this.catSicoss.FechasPagas(anio, mes).subscribe((resp:any) => {
          this.lstQuincenas = []
          this.lstQuincenas = resp

        })

        // this.nominaService.FechasPagas(anio, mes).subscribe((resp) => {
        //     this.lstQuincenas = [];
        //     this.lstQuincenas = resp;
        // });
    
      }

    Anios() {
        this.nominaService.ListaAnios().subscribe((resp) => {
            this.lstAnios = resp;
        });
    }

    LugaresTrabajo() {

        this.catSicoss.LugaresTrabajo().subscribe((resp) => {
            let source$ = of(resp)
            this.lstEmpresasPagadoras =  new CustomStore({
              loadMode: 'raw',
              key: "Centro_ID",
              load() {
                return lastValueFrom(source$ );
              }
            });

            console.log(this.lstEmpresasPagadoras);
            
        })
        // this.nominaService.ListaEmpresasPoliza().subscribe((resp) => {
        //     //this.lstEmpresasPagadoras = resp;  
        //     let source$ = of(resp)
        //     this.lstEmpresasPagadoras =  new CustomStore({
        //       loadMode: 'raw',
        //       key: "workLocat",
        //       load() {
        //         return lastValueFrom(source$ );
        //       }
        //     });
        // });
    }

    AnioSelect(e : any) {
        this.anioActual = e.value;
        this.Pagas(e.value, this.mesActual);
    }

    MesSelect(e : any) {
        this.mesActual = e.value;
        this.Pagas(this.anioActual, e.value);
    }

    PeriodoSelected(e : any) {
        this.periodo = this.lstQuincenas.filter((x) => x.paga === e.value)[0];
    }

    SucursalSelect(e : any) {
        this.sucursal = e.value;
    }

    async SabanaMeta() {
        this.loadingVisible = true;
        this.lstDatosSabana = [];
        this.generaPivote = false;

          let sabana:any = []
          for (let i = 0; i < this.gridBoxValue.length; i++) {
            
            let element = this.gridBoxValue[i];

              this.loadingVisible = true;
              sabana = await this.ConsultaSabana(element)
              
              if(sabana.length >0 ){
                for (let j = 0; j < sabana.length; j++) {
                  let e = sabana[j];
                  this.lstDatosSabana.push(e) 
                }
              }
            
          }
          this.verAsiento = true;
          this.loadingVisible = false;
        

    }

    ConsultaSabana(sucursal:number){
      return new Promise((resolve, reject) =>{

        this.sicoss.vistaPrevia(this.periodo.anio, this.periodo.mes, this.periodo.frecuencia, this.periodo.semQuin, sucursal, this.periodo.tipo)
         .pipe(
            finalize(() => (this.loadingVisible = false))
            , catchError((err) => {
              this.loadingVisible = false;
              resolve([])
              throw `${err}`;
              })
          ).subscribe((resp : any) => {
              resolve(resp);
          });

          // this.nominaService.ConsultaSabanaMeta(sucursal, this.periodo.fechasPaga, this.periodo.tipo, this.periodo.frecuencia)
          // .pipe(
          //   finalize(() => (this.loadingVisible = false))
          //   , catchError((err) => {
          //     this.loadingVisible = false;
          //     resolve([])
          //     throw `${err}`;
          //     })
          // ).subscribe((resp : any) => {
          //     resolve(resp);
          // });

      })
    }

    async switchValueChanged(e : any) {
        const previousValue = e.previousValue;
        this.generaPivote = e.value;
        let sabanaPivote:any

        if (this.generaPivote) {
          
            this.loadingVisible = true;
            this.lstGrupoPivote = []
            for (let i = 0; i < this.gridBoxValue.length; i++) {
              let element = this.gridBoxValue[i];
                sabanaPivote = await this.ConsultaSabanaGrupo(element)
                if(sabanaPivote.length > 0){
                 for (let i = 0; i < sabanaPivote.length; i++) {
                  const elePivote = sabanaPivote[i];
                  this.lstGrupoPivote.push(elePivote)
                  
                 }
                 this.ConstruyePivote()
                }              
            }

            this.loadingVisible = false;
        }
    }

    ConsultaSabanaGrupo(sucursal:number){
      return new Promise((resolve, reject) =>{
       
      this.sicoss.SabanaGrupoSicoss(this.periodo.anio, this.periodo.mes, this.periodo.frecuencia, this.periodo.semQuin, sucursal, this.periodo.tipo,this.periodo.fechasPaga)
      .pipe(
        catchError((err) =>{
          this.loadingVisible = false
          throw `${err}`
        })
      ).subscribe((resp:any) => {
        resolve(resp[0].final)
      })
      //   this.nominaService.ConsultaSabanaMetaGrupo(sucursal, this.periodo.fechasPaga, this.periodo.tipo, this.periodo.frecuencia)
      //   .pipe(
      //     catchError((err) => {
      //     this.loadingVisible = false;
      //     throw `${err}`;
      // })).subscribe((resp : any) => {
      //         resolve(resp[0].final);
      //     });
      })
    }

    ConstruyePivote(){
      this.pivotGridDataSource = new PivotGridDataSource( {
        fields: [
            {
                caption: 'Lugar de trabajo',
                width: 250,
                dataField: 'Lugar de trabajo',
                expanded: true,
                area: 'row'
            }, {
              caption: 'GRUPO',
              width: 250,
              dataField: 'grupo',
              expanded: false,
              area: 'row'
          }, {
                caption: 'Id RH',
                width: 150,
                dataField: 'Id RH',
                expanded: false,
                area: 'row',
                selector:function(data:any){
                  return `Id RH ${data['Id RH']}`
                }
            }, {
                  caption: 'Pagas',
                  dataField: 'fechaPaga',
                  dataType: 'string',
                  area: 'column',
                  selector:function(data:any){
                    return `Fecha Paga ${data['fechaPaga']}`
                  }
              }
        ],
        store: this.lstGrupoPivote
    });

    for (let i = 0; i < this.lstGrupoPivote.length; i++) {
        const element = this.lstGrupoPivote[i];

        let nuevoElemento = {
            caption: '',
            dataField: '',
            dataType: 'number',
            summaryType: 'sum',
            filterType: 'include',
            customizeText: function (cellInfo : any) {
                if (cellInfo.value !== undefined && !isNaN(cellInfo.value)) {
                    return new CurrencyPipe('en-US').transform(cellInfo.value.toString());
                } else {
                    return new CurrencyPipe('en-US').transform(0);
                }
            },
            area: 'data',
            isMeasure : true
        };

        for(var campo in element){

          of(campo)
            .subscribe(x=>{
              if (x!== 'Lugar de trabajo' && x !== 'Id RH' && x !== 'grupo' && x !== 'Centro de costos' && x !== 'fechaPaga' && x !== 'Desc unidad org' && x !== 'unidad org') {
                
                of(this.pivotGridDataSource._fields)
                .pipe(
                ).subscribe((f:any) =>{
                  let i = -1
                  i = f.findLastIndex((f: { caption: string; }) => f.caption === x)
                  if(i === -1){
                  nuevoElemento.caption = x;
                  nuevoElemento.dataField = x;
                  this.pivotGridDataSource._fields.push({...nuevoElemento});  
                  }
                  
                })
              
              }
            })
        }
      }


      
      // let grupos = this.lstGruposMeta.reduce(function (a:any,b:any){ if(a.indexOf(b.nombre_grupo) === -1){a.push(b.nombre_grupo)} return a},[])
      // for (let i = 0; i < grupos.length; i++) {
      //   let camposSuma=''
        
      //   let nuevoElementoSumatoria = {
      //     area                   : "data",   
      //     caption                : "", 
      //     summaryType            : "custom",
      //     calculateSummaryValue: (e:any) => {
      //       console.log(e.value('Salario Base', true))
      //       return  e.value('Salario Base', true)
      //     }           
      //   }

      //   const nombreGrupo = grupos[i];

      //   let campos = this.lstGruposMeta.filter((X:any) => X.nombre_grupo === nombreGrupo)

      //   for (let j = 0; j < campos.length; j++) {
      //     const element = campos[j].alias;
      //     if(j>=5){
      //       camposSuma += element+'+'
      //     }          
      //   }

      //   if(nombreGrupo === 'SUELDOS'){
      //     nuevoElementoSumatoria.caption= nombreGrupo
      //     this.pivotGridDataSource._fields.push({...nuevoElementoSumatoria}); 
      //   }

      // }

      //this.pivotGridDataSource._fields.push({...nuevoElementoSumatoria}); 

    }

    onContentReady(e : any) {
        e.component.option('loadPanel.enabled', false);
    }

    /**
   * Se usa para poder darle una clase CSS a una celda
   * @param e
   */
     onCellPrepared(e:any) {
      let { cell, area, cellElement } = e
      cell.area = area;
      if (this.isDataCell(cell) || this.isTotalCell(cell)) {
        const appearance = this.getConditionalAppearance(cell);
        Object.assign(cellElement.style, this.getCssStyles(appearance));
      }
    }

    customizeCurrency(data : any) {
        if (data !== undefined) {

          if(data.value === null){
            return new CurrencyPipe('en-US').transform('0');
          }

          if(data.value !== null){
            return new CurrencyPipe('en-US').transform(data.value.toString());
          }

        } else {
            return data;
        }
    }

    customizeCurrencyTotal(data: any) {
      if (data !== undefined) {

        if(data.value === null){
          return `Total: ${new CurrencyPipe('en-US').transform('0')}`;
        }

        if(data.value !== null){
          return `Total: ${new CurrencyPipe('en-US').transform(data.value.toString())} `;
        }

      } else {
          return data;
      }
    }

    getCssStyles(e:any) {
      if(e !== undefined){
        let  { fill, font, bold } = e
        return {
          'background-color': `#${fill}`,
          color: `#${font}`,
          'font-weight': bold ? 'bold' : undefined,
        };
      }
   
      return
  }

    isDataCell(cell:any) {
      return (cell.area === 'data' && cell.rowType === 'D' && cell.columnType === 'D');
    }
  
    isTotalCell(cell:any) {
      return (cell.type === 'T' || cell.type === 'GT' || cell.rowType === 'T' || cell.rowType === 'GT' || cell.columnType === 'T' || cell.columnType === 'GT');
    }

    getConditionalAppearance(cell:any) {
      if (this.isTotalCell(cell)) {
        return { fill: 'F2F2F2', font: '3F3F3F', bold: true };
      }
      const { value, rowPath  } = cell;

      // if (value < 0) {
      //   return { font: '9C0006', fill: 'FFC7CE', bold: false };
      // }
      // if (value > 0) {
      //   return { font: '006100', fill: 'C6EFCE', bold: false };
      // }
      // return { font: '9C6500', fill: 'FFEB9C', bold: false };

      for (let r = 0; r < rowPath.length; r++) {
        const element = rowPath[r];

        let encontrado = this.arrColores.filter(x => x.concepto === element)

        if (encontrado.length > 0 ){
          if((value > 0 || value < 0)){
            return { font: '000000', fill: encontrado[0].color, bold: false };
          }
        }

        // if (element === 'SUELDOS' && (value > 0 || value < 0)){
        //   return { font: '000000', fill: 'C6EFCE', bold: false };
        // }
        // if (element === 'DESTAJO' && (value > 0 || value < 0)){
        //   return { font: '000000', fill: 'FFC7CE', bold: false };
        // }
        // if (element === 'IMPUESTOS DF O ESTATAL' && (value > 0 || value < 0)){
        //   return { font: '000000', fill: '3db2d8', bold: false };
        // }
        // if (element === 'IMSS PATRONAL' && (value > 0 || value < 0)){
        //   return { font: '000000', fill: 'FFC99C', bold: false };
        // }
        // if (element === 'INFONAVIT 5%' && (value > 0 || value < 0)){
        //   return { font: '000000', fill: 'BC6116', bold: false };
        // }
        // if (element === 'SAR' && (value > 0 || value < 0)){
        //   return { font: '000000', fill: 'E7AC7A', bold: false };
        // }
        // if (element === 'CYV EMPRESA' && (value > 0 || value < 0)){
        //   return { font: '000000', fill: 'E1BE6B', bold: false };
        // }
        // if (element === 'DESTAJO' && (value > 0 || value < 0)){
        //   return { font: '000000', fill: 'E1BE6A', bold: false };
        // }
        // if (element === 'VACACIONES' && (value > 0 || value < 0)){
        //   return { font: '000000', fill: 'E1BE5B', bold: false };
        // }
        // if (element === 'COMISIONES' && (value > 0 || value < 0)){
        //   return { font: '000000', fill: 'B1BE5B', bold: false };
        // }
        
      }

       return //{ font: '9C6500', fill: 'FFEB9C', bold: false };
    }

    Color(){
      const randomColor = Math.floor(Math.random()*16777215).toString(16);
      return randomColor;
      
    }

    onPivotCellClick(e:any) {
      
      this.columnasDownDrill = []
      this.salesPopupVisible = false

      if (e.area == 'data') {
        const rowPathLength = e.cell.rowPath.length;
        //const rowPathName = e.cell.rowPath[rowPathLength - 1];

        for (let j = 0; j < e.cell.rowPath.length; j++) {
          const rowPathName = e.cell.rowPath[j];
          
          let filtros = this.lstGruposMeta.filter((x:any) => x.nombre_grupo === rowPathName)

          if(filtros.length > 0){
            for (let i = 0; i < filtros.length; i++) {
            const elementFiltro = filtros[i];
  
              if(elementFiltro.alias !== 'unidad org' && elementFiltro.alias !== 'Id RH' && elementFiltro.alias !== 'Lugar de trabajo'){
                this.columnasDownDrill.push(elementFiltro.alias)
              }
            
            } 
            this.drillDownDataSource = this.pivotGridDataSource.createDrillDownDataSource(e.cell);
            this.salesPopupTitle = `${rowPathName || 'Total'} Detalle`;
            this.salesPopupVisible = true;
          }


        }        
      }
    }

    onPopupShown() {
      this.drillDownDataGrid.instance.updateDimensions();
    }

    onDropDownBoxValueChanged(e:any) {
      console.log(this.gridBoxValue);
    }
    
}

