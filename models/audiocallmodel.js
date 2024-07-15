const mongoose=require('mongoose')

const audioSchema=mongoose.Schema({
    creator:{
        type:mongoose.Schema.ObjectId,
        ref:'creator'
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'user'
    },
    date:{
        type:Date
    },
    time:{
        type:String
    },
    notified:{
        type:Number,
        default:0
    }
},{timestamps:true})
const audio=mongoose.model('audiocalls',audioSchema)
module.exports=audio