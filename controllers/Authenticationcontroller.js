const {OAuth2Client}=require('google-auth-library')
const notificationinfomodel=require('../models/notificationoptions')
const notificationoptions=require('../models/notificationoptions')
const axios=require('axios')
const uuid4=require('uuid4')
const userinfomodel=require('../models/userinfomodel')
const creatorModel=require('../creator models/creator')
const notificationModel=require('../models/notificationmodel')
const userModel=require('../models/usermodel')
const bycrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const moment = require('moment');
const nodemailer=require('nodemailer')
const startTimes = [
  '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30',
  '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30',
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30', '22:09', '22:30', '23:00', '23:30'
];
module.exports.Register=async(req,res)=>{
  
    try{
const {name, date_of_birth,email, password}=req.body;
console.log(password)

let alreadayExists=await userModel.findOne({email})
if(alreadayExists){
 return res.status(400).json({
  error:"l'email existe déjà"
  })
}




const token=jwt.sign({
    name,
    email,
    password,
    google:false,
    facebook:false,
    date_of_birth
},process.env.JWT_TOKEN)

let transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user: 'info@carmen.chat',
      pass: process.env.EMAIL_PASSWORD // Replace with the actual password
    }
  });
  var mailOptions = {
    from: 'info@carmen.chat',
    to: email,
    subject: 'Account verification',
    html:`
    <p>Click on this link to verify your email:</p>
    <a href="http://localhost:3000/login?token=${token}">Verify Email</a>
  `
  };
transporter.sendMail(mailOptions,function(error,info){
   
});
return res.status(200).json({
  message:"email envoyé avec succès"
})
    }catch(e){
      console.log(e.message)
return res.status(400).json({
    error:"erreur de serveur, veuillez essayer plus tard"
})
    }
}


module.exports.email_verification=async(req,res)=>{
try{

 let {token}=req.params;
 let {email,name,password,date_of_birth,facebook,google}=jwt.verify(token,process.env.JWT_TOKEN)
 let encryptedpassword=await bycrypt.hash(password,10)


let result=await userModel.create({
  email,
  username:name,
  password:encryptedpassword,
  date_of_birth,
  facebook,
  google
})
let userinfores=await userinfomodel.create({
  userid:result._id,
  date_of_birth:date_of_birth

})
await notificationinfomodel.create({
  userid:result._id,
  newposts:true,
  call_slot_avaiability:true,
  news_lette:true,
  offer:true

})
return res.status(200).json({
  result
})
}catch(e){
  console.log(e.message)
    res.status(400).json({
        error:"erreur de serveur, veuillez essayer plus tard"
    })
}
}


module.exports.googleAuth=async(req,res)=>{
 
  try{
const {email,name,date_of_birth}=req.body;
console.log(email)
let alreadayExists=await userModel.findOne({email})
if(alreadayExists){
return  res.status(400).json({
    error:"Le compte existe déjà"
  })
}
let password=uuid4();
const token=jwt.sign({
  name,
  email,
  password,
 date_of_birth: date_of_birth,

 google:true,
 facebook:false
},process.env.JWT_TOKEN)
let transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: 'info@carmen.chat',
    pass: process.env.EMAIL_PASSWORD // Replace with the actual password
  }
});
var mailOptions = {
  from: 'info@carmen.chat',
  to: email,
  subject: 'Account verification',
  html:`
  <p>Click on this link to verify your email:</p>
  <a href="http://localhost:3000/login?token=${token}">Verify Email</a>
`
};
transporter.sendMail(mailOptions,function(error,info){
if(error){
return res.status(400).json({
  error:"problème d'envoi d'e-mail, veuillez essayer plus tard"
})
} 

}
)
return res.status(200).json({
  message:'succès'
})

  }catch(e){
    console.log(e.message)
    res.status(400).json({
      error:"erreur de serveur, veuillez essayer plus tard"
    })
  }
}



