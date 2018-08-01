// this is our route file let me copy some codes

const tagcontroller = require('./../controllers/TagController')  // this is require our newly created UserController

module.exports = (router) => {
        
    router
    .route('/tags/')  
    .get(tagcontroller.getAllTag) 
}
