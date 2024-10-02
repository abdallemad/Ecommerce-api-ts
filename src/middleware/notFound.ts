import { Response,Request } from "express";
import { StatusCodes } from "http-status-codes";

export default (req:Request,res:Response)=> res.status(StatusCodes.NOT_FOUND).send('route doesnt exists.')