const express=require('express')
const router=express.Router();
const {authenticated}=require('../middleware/authenticated')
const {createNotifications,getNotifications,adminNotification}=require('../controllers/notificationController')
router.post('/create-notification',authenticated,createNotifications)
router.get('/get-notifications',authenticated,getNotifications)
router.post('/admin-notifications',adminNotification);
module.exports=router