import axiosInstance from './axios';

export const getProducts = async (filters = {}) => {
  // Filters object থেকে null/undefined/empty value ক্লিন করা
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v != null && v !== "")
  );

  const params = new URLSearchParams(cleanFilters).toString();
  const { data } = await axiosInstance.get(`/api/products?${params}`);
  return data; // Expected: { success, data: [], meta: {} }
};

export const getProductById = async (id) => {
  const { data } = await axiosInstance.get(`/api/products/${id}`);
  return data;
};

export const createProduct = async (formDataPayload) => {
  const { data } = await axiosInstance.post('/api/products', formDataPayload, {
    // হেডার সেট করার দরকার নেই, ব্রাউজার FormData দেখলে অটোমেটিক বাউন্ডারি সেট করে নেয়
    headers: { 'Content-Type': undefined } 
  });
  return data;
};
export const updateProduct = async ({ id, formDataPayload }) => {
  const { data } = await axiosInstance.put(`/api/products/${id}`, formDataPayload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await axiosInstance.delete(`/api/products/${id}`);
  return data;
};