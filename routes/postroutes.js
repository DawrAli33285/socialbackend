const {getPosts,add_remove_favourite,getSinglePost}=require('../controllers/Postcontroller')
const express=require('express')
const {authenticated}=require('../middleware/authenticated')
const router=express.Router();
router.get('/get-posts',authenticated,getPosts)
router.post('/add-remove-favourites',add_remove_favourite)
router.post('/get-post',authenticated,getSinglePost)
module.exports=router