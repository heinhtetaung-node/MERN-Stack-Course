// this is our route file let me copy some codes
var JwtAuthMiddleware = require("./../Middlewares/JwtAuthMiddleware")
const usercontroller = require('./../controllers/UserController')  // this is require our newly created UserController

module.exports = (router) => {

    /**
     * get a user
     */
    router
        .route('/user/:id')  // it means localhost:5000/user/id  goes to usercontroller getUser function
        .get(JwtAuthMiddleware, usercontroller.getUser)

    /**
     * adds a user
     */
    router
        .route('/user')  // it means post localhost:5000/user/  goes to usercontroller addUser function
        .post(usercontroller.addUser)


	router
        .route('/users/')  // it means localhost:5000/users/  goes to usercontroller getAllUsers function
        .get(JwtAuthMiddleware, usercontroller.getAllUsers)
}