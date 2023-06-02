const postController = require("./controller/post")
const userController = require("./controller/user")
const express = require("express")
const cors = require("cors")
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require("./database")
const {findUserByMail} = require("./schema/user")

let app = express();
//cors跨源
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(
    session({
      secret: 'yoz0713', // 應該換成您自己的密鑰
      resave: false,
      saveUninitialized: false,
    })
  );

  //確認email格式以及是否註冊過
  function checkSignUp(req,res,next){
    const emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if(emailReg.test(req.body.username) == false){
      res.status(400).send({ error: `e-mail格式錯誤` });
    }else{
      findUserByMail(req).then((user)=>{
        if(user){
          res.status(400).send({ error: `信箱已被使用` });
        }else{
          next()
        }
      })
    }
  }


app.get("/",(req,res)=>{
    res.send("hello")
})
//註冊使用者
app.post("/user/signUp",checkSignUp,userController.register)
//確認登入狀態
app.get("/loginChecking",(req,res)=>{
    if (req.session.loggedIn) {
        res.json({ loggedIn: true });
      } else {
        res.json({ loggedIn: false });
      }
})

//post文章
app.post("/post",postController.postArticle)
app.get("/post", postController.getArticle);
app.post("/postImage",postController.postImage)
let port = process.env.PORT || 3030;
app.listen(port,()=>{
    console.log("連結"+port)
});
