import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as VendorsAPI from '../api/vendors.api';

export const useVendors = () => {
  return useQuery({ queryKey: ['vendors'], queryFn: VendorsAPI.getVendors });
};

export const useVendor = (id) => {
  return useQuery({
    queryKey: ['vendors', id],
    queryFn: () => VendorsAPI.getVendorById(id),
    enabled: !!id,
  });
};

export const useCreateVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: VendorsAPI.createVendor,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vendors'] }),
  });
};

export const useUpdateVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: VendorsAPI.updateVendor,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      queryClient.invalidateQueries({ queryKey: ['vendors', variables.id] });
    },
  });
};

export const useDeleteVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: VendorsAPI.deleteVendor,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vendors'] }),
  });
};