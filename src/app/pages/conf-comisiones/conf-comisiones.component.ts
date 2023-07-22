import { Component, OnInit } from "@angular/core";
import { ComisionesServices } from "src/app/shared/services/comisiones.service";
import { ConsultaPolizaNominaService } from "src/app/shared/services/consulta-poliza-nomina.service";
import { MesesServices } from "src/app/shared/services/meses.service";
import { IEmpresas } from "./conf-comisiones.model";
import { CatalogosSicossService } from "src/app/shared/services/catalogosSicoss.service";
import { Report, Confirm  } from "notiflix";
import { CurrencyPipe } from "@angular/common";

@Component({
    selector: "conf-prorrateo-agencia",
    templateUrl: "./conf-comisiones.component.html",
    styleUrls: ["./conf-comisiones.component.scss"]
})

export class ConfComisionesComponent implements OnInit{
    
    lstMeses:any
    lstAnios:any

    anio:any
    mes:any

    lstConfiguracionesMark:any =[]
    lstConfiguracionesDevCenter:any=[]
    lstEmpresas:any=[]
    lstEmpresasModalMark:any=[]
    lstEmpresasDEvCenter:any =[]
    lstRangosNuevos:any=[]
    lstRangosSeminuevos:any = []

    popupVisibleMarketing:boolean= false
    popupVisibleDevCenter:boolean = false
    closeButtonOptions: any;
    closeButtonOptionsDevCenter:any

    selectTextOnEditStart = true;
    startEditAction = 'click';



    constructor( private _mesServices: MesesServices, private _comisiones:ComisionesServices, private _nominaService: ConsultaPolizaNominaService, private _catSicoss: CatalogosSicossService){
        const that = this;
        this.lstMeses = this._mesServices.meses()

        this.AgregarEliminarAgencia = this.AgregarEliminarAgencia.bind(this)
        
        this.closeButtonOptions = {
            text: 'Cerrar',
            onClick(e:any) {
              that.popupVisibleMarketing = false;
            },
          };
        
        this.closeButtonOptionsDevCenter = {
            text: 'Cerrar',
            onClick(e:any) {
              that.popupVisibleDevCenter = false;
            },
          };
        
    }
    
    async ngOnInit(): Promise<void> {
        this.Anios()
        this.lstEmpresas = await this.EmpresasConfigurables()
    }

    MesSelect(e:any){
        this.mes = e.value
    }

    AnioSelect(e:any){
        this.anio = e.value;
    }

    Anios() {
        this._nominaService.ListaAnios().subscribe(async (resp) => {
          this.lstAnios = resp;
        });
      }

    async ConsultaConfig(){
        let lstIdDeptos = ['0101','0132','0222','0218']
        this.lstConfiguracionesMark = []
        this.lstConfiguracionesDevCenter = []

        for (let i= 0;i<lstIdDeptos.length ;i++){
            const iddepto = lstIdDeptos[i]

            if(iddepto === '0101'){
                this.lstConfiguracionesMark = await this.Configuraciones(iddepto)    
                console.log(this.lstConfiguracionesMark);
                
            }
            
            if(iddepto === '0132'){
                this.lstConfiguracionesDevCenter = await this.Configuraciones(iddepto)
            }

            if(iddepto === '0222'){
                this.ConsultaNuevos(this.anio, this.mes)
            }

            if(iddepto === '0218'){
                this.ConsultaSemiNuevos(this.anio, this.mes)
            }
        }

    }

    Configuraciones(idDepto:string){
        
        return new Promise((resolve, reject) => {
            this._comisiones.ConfigMarkDevCenter(this.mes, this.anio,idDepto).subscribe((resp:any) =>{              
                resolve(resp)
            })
        })
    }

    MostrarPopMarketing(){
        
        this.lstEmpresasModalMark= []
        for (let i = 0; i < this.lstEmpresas.length; i++) {
            const el = this.lstEmpresas[i];
            let data:IEmpresas = {
                idDepto:'0101',
                Descripcion:'',
                anio:this.anio,
                idEmpresa:0,
                idSucursal:0,
                mes:this.mes,
                agregarEliminar:false
            }
            const item = this.lstConfiguracionesMark.find((x:any) => x.idSucursal === Number(el.IdSucursal))
            
            data.Descripcion = el.Descripcion
            data.anio = this.anio
            data.idEmpresa = el.IdEmpresa
            data.idSucursal = Number(el.IdSucursal)
            data.agregarEliminar = (item === null || item === undefined)? false : true;
            
            this.lstEmpresasModalMark.push(data)
        }

        this.popupVisibleMarketing = true
    }

    OpcionVisible(e:any){
        return !e.row.data.agregarEliminar
    }
    
    OpcionEliminarVisible(e:any){
        return e.row.data.agregarEliminar
    }

    EmpresasConfigurables(){
        return new Promise((resolve, reject) => {
            this._catSicoss.LugaresTrabajo().subscribe((resp:any) =>{
                resolve(resp)
            })
        })
    }

    async AgregarEliminarAgencia(e:any){
        console.log(e.row.key);
        let data = e.row.key
        let respuesta:any
        if (e.row.key.agregarEliminar) {
            respuesta = await this.Accion(data.idDepto, data.idEmpresa, data.idSucursal,this.anio, this.mes,0)
        }
        
        if (!e.row.key.agregarEliminar) {
            respuesta = await this.Accion(data.idDepto, data.idEmpresa, data.idSucursal,this.anio, this.mes,1)
        }

        Report.success('Acción realizada', respuesta.msj,'Ok')
        this.ConsultaConfig()
        this.popupVisibleMarketing = false
        this.popupVisibleDevCenter = false
        
    }

