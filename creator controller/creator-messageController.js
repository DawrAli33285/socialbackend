const userModel=require('../models/usermodel')
const creatorModel=require('../creator models/creator')
const messengerModel=require('../models/messengermodel')
module.exports.getUsers=async(req,res)=>{
    try{
  
let users=await userModel.find({})
let conversationarray=[];
let ismessengerempty=await messengerModel.find({})
res.status(200).json({
    users
})
    }catch(e){
console.log(e.message)
        res.status(400).json({
    error:"Je ne peux pas obtenir de créateurs en raison d'un problème de serveur"
})
    }
}

module.exports.creatorsendMessage=async(req,res)=>{

    const {user,text}=req.body;
    console.log(user)
    try{
let response=await messengerModel.create({
    user:user,
    creator:req.user.alreadyexists._id.toString(),
    sender:req.user.alreadyexists._id.toString(),
    message:{
        audio:'',
        premium:false,
        text
    }
})
let newresponse=await messengerModel.findById(response._id).populate('creator').populate('user')
return res.status(200).json({
    newresponse
})
    }catch(e){
        console.log(e.message)
        res.status(400).json({
            error:"Je ne peux pas exécuter la requête en raison d'une erreur du serveur"
        })
    }
}

module.exports.creatorgetMessages=async(req,res)=>{
const creator=req.user.alreadyexists._id.toString();
console.log("HI")
const user=req.params.user;
console.log(req.user.alreadyexists)
try{
let response=await messengerModel.find({}).populate('creator').populate('user')


    return res.status(200).json({
        messages:response
    })

}catch(e){
    console.log(e.message)
    res.status(400).json({
        error:"Je ne peux pas exécuter la requête en raison d'une erreur du serveur"
    })
}
}