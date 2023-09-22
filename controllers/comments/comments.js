const Comment=require("../../models/comment/Comment");
const Post=require("../../models/post/Post");
const User=require("../../models/user/User");
const appErr=require("../../utils/appErr");
//create
const createCommentCtrl=async (req, res,next) => {
  const {message}=req.body;
  try {
    //find the post
    const post = await Post.findById(req.params.id);
    //create the comment
    const comment = await Comment.create({
      user: req.session.userAuth,
      message,
      post:post._id,
    });
    //push the comment to post
    post.comments.push(comment._id);
    //find the user
    const user = await User.findById(req.session.userAuth);
    //push the comment into user
    user.comments.push(comment._id);
    //disable validation
    //save
    await post.save({ validateBeforesave: false });
    await user.save({ validateBeforesave: false });
    
  } catch (error) {
    next(appErr(error));
  }
};

//single
const commentDetailCtrl=async (req, res,next) => {
  try {
    const comment=await Comment.findById(req.params.id);
    res.render("comments/updateComment",{
      comment,
      error:""
    })
  } catch (error) {
    res.render("comments/updateComment", {
      error: error.message,
    });
  }
};

//delete
const deleteCommentCtrl=async (req, res,next) => {
  try {
    //find the post
    const comment=await Comment.findById(req.params.id);
    //check if the post belongs to the user
    if(comment.user.toString()!==req.session.userAuth.toString())
    {
      return next(appErr("You are not allowed to delete this comment",403));
    }
    //delete post
    await Comment.findByIdAndDelete(req.params.id);
    res.redirect(`/api/v1/posts/${req.query.postId}`);
  } catch (error) {
    next(appErr(error))
  }
};

const updateCommentCtrl=async (req, res,next) => {
  try {
    //find the comment
    const comment = await Comment.findById(req.params.id);
    if(!comment)
    {
      return next(appErr("Comment Not Found"));
    }
    //check if the post belongs to the user
    if (comment.user.toString() !== req.session.userAuth.toString()) {
      return next(appErr("You are not allowed to update this comment", 403));
    }
    //update
    const commentUpdated=await Comment.findByIdAndUpdate(req.params.id,{
      message:req.body.message,
    },
    {
      new:true
    });
    res.redirect(`/api/v1/posts/${req.query.postId}`)
  } catch (error) {
    next(appErr(error))
  }
};

module.exports={createCommentCtrl,commentDetailCtrl,deleteCommentCtrl,updateCommentCtrl}