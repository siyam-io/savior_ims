import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Category } from '@/types';

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data;
    },
  });
};

export const useCategory = (id: string) => {
  return useQuery<Category>({
    queryKey: ['category', id],
    queryFn: async () => {
      const { data } = await api.get(`/categories/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

interface CategoryInput {
  name: string;
  subcategories: string[];
  sizes: string[];
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (categoryData: CategoryInput) => {
      const { data } = await api.post('/categories', categoryData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...categoryData }: CategoryInput & { id: string }) => {
      const { data } = await api.put(`/categories/${id}`, categoryData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category'] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};
