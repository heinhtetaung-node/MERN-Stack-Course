const User = require('./../models/User')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

module.exports = {  
	loginAttempt : (req, res, next) => {		
		User.findOne({ email: req.body.email }, function (err, user) {
		    if (err) return res.status(500).send('Error on the server.');
		    if (!user) return res.status(404).send('No user found.');
		    
		    // after we found data with email, we crypt password and check with user pw
		    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);		    

		    if (!passwordIsValid){
		    	return res.status(401).send({ auth: false, token: null });	
		    } 

		    // If password valid jwt need to produce token with our secret
		    var token = jwt.sign({ id: user._id }, config.secret, {
		      	expiresIn: 86400 // seconds #expires in 24 hours
		    });
		    res.status(200).send({ auth: true, token: token });  // return token
		});
	},
	checkToken : (req, res, next) => {  // this method is use for checking token, expire or not
		var token = req.headers['x-access-token'];
		if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
		jwt.verify(token, config.secret, function(err, decoded) {
			if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
			res.status(200).send(decoded); // if valid return decoded token, it contain id, expire time and ...
		});
	}
}