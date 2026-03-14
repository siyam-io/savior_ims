import axiosInstance from './axios';

/**
 * নতুন সেল তৈরি করা
 * @param {Object} saleData - { vendor, items: [...], totalAmount, paymentMethod, customerName, customerPhone }
 */
export const createSale = async (saleData) => {
  const { data } = await axiosInstance.post('/api/sales', saleData);
  return data;
};

/**
 * সেলস হিস্টোরি ফেচ করা
 * @param {Object} filters - সার্চ বা ফিল্টারিং প্যারামিটার
 */
export const getSales = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const { data } = await axiosInstance.get(`/api/sales?${params}`);
  return data; // Expected: { success: true, data: [...] }
};