module.exports.facebookAuth=async(req,res)=>{
  const { accessToken, userID } = req.body;

    // Step 1: Verify the token with Facebook
    try {
 const respone=await axios.get(`https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email,birthday&access_token=${accessToken}`)   
console.log(respone.data)
let {email,name}=respone.data;
let alreadayExists=await userModel.findOne({email})
if(alreadayExists){
  return res.status(400).json({
   error:"l'email existe déjà"
   })
 } 
 let password=uuid4();
 const token=jwt.sign({
  name,
  email,
  password,
  google:false,
  facebook:true,
  date_of_birth:'10-06-2023' 
},process.env.JWT_TOKEN)

let transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: 'info@carmen.chat',
    pass: process.env.EMAIL_PASSWORD // Replace with the actual password
  }
});
var mailOptions = {
  from: 'info@carmen.chat',
  to: email,
  subject: 'Account verification',
  html:`
  <p>Click on this link to verify your email:</p>
  <a href="http://localhost:3000/login?token=${token}">Verify Email</a>
`
};
transporter.sendMail(mailOptions,function(error,info){
 if(error){
  return res.status(400).json({
    error:"problème d'envoi d'e-mail, veuillez essayer plus tard"
  })
 }
});
return res.status(200).json({
  message:'success'
})

} catch (error) {
        console.error('Error verifying the Facebook token:', error);
     return  res.status(500).json({ error: "erreur de serveur, veuillez essayer plus tard" });
    }
  
}


module.exports.login=async(req,res)=>{
 
  try{
   
    let {email,password}=req.body;

let alreadyexists=await userModel.findOne({email})
if(!alreadyexists){

  return res.status(400).json({
    error:'Email invalide'
  })
}else{
  let encryptedpassword=alreadyexists.password;

  let passwordmatch=await bycrypt.compare(password,encryptedpassword)
  if(passwordmatch){
let token=jwt.sign({
  alreadyexists
},process.env.JWT_TOKEN)
alreadyexists.token=token
await alreadyexists.save();
const now = moment();

 // Flag to indicate if within timeframe
 let isWithinTimeframe = false;
 let creatorid="6598efb70f70d4cec0ec9e8c"
 let creatorname="ali"
 
 // Check each start time
 startTimes.forEach(async(startTime) => {
   const time = moment(startTime, 'HH:mm');
   const tenMinutesBefore = time.clone().subtract(10, 'minutes');
   const diffInMinutes = tenMinutesBefore.diff(now, 'minutes');
//  console.log('diffInMinutes')
//    console.log(diffInMinutes)
   console.log(startTime)
   if (diffInMinutes==0 || diffInMinutes=='0') {
     console.log(`It's within 10 minutes before ${startTime}`);
  await notificationModel.create({
   creator:creatorid,
   user:alreadayExists._id,
   reason:`There is 10 minutes before next call with ${creatorname}`
  })
     isWithinTimeframe = true;
   }else{
     if (!isWithinTimeframe) {
      //  console.log("It's not within 10 minutes before any start time");
      //  console.log(diffInMinutes)
     }
   }
 });

let finalresult=alreadyexists.toObject();
finalresult.token=token;
console.log('final result')
console.log(finalresult)
return res.status(200).json({
  user:finalresult
})
}else{
  console.log(e.message)
  return res.status(400).json({
    error:"Mot de passe incorrect"
  })
}
}
  }catch(e){
    console.log(e.message)
 return   res.status(400).json({
      error:"erreur de serveur, veuillez essayer plus tard"
    })
  }
}

