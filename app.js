var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var register = require('./routes/register');
var playlists = require('./routes/playlists');
var tracks = require('./routes/tracks');


var session = require('express-session');
var mysql = require('mysql');

var app = express();

// setup express-sessions
var expressionSessionOptions = {
  secret: 'mySecret',
  resave: false,
  saveUninitialized: false
};

app.use(session(expressionSessionOptions));


// setup mysql pool
var localConnection = {
   connectionLimit : 3,
   host : 'localhost',
   user : 'root',
   password : 'root',
   database : 'audioCollection',
   charset : 'utf8',
   port : 3306,
   socketPath : '/Applications/MAMP/tmp/mysql/mysql.sock'
 };

var pool = mysql.createPool(localConnection);

app.set('dbPool', pool);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



var access = function(req, res, next) {
  if((!req.session.username)) {
    res.redirect('/');
  }
  else {
    next();
  }
};

app.use('/register', register);
app.use('/playlists', access);
app.use('/playlists', playlists);
app.use('/tracks', access);
app.use('/tracks', tracks);
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
