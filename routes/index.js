var usersRoute = require('./users') ;
var regRoute = require('./reg') ;
var postRoute = require('./post') ;
var UserModel = require('../models/user') ;
var PostModel = require('../models/post') ;
var crypto = require('crypto') ;
var LoginFilter = require('../common/LoginFilter') ;


module.exports = function (app) {

  /* GET home page. */
  app.get('/', function(req, res) {
    PostModel.get(null, function (err,posts) {
      if(err){
        posts = [] ;
      }
      res.render('index', { title: '主页',
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString(),
        posts:posts
      });
    }) ;
  });

  app.get('/login',LoginFilter.checkNotLogin) ;
  app.get('/login', function(req, res) {
    res.render('login',{title:'登录',
      user:req.session.user,
      success:req.flash('success').toString(),
      error:req.flash('error').toString()
    }) ;
  });

  app.get('/login',LoginFilter.checkNotLogin) ;
  app.post('/login', function(req, res) {
    var md5 = crypto.createHash('md5') ;
    var password = md5.update(req.body.password).digest('hex') ;
    UserModel.get(req.body.name,function(err,user){
      if(!user){
        req.flash('error','用户名不存在!') ;
        return res.redirect('/login') ;
      }
      if(user.password!=password){
        req.flash('error','密码错误!') ;
        return res.redirect('/login') ;
      }
      req.session.user = user ;
      req.flash('success','登录成功!') ;
      res.redirect('/') ;
    }) ;
  });

  app.get('/login',LoginFilter.checkLogin) ;
  app.get('/logout', function (req, res) {
    req.session.user = null ;
    req.flash('success','登出成功') ;
    res.redirect('/') ;
  }) ;



  //用户模块
  app.use('/users',usersRoute) ;

  app.use('/reg',regRoute) ;

  app.use('/post',postRoute) ;

}

