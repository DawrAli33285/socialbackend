const express=require('express')
const router=express.Router();
const {authenticated}=require('../middleware/authenticated')
const {getCreators,sendMessage,getMessages,seenMessage}=require('../controllers/messagesController')
router.get('/get-conversation',authenticated,getCreators)
router.get('/get-messages/:creator',authenticated,getMessages)
router.post('/send-message',authenticated,sendMessage)
router.post('/seen-message',authenticated,seenMessage)
module.exports=router;