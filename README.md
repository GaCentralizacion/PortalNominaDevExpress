# PortalNominaDevExpress
Front End, para el proyecto de Pólizas de Nómina con los objetos DevExpress

# Compilado
La siguiente linea se usa para compilar el proyecto y generar la carpeta dist que es la ruta a la que apunta node express para levatar el proyecto
ng build --configuration development --watch

--watch nos va a servir para que se recompile al momento de guardar cambios

# Iniciar el proyecto
Se recomienda crear el archivo launch con la siguiente configuracion
  "configurations": [
    {
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "name": "nodemon",
      "program": "${workspaceFolder}/workers.js",
      "request": "launch",
      "restart": true,
      "runtimeExecutable": "nodemon",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "type": "node"
    }
  ]

# Creacion Interface
Las interfaces que se requieran crear se deben de colocar dentro de la carpeta model que se encuentra dentro de la carpeta shared

# creación paginas
Cada pagina que se deba crear se realizara dentro de la carpeta pages, la nueva carpeta debe de contener los 5 archivos que se enlista

- nombre.routing.module.ts
- nombre.component.html
- nombre.component.scss
- nombre.component.ts
- nombre.module.ts

los componentes de Devexpress se deben de invocar dentro del archivo module de la carpeta creada (no se debe de colocar nada en el app.module)
con la finalidad de reducir la carga del portal al inicio y con ello solo cargar los componentes necesarios de la pagina

Cada HTML creado debe de contener al inicio los siguientes 2 div para hacer el efecto de la tarjeta
<div class="content-block">
  <div class="dx-card responsive-paddings"  fxFlexAlign="center" id="P_AsientoContable">
  </div>
</div>

el dato que coloquen en id por ejemplo P_AsientoContable se debe de colocar en el loading de la pagina si es que se requiere por ejemplo
<dx-load-panel
  #loadPanel
  shadingColor="rgba(0,0,0,0.4)"
  [position]="{ of: '#P_AsientoContable' }"
  [(visible)]="loadingVisible"
  [showIndicator]="true"
  [showPane]="true"
  [shading]="true"
>
</dx-load-panel>


# Documentación DevExpress
Se comparte la liga de la documentación de los componentes de DevExpress
https://js.devexpress.com/Demos/WidgetsGallery/
