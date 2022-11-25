import { RequestHandler, Response, Request} from "express";
var bcrypt=require("bcrypt");
var User=require("../models/userSchema");
var jwt=require("jsonwebtoken");
require('dotenv').config()

const login: RequestHandler = async(req: Request,res: Response)=>{
    try{
      const {cred,password}=req.body;
     
      if(!cred || !password){
        return res.status(400).json({ error:"Please enter data"});
      }
  
      if(isNaN(cred)){
        var userExist = await User.findOne({ email: cred });
      }else{
        var userExist = await User.findOne({ phone: parseInt(cred) }); 
      }
      
      if(userExist){
       const isMatch=await bcrypt.compare(password,userExist.password);
       
      if(!isMatch){
        return res.status(401).json({ error:"Invalid Credentials"})
      }
      else{
      const token=jwt.sign({_id:userExist._id},process.env.TOKEN_SECRET_KEY);
      res.cookie("jwttoken",token);
      //return res.status(200).json({status:"Success",token: `Bearer ${token}`})
      return res.status(200).json({userID:userExist._id,message:"Login Succesful"})
      }
      }
      else{
        return res.status(404).json({ error:"User not registered"})
      }
    }catch(err){
        console.log(err);
    } 
  }

  module.exports={login}