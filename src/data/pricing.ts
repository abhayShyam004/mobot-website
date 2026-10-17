export interface PricingTier {
  id: string;
  name: string;
  priceMonthly: number;
  period: string;
  billedNote: string;
  buttonText: string;
  buttonHref: string;
  includesHeading: string;
  features: string[];
  isPopular?: boolean;
}

export const INDIVIDUAL_TIERS: PricingTier[] = [
  {
    id: "premium",
    name: "Premium",
    priceMonthly: 30,
    period: "/ month",
    billedNote: "Billed monthly",
    buttonText: "Get Premium",
    buttonHref: "https://grok.com/dashboard/billing?openUpgrade=true&tier=premium&yearly=false&product=grok-bot",
    includesHeading: "Includes:",
    features: [
      "Grok Bot's own computer",
      "Signs into your tools",
      "Routines on a schedule",
      "Work anywhere: desktop, mobile, and more",
      "Weekly Grok Bot usage included"
    ]
  },
  {
    id: "super",
    name: "Super",
    priceMonthly: 100,
    period: "/ month",
    billedNote: "Billed monthly",
    buttonText: "Get Super",
    buttonHref: "https://grok.com/dashboard/billing?openUpgrade=true&tier=super&yearly=false&product=grok-bot",
    includesHeading: "Everything in Premium, plus:",
    features: [
      "3.5x Premium usage",
      "Priority model access at peak times"
    ]
  },
  {
    id: "ultra",
    name: "Ultra",
    priceMonthly: 200,
    period: "/ month",
    billedNote: "Billed monthly",
    buttonText: "Get Ultra",
    buttonHref: "https://grok.com/dashboard/billing?openUpgrade=true&tier=ultra&yearly=false&product=grok-bot",
    includesHeading: "Everything in Super, plus:",
    features: [
      "12x Premium usage",
      "Earliest access to all products & models"
    ]
  }
];

export const TEAMS_TIERS: PricingTier[] = [
  {
    id: "teams-standard",
    name: "Teams Standard",
    priceMonthly: 40,
    period: "/ seat / month",
    billedNote: "Billed monthly or annually",
    buttonText: "Get Teams",
    buttonHref: "https://grok.com/dashboard/billing",
    includesHeading: "Includes:",
    features: [
      "Everything in Premium for each seat",
      "Shared Bot workspaces and routines",
      "Centralized team billing & invoices",
      "Role-based access controls"
    ]
  },
  {
    id: "teams-pro",
    name: "Teams Pro",
    priceMonthly: 120,
    period: "/ seat / month",
    billedNote: "Billed monthly or annually",
    buttonText: "Get Teams Pro",
    buttonHref: "https://grok.com/dashboard/billing",
    includesHeading: "Everything in Teams Standard, plus:",
    features: [
      "5x pooled usage across team members",
      "Priority cluster allocation",
      "Admin telemetry and routine analytics"
    ]
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceMonthly: 250,
    period: "/ custom quote",
    billedNote: "Custom billing & SLAs",
    buttonText: "Contact Sales",
    buttonHref: "https://cursor.com/contact-sales?product=grok-bot",
    includesHeading: "Enterprise-grade controls:",
    features: [
      "Dedicated compute and GPU instances",
      "Custom DLP, proxies, certs at boot",
      "SSO, SCIM, and audit logging",
      "Custom legal, BAA, and DPA agreements"
    ]
  }
];
