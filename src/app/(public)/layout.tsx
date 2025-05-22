"use client";

import PageLoader from "@/components/PageLoader";
import FooterComponent from "@/components/shared/footer/footer";
import MainNavbar from "@/components/shared/navbar/main-navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import backgroundImage from "@/public/background.jpg";

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
      <section>
        <div
          className="bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage.src})` }}
        >
          <MainNavbar />
        </div>
        {children}
        <FooterComponent />
      </section>
    </div>
  );
}
