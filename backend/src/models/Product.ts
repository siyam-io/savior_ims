import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  productName: string;
  vendor: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  subCategory?: mongoose.Types.ObjectId;
  fabric?: string;
  price: number;
  image?: string;
  inventory: Array<{
    size: mongoose.Types.ObjectId;
    quantity: number;
  }>;
  lastUpdatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema({
  productName: { type: String, required: true },
  vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  subCategory: { type: Schema.Types.ObjectId, ref: 'SubCategory' },
  fabric: String,
  price: { type: Number, required: true },
  image: String,
  inventory: [{
    size: { type: Schema.Types.ObjectId, ref: 'Size', required: true },
    quantity: { type: Number, default: 0 }
  }],
  lastUpdatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export const Product = mongoose.model<IProduct>('Product', productSchema);