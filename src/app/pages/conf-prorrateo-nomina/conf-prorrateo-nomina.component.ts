import { Component, OnInit, ViewChild } from "@angular/core";
import { CatalogosSicossService } from "src/app/shared/services/catalogosSicoss.service";
import { AddProrrateoComponent } from "./add-prorrateo/add-prorrateo.component";


@Component({
    selector: "conf-prorrateo-nomina",
    templateUrl: "./conf-prorrateo-nomina.component.html",
    styleUrls: ["./conf-prorrateo-nomina.component.scss"]
})

export class ConfProrrateoNominaComponent implements OnInit{

    @ViewChild("addProrrateo") AddProrrateo!: AddProrrateoComponent;

    lstEmpleadosProrrateo:any =[]
    popupVistaPrevia:boolean= false
    lstLugarTrabajo:any = []
    empleado:any
    limpiaFormulario:boolean = true

    constructor(private _catSicoss: CatalogosSicossService){}
    
    ngOnInit(): void {
        this._catSicoss.EmpleadosProrrateados().subscribe(resp=>{
            this.lstEmpleadosProrrateo = resp
        })

    }

    ActualizaPantalla(){
        this._catSicoss.EmpleadosProrrateados().subscribe(resp=>{
            this.lstEmpleadosProrrateo = resp
            this.popupVistaPrevia= false
        })   
    }

    Agrega(){
        this.AddProrrateo.LimpiaForm()
        this.AddProrrateo.mostrarProrrateo = false
        this.popupVistaPrevia= true
    }

    Consulta(){
        this._catSicoss.EmpleadosProrrateados().subscribe(resp=>{
            this.lstEmpleadosProrrateo = resp
        })
    }

}