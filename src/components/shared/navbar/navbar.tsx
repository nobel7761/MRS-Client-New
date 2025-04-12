import Link from "next/link";
import { FaPhoneAlt } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { BsFacebook } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { FiMenu } from "react-icons/fi";
import { navbarItems } from "./nvabar.items";
import BrandLogo from "../brand-logo/brand-logo";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const pathname = usePathname();
  const [activeRoute, setActiveRoute] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setActiveRoute(pathname);
  }, [pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div
      className={`${
        pathname === "/"
          ? "bg-backgroundColor"
          : "md:bg-transparent bg-backgroundColor"
      } md:pt-8 z-10`}
    >
      <div className="md:w-[65%] w-full mx-auto py-2 px-2 md:pl-10 md:rounded-tl-full md:rounded-tr-full overflow-hidden bg-[#041E42]">
        <div className="text-white text-sm font-bold flex justify-between items-center">
          <div className="md:w-1/2 flex items-center gap-x-2">
            <FaPhoneAlt />
            <div className=" flex gap-x-2 items-center">
              <p className={`hidden md:block`}>Call Now</p>
              <p>01701228433</p>
            </div>
          </div>

          <div className="md:w-1/5 flex md:gap-x-10 gap-x-5 items-center">
            <Link
              href="https://wa.me/+8801701228433"
              target="_blank"
              className="w-fit"
            >
              <IoLogoWhatsapp className="hover:text-whatsapp text-lg" />
            </Link>
            <Link
              href="https://www.facebook.com/profile.php?id=100078968657675"
              target="_blank"
              className="w-fit"
            >
              <BsFacebook className="hover:text-facebook text-lg" />
            </Link>
            <Link
              href="mailto:manpowersync@gmail.com"
              target="_blank"
              className="w-fit"
            >
              <MdEmail className="hover:text-black text-lg" />
            </Link>
          </div>
        </div>
      </div>

      <nav className="relative z-10">
        <div className="md:max-w-[82.5%] mx-auto md:px-6 p-1 md:py-5 md:bg-primary md:rounded-full overflow-hidden flex justify-between items-center gap-x-1 md:border-0 border-b border-black md:mb-0">
          <Link href="/" className="md:w-[55%]">
            <BrandLogo textClassName="block md:text-[26px] text-[16px] ${oswald.className} md:text-white" />
          </Link>
          <button
            type="button"
            className={`md:hidden p-2 text-2xl hover:bg-[#041E42] hover:text-white rounded-lg  ${
              isMobileMenuOpen ? "bg-[#041E42] text-white" : ""
            }`}
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
          <div
            className={`${
              isMobileMenuOpen ? "block" : "hidden"
            } w-full md:block md:w-auto absolute  top-full left-0 right-0 bg-[#041E42] md:bg-transparent md:static md:mt-0  transition-all ease-in-out duration-300`}
          >
            <ul className="font-medium flex md:flex-row md:gap-x-8 flex-col md:p-0 p-4">
              {navbarItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.route}
                  onClick={toggleMobileMenu}
                  className={`md:p-0 p-4 rounded-lg hover:text-white ${
                    activeRoute === item.route
                      ? "text-white md:font-extrabold md:text-xl"
                      : "text-white md:font-extralight text-base hover:bg-gray-700 md:hover:bg-transparent"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {!isAuthenticated ? (
                <button
                  onClick={() => router.push("/login")}
                  className="text-white font-extralight my-0 py-0 hover:text-red-700 transition-colors"
                >
                  Login
                </button>
              ) : (
                <button
                  onClick={logout}
                  className="text-white font-extralight my-0 py-0 hover:text-red-700 transition-colors"
                >
                  Logout
                </button>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
