const reviewModel=require('../models/reviewmodel')

const mongoose=require('mongoose')
module.exports.saveReview=async(req,res)=>{
const {creator,rating}=req.body;
    try{
let response=await reviewModel.create({
creator,
rating,
fan:req.user.alreadyexists._id
})
return res.status(200).json({
    response
})
    }catch(error){
        console.log(error.message)
        return res.status(400).json({
            error: "ne peut pas exécuter la requête en raison d'une erreur du serveur"
        });
    }
}