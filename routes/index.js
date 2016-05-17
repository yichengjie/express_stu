var users = require('./users') ;
var login = require('./login') ;
var reg = require('./reg') ;
var post = require('./post') ;


module.exports = function (app) {
  /* GET home page. */
  app.get('/', function(req, res, next) {
    res.render('index', { title: '主页' });
  });

  app.get('/nswbmw', function(req, res, next) {
    res.send('hello world !') ;
  });

  //用户模块
  app.use('/users',users) ;

  app.use('/login',login) ;

  app.use('/reg',reg) ;

  app.use('/post',post) ;

}

