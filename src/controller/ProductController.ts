import { Request,Response } from "express";
import db from "../db";
import { StatusCodes } from "http-status-codes";
import CustomErrors from "../errors";
import { v2 } from "cloudinary";
import { productSchema, validateZodSchema, ProductType } from "../utils/schemas";
import {unlink} from 'fs/promises'

// could improve it later.
export const getAllProduct = async (req:Request,res:Response)=>{
  const products = await db.product.findMany({})
  res.status(StatusCodes.OK).json(products)
}

export const getSingleProduct = async (req:Request,res:Response)=>{
  const {id} = req.params
  const produce = await db.product.findFirst({where:{id}});
  if(!produce) throw new CustomErrors.BadRequestError(`no product match this id: ${id}`)
  res.status(StatusCodes.OK).json({produce})
}

export const createProduct = async (req:Request,res:Response)=>{
  // @ts-ignore
  const {id:userId}:{id:string} = req.user
  let rawData = req.body;
  rawData = {
    ...rawData,
    price:+rawData.price
  }
  // check for file 
  const image = req.file
  const MB = 1024 * 1024
  // validate image file
  if(!image || !image.mimetype.startsWith('image/') || image.size> MB ) 
    throw new CustomErrors.BadRequestError('please provide the image')

  // validate fields
  const data = validateZodSchema<ProductType>(rawData,productSchema);
  // upload image
  const {
    secure_url,
    public_id
  } = await v2.uploader.upload(image.path as string,{
    use_filename:true,
    folder:"Ecommerce-api"
  })
  // create product
  const product = await db.product.create({
    data:{
      ...data,
      image:secure_url,
      userId,
      image_id:public_id
    }
  })
  // remove image from local machine
  await unlink(image.path )
  res.status(StatusCodes.CREATED).json({product})
}

export const updateProduct = async (req:Request,res:Response)=>{
  const {id} = req.params
  const product = await db.product.findFirst({where:{id}})
  if(!product) throw new CustomErrors.BadRequestError(`no product match this id: ${id}`)
  let rawData = req.body;
  rawData = {
    ...rawData,
    price:+rawData.price
  }
  const data = validateZodSchema<ProductType>(rawData,productSchema);
  const updated = await db.product.update({
    where:{id},
    data
  })
  res.status(StatusCodes.OK).json({product:updateProduct})
}

export const deleteProduct = async (req:Request,res:Response)=>{
  const {id} = req.params;
  const deleted = await db.product.delete({where:{id}})
  res.status(StatusCodes.OK).json({product:deleted})
}

// this is the next.
export const updateProductImage = async (req:Request,res:Response)=>{
  const {id} = req.params;
  // check for file 
  const image = req.file
  const MB = 1024 * 1024
  // validate image file
  if(!image || !image.mimetype.startsWith('image/') || image.size> MB ) 
    throw new CustomErrors.BadRequestError('please provide the image')
  // find product and delete the image
  const product = await db.product.findFirst({where:{id}});
  if(!product) throw new CustomErrors.BadRequestError(`no product match this id: ${id}`);
  await v2.api
    .delete_resources([product.image_id], 
    { type: 'upload', resource_type: 'image' })
  // upload image and update the product
  const {
    secure_url,
    public_id
  } = await v2.uploader.upload(image.path as string,{
    use_filename:true,
    folder:"Ecommerce-api"
  })
  const newProduct = await db.product.update({
    where:{id},
    data:{
      image:secure_url,
      image_id:public_id
    }
  })
  res.status(StatusCodes.OK).json({product:newProduct})
}
export const getAllProductReviews = async (req:Request,res:Response)=>{
  const {id} = req.params;
  const product = await db.product.findFirst({
    where:{
      id
    },
    select:{
      reviews:true,
    }
  })
  if(!product) throw new CustomErrors.NotFoundError(`no product match this id: ${id}`)
  res.status(StatusCodes.OK).json({reviews:product.reviews})
}