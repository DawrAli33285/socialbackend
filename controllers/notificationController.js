const notificationModel=require('../models/notificationmodel')
const creatorModel=require('../creator models/creator')
module.exports.getNotifications=async(req,res)=>{
try{
    let user=req.user.alreadyexists._id;
let response=await notificationModel.find({user}).populate('user').populate('creator')
return res.status(200).json({
    notifications:response
})
}catch(e){
return res.status(400).json({
    error:'e ne peux pas exécuter la requête en raison d une erreur du serveur'
})
}
}

module.exports.createNotifications=async(req,res)=>{
    let {creator,reason}=req.body;
    console.log(creator,reason)
   console.log('backend called notification')
    try{
        let user=req.user.alreadyexists._id;
if(creator){
    let creatorData=await creatorModel.findById(creator)
    let creatorname=creatorData.toObject();
    console.log('creatorname')
    console.log(reason)
    console.log(creatorname?.name)
    let finalreason=creatorname?.name.toString()+' '+reason;
    let response=await notificationModel.create({
        user,
        creator,
      reason:finalreason
    })
  
    return res.status(200).json({
        response,
        creator:creatorData,
        userdata:req.user.alreadyexists
    })
}else{
   
    let response=await notificationModel.create({
        user,
        reason
    })
    return res.status(200).json({
        respone:response,
        userdata:req.user.alreadyexists
    })
}
    }catch(e){
        console.log(e.message)
        return res.status(400).json({
            error:'e ne peux pas exécuter la requête en raison d une erreur du serveur'
        })
    }
}


module.exports.adminNotification=async(req,res)=>{
const {reason,user}=req.body;
    try{
let response=await notificationModel.create({
user,
reason
})
return res.status(200).json({
    sucess:'true'
})
}catch(e){
    return res.status(400).json({
        error:'e ne peux pas exécuter la requête en raison d une erreur du serveur'
    })
}
}