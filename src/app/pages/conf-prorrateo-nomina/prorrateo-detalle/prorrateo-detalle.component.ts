import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import { Confirm } from 'notiflix';
import { CatalogosSicossService } from 'src/app/shared/services/catalogosSicoss.service';

@Component({
  selector: 'app-prorrateo-detalle',
  templateUrl: './prorrateo-detalle.component.html',
  styleUrls: ['./prorrateo-detalle.component.scss']
})
export class ProrrateoDetalleComponent implements AfterViewInit {

  @Input() key!: number;
  @Output() greetingEvent = new EventEmitter<string>();

  tasksDataSource!: DataSource;

  lstEmpleadosProrrateoDetalle:any =[]

    constructor(private _catSicoss: CatalogosSicossService){
      this.EliminaProrrateo = this.EliminaProrrateo.bind(this)
    }


  ConsultaDetalle(){
    return new Promise((resolve,reject) =>{
      this._catSicoss.EmpleadosProrrateadosDetalle(this.key).subscribe(resp=>{
         resolve(resp)
      })
    })
  }

  async ngAfterViewInit() {
    this.lstEmpleadosProrrateoDetalle = await this.ConsultaDetalle()
    console.log(this.lstEmpleadosProrrateoDetalle);
    this.tasksDataSource = new DataSource({
      store: new ArrayStore({
        data: this.lstEmpleadosProrrateoDetalle,
        key: 'id_empleado',
      })
    });
  }

  EliminaProrrateo(e:any){
    console.log(e);
    Confirm.show(
      'Elimina prorrateo',
      '¿Deseas eliminar el prorrateo seleccionado?',
      'Si',
      'No',
      () => {
        this._catSicoss.EliminaProrrateoNomina(e.row.data.id_empleado, e.row.data.id_unidadOrganizativaLey).subscribe(ressp=>{
          this.greetingEvent.emit('');
        })
      },
      () => {}
    );

    
  }

}
