import { Injectable } from '@angular/core';

@Injectable({
    providedIn:'root'
})

export class MesesServices{
    constructor(){}

    meses(){

       const lstMeses = [
            {
              id: 1,
              text: 'Enero',
            },
            {
              id: 2,
              text: 'Febrero',
            },
            {
              id: 3,
              text: 'Marzo',
            },
            {
              id: 4,
              text: 'Abril',
            },
            {
              id: 5,
              text: 'Mayo',
            },
            {
              id: 6,
              text: 'Junio',
            },
            {
              id: 7,
              text: 'Julio',
            },
            {
              id: 8,
              text: 'Agosto',
            },
            {
              id: 9,
              text: 'Septiembre',
            },
            {
              id: 10,
              text: 'Octubre',
            },
            {
              id: 11,
              text: 'Noviembre',
            },
            {
              id: 12,
              text: 'Diciembre',
            },
          ];

        return lstMeses;
    }
}