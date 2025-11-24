const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.SECRET_KEY

});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'NESTORA_DEV',
        allowedFormats: async (req, file) => ["png","jpeg","jpg"] // supports promises as well
    },
    });

module.exports={
    cloudinary,
    storage
};