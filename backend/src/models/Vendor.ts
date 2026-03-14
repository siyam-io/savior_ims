import { Schema, model, Document } from 'mongoose';

export interface IVendor extends Document {
  name: string;
  logo?: string;
  contactEmail: string;
  status: 'active' | 'inactive';
}

const vendorSchema = new Schema<IVendor>({
  name: { type: String, required: true, unique: true, trim: true },
  logo: { type: String },
  contactEmail: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

export const Vendor = model<IVendor>('Vendor', vendorSchema);