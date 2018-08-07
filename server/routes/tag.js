const PostController = require('./../controllers/PostController')  // this is require our newly created UserController

module.exports = (router) => {
    router
        .route('/tags').get(PostController.getAlltags)
}
