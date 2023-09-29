const mongoose = require('mongoose')


const userSchema= new mongoose.Schema({
    uid:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:Buffer,
        required:true
    },
    name:String,
    salt:Buffer ,
})

exports.User= mongoose.model("User",userSchema);