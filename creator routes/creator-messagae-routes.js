const express=require('express')
const router=express.Router();
const {authenticated}=require('../middleware/authenticated')
const {creatorgetMessages,getUsers,creatorsendMessage}=require('../creator controller/creator-messageController')
router.get('/creator-get-conversation',authenticated,getUsers)
router.get('/creator-get-messages/:user',authenticated,creatorgetMessages)
router.post('/creator-send-message',authenticated,creatorsendMessage)
module.exports=router;