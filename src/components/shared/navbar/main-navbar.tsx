import TopBar from "./topbar";
import BrandLogo from "../brand-logo/brand-logo";
import Link from "next/link";
import { navbarItems } from "./nvabar.items";
import { useState } from "react";
import { archivo } from "@/lib/fonts";
import AnimatedButton from "@/components/shared/custom-components/animated-button";

const MainNavbar = () => {
  const [activePage, setActivePage] = useState("Home");

  return (
    <div className="sticky top-0">
      <TopBar />
      <div
        className={`shadow-sm text-white border-b border-white/10 ${archivo.medium500.className}`}
      >
        <div className="max-w-[1300px] px-[15px] mx-auto">
          <div className="flex items-center justify-center py-3">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="relative overflow-hidden">
                <Link href="/" className="flex items-center relative z-10">
                  <BrandLogo
                    imageClassName="w-32 h-32"
                    textClassName="hidden"
                  />
                </Link>
                <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
              </div>
              {/* <Link href="/" className="flex items-center relative z-10">
                <p className={`text-4xl font-medium`}>NICAA</p>
              </Link> */}
            </div>

            {/* Navigation Links */}
            {/* <nav
              className={`hidden md:flex items-center space-x-8 ${archivo.medium500.className}`}
            >
              {navbarItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.route}
                  className={`transition-colors hover:text-secondary ${
                    activePage === item.label || activePage === item.label
                      ? "text-secondary font-extrabold text-xl"
                      : "text-white"
                  }`}
                  onClick={() => setActivePage(item.label)}
                >
                  {item.label}
                </Link>
              ))}
            </nav> */}

            {/* Get Started Button */}
            {/* <AnimatedButton
              route="/login"
              text="Login"
              textColor="text-black"
              buttonBgColor="bg-secondary"
              iconBgColor="bg-primary"
              hoverButtonBgColor="bg-white"
              hoverIconBgColor="bg-black"
              className="w-[120px] flex justify-between items-center"
              showBackgroundImage={false}
            /> */}

            {/* Mobile Menu Button */}
            {/* <button className="md:hidden hover:text-primary">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNavbar;
