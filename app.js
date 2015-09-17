var express = require('express');             //an instance of the express server
var path = require('path');                   //..path manipulation
var favicon = require('serve-favicon');       //..favourite icon midware
var logger = require('morgan');               //..HTTP request logger
var cookieParser = require('cookie-parser');  //..parse cookie and req.cookie
var bodyParser = require('body-parser');      //..parse incoming request
var session = require('express-session');     //..session support
var MongoStore = require('connect-mongo')(session);   //..session support with mongodb
var flash = require('connect-flash');         //..special area in session for storing messages

var routes = require('./routes/index');           //loads the index file under routes
// we might put all routes in index and wrap it
// var users = require('./routes/users');
var settings = require('./settings');             //..db settings


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');                     //this line sets the template engine to ejs

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());



//session module setup
app.use(session({
  secret: settings.cookieSecret,
  //key: settings.db,                                 //cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},       //cokkie store for 30 days
  resave: false,                                    // has to be set to false usually, check session api doc
  saveUninitialized: false,                         //same as above
  url: settings.url
  //store: new MongoStore({
  //  db: settings.db,
  //  host: settings.host,
  //  port: settings.port
  //})
}));


app.use('/', routes);         // mount route file to the path /
// we minght not actually use it  user.js, commentify first
//app.use('/users', users);     // ..at /users

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
