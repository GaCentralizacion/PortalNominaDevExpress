import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { Loading } from "notiflix";
import { ComisionesServices } from "src/app/shared/services/comisiones.service";
import { ConsultaGastosServices } from "src/app/shared/services/consulta-gastos.service";
import { ConsultaPolizaNominaService } from "src/app/shared/services/consulta-poliza-nomina.service";
import { MesesServices } from "src/app/shared/services/meses.service";
import { IEmpresa } from "./comi-flotillas.model";
import { ExcelClass } from "src/app/shared/services/excelClass.service";
import * as ExcelJS from 'exceljs';
import * as moment from 'moment';
import { CurrencyPipe } from "@angular/common";
import { DxDataGridComponent } from "devextreme-angular";
import { saveAs } from 'file-saver';
import { exportDataGrid } from "devextreme/excel_exporter";
import { ExcelService } from "src/app/shared/services/arrayToExcel.service";

@Component({
    selector: 'app-comi-flotillas',
    templateUrl: './comi-flotillas.component.html',
    styleUrls: ['./comi-flotillas.component.scss'],
  })

  export class ComiFlotillasComponent implements OnInit {

    @ViewChild('gridContainercalculo', { static: false })
    gridContainercalculo!: DxDataGridComponent;

    lstAnios:any = []
    anio:any
    lstMeses:any = []
    mes:any
    lstDepartamentos:any = []
    lstSucursales:any = []
    lstEmpresas:IEmpresa[]=[]
    fechaFinal: any = new Date();
    fechainicial:any = new Date()

    verDetalleGasto:boolean=false
    isDropZoneActive = false;
    progressVisible = false;
    progressValue = 0;
    imageSource = '';
    textVisible = true;

    acceptedFileTypes:string = '.xls,.xlsx'

    startEditAction = 'click';
    popupEjemplo:boolean = false

    selectTextOnEditStart = true;

    comisionPagada:any = [{value:0,texto:'NO'},{value:1, texto:'SI'}]

    constructor(private _mesServices: MesesServices, private _nominaService: ConsultaPolizaNominaService, private _prorra:ConsultaGastosServices, 
      private _comi:ComisionesServices, private cdr: ChangeDetectorRef, private _excelService: ExcelService){

      this.lstMeses = this._mesServices.meses()
    }
    
    async ngOnInit(): Promise<void> {
      Loading.hourglass('Espere por favor...')

        this.fechainicial = this.GetCurrentDateMinus30Days()
        this.Anios()
        const respEmpresas:any = await this.Empresas()
        this.lstSucursales = await this.Sucursales()
        //this.lstDepartamentos = await this.DepartamentosFlotillas()

        for (let i = 0; i < respEmpresas.length; i++) {
          const em = respEmpresas[i];
          let data:IEmpresa={
            alias:'',idEmpresa:'',sucursales:[]
          }

          data.idEmpresa = em.idEmpresa
          data.alias = em.alias
          
          this.lstEmpresas.push(data)

        }

        for (let i = 0; i < this.lstEmpresas.length; i++) {
          const marca = this.lstEmpresas[i];
          
          let resp = this.lstSucursales.filter((sucursal:any) => sucursal.IdEmpresa === marca.idEmpresa)

          marca.sucursales =resp

        }

        this.lstEmpresas.forEach(emp => {
          emp.sucursales.forEach(async suc => {
            suc.departamentos =  await this.DepartamentosFlotillas()//this.lstDepartamentos
          });
        });
           
      Loading.remove()  
    }

    AnioSelect(e:any){
      this.anio = e.value;
    }

    MesSelect(e:any){
      this.mes = e.value
    }

    async ConsultaComision(){

      Loading.hourglass('Espere por favor...')

      let mes = this.fechaFinal.getMonth()+1
      let anio = this.fechaFinal.getFullYear();
      
      for (let i = 0; i < this.lstEmpresas.length; i++) {
        const marca = this.lstEmpresas[i];

        try {
          for (let i = 0; i < marca.sucursales.length; i++) {
            const suc = marca.sucursales[i];
            /**OBTENERMOS EL VALOR DEL GASTO PARA LA SUCURSAL */
            const totalGasto:any = await this.GetGastoFlotillas(suc.idWSF,anio,mes,1)
            //promesas.push(this.GetGastoFlotillas(suc.idWSF,anio,mes,1))
            suc.totalGasto = totalGasto[0].length>0?totalGasto[0][0].totalGasto:0
            suc.totalGastoCurrency = new CurrencyPipe('en-US').transform(suc.totalGasto.toString());
            suc.detalleGasto = totalGasto[1].length>0?totalGasto[1]:[]
            console.log('sucusal: ',suc.Descripcion);
            let respuestaCalculo:any
            /**OBTENEMOS EL DETALLE DEL CALCULO DE LA COMISION */
             for (let i = 0; i < suc.departamentos.length; i++) {
              const depto = suc.departamentos[i];
              depto.IdSucursal = suc.IdSucursal
              depto.detalleCalculoDepto = []   
              depto.totalComision=0      
              depto.totalComisionCurrency=new CurrencyPipe('en-US').transform(depto.totalComision.toString());     
             }
  
             for (let i = 0; i < suc.departamentos.length; i++) {
              const ele = suc.departamentos[i];
  
              if(ele.aliasComisiones !== null && ele.aliasComisiones !== undefined){
  
                respuestaCalculo = await this.CalculoDetalleComisiones(suc.BaseDatos,suc.DirIp,ele.aliasComisiones,this.fechainicial, this.fechaFinal,suc.totalGasto)
                ele.detalleCalculoDepto = respuestaCalculo
  
                if(respuestaCalculo.length >0){
                  for (let i = 0; i < respuestaCalculo.length; i++) {
                    const dato:any = respuestaCalculo[i];
  
                    if(dato.PAGADA === 0){
                      ele.totalComision = (Number(ele.totalComision)+ dato.COMISION).toFixed(2)
                      ele.totalComisionCurrency = new CurrencyPipe('en-US').transform(ele.totalComision.toString());   
                    }
                    
                  }
                }
              }
              
             }
  
  
          }
        } catch (error) {
          console.log(error);
          
        }


        
      }

      //let valores = await Promise.all(promesas)
      //console.log('valores: ',valores);
  
      Loading.remove()
      console.log(this.lstEmpresas);
      

    }

    EjecutaCalculo(){

      this.lstEmpresas.forEach(marca=>{
        marca.sucursales.forEach(suc => {
          suc.departamentos.forEach(async depto =>{
            const respuestaCalculo:any = await this.CalculoDetalleComisiones(suc.BaseDatos,suc.DirIp,depto.aliasComisiones,this.fechainicial, this.fechaFinal,suc.totalGasto)
            depto.detalleCalculoDepto = respuestaCalculo
          })
        })
      })

    }

    CalculoDetalleComisiones(base:string,ip:string,nombreDepto:string,fechaInicio:string,fechafin:string,totalGasto:number){

      let fechaIni = moment(fechaInicio).format('DD/MM/YYYY')
      let fechafinal = moment(fechafin).format('DD/MM/YYYY')

      return new Promise((resolve, reject) =>{
        this._comi.CalculoDetalleComisionesFlotillas(base,ip,nombreDepto,fechaIni,fechafinal,totalGasto).subscribe((resp:any) =>{
          resolve(resp[0])
        })
      })
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

    DepartamentosFlotillas():Promise<any[]>{
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

    Empresas(){
      return new Promise((resolve, reject) =>{
        this._comi.CatEmpresasComisiones().subscribe((resp:any) =>{
          resolve(resp)
        })
      })
    }

    GetCurrentDateMinus30Days(): Date {
      // Obtenemos la fecha actual
      const currentDate = new Date();
    
      // Restamos 30 días a la fecha actual
      currentDate.setDate(currentDate.getDate() - 30);
    
      return currentDate;
    }

    GetGastoFlotillas(idSucursalWSF:number,anio:number,mes:number,detalle:number){
      return new Promise((resolve,reject) => {
        this._comi.CalculoGastoComisionesFlotillas(idSucursalWSF,anio,mes,detalle).subscribe((resp:any) =>{
          resolve(resp)
        })
      })
    }

    onExporting(e:any){

      let excel = new ExcelClass()
      let msj = excel.onExporting(e,'prueba','Lista de prueba')
      
     }

     VerDetallesGastos(){
      this.verDetalleGasto = !this.verDetalleGasto
     }

    async onFilesUploaded(event: any, idEmpresa:number,IdSucursal:number, id_departamento:number) {

      let resultFilterEmp = this.lstEmpresas.filter(em => Number(em.idEmpresa) === idEmpresa)[0]
      let resultFilterSuc = resultFilterEmp.sucursales.filter(suc => Number(suc.IdSucursal) === Number(IdSucursal) )[0]
      let resultFilterDepto = resultFilterSuc.departamentos.filter(dep => Number(dep.id_departamento) === Number(id_departamento))[0]
      
      
      const archivoEx: any = event.file;
      const workbook = new ExcelJS.Workbook();
  
      await workbook.xlsx.load(archivoEx);
  
      const hoja = workbook.worksheets[0];
      const datosExcel:any = [];
      hoja.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        datosExcel.push(row.values);
      });
  
      
      for (let i = 0; i < datosExcel.length; i++) {
        const dato = datosExcel[i];
        
        let datoEncontrado:any = resultFilterDepto.detalleCalculoDepto.filter(x => x.SERIE === dato[1])[0]
        if(datoEncontrado !== undefined){
          datoEncontrado.INTERESES = dato[2]
          datoEncontrado.PAGADA = dato[3]
          datoEncontrado.FECHA_COM_PAGADA = dato[4] !== undefined && dato[4]!== null? dato[4]:''
          console.log(datoEncontrado);  
        }
        
      }

      this.EjecutaActualiza()
      console.log(this.lstEmpresas);
      

    }

    customizeCurrency(data : any) {
      if (data !== undefined) {

        if(data.value === null || data.value === undefined){
          return new CurrencyPipe('en-US').transform('0');
        }

        if(data.value !== null && data.value !== undefined){
          return new CurrencyPipe('en-US').transform(data.value.toString());
        }

      } else {
          return data;
      }
    }

    OnSaving(e: any) {

      setTimeout(()=>{
        this.EjecutaActualiza()
      },500)
            
    }

    EjecutaActualiza(){
      for (let i = 0; i < this.lstEmpresas.length; i++) {
        let marca = this.lstEmpresas[i];

        for (let i = 0; i < marca.sucursales.length; i++) {
          let suc = marca.sucursales[i];

          for (let i = 0; i < suc.departamentos.length; i++) {
            let depa = suc.departamentos[i];
            depa.totalComision = 0
            depa.totalComisionCurrency = new CurrencyPipe('en-US').transform(depa.totalComision.toString()); 

            if(depa.detalleCalculoDepto.length > 0){
              for (let i = 0; i < depa.detalleCalculoDepto.length; i++) {
                let dato = depa.detalleCalculoDepto[i];

                dato.TOTAL_GASTO = dato.INTERESES+dato.GASTOS
                if(dato.INTERESES > 0){
                  dato.COMISION = dato.TOTAL_GASTO*(dato.PORCEN_COMISION/100)
                  
                }
                if(dato.COMISION >0 && dato.PAGADA === 0){
                  depa.totalComision = (Number(depa.totalComision)+dato.COMISION).toFixed(2)  
                  depa.totalComisionCurrency = new CurrencyPipe('en-US').transform(depa.totalComision.toString()); 
                }
                             
                
              }
            }
            
          }
          
        }
        
      }
      console.log(this.lstEmpresas);
      // this.lstEmpresas = [...this.lstEmpresas]

       this.cdr.detectChanges();
    }

    VerEjemplo(){
      this.popupEjemplo = true;
    }

    exportGrids(idEmpresa:number, IdSucursal:number,id_departamento:number) {

      let resultFilterEmp = this.lstEmpresas.filter(em => Number(em.idEmpresa) === idEmpresa)[0]
      let resultFilterSuc = resultFilterEmp.sucursales.filter(suc => Number(suc.IdSucursal) === Number(IdSucursal) )[0]
      let resultFilterDepto = resultFilterSuc.departamentos.filter(dep => Number(dep.id_departamento) === Number(id_departamento))[0]

      console.log(resultFilterDepto);
      this._excelService.exportToExcel(resultFilterDepto.detalleCalculoDepto,`Detalle de comision ${resultFilterSuc.Descripcion} departamento ${resultFilterDepto.departamento} periodo ${this.fechainicial} al ${this.fechaFinal}`,resultFilterDepto.departamento)
      
    }

}