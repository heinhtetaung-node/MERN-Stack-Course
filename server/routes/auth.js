const authController = require('./../controllers/AuthController')  // this is require our newly created UserController

module.exports = (router) => {
    router
        .route('/auth/login').post(authController.loginAttempt)

	router
        .route('/auth/user').get(authController.checkToken)    
}
