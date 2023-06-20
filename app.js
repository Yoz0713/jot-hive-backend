const postController = require("./controller/post")//引入post
const userController = require("./controller/user")//引入useer
const express = require("express")
const cors = require("cors")
const bodyParser = require('body-parser');
const session = require('express-session');
 require("./database")
const passport = require('passport')
const {findUserByMail} = require("./schema/user")
const checkEnvironment = require("./utils/checkEnvironment");
const bcrypt = require("bcrypt");
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
        if(user){
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
      if(!user){
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
app.post("/user/signUp",checkSignUp,userController.register)


//帳密登入
app.post("/user/login",checkLogin,userController.login)


//確認登入狀態
app.get("/loginStatus",(req,res)=>{
  console.log(req.session)
    if (req.session.user || req.isAuthenticated()) {
        res.send(req.session);
      } else {
        res.send(false);
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
