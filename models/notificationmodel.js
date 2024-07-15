const mongoose=require('mongoose')
const notificationSchema=mongoose.Schema({
    creator:{
        type:mongoose.Schema.ObjectId,
        ref:'creator'
    },
 user:{
    type:mongoose.Schema.ObjectId,
    ref:'user'
 },
 reason:{
    type:String
 }
},{
    timestamps:true
})
const notificationmodel=mongoose.model('notifications',notificationSchema)

module.exports=notificationmodel;