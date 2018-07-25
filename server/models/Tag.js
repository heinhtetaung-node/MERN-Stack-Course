// server/models/User.js   well it contain two columns, name, email. This is a kind of mongoose model ORM .
const mongoose = require('mongoose')
let TagSchema = new mongoose.Schema(
    {
       	title : { type: String, unique : true}   
    }
)
module.exports = mongoose.model('Tag', TagSchema)