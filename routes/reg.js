/**
 * Created by yicj on 2016/5/16.
 */
var express = require('express');
var router = express.Router();
var crypto = require('crypto') ;
var User = require('../models/user') ;

/* GET users listing. */
router.get('/', function(req, res) {
    res.render('reg',{title:'注册'}) ;
});

router.post('/', function(req, res) {
    var name = req.body.name ;
    var password = req.body.password ;
    var email = req.body.email ;
    var password_repeat = req.body.password_repeat ;
    if(password != password_repeat){
        req.flash('error','两次输入的密码不一致!') ;
        return res.redirect('/reg') ;
    }
    var md5 = crypto.createHash('md5') ;
    password= md5.update(req,body.password).digest('hex') ;
    var newUser = new User({
        name:name,
        password:password,
        email:email
    }) ;

    User.get(newUser.name, function (err,user) {
        if(err){
            req.flash('error',err) ;
            return res.redirect('/') ;
        }
        if(user){
            req.flash('error','用户名已存在!') ;
            return res.redirect('/reg') ;
        }
        newUser.save(function(err,user){
            if(err){
                req.flash('error',err) ;
                return res.redirect('/reg') ;
            }
            req.session.user = user ;
            req.flash('success','注册成功！') ;
            res.redirect('/') ;
        })
    });


});


module.exports = router;
