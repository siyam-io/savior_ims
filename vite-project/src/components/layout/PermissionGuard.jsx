import { Navigate, Outlet } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { useUser } from '../../hooks/useAuth';

const PermissionGuard = ({ requiredPermission, fallbackPath = '/' }) => {
  const { hasPermission } = usePermissions();
  const { data: userResponse, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg-primary">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!hasPermission(requiredPermission)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <Outlet />;
};

export default PermissionGuard;