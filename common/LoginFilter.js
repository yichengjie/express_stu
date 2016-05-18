/**
 * Created by yicj on 2016/5/18.
 */
var loginFilter = {
    checkLogin:function(req,res,next){
        if(!req.session.user){
            req.flash('error','未登录') ;
            res.redirect('/login') ;
        }
        next() ;
    },
    checkNotLogin:function(req,res,next){
        if(req.session.user){
            req.flash('error','已登录!') ;
            res.redirect('back') ;
        }
        next() ;
    }
} ;
module.exports = loginFilter ;
