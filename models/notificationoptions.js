const mongoose=require('mongoose')


const notificationoptionsSchema=mongoose.Schema({
    userid:{
      type:mongoose.Schema.ObjectId,
      ref:'user'  
    },
newposts:{
type:Boolean,
default:true
},
call_slot_avaiability:{
type:Boolean,
default:true
},
news_letter:{
type:Boolean,
default:true
},
offer:{
    type:Boolean,
    default:true
}
})


const notificationoptionsmodel=mongoose.model('notificationoptions',notificationoptionsSchema)

module.exports=notificationoptionsmodel