require("dotenv").config();
const express = require("express");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const methodOverride=require("method-override");
const globalErrHandler=require("./middlewares/globalHandler");
const userRoutes = require("./routes/users/users");
const postRoutes = require("./routes/posts/posts");
const commentRoutes=require("./routes/comments/comments");
const Post=require("./models/post/Post");
const { truncatePost } = require("./utils/helpers");
require("./config/dbConnect");

const app = express();

//helpers
app.locals.truncatePost=truncatePost;
//middlewares
//--------
//configure ejs
app.set("view engine","ejs");
//serve static files
app.use(express.static(__dirname+"/public"))

//pass incoming data
app.use(express.json()); 

app.use(express.urlencoded({extended:true}));//pass form data

app.use(methodOverride("_method"));

//session config
app.use(
    session({
    secret:process.env.SESSION_KEY,
    resave:false,
    saveUninitialized:true,
    store:new MongoStore({
        mongoUrl: process.env.MONGO_URL,
        ttl:24*60*60
    }),
}))

//save the login user into locals
app.use((req,res,next)=>{
    if(req.session.userAuth)
    {
        res.locals.userAuth=req.session.userAuth;
    }
    else
    {
        res.locals.userAuth=null;
    }
    next();
})


//render home
app.get("/",async(req,res)=>{
    try{
        const posts=await Post.find().populate("user");
        res.render("index",{posts});
    }catch(error){
        res.render("index",{error: error.message})
    }
});


//-----
//users route
//-------

app.use("/api/v1/users", userRoutes);

//-------
//posts route
//--------

app.use("/api/v1/posts",postRoutes);

//-------
//comments
//-------

app.use("/api/v1/comments",commentRoutes);
//Error handler middlewares
app.use(globalErrHandler);
//listen server
const PORT = process.env.PORT || 9000;
app.listen(PORT, console.log(`Server is running on PORT ${PORT}`));
