"use client";

import Sidebar from "@/components/shared/sidebar/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole, UserType } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PageLoader from "@/components/PageLoader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/");
      } else {
        // Check if user has proper role and userType combination for admin access
        // Handle both userType and usetType (typo in backend data)
        const userType = user?.userType || (user as any)?.usetType;
        const hasValidAccess =
          (user?.role === UserRole.SUPER_ADMIN &&
            userType === UserType.OWNER) ||
          (user?.role === UserRole.ADMIN && userType === UserType.COLLECTOR) ||
          (user?.role === UserRole.USER && userType === UserType.COLLECTOR);

        if (!hasValidAccess) {
          router.push("/");
        }
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return null;
  }

  // Check if user has proper role and userType combination for admin access
  // Handle both userType and usetType (typo in backend data)
  const userType = user?.userType || (user as any)?.usetType;
  const hasValidAccess =
    (user?.role === UserRole.SUPER_ADMIN && userType === UserType.OWNER) ||
    (user?.role === UserRole.ADMIN && userType === UserType.COLLECTOR) ||
    (user?.role === UserRole.USER && userType === UserType.COLLECTOR);

  if (!hasValidAccess) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div
        className={`flex-1 ${
          isCollapsed ? "ml-16" : "ml-64"
        } transition-all duration-300`}
      >
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
