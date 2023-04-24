const multer = require('multer');
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
    postArticle: (req, res) => {
        const para = JSON.parse(req.body.para)
        const title = JSON.parse(req.body.title)
        const image =JSON.parse(req.body.image)
        const data ={
            title:title.blocks[0].data.text,
            image:image.blocks[0].data.file,
            para:para.blocks[0],
        }
        console.log(data)
    },
    postImage: function(req, res) {
        upload.single('image')(req, res, function(err) {
            if (err) {
                // 處理錯誤
                res.status(500).json({ error: '上傳圖片失敗' });
              } else {
                res.status(200).json({
                    success : 1,
                    file: {
                        url : "http://localhost:3030/uploads/"+req.file.filename,
                    }
                });
              }
        });
      }
}

module.exports = postModel;