import { Component, OnInit } from "@angular/core";
import { ConsultaGastosServices } from "src/app/shared/services/consulta-gastos.service";

import Swal from 'sweetalert2'

@Component({
    selector: "conf-prorrateo-agencia",
    templateUrl: "./conf-prorrateo-agencia.component.html",
    styleUrls: ["./conf-prorrateo-agencia.component.scss"]
})

export class ConfProrrateoAgenciaComponent implements OnInit{

    loadingVisible: boolean = false;
    popupVisibleDeptos: boolean = false
    popupInsertarPorcentaje: boolean = false
    popUpDetalles:boolean = false
    
    lstDepartamentos:any
    lstDepartamentosCompleta:any
    lstSucursales:any

    SucursalSelect:string = ''

    closeButtonOptions: any;
    porcentajeSucursal:number = 0
    nombreDepartamentoSelected: string = ''
    porSucursal: boolean = false
    disabledPorSucursal:boolean = false
    disableValorPorcentaje: boolean = false

    IdFlotilla:number = 0
    AgeciaDetalle: any;
    nombreDetalleModal:string =''

    constructor(private gastoService: ConsultaGastosServices ) { 
        const that = this;

        this.AgregarEliminarAgencia = this.AgregarEliminarAgencia.bind(this)
        this.ModalInsertaPorcentaje = this.ModalInsertaPorcentaje.bind(this)
        this.ModalVerDetalle = this.ModalVerDetalle.bind(this)
        this.EliminaSucFlotilla = this.EliminaSucFlotilla.bind(this)

        this.closeButtonOptions = {
            text: 'Cerrar',
            onClick(e: any) {
                that.popupVisibleDeptos = false;
                that.popupInsertarPorcentaje = false;
                that.popUpDetalles = false
            },
          };
    }

    async ngOnInit(): Promise<void> {
        this.lstDepartamentos = await this.GetDepartamentos()
    }

    GetDepartamentos(){
        return new Promise((resolve, reject) =>{
            this.gastoService.Departamentos().subscribe((resp: any)=>{
                resolve(resp)
            })
        })
    }

    VerDepartamentos(){
        this.gastoService.ListaDepartamentos().subscribe((resp:any) =>{
            this.popupVisibleDeptos = true;
            this.lstDepartamentosCompleta = resp
        })
    }

    OpcionVisible(e:any){
        return !e.row.data.agencias
    }
    
    OpcionEliminarVisible(e:any){
        return e.row.data.agencias
    }

    async AgregarEliminarAgencia(e:any){

        let idDepartamento = e.row.data.id_departamento
        let login: any = sessionStorage.getItem('login')
        let respuesta:any

        login = JSON.parse(login)

        if(e.row.data.agencias === true){
            
            respuesta = await this.EjecutaAccion(idDepartamento,0,login.idUsuario)
            this.lstDepartamentos = await this.GetDepartamentos()
            this.popupVisibleDeptos= false
        }

        if(e.row.data.agencias === false){

            respuesta = await this.EjecutaAccion(idDepartamento,1,login.idUsuario)
            this.lstDepartamentos = await this.GetDepartamentos()
            this.popupVisibleDeptos= false
        }
        
    }

    EjecutaAccion(idDepartamento: number, opcion: number, idUsuario: number){
        return new Promise((resolve, reject) =>{
            this.gastoService.AgregaEliminaAgencia(idDepartamento, opcion, idUsuario).subscribe((resp: any)=>{
                resolve(resp)
            })
        })
    }

    ModalInsertaPorcentaje(e:any){

        this.nombreDepartamentoSelected = 'Inserta porcentaje '+ e.row.data.departamento
        this.lstSucursales = []
        this.SucursalSelect =''
        this.porcentajeSucursal = 0
        this.disabledPorSucursal = false
        this.IdFlotilla = e.row.data.id_departamento
        this.gastoService.GetSucursales().subscribe(resp =>{
            this.lstSucursales = resp

            if(e.row.data.porSucursal === true){
                this.porSucursal = true
                this.disabledPorSucursal = true
                this.disableValorPorcentaje = true
                this.porcentajeSucursal = 1
            }

            if(e.row.data.porSucursal === false && e.row.data.porcentaje > 0){
                this.disabledPorSucursal = true
                this.disableValorPorcentaje = false
            }

            this.popupInsertarPorcentaje = true
        })
        
    }

