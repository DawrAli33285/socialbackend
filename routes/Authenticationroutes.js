const {Register,email_verification,googleLogin,facebookLogin,login,resetPassword, resetPasswordEmail,googleAuth, facebookAuth}=require('../controllers/Authenticationcontroller')
const express=require('express')
const router=express.Router();
router.post('/register-user',Register)
router.post('/google-auth',googleAuth)
router.get('/email-verification/:token',email_verification)
router.post('/facebookAuth',facebookAuth)
router.post('/login-user',login)
router.post('/forget-password',resetPasswordEmail)
router.post('/reset-password',resetPassword)
router.post('/google-login',googleLogin)
router.post('/facebook-login',facebookLogin)
module.exports=router;