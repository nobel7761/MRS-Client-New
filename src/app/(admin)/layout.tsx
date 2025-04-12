"use client";

import Sidebar from "@/components/shared/sidebar/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
      } else if (user?.role === UserRole.USER) {
        router.push("/");
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || user?.role === UserRole.USER) {
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
