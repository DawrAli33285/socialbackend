const notificationModel=require('../models/notificationmodel')
const notificationinfo=require('../models/notificationoptions')
module.exports.createNotification=async(req,res)=>{
    const {user,reason}=req.body;
    try{
const res=await notificationModel.create({
   user,
   reason,
   creator:'6598efb70f70d4cec0ec9e8c' 
})
return res.status(200).json({
    notification:res
})
    }catch(e){
       return res.status(400).json({
            error:'e ne peux pas exécuter la requête en raison d une erreur du serveur'
        })
    }
}

module.exports.checknotificationinfo=async(req,res)=>{

    try{
let response=await notificationinfo.find({}).populate('userid')
return res.status(200).json({
    response
})
    }catch(error){
        return res.status(400).json({
            error:'e ne peux pas exécuter la requête en raison d une erreur du serveur'
        })
    }
}