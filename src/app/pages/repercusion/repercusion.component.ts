import { CurrencyPipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConsultaGastosServices } from 'src/app/shared/services/consulta-gastos.service';
import { ConsultaPolizaNominaService } from 'src/app/shared/services/consulta-poliza-nomina.service';
declare var $: any;
import Swal from 'sweetalert2';
import { DataBalComBono, FormDataValidacion } from './repercusion.model';
import { Workbook } from 'exceljs';
import { exportDataGrid } from 'devextreme/excel_exporter';
import DataGrid from 'devextreme/ui/data_grid';
import { saveAs } from 'file-saver';
import { DxDataGridComponent } from 'devextreme-angular';
import { CorreoServices } from 'src/app/shared/services/correo.service';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { Report } from 'notiflix';

@Component({
  selector: 'repercusion',
  templateUrl: './repercusion.component.html',
  styleUrls: ['./repercusion.component.scss'],
})
export class RepercusionComponent implements OnInit {
  @ViewChild('completoGrid', { static: false })
  completoGrid!: DxDataGridComponent;

  @ViewChild('gridBalanza', { static: false })
  gridBalanza!: DxDataGridComponent;

  @ViewChild('gridComisiones', { static: false })
  gridComisiones!: DxDataGridComponent;

  @ViewChild('gridBono', { static: false })
  gridBono!: DxDataGridComponent;

  //fechaActual = new Date('2023-05-27')
  fechaActual = new Date();
  diaActual = this.fechaActual.getDate();
  mesActual = this.fechaActual.getMonth() + 1;
  anioActual = this.fechaActual.getFullYear();
  
  minDate: Date = new Date(this.fechaActual.getTime() + (24 * 60 * 60 * 1000));
  currentValue: any;
  lstFechasRepercusion: any;

  disableCalenda: boolean = false;
  lstQuincenas: any = [
    {
      id: 1,
      nombre: '1ra Quincena',
    },
    {
      id: 2,
      nombre: '2da Quincena',
    },
  ];

  quincenaSelected: any;
  lstResumenBalanzaCentralizado: any;
  loadingVisible: boolean = false;

  lstMeses: {
    id: number;
    text: string;
  }[];
  lstAnios: any = [];

  readonly allowedPageSizes = [5, 10, 20, 30, 'all'];

  lstResumenBalanzaComisionesBono: any;
  lstBalanza: any;
  lstComisiones: any;
  lstBono: any;
  lstOrdenesCompra: any;

  formDataValidacion: FormDataValidacion = {
    subTotalResumen: '$0.00',
    cargoBalanza: '$0.00',
    abonoBalanza: '$0.00',
    totalBalanza: '$0.00',
    totalComisiones: '$0.00',
    totalBonos: '$0.00',
    diferencia: '$0.00',
  };

  labelMode = 'floating';
  verDetalles: boolean = false;
  btnVerDetalle: string = 'Ver detalles';

  dataMes: any;
  objUltimaRepercusion: any = {
    fecha:''
  };
  respuestaOC:any
  lstFacturasCreadas:any

  disabledOC=false;

  fechaSolicitudFacturacion:any

  constructor(
    private gastosServices: ConsultaGastosServices,
    private nominaService: ConsultaPolizaNominaService,
    private correoServicce: CorreoServices
  ) {
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

    this.currentValue = this.fechaActual;

    this.dataMes = this.lstMeses.find((x) => x.id === this.mesActual);
  }

