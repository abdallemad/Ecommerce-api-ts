import { Request,Response } from "express";
import { StatusCodes } from "http-status-codes";
import db from "../db";
import CustomErrors from "../errors";
import checkPermission from "../utils/checkPermission";
import { comparePassword, hashPassword } from "../utils/schemas";

export const getAllUsers= async(req:Request,res:Response)=>{
  console.log('work')
  const users = await db.user.findMany({select:{ name:true , id:true, email:true,role:true}})
  res.status(StatusCodes.OK).json({users});
}

export const showMe = async(req:Request,res:Response)=>{
  // @ts-ignore
  res.status(StatusCodes.OK).json({user:req?.user})
}
export const updateUser = async(req:Request,res:Response)=>{
  // @ts-ignore
  const {id}:{id:string} = req.user
  const {email,name} = req.body;
  if(!email || !name) throw new CustomErrors.BadRequestError('please provide both values');
  const user = await db.user.update({
    where:{
      id
    },
    data:{
      name,
      email
    },select:{
      email:true,
      id:true,
      name:true,role:true,
    }
  })
  res.status(StatusCodes.OK).json({msg:'work', user})
}
export const updateUserPassword = async (req:Request,res:Response)=>{
  const {oldPassword,newPassword}:{oldPassword:string,newPassword:string} = req.body;
  // @ts-ignore
  const {id}:{id:string} = req.user
  if(!oldPassword || !newPassword) throw new CustomErrors.BadRequestError('please provide both values');
  const user = await db.user.findFirst({where:{id}})
  if(!user) throw new CustomErrors.BadRequestError('no user found');
  const isCorrect =await comparePassword({credentials:oldPassword,hashed:user?.password})
  if(!isCorrect) throw new CustomErrors.UnAuthenticatedError('please provide correct password');
  const hashed = await hashPassword(newPassword);
  await db.user.update({where:{id}, data:{password:hashed}});
  res.status(StatusCodes.OK).json({msg:'password updated successfully'});
}
export const getSingleUser = async(req:Request,res:Response)=>{
  const {id} = req.params;
  const user = await db.user.findFirst({where:{id},select:{email:true,id:true,name:true,role:true}})
  if(!user) throw new CustomErrors.NotFoundError(`there is no user match this id: ${id}`);
  // @ts-ignore
  checkPermission({id:req.user.id,role:req.user.role},user.id)
  res.status(StatusCodes.OK).json({user})
}