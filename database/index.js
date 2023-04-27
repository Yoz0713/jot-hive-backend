const mongoose = require("mongoose")

const db = mongoose.connect("mongodb+srv://charlesyou1234567:rungname1234567@cluster0.sya60dl.mongodb.net/?retryWrites=true&w=majority").then(()=>{
  console.log("成功連結jotHive資料庫...")
}).catch((e)=>{
  console.log(e)
})

module.exports = db;