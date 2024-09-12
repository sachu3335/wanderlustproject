const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync");

const {isloggedin, isowner,validatereview, isreviewowner}=require("../middleware.js");
const reviewcontroller=require("../controllers/creview.js");

// review route 
router.post("/",isloggedin,validatereview,wrapAsync(reviewcontroller.createreview));

// review delete 
router.delete("/:reviewid",isloggedin,isreviewowner,wrapAsync(reviewcontroller.deletereview));

module.exports=router;