    Accion(idDepto:string,idEmpresa:number,idSucursal:string, anio:number,mes:number,accion:number){
        return new Promise((resolve,reject) => {
            this._comisiones.AgregaEliminaConfMarkDev(idDepto,idEmpresa,idSucursal,anio,mes,accion).subscribe((resp:any) =>{
                resolve(resp[0])
            })
        })
    }

    MostrarPopDevCenter(){

        this.lstEmpresasDEvCenter= []
        for (let i = 0; i < this.lstEmpresas.length; i++) {
            const el = this.lstEmpresas[i];
            let data:IEmpresas = {
                idDepto:'0132',
                Descripcion:'',
                anio:this.anio,
                idEmpresa:0,
                idSucursal:0,
                mes:this.mes,
                agregarEliminar:false
            }
            const item = this.lstConfiguracionesDevCenter.find((x:any) => x.idSucursal === Number(el.IdSucursal))
            
            data.Descripcion = el.Descripcion
            data.anio = this.anio
            data.idEmpresa = el.IdEmpresa
            data.idSucursal = Number(el.IdSucursal)
            data.agregarEliminar = (item === null || item === undefined)? false : true;
            
            this.lstEmpresasDEvCenter.push(data)
        }

        this.popupVisibleDevCenter = true
    }

    ConsultaNuevos(anio:number, mes:number){
        this._comisiones.RangoPagoNuevoComisiones(anio, mes).subscribe((resp:any) => {
            console.log(resp);
            
            this.lstRangosNuevos = resp[0]
        })
    }

    OnSaving(e: any) {
        //e.cancel = true;
        console.log(e);
        if(e.changes[0].type === 'insert'){
            Confirm.show('Solicitud de acción',
            'Deseas insertar los valores capturados?',
            'Si',
            'No',
            async ()=>{
                let respuesta:any = await this.ConfiguracionNuevos(
                    this.mes,this.anio,
                    e.changes[0].key.limiteInferior,
                    e.changes[0].key.limiteSuperior,
                    e.changes[0].key.porcentaje,
                    1)
                Report.success('Solicitud de acción',respuesta.msj,'ok')
            },
            ()=>{Report.success('Solicitud de acción','Acción cancelada','ok')}
            )
            
        }

        if(e.changes[0].type === 'remove'){
            Confirm.show('Solicitud de acción',
            'Deseas elminiar los valores seleccionados?',
            'Si',
            'No',
            async ()=>{
                let respuesta:any = await this.ConfiguracionNuevos(
                    this.mes,this.anio,
                    e.changes[0].key.limiteInferior,
                    e.changes[0].key.limiteSuperior,
                    e.changes[0].key.porcentaje,
                    0)
                Report.success('Solicitud de acción',respuesta.msj,'ok')
            },
            ()=>{Report.success('Solicitud de acción','Acción cancelada','ok')}
            )
          
        }
        
    }

    ConfiguracionNuevos(mes:number, anio:number, liminfe:number, limSupe:number, porcentaje:number, accion:number){

        return new Promise((resolve, reject) => {
            this._comisiones.ConfiguracionRangoNuevosComisiones(mes,anio,liminfe,limSupe,porcentaje,accion).subscribe(resp =>{
                console.log(resp);
                
                resolve(resp)
            })     
        })

       
    }

    ConsultaSemiNuevos(anio:number, mes:number){
        this._comisiones.RangoPagoSeminuevoComisiones(anio, mes).subscribe((resp:any) => {
            console.log(resp);
            
            this.lstRangosSeminuevos = resp[0]
        })
    }

    OnSavingSemin(e:any){

        console.log(e);
        if(e.changes[0].type === 'insert'){
            Confirm.show('Solicitud de acción',
            'Deseas insertar los valores capturados?',
            'Si',
            'No',
            async ()=>{
                let respuesta:any = await this.ConfiguracionSemiNuevos(
                    this.mes,this.anio,
                    e.changes[0].key.limiteInferior,
                    e.changes[0].key.limiteSuperior,
                    e.changes[0].key.monto,
                    1)
                Report.success('Solicitud de acción',respuesta.msj,'ok')
            },
            ()=>{Report.success('Solicitud de acción','Acción cancelada','ok')}
            )
            
        }

        if(e.changes[0].type === 'remove'){
            Confirm.show('Solicitud de acción',
            'Deseas elminiar los valores seleccionados?',
            'Si',
            'No',
            async ()=>{
                let respuesta:any = await this.ConfiguracionSemiNuevos(
                    this.mes,this.anio,
                    e.changes[0].key.limiteInferior,
                    e.changes[0].key.limiteSuperior,
                    e.changes[0].key.monto,
                    0)
                Report.success('Solicitud de acción',respuesta.msj,'ok')
            },
            ()=>{Report.success('Solicitud de acción','Acción cancelada','ok')}
            )
          
        }

    }

    ConfiguracionSemiNuevos(mes:number, anio:number, liminfe:number, limSupe:number, monto:number, accion:number){

        return new Promise((resolve, reject) => {
            this._comisiones.ConfiguracionRangoSemiNuevosComisiones(mes,anio,liminfe,limSupe,monto,accion).subscribe(resp =>{
                console.log(resp);
                
                resolve(resp)
            })     
        })

       
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


}