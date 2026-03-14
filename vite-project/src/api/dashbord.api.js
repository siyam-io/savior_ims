import axiosInstance from './axios';

export const getDashboardStats = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const { data } = await axiosInstance.get(`/api/dashboard/stats?${params}`);
  return data;
};

export const getBestSelling = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const { data } = await axiosInstance.get(`/api/dashboard/best-selling?${params}`);
  return data;
};

export const getWorstSelling = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const { data } = await axiosInstance.get(`/api/dashboard/worst-selling?${params}`);
  return data;
};

export const getStockAnalysis = async (type, filters = {}) => {
  const params = new URLSearchParams({ type, ...filters }).toString();
  const { data } = await axiosInstance.get(`/api/dashboard/stock-analysis?${params}`);
  return data;
};

export const getSalesTrend = async (period = 'week') => {
  const { data } = await axiosInstance.get(`/api/dashboard/sales-trend?period=${period}`);
  return data;
};

export const getCategoryDistribution = async () => {
  const { data } = await axiosInstance.get('/api/dashboard/category-distribution');
  return data;
};
