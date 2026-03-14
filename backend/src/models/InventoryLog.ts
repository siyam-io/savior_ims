import mongoose, { Schema, Document } from 'mongoose';

export interface IInventoryLog extends Document {
  product: mongoose.Types.ObjectId;
  size: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  type: 'in' | 'out';
  quantity: number;
  previousStock: number;
  newStock: number;
  note?: string;
  createdAt: Date;
}

const inventoryLogSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  size: { type: Schema.Types.ObjectId, ref: 'Size', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['in', 'out'], required: true },
  quantity: { type: Number, required: true },
  previousStock: { type: Number, required: true },
  newStock: { type: Number, required: true },
  note: String
}, { timestamps: true });

export const InventoryLog = mongoose.model<IInventoryLog>('InventoryLog', inventoryLogSchema);