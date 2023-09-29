const express= require('express')
const app= express();
const mongoose = require('mongoose')
const passport = require("passport")
const LocalStrategy = require("passport-local")
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require('jsonwebtoken')
const session = require("express-session");
const cookieParser= require("cookie-parser")
const crypto= require('crypto')



const userRouter = require('./router/userRouter')
const slotRouter = require('./router/slotRouter')

const {User} = require('./model/User')
const {Slot} = require('./model/Slot')



const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'jwtkey';


app.use(express.json())
app.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
app.use(cookieParser())
app.use(passport.authenticate("session"));



app.use("/user",userRouter.router)
app.use("/slot",slotRouter.router)




passport.use(
    "local",
    new LocalStrategy({ usernameField: "uid" }, async function (
      uid,
      password,
      done
    ) {
      try {
        const user = await User.findOne({ uid: uid });
        if (!user) {
          return done(null, false);
        }
        crypto.pbkdf2(
          password,
          user.salt,
          310000,
          32,
          "sha256",
          async function (err, hashedPassword) {
            if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
              return done(null, false, { message: "invalid credentials" });
            }
            let token = jwt.sign({user:{name:user.name,_id:user._id,uid:user.uid}}, "jwtkey");
            done(null,token); // this calls serializer 
          }
        );
      } catch (err) {
        return done(err);
      }
    })
  );
  
  
  passport.use(
      "jwt",
      new JwtStrategy(opts, async function (jwt_payload, done) {
        console.log({ jwt_payload }); //paylod have the actual value of token {user object}
        try {
          const user = await User.findById(jwt_payload.user._id);
          if (user) {
            return done(null,{user:{uid:user.uid,_id:user._id}}); // this calls serializer
          } else {
            return done(null, false);
          }
        } catch (err) {
          console.log("inside jwt");
          return done(err, false);
        }
      })
    );
  
  
  //this sets the req.user wherre user comes from passport
  passport.serializeUser(function (user, cb) {
      console.log("ser");
    process.nextTick(function () {
      return cb(null, {
        user
      });
    });
  });
  
  //this gets back the req.user in evry request
  passport.deserializeUser(function (user, cb) {
      console.log("***dser");
    process.nextTick(function () {
      return cb(null, user);
    });
  });


mongoose.connect("mongodb://0.0.0.0:27017/be-assin")
.then(()=>console.log("db connected"))
.catch((err)=>{
    console.log("error in db connection",err);
})

app.listen(8080,(err)=>{
    if(err){
        console.log("error",err)
    }
    else{
        console.log("server started at port 8080")
    }
})

