import { Component, NgModule, Output, Input, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { ItemClickEvent } from 'devextreme/ui/tree_view';
import { DxTreeViewModule, DxTreeViewComponent } from 'devextreme-angular/ui/tree-view';
import { navigation } from '../../../app-navigation';

import * as events from 'devextreme/events';
import { AccesoService } from '../../services/acceso.service';

@Component({
  selector: 'app-side-navigation-menu',
  templateUrl: './side-navigation-menu.component.html',
  styleUrls: ['./side-navigation-menu.component.scss']
})
export class SideNavigationMenuComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DxTreeViewComponent, { static: true })
  menu!: DxTreeViewComponent;

  @Output()
  selectedItemChanged = new EventEmitter<ItemClickEvent>();

  @Output()
  openMenu = new EventEmitter<any>();

  OpcionesMenu: OpMenu[]=[]
    

  
  itemDetalle:any = [] 
  miMenu:any
  itemsMenu:any

  private _selectedItem!: String;
  @Input()
  set selectedItem(value: String) {
    this._selectedItem = value;
    if (!this.menu.instance) {
      return;
    }

    this.menu.instance.selectItem(value);
  }

  private _items!: Record <string, unknown>[] ;
  
  // get items() {
  //   if (!this._items) {
  //     // 

      
  //     console.log(this.miMenu);
      
  //     this._items = this.miMenu.map((item:any) => {
  //       if(item.path && !(/^\//.test(item.path))){
  //         item.path = `/${item.path}`;
  //       }
  //        return { ...item, expanded: !this._compactMode }
  //       });

  //     // this._items = navigation.map((item:any) => {
  //     //   if(item.path && !(/^\//.test(item.path))){
  //     //     item.path = `/${item.path}`;
  //     //   }
  //     //    return { ...item, expanded: !this._compactMode }
  //     //   });

  //   }

  //   return this._items;
  // }

  private _compactMode = false;
  @Input()
  get compactMode() {
    return this._compactMode;
  }
  set compactMode(val) {
    this._compactMode = val;

    if (!this.menu.instance) {
      return;
    }

    if (val) {
      this.menu.instance.collapseAll();
    } else {
      this.menu.instance.expandItem(this._selectedItem);
    }
  }

  constructor(private elementRef: ElementRef, private accesoService: AccesoService) { 
    
  }
 
  async ngOnInit(): Promise<void> {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.miMenu = await this.ObtieneMenuUsuario()
    this.miMenu = JSON.parse(this.miMenu)
    this.itemsMenu = this.items()

  }

  items(){
      if (!this._items) {

        console.log(this.miMenu);
      
      this._items = this.miMenu.map((item:any) => {
        if(item.path && !(/^\//.test(item.path))){
          item.path = `/${item.path}`;
        }
         return { ...item, expanded: !this._compactMode }
        });

      // this._items = navigation.map((item:any) => {
      //   if(item.path && !(/^\//.test(item.path))){
      //     item.path = `/${item.path}`;
      //   }
      //    return { ...item, expanded: !this._compactMode }
      //   });

    }

    return this._items;
  }


  onItemClick(event: ItemClickEvent) {
    this.selectedItemChanged.emit(event);
  }

  ngAfterViewInit() {
    events.on(this.elementRef.nativeElement, 'dxclick', (e: Event) => {
      this.openMenu.next(e);
    });
  }

  ngOnDestroy() {
    events.off(this.elementRef.nativeElement, 'dxclick');
  }

  async ObtieneMenuUsuario(){

    return new Promise(async (resolve) => {
       let usuario:any= sessionStorage.getItem('login')
      usuario = JSON.parse(usuario)

      let menuNominas:any = await this.MenuNomina(usuario.idUsuario)
      
      for (let i = 0; i < menuNominas.length; i++) {
        let opcion: OpMenu={
          text:'',
          icon:'',
          items:[{}]
        }
        const element = menuNominas[i];


        let itemDeta:any = await this.MenuNominaDetalle(element.items, usuario.idUsuario)      
        this.itemDetalle = [...itemDeta]

        opcion.text = element.text
        opcion.icon = element.icon
        opcion.items = this.itemDetalle
        this.OpcionesMenu.push(opcion)

      }

      
        resolve(JSON.stringify(this.OpcionesMenu))  
    })

     
      
  }

  MenuNomina(idRol:number){
    return new Promise((resolve) =>{
      this.accesoService.MenuNomina(idRol).subscribe(resp => resolve(resp))
    })
  }

  MenuNominaDetalle(items:number,idRol:number){
    return new Promise((resolve) => {
      this.accesoService.MenuNominaDetalle(items, idRol).subscribe(resp => resolve(resp))
    })
  }

}

interface OpMenu{
  text:string;
  icon:string;
  items?:[OpMenuDetalle]
}

interface OpMenuDetalle{
  text?:string;
  path?:string;
  icon?:string;
}

@NgModule({
  imports: [ DxTreeViewModule ],
  declarations: [ SideNavigationMenuComponent ],
  exports: [ SideNavigationMenuComponent ]
})
export class SideNavigationMenuModule { }


