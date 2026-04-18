import type { Request } from 'express';
import { Document, Types } from 'mongoose';

export interface IOutlet extends Document {
  name: string;
}

export interface ICategory extends Document {
  name: string;
  subcategories: string[];
  sizes: string[];
}

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  profileImage: string;
  role: 'admin' | 'employee';
}

export interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  categoryId: Types.ObjectId;
  subcategory: string;
  activatedSizes: string[];
  visuals: string[];
  stock: { size: string; quantity: number }[];
}

export interface IOrderItem {
  productId: Types.ObjectId;
  size: string;
  quantity: number;
  unitPrice: number;
}

export interface IOrder extends Document {
  employeeId: Types.ObjectId;
  outletId: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  orderNote?: string;
  riderNote?: string;
  discount: number;
  courierId?: Types.ObjectId;
  verificationCall: boolean;
  deliveryStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'returned' | 'cancelled';
  deliveredAt?: Date;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
}

export interface AuthRequest<P = any, ResBody = any, ReqBody = any, ReqQuery = any> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: {
    id: string;
    role: string;
  };
}
