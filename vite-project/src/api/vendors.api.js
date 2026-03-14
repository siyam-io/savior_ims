import axiosInstance from './axios';

export const getVendors = async () => {
  const { data } = await axiosInstance.get('/api/vendors');
  return data;
};

export const getVendorById = async (id) => {
  const { data } = await axiosInstance.get(`/api/vendors/${id}`);
  return data;
};

export const createVendor = async (vendorData) => {
  const { data } = await axiosInstance.post('/api/vendors', vendorData);
  return data;
};

export const updateVendor = async ({ id, ...vendorData }) => {
  const { data } = await axiosInstance.put(`/api/vendors/${id}`, vendorData);
  return data;
};

export const deleteVendor = async (id) => {
  const { data } = await axiosInstance.delete(`/api/vendors/${id}`);
  return data;
};