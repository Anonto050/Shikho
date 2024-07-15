const userModels = require('../models/user');

const infoModels = require('../models/category-course-info');
const forumModels = require("../models/Discussion_Forum");


exports.getHome = async(req, res, next) => {

    const userId = req.params.ID;
    console.log(userId);

    const category_repo = await infoModels.getTopCategories();
    console.log(category_repo);

    const course_repo = await infoModels.getTopCourses();
    console.log(course_repo);

    const teacher_repo = await infoModels.getTopTeachers();
    console.log(teacher_repo);

    const user_repo = await userModels.findByID(userId);
    console.log(user_repo);

    if (category_repo[0]!==undefined && user_repo[0] !== undefined) {
        return res.render('home/index.ejs', {
            pageTitle: 'Home',
            path: '/',
            isStudent: 'true',
            logged_in: 'true',
            categories: category_repo,
            courses: course_repo,
            teachers: teacher_repo,
            userInfo: user_repo[0]
        })
    }

    res.render('home/index.ejs', {
        pageTitle: 'Home',
        path: '/',
        isStudent: 'true',
        logged_in: 'true',
        categories: [],
        courses: [],
        teachers: [],
        userInfo: user_repo[0]
    })

}
exports.getProfileView = async(req, res, next) => {
    const userId = req.params.ID;
    const user_repo = await userModels.findByID(userId);

    const coursesTaken = await userModels.coursesTaken(userId);
    console.log('coursesTaken : ', coursesTaken);


    if (user_repo !== undefined) {
        return res.render('profile.ejs', {
            pageTitle: 'Courses',
            path: '/courses',
            isStudent: 'true',
            logged_in: 'true',
            editReq: 'false',
            userInfo: user_repo[0],
            myCoursesReq: 'true',
            courses: coursesTaken

        })
    }
}


exports.PostEditProfileView = async(req, res, next) => {
    const userId = req.params.ID;
    let user_repo = await userModels.findByID(userId);
    console.log(user_repo);
    const coursesTaken = await userModels.coursesTaken(userId);

    const name = req.body.name;
    console.log("new name :", name)
    const email = req.body.email;
    console.log("new email :", email)
    const pass = req.body.pass;
    console.log("new password :", pass)
    const re_pass = req.body.re_pass;
    if (req.files) console.log("some file was uploaded ");
    else console.log("no file found");
    const file = req.files.uploaded_image;
    const img_name = file.name;
    console.log(img_name);
    await file.mv('public/img/' + file.name);

    const updateUser = await userModels.updateUser(userId, name, email, pass, img_name);
    // console.log(updateUser.data.success);
    user_repo = await userModels.findByID(userId);

    if (user_repo !== undefined) {
        return res.render('profile/profile-view.ejs', {
            pageTitle: 'Courses',
            path: '/courses',
            isStudent: 'true',
            logged_in: 'true',
            editReq: 'false',
            userInfo: user_repo.data[0],
            myCoursesReq: 'true',
            courses: coursesTaken.data,

        })
    }
}
exports.editProfileView = async(req, res, next) => {
    const userId = req.params.ID;
    const user_repo = await userModels.findByID(userId);
    console.log(user_repo);
    const coursesTaken = await userModels.coursesTaken(userId);


    if (user_repo !== undefined) {
        return res.render('profile/profile-view.ejs', {
            pageTitle: 'Courses',
            path: '/courses',
            isStudent: 'true',
            logged_in: 'true',
            editReq: 'true',
            userInfo: user_repo.data[0],
            myCoursesReq: 'false',
            courses: coursesTaken.data,

        })

    }
}

