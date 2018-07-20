const user = require('./user')
const post = require('./post')
const auth = require('./auth')

module.exports = (router) => {
    user(router)
    post(router)
    auth(router)
}
