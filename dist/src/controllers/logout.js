"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logout = (req, res) => {
    res.clearCookie('jwttoken', { path: "/" });
    return res.status(200).send("Logout Successful");
};
module.exports = { logout };
