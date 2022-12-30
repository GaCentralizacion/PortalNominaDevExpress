export interface LugarTrabajoModel{
    sucursal:string;
    workLocat:string;
}

export interface Pagas{
    fechasPaga: string;
    semQuin: number;
    tipo: string;
    frecuencia: string;
    paga: string;
    apagado: number;
}

export interface pagasSicoss{
    anio:number;
    apagado:number;
    fechasPaga:string;
    frecuencia:number;
    mes:number;
    paga:string;
    semQuin:number;
    tipo:number;
}

export interface AsientoContable{
    cuetaContable: string;
    cta: string;
    concepto: string;
    debe: number;
    haber: number;
    docto_afecta: string;
    id_persona_empresa: number;
    alias: string;
    idEmpresa: number;
    idSucursal: number;
    estatusCuenta: string;
    estatusCartera: string;
    existeBPRO: number;
    configBPRO: string;
    cargoAbon: string;
    sucursal?: string;
}

export interface campoPivote{
    caption:string;
    width?:number;
    dataField:string;
    area?:string;
    summaryType?: string;
    format?:string;
    dataType?:string
}

export interface PivotGridDataSource{
    field:campoPivote[],
    store:AsientoContable[]
}