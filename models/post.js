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
        post:this.post,
        comments:[]
    } ;
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


Post.getAll = function(name,callback){
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
};

Post.getOne = function (name,day,title,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err) ;
        }

        db.collection('posts', function (err,collection) {
            if(err){
                mongodb.close() ;
                return callback(err) ;
            }
            collection.findOne({
                "name":name,
                "time.day":day,
                "title":title,
            }, function (err,doc) {
                mongodb.close() ;
                if(err){
                    return callback(err) ;
                }
                if(doc){
                    doc.post = markdown.toHTML(doc.post) ;
                    doc.comments.forEach(function(comment){
                        comment.content = markdown.toHTML(comment.content) ;
                    }) ;
                }

                callback(null,doc) ;
            }) ;


        }) ;

    }) ;
    
} ;


Post.edit  = function (name,day,title,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err) ;
        }
        db.collection('posts', function (err,collection) {
            if(err){
                mongodb.close() ;
                return callback(err) ;
            }
            collection.findOne({
                "name":name,
                "time.day":day,
                "title":title
            }, function (err, doc) {
                mongodb.close() ;
                if(err){
                    return callback(err) ;
                }
                callback(null,doc) ;
            }) ;


        }) ;

    }) ;
} ;



Post.update = function (name,day,title,post,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err) ;
        }
        db.collection('posts', function (err,collection) {
            if(err){
                mongodb.close() ;
                return callback(err) ;
            }

            collection.update({
                "name":name,
                "time.day":day,
                "title":title
            },{$set:{post:post}}, function (err) {
                mongodb.close() ;
                if(err){
                    return callback(err) ;
                }
                callback(null) ;
            }) ;
        })


    }) ;
} ;


//删除
Post.remove = function (name,day,title,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err) ;
        }
        db.collection('posts', function (err,collection) {
            if(err){
                mongodb.close() ;
                callback(err) ;
            }
            collection.remove({
                "name":name,
                "time.day":day,
                "title":title
            },{w:1}, function (err) {
                mongodb.close() ;
                if(err){
                    return callback(err) ;
                }
                callback(null) ;
            }) ;
        }) ;

    }) ;
} ;


Post.getTen = function (name,page,callback) {
    
    mongodb.open(function (err, db) {
        if(err){
            return callback(err) ;
        }
        db.collection('posts', function (err,collection) {
            if(err){
                mongodb.close() ;
                return callback(err) ;
            }

            var query = {} ;
            if(name){
                query.name = name ;
            }
            collection.count(query, function (err,total) {
                collection.find(query,{
                    skip:(page-1)*10,
                    limit:10
                }).sort({
                    time:-1
                }).toArray(function (err,docs) {
                    mongodb.close() ;
                    if(err){
                        return callback(err) ;
                    }
                    docs.forEach(function (doc) {
                        doc.post = markdown.toHTML(doc.post) ;
                    }) ;
                    callback(null,docs,total) ;
                }) ;
            }) ;
        }) ;

    }) ;
};
