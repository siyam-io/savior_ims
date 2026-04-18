import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export interface Courier {
  _id: string;
  name: string;
  charge: number;
}

export const useCouriers = () => useQuery<Courier[]>({
  queryKey: ['couriers'],
  queryFn: async () => {
    const { data } = await api.get('/couriers');
    return data;
  }
});

export const useCreateCourier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (courier: { name: string; charge: number }) => {
      const { data } = await api.post('/couriers', courier);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['couriers'] })
  });
};

export const useUpdateCourier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; name: string; charge: number }) => {
      const { data: res } = await api.put(`/couriers/${id}`, data);
      return res;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['couriers'] })
  });
};

export const useDeleteCourier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/couriers/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['couriers'] })
  });
};
