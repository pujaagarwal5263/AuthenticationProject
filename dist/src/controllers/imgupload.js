"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var User = require("../models/userSchema");
var uploadToCloudinary = require("../services/cloudinary");
const imgupload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userExist = yield User.findOne({ _id: req.body.id });
    if (userExist) {
        const data = yield uploadToCloudinary.uploadToCloudinary(req.file.path, "user-images");
        const imgUpload = yield User.updateOne({ _id: req.body.id }, { $set: {
                imgURL: data.url
            } });
        return res.status(200).json({ msg: `${userExist.name}'s profile picture uploaded` });
    }
    return res.status(400).json({ error: "USER DOES NOT EXIST" });
});
module.exports = { imgupload };