exports.getForumResponse = async(req, res, next) => {

    const userId = req.params.ID;

    const user_repo = await userModels.findByID(userId);
    console.log(user_repo);

    const question_repo = await forumModels.getForumQuestions();

    const question = req.body.question;
    console.log(question)

    const topic = req.body.topic;
    console.log(topic);

    const QID = await forumModels.getMaxQuestionID();
    console.log(QID);

    const question_ID = QID[0][0] + 1;
    console.log(question_ID);

    let date_ob = new Date();

    let date = ("0" + date_ob.getDate()).slice(-2);

    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    let year = date_ob.getFullYear();

    let hours = date_ob.getHours();

    let minutes = date_ob.getMinutes();

    let seconds = date_ob.getSeconds();

    let FinalDate = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

    const insertQuestion = await forumModels.insertForumQuestion(question_ID, topic, question, FinalDate);
    const insertAsk = await forumModels.insertIntoAsks(userId,question_ID);

    console.log(insertQuestion);

    const url = '/student/user/' + userId + '/forum';
    res.redirect(url)


}

exports.getForumRequest = async(req, res, next) => {

    const userId = req.params.ID;

    const user_repo = await userModels.findByID(userId);
    console.log(user_repo);

    const question_repo = await forumModels.getForumQuestions();
    console.log(question_repo);

    if (question_repo!==undefined) {
        return res.render('blog.ejs', {
            pageTitle: 'Discussion Forum',
            path: '/forum',
            isStudent: 'false',
            logged_in: 'true',
            questions: question_repo,
            userInfo: user_repo[0]
        })
    }

    const url = '/instructor/user/' + userId + '/';
    res.redirect(url)

}

exports.getForumDetails = async(req, res, next) => {

    const userId = req.params.ID;

    const question_ID = req.params.QID;

    const user_repo = await userModels.findByID(userId);
    console.log(user_repo);

    const question_repo = await forumModels.getQuestionByQID(question_ID);
    console.log(question_repo)

    const answer_repo = await forumModels.getAnswerByQID(question_ID);
    console.log(answer_repo)

    const question_vote_count = await forumModels.getQuestionVoteCount(question_ID);
    console.log(question_vote_count)

    const answer_vote_count = await forumModels.getAnswerVoteCount(question_ID);
    console.log(answer_vote_count)

    if (question_repo!==undefined) {
        return res.render('blog-details.ejs', {
            pageTitle: 'Discussion Forum',
            path: '/forum',
            isStudent: 'false',
            logged_in: 'true',
            questions: question_repo,
            userInfo: user_repo[0],
            answers: answer_repo,
            questionVoteCount: question_vote_count,
            answerVoteCount: answer_vote_count
        })
    }

    const url = '/student/user/' + userId + '/';
    res.redirect(url)
}

exports.getForumAnswers = async(req, res, next) => {
    const userId = req.params.ID;

    const question_ID = req.params.QID;

    const answerID = await forumModels.getMaxAnswerID();

    const answer_id = answerID[0][0] + 1;

    const answerBody = req.body.answer;
    console.log(answerBody);

    let date_ob = new Date();

    let date = ("0" + date_ob.getDate()).slice(-2);

    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    let year = date_ob.getFullYear();

    let hours = date_ob.getHours();

    let minutes = date_ob.getMinutes();

    let seconds = date_ob.getSeconds();

    let FinalDate = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds

    const insertAnswer = await forumModels.insertForumAnswer(answer_id, answerBody, question_ID, userId, FinalDate);
    const publishTable = await forumModels.insertIntoPublishes(userId,answer_id);
    console.log(insertAnswer);

    const url = '/student/user/' + userId + '/' + 'forum/' + QID;
    res.redirect(url)
}
exports.postSearch = async(req, res, next) => {

    const userId = req.params.ID;
    const user_repo = await userModels.findByID(userId);
    console.log(user_repo);

    let start = req.params.START;


    let searchReq = req.body.search_bar_req;
    console.log(searchReq);

    searchReq = searchReq.toLowerCase();

    let req_search = '%' + searchReq + '%';
    console.log(req_search)

    const search_repo = await infoModels.getCourseOfSearch(req_search);
    console.log(search_repo);

    if (search_repo !== undefined) {
        return res.render('home/course-list.ejs', {
            pageTitle: 'Courses',
            path: '/courses',
            isStudent: 'true',
            logged_in: 'true',
            req: searchReq,
            userInfo: user_repo[0],
            courses: search_repo,
            fromCategory: 'false',
            fromSearch: 'true',
            start: start
        })
    }


    let url = '/student/user/' + userId + '/';
    res.redirect(url);
}

