import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export interface Employee {
  _id: string;
  email: string;
  role: 'admin' | 'employee';
  createdAt: string;
}

export interface CreateEmployeeInput {
  email: string;
  password: string;
  role?: 'admin' | 'employee';
}

export interface UpdateEmployeeInput {
  id: string;
  email?: string;
  role?: 'admin' | 'employee';
}

export const useEmployees = () => {
  return useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data } = await api.get('/users');
      return data;
    },
  });
};

export const useEmployee = (id: string) => {
  return useQuery<Employee>({
    queryKey: ['employees', id],
    queryFn: async () => {
      const { data } = await api.get(`/users/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateEmployeeInput) => {
      const { data } = await api.post('/users', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateEmployeeInput) => {
      const { data } = await api.put(`/users/${id}`, input);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employees', variables.id] });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};
