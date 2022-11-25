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
const user = require('../models/userSchema');
require("cookie-parser");
var jwt = require("jsonwebtoken");
require('dotenv').config();
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.jwttoken;
        if (!token) {
            throw new Error('Login before trying to verify');
        }
        const verifyToken = yield jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        if (!verifyToken) {
            throw new Error('Token could not be verified');
        }
        req.tokenID = verifyToken._id;
        next();
    }
    catch (err) {
        res.status(400).send(`Unauthorized: No token provided`);
    }
});
module.exports = { authenticate };
