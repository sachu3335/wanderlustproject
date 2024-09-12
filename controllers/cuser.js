const user=require("../models/user.js");

module.exports.rendersingupform=(req,res)=>{
    res.render("./users/singup.ejs");
}

module.exports.renderloginform=(req,res)=>{
    res.render("./users/login.ejs");
}

module.exports.singupform=async(req,res)=>{
    try {
        let {username,email,password}=req.body;
        const newuser=new user({email,username});
        const registeruser=await user.register(newuser,password);
        req.login(registeruser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","welcome to wanderlust");
            res.redirect("./listings");
        })
       
    } catch (e) {
        req.flash("error",e.message);
        res.redirect("./singup")
    }   
}

module.exports.loginform=async(req,res)=>{
    req.flash("success","welcome back to Wanderlust! You are login");
    let redirecturl=res.locals.redirectUrl || "/listings";
    res.redirect(redirecturl);    
}

module.exports.logoutform=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
          return next(err);
        }
        req.flash("success","you are logout now");
        res.redirect("/listings");
    })
}