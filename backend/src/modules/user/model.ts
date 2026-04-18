import mongoose, { Schema } from 'mongoose';
import type { IUser } from '../../types/index.js';

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' }
}, { timestamps: true });

export default mongoose.model<IUser>('User', userSchema);
