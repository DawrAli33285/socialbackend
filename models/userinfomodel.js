const mongoose=require('mongoose')

const userinfoSchema=mongoose.Schema({
userid:{
type:mongoose.Schema.ObjectId,
ref:'user'
},
first_name:{
    type:String
},
last_name:{
    type:String
},
gender:{
    type:String
},
date_of_birth:{
    type:Date
},
address:{
    type:String
},
city:{
    type:String
},
postal_code:{
    type:String
},
country:{
    type:String
},
phone_number:{
    type:String
}
})

const userinfomodel=mongoose.model('userinfo',userinfoSchema)

module.exports=userinfomodel