import { useQuery } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import * as DashboardAPI from '../api/dashbord.api';

export const useDashboardStats = (filters = {}) => {
  return useQuery({
    queryKey: ['dashboard', 'stats', filters],
    queryFn: () => DashboardAPI.getDashboardStats(filters),
    placeholderData: keepPreviousData,
    refetchInterval: 300000,
  });
};

export const useBestSelling = (filters = {}, limit = 10) => {
  return useQuery({
    queryKey: ['dashboard', 'best-selling', filters, limit],
    queryFn: () => DashboardAPI.getBestSelling({ ...filters, limit }),
    placeholderData: keepPreviousData,
  });
};

export const useWorstSelling = (filters = {}, limit = 10) => {
  return useQuery({
    queryKey: ['dashboard', 'worst-selling', filters, limit],
    queryFn: () => DashboardAPI.getWorstSelling({ ...filters, limit }),
    placeholderData: keepPreviousData,
  });
};

export const useStockAnalysis = (type, filters = {}) => {
  return useQuery({
    queryKey: ['dashboard', 'stock-analysis', type, filters],
    queryFn: () => DashboardAPI.getStockAnalysis(type, filters),
    placeholderData: keepPreviousData,
    enabled: !!type,
  });
};

export const useSalesTrend = (period = 'week') => {
  return useQuery({
    queryKey: ['dashboard', 'sales-trend', period],
    queryFn: () => DashboardAPI.getSalesTrend(period),
    placeholderData: keepPreviousData,
  });
};

export const useCategoryDistribution = () => {
  return useQuery({
    queryKey: ['dashboard', 'category-distribution'],
    queryFn: () => DashboardAPI.getCategoryDistribution(),
    placeholderData: keepPreviousData,
  });
};
