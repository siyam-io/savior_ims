import { Schema, model, Document } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    slug: string;
}

const categorySchema = new Schema<ICategory>({
    name: { type: String, required: true, uppercase: true, unique: true },
    slug: { type: String, unique: true }
}, { timestamps: true });

export const Category = model<ICategory>('Category', categorySchema);

export interface ISubCategory extends Document {
    name: string;
    parentCategory: Schema.Types.ObjectId;
}

const subCategorySchema = new Schema<ISubCategory>({
    name: { type: String, required: true },
    parentCategory: { type: Schema.Types.ObjectId, ref: 'Category', required: true }
}, { timestamps: true });

export const SubCategory = model<ISubCategory>('SubCategory', subCategorySchema);