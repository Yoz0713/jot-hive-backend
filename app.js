const postController = require("./controller/post")
const express = require("express")
const cors = require("cors")
const bodyParser = require('body-parser');
const db = require("./database");

let app = express();
app.use(cors(
    {
        "origin": "http://localhost:3000",
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "preflightContinue": false,
        "optionsSuccessStatus": 204
      }
));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));




app.get("/",(req,res)=>{
    res.send("hello")
})

app.post("/post",postController.postArticle)
app.get("/post",postController.getArticle)
app.post("/postImage",postController.postImage)
let port = 3030;
app.listen(port);
