const express = require("express")
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')

const routes = require('./routes/')

const app = express() 
const router = express.Router()   

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// const url = process.env.MONGODB_URI || "mongodb://localhost:27017/mernstack"

/** connect to MongoDB datastore */
// try {
//     mongoose.connect(url, {
//         //useMongoClient: true
//         useNewUrlParser: true  // solve error DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
//     })    
// } catch (error) {
//     console.log(error)
// }

let port = 5000 || process.env.PORT   // this is our server port, now can run as localhost:5000

routes(router) 	// we can use route by like this

// later do
// const corsOptions = {
// 	origin: ['http://localhost:3000', 'https://mern-stack-course-react.herokuapp.com'],
// 	credentials:true,
// }
// app.use(cors(corsOptions))

app.use(bodyParser.json())

app.use('/api', router)  // this is declare of routes by premix api...

/** start server */
app.set('port', (process.env.PORT || 5000));


app.listen(app.get('port'), ()=>{
	console.log('Node app is running on port', app.get('port'));
})