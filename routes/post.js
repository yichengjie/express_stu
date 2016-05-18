/**
 * Created by yicj on 2016/5/16.
 */
var express = require('express');
var router = express.Router();
var LoginFilter = require('../common/LoginFilter') ;

/* GET users listing. */
//router.get('/',LoginFilter.checkLogin) ;
router.get('/', function(req, res) {
    res.render('post',{title:'发表',
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    }) ;
});

//router.get('/',LoginFilter.checkLogin) ;
router.post('/', function(req, res) {

});

module.exports = router;