exports.getAbout = async(req, res, next) => {

    const userId = req.params.ID;

    const user_repo = await userModels.findByID(userId);
    console.log(user_repo);

    /*const testimonial_repo = await infoModels.getTestimonials_about_learnE();
    console.log(testimonial_repo);
    if (testimonial_repo.success && user_repo.success) {
        return res.render('home/about-view.ejs', {
            pageTitle: 'About',
            path: '/about',
            isStudent: 'true',
            logged_in: 'true',
            testimonials: testimonial_repo.data,
            userInfo: user_repo.data[0]
        })
    }*/

    const url = '/student/user/' + userId + '/';
    res.redirect(url)

}

exports.getCourses = async(req, res, next) => {

    const userId = req.params.ID;

    const user_repo = await userModels.findByID(userId);
    console.log(user_repo);

    const category_repo = await infoModels.getTopCategories();
    console.log(category_repo);

    const  course_repo = await infoModels.getTopCourses();
    console.log(course_repo);

    if (category_repo !== undefined && user_repo !== undefined) {
        return res.render('home/courses-view.ejs', {
            pageTitle: 'Courses',
            path: '/courses',
            isStudent: 'true',
            logged_in: 'true',
            categories: category_repo,
            courses: course_repo,
            userInfo: user_repo[0]
        })
    }

    const url = '/student/user/' + userId + '/';
    res.redirect(url)

}

exports.get_Category_view = async(req, res, next) => {

    const userId = req.params.ID;
    const user_repo = await userModels.findByID(userId);
    console.log('here : ', user_repo);

    const reqCategory = req.params.CATEGORY;
    console.log('here : ', reqCategory);

    let start = req.params.START;
    console.log(start);

    const search_repo = await infoModels.getCourseOfCategory(reqCategory);
    console.log(search_repo);

    if (user_repo !== undefined && search_repo !== undefined) {
        return res.render('home/course-list.ejs', {
            pageTitle: 'Courses',
            path: '/courses',
            isStudent: 'true',
            logged_in: 'true',
            req: reqCategory,
            userInfo: user_repo.data[0],
            courses: search_repo.data,
            fromCategory: 'true',
            fromSearch: 'false',
            start: start
        })
    }

    const url = '/student/user/' + userId + '/';
    res.redirect(url)

}


exports.getSingleCourseInsideView = async(req, res, next) => {
    console.log("inside course view")

    const userId = req.params.ID;
    const user_repo = await userModels.findByID(userId);
    console.log('here : user_repo', user_repo);

    const courseId = req.params.CRSID;

    const course_repo = await infoModels.getCourseInfo(courseId);

    const Module_repo = await infoModels.getTopicsOfCourse(courseId);
    console.log('Module_repo ', Module_repo);

    const purchased = await infoModels.isEnrolledIn(userId, courseId);

    const courseTeacher_repo = await infoModels.findCourseTeacherByID(courseId);
    console.log('here : ', courseTeacher_repo);
    const review_repo = await infoModels.findReviewOfCourse(courseId);
    console.log("REVIEWS :", review_repo);
    const membersRepo = await infoModels.findCourseMembersByID(courseId);
    console.log(membersRepo);

    if (purchased.length === 0) {
        let completedContent = 0;
        const newPurchase = await userModels.enrollACourse(userId, courseId);
        console.log("new purchase : ", courseId, userId);
    }


    if (user_repo !== undefined && course_repo !== undefined) {
        return res.render('course/course-inside-view.ejs', {
            pageTitle: 'Course',
            path: '/insideCourse',
            isStudent: 'true',
            logged_in: 'true',
            weekView: 'false',
            videoView: 'false',
            quizView: 'false',
            gradeView: 'false',
            reviewView: 'false',
            faqView: 'false',
            reviews: review_repo,
            members: membersRepo,
            teachers:courseTeacher_repo,
            userInfo: user_repo[0],
            course: course_repo[0],
            topics: Module_repo

        })
    }
}


