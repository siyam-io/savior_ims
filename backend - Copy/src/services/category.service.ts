import { Category, ICategory, SubCategory, ISubCategory } from "../models/Category";

// --- MAIN CATEGORY SERVICES ---
export const createCategory = async (data: Partial<ICategory>) => {
  // If no slug is provided by the frontend, auto-generate it securely
  if (!data.slug && data.name) {
    data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  return await Category.create(data);
};

export const getAllCategories = async () => {
  return await Category.find().sort({ name: 1 });
};

export const getCategoryById = async (id: string) => {
  return await Category.findById(id);
};

export const updateCategory = async (id: string, data: Partial<ICategory>) => {
  if (data.name && !data.slug) {
    data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  return await Category.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCategory = async (id: string) => {
  return await Category.findByIdAndDelete(id);
};

// --- SUB-CATEGORY SERVICES ---
export const createSubCategory = async (data: Partial<ISubCategory>) => {
  return await SubCategory.create(data);
};

export const getAllSubCategories = async () => {
  return await SubCategory.find().populate('parentCategory', 'name').sort({ name: 1 });
};

export const getSubCategoryById = async (id: string) => {
  return await SubCategory.findById(id).populate('parentCategory', 'name');
};

export const deleteSubCategory = async (id: string) => {
  return await SubCategory.findByIdAndDelete(id);
};