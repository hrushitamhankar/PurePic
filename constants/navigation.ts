export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  badge?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const mainNavItems: NavItem[] = [
  { label: "Features", href: "/features" },
  { label: "Download", href: "/download" },
  { label: "Pricing", href: "/pricing" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Docs", href: "/docs" },
  { label: "Blog", href: "/blog" },
];

export const footerNavGroups: NavGroup[] = [
  {
    label: "Product",
    items: [
      { label: "Features", href: "/features" },
      { label: "Download", href: "/download" },
      { label: "Pricing", href: "/pricing" },
      { label: "Roadmap", href: "/roadmap" },
      { label: "Changelog", href: "/blog" },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Documentation", href: "/docs" },
      { label: "Quick Start", href: "/docs/quick-start" },
      { label: "API Reference", href: "/docs/api-reference" },
      { label: "FAQ", href: "/faq" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    label: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms of Service", href: "/legal/terms" },
    ],
  },
];
