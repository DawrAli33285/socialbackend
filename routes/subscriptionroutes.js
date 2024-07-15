const express=require('express')
const {authenticated}=require('../middleware/authenticated')
const {subscribe,getSubscription,getStripeSubscription,makeOneTimePayment}=require('../controllers/subscription')
const router=express.Router();

router.post('/reserve-call',authenticated,makeOneTimePayment)
router.post('/subscribe',authenticated,subscribe)
router.get('/get-subscriptions',authenticated,getSubscription)
router.get('/getStripeSubscription/:subid',getStripeSubscription)
module.exports=router;