    async guardarPorcentaje(){
        let login: any = sessionStorage.getItem('login')
        let respuesta:any

        login = JSON.parse(login)
        this.popupInsertarPorcentaje = false

        if(this.SucursalSelect === '' || this.SucursalSelect === null || this.SucursalSelect === undefined){

            Swal.fire(
                {
                    title:'Oops..',
                    text:'La sucursal es requerida',
                    icon:'error',
                    allowOutsideClick: false
                }
            )

            return
        }

        if(this.porcentajeSucursal === 0){
            
            Swal.fire(
                {
                    title:'Oops..',
                    text:'El porcentaje es requerido',
                    icon:'error',
                    allowOutsideClick: false
                }
            )

            return
        }

        respuesta = await this.InsertarSucFlotilla(Number(this.IdFlotilla),Number(this.SucursalSelect),Number(this.porcentajeSucursal),login.idUsuario, this.porSucursal)
        console.log(respuesta)
        if(respuesta.estatus === 1){

            this.lstDepartamentos = await this.GetDepartamentos()
            Swal.fire(
                {
                    title:'Exito',
                    text:respuesta.msj,
                    icon:'success',
                    allowOutsideClick: false
                }
            )
        }

        if(respuesta.estatus !== 1){
            Swal.fire(
                {
                    title:'Ocurrio algo no esperado',
                    text:respuesta.msj,
                    icon:'warning',
                    allowOutsideClick: false
                }
            )
        }
    }

    InsertarSucFlotilla(IdFlotilla:number,idSucursal:number,porcentaje:number,idUsuario:number,porSucursal:boolean){
        let suc = porSucursal === true ? 1 : 0
        return new Promise((resolve, reject) => {
            this.gastoService.InsertarSucFlotilla(IdFlotilla,idSucursal,porcentaje,idUsuario,suc).subscribe((resp:any)=>{
                resolve(resp)
            })
        })
    }
    
    customizeTextPorcentaje(e:any){
        
        if(e.rowType === 'data' && e.column.dataField === 'porcentaje'){
            if(e.row.data.porSucursal === false){
                e.cellElement.innerHTML = e.cellElement.innerHTML + ' %'
            }
            if(e.row.data.porSucursal === true){
                e.cellElement.innerHTML = e.cellElement.innerHTML + ' Sucursal(es)'
            }
        }
        
    }

    async ModalVerDetalle(e:any){
        let valor = Number(e.row.data.id_departamento)
        this.nombreDetalleModal = `Detalle ${e.row.data.departamento}`
        this.AgeciaDetalle = await this.ObtenerDetalles(valor)
        this.popUpDetalles = true
    }

    ObtenerDetalles(idAgencia:number){
        return new Promise((resolve,reject) => {
            this.gastoService.DetalleAgencias(idAgencia).subscribe((resp:any)=>{
                resolve(resp)
            })
        })
    }

    async EliminaSucFlotilla(e:any){
        console.log(e);
        
        let login: any = sessionStorage.getItem('login')
        let respuesta:any

        login = JSON.parse(login)
        respuesta = await this.EliminaDetalle(e.row.data.IdDetalleFlotilla, login.idUsuario)
        this.popUpDetalles = false
        if(respuesta.estatus === 1){
            Swal.fire(
                {
                    title:'Exito',
                    text:'Se elimino de manera correcta',
                    icon:'success',
                    allowOutsideClick: false
                }
            )
        }

        this.lstDepartamentos = await this.GetDepartamentos()
    }

    EliminaDetalle(idDetalleFlotilla: number,idUsuario:number){
        return new Promise((resolve, reject) => {
            this.gastoService.EliminaSucFlotillaAgencia(idDetalleFlotilla, idUsuario).subscribe((resp:any) =>{
                resolve(resp[0])
            })
        })
    }

    customizeText(e:any){
        
        if(e.rowType === 'data' && e.column.dataField === 'porcentaje'){
            if(e.row.data.porSucursal === false){
                e.cellElement.innerHTML = e.cellElement.innerHTML + ' %'
            }
            if(e.row.data.porSucursal === true){
                e.cellElement.innerHTML = e.cellElement.innerHTML + ' Sucursal'
            }
        }
        
    }
}