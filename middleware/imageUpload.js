const multer=require('multer')
const sharp=require('sharp')
const fs=require('fs')
const path=require('path')
const memoryStorage=multer.memoryStorage();
const  multerfilter=(req,file,cb)=>{
  
    if(file.mimetype.startsWith('image')){
        return cb(null,true)
    }else{
        return cb({message:'invalid file format'},false)
    }
}
const imageUpload=multer({
    storage:memoryStorage,
    fileFilter:multerfilter,
    limits:{fileSize:1000000}
})

const reportImageResize = async (req, res, next) => {
    // Assuming you are setting a filename like this
    req.filename = `image-${Date.now()}-${req.file.originalname}`;

    const dirPath = path.join('public', 'images', 'report');

    try {
        // Check if the directory exists using fs.promises for async/await
        await fs.promises.access(dirPath);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // Directory does not exist, so create it
            await fs.promises.mkdir(dirPath, { recursive: true });
        } else {
            // Some other error occurred
            console.error('Error checking directory:', error);
            return res.status(500).send('Server error');
        }
    }

    // Proceed to resize and save the image
    try {
        await sharp(req.file.buffer)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(path.join(dirPath, req.filename));
        next();
    } catch (error) {
        // Handle errors from sharp or file writing
        console.error('Error processing image:', error);
        res.status(500).send('Error processing image');
    }
};
module.exports={imageUpload,reportImageResize}