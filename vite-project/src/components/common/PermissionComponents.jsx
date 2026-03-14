import { usePermissions } from '../../hooks/usePermissions';

// Higher Order Component for permission protection
export const withPermission = (WrappedComponent, requiredPermission) => {
  return function WithPermissionComponent(props) {
    const { hasPermission } = usePermissions();
    
    if (!hasPermission(requiredPermission)) {
      return null;
    }
    
    return <WrappedComponent {...props} />;
  };
};

// Component for conditional rendering
export const Can = ({ children, permission, fallback = null }) => {
  const { hasPermission } = usePermissions();
  
  if (hasPermission(permission)) {
    return children;
  }
  
  return fallback;
};