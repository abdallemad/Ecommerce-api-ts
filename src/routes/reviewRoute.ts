import express from 'express';
import {
  createReview,
  deleteReview,
  getSingleReview,
  updateReview,
  getAllReviews,
} from '../controller/reviewController'
import { authenticateUser} from '../middleware/authentication'
const router = express.Router()


router
  .route('/')
  .post(authenticateUser, createReview)
  .get(getAllReviews);

router
  .route('/:id')
  .patch(authenticateUser,updateReview)
  .delete(authenticateUser, deleteReview)
  .get(getSingleReview)


export default router