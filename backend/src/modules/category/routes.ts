import express from 'express';
import { createCategory, deleteCategory, getCategories, updateCategory, getCategoryById } from './controller.js';
import { validate } from '../../middleware/validate.js';
import { categorySchema, updateCategorySchema } from './schema.js';
import { isAdmin, isAuthenticated } from '../../middleware/auth.js';

const router = express.Router();

router.get('/', isAuthenticated, getCategories);
router.get('/:id', isAuthenticated, getCategoryById);
router.post('/', isAuthenticated, isAdmin, validate(categorySchema), createCategory);
router.put('/:id', isAuthenticated, isAdmin, validate(updateCategorySchema), updateCategory);
router.delete('/:id', isAuthenticated, isAdmin, deleteCategory);

export default router;
