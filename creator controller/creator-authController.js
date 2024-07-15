const axios=require('axios')
const uuid4=require('uuid4')
const userModel=require('../models/usermodel')
const bycrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const nodemailer=require('nodemailer')
const creatormodel=require('../creator models/creator')


module.exports.creatorlogin=async(req,res)=>{
  let {email,password}=req.body;
    try{

  console.log(email)
  console.log(password)
  let alreadyexists=await creatormodel.findOne({email})
  if(!alreadyexists){
  console.log('invalid')
    return res.status(400).json({
      error:'Email invalide'
    })
  }else{
    // let passwordmatch=await bycrypt.compare(password,encryptedpassword)
  
  let token=jwt.sign({
    alreadyexists
  },process.env.JWT_TOKEN)
  let alreadayExists=alreadyexists.toObject();
  alreadayExists.token=token;
  res.status(200).json({
    user: alreadayExists
  })
  
  }
    }catch(e){
      console.log(e.message)
   return   res.status(400).json({
        error:"erreur de serveur, veuillez essayer plus tard"
      })
    }
  }
  




module.exports.register=async(req,res)=>{
    try{
const {name,email,password,tagOne,tagTwo,tagThree,introduction}=req.body;
console.log(name)
let resposnse=await creatormodel.create({
    email,
    name,
    password,
    introduction,
    tags:[tagOne,tagTwo,tagThree]
})
return res.status(200).json({
    user:resposnse
})
    }catch(e){
        return res.status(400).json({
            error:e.message
        })
    }
}