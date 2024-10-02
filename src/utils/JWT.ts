import jwt from 'jsonwebtoken'
import { Response } from 'express'

export function createJWT({data}:{data:any}){
  // @ts-ignore  this comment for the process
  return jwt.sign(data,process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
}
// @ts-ignore
export const verifyToken = ({token}:{token:string})=> jwt.verify(token,process.env.JWT_SECRET)

export function attachCookiesToResponse({res,data}:{res:Response,data:any}){
  const token = createJWT({data:data});
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie('token',token,{
    httpOnly:true,
    expires:new Date(Date.now() + oneDay),
    secure:process.env.NODE_ENV === 'production',
    signed:true
  })
}