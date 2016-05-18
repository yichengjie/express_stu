/**
 * Created by yicj on 2016/5/17.
 */
var settings = require('../settings') ;
var Db = require('mongodb').Db ;
var  Server = require('mongodb').Server ;
var server = new Server(settings.host, settings.port);
var db = new Db(settings.db, new Server(settings.host,settings.port));

module.exports = db;


