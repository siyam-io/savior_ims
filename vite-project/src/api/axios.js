import axios from 'axios';
import useAuthStore from '../store/authStore'; 

const axiosInstance = axios.create({
  baseURL:  'http://localhost:5022',
  withCredentials: true, // THIS IS CRITICAL. It tells Axios to send/receive cookies.
});

// We no longer need a request interceptor to attach tokens. The browser does it.

// RESPONSE INTERCEPTOR: Handle expired cookies gracefully
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().setUnauthenticated(); 
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;