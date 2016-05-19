/**
 * Created by yicj on 2016/5/16.
 */
var express = require('express');
var router = express.Router();
var LoginFilter = require('../common/LoginFilter') ;
var Post = require('../models/post') ;

/* GET users listing. */
router.get('/',LoginFilter.checkLogin) ;
router.get('/', function(req, res) {
    res.render('post',{title:'发表',
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    }) ;
});

router.get('/',LoginFilter.checkLogin) ;
router.post('/', function(req, res) {
    var currentUser = req.session.user ;
    var titleStr = req.body.title ;
    var postStr = req.body.post ;
    var post = new Post(currentUser.name,titleStr,postStr) ;
    post.save(function (err) {
        if(err){
            req.flash('error',err) ;
            return res.redirect('/') ;
        }
        req.flash('success','发表成功') ;
        res.redirect('/') ;
    }) ;

});

module.exports = router;