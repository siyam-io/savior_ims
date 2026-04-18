import mongoose, { Schema } from 'mongoose';
import type { IOutlet } from '../../types/index.js';

const outletSchema = new Schema<IOutlet>({
  name: { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model<IOutlet>('Outlet', outletSchema);
