// this is our route file let me copy some codes

const postcontroller = require('./../controllers/PostController')  // this is require our newly created UserController

module.exports = (router) => {

    /**
     * get a user
     */
    router
        .route('/post/:id')  
        .get(postcontroller.getPost)

    /**
     * adds a Post
     */
    router
        .route('/post') 
        .post(postcontroller.addPost)


	router
        .route('/posts/')  
        .get(postcontroller.getAllPost)    
}
