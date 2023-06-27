const mongoose = require("mongoose");

const {Schema} = mongoose;

const userSchema=new Schema({
    userID:String,
    name:String,
    username:String,
    password:String,
    avatar:String,
    role:String,
    createdAt:Date,
    verify:{
      status:Boolean,
      verifyCode:String
    }
})

const User = mongoose.model("user", userSchema);

const newUser =(data)=>{
    const user = new User({
      userID:data.userID,
      name:data.name,
        username:data.username,
        password:data.password,
        avatar:data.avatar,
        role:data.role,
        createdAt:new Date(),
        verify:{
          status:data.verify.status,
          verifyCode:data.verify.verifyCode
        }
    })

    user.save().then((data)=>{
        console.log("成功儲存資料到user collections")
        console.log("資料為:"+data)
      }).catch((e)=>{
        console.log(e)
      });
      
}

const findUserByMail =async (username)=>{
  
  try {
    const res = await User.findOne({ username: username });
   
    return res;
  } catch (error) {
    console.error(error);
    // Handle the error appropriately
  }
}

const updateUserByMail =async (username,data)=>{
  try {
    const res = await User.updateOne({ username: username }, data);
    return res;
  } catch (error) {
    console.error(error);
    // Handle the error appropriately
  }
}

const deleteUserByMail = async (username) => {
  try {
    const res = await User.deleteOne({ username: username });
    return res;
  } catch (error) {
    console.error(error);
    // 適當地處理錯誤
  }
}

module.exports={newUser,findUserByMail,updateUserByMail,deleteUserByMail};