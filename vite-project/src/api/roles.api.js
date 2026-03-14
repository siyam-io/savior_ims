// api/roles.api.js
import axiosInstance from './axios';

export const getRoles = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const { data } = await axiosInstance.get(`/api/roles?${params}`);
  return data;
};

// ... getRoleById, createRole, updateRole, deleteRole same as before

export const getRoleById = async (id) => {
  const { data } = await axiosInstance.get(`/api/roles/${id}`);
  return data;
};

export const createRole = async (roleData) => {
  const { data } = await axiosInstance.post('/api/roles', roleData);
  return data;
};

export const updateRole = async ({ id, ...roleData }) => {
  const { data } = await axiosInstance.put(`/api/roles/${id}`, roleData);
  return data;
};

export const deleteRole = async (id) => {
  const { data } = await axiosInstance.delete(`/api/roles/${id}`);
  return data;
};