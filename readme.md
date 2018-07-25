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



4# Middleware in Nodejs Application (Ok today lets talk about middleware)

Middleware is a kind of protection of our routes, a kind of checking something like login or other before redirect to other page,

NOde js middleware is like this,
1. Actually it's adding a function, in front of calling controller function
router
    .route('/users/')
    .get(function(req, res, next){   // this is a middleware function to check auth
        if(!req.headers){
			return res.status(401).send({ auth: false, message: 'No token provided.' });
		}
		var token = req.headers['x-access-token'];
		if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
		jwt.verify(token, config.secret, function(err, decoded) {
			if (err){
				return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });			
			}		 
			next();
		});					        
    },usercontroller.getAllUsers);    


2. But we need to make common isn't it?
To make common middleware
make a new folder Middlewares and move code to right here and save as JwtAuthMiddleware.js
module.exports = function (req, res, next) {    
    if(!req.headers){
		return res.status(401).send({ auth: false, message: 'No token provided.' });
	}
	var token = req.headers['x-access-token'];
	if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
	jwt.verify(token, config.secret, function(err, decoded) {
		if (err){
			return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });			
		}		 
		next();
	});					        
};

3. Now require this middleware and just change route like this
var JwtAuthMiddleware = require("./Middlewares/JwtAuthMiddleware"),

router
    .route('/users/')
    .get(JwtAuthMiddleware,usercontroller.getAllUsers);   

That's all. Happy coding

Reference from this
https://expressjs.com/en/guide/writing-middleware.html
https://stackoverflow.com/questions/41263787/setting-up-a-middleware-in-router-route-in-nodejs-express
https://hackernoon.com/middleware-the-core-of-node-js-apps-ab01fee39200
https://medium.com/@agoiabeladeyemi/a-simple-explanation-of-express-middleware-c68ea839f498
----------------------------------------------------------------------------

5# Differenct between sql and nosql and one to many relation populate usage

Ok today I will explain you about mongodb logic a little bit deep

Compare with mysql, there may be a little bit different in thinking logic

Let process in invoice saving

In mysql, there are three tables may be
1. invoice
	- id
	- total
	- customer
	- created 
	- ..

2. invoice_items
	- id
	- invoice_id (foreign key to invoice)
	- odr_qty
	- sell_price
	- item_id (foreign key to item)

3. Item 
	- item_id
	- price
	- item_price
	- item_desc
	...

Now saving in invoice
First save to invoice, second save to invoice items using invoice id,
Ok that's invoice logic of mysql


But a little bit different in mongodb
1. invoice
	{
		_id : 1212121
		total : 2323,
		customer : ..,
		created : ..,
		// here is a tricky part, there is no invoice_items table, no longer need. just insert invoice_items array to right here

		invoice_items : [
			{
				item_id : type: mongoose.Schema.Types.ObjectId, (refreence to item table) ,
				odr_qty : 12,
				sell_price : 1000
			}
			// there may be many array
		]
	}

2. item
	{
		item_id : ...,
		price : ...,
		item_price : ...,
		item_desc : ...,
	}

Ok like this, this is different between mongodb and mysql.

lets do with this comments and post now.

POst have comments
comments contain
{
	'author' : objectid reference to user table
	'text' : ...
}


References 
https://github.com/azat-co/practicalnode/blob/master/chapter7/chapter7.md
https://codeburst.io/build-simple-medium-com-on-node-js-and-react-js-a278c5192f47
https://stackoverflow.com/questions/24096546/mongoose-populate-vs-object-nesting

----------------------------------------------------------------------------

6# MERN Stack Series 6 - Async And Await Usage with post and tags pratical

Async is a kind of waiting promise object in javascript instead of writing in done function.

For basic example in db save, here is without using async
const post = new Post(request);		
const returndata = [];
post.save((err, savedpost) => {
	if(err){
		returndata = err;
	}else{
		returndata = savedpost;
	}
});	


In that case, If we 
console.log(returndata);  // ???
there is no return data just return []. because javascript works console.log first and then post.save is little take time and work second. That's why.
But we can solve by using async.

let returndata;
try{
	const post = new Post(request);		
	returndata = await post.save(); // the tricky around here is await , is akind of waiting job till the end after done this line, go to next line.
}catch(err){
	res.send(err);
}

console.log(returndata); // {'id': .., 'name': ..}  // will output the savved array

HOw clear and awesome.
Lets see more digging through with real world project.


Ok.. Our project is post project right. that's why we need tags isn't it.
tags may be php, javascript, or like this. but tags need to be new table. but withoud duplicate right???

Ok lets start

Post and tags relationship is post have many tags 
only save tags ids with array

References
http://blog.risingstack.com/mastering-async-await-in-nodejs?utm_source=mybridge&utm_medium=blog&utm_campaign=read_more

----------------------------------------------------------------------------
