const express=require('express')
const router=express.Router();
const {imageUpload,reportImageResize}=require('../middleware/imageUpload')
const {authenticated}=require('../middleware/authenticated')
const {reportNow}=require('../controllers/reportController')
router.post('/report',imageUpload.single('image'),reportImageResize,reportNow)
module.exports=router;