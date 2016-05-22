var usersRoute = require('./users') ;
var regRoute = require('./reg') ;
var postRoute = require('./post') ;
var UserModel = require('../models/user') ;
var PostModel = require('../models/post') ;
var crypto = require('crypto') ;
var LoginFilter = require('../common/LoginFilter') ;
var path = require('path') ;

//文件上传中间件
var multer = require('multer') ;
//var upload = multer({ dest: './public/uploads/' }) ;
var fs =require('fs') ;


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
var upload = multer({ storage: storage }) ;

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

  app.get('/logout',LoginFilter.checkLogin) ;
  app.get('/logout', function (req, res) {
    req.session.user = null ;
    req.flash('success','登出成功') ;
    res.redirect('/') ;
  }) ;

  app.get('/upload',LoginFilter.checkLogin) ;
  app.get('/upload',function(req,res){
    res.render('upload',{
      title:'文件上传',
      user:req.session.user,
      success:req.flash('success').toString(),
      error:req.flash('error').toString()
    }) ;
  }) ;


  /**
   * app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
   */

  app.post('/upload',LoginFilter.checkLogin) ;
  app.post('/upload',upload.array('file', 5) ,function (req,res) {
    var files = req.files ;
    console.info('--------------------------') ;
    files.forEach(function (item) {
        console.info(item) ;
        var uploadedPath = item.path;
        var dstPath = path.join(item.destination,item.originalname)  ;
        console.info('dstPath : '+ dstPath) ;
        fs.rename(uploadedPath, dstPath, function(err) {
          if (err){
            console.log("重命名文件错误："+ err);
          } else {
            console.log("重命名文件成功。");
          }
        });
    }) ;
    console.info('--------------------------') ;

    req.flash('success','文件上传成功') ;
    res.redirect('/upload') ;
  }) ;



  //用户模块
  app.use('/users',usersRoute) ;

  app.use('/reg',regRoute) ;

  app.use('/post',postRoute) ;

}

