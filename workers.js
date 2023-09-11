var http = require('http'),
	env = process.env.NODE_ENV || 'development',
	conf = require('./conf'),
	expressServer = require('./server/expressServer');

	console.log(process.env.NODE_ENV )

var Workers = function(config){
	config = config || {}

	
	console.log('Inicia conexión');
	console.log('ambiente ',env)
	
	var app = new expressServer({parameters : conf[env] });

	console.log(conf[env]);
	this.server = http.createServer(app.expressServer);

}

Workers.prototype.run = function(){
	this.server.listen(conf[env].port);
	this.server.setTimeout(1800000);
	//this.server.keepAliveTimeout(1800000);
}

if(module.parent){
	module.exports = Workers;
} else {
	var workers = new Workers();
	workers.run();
	console.log('Modo debug');
}