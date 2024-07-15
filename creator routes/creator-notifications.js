const {authenticated}=require('../middleware/authenticated')
const express=require('express')
const {createNotification,checknotificationinfo}=require('../creator controller/creator-notifications')
const router=express.Router();


router.post('/creator-create-notification',authenticated,createNotification)
router.get('/checknotificationinfo',checknotificationinfo)
module.exports=router;