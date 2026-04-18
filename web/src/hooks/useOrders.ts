import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Order, PlaceOrderInput } from '@/types';

export const useEmployeeOrders = () => {
  return useQuery<Order[]>({
    queryKey: ['employee-orders'],
    queryFn: async () => {
      const { data } = await api.get('/orders/my-orders');
      return data;
    },
  });
};

export const useAllOrders = () => {
  return useQuery<Order[]>({
    queryKey: ['all-orders'],
    queryFn: async () => {
      const { data } = await api.get('/orders/all');
      return data;
    },
  });
};
export const useFilteredOrders = (filters: any) => {
  return useQuery({
    queryKey: ['filtered-orders', filters],
    queryFn: async () => {
      const { data } = await api.get('/orders/filtered', { params: filters });
      return data;
    },
  });
};


export const useOrder = (id: string) => {
  return useQuery<Order>({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data } = await api.get(`/orders/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const usePlaceOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderData: PlaceOrderInput) => {
      const { data } = await api.post('/orders', orderData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['employee-orders'] });
      queryClient.invalidateQueries({ queryKey: ['all-orders'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/orders/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-orders'] });
      queryClient.invalidateQueries({ queryKey: ['employee-orders'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
};
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; [key: string]: any }) => {
      const { data: res } = await api.put(`/orders/${id}`, data);
      return res;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['all-orders'] });
      queryClient.invalidateQueries({ queryKey: ['employee-orders'] });
    },
  });
};
export const useUpdateOrderItems = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; items: any[]; [key: string]: any }) => {
      const { data: res } = await api.put(`/orders/${id}/items`, data);
      return res;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['all-orders'] });
      queryClient.invalidateQueries({ queryKey: ['employee-orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.patch(`/orders/${id}/status`, { status });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['all-orders'] });
      queryClient.invalidateQueries({ queryKey: ['employee-orders'] });
    },
  });
};
