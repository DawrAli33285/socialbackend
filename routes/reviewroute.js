const express=require('express')
const {authenticated}=require('../middleware/authenticated')
const router=express.Router()
const {saveReview}=require('../controllers/reviewController')

router.post('/save-review',authenticated,saveReview)

module.exports=router