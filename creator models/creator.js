const mongoose=require('mongoose')

let creatorSchema=mongoose.Schema({
name:{
    type:String,
    required:true
},
introduction:{
type:String
},
email:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
},
tags:[{type:String}]

})

let creatormodel=mongoose.model('creator',creatorSchema)
module.exports=creatormodel;