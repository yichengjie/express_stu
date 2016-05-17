/**
 * Created by yicj on 2016/5/17.
 */
var settings = require('../settings') ;
var Db = require('mongodb').Db ;
var Connection = require('mongodb').Collection ;
var Server = require('mongodb').Server ;

modules.exports = new Db(setting.db,new Server(settings.host,settings.port),
    {safe:true}) ;


