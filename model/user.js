const {newUser} =require("../schema/user");
const bcrypt = require("bcrypt");
const { findUserByMail} = require("../schema/user")
const userModel ={
    register:async(req,res)=>{
        const saltRounds = 12;
        let data = await req.body;
        let hashValue = await bcrypt.hash(data.password,saltRounds);
        data.password = hashValue
        data={
            ...data,
            avatar:"/uploads/default-avatar.svg",
            role:"normal",
        }
        newUser(data)
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