const jwt=require('jsonwebtoken')

module.exports.authenticated=async(req,res,next)=>{
    try{
if(req.headers.authorization.includes('Bearer')){
    let token=req.headers.authorization.split(' ')[1]
 
    if(token){
        let user=jwt.verify(token,process.env.JWT_TOKEN)
    req.user=user;
    next();
    
    }
}



}catch(e){
res.status(400).json({
    error:"Je ne peux pas autoriser l'utilisateur en raison d'une erreur de serveur"
})
    }
}