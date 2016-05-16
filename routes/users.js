var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/detail', function(req, res, next) {
  res.send('respond with a resource--detail');
});


router.get('/list', function(req, res, next) {
  res.send('respond with a resource--list');
});


module.exports = router;
