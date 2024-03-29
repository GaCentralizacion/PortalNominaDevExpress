import { Component, OnInit } from '@angular/core';
import { ConsultaPolizaNominaService } from 'src/app/shared/services/consulta-poliza-nomina.service';
import { locale,formatMessage,loadMessages } from 'devextreme/localization';

import * as esMessages from 'devextreme/localization/messages/es.json';
import { ConsultaPolizaSicossService } from 'src/app/shared/services/consulta-poliza-sicoss.service';
import { ExcelClass } from 'src/app/shared/services/excelClass.service';

@Component({
  selector: 'app-poliza-generada',
  templateUrl: './poliza-generada.component.html',
  styleUrls: ['./poliza-generada.component.scss'],
})
export class PolizaGeneradaComponent implements OnInit {
  labelMode = 'floating';

  lstMeses: any = [];
  lstAnios: any = [];
  lstPolizas: any = [];
  anioActual: number = 0;
  mesActual: number = 0;
  popupVisible = false;
  dataPolizas: any;
  closeButtonOptions: any;
  sucursalPoliza: string = '';
  estadoPoliza: string = '';
  formatMessage = formatMessage;
  loadingVisible: boolean = false;

  constructor(private nominaService: ConsultaPolizaNominaService, private sicoss: ConsultaPolizaSicossService) {
    // locale('es');
    // this.initMessages();
    const that = this;

    let fecha = new Date();
    this.anioActual = fecha.getFullYear();
    this.mesActual = fecha.getMonth() + 1;

    this.ConsultaBitacoraPolizas();

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

    /**Relacionamos el evento clic con el metodo del mismo nombre */
    this.ConsultaPoliza = this.ConsultaPoliza.bind(this);

    this.closeButtonOptions = {
      text: 'Cerrar',
      onClick(e: any) {
        that.popupVisible = false;
      },
    };
  }

  // initMessages() {
  //   loadMessages(esMessages)
  // }

  ngOnInit(): void {
    this.Anios();
  }

  Anios() {
    this.nominaService.ListaAnios().subscribe((resp) => {
      this.lstAnios = resp;
    });
  }

  AnioSelect(e: any) {
    this.anioActual = e.value;
    this.ConsultaBitacoraPolizas();
  }

  MesSelect(e: any) {
    this.mesActual = e.value;
    this.ConsultaBitacoraPolizas();
  }

  ConsultaBitacoraPolizas() {
    this.loadingVisible = true
    this.sicoss
    .ConsultaBitacoraPolizasSICOSS(this.mesActual, this.anioActual)
    .subscribe((resp) => {
      this.lstPolizas = resp

      this.loadingVisible = false
    })
    // this.nominaService
    //   .ConsultaBitacoraPolizas(this.mesActual, this.anioActual)
    //   .subscribe((resp) => {
    //     this.lstPolizas = resp;
    //   });
  }

  ConsultaPoliza(e: any) {

    this.sicoss
    .ConsultaPolizaSICOSS(e.row.data.id_work_locat, e.row.data.DSBPEncInfoEnc)
    .subscribe((resp: any) => {
      this.popupVisible = true;
      this.sucursalPoliza = e.row.data.sucursal;
      this.estadoPoliza =
        resp[0].EstatusContabilizacion === 1
          ? 'Póliza generada'
          : 'Póliza en proceso';
      this.dataPolizas = resp;
    });

    // this.nominaService
    //   .ConsultaPoliza(e.row.data.id_work_locat, e.row.data.DSBPEncInfoEnc)
    //   .subscribe((resp: any) => {
    //     this.popupVisible = true;
    //     this.sucursalPoliza = e.row.data.sucursal;
    //     this.estadoPoliza =
    //       resp[0].EstatusContabilizacion === 1
    //         ? 'Póliza generada'
    //         : 'Póliza en proceso';
    //     this.dataPolizas = resp;
    //   });
  }

  Consulta(){
    this.ConsultaBitacoraPolizas();
  }

  rowBackgroundColor(val: any): string {
    if (val.data.error !== '') {
      return '#f5c6cb'; // Rojo
    }else if(val.data.error === '' && (val.data.estatus !== 1 && val.data.estatus !== 0)){
      return '#fff3cd' // amrillo
    }else if(val.data.error === '' && (val.data.estatus === 0)){
      return '#cce5ff' // azul
    }
     else {
      return 'white'; // blanco
    }
  }

  onExporting(e:any){

    let excel = new ExcelClass()
    let msj = excel.onExporting(e,'data',`Pólizas generadas mes ${this.mesActual}`)

   }
}