  async ngOnInit(): Promise<void> {

    this.Anios();
    this.lstFechasRepercusion = await this.FechasRepercusion();

    if (this.lstFechasRepercusion[0].estatus === 0) {
      
      // Swal.fire({
      //   title: this.lstFechasRepercusion[0].title,
      //   text: this.lstFechasRepercusion[0].msj,
      //   icon: 'info',
      //   allowOutsideClick: false,
      // });
      Report.warning(
        this.lstFechasRepercusion[0].title,
        this.lstFechasRepercusion[0].msj,
        'Ok'
      )

      return;
    }

    // if (this.lstFechasRepercusion[0].dia < this.diaActual) {
    //   this.disableCalenda = true;
    // }

    this.objUltimaRepercusion = this.obtenerUltimoElemento(
      this.lstFechasRepercusion
    );
    this.ConsultaOrdenesCompra();

    this.fechaSolicitudFacturacion = await this.ConsultaFechaSolicitudFactura(this.mesActual, this.anioActual, 1,0)
    console.log(this.fechaSolicitudFacturacion);
    this.ConsultarFacturas()
    
  }

  AnioSelect(e: any) {
    this.anioActual = e.value;
  }

  async MesSelect(e: any) {
    this.mesActual = e.value;
    this.dataMes = this.lstMeses.find((x) => x.id === this.mesActual);
    this.lstFechasRepercusion = await this.FechasRepercusion();

    this.objUltimaRepercusion = this.obtenerUltimoElemento(
      this.lstFechasRepercusion
    );

    console.log(this.objUltimaRepercusion);
    
    if(this.objUltimaRepercusion.estatus === 0){
      Report.warning(
        this.objUltimaRepercusion.title,
        this.objUltimaRepercusion.msj,
        'Ok'
      )
      return
    }

    this.ConsultaOrdenesCompra();
  }

  Anios() {
    this.nominaService.ListaAnios().subscribe(async (resp) => {
      this.lstAnios = resp;
      this.lstFechasRepercusion = await this.FechasRepercusion();
      this.objUltimaRepercusion = this.obtenerUltimoElemento(
        this.lstFechasRepercusion
      );
      this.ConsultaOrdenesCompra();
    });
  }

  FechasRepercusion() {
    return new Promise((resolve, reject) => {
      this.gastosServices
        .SelFechaEjecucionRepercusion(this.anioActual, this.mesActual)
        .subscribe((resp: any) => {
          resolve(resp);
        });
    });
  }

  async ProrrateoBalanza(numero:number){

    /**SE COMENTA PARA PROBAR EN LA SEGUNDA EJECUCION */
    //let respuesta = await this.EjecutaProrrateo(numero)
    
    Report.success(
      'Prorrateo de balanza',
      `Prorrateo de la quincena ${numero} ejecutado, puedes avanzar al paso 2`,
      'OK')
  }

  EjecutaProrrateo(numero:number){

    let dia:number = 0

    if( this.objUltimaRepercusion.estatus !== 0 || this.objUltimaRepercusion.estatus !== undefined || this.objUltimaRepercusion.estatus !== null )
    {
      dia = this.objUltimaRepercusion.dia 
    }

    if(this.objUltimaRepercusion.estatus === 0 || this.objUltimaRepercusion.estatus === undefined || this.objUltimaRepercusion.estatus === null )
    {
      dia = this.diaActual
    }

    return new Promise((resolve, reject) => {
      this.gastosServices.ProrrateoBalanza(this.mesActual, this.anioActual, numero,dia).subscribe((resp:any) =>{
        resolve(resp)
      })
    })
  }

