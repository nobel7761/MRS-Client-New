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
  userType?: UserType | string
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

  // Admin + COLLECTOR or User + COLLECTOR: Access to Dashboard, Representative Registration, Users
  if (
    (userRole === UserRole.ADMIN || userRole === UserRole.USER) &&
    userType === UserType.COLLECTOR
  ) {
    baseItems.push({
      name: "Users",
      icon: "👤",
      href: "/admin/users/registered",
    });

    // Add Silver Jubilee for User + COLLECTOR
    if (userRole === UserRole.USER) {
      baseItems.push({
        name: "Silver Jubilee",
        icon: "🎊",
        children: [
          {
            name: "Submit Response",
            href: "/admin/silver-jubilee/submit",
          },
          {
            name: "Participants List",
            href: "/admin/silver-jubilee/participants",
          },
        ],
      });
    }

    return baseItems;
  }

  // SuperAdmin + OWNER: Access to all sidebar options
  if (
    userRole === UserRole.SUPER_ADMIN &&
    (userType === UserType.OWNER || userType === "OWNER")
  ) {
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
      href: "/admin/users/registered",
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

    baseItems.push({
      name: "Silver Jubilee",
      icon: "🎊",
      children: [
        {
          name: "Submit Response",
          href: "/admin/silver-jubilee/submit",
        },
        {
          name: "Participants List",
          href: "/admin/silver-jubilee/participants",
        },
      ],
    });
  }

  // SuperAdmin (any userType): Also gets Silver Jubilee if not already added
  if (
    userRole === UserRole.SUPER_ADMIN &&
    userType !== UserType.OWNER &&
    userType !== "OWNER"
  ) {
    baseItems.push({
      name: "Silver Jubilee",
      icon: "🎊",
      children: [
        {
          name: "Submit Response",
          href: "/admin/silver-jubilee/submit",
        },
        {
          name: "Participants List",
          href: "/admin/silver-jubilee/participants",
        },
      ],
    });
  }

  return baseItems;
};

export const sidebarItems = getSidebarItems();

export const userDropdownItems = [{ name: "My Profile", href: "/profile" }];
