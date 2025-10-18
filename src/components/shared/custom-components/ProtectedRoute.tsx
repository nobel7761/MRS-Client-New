"use client";

import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PageLoader from "@/components/PageLoader";
import AccessDenied from "./AccessDenied";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
}

const ProtectedRoute = ({
  children,
  allowedRoles,
  fallbackPath = "/admin",
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user && !allowedRoles.includes(user.role)) {
        toast.error(
          "Access denied. You don't have permission to view this page."
        );
        setShowAccessDenied(true);
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router, fallbackPath]);

  // if (isLoading) {
  //   return <PageLoader />;
  // }

  if (!isAuthenticated) {
    return null;
  }

  if (showAccessDenied || (user && !allowedRoles.includes(user.role))) {
    return (
      <AccessDenied
        message="You don't have permission to access this page. Only Super Admins can manage FAQs."
        backPath={fallbackPath}
        backText="Go Back to Dashboard"
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
