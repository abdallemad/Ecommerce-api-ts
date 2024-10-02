import CustomErrors from "../errors";
import { verifyToken } from "../utils/JWT";
import { Request, Response, NextFunction } from "express";

export const authenticateUser = (req:Request,res:Response,next:NextFunction)=>{
  const token = req.signedCookies?.token || ''
  if(!token) throw new CustomErrors.UnAuthenticatedError(`Authentication invalid`);
  try {
    const decoded = verifyToken({token});
    const {name,id,role} = decoded
    // @ts-ignore
    req.user = {name,role,id};
    next();
  } catch (error) {
    throw new CustomErrors.UnAuthenticatedError('Authentication invalid');
  }
}

export const accessPermission = (...role:string[])=>async(req:Request,res:Response,next:NextFunction)=>{
  // @ts-ignore
  if(!role.includes(req?.user?.role)) throw new CustomErrors.UnauthorizedError('access forbidden');
  next();
}