var users = require('./users') ;
var reg = require('./reg') ;
var post = require('./post') ;
var User = require('../models/user') ;
var crypto = require('crypto') ;

var LoginFilter = require('../common/LoginFilter') ;


function checkLogin(req,res,next){
  if(!req.session.user){
    req.flash('error','未登录') ;
    res.redirect('/login') ;
  }
  next() ;
}

function checkNotLogin(req,res,next){
  if(req.session.user){
    req.flash('error','已登录!') ;
    res.redirect('back') ;
  }
  next() ;
}



module.exports = function (app) {
  /* GET home page. */
  app.get('/', function(req, res) {
    res.render('index', { title: '主页',
      user:req.session.user,
      success:req.flash('success').toString(),
      error:req.flash('error').toString()
    });

  });

  app.get('/login',checkNotLogin) ;
  app.get('/login', function(req, res) {
    res.render('login',{title:'登录',
      user:req.session.user,
      success:req.flash('success').toString(),
      error:req.flash('error').toString()
    }) ;
  });

  app.get('/login',checkNotLogin) ;
  app.post('/login', function(req, res) {
    var md5 = crypto.createHash('md5') ;
    var password = md5.update(req.body.password).digest('hex') ;
    User.get(req.body.name,function(err,user){
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

  app.get('/login',checkLogin) ;
  app.get('/logout', function (req, res) {
    req.session.user = null ;
    req.flash('success','登出成功') ;
    res.redirect('/') ;
  }) ;



  //用户模块
  app.use('/users',users) ;

  app.use('/reg',reg) ;

  app.use('/post',post) ;

}

