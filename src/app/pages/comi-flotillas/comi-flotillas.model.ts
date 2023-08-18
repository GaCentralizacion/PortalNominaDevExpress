export interface IEmpresa{
    alias:string;
    idEmpresa:string;
    sucursales: Sucursales[];
}

interface Sucursales{
    BaseDatos: string
    Descripcion:string
    DirIp: string
    IdEmpresa: number
    IdSucursal: string
    idWSF: number
    departamentos:DepertamentosFlotillas[]
    totalGasto:number
    totalGastoCurrency:any
    detalleGasto:any[]
}

interface DepertamentosFlotillas{
    departamento:string;
    id_departamento:number;
    nivel:string;
    porcentaje:number
    archivo:any
    aliasComisiones:any
    detalleCalculoDepto:any[]
    IdSucursal: string
    totalComision:number
    totalComisionCurrency:any
}