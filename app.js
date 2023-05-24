const postController = require("./controller/post")
const express = require("express")
const cors = require("cors")
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require("./database");

let app = express();
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



app.get("/",(req,res)=>{
    res.send("hello")
})
app.get("/loginChecking",(req,res)=>{
    if (req.session.loggedIn) {
        res.json({ loggedIn: true });
      } else {
        res.json({ loggedIn: false });
      }
})


app.post("/post",postController.postArticle)
app.get("/post", postController.getArticle);
app.post("/postImage",postController.postImage)
let port = process.env.PORT || 3030;
app.listen(port,()=>{
    console.log("連結"+port)
});
