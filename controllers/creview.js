const listing=require("../models/listing");
const Review=require("../models/review");
const Listing=require("../models/listing");
const review=require("../models/review");

module.exports.createreview=async(req,res)=>{
    let Listings=await listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    Listings.reviews.push(newReview);
    await newReview.save();
    await Listings.save();
    console.log("new review saved");
    req.flash("success","Successfully added review");
    res.redirect(`/listings/${Listings._id}`);
}

module.exports.deletereview=async(req,res)=>{
    let {id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await review.findByIdAndDelete(reviewid);
    console.log("Review deleted");
    req.flash("delete","Review deleted successfully");
    res.redirect(`/listings/${id}`);
}