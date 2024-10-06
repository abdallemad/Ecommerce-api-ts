import express from 'express'
import {
  getAllUsers,
  getSingleUser,
  showMe,
  updateUser,
  updateUserPassword,
  getAllUserReviews
} from '../controller/usersController'
import { authenticateUser ,accessPermission } from '../middleware/authentication';
const router  = express.Router();

router
  .route('/')
  .get(authenticateUser, accessPermission('admin'), getAllUsers);
router
  .route('/showMe')
  .get(authenticateUser,showMe)
router
  .route('/updatePassword')
  .patch(authenticateUser, updateUserPassword);
router
  .route('/updateUser')
  .patch(authenticateUser, updateUser)
router
  .route('/:id')
  .get(authenticateUser, getSingleUser);

router
  .route("/:id/reviews")
  .get(authenticateUser, getAllUserReviews)

export default router

