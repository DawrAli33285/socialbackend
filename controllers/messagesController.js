const creatorModel=require('../creator models/creator')
const messengerModel=require('../models/messengermodel')
const subscriptionModel=require('../models/subscriptionmodel')
module.exports.getCreators = async (req, res) => {
    try {
        let messagesRecord = await messengerModel.find({}).populate('creator');
        let subscriptionsFound = await subscriptionModel.find({ subscriber: req.user.alreadyexists._id }).populate('creator');

        // Use a map to keep track of unique items based on creator._id
        let uniqueItems = new Map();

        // First, add all messages to the map
        messagesRecord.forEach(item => {
            const creatorId = item.creator._id.toString();
            uniqueItems.set(creatorId, item);
        });

        // Then, process subscriptions, which will overwrite any existing messages with the same creator
        subscriptionsFound.forEach(item => {
            const creatorId = item.creator._id.toString();
            uniqueItems.set(creatorId, item);
        });

        // Convert the map values to an array
        let uniqueCreatorsAndMessages = Array.from(uniqueItems.values());

        res.status(200).json({
            creators: uniqueCreatorsAndMessages
        });
    } catch (e) {
        console.log(e.message);
        res.status(400).json({
            error: "Je ne peux pas obtenir de créateurs en raison d'un problème de serveur"
        });
    }
};

module.exports.sendMessage=async(req,res)=>{

    const {creator,text}=req.body;
    try{
let response=await messengerModel.create({
    user:req.user.alreadyexists._id.toString(),
    creator:creator,
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

module.exports.getMessages=async(req,res)=>{
const creator=req.params.creator;
console.log(creator)
console.log("getmessages")
const user=req.user.alreadyexists._id
    try{
let response=await messengerModel.find({}).populate('creator').populate('user')
let messages=response.filter(u=>u.creator._id.toString()==creator && u.user._id.toString()==user)
if(messages){
    
    return res.status(200).json({
        messages:response
    })
}
}catch(e){
    console.log(e.message)
    res.status(400).json({
        error:"Je ne peux pas exécuter la requête en raison d'une erreur du serveur"
    })
}
}


module.exports.seenMessage = async (req, res) => {
    try {
        let { user } = req.body;
        console.log(user);
        console.log(req.body)

        // Update all messages where 'creator' is 'user' and 'user' is 'req.user.alreadyexists._id'
        const result = await messengerModel.updateMany(
            { creator: user, user: req.user.alreadyexists._id },
            { $set: { seen: true } }
        );

        // You can use 'result' to check how many documents were updated, etc.
        console.log(result);

        res.status(200).json({
            message: "success",
            updatedCount: result.nModified // This shows how many documents were modified
        });
    } catch (e) {
        res.status(400).json({
            error: "Je ne peux pas exécuter la requête en raison d'une erreur du serveur"
        });
    }
};
