import axiosInstance from './axios';

export const getUsers = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const { data } = await axiosInstance.get(`/api/users?${params}`);
  return data;
};

export const getUserById = async (id) => {
  const { data } = await axiosInstance.get(`/api/users/${id}`);
  return data;
};

// নতুন ইউজার তৈরির মেথড (Admin Only)
export const createUser = async (userData) => {
  const { data } = await axiosInstance.post('/api/users', userData);
  return data;
};

export const updateUser = async ({ id, ...userData }) => {
  const { data } = await axiosInstance.put(`/api/users/${id}`, userData);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await axiosInstance.delete(`/api/users/${id}`);
  return data;
};