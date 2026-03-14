import axiosInstance from './axios';

export const getSizes = async () => {
  const { data } = await axiosInstance.get('/api/sizes');
  return data;
};

export const getSizeById = async (id) => {
  const { data } = await axiosInstance.get(`/api/sizes/${id}`);
  return data;
};

export const getSizesByCategory = async (categoryId) => {
  const { data } = await axiosInstance.get(`/api/sizes/category/${categoryId}`);
  return data;
};

export const createSize = async (sizeData) => {
  const { data } = await axiosInstance.post('/api/sizes', sizeData);
  return data;
};

export const updateSize = async ({ id, ...sizeData }) => {
  const { data } = await axiosInstance.put(`/api/sizes/${id}`, sizeData);
  return data;
};

export const deleteSize = async (id) => {
  const { data } = await axiosInstance.delete(`/api/sizes/${id}`);
  return data;
};