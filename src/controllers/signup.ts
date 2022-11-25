import { RequestHandler } from "express";
var bcrypt=require("bcrypt");
var User=require("../models/userSchema");
var uploadToCloudinary=require("../services/cloudinary");

const signup: RequestHandler = async(req: any,res)=>{
  
    var {name,email,password,cpassword,phone}=req.body;
    
    if(!name || !email || !password|| !cpassword || !phone){
      return res.status(400).json({error: "Please fill the data properly"});
    }
    try{
        const userExist = await User.findOne({
          $or: [{ email: email }, { phone: phone }]
        });
       
        if(userExist){
            return res.status(400).json({error: "Credentials already exist"});
         }else if(password!=cpassword){
            return res.status(400).json({ error:"Passwords do not match"})
          }
          else{
            if(!req.file){
              return res.status(400).json({error: "Profile picture cannot be fetched"});
            }
            const data= await uploadToCloudinary.uploadToCloudinary(req.file.path,"user-images");
            password=await bcrypt.hash(password,10);
            const user = new User({name,email,password,phone, imgURL: data.url});
            
            const userRegister=await user.save();

          if(userRegister){
            res.status(200).json({message:"Registration Successful"})
          }else{
            return res.status(500).json({error: "Failed to register"})
          }
          }
       } catch(err){
        console.log(err);
       }
  }

module.exports={signup}