  async GetResumenBalanza() {
    if (this.quincenaSelected === undefined || this.quincenaSelected === null) {
      // Swal.fire({
      //   title: 'Oops...',
      //   text: 'Selecciona la quincena que deseas consultar',
      //   icon: 'error',
      //   allowOutsideClick: false,
      // });
      
      Report.failure(
        'Oops...',
        'Selecciona la quincena que deseas consultar',
        'Ok'
      )

      return;
    }

    Swal.fire({
      title: 'Aviso',
      html: 'El proceso puede demorar varios minutos,</br> ¿deseas continuar?',
      confirmButtonText: 'Continuar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
      icon: 'warning',
    }).then(async (result) => {
      if (result.isConfirmed) {
        //this.loadingVisible = true;
        Loading.hourglass('Espere por favor...')
        this.lstResumenBalanzaCentralizado = await this.ResumenBalanzaCompleta(this.quincenaSelected);
        this.lstResumenBalanzaComisionesBono =
          await this.ResumenBalanzaComisionesBono(this.quincenaSelected);

        setTimeout(async () => {
          this.lstBalanza = this.EliminarElemento(
            this.lstResumenBalanzaComisionesBono[0],
            '0066'
          );
          this.lstComisiones = this.EliminarElemento(
            this.lstResumenBalanzaComisionesBono[1],
            '0066'
          );
          this.lstBono = this.EliminarElemento(
            this.lstResumenBalanzaComisionesBono[2],
            '0066'
          );

          let subTotalResumen = 0;
          let cargoBalanza = 0;
          let abonoBalanza = 0;
          let totalBalanza = 0;
          let totalComisiones = 0;
          let totalBonos = 0;
          let diferencia = 0;

          await this.sumarValor(
            this.lstResumenBalanzaCentralizado,
            'subTotal'
          ).then((resultado) => {
            subTotalResumen = resultado;
          });

          await this.sumarValor(this.lstBalanza, 'CARGO').then((resultado) => {
            cargoBalanza = resultado;
          });

          await this.sumarValor(this.lstBalanza, 'ABONO').then((resultado) => {
            abonoBalanza = resultado;
          });

          totalBalanza = cargoBalanza - abonoBalanza;

          await this.sumarValor(this.lstComisiones, 'CARGO').then(
            (resultado) => {
              totalComisiones = resultado;
            }
          );

          await this.sumarValor(this.lstBono, 'CARGO').then((resultado) => {
            totalBonos = resultado;
          });

          diferencia =
            totalBalanza -
            (Number(subTotalResumen) +
              Number(totalComisiones) +
              Number(totalBonos));

          this.formDataValidacion.subTotalResumen =
            new CurrencyPipe('en-US').transform(subTotalResumen.toString()) ||
            '0';
          this.formDataValidacion.cargoBalanza =
            new CurrencyPipe('en-US').transform(cargoBalanza.toString()) || '0';
          this.formDataValidacion.abonoBalanza =
            new CurrencyPipe('en-US').transform(abonoBalanza.toString()) || '0';
          this.formDataValidacion.totalBalanza =
            new CurrencyPipe('en-US').transform(totalBalanza.toString()) || '0';
          this.formDataValidacion.totalComisiones =
            new CurrencyPipe('en-US').transform(totalComisiones.toString()) ||
            '0';
          this.formDataValidacion.totalBonos =
            new CurrencyPipe('en-US').transform(totalBonos.toString()) || '0';
          this.formDataValidacion.diferencia =
            new CurrencyPipe('en-US').transform(diferencia.toString()) || '0';

          //this.loadingVisible = false;
          Loading.remove()
        }, 2000);
      }
    });
  }

  Currency(data: any) {
    return new CurrencyPipe('en-US').transform(data.toString());
  }

  ResumenBalanzaCompleta(numQuincena: number) {
    let quincena = numQuincena === 1 ? 23 : 26;

    return new Promise((resolve, reject) => {
      this.gastosServices
        .ResumenInsertaBalanzaCentralizado(
          this.anioActual,
          this.mesActual,
          quincena,
          0
        )
        .subscribe((resp: any) => {
          resolve(resp);
        });
    });
  }

  OrdenesCompra(){
    Swal.fire({
      icon: 'question',
      html: '¿Deseas iniciar el proceso de generación de ordenes de compra?',
      showConfirmButton: true,
      confirmButtonText:'Continuar',
      showCancelButton: true
    }).then(async result =>{
      if(result.isConfirmed){
        //const respuesta: any =  await this.InsertaOrdenesCompra(this.quincenaSelected)

        Swal.fire({
          icon: 'success',
          html: 'Se inicio el proceso de generación de ordenes de compra <br/> En el paso 3 podras visualizar el avance',
          showConfirmButton: true,
          confirmButtonText:'Continuar',
          showCancelButton: false,
        })

      }
    })
  }

