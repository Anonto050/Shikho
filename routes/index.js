
const user = require('../models/user');
const express = require('express');

const homeController = require('../controllers/index');
const instructorController = require("../controllers/instructor");


//const router = express.Router()
const router = require('express-promise-router')()

router.get('/', homeController.getHome)

router.post('/search/:START', homeController.postSearch)

router.get('/courses', homeController.getCourses)

router.get('/instructors', homeController.getInstructors)









module.exports = router



module.exports = router;
