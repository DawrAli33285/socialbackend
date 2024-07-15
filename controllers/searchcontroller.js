const postModel = require('../creator models/post');
const mongoose = require('mongoose');
const creatorModel=require('../creator models/creator')
const userModel=require('../models/usermodel')
const reviewModel=require('../models/reviewmodel')
const subscriptionModel=require('../models/subscriptionmodel')

module.exports.searchContentByCreator = async (req, res) => {
    const { name } = req.params;

    try {
        // Creating a case-insensitive regular expression
        const regex = new RegExp(name, 'i');

        // Perform the search using the regex in the query
        let resultsfinal = await creatorModel.find({ name: regex });

        return res.status(200).json(resultsfinal);

    } catch (e) {
        console.log(e.message); // It's helpful to log the actual error
        return res.status(500).json({
            error: "ne peut pas exécuter la requête en raison d'une erreur du serveur"
        });
    }
};






module.exports.searchContentByTag = async (req, res) => {
    const { name } = req.params;

    try {
       
        const regex = new RegExp(name, 'i');

     
        let results = await creatorModel.find({});
        let resultsfinal = results.filter(creator => 
            creator.tags.some(tag => regex.test(tag))
        );
        
     return res.status(200).json(resultsfinal);

    } catch (e) {
        return res.status(400).json({
            error: "ne peut pas exécuter la requête en raison d'une erreur du serveur"
        });
    }
};



module.exports.getCreatorPosts=async(req,res)=>{
 
    const {id}=req.params;
   
    try{
let posts=await postModel.find({}).populate('creator')
let finalposts=posts?.filter(u=>u?.creator?._id.toString()==id)
let subscriptions=await subscriptionModel.find({subscriber:req.user.alreadyexists._id,creator:id})
console.log(finalposts)

if(finalposts.length==0){
    let creator=await creatorModel.findById(id)
   
    finalposts = [
        {
            creator
        }
    ];


}


const averageRatingResult = await reviewModel.aggregate([
    { $match: { creator: new mongoose.Types.ObjectId(id) } },
    { $group: {
        _id: '$creator',
        averageRating: { $avg: '$rating' }
    }}
]);

// Debugging: Log the aggregation result

let averageRating = null;
if (averageRatingResult.length > 0) {
    averageRating = averageRatingResult[0].averageRating;
}



return res.status(200).json({
    finalposts,
    subscriptions,
    averageRating: averageRating
})
    }catch(e){
        console.log(e.message)
        return res.status(400).json({
            error: "ne peut pas exécuter la requête en raison d'une erreur du serveur"
        });
    }
}

module.exports.addCreatorToFavourites = async (req, res) => {
    const { creatorId } = req.body;
    const userId = req.user.alreadyexists._id;  
 try{
let user=await userModel.findById(userId)
let alreadyexists=user.favourites.find(u=>u==creatorId)
if(!alreadyexists){
  let add=await userModel.findByIdAndUpdate(userId,{
    $addToSet:{favourites:creatorId}
  })  
  return res.status(200).json({
    message:"success"
  })
}
 }catch(e){
    return res.status(400).json({
        error: "ne peut pas exécuter la requête en raison d'une erreur du serveur"
    });
 }
    
  };




  module.exports.initialSeachPosts = async (req, res) => {
    try {
        const userId = req.user.alreadyexists._id;

        // Fetch subscribed creators
        const subscriptions = await subscriptionModel.find({ subscriber: userId });
        const subscribedCreatorIds = subscriptions.map(sub => sub.creator.toString());

        // Fetch favorite creators
        const user = await userModel.findById(userId);
        const allFavoriteCreatorIds = user.favourites.map(fav => fav.toString());
        const favoriteCreatorIds = allFavoriteCreatorIds.filter(favId => !subscribedCreatorIds.includes(favId));

        // Fetch relevant creators in one query
        const relevantCreators = await creatorModel.find({
            '_id': { $in: [...subscribedCreatorIds, ...favoriteCreatorIds] }
        });

        // Separate subscribed and favorite creators
        const subscribedCreators = relevantCreators.filter(creator => subscribedCreatorIds.includes(creator._id.toString()));
        const favoriteCreators = relevantCreators.filter(creator => favoriteCreatorIds.includes(creator._id.toString()));

        // Fetch all other creators
        const otherCreators = await creatorModel.find({
            '_id': { $nin: [...subscribedCreatorIds, ...favoriteCreatorIds] }
        });

        // Combine all creators in prioritized order
        const allCreators = [...subscribedCreators, ...favoriteCreators, ...otherCreators];

        return res.status(200).json({
            creators: allCreators
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: "Cannot execute request due to a server error"
        });
    }
};