exports.getSingleCourseInsideModuleView = async(req, res, next) => {

    const userId = req.params.ID;
    const user_repo = await userModels.findByID(userId);


    const courseId = req.params.CRSID;
    const moduleId = req.params.Module_ID;
    console.log(courseId+" "+userId+" "+moduleId);

    const course_repo = await infoModels.getCourseInfo(courseId);

    const Module_repo = await infoModels.getTopicsOfCourse(courseId);

    const VideoContent_repo = await infoModels.getContentsOfATopic(moduleId);

    const Module = await infoModels.findTopicByTopicID(moduleId, courseId);
    console.log('this module : ', Module)


    const QuizContent_repo = await infoModels.getExamInfoFromTopic_ID(moduleId);
    console.log("  QUIZ CONTENT ", QuizContent_repo.length);


    const completed_content_repo = await infoModels.getCompletionOfAModule();
    console.log('completed contents :',completed_content_repo);

    const review_repo = await infoModels.findReviewOfCourse(courseId);
    console.log("REVIEWS :", review_repo);


    const membersRepo = await infoModels.findCourseMembersByID(courseId);
    console.log(membersRepo);


    const teachers_repo = await infoModels.findCourseTeacherByID(courseId);
    console.log(teachers_repo);


    if (user_repo !== undefined && course_repo !== undefined) {
        return res.render('course/course-inside-view.ejs', {
            pageTitle: 'Course',
            path: '/insideCourse',
            isStudent: 'true',
            logged_in: 'true',
            weekView: 'true',
            videoView: 'false',
            quizView: 'false',
            gradeView: 'false',
            reviewView: 'false',
            faqView: 'false',
            userInfo: user_repo[0],
            course: course_repo[0],
            topics: Module_repo,
            thisModule: Module[0],
            members: membersRepo,
            reviews: review_repo,
            teachers:teachers_repo,
            VideoContents: VideoContent_repo,
            QuizContent: QuizContent_repo[0],
            quizContentExistence: QuizContent_repo.length,
            completedContents: completed_content_repo
        })
    }
}


exports.postReview = async(req, res, next) => {
    console.log("INSIDE POST Review :");
    const userId = req.params.ID;
    const rating = req.body.rating;
    const review = req.body.review;
    const user_repo = await userModels.findByID(userId);


    const courseId = req.params.CRSID;

    const course_repo = await infoModels.getCourseInfo(courseId);

    const Module_repo = await infoModels.getTopicsOfCourse(courseId);
    //inserting the review into database, write a trigger for updating the Rating of this course
    const addReview = await infoModels.addNewReview(review, courseId, rating, userId);

    console.log('Redirecting this URL');

    const url = '/student/user/' + userId + '/course-inside-view/' + courseId ;
    res.redirect(url)
}


exports.addReview = async(req, res, next) => {
    console.log("INSIDE Review :");
    const userId = req.params.ID;
    const user_repo = await userModels.findByID(userId);


    const courseId = req.params.CRSID;

    const course_repo = await infoModels.getCourseInfo(courseId);

    const Module_repo = await infoModels.getTopicsOfCourse(courseId);
    let reviewedBefore;
    const HasReviewedBefore = await userModels.getReviewsByStudent(courseId, userId);
    if (HasReviewedBefore.data.length === 0) {
        reviewedBefore = false;
        console.log("HASN'T REVIEWED BEFORE")
    } else {
        reviewedBefore = true;
        console.log(HasReviewedBefore);
    }

    if (user_repo !== undefined && course_repo !== undefined) {
        return res.render('course/course-inside-view.ejs', {
            pageTitle: 'Course',
            path: '/insideCourse',
            isStudent: 'true',
            logged_in: 'true',
            weekView: 'false',
            videoView: 'false',
            faqView: 'false',
            reviewExistence: reviewedBefore,
            ownReview: HasReviewedBefore.data[0],
            reviewView: 'true',
            quizView: 'false',
            gradeView: 'false',
            userInfo: user_repo.data[0],
            course: course_repo.data[0],
            modules: Module_repo.data,
        })
    }
}


