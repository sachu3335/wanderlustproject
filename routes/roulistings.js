const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const {isloggedin, isowner,validateListing}=require("../middleware.js");
const listingcontroller=require("../controllers/clisting.js");
const multer=require("multer");
const {storage}=require("../cloudconfig.js");
const upload=multer({storage});

router.route("/")
.get(wrapAsync(listingcontroller.index))
.post(isloggedin,upload.single("Listing[image]"),wrapAsync(listingcontroller.rendercreateform));


// new route create 
router.get("/new",isloggedin,listingcontroller.rendernewform); 

// filter route
router.route("/filter")
.get(wrapAsync(listingcontroller.renderfilterform))


router.route("/:id")
.get(wrapAsync(listingcontroller.rendershowform))
.put(isloggedin,isowner,upload.single("Listing[image]"),validateListing,wrapAsync(listingcontroller.renderupdateform))
.delete(isloggedin,isowner,wrapAsync(listingcontroller.renderdeleteform));


// edit route 
router.get("/:id/edit",isloggedin,isowner,wrapAsync(listingcontroller.rendereditform)); 
   
module.exports=router;
