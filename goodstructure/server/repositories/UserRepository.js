class UserRepository { 
	getAll(){
		return [{id : 1, name : 'abc'}, {id : 2, name : 'def'}];
	}
}

module.exports = UserRepository;