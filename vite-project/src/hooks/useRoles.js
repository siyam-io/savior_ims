import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import * as RolesAPI from '../api/roles.api';

export const useRoles = (filters) => {
  return useQuery({
    queryKey: ['roles', filters],
    queryFn: () => RolesAPI.getRoles(filters),
    placeholderData: keepPreviousData,
  });
};

export const useRole = (id) => {
  return useQuery({
    queryKey: ['roles', id],
    queryFn: () => RolesAPI.getRoleById(id),
    enabled: !!id,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: RolesAPI.createRole,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: RolesAPI.updateRole,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['roles', variables.id] });
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: RolesAPI.deleteRole,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
  });
};