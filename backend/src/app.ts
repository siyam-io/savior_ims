import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/routes.js';
import userRoutes from './modules/user/routes.js';
import outletRoutes from './modules/outlet/routes.js';
import categoryRoutes from './modules/category/routes.js';
import productRoutes from './modules/product/routes.js';
import orderRoutes from './modules/order/routes.js';
import courierRoutes from './modules/courier/routes.js';
import uploadRoutes from './modules/upload/routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/outlets', outletRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/couriers', courierRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
