const reportModel = require('../models/reportmodel');

const path = require('path');
const fs = require('fs');
const {cloudinaryUploadImage}=require('../middleware/cloudinary')

module.exports.reportNow = async (req, res) => {
 
    const { creator, reported_by, email, subject, type_of_report, description } = req.body;
try{
  
    const localPath=`public/images/report/${req.filename}`
    const image=await cloudinaryUploadImage(localPath) 
    console.log(image.url)
const response=await reportModel.create({
creator,
reported_by,
type_of_report,
email,
subject,
description,
attachment:image.url
})
console.log(response)
    return res.status(200).json({
        response
    })
}catch(error){
    return res.status(400).json({
        error
    })
}
     
};
