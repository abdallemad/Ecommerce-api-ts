import { Request,Response,NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import CustomApiError from "../errors/CustomApiError";
import { ZodError } from "zod";

const errorHandler = async (err:any,req:Request,res:Response,next:NextFunction)=>{
  
  if(err instanceof CustomApiError){
    // @ts-ignore
    return res.status(err?.statusCode || 500).json({msg:err.message})
  }
  if(err instanceof ZodError){
    const messages = err.errors.map(err=>err.message).join(', ')
    return res.status(StatusCodes.BAD_REQUEST).json({msg:messages});
  }
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:'some thing went wrong', err})
}

export default errorHandler;