module.exports.resetPasswordEmail=async(req,res)=>{
  try{
let {email}=req.body;
let userData=await userModel.findOne({email})
if(!userData){
  return res.status(400).json({
    error:'Compte non enregistré'
  })
}
let token=jwt.sign({
  email:userData.email,
  password:userData.password
},process.env.JWT_TOKEN)
let transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: 'info@carmen.chat',
    pass: process.env.EMAIL_PASSWORD // Replace with the actual password
  }
});
var mailOptions = {
  from: 'info@carmen.chat',
  to: email,
  subject: 'Account verification',
  html:`
  <!DOCTYPE html>
  <html>
  <head>
  <title>Password Reset</title>
  </head>
  <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color:#0C0E1C;">
  <div style="max-width: 600px; margin: 20px auto;padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #0C0E1C; color: #ffffff; padding: 20px; text-align: center;">
        
          <img src="https://res.cloudinary.com/dbjwbveqn/image/upload/v1703879452/image_15-removebg-preview_1_ucf6sl.png" alt="CARMEN" style="width: 200px; height: auto;">

      </div>
      <div style="padding: 20px; text-align: center; color: #333;background-color:#0C0E1C;;color:#fff;">
          <div style="border: 1px solid #5991C6;text-align:center;">
              <h2 style="color:#fff;font-size:clamp(0.9rem,3vw,1.2rem);">Réinitialisation de votre mot de passe</h1>
                  <p style="font-size:clamp(0.6rem,4vw,0.8rem);padding-left:10%;text-align:start;padding-right:11%;">
                      Vous venez de faire une demande de réinitialisation de votre mot de passe sur Carmen.</p>
                  <p style="font-size:clamp(0.6rem,4vw,0.8rem);text-align:start;padding-left:10%;padding-right:11%;">Cliquez sur le lien ci-dessous pour configurer un nouveau mot de passe :</p>
               
          </div>
          <a href="http://localhost:3000/reset-password?token=${token}" style="background: linear-gradient(0deg, #275ACE, #275ACE),
linear-gradient(0deg, #8CC8FF, #8CC8FF); color: #ffffff; 
width:12rem;border-radius:50px !important;                                                                 padding: 10px 20px; margin: 20px 0; text-decoration: none; border-radius: 5px; display: inline-block;">Cliquez ici</a>
          <p style="font-size:0.8rem;">En cas de problème, n'hésitez pas à demander de l'aide sur notre site
              <a>
                  <span style="color:#5991C6;text-decoration:underline;cursor:pointer;">support</span>
              </a>
          </p>

      </div>

      <div style="background-color: #0C0E1C; color: #ffffff; text-align: center; padding: 10px; font-size: 0.8em;">
          <p style="margin: 0;font-size:0.6rem;margin-top:2rem;color:white;">1618 rue de la paix Paris 75004</p>
        
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 1rem;">
  <tr>
    <td align="center">
      <table border="0" cellspacing="0" cellpadding="0">
        <tr>
          <!-- This container will create the circular border -->
          <td style="border-radius:50%; border: 1px solid #5991C6; width: 30px; height: 30px; line-height: 30px; text-align: center;">
            
            <a href="https://www.instagram.com/carmen.chat.fr/">
              <img src="https://res.cloudinary.com/dbjwbveqn/image/upload/v1703878948/instagramicon_jujc59.png" style="vertical-align: middle; height: 15px; width: 15px; border-radius: 50%;" alt="Instagram">
            </a>
          </td>
          <td width="8"></td>
          <td style="border-radius:50%;margin-left:8px; border: 1px solid #5991C6; width: 30px; height: 30px; line-height: 30px; text-align: center;">
        
          <a href="https://twitter.com/carmenchatoff?s=11/">
           
            <img src="https://res.cloudinary.com/dbjwbveqn/image/upload/v1703879001/twittericon_ydaat1.png" style="vertical-align: middle; height: 15px; width: 15px; border-radius: 50%;" alt="Instagram">
          </a>
        </td>
        <td width="8"></td>
        <td style="border-radius:50%;margn-left:8px; border: 1px solid #5991C6; width: 30px; height: 30px; line-height: 30px; text-align: center;">

        <a href="https://www.tiktok.com/@carmen.chat.officiel?is_from_webapp=1&sender_device=pc/">
      
          <img src="https://res.cloudinary.com/dbjwbveqn/image/upload/v1703879035/youtube_uupzxm.png" style="vertical-align: middle; height: 15px; width: 15px; border-radius: 50%;" alt="Instagram">
        </a>
      </td>
        
        </tr>
      </table>
    </td>
  </tr>
</table>


      </div>

  </div>

  </div>
  </div>
</body>

  </html>

  `
};
transporter.sendMail(mailOptions,function(error,info){
  if(error){
    return res.status(400).json({
      error:"problème d'envoi d'e-mail, veuillez réessayer"
    })
  }else{
    return res.status(200).json({
      message:'succès'
    })
  }
})  

  }catch(e){
    console.log(e.message)
    res.status(400).json({
      error:"erreur de serveur, veuillez essayer plus tard"
    })
  }
}


