

const UserRepository = require('./../repositories/UserRepository')
// const bcrypt = require('bcryptjs');

"use strict";
var $this;
class UserController {
	// userrepo
	constructor(){
		this.userrepo = new UserRepository();    
	}	

	getAllUsers(req, res, next){
		// if (err)
  //           res.send(err)
  //       else if (!users)
  //           res.send(404)
  //       else
  //           res.send(users)
  		// res.send([{id : 1, name : 'abc'}, {id : 2, name : 'def'}]);
  		console.log(this);
  		const users = this.userrepo.getAll();
  		res.send(users);
        // next();
	}
	getUser(req, res, next){
		const userid = req.params.id;
		res.send({id : userid});
	}
}

module.exports = UserController;