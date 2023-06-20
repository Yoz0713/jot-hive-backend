const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const checkEnvironment =require("../utils/checkEnvironment")
const {newUser} = require("../schema/user")
const {findUserByMail} = require("../schema/user")
const users = {};

// 新增google Strategy

passport.use(
    new GoogleStrategy(
      {
        clientID:
          '1060385074500-8o9e2drnvek85lf8t7ivmjl7eibmsacm.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: checkEnvironment.server("/auth/google/callback")
      },
      (accessToken, refreshToken, profile, done) => {
        if (profile._json) {
          const data = profile._json
          //將資料存入mongoDB
          findUserByMail(data.email).then((user)=>{
            if(!user){
              newUser({
                userID:data.sub,
                name:data.name,
                username:data.email,
                avatar:data.picture,
                role:"normal",
                createdAt:new Date(),
              })
            }else{
              console.log(user)
            }
          })
          
          const id = data.sub;
          const user = {
            id: id,
            picture: data.picture
            // 可以根據需要將其他屬性也加入使用者資料
          };
          return done(null, user);
        }
        return done(null, false);
      }
    )
  )
  
  // 這邊簡單來說就是簡化存在session內的資料，session存放使用者id
  // 再用使用者id找出詳細資料
  passport.serializeUser((user, done) => {
    return done(null, user)
  })
  passport.deserializeUser((userId, done) => {
    return done(null, userId)
  })
  
  module.exports = passport