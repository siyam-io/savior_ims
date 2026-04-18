import express from 'express';
import { createEmployee, deleteEmployee, getEmployees, updateEmployee, getEmployeeById, updateProfile } from './controller.js';
import { validate } from '../../middleware/validate.js';
import { createEmployeeSchema, updateEmployeeSchema } from './schema.js';
import { isAdmin, isAuthenticated } from '../../middleware/auth.js';

const router = express.Router();

router.use(isAuthenticated);

// Profile (accessible to all authenticated users)
router.put('/profile', updateProfile);

// Management (Admin only)
router.use(isAdmin);
router.post('/', validate(createEmployeeSchema), createEmployee);
router.get('/', getEmployees);
router.get('/:id', getEmployeeById);
router.put('/:id', validate(updateEmployeeSchema), updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;
