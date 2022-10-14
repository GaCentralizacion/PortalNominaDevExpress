var env = process.env.NODE_ENV || 'production',
  express = require('express'),
  bodyParser = require('body-parser'),
  middlewares = require('./middlewares/admin'),
  router = require('./router'),
  swig = require('swig'),
  path = require('path');

  
var fileUpload = require('express-fileupload');

//Alta de opciones
var done = false;

var ExpressServer = function (config) {
  this.config = config || {};
  this.expressServer = express();

  // default options
  this.expressServer.use(fileUpload());


  this.expressServer.use(bodyParser.urlencoded({ extended: true }))
  this.expressServer.use(bodyParser.json());

  for (var middleware in middlewares) {
    this.expressServer.use(middlewares[middleware]);
  }

  this.expressServer.engine('html', swig.renderFile);
  this.expressServer.set('view engine', 'html');
  this.expressServer.set('views', path.resolve('dist'));

  swig.setDefaults({
    varControls: ['[[', ']]']
  });
  
  

  //////////////////////////////////////////////////////////////

  if (env == 'development') {
    console.log('OK NO HAY CACHE');
    this.expressServer.set('view cache', false);
    swig.setDefaults({ cache: false, varControls: ['[[', ']]'] });
  }

  //Inicia los APIs
  for (var controller in router) {
    for (var funcionalidad in router[controller].prototype) {
      var method = funcionalidad.split('_')[0];
      var entorno = funcionalidad.split('_')[1];
      var data = funcionalidad.split('_')[2];
      data = (method == 'get' && data !== undefined) ? ':data' : '';
      var url = '/api/' + controller + '/' + entorno + '/' + data;
      console.log(url)
      this.router(controller, funcionalidad, method, url);
    }
  }

  //Servimos el archivo angular
  this.expressServer.get('*', function (req, res) {
    res.sendFile(path.resolve('dist/index.html'));
  });

  this.expressServer.post('*', function (req, res) {
  //res.sendFile(path.resolve('dist/index.html'));
  var user = { idUsuario: req.body.idUsuario };
    res.render('index', {user});
  });

  this.expressServer.put('*', (req, res, next) => {
    if (req.body.type === 'guardaExcel') {
      if (!req.files) {
        return res.status(400).json({
          ok: false,
          mensaje: 'No selecciono nada',
          errors: { message: 'Debe de seleccionar una imagen' }
        });
      }

      // Obtener nombre del archivo
      var archivo = req.files.archivo;
      var nombreCortado = archivo.name.split('.');
      var extensionArchivo = nombreCortado[nombreCortado.length - 1];
      // Sólo estas extensiones aceptamos
      var extensionesValidas = ['xlsx', 'xls'];

      if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Extension no válida',
          errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') }
        });
      }

      // Nombre de archivo personalizado
      var nombreArchivo = `${nombreCortado[0]}-${new Date().getMilliseconds()}.${extensionArchivo}`;
      // Mover el archivo del temporal a un path
      var path = `./server/uploads/${nombreArchivo}`;
      archivo.mv(path, err => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error al guardar el archivo',
            errors: err
          });
        }
        return res.status(200).json({
          ok: true,
          mensaje: 'Archivo guardado',
          extensionArchivo: extensionArchivo,
          nombreArchivo: nombreArchivo
        });
      });
    } else {
      return res.status(404).json({
        ok: false,
        mensaje: 'Funcionalidad no encontrada',
        errors: { message: 'Debe especificar una acción' }
      });
    }
  });
};

ExpressServer.prototype.router = function (controller, funcionalidad, method, url) {
  console.log(url);
  var parameters = this.config.parameters;


  this.expressServer[method](url, function (req, res, next) {
    var conf = {
      'funcionalidad': funcionalidad,
      'req': req,
      'res': res,
      'next': next,
      'parameters': parameters
    }

    var Controller = new router[controller](conf);
    Controller.response();

  });
}
module.exports = ExpressServer;

