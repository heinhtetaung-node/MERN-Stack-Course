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


CRUD including relation tables
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


