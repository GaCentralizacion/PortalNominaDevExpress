var XLSX = require('xlsx')
const XlsxPopulate = require('xlsx-populate');
// ==========================================
//  Recupera el detalle de cuentas contables (Catalogo)
// ==========================================
exports.obtenerXmlCuentasExcel = function (nombreArchivo, idCompania) {
    var xmlCuentaFinal = '';
    var xmlCuentas = [];
    var mensaje = 'Se genero un error al procesar el excel';
    var resultado = false;
    var errores = [];

    var workbook = XLSX.readFile('server\\uploads\\' + nombreArchivo);
    var sheet_name_list = workbook.SheetNames;
    if (validaNombreHojas(sheet_name_list)) {
        var xlCuentas = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        var xlCompanias = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]]);
        for (var i = 0; i < xlCuentas.length; i++) {
            var arrayCuentas = obtenerXmlCuenta(xlCuentas[i], getEncabezadoCuentas(), xlCompanias);
            if (arrayCuentas['ok']) {
                xmlCuentas.push('<CuentaContable>' + arrayCuentas['xmlcuentas'].join('') + '</CuentaContable>');
            } else {
                errores.push({ cuenta: xlCuentas[i], mensaje: arrayCuentas['mensaje'] });
            }
        }
        if (xmlCuentas.length > 0) {            
            xmlCuenta.push('<idCompania>' + idCompania + '</idCompania>');
            xmlCuentaFinal = '<CuentaContables>' + xmlCuentas.join('') + '</CuentaContables>';
            resultado = true;
            mensaje = 'Xml generado correctamente.'
        } else {
            mensaje = 'Ninguna cuenta fue valida';
        }
    } else {
        mensaje = 'Error al validar las hojas del excel';
    }

    return {
        ok: resultado,
        mensaje: mensaje,
        xmlcuentas: xmlCuentaFinal,
        errores: errores,
        cuentasValidas: xmlCuentas.length
    };

    return xmlCuentaFinal;
};

// ==========================================
//  Obtiene el xml por cuenta contable
// ==========================================
function obtenerXmlCuenta(cuenta, encabezadoCuenta, xlCompanias) {
    var xmlCuenta = [];
    var mensaje = '';
    var resultado = false;
    console.log(encabezadoCuenta);
    for (var nombreTag in cuenta) {
        if (!encabezadoCuenta.find(cuenta => cuenta.nombre === nombreTag)) {
            return {
                ok: false,
                mensaje: 'El nombre de la columna: ' + nombreTag + ' no es valido',
                xmlcuentas: []
            };
        } else {
            xmlCuenta.push('<' + nombreTag + '>' + cuenta[nombreTag] + '</' + nombreTag + '>');
            encabezadoCuenta.splice(encabezadoCuenta.findIndex(cuenta => cuenta.nombre === nombreTag), 1);
        }
    }
    if (xmlCuenta.length > 0) {
        if (encabezadoCuenta.length > 0) {
            mensaje = 'No contiene información para: ' + encabezadoCuenta.join(', ');
        }         
        /*else {
            var xmlCompania = obtenerCompaniaPorCuenta(cuenta, xlCompanias);
            if (xmlCompania.length > 0) {
                xmlCuenta.push('<Companias>' + xmlCompania.join('') + '</Companias>');
                resultado = true;
            } else {
                mensaje = 'No contiene companias validas';
            }
        }*/
    } else {
        mensaje = 'La información de la cuenta no es valida';
    }
    return {
        ok: resultado,
        mensaje: mensaje,
        xmlcuentas: xmlCuenta
    };
}

// ==========================================
//  Obtiene el nombre del encabezado de la cuenta
// ==========================================
function getEncabezadoCuentas() {
    return [
        { nombre: 'NUMCTA', posicion: 1 },
        { nombre: 'DESCRIPCION', posicion: 1 },
        { nombre: 'NATURALEZA', posicion: 1 },
        { nombre: 'ACUMDET', posicion: 1 },
        { nombre: 'GPO1', posicion: 1 },
        { nombre: 'GPO2', posicion: 1 },
        { nombre: 'GPO3', posicion: 1 },
        { nombre: 'DEPTO', posicion: 1 },
        { nombre: 'DICTAMEN', posicion: 1 },
        { nombre: 'EFINTERNO', posicion: 1 },
        { nombre: 'NOTASDIC', posicion: 1 },
        { nombre: 'NOTASFIN', posicion: 1 },
        { nombre: 'TipoBI', posicion: 1 },
        { nombre: 'AFECTACC', posicion: 1 },
        { nombre: 'GRUPOSAT', posicion: 1 },
        { nombre: 'SITUACION', posicion: 1 },
        { nombre: 'COMPANIA', posicion: 1 }
    ];
}

// 
// ==========================================
//  Valida el nombre de las hojas de excel
// ==========================================
function validaNombreHojas(sheet_name_list) {
    if (sheet_name_list[0] !== 'Cuentas') {
        return false;
    } if (sheet_name_list[1] !== 'Companias') {
        return false;
    }
    return true;
}


