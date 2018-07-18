// let me copy paste some code ok I not copy paste lets write

// lets import User model right here
const User = require('./../models/User')

module.exports = {   // this is exporting of our file to use in every where
	addUser : (req, res, next) => {		// this is a kind of es6 function which is suitable for boring many codes
		// req is request parameter, res is response, next is always need after done response
		console.log(req.body); // this is print our save data array come from api
		
		// ok lets do crud in here, need to create model first
		const saveuser = req.body;
		const user = new User(saveuser);  // In object declare we can user like this to put user array
		if(!saveuser._id){
			user.save((err, newUser) => {   // newUser is return user, newly createed
				if(err)
					res.send(err)
				else if(!newUser)
					res.send(400)
				else
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
		User.findById(userid).then((err, user)=> {   // user is return user find result user
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
		User.find((err, users)=> {   // user is return user find result user
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