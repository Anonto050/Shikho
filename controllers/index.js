const userModels = require('../models/user');

const infoModels = require('../models/category-course-info');

exports.getHome = async(req, res, next) => {

    const category_repo = await infoModels.getTopCategories();
    console.log(category_repo);

    const course_repo = await infoModels.getTopCourses();
    console.log(course_repo);

    const teacher_repo = await infoModels.getTopTeachers();
    console.log(teacher_repo);

    if (category_repo!=undefined && category_repo!=undefined) {
        return res.render('home/index.ejs', {
            pageTitle: 'Home',
            path: '/home',
            isStudent: 'false',
            logged_in: 'false',
            categories: category_repo,
            courses: course_repo,
            teachers: teacher_repo
        })
    }

    res.render('home/index.ejs', {
        pageTitle: 'Home',
        path: '/home',
        isStudent: 'false',
        logged_in: 'false',
        categories: [],
        courses: [],
        teachers: []
    })

}


exports.postSearch = async(req, res, next) => {

    let start = req.params.START;

    let searchReq = req.body.search_bar_req;
    console.log(searchReq);

    searchReq = searchReq.toLowerCase();

    let req_search = '%' + searchReq + '%';
    console.log(req_search)

    const search_repo = await infoModels.getCourseOfSearch(req_search);
    console.log(search_repo);

    if (search_repo!=undefined) {
        return res.render('home/course-list.ejs', {
            pageTitle: 'Courses',
            path: '/courses',
            isStudent: 'false',
            logged_in: 'false',
            req: searchReq,
            userInfo: [],
            courses: search_repo,
            fromCategory: 'false',
            fromSearch: 'true',
            start: start
        })
    }

    res.redirect('/');
}

exports.getCourses = async(req, res, next) => {

    const category_repo = await infoModels.getTopCategories();
    console.log(category_repo);

    const  course_repo = await infoModels.getTopCourses();
    console.log(course_repo);

    if (category_repo!=undefined) {
        return res.render('home/courses-view.ejs', {
            pageTitle: 'Courses',
            path: '/courses',
            isStudent: 'false',
            logged_in: 'false',
            categories: category_repo,
            courses: course_repo,
            userInfo: []
        })
    }

    const url = '/';
    res.redirect(url)

}

exports.getInstructors = async(req, res, next) => {

    const teacher_repo = await infoModels.getTopTeachers();
    console.log(teacher_repo);

    if (teacher_repo!=undefined ) {
        return res.render('home/instructor.ejs', {
            pageTitle: 'Instructors',
            path: '/instructors',
            isStudent: 'false',
            logged_in: 'false',
            teachers: teacher_repo,
            userInfo: []
        })
    }

    const url = '/';
    res.redirect(url)

}