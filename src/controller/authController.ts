import { Request,Response } from "express"
import db from '../db'
import { comparePassword, validateUserSchema } from "../utils/schemas";
import { StatusCodes } from "http-status-codes";
import { attachCookiesToResponse } from "../utils/JWT";
import CustomErrors from "../errors";

export const register  = async(req:Request,res:Response)=>{
  const rawData = req.body;
  // valid the data
  const { email,name,password} = await validateUserSchema(rawData)
  // create user
  const user = await db.user.create({
    data:{
      email,
      name,
      password,
    }
  })
  // create user token
  const tokenUser = {name:user.name,id:user.id,role:user.role};
  attachCookiesToResponse({res:res,data:tokenUser});
  res.status(StatusCodes.CREATED).json({user:tokenUser})
}

export const login = async(req:Request,res:Response)=>{
  const {email, password} = req.body;
  // check for values
  if(!email || !password) throw new CustomErrors.BadRequestError("please provide both values");
  const user = await db.user.findFirst({where:{email}});

  // check for email
  if(!user) throw new CustomErrors.UnAuthenticatedError('Invalid Email');
  // check for password
  const isPasswordCorrect = await comparePassword({credentials:password,hashed:user.password})
  if(!isPasswordCorrect) throw new CustomErrors.UnAuthenticatedError('Invalid password');
  // attach the token to cookies
  const tokenUser = {name:user.name,id:user.id,role:user.role};
  attachCookiesToResponse({res:res,data:tokenUser});
  res.status(StatusCodes.CREATED).json({user:tokenUser})
}

export const logout = async (req:Request,res:Response)=>{
  res.cookie('token','selly string',{
    httpOnly:true,
    expires:new Date(Date.now() + 5 *1000),
  })
  res.status(StatusCodes.OK).json({msg:'logged out successfully.'})
}