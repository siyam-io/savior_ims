import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as SalesAPI from '../api/sales.api';

/**
 * সেলস হিস্টোরি পাওয়ার হুক
 */
export const useSales = (filters = {}) => {
  return useQuery({
    queryKey: ['sales', filters],
    queryFn: () => SalesAPI.getSales(filters),
  });
};

/**
 * নতুন সেল এক্সিকিউট করার হুক
 */
export const useCreateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: SalesAPI.createSale,
    onSuccess: () => {
      // ১. সেল সফল হলে সেলস হিস্টোরি ইনভ্যালিডেট করো
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      
      // ২. যেহেতু সেল হলে স্টক কমে যায়, তাই প্রোডাক্ট এবং ইনভেন্টরি ডাটাও রিফ্রেশ করতে হবে
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
    onError: (error) => {
      console.error("Sale Error:", error.response?.data?.message || error.message);
    }
  });
};