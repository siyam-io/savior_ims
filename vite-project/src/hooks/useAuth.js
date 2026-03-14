import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as AuthAPI from '../api/auth.api';
import useAuthStore from '../store/authStore';

// We'll use this inside an AuthGuard component to check session on reload
export const useVerifySession = () => {
  const { setUser, setUnauthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const data = await AuthAPI.getMe();
        setUser(data.data); // Update Zustand with fresh user data
        return data;
      } catch (error) {
        setUnauthenticated();
        throw error;
      }
    },
    retry: false, // Don't retry if it fails, just log them out
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};


export const useUser = () => {
  return useQuery({
    queryKey: ['authUser'],
    queryFn: AuthAPI.getMe,
    retry: false,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AuthAPI.loginUser,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: AuthAPI.registerUser,
  });
};