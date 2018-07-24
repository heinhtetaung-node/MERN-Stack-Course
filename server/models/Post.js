const mongoose = require('mongoose')
let PostSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        author : {  // refrence to user table
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comments : [
        	{
        		author: {
        			type : mongoose.Schema.Types.ObjectId,
        			ref: 'User'
        		},
        		text : String
        	}
        ]       
    }
)
module.exports = mongoose.model('Post', PostSchema)