exports.getSingleCourseVideoContentView = async(req, res, next) => {

    const userId = req.params.ID;
    const user_repo = await userModels.findByID(userId);
    console.log('here : ', user_repo);

    const courseId = req.params.CRSID;
    const moduleId = req.params.Module_ID;
    const VideoContent_ID = req.params.VideoContent_ID;


    const course_repo = await infoModels.getCourseInfo(courseId);

    const Module_repo = await infoModels.getTopicsOfCourse(courseId);
    console.log('here : ', Module_repo);

    const content_repo = await infoModels.getContentsOfATopic(moduleId);
    const Module = await infoModels.findTopicByTopicID(moduleId, courseId);
    console.log('Module Founded : ', Module_repo);

    const video_content = await infoModels.getVideoFromContent_ID(VideoContent_ID);
    console.log('video content : ', video_content);

    const review_repo = await infoModels.findReviewOfCourse(courseId);
    console.log("REVIEWS :", review_repo);


    const membersRepo = await infoModels.findCourseMembersByID(courseId);
    console.log(membersRepo);

    const teachers_repo = await infoModels.findCourseTeacherByID(courseId);
    console.log(teachers_repo);

    if (user_repo !== undefined && course_repo !== undefined) {
        return res.render('course/course-inside-view.ejs', {
            pageTitle: 'Course',
            path: '/insideCourse',
            isStudent: 'true',
            logged_in: 'true',
            weekView: 'false',
            videoView: 'true',
            quizView: 'false',
            gradeView: 'false',
            faqView: 'false',
            reviewView: 'false',
            reviews: review_repo,
            members: membersRepo,
            teachers: teachers_repo,
            userInfo: user_repo[0],
            course: course_repo[0],
            topics: Module_repo,
            thisModule: Module[0],
            contents: content_repo,
            video_content: video_content[0]

        })
    }
}


