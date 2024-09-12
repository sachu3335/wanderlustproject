const express=require("express");
const router=express.Router({});
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const usercontroller=require("../controllers/cuser.js");

router.route("/singup")
.get(usercontroller.rendersingupform)
.post(wrapAsync(usercontroller.singupform));

router.route("/login")
.get(usercontroller.renderloginform)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),usercontroller.loginform);

router.get("/logout",usercontroller.logoutform);

module.exports=router;

