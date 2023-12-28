const express = require('express')
const Router = express.Router()
const authController = require('../controllers/authController')
const loginLimiter = require('../middleware/loginLimiter')

Router.route('/')
    .post(loginLimiter, authController.login)

Router.route('/refresh')
    .get(authController.refresh)

Router.route('/logout')
    .post(authController.logout)

module.exports = Router
