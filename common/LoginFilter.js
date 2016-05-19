/**
 * Created by yicj on 2016/5/18.
 */
var loginFilter = {
    checkLogin:function(req,res,next){
        console.info('检查用户是否【登录】...') ;
        if(!req.session.user){
            req.flash('error','未登录') ;
            res.redirect('/login') ;
        }
        next() ;
    },
    checkNotLogin:function(req,res,next){
        console.info('检查用户是否【未登录】') ;
        if(req.session.user){
            req.flash('error','已登录!') ;
            res.redirect('back') ;
        }
        next() ;
    }
} ;
module.exports = loginFilter ;
