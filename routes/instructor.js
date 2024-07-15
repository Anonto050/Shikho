const express = require('express');

const instructorController = require('../controllers/instructor');


//const router = express.Router()
const router = require('express-promise-router')()

router.get('/user/:ID/', instructorController.getHome)

router.get('/user/:ID/about', instructorController.getAbout)
router.get('/user/:ID/forum', instructorController.getForumRequest)

router.post('/user/:ID/forum', instructorController.getForumResponse)

router.get('/user/:ID/forum/:QID', instructorController.getForumDetails)

router.post('/user/:ID/forum/:QID', instructorController.getForumAnswers)

router.get('/user/:ID/courses', instructorController.getCourses)

router.get('/user/:ID/instructors', instructorController.getInstructors)

router.get('/user/:ID/profile-view', instructorController.getProfileView)
router.get('/user/:ID/profile-view/edit', instructorController.editProfileView);
router.post('/user/:ID/profile-view/edit', instructorController.PostEditProfileView);


/* */

router.post('/user/:ID/search/:START', instructorController.postSearch);

router.get('/user/:ID/category-view/:CATEGORY/:START', instructorController.get_Category_view)

router.get('/user/:ID/course-view/:CRSID', instructorController.get_course_view)

router.get('/user/:ID/add-course/pre', instructorController.get_pre_add_course)
router.post('/user/:ID/add-course/pre', instructorController.post_pre_add_course)


router.get('/user/:ID/add-course/:CRSID', instructorController.get_add_course)
//FAQ
router.get('/user/:ID/add-course/:CRSID/FAQ', instructorController.get_add_course_FAQ)
router.post('/user/:ID/add-course/:CRSID/FAQ', instructorController.post_add_course_FAQ)

//FAQ
router.get('/user/:ID/add-course/:CRSID/newModule', instructorController.createNewModule);
router.post('/user/:ID/add-course/:CRSID/newModule', instructorController.postNewModule);

router.get('/user/:ID/add-course/:CRSID/:Module_ID', instructorController.getSingleCourseInsideModuleView)
router.post('/user/:ID/add-course/:CRSID/search-teacher', instructorController.post_search_add_course)
router.get('/user/:ID/add-course/:CRSID/add-teacher/show-teachers', instructorController.get_add_course_add_teacher_show)
router.get('/user/:ID/add-course/:CRSID/add-teacher/:TEACHID', instructorController.get_add_course_add_teacher)


router.get('/user/:ID/add-course/:CRSID/:Module_ID/add-video', instructorController.get_add_course_add_video)
router.post('/user/:ID/add-course/:CRSID/:Module_ID/add-video', instructorController.post_add_course_add_video)

router.get('/user/:ID/add-course/:CRSID/:Module_ID/add-quiz', instructorController.get_add_course_add_quiz)
router.post('/user/:ID/add-course/:CRSID/:Module_ID/add-quiz', instructorController.post_add_course_add_quiz)

//router.post('/user/:ID/add-course/:CRSID/add-quiz', instructorController.post_add_course_add_course)














module.exports = router