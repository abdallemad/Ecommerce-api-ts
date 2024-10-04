import express from 'express'
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  updateProductImage,
} from '../controller/ProductController'
import { authenticateUser,accessPermission } from '../middleware/authentication';
// Configure multer for file uploads
const router = express.Router();
import multer = require('multer');
const upload = multer({dest:'upload/'})
router
  .route('/')
  .get(getAllProduct)
  .post([authenticateUser,accessPermission('admin')], upload.single('image'), createProduct)
router
  .route('/updateProductImage')
  .post([authenticateUser,accessPermission('admin')],updateProductImage)
router
  .route('/:id')
  .get(getSingleProduct)
  .delete([authenticateUser,accessPermission('admin')],deleteProduct)
  .patch([authenticateUser,accessPermission('admin')],updateProduct)

export default router