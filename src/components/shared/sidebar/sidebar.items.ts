export const sidebarItems = [
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
  {
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
  },
];

export const userDropdownItems = [{ name: "My Profile", href: "/profile" }];
