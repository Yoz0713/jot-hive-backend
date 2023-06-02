const mongoose = require("mongoose");

const {Schema} = mongoose;

const userSchema=new Schema({
    username:String,
    password:String,
    avatar:String,
    role:String,
    createdAt:Date
})

const User = mongoose.model("user", userSchema);

const newUser =(data)=>{
    const user = new User({
        username:data.username,
        password:data.password,
        avatar:data.avatar,
        role:data.role,
        createdAt:new Date(),
    })

    user.save().then((data)=>{
        console.log("成功儲存資料到user collections")
        console.log("資料為:"+data)
      }).catch((e)=>{
        console.log(e)
      });
      
}

const findUserByMail =async (req)=>{
  try {
    const res = await User.findOne({ username: req.body.username });
    return res;
  } catch (error) {
    console.error(error);
    // Handle the error appropriately
  }
}

module.exports={newUser,findUserByMail};