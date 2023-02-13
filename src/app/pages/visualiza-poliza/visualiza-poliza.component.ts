import { CurrencyPipe } from '@angular/common';
import { Component, OnInit,  } from '@angular/core';
import { catchError, finalize, lastValueFrom, of } from 'rxjs';
import { ConsultaPolizaNominaService } from 'src/app/shared/services/consulta-poliza-nomina.service';
import {
  LugarTrabajoModel,
  Pagas,
  AsientoContable,
  campoPivote
} from './visualiza-poliza.model';
import CustomStore from 'devextreme/data/custom_store';
import { ConsultaPolizaSicossService } from 'src/app/shared/services/consulta-poliza-sicoss.service';
import { CatalogosSicossService } from 'src/app/shared/services/catalogosSicoss.service';

type AOA = any[][];

@Component({
  selector: 'app-visualiza-poliza',
  templateUrl: './visualiza-poliza.component.html',
  styleUrls: ['./visualiza-poliza.component.scss'],
})
export class VisualizaPolizaComponent implements OnInit {

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
  camposPivote: campoPivote[] = [];
  
  pivotGridDataSource: any;

  gridBoxValue: any[]=[];
  gridAsientoFinal: any[] = []

  constructor(private nominaService: ConsultaPolizaNominaService, private catSicoss: CatalogosSicossService, private sicoss:ConsultaPolizaSicossService) {
    
    let fecha = new Date();
    this.anioActual = fecha.getFullYear();
    this.mesActual = fecha.getMonth() + 1;

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
    this.Anios();
    this.LugaresTrabajo();
    this.Pagas(this.anioActual, this.mesActual);

  }
  b64toBlob(b64Data:any, contentType='', sliceSize=512){
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
}

  Pagas(anio: number, mes: number) {

    this.catSicoss.FechasPagas(anio,mes).subscribe((resp:any) => {
      this.lstQuincenas = []
      this.lstQuincenas = resp
    })

    // this.nominaService.FechasPagas(anio, mes).subscribe((resp) => {
    //   this.lstQuincenas = [];
    //   this.lstQuincenas = resp;
    // });
  }

  Anios() {
    this.nominaService.ListaAnios().subscribe((resp) => {
      this.lstAnios = resp;
    });
  }

  LugaresTrabajo() {

    this.catSicoss.LugaresTrabajo().subscribe((resp) => {
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

    // this.nominaService.ListaEmpresasPoliza().subscribe((resp) => {
    //   this.lstEmpresas = resp;
    //   let source$ = of(resp)
    //   this.lstEmpresasPagadoras =  new CustomStore({
    //     loadMode: 'raw',
    //     key: "workLocat",
    //     load() {
    //       return lastValueFrom(source$ );
    //     }
    //   });
    // });
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

  async AsientoContable() {
    this.loadingVisible = true;
    this.lstAsientoContable = [];
    this.gridAsientoFinal = [];
    this.verAsiento = false;
    this.generaPivote = false

    for (let i = 0; i < this.gridBoxValue.length; i++) {
      const idSucursal = this.gridBoxValue[i];

        let respuesta:any = await this.ConsultaAsiento(idSucursal)
        
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

  ConsultaAsiento(idSucursal:number){
    return new Promise((resolve, reject) =>{

      this.sicoss.ConsultaAsientoPolizaBproSicoss(idSucursal, this.periodo.fechasPaga, this.periodo.frecuencia, this.periodo.semQuin  )
      .pipe(
        catchError((err) =>{
          this.loadingVisible = false
          throw `${err}`
        })
      )
      .subscribe((resp:any) =>{
        resolve(resp)
      })


      // this.nominaService.ConsultaAsientoPolizaBpro(idSucursal,this.periodo.fechasPaga, this.periodo.tipo)
      // .pipe(
      //   // finalize(() => (this.loadingVisible = false)),
      //   catchError((err) => {
      //     this.loadingVisible = false;
      //     throw `${err}`;
      //   })
      // )
      // .subscribe((resp:any) => {
      //   resolve(resp)
      // });

      // this.nominaService.ObtieneAsientoContable(idSucursal, this.periodo.fechasPaga, this.periodo.tipo,this.periodo.frecuencia)
      // .pipe(
      //   // finalize(() => (this.loadingVisible = false)),
      //   catchError((err) => {
      //     this.loadingVisible = false;
      //     throw `${err}`;
      //   })
      // )
      // .subscribe((resp:any) => {
      //   resolve(resp)
      // });
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


  customizeTextConfBpro(data: any) {

    let valor:string =''

    if(data.value === true){
      valor = 'Existe'
    }

    if(data.value === false){
      valor = 'No existe'
    }

    if(data.value === undefined || data.value === null){
      valor = ''
    }

    return valor;
    //return data.value === true ? 'Existe' : 'No existe';
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
          },{
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
}
