const mongoose=require("mongoose");
const review = require("./review");
const { ref, string } = require("joi");
const Schema=mongoose.Schema;
const Review=require("./review")

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        url:String,
        filename: String,
    },
    price:Number,
    location:String,
    country:String ,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry: {
            type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
            },
            coordinates: {
            type: [Number],
            required: true
            }
    },
    category:{
        type: String,
        enum:["Trending","Rooms","Iconic cities","Mountain","Castles","Pool","Camping","Farm","Artic Pool"],
        required:true
    },
});

listingSchema.post("findOneAndDelete",async(Listing)=>{
    if(Listing)
    {
        await Review.deleteMany({_id:{$in:Listing.reviews}});
        console.log("deleted review with");
    }
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;