const mongoose=require('mongoose')

const messengerSchema=mongoose.Schema({
    creator:{
        type:mongoose.Schema.ObjectId,
        ref:'creator'
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'user'
    },
    sender:{
    type:String
    },
    message:{
        type:{
            audio:String,
            premium:Boolean,
            text:String
        },

    },
    seen:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})
const messengermodel=mongoose.model('messenger',messengerSchema)
module.exports=messengermodel