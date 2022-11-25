import { RequestHandler, Response, Request} from "express";

const tokenVerify: RequestHandler = async(req: any,res: Response)=>{
    if(req.body.id!=req.tokenID){
      return res.status(200).json({msg:"You are not legitimate user"});
    }
  return res.status(200).json({msg:"Token successfully verified"});
  }


module.exports =  { tokenVerify } ;