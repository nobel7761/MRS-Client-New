export const sidebarItems = [
  {
    category: "STATISTICS",
    items: [
      {
        name: "Reports",
        icon: "📊",
        href: "/admin",
      },
    ],
  },
  {
    category: "DASHBOARD",
    items: [
      {
        name: "Client",
        icon: "👥",
        href: "/admin/client-dashboard",
      },
      {
        name: "Employee",
        icon: "👨‍💼",
        href: "/admin/employee-dashboard",
      },
    ],
  },
  {
    category: "ATTENDANCE",
    items: [
      {
        name: "Attendance",
        icon: "📝",
        href: "/admin/attendance",
      },
    ],
  },
  {
    category: "Accounts",
    items: [
      {
        name: "Billing",
        icon: "💰",
        href: "/admin/billing",
      },
      {
        name: "Salary Sheet",
        icon: "💰",
        href: "/admin/salary-sheet",
      },
    ],
  },
];

export const userDropdownItems = [{ name: "My Profile", href: "/profile" }];
