import mongoose, { Schema } from 'mongoose';
import { Document } from 'mongoose';

export interface ICourier extends Document {
  name: string;
  charge: number;
  createdAt: Date;
}

const courierSchema = new Schema<ICourier>({
  name: { type: String, required: true, unique: true },
  charge: { type: Number, required: true, min: 0 },
}, { timestamps: true });

export default mongoose.model<ICourier>('Courier', courierSchema);
