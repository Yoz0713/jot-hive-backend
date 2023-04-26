const mongoose = require("mongoose");

const {Schema} = mongoose;

const userSchema=new Schema({
    username:String,
    avatar:String,
    role:String,
    createdAt:Date
})