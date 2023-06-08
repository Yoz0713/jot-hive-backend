const userModel = require('../model/user');  // 引入 model

const userController ={
   register:userModel.register,
   login:userModel.login
}

module.exports=userController
