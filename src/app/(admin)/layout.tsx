"use client";

import Sidebar from "@/components/shared/sidebar/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole, UserType } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PageLoader from "@/components/PageLoader";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import BrandLogo from "@/components/shared/brand-logo/brand-logo";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // if (isLoading) {
  //   return <PageLoader />;
  // }

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
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <BrandLogo imageClassName="w-12 h-12" textClassName="hidden" />
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          {isMobileMenuOpen ? (
            <HiX className="w-6 h-6 text-gray-700" />
          ) : (
            <HiMenuAlt3 className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <div
          className={`fixed inset-0 z-40 transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <div
            className={`absolute top-0 left-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Sidebar
              isCollapsed={false}
              setIsCollapsed={setIsCollapsed}
              isMobile={true}
              onClose={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? "lg:ml-16" : "lg:ml-64"
        } ${isMobileMenuOpen ? "pt-16" : "pt-16 lg:pt-0"}`}
      >
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
