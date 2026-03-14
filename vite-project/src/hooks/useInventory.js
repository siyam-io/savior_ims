import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import * as InventoryAPI from '../api/inventory.api';

export const useVendorInventory = (vendorId) => {
  return useQuery({
    queryKey: ['inventory', vendorId],
    queryFn: () => InventoryAPI.getInventoryByVendor(vendorId),
    enabled: !!vendorId,
  });
};

export const useCreateInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: InventoryAPI.createInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};

export const useUpdateInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: InventoryAPI.updateInventory,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-logs'] });
    },
  });
};


// Updated hook for inventory logs with pagination
export const useInventoryLogs = (filters = {}, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['inventory-logs', filters, page, limit],
    queryFn: () => InventoryAPI.getInventoryLogs({ ...filters, page, limit }),
    placeholderData: keepPreviousData,
  });
};


// Updated hook for product-specific inventory logs with pagination
export const useProductInventoryLogs = (productId, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['inventory-logs', 'product', productId, page, limit],
    queryFn: () => InventoryAPI.getProductInventoryLogs(productId, page, limit),
    enabled: !!productId,
    placeholderData: keepPreviousData,
  });
};