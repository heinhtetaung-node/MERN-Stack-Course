const User = require('./../models/User')
const bcrypt = require('bcryptjs');

module.exports = {   // this is exporting of our file to use in every where
	addUser : (req, res, next) => {		// this is a kind of es6 function which is suitable for boring many codes
		if(req.body.password){
			var hashedPassword = bcrypt.hashSync(req.body.password, 8);	
			req.body.password = hashedPassword;					
		}

		const saveuser = req.body;
		const user = new User(saveuser);  // In object declare we can user like this to put user array
		if(!saveuser._id){
			user.save((err, newUser) => {   // newUser is return user, newly createed
				if(err)
					res.send(err)
				else if(!newUser)
					res.send(400)
				else
					newUser.password = undefined;  // password should not show
					res.send(newUser)
				next()
			});
		}else{
			User.findById(req.body._id, function(err, user){  //1st we need to find by id
				if(err) return handleError(err);		// if error throw it
				user.set(saveuser);		// update with our request parameter aray
				user.save((err, updateUser) => {	// updateUser is updated user
					if(err)
						res.send(err)
					else if(!updateUser)
						res.send(400)
					else
						updateUser.password = undefined;  // password should not show
						res.send(updateUser)
					next()
				});

			});
		}
	},
	getUser : (req, res, next) => {
		//console.log(req.params.id); // this is print our id parameter

		// lets do this
		const userid = req.params.id;
		User.findById(userid, { password: 0 }).then((err, user)=> {  // this is because we should remove password in data showing
            if (err)
                res.send(err)
            else if (!user)
                res.send(404)
            else
                res.send(user)
            next()            
        })
	},
	getAllUsers : (req, res, next) => {
		User.find({}, { password: 0 }).then((err, users)=> {
            if (err)
                res.send(err)
            else if (!users)
                res.send(404)
            else
                res.send(users)
            next()            
        })

	}
}