const mongoose=require('mongoose')
const subscriptionSchema=mongoose.Schema({
    subscriber:{
        type:mongoose.Schema.ObjectId,
        ref:'user'
    },
    creator:{
        type:mongoose.Schema.ObjectId,
        ref:'creator'
    },
    price:{
        type:Number
    },
    promo:{
        type:String,
        default:null
    },
    expiray:{
        type:Date,
    },
    notified:{
        type:Boolean,
        default:false
    },
    subid:{
        type:String
    },
    invoiceid:{
        type:String
    }
},{timestamps:true})
const subscriptionmodel=mongoose.model('subscription',subscriptionSchema)
module.exports=subscriptionmodel;