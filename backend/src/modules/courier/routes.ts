import express from 'express';
import { createCourier, getCouriers, getCourierById, updateCourier, deleteCourier } from './controller.js';
import { validate } from '../../middleware/validate.js';
import { courierSchema, updateCourierSchema } from './schema.js';
import { isAdmin, isAuthenticated } from '../../middleware/auth.js';

const router = express.Router();

router.get('/', isAuthenticated, getCouriers);
router.get('/:id', isAuthenticated, getCourierById);
router.post('/', isAuthenticated, isAdmin, validate(courierSchema), createCourier);
router.put('/:id', isAuthenticated, isAdmin, validate(updateCourierSchema), updateCourier);
router.delete('/:id', isAuthenticated, isAdmin, deleteCourier);

export default router;
