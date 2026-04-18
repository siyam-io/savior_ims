import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { SalesAnalytics } from '@/types';

export const useSalesAnalytics = (startDate?: string, endDate?: string) => {
  return useQuery<SalesAnalytics[]>({
    queryKey: ['analytics', startDate, endDate],
    queryFn: async () => {
      const { data } = await api.get('/orders/analytics', { params: { startDate, endDate } });
      return data;
    },
  });
};