exports.getSingleCourseQuizContentView = async(req, res, next) => {
    console.log("get single course quiz content view ");
    const userId = req.params.ID;
    const user_repo = await userModels.findByID(userId);


    const courseId = req.params.CRSID;
    const moduleId = req.params.Module_ID;
    const serial = req.params.SERIAL;
    console.log(serial);

    const course_repo = await infoModels.getCourseInfo(courseId);

    const Module_repo = await infoModels.getTopicsOfCourse(courseId);


    const content_repo = await infoModels.getContentsOfATopic(moduleId);
    const Module = await infoModels.findTopicByTopicID(moduleId, courseId);


    const QuizContent_repo = await infoModels.getExamInfoFromTopic_ID(moduleId);
    console.log(QuizContent_repo);
    console.log(QuizContent_repo[serial-1]);

    const review_repo = await infoModels.findReviewOfCourse(courseId);
    console.log("REVIEWS :", review_repo);


    const membersRepo = await infoModels.findCourseMembersByID(courseId);
    console.log(membersRepo);

    const teachers_repo = await infoModels.findCourseTeacherByID(courseId);
    console.log(teachers_repo);

    if (QuizContent_repo!=undefined) {
        //insert into grade with student ID, QUIZID, HOW MANY QUESTIONS
        const QUIZID = QuizContent_repo[0][0];
        console.log(Module[0]);
        const quizTopic = Module[0][1];
        console.log("Topic : ", quizTopic);
        const answer = 0;
       /* const insertGrade = await infoModels.addGrade(QUIZID, userId, QuizContent_repo.data.length, answer, courseId, quizTopic);*/
    }



    if (user_repo!=undefined && course_repo!=undefined) {
        return res.render('course/course-inside-view.ejs', {
            pageTitle: 'Course',
            path: '/insideCourse',
            isStudent: 'true',
            logged_in: 'true',
            weekView: 'false',
            videoView: 'false',
            quizView: 'true',
            reviewView: 'false',
            gradeView: 'false',
            faqView: 'false',
            userInfo: user_repo[0],
            course: course_repo[0],
            members: membersRepo,
            teachers:teachers_repo,
            reviews: review_repo,
            topics: Module_repo,
            thisModule: Module[0],
            contents: content_repo,
            question: QuizContent_repo[serial - 1],
            total_ques: QuizContent_repo.length,
            quiz_serial: serial,
            showAnswer: 'false',
            given_ans: 0
        })
    }
}
exports.getGrades = async(req, res, next) => {
    console.log("INSIDE GRADES");
    const userId = req.params.ID;
    const user_repo = await userModels.findByID(userId);

    const courseId = req.params.CRSID;

    const course_repo = await infoModels.getCourseInfo(courseId);

    const Module_repo = await infoModels.getTopicsOfCourse(courseId);


    const review_repo = await infoModels.findReviewOfCourse(courseId);
    console.log("REVIEWS :", review_repo);


    const membersRepo = await infoModels.findCourseMembersByID(courseId);
    console.log(membersRepo);

    const teachers_repo = await infoModels.findCourseTeacherByID(courseId);
    console.log(teachers_repo);
    /*const getGrades = await userModels.getGrades(userId, courseId);*/

    const getGrades = await userModels.getOverallGrades(userId,courseId);
    console.log(getGrades);

    let hasGrades;
    if (getGrades.length == 0) {
        hasGrades = false;
    } else hasGrades = true;

    if (user_repo!=undefined && course_repo!=undefined) {
        return res.render('course/course-inside-view.ejs', {
            pageTitle: 'Course',
            path: '/insideCourse',
            isStudent: 'true',
            logged_in: 'true',
            weekView: 'false',
            videoView: 'false',
            faqView: 'false',
            quizView: 'false',
            reviewView: 'false',
            reviews: review_repo,
            members:membersRepo,
            teachers:teachers_repo,
            topics:Module_repo,
            gradeView: 'true',
            gradeExistence: hasGrades,
            userInfo: user_repo[0],
            course: course_repo[0],
            modules: Module_repo,
            grades: getGrades

        })
    }

}
exports.postSingleCourseQuizContentView = async(req, res, next) => {

    const userId = req.params.ID;
    const user_repo = await userModels.findByID(userId);


    const courseId = req.params.CRSID;
    const moduleId = req.params.Module_ID;
    const serial = req.params.SERIAL;

    const course_repo = await infoModels.getCourseInfo(courseId);

    const Module_repo = await infoModels.getTopicsOfCourse(courseId);


    const content_repo = await infoModels.getContentsOfATopic(moduleId);
    const Module = await infoModels.findTopicByTopicID(moduleId, courseId);

    const review_repo = await infoModels.findReviewOfCourse(courseId);
    console.log("REVIEWS :", review_repo);


    const membersRepo = await infoModels.findCourseMembersByID(courseId);
    console.log(membersRepo);

    const teachers_repo = await infoModels.findCourseTeacherByID(courseId);
    console.log(teachers_repo);


    const QuizContent_repo = await infoModels.getExamInfoFromTopic_ID(moduleId);
    const quizID = QuizContent_repo[0][0];
    console.log("QUIZ ID : ", quizID);

    const Ans = QuizContent_repo[serial - 1][7];
    console.log(Ans);

    console.log(content_repo[0][0])

    const ans1 = Boolean(req.body.option1);
    const ans2 = Boolean(req.body.option2);
    const ans3 = Boolean(req.body.option3);
    const ans4 = Boolean(req.body.option4);

    let test = ('ans' + Ans) == 1 ? 'hell yah' : 'hell no';
    console.log(test);

    let given_ans = 0;
    if (ans1 == 1) given_ans = 1;
    if (ans2 == 1) given_ans = 2;
    if (ans3 == 1) given_ans = 3;
    if (ans4 == 1) given_ans = 4;

    let obtained_marks = 10;

    console.log(QuizContent_repo.length);
    if (Ans == given_ans) {
        //update correct answer
        const updateCorrectAnswer = await infoModels.insertCompletion(userId,quizID,obtained_marks,courseId);
    }
    else{
        obtained_marks = 0;
        const updateCorrectAnswer = await infoModels.insertCompletion(userId,quizID,obtained_marks,courseId);
    }


    if (user_repo!=undefined && course_repo!=undefined) {
        return res.render('course/course-inside-view.ejs', {
            pageTitle: 'Course',
            path: '/insideCourse',
            isStudent: 'true',
            logged_in: 'true',
            weekView: 'false',
            videoView: 'false',
            quizView: 'true',
            gradeView: 'false',
            faqView: 'false',
            reviewView: 'false',
            userInfo: user_repo[0],
            course: course_repo[0],
            topics: Module_repo,
            members:membersRepo,
            reviews:review_repo,
            teachers:teachers_repo,
            thisModule: Module[0],
            contents: content_repo,
            question: QuizContent_repo[serial - 1],
            total_ques: QuizContent_repo.length,
            quiz_serial: serial,
            showAnswer: 'true',
            given_ans: given_ans
        })
    }

    let url = '/student/user/' + userId + '/course-inside-view/' + courseId + '/' + moduleId + '/quiz/' + serial;
    res.redirect(url);

}

