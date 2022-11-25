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
var jwt = require("jsonwebtoken");
require('dotenv').config();
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
                return res.status(401).json({ error: "Invalid Credentials" });
            }
            else {
                const token = jwt.sign({ _id: userExist._id }, process.env.TOKEN_SECRET_KEY);
                res.cookie("jwttoken", token);
                //return res.status(200).json({status:"Success",token: `Bearer ${token}`})
                return res.status(200).json({ userID: userExist._id, message: "Login Succesful" });
            }
        }
        else {
            return res.status(404).json({ error: "User not registered" });
        }
    }
    catch (err) {
        console.log(err);
    }
});
module.exports = { login };
