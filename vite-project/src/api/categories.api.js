import axiosInstance from './axios';

// --- MAIN CATEGORIES ---
export const getCategories = async () => {
  const { data } = await axiosInstance.get('/api/categories');
  return data;
};

export const getCategoryById = async (id) => {
  const { data } = await axiosInstance.get(`/api/categories/${id}`);
  return data;
};

export const createCategory = async (categoryData) => {
  const { data } = await axiosInstance.post('/api/categories', categoryData);
  return data;
};

export const updateCategory = async ({ id, ...categoryData }) => {
  const { data } = await axiosInstance.put(`/api/categories/${id}`, categoryData);
  return data;
};

export const deleteCategory = async (id) => {
  const { data } = await axiosInstance.delete(`/api/categories/${id}`);
  return data;
};

// --- SUB-CATEGORIES ---
export const getSubCategories = async () => {
  const { data } = await axiosInstance.get('/api/categories/sub');
  return data;
};

export const createSubCategory = async (subCategoryData) => {
  const { data } = await axiosInstance.post('/api/categories/sub', subCategoryData);
  return data;
};

export const deleteSubCategory = async (id) => {
  const { data } = await axiosInstance.delete(`/api/categories/sub/${id}`);
  return data;
};