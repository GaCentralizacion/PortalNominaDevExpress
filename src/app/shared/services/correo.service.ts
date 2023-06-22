import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';

@Injectable({
    providedIn:'root'
})

export class CorreoServices{
    constructor(private http: HttpClient){}

    sendMail(asunto:string, email :string, cuerpo:string){

        let params = new HttpParams()
        .set('asunto',asunto)
        .set('email',email )
        .set('cuerpo',cuerpo)

        return this.http.post(`${environment.apiNomina}api/mailer/SendMail`, params);
    }
}