module.exports.resetPassword=async(req,res)=>{
  let {password,token}=req.body;

  try{
let userData=await jwt.verify(token,process.env.JWT_TOKEN)

let encryptedpassword=await bycrypt.hash(password,10)
let updateResponse=await userModel.updateOne({email:userData.email},{password:encryptedpassword})
console.log(updateResponse)
if(updateResponse. modifiedCount=== 1) {
  return res.status(200).json({ message: 'Mot de passe mis à jour avec succès.' });
} else {
  return res.status(400).json({ error: "Aucune mise à jour effectuée. L'utilisateur n'existe peut-être pas." });
}
  }catch(e){
    console.log(e.message)
return res.status(200).json({
  error:"erreur de serveur, veuillez essayer plus tard"
})
  }
}



module.exports.googleLogin=async(req,res)=>{
  try{
    let {email}=req.body;
    let alreadyexists=await userModel.findOne({email})
if(alreadyexists){
  let token=jwt.sign({
    alreadyexists
  },process.env.JWT_TOKEN)
let alreadyExists=alreadyexists.toObject();
alreadyExists.token=token;
const now = moment();

// Flag to indicate if within timeframe
let isWithinTimeframe = false;
let creatorid="6598efb70f70d4cec0ec9e8c"
let creatorname="ali"

// Check each start time
startTimes.forEach(async(startTime) => {
  const time = moment(startTime, 'HH:mm');
  const tenMinutesBefore = time.clone().subtract(10, 'minutes');
  const diffInMinutes = tenMinutesBefore.diff(now, 'minutes');
console.log('diffInMinutes')
  console.log(diffInMinutes)
  console.log(startTime)
  if (diffInMinutes==0 || diffInMinutes=='0') {
    console.log(`It's within 10 minutes before ${startTime}`);
 await notificationModel.create({
  creator:creatorid,
  user:alreadyExists._id,
  reason:`There is 10 minutes before next call with ${creatorname}`
 })
    isWithinTimeframe = true;
  }else{
    if (!isWithinTimeframe) {
      console.log("It's not within 10 minutes before any start time");
      console.log(diffInMinutes)
    }
  }
});

  return res.status(200).json({
    user:alreadyExists
  })
}else{
  return res.status(400).json({
    error:"L'utilisateur n'est pas enregistré"
  })
}
  }catch(e){
    console.log(e.message)
return res.status(400).json({
  error:"erreur de serveur, veuillez essayer plus tard"
})
  }
}


module.exports.facebookLogin=async(req,res)=>{
  const { accessToken, userID } = req.body;

  // Step 1: Verify the token with Facebook
  try {
const respone=await axios.get(`https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email,birthday&access_token=${accessToken}`)   
console.log(respone.data)
let {email,name}=respone.data;
let alreadayexists=await userModel.findOne({email})
if(alreadayexists){
  let token=jwt.sign({
    alreadyexists
  },process.env.JWT_TOKEN)
 let alreadayExists=alreadayexists.toObject();
 alreadayExists.token=token;
 const now = moment();

 // Flag to indicate if within timeframe

 let creators=await creatorModel.find({})
 creators?.map((creator,i)=>{
   // Check each start time
   let isWithinTimeframe = false;
   let creatorid=creator?._id.toString();
   let creatorname=creator?.name.toString();
 startTimes?.forEach(async(startTime) => {
  const time = moment(startTime, 'HH:mm');
  const tenMinutesBefore = time.clone().subtract(10, 'minutes');
  const diffInMinutes = tenMinutesBefore.diff(now, 'minutes');
console.log('diffInMinutes')
  console.log(diffInMinutes)
  console.log(startTime)
  if (diffInMinutes==0 || diffInMinutes=='0') {
    console.log(`It's within 10 minutes before ${startTime}`);
 await notificationModel.create({
  creator:creatorid,
  user:alreadayExists._id,
  reason:`There is 10 minutes before next call with ${creatorname}`
 })
    isWithinTimeframe = true;
  }else{
    if (!isWithinTimeframe) {
      console.log("It's not within 10 minutes before any start time");
      console.log(diffInMinutes)
    }
  }
});
 })

 
 return res.status(200).json({
 user:alreadayExists
 })
}else{
  res.status(400).json({
    error:"Compte non enregistré"
  })
} 


} catch (error) {
      console.error('Error verifying the Facebook token:', error);
   return  res.status(500).json({ error: "erreur de serveur, veuillez essayer plus tard" });
  }

}