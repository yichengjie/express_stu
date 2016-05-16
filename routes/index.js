var users = require('./users') ;


module.exports = function (app) {
  /* GET home page. */
  app.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

  app.get('/nswbmw', function(req, res, next) {
    res.send('hello world !') ;
  });

  //加载users模块的路由
  app.use('/users',users) ;
}