exports.getCompletion = async(req, res, next) => {
    const userId = req.params.ID;
    const courseId = req.params.CRSID;
    const moduleId = req.params.Module_ID;
    const contentId = req.params.Content_ID;
    console.log(contentId);

    const obtained_marks = 10;
    const check_insertion = await infoModels.insertCompletion( userId, contentId, obtained_marks,courseId);
    console.log('check_insertion : ', check_insertion);

    let url = '/student/user/' + userId + '/course-inside-view/' + courseId + '/' + moduleId;
    res.redirect(url);

}

exports.get_course_view = async(req, res, next) => {
    const userId = req.params.ID;
    const user_repo = await userModels.findByID(userId);
    console.log('here : ', user_repo);

    const courseId = req.params.CRSID;
    console.log('here : ', courseId);
    const course_repo = await infoModels.getCourseInfo(courseId);
    console.log('here : ', course_repo);

    const courseTeacher_repo = await infoModels.findCourseTeacherByID(courseId);
    console.log('here : ', courseTeacher_repo);

    const membersRepo = await infoModels.findCourseMembersByID(courseId);
    console.log(membersRepo);

    const topic_repo = await infoModels.getTopicsOfCourse(courseId);
    console.log(topic_repo);

    const content_repo = await infoModels.getContentsOfATopic(courseId);
    console.log(content_repo);

    const review_repo = await infoModels.findReviewOfCourse(courseId);
    console.log("REVIEWS :", review_repo);

    const TopCourse_repo = await infoModels.getTopCourses();
    console.log(TopCourse_repo);

    const enrolledTotal = await infoModels.totalEnrolledInACourse(courseId);
    console.log(enrolledTotal);


    var isPurchased;
    const purchased = await infoModels.isEnrolledIn( userId,courseId);
    if (purchased.length == 0) isPurchased = false;
    else
        isPurchased = true;

    if (user_repo!=undefined && course_repo!=undefined && content_repo!=undefined) {
        return res.render('course/course-view.ejs', {
            pageTitle: 'Course',
            path: '/course',
            isStudent: 'true',
            logged_in: 'true',
            userInfo: user_repo[0],
            course: course_repo[0],
            teachers: courseTeacher_repo,
            members:membersRepo,
            topics:topic_repo,
            reviews: review_repo,
            topCourses: TopCourse_repo,
            contents: content_repo,
            enrolled: enrolledTotal,
            purchased: isPurchased

        })
    }

}






