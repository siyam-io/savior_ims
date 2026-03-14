import { useUser } from './useAuth';
import { useMemo } from 'react';

export const usePermissions = () => {
  const { data: userResponse } = useUser();
  const user = userResponse?.data;

  const permissions = useMemo(() => {
    if (!user?.role?.permissions) return [];
    return user.role.permissions;
  }, [user]);

  const hasPermission = (permission) => {
    // 🔥 Wildcard Check for Super Admin (এটিই আপনাকে রাউটে ঢুকতে দিচ্ছিল না)
    if (permissions.includes("*")) return true;
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissionList) => {
    if (permissions.includes("*")) return true;
    return permissionList.some(permission => permissions.includes(permission));
  };

  const hasAllPermissions = (permissionList) => {
    if (permissions.includes("*")) return true;
    return permissionList.every(permission => permissions.includes(permission));
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    userRole: user?.role?.name,
    isAdmin: user?.role?.name === 'super-admin', // admin এর বদলে super-admin
    user // Header এ দেখানোর জন্য ইউজার অবজেক্ট
  };
};