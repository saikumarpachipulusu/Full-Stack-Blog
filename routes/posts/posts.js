const express=require("express");
const multer=require("multer");
const storage=require("../../config/cloudinary");
const Post=require("../../models/post/Post");
const {
  createPostCtrl,
  fetchPostsCtrl,
  fetchSinglePostCtrl,
  deletePostCtrl,
  UpdatePostCtrl,
}=require("../../controllers/posts/posts");

const postRoutes=express.Router();
const protected=require("../../middlewares/protected");

//instance of multer
const upload=multer({
  storage,
})

//forms
postRoutes.get("/get-post-form",(req,res)=>{
  res.render("posts/addPost",{error:""});
})

postRoutes.get("/get-form-update/:id",async(req,res)=>{
  try{
    const post=await Post.findById(req.params.id);
    res.render("posts/updatePost",{post,error:""})
  }
  catch(error)
  {
     res.render("posts/updatePost",{error,post:""});
  }
})

//POST/api/v1/posts
postRoutes.post("/",protected,upload.single("file"),createPostCtrl);


//GET/api/v1/posts
postRoutes.get("/",fetchPostsCtrl );

//GET/api/v1/posts/:id
postRoutes.get("/:id",fetchSinglePostCtrl );

//Delete/api/v1/posts/:id
postRoutes.delete("/:id",protected, deletePostCtrl);

//PUT/api/v1/posts/:id
postRoutes.put("/:id",protected,upload.single("file"),UpdatePostCtrl);

module.exports=postRoutes;
