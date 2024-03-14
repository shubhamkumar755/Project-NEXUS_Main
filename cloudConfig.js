const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,//the environmental variables which are inside .env can be given any name but what we use here to define that should the same as written here like cloud_name: .....
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'Lost_And_Found',
      allowedFormats:["png","jpg","jpeg"],// supports promises as well
    },
  });

  module.exports={
    cloudinary,
    storage,
  };