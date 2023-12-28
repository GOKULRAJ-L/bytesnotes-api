const express = require('express')
const Router = express.Router()
const UserController = require('../controllers/usercontrollers')
const verifyJWT = require('../middleware/verifyJWT')

Router.use(verifyJWT)
Router.route('/')
   .get(UserController.getallUser)
   .post(UserController.createUser)
   .put(UserController.updateUser)
   .delete(UserController.deleteUser)

// all these methods to be managed by the controller

module.exports = Router
