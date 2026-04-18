import express from 'express';
import { 
  getAllOrders, getEmployeeOrders, getSalesAnalytics, placeOrder, 
  getOrderById, deleteOrder, updateOrder, updateOrderItems, 
  updateDeliveryStatus, syncOrdersToPathao, exportOrdersToPathaoCSV, getFilteredOrders 
} from './controller.js';
import { validate } from '../../middleware/validate.js';
import { placeOrderSchema } from './schema.js';
import { isAdmin, isAuthenticated, isEmployee } from '../../middleware/auth.js';

const router = express.Router();

router.post('/', isAuthenticated, isEmployee, validate(placeOrderSchema), placeOrder);
router.get('/my-orders', isAuthenticated, isEmployee, getEmployeeOrders);
router.get('/all', isAuthenticated, isAdmin, getAllOrders);
router.get('/filtered', isAuthenticated, getFilteredOrders);
router.get('/analytics', isAuthenticated, isAdmin, getSalesAnalytics);
router.get('/export-csv', isAuthenticated, isAdmin, exportOrdersToPathaoCSV);
router.get('/:id', isAuthenticated, getOrderById);
router.put('/:id', isAuthenticated, isAdmin, updateOrder);
router.put('/:id/items', isAuthenticated, isAdmin, updateOrderItems);
router.patch('/:id/delivery-status', isAuthenticated, isAdmin, updateDeliveryStatus);
router.delete('/:id', isAuthenticated, isAdmin, deleteOrder);
router.post('/sync-to-pathao', isAuthenticated, isAdmin, syncOrdersToPathao);

export default router;
