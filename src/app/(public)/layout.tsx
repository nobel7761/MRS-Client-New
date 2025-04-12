"use client";

import PageLoader from "@/components/PageLoader";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Only redirect to admin dashboard if the user is on the root path
      if (window.location.pathname === "/") {
        router.push("/");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="flex flex-col overflow-y-auto min-h-screen">
      <section>{children}</section>
    </div>
  );
}
