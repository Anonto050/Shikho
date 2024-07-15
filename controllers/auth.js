const bcrypt = require('bcryptjs');

const nodemailer = require('nodemailer')
const fileupload = require('express-fileupload')
const multer = require('multer')
const upload = multer({ dest: 'upload/' })

const sendGridTransport = require('nodemailer-sendgrid-transport');
const userModels = require('../models/user');



const transporter = nodemailer.createTransport(
    sendGridTransport({
        auth: {
            api_key: ''
        }
    })
);

exports.getSignOut = (req, res, next) => {
    res.redirect('/')
}

exports.getSignIn = (req, res, next) => {
    res.render('home/signin', {
        pageTitle: 'Log In',
        path: '/home',
        error: 'false',
        isStudent: 'false',
        logged_in: 'false',
        errorMessage: '',

    })
}

exports.postSignIn = async(req, res, next) => {
    const email = req.body.email;
    const pass = req.body.pass;

    const user_repo = await userModels.getEmailID(email);
    console.log(user_repo[0]);
    const pass_check = await userModels.getPasswordFromEmailID(email);
    console.log(pass_check==pass);

    if (user_repo[0].length !== 0 && pass_check==pass) {

        if (user_repo[0].length > 0) {

            const student_repo = await userModels.isStudent(email);
            if (student_repo.length>0) {
                const student = student_repo[0];
                console.log(student);

                const url = '/student/user/' + student[0] + '/';
                return res.redirect(url);
            }

            const teacher_repo = await userModels.isTeacher(email);
            console.log(teacher_repo);
            if (teacher_repo.length>0) {
                const teacher = teacher_repo[0];
                console.log(teacher);

                const url = '/instructor/user/' + teacher[0] + '/';
                return res.redirect(url);
            }

        }


    }

    msg = 'Please try again';
    res.render('home/signin', {
        pageTitle: 'Log In',
        path: '/login',
        error: true,
        isStudent: 'false',
        logged_in: 'false',
        eror: 'true',
        errorMessage: msg
    })
}





exports.getSignUp = (req, res, next) => {
    res.render('home/signup', {
        pageTitle: 'Registration',
        path: '/home',
        error: false,
        errorMessage: null,
        isStudent: 'false',
        logged_in: 'false',
    })
}

exports.postSignUp = async(req, res, next) => {


    const name = req.body.name;
    console.log(name);
    const email = req.body.email;
    const pass = req.body.pass;
    console.log(pass);
    const re_pass = req.body.re_pass;

    const Class = req.body.class;
    console.log(Class);

    //  const img = req.body.uploaded_image;
    const type = req.body.type;
    console.log(type);
    var student = false;
    var teacher = false;
    if(type==='student')
        student = true;
    else
        teacher = false;
    console.log(student);
    console.log(teacher);
    const agree = req.body.agree;
    console.log(email);
    console.log(req.files);

    if (req.files) console.log("some file was uploaded ");
    else console.log("no file found");

    var file = req.files.uploaded_image;
    var img_name = file.name;
    console.log(img_name);
    file.mv('public/img/' + file.name);


    const _student = Boolean(student);
    console.log(student);
    console.log(_student);
    var userType;
    if(_student)
        userType = 'true'
    else
        userType = 'false'
    const _teacher = Boolean(teacher);
    console.log(teacher);
    console.log(_teacher);
    const _agree = Boolean(agree);
    console.log(agree);
    console.log(_agree);



    /*if (!_agree || !(_agree && (_student ^ _teacher))) {
        return res.render('home/signup', {
            pageTitle: 'Registration',
            path: '/home',
            error: true,
            errorMessage: 'Check again carefully..',
            isStudent: 'false',
            logged_in: 'false',
        })
    }*/

    if (pass !== re_pass) {
        return res.render('home/signup', {
            pageTitle: 'Registration',
            path: '/home',
            error: true,
            errorMessage: 'Check password again carefully..',
            isStudent: 'false',
            logged_in: 'false',
        })
    }

    const user_repo = await userModels.findByEmail(email);
    console.log(user_repo[0])
    console.log("finished searching for email id in database");


    if (user_repo[0]!= undefined && user_repo[0].length > 0) {

        return res.render('home/signup', {
            pageTitle: 'Registration',
            path: '/home',
            error: true,
            errorMessage: 'This Email exists already..',
            isStudent: 'false',
            logged_in: 'false',
        })

    }
    console.log("looking for a new user id")
    const id_repo = await userModels.getMaxUserID();
    console.log('here : ');
    console.log(id_repo[0]);

    let id;
    if (id_repo[0].length>0) {
        id = id_repo[0][0] + 1;
        console.log('id ; ', id);
    } else {
        return res.render('home/signup', {
            pageTitle: 'Registration',
            path: '/home',
            error: true,
            errorMessage: 'Something went wrong..pls try again..',
            isStudent: 'false',
            logged_in: 'false',
        })
    }

    const know = await userModels.addUser(id, name, email, pass, img_name,userType);
    console.log(know);
    console.log(Class);

    if(userType==='true'){
        const add = await userModels.addUserToStudent(id,Class);
    }
    else{
        const add = await userModels.addUserToInstructor(id,Class);
    }


        let url = '';
        if (_student) url = url + '/student';
        else url = url + '/instructor';

        url = url + '/user/' + id + '/';

        return res.redirect(url);




}
