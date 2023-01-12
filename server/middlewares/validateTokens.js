var jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
    console.log('validando token');
    if( req.get('authorization') ){
    	var token = req.get('authorization').replace('Bearer ','');
      jwt.verify( token, 'depositos', function(err, decoded) {      
        if (err) {
          console.log('error validando token')
        	console.log(err)
        } else {
          // if everything is good, save to request for use in other routes
          console.log("token validado");
        }
      });
    }
   next();
}; 
