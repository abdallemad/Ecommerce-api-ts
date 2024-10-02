import {z} from 'zod'
import validator from 'validator'
import bcryptjs from 'bcryptjs'
enum  Role{
  admin = 'admin',
  user = 'user',
}
export const userSchema = z.object({
  name:z.string().min(2,{message:"name can't be less than 2"}),
  email:z.string().refine(value=> validator.isEmail(value),{message:'please provide correct email.'}),
  password:z.string().min(5,{message:"password cant be less than 8 chars"}),
})

export async function validateUserSchema(data:any){
  const result = userSchema.safeParse(data);
  if(result.error){
    throw  result.error
  }
  const hashed = await hashPassword(result.data.password)
  return {
    ...result.data,
    password:hashed
  }
}
export async function comparePassword({credentials,hashed}:{credentials:string,hashed:string}){
  const isMatch = await bcryptjs.compare(credentials,hashed);
  return isMatch
}
export async function hashPassword(password:string){
  const salt = await bcryptjs.genSalt(10);
  const hashed = await bcryptjs.hash(password,salt)
  return hashed
}