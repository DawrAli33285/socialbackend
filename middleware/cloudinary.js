const cloudinary = require('cloudinary').v2;

// Configuration 
cloudinary.config({
  cloud_name:"dbjwbveqn",
  api_key: "774241215571685",
  api_secret: "ysIyik3gF03KPDecu-lOHtBYLf8"
});


module.exports.cloudinaryUploadImage=async(filetoUpload)=>{

try{
   const data=await cloudinary.uploader.upload(filetoUpload,{
       resource_type:'auto'
   })
    return {
      url:data.secure_url
    }
}catch(e){
return e
}
}
