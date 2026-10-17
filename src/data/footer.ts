export interface FooterCategory {
  title: string;
  links: { label: string; href: string; isExternal?: boolean }[];
}

export const FOOTER_DATA: FooterCategory[] = [
  {
    title: "Products",
    links: [
      { label: "Chat", href: "#" },
      { label: "Build", href: "#" },
      { label: "Imagine", href: "#" },
      { label: "Voice", href: "#" },
      { label: "Bot", href: "#" },
      { label: "Grokpedia", href: "#" }
    ]
  },
  {
    title: "Solutions",
    links: [
      { label: "Business", href: "#" },
      { label: "Government", href: "#" },
      { label: "Customer Support", href: "#" },
      { label: "Legal", href: "#" },
      { label: "Security", href: "#" },
      { label: "Use Cases", href: "#" }
    ]
  },
  {
    title: "Developers",
    links: [
      { label: "API Overview", href: "#" },
      { label: "Pricing", href: "#pricing" },
      { label: "Models", href: "#" },
      { label: "Console", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "Docs", href: "#" },
      { label: "Status", href: "#" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Colossus", href: "#" },
      { label: "Careers", href: "#" },
      { label: "News", href: "#" },
      { label: "Contact", href: "#" }
    ]
  },
  {
    title: "Trust",
    links: [
      { label: "Safety", href: "#" },
      { label: "Security", href: "#" },
      { label: "Privacy Portal", href: "#" },
      { label: "Subprocessors", href: "#" },
      { label: "Help Center", href: "#" }
    ]
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "#" },
      { label: "Enterprise Terms", href: "#" },
      { label: "Startup Terms", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Cookies", href: "#" },
      { label: "AUP", href: "#" },
      { label: "Brand", href: "#" },
      { label: "Privacy choices", href: "#" }
    ]
  },
  {
    title: "Download",
    links: [
      { label: "grok.com", href: "#" },
      { label: "iOS", href: "#" },
      { label: "Android", href: "#" },
      { label: "Grok on X", href: "#" }
    ]
  },
  {
    title: "Social",
    links: [
      { label: "@SpaceXSI", href: "#" },
      { label: "@grok", href: "#" },
      { label: "Discord", href: "#" }
    ]
  }
];
