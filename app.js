var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index') ;
var settings = require('./settings') ;
var flash = require('connect-flash') ;


const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


var crypto = require('crypto') ;


var app = express();

//上线配置
//app.set('env', 'production');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash()) ;

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret:settings.cookieSecret,
  key:settings.cookieSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge:1000*60*60*24*30},
  store: new MongoStore({
    url: 'mongodb://localhost/blog'
  })
}));


routes(app) ;


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


console.info('env : ' + app.get('env')) ;

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
