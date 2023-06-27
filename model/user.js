const {newUser} =require("../schema/user");
const bcrypt = require("bcrypt");
const { findUserByMail,updateUserByMail} = require("../schema/user")
const userModel ={
    register:async(req,res,randomCode)=>{
        const saltRounds = 12;
        const {username} = req.body
        let data = await req.body;
        let hashValue = await bcrypt.hash(data.password,saltRounds);
        data.password = hashValue
        data={
            ...data,
            avatar:"/uploads/default-avatar.svg",
            role:"normal",
            verify:{
                status:false,
                verifyCode:randomCode
            }
        }
        const user  = await findUserByMail(username)
        if(user){
            updateUserByMail(username,data)
            console.log("成功修改使用者的資訊")
        }else{
            newUser(data)
            console.log("新增使用者")
        }
      
        res.status(200).send({ success: `成功註冊JotHive` });
    },
    login:async(req,res)=>{
        const {username} = req.body;
        const user  = await findUserByMail(username)
        const idObj = user._id
        req.session.userID = idObj
        res.status(200).send({ success: `成功登入JotHive` ,session:req.session});
    }
} 
module.exports = userModel;