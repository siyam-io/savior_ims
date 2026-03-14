import { Schema, model, Document, Types } from 'mongoose';

export interface ISize extends Document {
  label: string; 
}

const sizeSchema = new Schema<ISize>({
  label: { type: String, required: true, trim: true },
  // এখানে required: true সরিয়ে ফেলা হয়েছে জাতে ইউনিভার্সাল সাইজ হিসেবে সেভ হতে পারে
}, { timestamps: true });

export const Size = model<ISize>('Size', sizeSchema);