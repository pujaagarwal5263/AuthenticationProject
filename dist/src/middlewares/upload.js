"use strict";
const multer = require("multer");
const storage = multer.diskStorage({});
const upload = multer({ storage: storage }).single('profile_pic');
module.exports = { upload };
