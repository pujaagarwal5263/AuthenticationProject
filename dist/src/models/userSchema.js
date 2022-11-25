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
const validator = require("validator");
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
var mongoose = require("mongoose");
require('dotenv').config();
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Email ID already registered. Try logging in instead."],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("INVALID EMAIL");
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        minlength: 10,
        maxlength: 10,
        required: true,
        unique: [true, "Phone Number already registered. Try logging in instead."]
    },
    imgURL: {
        type: String
    },
    tokens: [{
            token: {
                type: String,
                required: true
            }
        }]
});
//to work with instance of schema
userSchema.methods.generateAuthToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = jwt.sign({ _id: this._id }, process.env.TOKEN_SECRET_KEY);
            this.tokens = this.tokens.concat({ token: token });
            yield this.save();
            return token;
        }
        catch (err) {
            console.log(err);
        }
    });
};
const User = new mongoose.model('User', userSchema);
module.exports = User;
