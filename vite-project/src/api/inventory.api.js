import axiosInstance from './axios';

export const getInventoryByVendor = async (vendorId) => {
  const { data } = await axiosInstance.get(`/api/inventory/vendor/${vendorId}`);
  return data;
};

export const updateInventory = async ({ productId, ...updateData }) => {
  const { data } = await axiosInstance.patch(`/api/inventory/product/${productId}`, updateData);
  return data;
};

// Updated to support pagination
export const getInventoryLogs = async (filters = {}) => {
  // Clean filters (remove null/undefined/empty values)
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v != null && v !== "")
  );

  const params = new URLSearchParams(cleanFilters).toString();
  const { data } = await axiosInstance.get(`/api/inventory/logs?${params}`);
  return data; // Expected: { success, data: [], meta: { total, page, totalPages } }
};

export const getProductInventoryLogs = async (productId, page = 1, limit = 10) => {
  const { data } = await axiosInstance.get(
    `/api/inventory/logs?productId=${productId}&page=${page}&limit=${limit}`
  );
  return data;
};