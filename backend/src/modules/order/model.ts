import mongoose, { Schema } from 'mongoose';
import type { IOrder } from '../../types/index.js';

const orderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true }
});

const orderSchema = new Schema<IOrder>({
  employeeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  outletId: { type: Schema.Types.ObjectId, ref: 'Outlet', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, required: true },
  orderNote: { type: String },
  riderNote: { type: String },
  discount: { type: Number, default: 0 },
  courierId: { type: Schema.Types.ObjectId, ref: 'Courier' },
  verificationCall: { type: Boolean, default: false },
  deliveryStatus: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'returned', 'cancelled'], 
    default: 'pending' 
  },
  deliveredAt: { type: Date },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', orderSchema);
