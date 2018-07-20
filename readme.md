MERN Stack Course 
MERN = Mongodb + Express + ReactJs + NodeJs
Mongodb (Nosql database)
Express (one of Nodejs most popular Framework)
ReactJs (The most popular frontend javascript framework powered by facebook)
NodeJs (Javascript server side language, most popular and most attractive salary language in nowadays)


Software Requirements
1. Node Js https://nodejs.org/en/download/
2. MongoDb https://www.mongodb.com/download-center
3. Robo Mongo (A kind of GUI for MongoDb) https://robomongo.org/download


Initial dependencies Installation
In command line, under your folder create server folder
- npm install mongoose express cors body-parser
mongoose (MongoDb ORM package)
express (Express Framework)
cors (Cross Origin Allow package)
body-parser (Request Parameter Management package)


1# CRUD including relation tables
1. create app.js first which is index of our application folder
2. create routes
	- create folder routes in server and also controller
	- In routes folder, we need to create seprate module for route
	For example, if we want to create route for user module, it should be routes/user
	but there are other ways, but I think this is very suitable way.
3. create controllers
4. create model
5. run mongodb C:\Program Files\MongoDB\Server\4.0\bin  Open cmd, run mongod
	and create database, we dont need to create tables, because mongodb not need, it create tables within insert
4. run server http://localhost:5000
References from this https://codeburst.io/build-simple-medium-com-on-node-js-and-react-js-a278c5192f47

----------------------------------------------------------------------------

2# Relational Database in nodejs mongodb using mongoose
1. create model post
2. create controller
	In controller to get relational object just use populate
	like following
	Post.find().populate('author').exec((err, posts)=> {

	});
3. create routes
4. test in postman 
References from this https://codeburst.io/build-simple-medium-com-on-node-js-and-react-js-a278c5192f47

----------------------------------------------------------------------------

3# Api Authentication with JWT(Json Web Tokens) in NodeJs 

Before we do, we need to have JWT knowledge
JWT is a token a kind of string which is encoded login user information (user_id, expire_time, ...) like this
It use in api because api cant use session like web, If device login to system, we need to make proove for this device is login success or not. So token can be used to proove this device is successfully login and will expire in 24hr or something like this. So every time, if this device access to our system, token must be include in api header and need to check this token is expire or not. After decoded token, just user info comes out (user_id, expire_tie, ...)
That's all.
Hope you understand. Let's do it.

1. create config.js under server This is hash key for creating token
module.exports = {
  'secret': 'supersecret' // anything you like
};
2. Add this two line in app.js under const router = express.Router()
router.use(bodyParser.urlencoded({ extended: false })); // for json return
router.use(bodyParser.json());  // for json return 
3. install this two 
npm install jsonwebtoken --save
npm install bcryptjs --save
4. In Model\User.js Add new column password under email
email: String,
password: String

5. Need to modify our UserController@addUser function add password field
need to use bcrypt in top
const bcrypt = require('bcryptjs');

addUser : (req, res, next) => {		
	if(req.body.password){
		var hashedPassword = bcrypt.hashSync(req.body.password, 8);	
		req.body.password = hashedPassword;					
	}
	// old code right here
	..
	...
}
And need to add projection in getUser() and getAllUsers() like following
User.findById(userid, { password: 0 }).then((err, user)=> {
User.find({}, { password: 0 }).then((err, users)=> {

And remove password before response
newUser.password = undefined;  // password should not show
res.send(newUser)

Projection is a kind of remove something from our mongodb response. password should not show to other isn't it? That's why need to remove password by using projection.


6. Create AuthController.js under controllers
const User = require('./../models/User')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

module.exports = {  
	loginAttempt : (req, res, next) => {		
		User.findOne({ email: req.body.email }, function (err, user) {
		    if (err) return res.status(500).send('Error on the server.');
		    if (!user) return res.status(404).send('No user found.');
		    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
		    if (!passwordIsValid){
		    	return res.status(401).send({ auth: false, token: null });	
		    } 
		    var token = jwt.sign({ id: user._id }, config.secret, {
		      	expiresIn: 86400 // seconds #expires in 24 hours
		    });
		    res.status(200).send({ auth: true, token: token });
		});
	},
	checkToken : (req, res, next) => {
		var token = req.headers['x-access-token'];
		if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
		jwt.verify(token, config.secret, function(err, decoded) {
			if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
			res.status(200).send(decoded);
		});
	}
}


7. Make routes for auth
// this is our route file let me copy some codes

const authController = require('./../controllers/AuthController')  // this is require our newly created UserController

module.exports = (router) => {
    router
        .route('/auth/login').post(authController.loginAttempt)

	router
        .route('/auth/user').get(authController.checkToken)    
}

8. Testing
http://localhost:5000/api/auth/login/    -- POST
{
	"email" : "...",
	"password" : "..."
}

If true, response should be like this
{
    "auth": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViNTE5MWUzMjE1MjcwMDZhY2ZiNWE0OSIsImlhdCI6MTUzMjA3MzMxNSwiZXhwIjoxNTMyMTU5NzE1fQ.SnBLQsTQiFZTGwn3vjyOvIiIC3VUYubLjjdBbQQObVA"
}
ELSE
	No User found


After login, check your token 
http://localhost:5000/api/auth/user/
Make sure add header 
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViNTE5MWUzMjE1MjcwMDZhY2ZiNWE0OSIsImlhdCI6MTUzMjA3MzMxNSwiZXhwIjoxNTMyMTU5NzE1fQ.SnBLQsTQiFZTGwn3vjyOvIiIC3VUYubLjjdBbQQObVA"


That's all happy coding

References from https://medium.freecodecamp.org/securing-node-js-restful-apis-with-json-web-tokens-9f811a92bb52
----------------------------------------------------------------------------

