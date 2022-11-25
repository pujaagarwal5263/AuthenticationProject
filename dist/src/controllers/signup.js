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
var bcrypt = require("bcrypt");
var User = require("../models/userSchema");
var uploadToCloudinary = require("../services/cloudinary");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var { name, email, password, cpassword, phone } = req.body;
    if (!name || !email || !password || !cpassword || !phone) {
        return res.status(400).json({ error: "Please fill the data properly" });
    }
    try {
        const userExist = yield User.findOne({
            $or: [{ email: email }, { phone: phone }]
        });
        if (userExist) {
            return res.status(400).json({ error: "Credentials already exist" });
        }
        else if (password != cpassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }
        else {
            if (!req.file) {
                return res.status(400).json({ error: "Profile picture cannot be fetched" });
            }
            const data = yield uploadToCloudinary.uploadToCloudinary(req.file.path, "user-images");
            password = yield bcrypt.hash(password, 10);
            const user = new User({ name, email, password, phone, imgURL: data.url });
            const userRegister = yield user.save();
            if (userRegister) {
                res.status(200).json({ message: "Registration Successful" });
            }
            else {
                return res.status(500).json({ error: "Failed to register" });
            }
        }
    }
    catch (err) {
        console.log(err);
    }
});
module.exports = { signup };
