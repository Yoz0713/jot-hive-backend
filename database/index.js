const mongoose = require("mongoose")

const dbUrl = process.env.NODE_ENV == "production" ? "mongodb+srv://charlesyou1234567:rungname1234567@cluster0.sya60dl.mongodb.net/?retryWrites=true&w=majority" : "mongodb://localhost:27017/jotHive"
const db = mongoose.connect(dbUrl).then(()=>{
  console.log("成功連結jotHive資料庫...")
}).catch((e)=>{
  console.log(e)
})

// 
module.exports = db;