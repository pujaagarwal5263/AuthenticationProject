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
const redis = require("redis");
const User = require("../models/userSchema");
let redisClient;
(() => __awaiter(void 0, void 0, void 0, function* () {
    redisClient = redis.createClient();
    redisClient.on("error", (error) => console.error(`Error : ${error}`));
    yield redisClient.connect();
}))();
const cache = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.params.email;
    try {
        const cacheResults = yield redisClient.get(email);
        if (cacheResults) {
            console.log("cache hit");
            return res.status(200).json({ msg: "Cache Hit", data: JSON.parse(cacheResults) });
        }
        else {
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                const userData = yield User.findOne({ email: req.params.email });
                yield redisClient.set(email, JSON.stringify(userData));
                return res.status(200).json({ msg: "Cache Miss", userData });
            }), 5000);
        }
    }
    catch (err) {
        console.log(err);
    }
});
module.exports = { cache };
