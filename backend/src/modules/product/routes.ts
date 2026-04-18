import express from 'express';
import { createProduct, deleteProduct, getProducts, updateProduct, getProductById, getFilteredProducts } from './controller.js';
import { validate } from '../../middleware/validate.js';
import { productSchema, updateProductSchema } from './schema.js';
import { isAdmin, isAuthenticated } from '../../middleware/auth.js';

const router = express.Router();

router.get('/', isAuthenticated, getProducts);
router.get('/filtered', isAuthenticated, getFilteredProducts);
router.get('/:id', isAuthenticated, getProductById);
router.post('/', isAuthenticated, isAdmin, validate(productSchema), createProduct);
router.put('/:id', isAuthenticated, isAdmin, validate(updateProductSchema), updateProduct);
router.delete('/:id', isAuthenticated, isAdmin, deleteProduct);

export default router;
