import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Product, CreateProductInput, UpdateProductInput } from '@/types';

// Existing filter hook
interface ProductFilters {
  categoryId?: string;
  subcategory?: string;
  size?: string;
}

export const useProducts = (filters: ProductFilters) => {
  return useQuery<Product[]>({
    queryKey: ['products', filters],
    queryFn: async () => {
      const { data } = await api.get('/products', { params: filters });
      return data;
    },
    enabled: true,
  });
};
export const useFilteredProducts = (filters: any) => {
  return useQuery({
    queryKey: ['filtered-products', filters],
    queryFn: async () => {
      const { data } = await api.get('/products/filtered', { params: filters });
      return data;
    },
  });
};


// Single product (for edit form)
export const useProduct = (id: string) => {
  return useQuery<Product>({
    queryKey: ['products', id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// Create product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateProductInput) => {
      const { data } = await api.post('/products', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Update product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateProductInput) => {
      const { data } = await api.put(`/products/${id}`, input);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
    },
  });
};

// Delete product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
