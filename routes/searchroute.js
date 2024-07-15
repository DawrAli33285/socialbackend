const express=require('express')
const {authenticated}=require('../middleware/authenticated')
const {searchContentByCreator,initialSeachPosts,searchContentByTag,getCreatorPosts,addCreatorToFavourites}=require('../controllers/searchcontroller')
const router=express.Router();
router.get('/search-profile-username/:name',searchContentByCreator);
router.get('/search-profile-tag/:name',searchContentByTag);
router.get('/creator-posts/:id',authenticated,getCreatorPosts)
router.post('/addCreatorToFavourites',authenticated,addCreatorToFavourites)
router.get('/initialSeachPosts',authenticated,initialSeachPosts)
module.exports=router;