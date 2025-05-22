"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { FiLogOut } from "react-icons/fi";
import { sidebarItems } from "./sidebar.items";
import backgroundImage from "@/public/background.jpg";
import CustomDropdown, {
  NavigationItem,
} from "../custom-components/CustomDropdown";
import { motion, AnimatePresence } from "framer-motion";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import logo from "@/public/nicaa-logo-white-bg.png";
import Image from "next/image";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <aside
      className={` bg-cover bg-center bg-no-repeat flex flex-col fixed h-screen transition-all duration-300 py-4 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
      style={{ backgroundImage: `url(${backgroundImage.src})` }}
    >
      <Link href="/admin" className="cursor-pointer">
        <div
          className={`p-4 flex items-center justify-center gap-x-4 border-b border-gray-200 ${
            isCollapsed ? "justify-center" : "justify-start"
          } overflow-hidden`}
        >
          <motion.div
            initial={false}
            animate={{
              width: isCollapsed ? 56 : 64,
              rotate: isCollapsed ? 360 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={logo}
              alt="NICAA"
              width={500}
              height={500}
              className="w-full h-full"
            />
          </motion.div>

          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                className={`text-[2.5rem] text-white font-extrabold tracking-wider`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                NICAA
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </Link>

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-24 bg-red-600 text-white p-0.5 rounded-full hover:bg-red-700 transition-colors"
      >
        {isCollapsed ? (
          <MdKeyboardArrowRight size={16} />
        ) : (
          <MdKeyboardArrowLeft size={16} />
        )}
      </button>

      <nav className="flex-1 text-sm text-white overflow-y-auto custom-scrollbar">
        <ul className="space-y-1 py-4">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name} className="mx-2">
                <Link
                  href={item.href}
                  className={`p-3 cursor-pointer flex items-center rounded-md ${
                    isActive
                      ? "bg-[#EBF5FF] text-[#173F66] font-semibold"
                      : "hover:bg-[#EBF5FF]/20"
                  } ${isCollapsed ? "justify-center" : ""}`}
                  {...(isCollapsed ? { title: item.name } : {})}
                >
                  <span
                    className={`${
                      isCollapsed
                        ? "text-[1.5rem] flex items-center justify-center w-6"
                        : "mr-3"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {!isCollapsed && item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-gray-200">
        <button
          onClick={handleLogout}
          className={`flex items-center w-full px-4 py-3 hover:bg-[#EBF5FF]/10 text-white rounded-md transition-colors ${
            isCollapsed ? "justify-center" : ""
          }`}
          {...(isCollapsed ? { title: "Logout" } : {})}
        >
          <span
            className={`${
              isCollapsed
                ? "text-[1.5rem] flex items-center justify-center w-6"
                : "mr-3"
            }`}
          >
            <FiLogOut />
          </span>
          {!isCollapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
