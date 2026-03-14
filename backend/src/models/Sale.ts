import { Schema, model, Document, Types } from 'mongoose';

export interface ISaleItem {
  product: Types.ObjectId;
  size: Types.ObjectId;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

export interface ISale extends Document {
  vendor: Types.ObjectId;        // কোন ভেন্ডরের প্রোডাক্ট সেল হলো
  items: ISaleItem[];            // কি কি সেল হলো
  totalAmount: number;           // সর্বমোট টাকা
  soldBy: Types.ObjectId;        // কে সেল করলো (User ID)
  customerName?: string;
  customerPhone?: string;
  paymentMethod: 'cash' | 'card' | 'mfs';
  status: 'completed' | 'refunded';
}

const saleSchema = new Schema<ISale>({
  vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    size: { type: Schema.Types.ObjectId, ref: 'Size', required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    subTotal: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  soldBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }, //
  customerName: { type: String },
  customerPhone: { type: String },
  paymentMethod: { type: String, enum: ['cash', 'card', 'mfs'], default: 'cash' },
  status: { type: String, enum: ['completed', 'refunded'], default: 'completed' }
}, { timestamps: true });

export const Sale = model<ISale>('Sale', saleSchema);