const user=require('../models/userSchema');
require("cookie-parser");
var jwt=require("jsonwebtoken");
require('dotenv').config()

const authenticate=async(req:any,res:any,next:any)=>{
    try{
        const token= req.cookies.jwttoken;
        if(!token){
            throw new Error('Login before trying to verify');
        }
        const verifyToken=await jwt.verify(token,process.env.TOKEN_SECRET_KEY);
        
        if(!verifyToken){
        throw new Error('Token could not be verified');
        }
        req.tokenID=verifyToken._id;
        next();
    }catch(err){
        res.status(400).send(`Unauthorized: No token provided`);
    }
} 
module.exports={authenticate};