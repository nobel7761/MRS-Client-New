"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { FiLogOut } from "react-icons/fi";
import { sidebarItems } from "./sidebar.items";
import BrandLogo from "../brand-logo/brand-logo";
import { Playfair_Display } from "next/font/google";
import CustomDropdown, {
  NavigationItem,
} from "../custom-components/CustomDropdown";
import { motion, AnimatePresence } from "framer-motion";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaUserShield } from "react-icons/fa";

const playfair = Playfair_Display({ subsets: ["latin"] });

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <aside
      className={`bg-[#173F66] flex flex-col fixed h-screen transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <Link href="/admin" className="cursor-pointer">
        <div
          className={`h-[8vh] p-4 flex items-center ${
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
            <FaUserShield className="w-[2.5rem] h-[2.5rem] text-white" />
          </motion.div>

          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                className={`${playfair.className} text-[1.5rem] text-white font-extrabold tracking-wider`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                Dashboard
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
        <ul className="space-y-4 py-4">
          {sidebarItems.map((category) => (
            <li key={category.category}>
              {!isCollapsed && (
                <div className="px-4 py-2 text-xs font-semibold text-gray-400">
                  {category.category}
                </div>
              )}
              <ul>
                {category.items.map((item) => {
                  const isActive = pathname === item.href;
                  const hasChildren =
                    "children" in item &&
                    Array.isArray(item.children) &&
                    item.children.length > 0;

                  return (
                    <li key={item.name} className="mx-2">
                      {hasChildren ? (
                        <CustomDropdown
                          items={item as NavigationItem}
                          pathname={pathname}
                          isCollapsed={isCollapsed}
                        />
                      ) : (
                        <Link
                          href={item.href || "#"}
                          className={`p-3 cursor-pointer flex items-center rounded-md ${
                            isActive
                              ? "bg-[#EBF5FF] text-[#173F66] font-semibold"
                              : "hover:bg-[#EBF5FF]/10"
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
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
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
