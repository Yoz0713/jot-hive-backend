const postModel = require('../model/post');  // 引入 model
const postController ={
    postArticle:postModel.postArticle,
    getArticle:postModel.getArticle,
    postImage:postModel.postImage
}

module.exports=postController
