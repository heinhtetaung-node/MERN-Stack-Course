const Tag = require('./../models/Tag')
module.exports = {  
    getAllTag: (req, res, next) => {
		Tag.find({}).then((err, tags)=> {
            if (err)
                res.send(err)
            else if (!tags)
                res.send(404)
            else
                res.send(tags)
            next()            
        })

    },
    
}