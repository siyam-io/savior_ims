import axiosInstance from './axios';

export const loginUser = async (credentials) => {
  const { data } = await axiosInstance.post('/api/auth/login', credentials);
  return data;
};

export const registerUser = async (userData) => {
  const { data } = await axiosInstance.post('/api/auth/register', userData);
  return data;
};

export const getMe = async () => {

  const { data } = await axiosInstance.get('/api/auth/me');

  return data;

};



export const updateMe = async (userData) => {

  const { data } = await axiosInstance.put('/api/auth/me', userData);

  return data;

};
