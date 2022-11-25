import { RequestHandler } from "express";

const logout:RequestHandler=(req,res)=>{ 
    res.clearCookie('jwttoken',{path: "/"});
    return res.status(200).send("Logout Successful");
  }

  module.exports={logout}