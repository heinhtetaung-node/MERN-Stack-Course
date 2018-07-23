const express = require("express")
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
// these are require packages that we need

// we can add route by like this
const routes = require('./routes/')

const app = express()  // this is initialization of express app
const router = express.Router()   // this is create router

// add this line because intend to accept only json para and only return json
router.use(bodyParser.urlencoded({ extended: false })); // for json return
router.use(bodyParser.json());  // for json return 

const url = process.env.MONGODB_URI || "mongodb://localhost:27017/mernstack"  // this is a kind of mongodb config, mernstack is db name

/** connect to MongoDB datastore */
try {
    mongoose.connect(url, {
        //useMongoClient: true
        useNewUrlParser: true  // solve error DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
    })    
} catch (error) {
    console.log(error)
}

let port = 5000 || process.env.PORT   // this is our server port, now can run as localhost:5000

routes(router) 	// we can use route by like this

app.use(cors())	 // this is let our app can use from every domain, 
app.use(bodyParser.json())

app.use('/api', router)  // this is declare of routes by premix api...


/** start server */
app.listen(port, () => {		// this is run app
    console.log(`Server started at port: ${port}`);
});
