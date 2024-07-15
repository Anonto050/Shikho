const express = require('express');

const authController = require('../controllers/auth')

//const router = express.Router()
const router = require('express-promise-router')()

router.get('/signin', authController.getSignIn)

router.post('/signin', authController.postSignIn)

router.get('/signup', authController.getSignUp)

router.post('/signup', authController.postSignUp)

router.get('/signout', authController.getSignOut)




module.exports = router