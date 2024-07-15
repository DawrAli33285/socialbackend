const {createpost}=require('../creator controller/creator-postController')
const {register,creatorlogin}=require('../creator controller/creator-authController')
const express=require('express')
const router=express.Router();
router.post('/register-creator',register)
router.post('/login-creator',creatorlogin)
router.post('/create-post',createpost)
module.exports=router;