"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { FiLogOut } from "react-icons/fi";
import { getSidebarItems } from "./sidebar.items";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import backgroundImage from "@/public/background.jpg";
import CustomDropdown, {
  NavigationItem,
} from "../custom-components/CustomDropdown";
import { motion, AnimatePresence } from "framer-motion";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import logo from "@/public/nicaa-logo-white-bg.png";
import Image from "next/image";
import { useState } from "react";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { userRole } = useRoleAccess();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Get role-based sidebar items
  const sidebarItems = getSidebarItems(userRole);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  const renderSidebarItem = (item: any, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.name);
    const isActive =
      pathname === item.href ||
      (hasChildren &&
        item.children.some((child: any) => pathname === child.href));

    if (hasChildren) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleExpanded(item.name)}
            className={`w-full p-3 cursor-pointer flex items-center justify-between rounded-md ${
              isActive
                ? "bg-[#EBF5FF] text-[#173F66] font-semibold"
                : "hover:bg-[#EBF5FF]/20 text-white"
            } ${isCollapsed ? "justify-center" : ""}`}
            {...(isCollapsed ? { title: item.name } : {})}
          >
            <div className="flex items-center">
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
            </div>
            {!isCollapsed && (
              <MdKeyboardArrowDown
                className={`transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            )}
          </button>

          {!isCollapsed && isExpanded && (
            <div className="ml-6 mt-1 space-y-1">
              {item.children.map((child: any) => (
                <Link
                  key={child.name}
                  href={child.href}
                  className={`p-2 cursor-pointer flex items-center rounded-md ${
                    pathname === child.href
                      ? "bg-[#EBF5FF] text-[#173F66] font-semibold"
                      : "hover:bg-[#EBF5FF]/20 text-white"
                  }`}
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        href={item.href || "#"}
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
    );
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
          {sidebarItems.map((item) => (
            <li key={item.name} className="mx-2">
              {renderSidebarItem(item)}
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
