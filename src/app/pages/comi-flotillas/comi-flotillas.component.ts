import { Component, OnInit } from "@angular/core";
import { ComisionesServices } from "src/app/shared/services/comisiones.service";
import { ConsultaGastosServices } from "src/app/shared/services/consulta-gastos.service";
import { ConsultaPolizaNominaService } from "src/app/shared/services/consulta-poliza-nomina.service";
import { MesesServices } from "src/app/shared/services/meses.service";

@Component({
    selector: 'app-comi-flotillas',
    templateUrl: './comi-flotillas.component.html',
    styleUrls: ['./comi-flotillas.component.scss'],
  })

  export class ComiFlotillasComponent implements OnInit {

    lstAnios:any = []
    anio:any
    lstMeses:any = []
    mes:any
    lstDepartamentos:any = []
    lstSucursales:any = []

    constructor(private _mesServices: MesesServices, private _nominaService: ConsultaPolizaNominaService, private _prorra:ConsultaGastosServices, private _comi:ComisionesServices){
      this.lstMeses = this._mesServices.meses()
    }
    
    async ngOnInit(): Promise<void> {
        this.Anios()
        this.lstDepartamentos = await this.DepartamentosFlotillas()
        this.lstSucursales = await this.Sucursales()
        console.log(this.lstDepartamentos);
        
    }

    AnioSelect(e:any){
      this.anio = e.value;
    }

    MesSelect(e:any){
      this.mes = e.value
    }

    ConsultaComision(){

    }

    Anios() {
      this._nominaService.ListaAnios().subscribe(async (resp:any) => {
        this.lstAnios = this.ordenarArregloJSON(resp,'anio');
      });
    }

    ordenarArregloJSON(arreglo: any[], propiedad: string): any[] {
      return arreglo.sort((a, b) => {
        if (a[propiedad] > b[propiedad]) {
          return -1;
        }
        if (a[propiedad] < b[propiedad]) {
          return 1;
        }
        return 0;
      });
    }

    DepartamentosFlotillas(){
      return new Promise((resolve, reject) => {
        this._comi.InfoDepartamentosComisiones().subscribe((resp:any) => {
          resolve(resp)
        })
      })
    }

    Sucursales(){
      return new Promise((resolve, reject) =>{
        this._comi.SucursalesComisiones().subscribe((resp:any) =>{
          resolve(resp)
        })
      })
    }
}