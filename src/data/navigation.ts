export interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: { label: string; href: string; desc?: string }[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Products",
    href: "#",
    hasDropdown: true,
    dropdownItems: [
      { label: "Grok", href: "#", desc: "Frontier AI with real-time knowledge" },
      { label: "Grok Bot", href: "#", desc: "Always-on AI teammates for work" },
      { label: "Imagine", href: "#", desc: "Photorealistic image generation" },
      { label: "Grok Voice", href: "#", desc: "Ultra-low-latency conversational speech" }
    ]
  },
  {
    label: "Solutions",
    href: "#",
    hasDropdown: true,
    dropdownItems: [
      { label: "Enterprise", href: "#", desc: "Custom security, compliance, and scale" },
      { label: "Government", href: "#", desc: "Secure deployments for public sector" },
      { label: "Customer Support", href: "#", desc: "Autonomous ticket resolution" }
    ]
  },
  {
    label: "Developer",
    href: "#",
    hasDropdown: true,
    dropdownItems: [
      { label: "API Overview", href: "#" },
      { label: "Documentation", href: "#" },
      { label: "Models & Pricing", href: "#" },
      { label: "Developer Console", href: "#" }
    ]
  },
  {
    label: "Company",
    href: "#",
    hasDropdown: true,
    dropdownItems: [
      { label: "About", href: "#" },
      { label: "Colossus", href: "#" },
      { label: "Careers", href: "#" },
      { label: "News", href: "#" }
    ]
  },
  { label: "Pricing", href: "#pricing" },
  { label: "News", href: "#" }
];
