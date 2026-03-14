// src/models/User.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: Types.ObjectId; 
  vendors: Types.ObjectId[]; // পরিবর্তন: সিঙ্গল থেকে অ্যারে
  status: 'active' | 'inactive';
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
  vendors: [{ type: Schema.Types.ObjectId, ref: 'Vendor' }], // অ্যারে ডিফাইন করা হলো
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

export const User = model<IUser>('User', userSchema);