/*const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const fileupload=require('express-fileupload');
async = require('async');


const indexRouter = require('./routes/index');
const authRoutes = require('./routes/auth');
const exp = require('constants');

const mongoose = require("mongoose");
const oracleDB = require('oracledb');

const port = process.env.PORT || 3000;

var app = express();


// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home/index.ejs", { title: "Home" });
});         

app.get("/", (req, res) => {
  res.redirect("home/index.ejs");
});


//middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use(fileupload());

app.use('/', indexRouter);
app.use('/', authRoutes);

//Express-session
app.use(session({
   secret: 'secret',
   saveUninitialized: true,
   resave: true
}));
//Passport
app.use(passport.initialize());
app.use(passport.session());

//Express validator
app.use(expressValidator({
  errorFormatter: function(param,msg,value){
    var namespace = param.split('.'),
    root = namespace.shift(),
    formParam = root;

    while(namespace.length){
      formParam += '[' + namespace.shift() + ']'; 
    }
    return{
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

//connect flash
app.use(flash());

//Global vars
app.use(function(req,res,next){
  res.locals.messages = require('express-messages')(req,res);
  next();
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.log(err);
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, function () {
console.log("Express server listening on port 3000");
});


module.exports = app;*/

const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const fileupload=require('express-fileupload')

const app = express()
app.use(fileupload());

app.set('view engine', 'ejs')
app.set('views', 'views')

const indexRoutes = require('./routes/index')
const authRoutes = require('./routes/auth')
const studentRoutes = require('./routes/student');
const instructorRoutes = require('./routes/instructor');

//const fileupload=require('express-fileupload');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '/public')))




app.use(indexRoutes)
app.use(authRoutes)
app.use('/student', studentRoutes);
app.use('/instructor', instructorRoutes);

app.listen(3000)