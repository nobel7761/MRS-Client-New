import { useAuth } from "@/contexts/AuthContext";
import { UserRole, UserType } from "@/types/auth";

export const useRoleAccess = () => {
  const { user } = useAuth();

  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  const isSuperAdmin = (): boolean => {
    return hasRole([UserRole.SUPER_ADMIN]);
  };

  const isAdmin = (): boolean => {
    return hasRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]);
  };

  const isCollector = (): boolean => {
    const userType = user?.userType || (user as any)?.userType;
    return userType === UserType.COLLECTOR || userType === "COLLECTOR";
  };

  const hasAdminAccess = (): boolean => {
    const userType = user?.userType || (user as any)?.userType;
    return (
      (user?.role === UserRole.SUPER_ADMIN && userType === UserType.OWNER) ||
      (user?.role === UserRole.ADMIN && userType === UserType.COLLECTOR) ||
      (user?.role === UserRole.USER && userType === UserType.COLLECTOR)
    );
  };

  const isUser = (): boolean => {
    return hasRole([UserRole.USER]);
  };

  const canAccessFaqs = (): boolean => {
    return isSuperAdmin();
  };

  return {
    hasRole,
    isSuperAdmin,
    isAdmin,
    isUser,
    isCollector,
    hasAdminAccess,
    canAccessFaqs,
    userRole: user?.role,
    userType: user?.userType || (user as any)?.userType,
  };
};
