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
const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
var uploadToCloudinary = require("../services/cloudinary");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cred, password } = req.body;
        if (!cred || !password) {
            return res.status(400).json({ error: "Please enter data" });
        }
        if (isNaN(cred)) {
            var userExist = yield User.findOne({ email: cred });
        }
        else {
            var userExist = yield User.findOne({ phone: parseInt(cred) });
        }
        if (userExist) {
            const isMatch = yield bcrypt.compare(password, userExist.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Invalid Credentials" });
            }
            else {
                const token = yield userExist.generateAuthToken();
                res.cookie("jwttoken", token);
                return res.status(200).json({ userID: userExist._id, message: "Login Succesful" });
            }
        }
        else {
            return res.status(400).json({ error: "User not registered" });
        }
    }
    catch (err) {
        console.log(err);
    }
});
const imgupload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userExist = yield User.findOne({ _id: req.params.id });
    if (userExist) {
        const data = yield uploadToCloudinary.uploadToCloudinary(req.file.path, "user-images");
        const imgUpload = yield User.updateOne({ _id: req.params.id }, { $set: {
                imgURL: data.url
            } });
        return res.status(200).json({ msg: `${userExist.name}'s profile picture uploaded` });
    }
    return res.status(400).json({ error: "USER DOES NOT EXIST" });
});
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.file);
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
            password = yield bcrypt.hash(password, 10);
            const user = new User({ name, email, password, phone });
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
const logout = (req, res) => {
    res.clearCookie('jwttoken', { path: "/" });
    return res.status(200).send("Logout Successful");
};
module.exports = { login, signup, imgupload, logout };
