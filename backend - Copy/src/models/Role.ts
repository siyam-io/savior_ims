import { Schema, model, Document } from 'mongoose';

export interface IRole extends Document {
    name: string; 
    permissions: string[]; 
    isActive: boolean;
}

const roleSchema = new Schema<IRole>({
    name: { type: String, required: true, unique: true, trim: true },
    permissions: { type: [String], default: [] },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Role = model<IRole>('Role', roleSchema);