import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const AuthGuard = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // State pass করে দিলে লগইন করার পর ইউজার যে পেজে যেতে চেয়েছিল সেখানে ফেরত পাঠানো যায়
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default AuthGuard;