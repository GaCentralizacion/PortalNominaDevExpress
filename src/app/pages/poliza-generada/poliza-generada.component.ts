import { Component, OnInit } from '@angular/core';
import { ConsultaPolizaNominaService } from 'src/app/shared/services/consulta-poliza-nomina.service';
import { locale,formatMessage,loadMessages } from 'devextreme/localization';

import * as esMessages from 'devextreme/localization/messages/es.json';

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

  constructor(private nominaService: ConsultaPolizaNominaService) {
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
    this.nominaService
      .ConsultaBitacoraPolizas(this.mesActual, this.anioActual)
      .subscribe((resp) => {
        this.lstPolizas = resp;
      });
  }

  ConsultaPoliza(e: any) {
    this.nominaService
      .ConsultaPoliza(e.row.data.id_work_locat, e.row.data.DSBPEncInfoEnc)
      .subscribe((resp: any) => {
        this.popupVisible = true;
        this.sucursalPoliza = e.row.data.sucursal;
        this.estadoPoliza =
          resp[0].EstatusContabilizacion === 1
            ? 'Póliza generada'
            : 'Póliza en proceso';
        this.dataPolizas = resp;
      });
  }

  Consulta(){
    this.ConsultaBitacoraPolizas();
  }
}
