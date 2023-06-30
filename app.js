const postController = require("./controller/post")//引入post
const userController = require("./controller/user")//引入useer
const express = require("express")
const cors = require("cors")
const bodyParser = require('body-parser');
const session = require('express-session');
 require("./database")
const passport = require('passport')
const {findUserByMail,updateUserByMail} = require("./schema/user")
const checkEnvironment = require("./utils/checkEnvironment");
const bcrypt = require("bcrypt");
const sendMail = require("./mailer");
const { resolve } = require("path");
let app = express();
app.use(
  session({
    secret: 'yoz0713', // 應該換成您自己的密鑰
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000 // 設定 session 的有效時間，這裡為 1 小時（以毫秒為單位）
    }
  })
);
  //passport
  app.use(passport.initialize())
  app.use(passport.session())
  require('./passport')
  

//cors跨源
app.use(cors({credentials:true,origin:true}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));


  //確認email格式以及是否註冊過
  function checkSignUp(req,res,next){
    const emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if(emailReg.test(req.body.username) == false){
      res.status(400).send({ error: `e-mail格式錯誤` });
    }else{
      findUserByMail(req.body.username).then((user)=>{
        if(user && user.verify.status){
          res.status(400).send({ error: `信箱已被使用` });
        }else{
          next()
        }
      })
    }
  }


  //驗證登入帳密的middleware
  function checkLogin(req,res,next){
    findUserByMail(req.body.username).then((user)=>{
      if(!user || !user.verify.status){
        res.status(400).send({ error: `尚未註冊JotHive會員` });
      }else{
       const hashedPassword = user.password;
       const plainPassword = req.body.password;
       bcrypt.compare(plainPassword, hashedPassword, (err, isMatch) => {
        if (err) {
          // 处理错误
          console.error(err);
          return;
        }
        if (isMatch) {
          next()
        } else {
          // 密码不匹配，验证失败
          res.status(400).send({ error: `密碼錯誤` });
        }
      });
     
      }
    })
 
  }

  app.get("/",(req,res)=>{
    res.send("hello")
})





//註冊使用者
app.post("/user/signUp",checkSignUp,(req,res)=>{
  const {username} = req.body;
  const randomCode = String(Math.floor(Math.random()*1000000)).padEnd(6,Math.floor(Math.random()*10))
  
  sendMail({
    from:  'jothive2023@gmail.com',
    to: username,
    subject: '歡迎加入jotHive，請輸入以下驗證碼',
    text: 'This is the plain text body of t`he email',
    html: `<h3>您的驗證碼:${randomCode}</h3>`,
  }).then((data)=>{
    if(data == username){
      userController.register(req,res,randomCode)
    }else{
      res.send({error:"無效信箱!"})
    }
  })

})
app.post("/user/register",(req,res)=>{
  const verifyCodeFromUser = req.body.verifyCode;
  findUserByMail(req.body.username).then((user)=>{
    if(verifyCodeFromUser === user.verify.verifyCode){
      res.send({success:"註冊成功"})
      const updateVerifyStatus = {
        verify:
        {
          status:true,
          verfifyCode:null
        }
      }
      
      updateUserByMail(req.body.username,updateVerifyStatus)
      
    }else{
      console.log("驗證碼錯誤")
      res.send({error:"驗證碼錯誤"})
    }
  })
  
})

//帳密登入
app.post("/user/login",checkLogin,userController.login)


//確認登入狀態
app.get("/loginStatus",(req,res)=>{
    if (req.session.userID || req.isAuthenticated()) {
        res.send({status:true});
      } else {
        res.send({status:false});
      }
})







//google登入
app.get('/auth/google', passport.authenticate('google', { scope: ['profile',"email"] }))
app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: checkEnvironment.client(),
    failureRedirect: '/login'
  })
)









//post文章
app.post("/post",postController.postArticle)
app.get("/post", postController.getArticle);
app.post("/postImage",postController.postImage)
let port = process.env.PORT || 3030;
app.listen(port,()=>{
    console.log("連結"+port)
});
