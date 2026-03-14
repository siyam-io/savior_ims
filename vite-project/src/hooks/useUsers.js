import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import * as UsersAPI from '../api/users.api';

export const useUsers = (filters) => {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => UsersAPI.getUsers(filters),
    placeholderData: keepPreviousData,
  });
};

export const useUser = (id) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => UsersAPI.getUserById(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UsersAPI.createUser, // registerUser এর বদলে createUser
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UsersAPI.updateUser,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UsersAPI.deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};