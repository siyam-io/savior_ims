import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Outlet } from '@/types';

export const useOutlets = () => {
  return useQuery<Outlet[]>({
    queryKey: ['outlets'],
    queryFn: async () => {
      const { data } = await api.get('/outlets');
      return data;
    },
  });
};

export const useOutlet = (id: string) => {
  return useQuery<Outlet>({
    queryKey: ['outlet', id],
    queryFn: async () => {
      const { data } = await api.get(`/outlets/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateOutlet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string }) => {
      const { data: response } = await api.post('/outlets', data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outlets'] });
    },
  });
};

export const useUpdateOutlet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; name: string }) => {
      const { data: response } = await api.put(`/outlets/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outlets'] });
      queryClient.invalidateQueries({ queryKey: ['outlet'] });
    },
  });
};

export const useDeleteOutlet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/outlets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outlets'] });
    },
  });
};
