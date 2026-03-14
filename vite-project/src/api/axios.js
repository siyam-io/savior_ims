import axios from 'axios';
import useAuthStore from '../store/authStore'; 

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5022',
  withCredentials: true, // THIS IS CRITICAL for HttpOnly cookies
});

// RESPONSE INTERCEPTOR: Handle expired cookies gracefully
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 and it's NOT a login request itself
    if (error.response?.status === 401 && !originalRequest.url.includes('/auth/login')) {
      const authStore = useAuthStore.getState();
      
      // Only trigger logout if the user was previously authenticated
      if (authStore.isAuthenticated) {
        authStore.setUnauthenticated(); 
        
        // Use window.location only if we are not already on the login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?expired=true'; // Add a query param for UI feedback if needed
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;