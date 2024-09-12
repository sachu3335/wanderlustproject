if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const Localstategy=require("passport-local");
const User=require("./models/user.js");

const dbURL=process.env.AtLASTDB_URL;

const store=MongoStore.create({
    mongoUrl:dbURL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600
});

store.on("error",()=>{
    console.log("Error in MONGO Session Store",err);
});

const sessionoptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expire:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000, 
        httpOnly:true,
    }
};



app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const nlisitng=require("./routes/roulistings.js");
const nreview=require("./routes/roureview.js");
const nuser=require("./routes/routeuser.js");






main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>console.log(err));

async function main(){
    await mongoose.connect(dbURL);
}


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.deletemsg=req.flash("delete");
    res.locals.updatemsg=req.flash("update");
    res.locals.errormsg=req.flash("error");
    res.locals.currUser=req.user;
    next();
})


app.use("/listings",nlisitng)
app.use("/listings/:id/reviews",nreview);
app.use("/",nuser);


// app.get("/",(req,res)=>{
//     res.send("Hi, I am root");
// });

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found !"));
});

app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong!"}=err;
    res.status(statusCode).render("error.ejs",{err});
});

app.listen("8080",()=>{
    console.log("you get response from port 8080");
});