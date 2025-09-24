import { UserRole, UserType } from "@/types/auth";

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

export const getSidebarItems = (
  userRole?: UserRole,
  userType?: UserType
): SidebarItem[] => {
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

  // Show specific items for COLLECTOR user type
  if (userType === UserType.COLLECTOR) {
    baseItems.push({
      name: "Users",
      icon: "👤",
      children: [
        {
          name: "Registered Users",
          href: "/admin/users/registered",
        },
        {
          name: "Event Participants",
          href: "/admin/users/participants",
        },
      ],
    });
    return baseItems;
  }

  // Only show FAQs, Users and Email Management for SUPER_ADMIN
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

    baseItems.push({
      name: "Users",
      icon: "👤",
      children: [
        {
          name: "Registered Users",
          href: "/admin/users/registered",
        },
        {
          name: "Event Participants",
          href: "/admin/users/participants",
        },
      ],
    });

    baseItems.push({
      name: "Events",
      icon: "🎉",
      children: [
        {
          name: "All Events",
          href: "/admin/events",
        },
      ],
    });

    baseItems.push({
      name: "Email Management",
      icon: "📧",
      children: [
        {
          name: "Test Configuration",
          href: "/admin/email/test",
        },
      ],
    });
  }

  return baseItems;
};

export const sidebarItems = getSidebarItems();

export const userDropdownItems = [{ name: "My Profile", href: "/profile" }];
