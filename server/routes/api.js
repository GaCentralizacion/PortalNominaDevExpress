var express    = require('express');
var request = require('request');
var router = express.Router();
var sql = require('mssql'),
    config = {
        "port": 4200,
        "SQL_user": "sa",
        "SQL_password": "S0p0rt3",
        "SQL_server": "192.168.20.57",
        "SQL_database": "xgaBProFinanzas",
        "SQL_connectionTimeout": 60000

} ;

router.get('/', function(req, res) {
	var connectionString = {
        user: config.SQL_user,
        password: config.SQL_password,
        server: config.SQL_server, // You can use 'localhost\\instance' to connect to named instance
        database: config.SQL_database,
        connectionTimeout: config.SQL_connectionTimeout
    };
	var connection =  new sql.Connection(connectionString);

	connection.connect(function(err) {
        // Stored Procedure
        var request = new sql.Request(connection);
        var params = [
        	{ name: 'correo', value: req.query.user, type: sql.VarChar('50') },
        	{ name: 'pass', value: req.query.password, type: sql.VarChar('50') },
    	];
        // Add inputs
        if(params.length > 0){
            params.forEach(function(param) {
            	console.log( param );
                request.input(param.name, param.type, param.value);
            });
        }

        request.execute('SEL_LOGIN_SP').then(function(recordsets) {
                console.log( recordsets )
                console.log("success");
            }).catch(function(err) {
/*                callback(err);
*/                console.log('Error al realizar la operacion, mensaje: ' + err);
            });
    });
});



module.exports = router;
