import { UserRole } from "@/types/auth";

interface SidebarItem {
  name: string;
  icon: string;
  href?: string;
  children?: SidebarChild[];
}

interface SidebarChild {
  name: string;
  href: string;
}

export const getSidebarItems = (userRole?: UserRole): SidebarItem[] => {
  const baseItems: SidebarItem[] = [
    {
      name: "Dashboard",
      icon: "📊",
      href: "/admin",
    },
    {
      name: "Representative Registration",
      icon: "👥",
      href: "/admin/representative-registration",
    },
  ];

  // Only show FAQs for SUPER_ADMIN
  if (userRole === UserRole.SUPER_ADMIN) {
    baseItems.push({
      name: "FAQs",
      icon: "❔",
      children: [
        {
          name: "Category",
          href: "/admin/faqs/category",
        },
        {
          name: "All FAQs",
          href: "/admin/faqs/all",
        },
      ],
    });
  }

  return baseItems;
};

export const sidebarItems = getSidebarItems();

export const userDropdownItems = [{ name: "My Profile", href: "/profile" }];
