const mongoose=require("mongoose");

//schema
const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    role: {
      type: String,
      default: "Blogger",
    },
    bio: {
      type: String,
      default:
        "A Web Developer with three years of experience, specializing in HTML5, JavaScript, PHP, MySQL, database design, and front-end development.",
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

//compile the schema to form a model
const User=mongoose.model("User",userSchema);

module.exports=User;