import { exportDataGrid, exportPivotGrid } from 'devextreme/excel_exporter'
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';

export class ExcelClass{


    onExporting(e:any, nombreHoja:string, nombreArchivo:string){
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet(nombreHoja);
    
        exportDataGrid({
          component: e.component,
          worksheet,
          autoFilterEnabled: true,
        }).then(() => {
          workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `${nombreArchivo}.xlsx`);
          });
        });
        e.cancel = true;

        return 'ok'

       }

    onExportingPivot(e:any, nombreHoja:string, nombreArchivo:string){
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet(nombreHoja);
    
        exportPivotGrid({
          component: e.component,
          worksheet
        }).then(() => {
          workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `${nombreArchivo}.xlsx`);
          });
        });
        e.cancel = true;

        return 'ok'

       }
}