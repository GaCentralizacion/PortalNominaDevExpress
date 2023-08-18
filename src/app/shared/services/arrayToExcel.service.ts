import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}

  async exportToExcel(data: any[], fileName: string, sheetName: string): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // Agregar encabezados de columna
    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);

    // Agregar datos
    data.forEach((item) => {
      const values = headers.map((header) => item[header]);
      worksheet.addRow(values);
    });

    // Configurar el estilo de la primera fila (encabezados)
    worksheet.getRow(1).font = { bold: true };

    // Generar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    this.saveExcelFile(buffer, fileName);
  }

  private saveExcelFile(buffer: ArrayBuffer, fileName: string): void {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
