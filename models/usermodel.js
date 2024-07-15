const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    date_of_birth:{
        type:Date,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    google:{
        type:Boolean,
        default:false
    },
    facebook:{
        type:Boolean,
        default:false
    },
    favourites:[{type:mongoose.Schema.ObjectId,ref:'creator'}]
},{
    toJSON:{
        virtuals:true
    },
    toObject:{
        virtuals:true
    },
    timestamps:true
})

const usermodel=mongoose.model('user',userSchema)
module.exports=usermodel;
