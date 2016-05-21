/**
 * Created by yicj on 2016/5/19.
 */
var mongodb = require('./db') ;
var markdown = require('markdown').markdown ;

function Post (name,title,post){
    this.name = name ;
    this.title = title ;
    this.post = post ;
} ;

module.exports = Post ;

Post.prototype.save = function (callback) {
    var date = new Date() ;
    var year = date.getFullYear() ;
    var month = year + "-" + (date.getMonth() + 1) ;
    var day = month + "-" + date.getDate() ;
    var minute = day + " " + date.getHours() +":" +(date.getMinutes() <10 ?'0' + date.getMinutes() : date.getMinutes())
    var time = {
        date:date,
        year:year,
        month:month,
        day:day,
        minute:minute
    } ;
    //要保存的数据
    var post = {name:this.name,
        time:time,
        title:this.title,
        post:this.post} ;
    //打开数据库
    mongodb.open(function (err,db) {
        if(err){
            return callback(err) ;
        }
        //读取posts集合
        db.collection('posts', function (err,collection) {
            if(err){
                mongodb.close() ;
                return callback(err) ;
            }
            //将文档插入posts集合
            collection.insert(post,{safe:true},function (err) {
                    mongodb.close() ;
                    if(err){
                       return  callback(err) ;
                    }
                    callback(null) ;//返回err为null
                }
            ) ;
        })
    }) ;

};


Post.get = function(name,callback){
    mongodb.open(function (err,db) {
        if(err){
            return callback(err) ;
        }
        //读取posts集合
        db.collection('posts', function (err,collection) {
            if(err){
               mongodb.close() ;
               return callback(err) ;
            }
            var query = {} ;
            if(name){
                query.name = name ;
            }
            //根据query对象查询文章
            collection.find(query).sort({
                time:-1
            }).toArray(function (err,docs) {
                mongodb.close() ;
                if(err){
                    return callback(err) ;
                }
                //解析markdown为html
                docs.forEach(function (doc) {
                    doc.post = markdown.toHTML(doc.post) ;
                }) ;
                callback(err,docs) ;
            }) ;


        }) ;
    }) ;
}
