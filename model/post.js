const multer = require('multer');
const {newPost,getPost} = require("../schema/post")

//使用multer處理postImage的圖片
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
const upload = multer({ storage: storage });


const postModel ={
    getArticle:async(req,res)=>{
      const data = await getPost(req.query.id)
      res.send(data)
    },
    postArticle: (req, res) => {
      console.log(req)
        const para = JSON.parse(req.body.para)
        const title = JSON.parse(req.body.title)
        const image =JSON.parse(req.body.image)
        const paras = para.blocks.map((item)=>{
          const obj = {
            type:item.type,
            text:item.data.text || item.data.code
          }
          return obj
        })
        const data ={
            category:"軟工板",
            userID:"Daniel Yu",
            createdAt:new Date(),
            data:{
              banner:image.blocks[0].data.file.url,
              title:title.blocks[0].data.text,
              paragraph:[...paras]
            }
        }
        newPost(data)
    },
    postImage: function(req, res) {
        upload.single('image')(req, res, function(err) {
            if (err) {
                // 處理錯誤
                res.status(500).json({ error: '上傳圖片失敗' });
              } else {
                const url = process.env.PORT ? "https://jot-hive-server.herokuapp.com/uploads/"+req.file.filename :  "http://localhost:3030/uploads/"+req.file.filename;
                console.log(url)
                res.status(200).json({
                    success : 1,
                    file: {
                        url : url,
                    }
                });
              }
        });
    }
}

module.exports = postModel;