exports.getTeachers = async(req, res, next) => {

    const userId = req.params.ID;

    const user_repo = await userModels.findByID(userId);
    console.log(user_repo);

    const teacher_repo = await infoModels.getTopTeachers();
    console.log(teacher_repo);

    if (teacher_repo!=undefined && user_repo!=undefined) {
        return res.render('home/instructor.ejs', {
            pageTitle: 'Teachers',
            path: '/teachers',
            isStudent: 'true',
            logged_in: 'true',
            teachers: teacher_repo,
            userInfo: user_repo[0]
        })
    }

    const url = '/student/user/' + userId + '/';
    res.redirect(url)

}


exports.getSingleCourseInsideView_FAQ = async(req, res, next) => {
    const userId = req.params.ID;
    const courseId = req.params.CRSID;

    const user_repo = await userModels.findByID(userId);
    const course_repo = await infoModels.getCourseInfo(courseId);
    const Module_repo = await infoModels.getTopicsOfCourse(courseId);

    const others_ansQues_repo = await infoModels.get_others_ansQues_by_courseId_studentId(courseId, userId);
    console.log('others ansQues : ', others_ansQues_repo, );
    const others_Ques_repo = await infoModels.get_others_Ques_by_courseId_studentId(courseId, userId);
    console.log('others Ques : ', others_Ques_repo);

    const mine_ansQues_repo = await infoModels.get_ansQues_by_courseId_studentId(courseId, userId);
    console.log('mine ans Ques : ', mine_ansQues_repo);
    const mine_Ques_repo = await infoModels.get_Ques_by_courseId_studentId(courseId, userId);
    console.log('mine Ques : ', mine_Ques_repo);


    if (user_repo.success && course_repo.success) {
        return res.render('course/course-inside-view.ejs', {
            pageTitle: 'Course',
            path: '/insideCourse',
            isStudent: 'true',
            logged_in: 'true',
            weekView: 'false',
            videoView: 'false',
            quizView: 'false',
            gradeView: 'false',
            faqView: 'true',
            reviewView: 'false',
            userInfo: user_repo.data[0],
            course: course_repo.data[0],
            modules: Module_repo.data,
            others_ansQues: others_ansQues_repo.data,
            others_Ques: others_Ques_repo.data,
            mine_ansQues: mine_ansQues_repo.data,
            mine_Ques: mine_Ques_repo.data,

        })
    }
}


exports.postSingleCourseInsideView_FAQ = async(req, res, next) => {
    const userId = req.params.ID;
    const courseId = req.params.CRSID;

    const question = req.body.question_inserted;
    console.log('question : ', question);

    const id_repo = await infoModels.get_last_questionId_in_faq();
    console.log('id_repo : ', id_repo);
    let id = id_repo.data[0].id + 1;
    console.log('id: ', id);
    const insert_repo = await infoModels.insert_into_FAQ(id, courseId, userId, question);
    console.log('insert_repo : ', insert_repo);

    let url = '/student/user/' + userId + '/course-inside-view/' + courseId + '/FAQ';
    res.redirect(url);

}

exports.getForum = async(req, res, next) => {

    const userId = req.params.ID;

    const user_repo = await userModels.findByID(userId);
    console.log(user_repo);

    const question_repo = await forumModels.getForumQuestions();

    if (question_repo!==undefined) {
        return res.render('blog.ejs', {
            pageTitle: 'Discussion Forum',
            path: '/forum',
            isStudent: 'true',
            logged_in: 'true',
            questions: question_repo,
            userInfo: user_repo[0]
        })
    }

    const url = '/student/user/' + userId + '/';
    res.redirect(url)

}
