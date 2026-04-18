import express from 'express';
import { createOutlet, deleteOutlet, getOutlets, updateOutlet, getOutletById } from './controller.js';
import { validate } from '../../middleware/validate.js';
import { outletSchema, updateOutletSchema } from './schema.js';
import { isAdmin, isAuthenticated } from '../../middleware/auth.js';

const router = express.Router();

router.get('/', isAuthenticated, getOutlets);
router.get('/:id', isAuthenticated, getOutletById);
router.post('/', isAuthenticated, isAdmin, validate(outletSchema), createOutlet);
router.put('/:id', isAuthenticated, isAdmin, validate(updateOutletSchema), updateOutlet);
router.delete('/:id', isAuthenticated, isAdmin, deleteOutlet);

export default router;
