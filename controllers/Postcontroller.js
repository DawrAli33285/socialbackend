const userModel=require('../models/usermodel')
const postModel=require('../creator models/post')
const subscriptionModel=require('../models/subscriptionmodel')
module.exports.getPosts=async(req,res)=>{
    try{
        const userId = req?.user?.alreadyexists?._id;
        let user=await userModel.findOne({_id:userId});
        let userFavorites=user?.favourites;

        // Fetch subscriptions for the user
        const userSubscriptions = await subscriptionModel.find({ subscriber: userId });

        // Extract creator IDs from subscriptions
        const subscribedCreatorIds = userSubscriptions?.map(sub => sub.creator);

        // Find posts from subscribed creators
        const subscribedCreatorPosts = await postModel.find({ 
            creator: { $in: subscribedCreatorIds } 
        }).populate('creator');

        // Find posts from favorite creators, excluding subscribed creators
        const favoriteCreatorPosts = await postModel.find({ 
            creator: { $in: userFavorites, $nin: subscribedCreatorIds } 
        }).populate('creator');

        // Find posts from other creators, excluding subscribed and favorite creators
        const otherCreatorPosts = await postModel.find({ 
            creator: { $nin: [...subscribedCreatorIds, ...userFavorites] } 
        }).populate('creator');

        // Combine the posts in the desired order
        const combinedPosts = [...subscribedCreatorPosts, ...favoriteCreatorPosts, ...otherCreatorPosts];

        return res.status(200).json({
            posts: combinedPosts,
            subscriptions: userSubscriptions
        });
    }catch(e){
        console.log(e.message)
        return res.status(400).json({
        
            error:"erreur de serveur, veuillez réessayer"
        })
    }
}

module.exports.add_remove_favourite=async(req,res)=>{
    try{
let {user,postid}=req.body;
let alreadyLiked = await postModel.findOne({ _id: postid, favourites: user });
if(alreadyLiked){
let updateResult=await postModel.findByIdAndUpdate(alreadyLiked._id,{
$pull:{favourites:user}        
    },{
        new:true
    })
    return res.status(200).json({
        updatedPost:updateResult
    })
}else{
let updateResult=await postModel.findByIdAndUpdate(postid,{
    $push:{favourites:user}
},{new:true})
return res.status(200).json({
    updatedPost:updateResult
})
}
    }catch(e){
        console.log(e.message)
        return res.status(400).json({
        
            error:"erreur de serveur, veuillez réessayer"
        })
    }
}

module.exports.getSinglePost=async(req,res)=>{
let {id}=req.body;
    try{
let post=await postModel.findById(id).populate('creator')
if(post){
    let subscriptions=await subscriptionModel.find({subscriber:req.user.alreadyexists._id })
    console.log(subscriptions)
    return res.status(200).json({
        post,
        subscriptions
    })
}else{
    return res.status(400).json({
        error:"message introuvable"
    })
}
    }catch(e){
return res.status(400).json({
    error:"erreur du serveur"
})
    }
}