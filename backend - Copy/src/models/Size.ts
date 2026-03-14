import { Schema, model, Document, Types } from 'mongoose';

export interface ISize extends Document {
  label: string; 
  category?: Types.ObjectId; // Optional করে দেওয়া হলো
}

const sizeSchema = new Schema<ISize>({
  label: { type: String, required: true, trim: true },
  // এখানে required: true সরিয়ে ফেলা হয়েছে জাতে ইউনিভার্সাল সাইজ হিসেবে সেভ হতে পারে
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: false } 
}, { timestamps: true });

export const Size = model<ISize>('Size', sizeSchema);