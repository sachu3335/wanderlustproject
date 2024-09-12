const { string } = require("joi");
const listing=require("../models/listing");
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken=process.env.MAP_TOKEN;
const geocodingclient = mbxgeocoding({ accessToken: maptoken });
const url=require('url');


module.exports.index=async(req,res)=>{
    const alllistings= await listing.find({});
    res.render("./listing/index.ejs",{alllistings});
}

module.exports.rendernewform=(req,res)=>{
    res.render("./listing/new.ejs");
 }

 module.exports.rendershowform=async(req,res)=>{
    let {id}=req.params;
   const listings= await listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
   if(!listings)
   {
     req.flash("error","Listing you requested dose not exist!");
     res.redirect("/listings")
   }
   res.render("./listing/show.ejs",{listings});
}

module.exports.rendercreateform=async(req,res,next)=>{
    let response=await geocodingclient.forwardGeocode({
        query: req.body.Listing.location,
        limit: 1,
      })
        .send();

    let url=req.file.path;
    let filename=req.file.filename;
    const newlistings=new listing(req.body.Listing);
    newlistings.owner=req.user._id;
    newlistings.image={url:url,filename:filename};
    newlistings.geometry=response.body.features[0].geometry;
    let savelist=await newlistings.save();
    console.log(savelist);
    console.log("new data inserted succefully");
    req.flash("success","New Listing Created");
    res.redirect("./listings");
}

module.exports.rendereditform=async(req,res)=>{
    let {id}=req.params;
    const listdata=await listing.findById(id);
    if(!listdata)
    {
     req.flash("error","Listing you requested does not exits");
     res.redirect("/listings");
    }
    let original_image_url=listdata.image.url;
    original_image_url=original_image_url.replace("/upload","/upload/w_250");
    res.render("./listing/edit.ejs",{listdata,original_image_url});
}

module.exports.renderupdateform=async(req,res)=>{
    let {id}=req.params;
    let listings= await listing.findByIdAndUpdate(id,{...req.body.Listing});
    if(typeof req.file !== "undefined"){ 
        let url=req.file.path;
        let filename=req.file.filename;
        listings.image={url:url,filename:filename};
        await listings.save();
    }
    console.log("data updated successfully");
    req.flash("update","UPDATE data successfully");
    res.redirect(`/listings`);
}

module.exports.renderdeleteform=async(req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    console.log("Record deleted successfully");
    req.flash("delete","deleted data from listing");
    res.redirect("/listings");
}


module.exports.renderfilterform=async(req,res)=>{
   
        const parsedurl=url.parse(req.url,true);
        const nfilter=parsedurl.query.value;
        let alllistings=await listing.find({category:`${nfilter}`});
        console.log(`Filter data from listing of ${nfilter}`);
        res.render("./listing/index.ejs",{alllistings});
}