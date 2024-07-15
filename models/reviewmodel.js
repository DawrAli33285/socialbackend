const mongoose=require('mongoose');
const reviewSchema=mongoose.Schema({
    rating:{
        type:Number
    },
    creator:{
        type:mongoose.Schema.ObjectId,
        ref:'creator'
    },
    fan:{
        type:mongoose.Schema.ObjectId,
        ref:'user'
    }
})

const reviewmodel=mongoose.model('review',reviewSchema)
module.exports=reviewmodel