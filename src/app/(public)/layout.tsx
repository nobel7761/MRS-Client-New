"use client";

import PageLoader from "@/components/PageLoader";
import FooterComponent from "@/components/shared/footer/footer";
import MainNavbar from "@/components/shared/navbar/main-navbar";
import TitleSection from "@/components/shared/title-section/TitleSection";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import backgroundImage from "@/public/background.jpg";
import HeroSection from "@/components/pages/public/Home/Hero/HeroSection";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

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

  const getPageTitle = (path: string) => {
    // Remove leading slash and split by remaining slashes
    const pathParts = path.slice(1).split("/");
    // Capitalize each word and join with spaces
    return pathParts
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  };

  return (
    <div className="flex flex-col overflow-y-auto min-h-screen">
      <div
        className="bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage.src})` }}
      >
        <MainNavbar />
        {pathname === "/" && <HeroSection />}
        {pathname === "/representative-registration-reunion-2026" && (
          <TitleSection title="Representative for Reunion 2026" />
        )}
      </div>
      <div>{children}</div>
      <FooterComponent />
    </div>
  );
}
