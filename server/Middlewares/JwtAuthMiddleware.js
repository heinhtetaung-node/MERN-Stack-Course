const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = function (req, res, next) {    
	// ok lets check token exist and token match in right here
    if(!req.headers){
        return res.status(401).send({ auth:false, message: 'No token provided'})
    }
    var token = req.headers['x-access-token'];
    if(!token){
        return res.status(401).send({ auth:false, message: 'No token provided'})
    }
    // if token exist need to check match with our login user
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err){
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });         
        }      
        // if token is okay lets go next step  
        next(); // by using next. so will reach to 
    }); 
}