  InsertaOrdenesCompra(numQuincena: number) {
    let quincena = numQuincena === 1 ? 23 : 26;

    return new Promise((resolve, reject) => {
      this.gastosServices
        .ResumenInsertaBalanzaCentralizado(
          this.anioActual,
          this.mesActual,
          quincena,
          1
        )
        .subscribe((resp: any) => {
          resolve(resp);
        });
    });
  }

  ResumenBalanzaComisionesBono(numQuincena: number) {
    return new Promise((resolve, reject) => {
      this.gastosServices
        .ResumenBalanzaComisionesBonos(
          this.mesActual,
          this.anioActual,
          numQuincena
        )
        .subscribe((resp: any) => {
          resolve(resp);
        });
    });
  }

  onContentReady(e: any) {
    e.component.option('loadPanel.enabled', false);
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

  // Función para sumar los valores de una propiedad en un arreglo de JSON
  sumarValor(arreglo: [], propiedad: any): Promise<number> {
    return new Promise((resolve, reject) => {
      // Verificar si el arreglo es válido
      if (!Array.isArray(arreglo)) {
        reject(new Error('El parámetro debe ser un arreglo'));
      }

      // Verificar si la propiedad es válida en todos los objetos del arreglo
      if (!arreglo.every((obj: any) => obj.hasOwnProperty(propiedad))) {
        reject(
          new Error(
            `La propiedad "${propiedad}" no existe en todos los objetos`
          )
        );
      }

      // Sumar los valores de la propiedad
      const suma: any = arreglo.reduce(
        (total, obj) => total + obj[propiedad],
        0
      );

      resolve(suma.toFixed(2));
    });
  }

  EliminarElemento(arreglo: DataBalComBono[], id: string): DataBalComBono[] {
    return arreglo.filter((obj) => obj.DEP !== id);
  }

  VerDetalle() {
    this.verDetalles = !this.verDetalles;

    if (this.verDetalles === false) {
      this.btnVerDetalle = 'Ver detalles';
    }

    if (this.verDetalles === true) {
      this.btnVerDetalle = 'Ocultar detalles';
    }
  }

  exportGrids() {
    const context = this;
    const workbook = new Workbook();
    const completoSheet = workbook.addWorksheet('completo');
    const departamentoSheet = workbook.addWorksheet('Departamentos');

    departamentoSheet.columns = [
      { width: 5 }, { width: 41 }, { width: 6 }, { width: 13 }, { width: 13 }, { width: 5 },
    ]

    completoSheet.getRow(1).getCell(2).value = 'Prorrateo Balanza';
    completoSheet.getRow(1).getCell(2).font = {
      bold: true,
      size: 16,
      underline: 'double',
    };

    departamentoSheet.getRow(1).getCell(2).value = 'Balanza';
    departamentoSheet.getRow(1).getCell(2).font = {
      bold: true,
      size: 16,
      underline: 'double',

    };

    const indice:number = this.lstBalanza.length+5

    departamentoSheet.getRow(indice).getCell(2).value = 'Total balanza:'
    departamentoSheet.getRow(indice).getCell(4).value =  this.formDataValidacion.totalBalanza
    departamentoSheet.getRow(indice).getCell(4).alignment = {horizontal:'right'}
    departamentoSheet.getRow(indice).getCell(2).font={ bold:true}

    departamentoSheet.getRow(indice+1).getCell(2).value = 'Subtotal completo:'
    departamentoSheet.getRow(indice+1).getCell(4).value =  this.formDataValidacion.subTotalResumen
    departamentoSheet.getRow(indice+1).getCell(4).alignment = {horizontal:'right'}
    departamentoSheet.getRow(indice+1).getCell(2).font={ bold:true}

    departamentoSheet.getRow(indice+2).getCell(2).value = 'Total comisiones:'
    departamentoSheet.getRow(indice+2).getCell(4).value =  this.formDataValidacion.totalComisiones
    departamentoSheet.getRow(indice+2).getCell(4).alignment = {horizontal:'right'}
    departamentoSheet.getRow(indice+2).getCell(2).font={ bold:true}

    departamentoSheet.getRow(indice+3).getCell(2).value = 'Total bonos:'
    departamentoSheet.getRow(indice+3).getCell(4).value =  this.formDataValidacion.totalBonos
    departamentoSheet.getRow(indice+3).getCell(4).alignment = {horizontal:'right'}
    departamentoSheet.getRow(indice+3).getCell(2).font={ bold:true}

    departamentoSheet.getRow(indice+4).getCell(2).value = 'Diferecia:'
    departamentoSheet.getRow(indice+4).getCell(4).value =  this.formDataValidacion.diferencia
    departamentoSheet.getRow(indice+4).getCell(4).alignment = {horizontal:'right'}
    departamentoSheet.getRow(indice+4).getCell(2).font={ bold:true}


    departamentoSheet.getRow(1).getCell(7).value = 'Comisiones';
    departamentoSheet.getRow(1).getCell(7).font = {
      bold: true,
      size: 16,
      underline: 'double',
    };

    departamentoSheet.getRow(1).getCell(12).value = 'Bonos';
    departamentoSheet.getRow(1).getCell(12).font = {
      bold: true,
      size: 16,
      underline: 'double',
    };

    function setAlternatingRowsBackground(gridCell: any, excelCell: any) {
      if (gridCell.rowType === 'header' || gridCell.rowType === 'data') {
        if (excelCell.fullAddress.row % 2 === 0) {
          excelCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'D3D3D3' },
            bgColor: { argb: 'D3D3D3' },
          };
        }

        if(excelCell.fullAddress.sheetName === 'Departamentos'){
          if(excelCell._address === 'B3' || excelCell._address === 'G3' || excelCell._address === 'L3'){
            excelCell._column.width=43
          }

          if(excelCell._address === 'C3' || excelCell._address === 'H3' || excelCell._address === 'M3'){
            excelCell._column.width=6
          }

          if(excelCell._address === 'D3' || excelCell._address === 'I3' || excelCell._address === 'N3'){
            excelCell._column.width=17
          }

          if(excelCell._address === 'E3' || excelCell._address === 'J3' || excelCell._address === 'O3'){
            excelCell._column.width=17
          }
          
          
        }


      }
    }

