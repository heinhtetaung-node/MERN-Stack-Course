// server/models/User.js   well it contain two columns, name, email. This is a kind of mongoose model ORM .
const mongoose = require('mongoose')
let UserSchema = new mongoose.Schema(
    {
        name: String,
        email: String        
    }
)
module.exports = mongoose.model('User', UserSchema)