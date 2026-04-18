import mongoose, { Schema } from 'mongoose';
import type { ICategory } from '../../types/index.js';

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  subcategories: [{ type: String, required: true }],
  sizes: [{ type: String, required: true }]
}, { timestamps: true });

categorySchema.index({ name: 1 }, { 
  unique: true, 
  collation: { locale: 'en', strength: 2 } 
});

export default mongoose.model<ICategory>('Category', categorySchema);
