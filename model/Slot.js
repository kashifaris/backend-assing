const mongoose = require('mongoose')


const slotSchema= new mongoose.Schema({
    wardenId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        unique:false
    },
    date:{
        type:String,
        required:true
    },
    day:{
        type:String,
        enum:['Friday',"Thursday"],
        required:true
    },
    time:{
        type:String,
        required:true,
        default:"10:00:00"
    },
    bookedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        default:null
    }
})

exports.Slot= mongoose.model("Slot",slotSchema);