"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { FiLogOut } from "react-icons/fi";

const navigation = [
  { name: "Dashboard", href: "/admin" },
  { name: "Users", href: "/admin/users" },
  { name: "Settings", href: "/admin/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="w-64 bg-white text-gray-600 h-full flex flex-col border-r border-gray-200 shadow-lg">
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-sm text-gray-700">
          Welcome, {user?.firstName} {user?.lastName}
        </p>
      </div>
      <nav className="mt-4 flex-1">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 ${
              pathname === item.href ? "bg-gray-50 text-gray-900" : ""
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
        >
          <FiLogOut className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
}
