import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as CategoriesAPI from '../api/categories.api';

// --- MAIN CATEGORY HOOKS ---
export const useCategories = () => {
  return useQuery({ queryKey: ['categories'], queryFn: CategoriesAPI.getCategories });
};

export const useCategory = (id) => {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: () => CategoriesAPI.getCategoryById(id),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CategoriesAPI.createCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CategoriesAPI.updateCategory,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', variables.id] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CategoriesAPI.deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });
};


// --- SUB-CATEGORY HOOKS ---
export const useSubCategories = () => {
  return useQuery({ queryKey: ['subcategories'], queryFn: CategoriesAPI.getSubCategories });
};

export const useCreateSubCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CategoriesAPI.createSubCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subcategories'] }),
  });
};

export const useDeleteSubCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CategoriesAPI.deleteSubCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subcategories'] }),
  });
};