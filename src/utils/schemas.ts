import {number, z, ZodSchema} from 'zod'
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
export type UserType = z.infer<typeof userSchema>

export const productSchema = z.object({
  name:z.string({message:'please provide product name'})
    .min(2,{message:'name must be more than 2chars'}),
  price:z.number({message:'please provide product price'})
    .min(0,{message:'price cant be less than 0'}),
  description:z.string({message:"please provide product description"})
    .min(8,{message:"please provide product description"}),
  category:z.string({message:"please provide product category"})
    .min(2,{message:"please provide product category"}),
  company:z.string({message:'please provide product company'})
    .min(2,{message:"please produce product company"}),
  featured:z.boolean()
    .default(false),
  freeShipping:z.boolean()
    .default(false),
  inventory:z.number()
    .default(15),
  averageRating:z.number()
    .default(0),
  colors:z.array(z.string())
    .default(['#fff'])
})

export type ProductType = z.infer<typeof productSchema>

export function validateZodSchema<T>(data:any,zodSchema:ZodSchema):T{
  const result = zodSchema.safeParse(data)
  if(result.error){
    throw  result.error
  }
  return result.data
}
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