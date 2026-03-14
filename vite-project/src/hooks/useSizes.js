import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as SizesAPI from '../api/sizes.api';

export const useSizes = () => {
  return useQuery({ queryKey: ['sizes'], queryFn: SizesAPI.getSizes });
};

export const useSize = (id) => {
  return useQuery({
    queryKey: ['sizes', id],
    queryFn: () => SizesAPI.getSizeById(id),
    enabled: !!id,
  });
};

export const useSizesByCategory = (categoryId) => {
  return useQuery({
    queryKey: ['sizes', 'category', categoryId],
    queryFn: () => SizesAPI.getSizesByCategory(categoryId),
    enabled: !!categoryId,
  });
};

export const useCreateSize = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: SizesAPI.createSize,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sizes'] }),
  });
};

export const useUpdateSize = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: SizesAPI.updateSize,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sizes'] });
      queryClient.invalidateQueries({ queryKey: ['sizes', variables.id] });
    },
  });
};

export const useDeleteSize = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: SizesAPI.deleteSize,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sizes'] }),
  });
};