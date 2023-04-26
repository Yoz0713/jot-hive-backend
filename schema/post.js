const mongoose = require("mongoose");
const {ObjectId}  = require('mongodb');
const { Schema } = mongoose;
const postSchema = new Schema({
  category: String,
  userID: String,
  createdAt: Date,
  data: {
    banner: String,
    title: String,
    paragraph:[{
      type: {type: String},
      text: {type: String}
    }],
  },
});
const Post = mongoose.model("Post", postSchema);

const newPost = ({ category, userID, data }) => {


  const post = new Post({
    category: category,
    userID: userID,
    createdAt: new Date(),
    data: {
      banner: data.banner,
      title: data.title,
      paragraph: data.paragraph,
    },
  });

  return post.save().then((data)=>{
    console.log("成功儲存資料到post collections")
    console.log("資料為:"+data)
  }).catch((e)=>{
    console.log(e)
  });
};

async function getPost(_id) {
    try {
      const result = await Post.findOne({ _id: new ObjectId(_id)});
      console.log(result);
    } catch (err) {
      console.error(err);
    }
  }
module.exports = {
    newPost,
    getPost
};



