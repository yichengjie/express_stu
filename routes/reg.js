/**
 * Created by yicj on 2016/5/16.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    res.render('reg',{title:'зЂВс'}) ;
});

router.post('/', function(req, res) {

});


module.exports = router;
