/**
 * Created by yicj on 2016/5/16.
 */
var express = require('express');
var router = express.Router();
var crypto = require('crypto') ;
var User = require('../models/user') ;
var LoginFilter = require('../common/LoginFilter') ;

/* GET users listing. */
router.get('/',LoginFilter.checkNotLogin) ;
router.get('/', function(req, res) {
    res.render('reg',{title:'注册',
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    }) ;
});
router.get('/',LoginFilter.checkNotLogin) ;
router.post('/', function(req, res) {
    var name = req.body.name ;
    var password = req.body.password ;
    var email = req.body.email ;
    var password_repeat = req.body.password_repeat ;
    console.info('用户注册') ;
    if(password != password_repeat){
        console.info('两次输入的密码不一致!') ;
        req.flash('error','两次输入的密码不一致!') ;
        return res.redirect('/reg') ;
    }

    var md5 = crypto.createHash('md5') ;
    password= md5.update(password).digest('hex') ;
    var newUser = new User({
        name:name,
        password:password,
        email:email
    }) ;

    console.info(JSON.stringify(newUser)) ;

    User.get(newUser.name, function (err,user) {
        if(err){
            req.flash('error',err) ;
            console.info(err) ;
            return res.redirect('/') ;
        }
        if(user){
            req.flash('error','用户名已存在!') ;
            console.info('用户名已存在!') ;
            return res.redirect('/reg') ;
        }
        newUser.save(function(err,user){
            if(err){
                req.flash('error',err) ;
                console.info(err) ;
                return res.redirect('/reg') ;
            }
            console.info('注册成功!') ;
            req.session.user = user ;
            req.flash('success','注册成功！') ;
            res.redirect('/') ;
        })
    });


});


module.exports = router;
