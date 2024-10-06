import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import checkPermission from '../utils/checkPermission'
import db from "../db";
import CustomErrors from "../errors";
import { reviewSchema, ReviewType, validateZodSchema } from "../utils/schemas";

export const getAllReviews = async (req:Request,res:Response)=>{
  const reviews = await db.review.findMany({});
  res.status(StatusCodes.OK).json({reviews})
}
export const getSingleReview =async  (req:Request,res:Response)=>{
  const {id} = req.params
  const review = await db.review.findUnique({where:{id}})
  if(!review) throw new CustomErrors.NotFoundError(`no review match this id:${id}`)
  // @ts-ignore
  checkPermission(req.user,review.userId)
  res.status(StatusCodes.OK).json({review})
}
export const createReview =async  (req:Request,res:Response)=>{
  const rawData = req.body;
  const data = validateZodSchema<ReviewType>(rawData,reviewSchema);
  // check for product
  const product = await db.product.findFirst({where:{id:data.productId}});
  if(!product) 
    throw new CustomErrors.NotFoundError(`there is not product match this id:${data.productId}`)
  // create the review
  const review = await db.review.create({
    data:{
      //@ts-ignore
      userId:req.user.id as string,
      ...data
    }
  })
  res.status(StatusCodes.CREATED).json({review})
}
export const updateReview =async  (req:Request,res:Response)=>{
  const {id} = req.params
  const review = await db.review.findFirst({where:{id}})
  if(!review) 
    throw new CustomErrors.NotFoundError(`there is not product match this id:${id}`)
  // @ts-ignore
  checkPermission(req.user,review.userId)
  let rawData = req.body;
  rawData = {
    rawData,
    productId:review.productId
  }
  const data = validateZodSchema<ReviewType>(rawData,reviewSchema);
  const newReview = await db.review.update({
    where:{id},
    data:{
      ...data
    }
  })
  res.status(StatusCodes.OK).json({newReview})
}
export const deleteReview = async (req:Request, res:Response)=>{
  const {id} = req.body;
  const review = await db.review.findFirst({where:{id}})
  if(!review)
    throw new CustomErrors.NotFoundError(`there is not review match this id: ${id}`)
  // @ts-ignore
  checkPermission(req.user,review.userId);
  await db.review.delete({
    where:{id}
  })
  res.status(StatusCodes.OK).json({msg:"review deleted."});
}