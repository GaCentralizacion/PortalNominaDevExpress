import { AfterContentInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CatalogosSicossService } from 'src/app/shared/services/catalogosSicoss.service';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { Confirm } from 'notiflix';


@Component({
  selector: 'app-add-prorrateo',
  templateUrl: './add-prorrateo.component.html',
  styleUrls: ['./add-prorrateo.component.scss']
})
export class AddProrrateoComponent implements OnInit {

  @Output() greetingEvent = new EventEmitter<string>();

  miFormulario: any;
  empleado:any
  selectedCompanyId!: number;

  companies: any = []; // Data for companies
  departments: any = []; // Data for departments
  positionEditorOptions: any
  positionEditorOptionsDepartamento: any

  labelMode = 'floating';

  formDataValidacion: any = {
    idRH: 0,
    centro_ID: 0,
    idDepto: 0,
    porcentaje: 0
  };

  mostrarProrrateo: boolean =false

  constructor(private _catSicoss:CatalogosSicossService) {
    
   }

   async ngOnInit() {

   this.companies = await this.LugaresTrabajo()

    this.positionEditorOptions = { 
      dataSource:this.companies,
      displayExpr: "Descripcion",
      valueExpr: "Centro_ID",
      searchEnabled: true,
      onValueChanged: this.onCompanyChange.bind(this)
    }



  }

  LimpiaForm(){
    this.formDataValidacion = {
      idRH: 0,
      centro_ID: 0,
      idDepto: 0,
      porcentaje: 0
    };
  }

  LugaresTrabajo(){
    return new Promise((resolve, reject) => {
      this._catSicoss.LugaresTrabajo().subscribe(resp=>{
        resolve(resp)
      })
    })
  }

  async onCompanyChange(e:any) {
    console.log(e.value);
    Loading.hourglass();
    this.departments = await this.Departamentos(e.value)
    
    this.positionEditorOptionsDepartamento = { 
      dataSource:this.departments,
      displayExpr: "Descripcion",
      valueExpr: "Depto_ID",
      searchEnabled: true,
      onValueChanged: this.onDepartamentoChange.bind(this)
    }
    Loading.remove();
  }

  onDepartamentoChange(e:any){
    console.log(e);
    
  }

  Departamentos(centroID: number){
    return new Promise((resolve, reject) => {
      this._catSicoss.DepartamentoSicoss(centroID).subscribe(resp=>{
        resolve(resp)
      })
    })
  }


  async InsertaProrrateo(){
   console.log(this.formDataValidacion);
   this.mostrarProrrateo = false
   let guarda =  await this.GuardaProrrate()
   this.mostrarProrrateo = true
   Confirm.show(
     'Agregar prorrateo',
     '¿Deseas agregar otro departamento?',
     'Si',
     'No',
     () => {},
     () => {
      this.greetingEvent.emit('');
     }
   );
   
  }

  GuardaProrrate(){
    return new Promise((resolve, reject) => {
      this._catSicoss.InsertaProrrateoNomina(this.formDataValidacion.idRH, this.formDataValidacion.idDepto,this.formDataValidacion.porcentaje).subscribe(resp=>{
        resolve(resp)
      })
    })
  }

  ActualizaPantallaAbuelo(){
    this.greetingEvent.emit('');
  }

}
