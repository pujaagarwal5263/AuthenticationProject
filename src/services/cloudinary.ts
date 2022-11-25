const cloudinary=require("cloudinary");
require('dotenv').config()

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
  });

const uploadToCloudinary=(path:any,folder:any)=>{
    return cloudinary.uploader.upload(path,{
      folder
    }).then((data:any)=>{ 
      return { url: data.url, public_id: data.public_id};
    }).catch((err:any)=>{
      console.log(err);
    })
}

module.exports={uploadToCloudinary};