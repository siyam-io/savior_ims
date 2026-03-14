import { Navigate, Outlet } from 'react-router-dom';
import { useVerifySession } from '../../hooks/useAuth';
import useAuthStore from '../../store/authStore';

const AuthGuard = () => {
  const { isInitialized, isAuthenticated } = useAuthStore();
  
  // This hook fires automatically on load to fetch /api/auth/me
  const { isLoading } = useVerifySession(); 

  // Show a full-screen loader while checking the token
  if (!isInitialized || isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Kick out unauthenticated users
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Allow them into the AdminLayout
  return <Outlet />;
};

export default AuthGuard;