import { RequestHandler, Response, Request} from "express";
const redis=require("redis");
const User=require("../models/userSchema");

let redisClient:any;
(async () => {
    redisClient = redis.createClient();
  
    redisClient.on("error", (error:any) => console.error(`Error : ${error}`));
  
    await redisClient.connect();
  })();




const cache:RequestHandler=async(req,res)=>{ 
  const email=req.params.email;
  try{
      const cacheResults=await redisClient.get(email);
      if(cacheResults){
          return res.status(200).json({msg:"Cache Hit",data: JSON.parse(cacheResults)})
      }else{
        setTimeout(async()=>{
          const userData=await User.findOne({ email: req.params.email });
          await redisClient.set(email, JSON.stringify(userData));
          return res.status(200).json({msg:"Cache Miss",userData})
        },5000);
      }
  }catch(err){
      console.log(err);
  }}

  module.exports={cache}