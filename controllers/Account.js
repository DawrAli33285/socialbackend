const bycrypt=require('bcrypt')
const notificationinfomodel=require('../models/notificationoptions')
const userModel=require('../models/usermodel')
const userinfo=require('../models/userinfomodel')
module.exports.changeCredentials = async (req, res) => {
    const { email, password } = req.body;

    try {
        const updateData = {};
        if (email) updateData.email = email; 

        if (password) {
            updateData.password = await bycrypt.hash(password, 10);
        }

        if (Object.keys(updateData).length > 0) {
            let response = await userModel.findByIdAndUpdate(req.user.alreadyexists._id, updateData, { new: true });
            return res.status(200).json({ response });
        } else {
            return res.status(400).json({ error: "No updates provided" });
        }
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            error: "ne peut pas exécuter la requête en raison d'une erreur du serveur"
        });
    }
};
module.exports.deleteAccount=async(req,res)=>{
    try{
let response=await userModel.findByIdAndDelete(req.user.alreadyexists._id)
return res.status(200).json({
    response
})
    }catch(error){
        return res.status(400).json({
            error:"ne peut pas exécuter la requête en raison d'une erreur du serveur"
        })
    }
}


module.exports.getuserinfo=async(req,res)=>{
    try{
let response=await userinfo.findOne({userid:req.user.alreadyexists._id})
return res.status(200).json({
    response
})
    }catch(error){
        console.log(e.message)
        return res.status(400).json({
            error:"ne peut pas exécuter la requête en raison d'une erreur du serveur"
        })
    }
}

module.exports.updateuserinfo = async (req, res) => {
    const { first_name, last_name, gender, date_of_birth, address, city, country, postal_code, phone_number } = req.body;

    try {
        const updateData = {};
        if (first_name) updateData.first_name = first_name;
        if (last_name) updateData.last_name = last_name;
        if (gender) updateData.gender = gender;
        if (date_of_birth) updateData.date_of_birth = date_of_birth;
        if (phone_number) updateData.phone_number = phone_number;
        if (city) updateData.city = city;
        if (country) updateData.country = country;
        if (address) updateData.address = address;
        if (postal_code) updateData.postal_code = postal_code;

        let response = await userinfo.updateOne(
            { userid: req.user.alreadyexists._id },
            { $set: {...updateData} }
        );

        return res.status(200).json({
            response
        });
    } catch (error) {
        console.error(error.message);
        return res.status(400).json({
            error: "ne peut pas exécuter la requête en raison d'une erreur du serveur"
        });
    }
};




module.exports.update_notification_options=async(req,res)=>{
    const {newposts,call_slot_avaiability,news_letter,offer}=req.body;

    try{
       
let notificationinfres=await notificationinfomodel.updateOne({userid:req.user.alreadyexists._id},{$set:{newposts,news_letter,call_slot_avaiability,offer}})
return res.status(200).json({
    notificationinfres
})
    }catch(error){
        return res.status(400).json({
            error: "ne peut pas exécuter la requête en raison d'une erreur du serveur"
        });
    }
}

module.exports.fetch_notification_options=async(req,res)=>{
    try{
let notificationoptionsres=await notificationinfomodel.findOne({userid:req.user.alreadyexists._id}).populate('userid')

return res.status(200).json({
    notificationoptionsres
})
    }catch(error){
        return res.status(400).json({
            error: "ne peut pas exécuter la requête en raison d'une erreur du serveur"
        });
    }
}