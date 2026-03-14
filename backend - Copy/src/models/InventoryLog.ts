import { Schema, model, Document, Types } from 'mongoose';

export interface IInventoryLog extends Document {
  product: Types.ObjectId;
  size: Types.ObjectId;
  user: Types.ObjectId;
  type: 'in' | 'out'; // ইন নাকি আউট
  quantity: number;   // কতটুকু চেঞ্জ হলো
  previousStock: number; // আগের স্টক কত ছিল
  newStock: number;      // চেঞ্জ হওয়ার পর কত হলো
  note?: string;         // ঐচ্ছিক নোট
}

const inventoryLogSchema = new Schema<IInventoryLog>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  size: { type: Schema.Types.ObjectId, ref: 'Size', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['in', 'out'], required: true },
  quantity: { type: Number, required: true },
  previousStock: { type: Number, required: true },
  newStock: { type: Number, required: true },
  note: { type: String }
}, { timestamps: true });

export const InventoryLog = model<IInventoryLog>('InventoryLog', inventoryLogSchema);