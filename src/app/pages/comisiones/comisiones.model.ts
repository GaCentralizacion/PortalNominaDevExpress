export interface ICalificacion{
    idSucursalWSF:number;
    idEmpresa:number;
    idSucural:number;
    nombre:string;
    calificacion:number;
    monto:number;
}

export interface ICalificacionNuevo{
    idSucursalWSF:number;
    idEmpresa:number;
    idSucural:number;
    nombre:string;
    calificacion:number;
    monto:number;
    ebitda:number;
    porcentaje:number;
    importeFinal:number;
}