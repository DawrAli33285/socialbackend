const mongoose=require('mongoose')

const postSchema=mongoose.Schema({
    creator:{
        type:mongoose.Schema.ObjectId,
        ref:'creator'
    },
    title:{
type:String
    },
    description:{
        type:String,
        required:true
    },
    audio:{
        type:String,
        required:true
    },
    favourites:{
        type:[mongoose.Schema.ObjectId],
        ref:'user'
    },
    premium:{
    type:Boolean,
    required:true
    },
    audiolength:{
type:String
    },
},{
    timestamps:true,
    toJSON:{
        virtuals:true
    },
    toObject:{
        virutals:true
    }
})

const postModel=mongoose.model('post',postSchema)
module.exports=postModel;