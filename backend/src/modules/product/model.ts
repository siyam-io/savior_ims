import mongoose, { Schema } from 'mongoose';
import type { IProduct } from '../../types/index.js';

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true, index: true },
  price: { type: Number, required: true, index: true },
  description: { type: String, default: '' },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  subcategory: { type: String, required: true, index: true },
  activatedSizes: [{ type: String, required: true }],
  visuals: [{ type: String }],
  stock: [{ size: { type: String, required: true }, quantity: { type: Number, default: 0 } }]
}, { timestamps: true });

// Compound index for category-subcategory filtering
productSchema.index({ categoryId: 1, subcategory: 1 });

export default mongoose.model<IProduct>('Product', productSchema);
