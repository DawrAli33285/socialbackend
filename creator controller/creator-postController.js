const postModel=require('../creator models/post')
module.exports.createpost=async(req,res)=>{
    try{
let {creator,description,audio,premium,title,audiolength}=req.body;
console.log(creator)
let resposnse=await postModel.create({
    description,
    audio,
 premium,
    creator,
 title,
 audiolength
})
console.log(resposnse)
return res.status(200).json({
    resposnse
})
    }catch(e){
        return res.status(400).json({
            error:e.message
        })
    }
}