    /**Las tablas tiene que estan visibles en el front para que las identifique el viewchild de lo contrario la instacia estara indefinida */
    exportDataGrid({
      worksheet: completoSheet,
      component: context.completoGrid.instance,
      topLeftCell: { row: 3, column: 2 },
      customizeCell: ({ gridCell, excelCell }) => {
        setAlternatingRowsBackground(gridCell, excelCell);
      },
    })
      .then(() =>
        exportDataGrid({
          worksheet: departamentoSheet,
          component: context.gridBalanza.instance,
          topLeftCell: { row: 3, column: 2 },
          customizeCell: ({ gridCell, excelCell }) => {
            setAlternatingRowsBackground(gridCell, excelCell);
          },
        })
      )
      .then(() =>
        exportDataGrid({
          worksheet: departamentoSheet,
          component: context.gridComisiones.instance,
          topLeftCell: { row: 3, column: 7 },
          customizeCell: ({ gridCell, excelCell }) => {
            setAlternatingRowsBackground(gridCell, excelCell);
          },
        })
      )
      .then(() =>
        exportDataGrid({
          worksheet: departamentoSheet,
          component: context.gridBono.instance,
          topLeftCell: { row: 3, column: 12 },
          customizeCell: ({ gridCell, excelCell }) => {
            setAlternatingRowsBackground(gridCell, excelCell);
          },
        })
      )
      .then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(
            new Blob([buffer], { type: 'application/octet-stream' }),
            `Repercusion de gasto mes ${this.dataMes.text} quincena ${this.quincenaSelected}.xlsx`
          );
        });
      });
  }

  obtenerUltimoElemento(arreglo: any[]): any | undefined {
    if (arreglo.length === 0) {
      return undefined; // Si el arreglo está vacío, devuelve undefined
    }

    return arreglo[arreglo.length - 1];
  }

  ordenarArregloJSON(arreglo: any[], propiedad: string): any[] {
    return arreglo.sort((a, b) => {
      if (a[propiedad] < b[propiedad]) {
        return -1;
      }
      if (a[propiedad] > b[propiedad]) {
        return 1;
      }
      return 0;
    });
  }

  ConsultaOrdenesCompra() {
    let ocError:any 
    let fechaUltimaEjecucion: string = this.objUltimaRepercusion.fecha;
    fechaUltimaEjecucion = fechaUltimaEjecucion
      .substring(0, 10)
      .replace('-', '')
      .replace('-', '');

    this.gastosServices
      .ConsultaOrdenesCompra(fechaUltimaEjecucion)
      .subscribe((resp: any) => {
        this.lstOrdenesCompra = resp[0];

        if(this.lstOrdenesCompra.length > 0){
          this.disabledOC = true;
          ocError = this.lstOrdenesCompra.filter((x:any) => x.odm_estatus === 2)
          
          if(ocError.length > 0){
            this.NotificaSistemas(ocError)
          }

        }

      });
  }

  async NotificaSistemas(ocError:any) {

    let cuerpo:string='Las siguientes OC se quedaron en estatus 2 <br/>'

    let ocPorNotificar:any = new Array()
    

    for (let element of ocError) {
      let respuesta:any
      respuesta = await this.ConsultaNotifiacionOC(element.odm_ordencompra, element.sucursal) 
      console.log(respuesta);

      if(respuesta.estatus !== 1){
        ocPorNotificar.push(element)
      }
      
      
    }

    if(ocPorNotificar.length < 1){
      return
    }

    for (let i = 0; i < ocPorNotificar.length; i++) {
      const element = ocPorNotificar[i];

      cuerpo += `SUCURSAL: <strong> ${element.sucursal} </strong> OC: <strong> ${element.odm_ordencompra} </strong><br/>`
      
    }

    let params:any = await this.ParametrosNotificacion('NotificaErrorOC')

    this.correoServicce.sendMail(params.asunto, params.destinatarios,cuerpo).subscribe(resp => console.log(resp));

  }

  ParametrosNotificacion(tabla:string){
    return new Promise((resolve,reject) => {
      this.gastosServices.ParametrosNotificacion(tabla).subscribe(resp => {
        resolve(resp);
      })
    })
  }

  async ConsultarFacturas(){

    let quincena = (this.quincenaSelected === undefined || this.quincenaSelected === null) ? 1 : this.quincenaSelected

    this.fechaSolicitudFacturacion = await this.ConsultaFechaSolicitudFactura(this.mesActual, this.anioActual, quincena,0)
    this.gastosServices.ConsultaFacturacion(this.fechaSolicitudFacturacion.fechas).subscribe((resp:any) =>{
      this.lstFacturasCreadas = resp[0]
    })
  }

  ConsultaNotifiacionOC(oc:string, sucursal:string){
    return new Promise((resolve, reject) => {
      this.gastosServices.ConsultaOCError(oc,sucursal).subscribe(resp => {
        resolve(resp)
      })
    })
  }

  ConsultaFechaSolicitudFactura(mes:number, anio:number, quincena:number, inserta:number){
    return new Promise((resolve, reject) => {
      this.gastosServices.ConsultaFechaFacturacion(mes,anio,quincena,inserta).subscribe((resp:any) => {
        resolve(resp)
      })
    })
  }

}
