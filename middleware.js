const { findById } = require("./models/review");
const listing=require("./models/listing");
const {listingSchema,reviewSchema}=require("./schema");
const ExpressError=require("./utils/ExpressError");
const review = require("./models/review");

module.exports.isloggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("delete","you must be login to create lisitng");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl= (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isowner=async(req,res,next)=>{
    let {id}=req.params;
    let Listing=await listing.findById(id);
    if(!Listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you don't have permission and owner of lisitng");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        console.log(error);
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

module.exports.validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        console.log(error);
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

module.exports.isreviewowner=async(req,res,next)=>{
    let {id,reviewid}=req.params;
    let reviews=await review.findById(reviewid);
    if(!reviews.author._id.equals(res.locals.currUser._id))
    {
        req.flash("error","You are not author of this review so you can't delete this review");
         return res.redirect(`/listings/${id}`);
    }
    next();
}