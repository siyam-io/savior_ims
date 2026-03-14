import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query'; // v5 এর জন্য এটি ইম্পোর্ট করতে হবে
import * as ProductsAPI from '../api/products.api';

export const useProducts = (filters) => {
  return useQuery({
    // filters অবজেক্টের প্রতিটি কী চেঞ্জ হলে কোয়েরি রি-রান হবে
    queryKey: ['products', filters], 
    
    // এপিআই ফাইলে ফাংশনের নাম getProducts, তাই এখানেও সেটিই হবে
    queryFn: () => ProductsAPI.getProducts(filters), 
    
    // React Query v5 syntax:
    placeholderData: keepPreviousData, 
    
    // নেটওয়ার্ক এরর হলে ৩ বার রিট্রাই করবে
    retry: 1,
    staleTime: 5000, 
  });
};

// ... বাকি হুকগুলো ঠিক আছে

export const useProduct = (id) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => ProductsAPI.getProductById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ProductsAPI.createProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ProductsAPI.updateProduct,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ProductsAPI.deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
};