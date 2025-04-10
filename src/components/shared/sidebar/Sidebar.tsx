"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const navigation = [
  { name: "Dashboard", href: "/admin" },
  { name: "Users", href: "/admin/users" },
  { name: "Settings", href: "/admin/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <div className="w-64 bg-gray-800 text-white h-full">
      <div className="p-4">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <p className="text-sm text-gray-400">Welcome, {user?.name}</p>
      </div>
      <nav className="mt-4">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-2 ${
              pathname === item.href ? "bg-gray-900" : "hover:bg-gray-700"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
