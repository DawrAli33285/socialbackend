const express=require('express')
const {changeCredentials,getuserinfo,deleteAccount,fetch_notification_options,updateuserinfo,update_notification_options }=require('../controllers/Account')
const {authenticated}=require('../middleware/authenticated')
const router=express.Router();

router.post('/change-credentials',authenticated,changeCredentials)
router.delete('/deleteAccount',authenticated,deleteAccount)
router.get('/getuserinfo',authenticated,getuserinfo)
router.post('/update-userinfo',authenticated,updateuserinfo )
router.get('/get-notification_options',authenticated,fetch_notification_options)
router.post('/update-notification_options',authenticated,update_notification_options)
module.exports=router;