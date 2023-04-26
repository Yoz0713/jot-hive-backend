const mongoose = require("mongoose")

const db = mongoose.connect("mongodb://127.0.0.1:27017/jotHive").then(()=>{
  console.log("成功連結jotHive資料庫...")
}).catch((e)=>{
  console.log(e)
})

module.exports = db;