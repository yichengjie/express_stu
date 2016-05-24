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
    PostModel.getAll(null, function (err,posts) {
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



  app.get('/u/:name',LoginFilter.checkLogin) ;
  app.get('/u/:name', function (req, res) {
    UserModel.get(req.params.name, function (err,user) {
      if(!user){
        req.flash('error','用户名不存在!') ;
        res.redirect('/') ;
      }
      PostModel.getAll(user.name, function (err,posts) {
        if(err){
          req.flash('error',err) ;
          return res.redirect('/') ;
        }
        res.render('user',{
          title:user.name,
          posts:posts,
          user:req.session.user,
          success:req.flash('success').toString(),
          error:req.flash('error').toString()
        }) ;
      })
    })
  }) ;

  app.get('/u/:name/:day/:title',LoginFilter.checkLogin) ;
  app.get('/u/:name/:day/:title', function (req, res) {

      PostModel.getOne(req.params.name,req.params.day,req.params.title, function (err, post) {
          if(err){
            req.flash('error',err) ;
            return res.redirect('/') ;
          }
          res.render('article',{
            title:req.params.title,
            post:post,
            user:req.session.user,
            success:req.flash('success').toString() ,
            error:req.flash('error').toString()
          }) ;

      })
  }) ;



  app.get('/edit/:name/:day/:title',LoginFilter.checkLogin) ;
  app.get('/edit/:name/:day/:title', function (req, res) {
      var currentUser = req.session.user ;
      var name = currentUser.name ;
      var day = req.params.day ;
      var title = req.params.title ;
      PostModel.edit(name,day,title, function (err, post) {
        if(err){
          req.flash('error',err) ;
          return res.redirect('back') ;
        }
        res.render('edit',{
          title:'编辑',
          post:post,
          user:currentUser,
          success:req.flash('success').toString() ,
          error:req.flash('error').toString()
        }) ;

      }) ;

  }) ;

  //更新post
  app.post('/edit/:name/:day/:title',LoginFilter.checkLogin) ;
  app.post('/edit/:name/:day/:title', function (req,res) {
      var currentUser = req.session.user ;
      var name = currentUser.name ;
      var day = req.params.day ;
      var title = req.params.title ;
      var post = req.body.post ;
      PostModel.update(name,day,title,post, function (err) {
          var url = encodeURI('/u/'+name+'/'+day+'/'+title) ;
          if(err){
             req.flash('error',err) ;
             return res.redirect(url) ;
          }
          req.flash('success','修改成功!') ;
          res.redirect(url) ;
      })
  }) ;

  //删除post
  app.get('/remove/:name/:day/:title',LoginFilter.checkLogin) ;
  app.get('/remove/:name/:day/:title',function(req,res){
      var currentUser = req.session.user ;
      var name = currentUser.name ;
      var day = req.params.day ;
      var title = req.params.title ;
      PostModel.remove(name,day,title, function (err) {
          if(err){
            req.flash('error',err) ;
            return res.redirect('back') ;
          }
          req.flash('success','删除成功!') ;
          res.redirect('/') ;
      }) ;

  }) ;



  //用户模块
  app.use('/users',usersRoute) ;

  app.use('/reg',regRoute) ;

  app.use('/post',postRoute) ;

}

