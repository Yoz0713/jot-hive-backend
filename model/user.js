const {newUser} =require("../schema/user");
const bcrypt = require("bcrypt");
const userModel ={
    register:async(req,res)=>{
        const saltRounds = 12;
        let data = await req.body;
        let hashValue = await bcrypt.hash(data.password,saltRounds);
        data.password = hashValue
        data={
            ...data,
            avatart:"/uploads/default-avatar.svg",
            role:"normal",
        }
        newUser(data)
        res.status(200).send({ success: `成功註冊JotHive` });
    },
    login:async(req,res)=>{
        req.session.isLoggedIn = true
        console.log(req.session)
        res.status(200).send({ success: `成功登入JotHive` });
    }
} 
module.exports = userModel;