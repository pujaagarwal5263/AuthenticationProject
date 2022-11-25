"use strict";
const cloudinary = require("cloudinary");
require('dotenv').config();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
const uploadToCloudinary = (path, folder) => {
    return cloudinary.uploader.upload(path, {
        folder
    }).then((data) => {
        return { url: data.url, public_id: data.public_id };
    }).catch((err) => {
        console.log(err);
    });
};
module.exports = { uploadToCloudinary };
