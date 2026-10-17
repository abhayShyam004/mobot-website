export interface UseCaseBot {
  slug: string;
  name: string;
  lead: string;
  description: string;
  hue: string;
  badgeColor: string;
  avatarColor: string;
}

export const USE_CASES_DATA: UseCaseBot[] = [
  {
    slug: "sales-outbound",
    name: "Sales Outbound",
    lead: "Generate pipeline overnight.",
    description: "Researches accounts, scores contacts with intent, drafts email and LinkedIn in your voice, and leaves a review list for you to approve.",
    hue: "cyan",
    badgeColor: "text-cyan-400 bg-cyan-950/40 border-cyan-500/30",
    avatarColor: "#06B6D4"
  },
  {
    slug: "talent-scout",
    name: "Talent Scout",
    lead: "Keep your talent pipeline moving.",
    description: "Runs screen-to-offer: sources, drafts outreach in your voice, skips profiles already in the ATS, and handles scheduling once you approve.",
    hue: "violet",
    badgeColor: "text-violet-400 bg-violet-950/40 border-violet-500/30",
    avatarColor: "#8B5CF6"
  },
  {
    slug: "paid-media",
    name: "Paid Media",
    lead: "Pulls live channel and campaign data,",
    description: "sends recommended reallocations against your monthly budget, and holds bids for your approval before making adjustments.",
    hue: "magenta",
    badgeColor: "text-pink-400 bg-pink-950/40 border-pink-500/30",
    avatarColor: "#EC4899"
  },
  {
    slug: "expense-manager",
    name: "Expense Manager",
    lead: "Stay on top of money.",
    description: "Builds the weekly summary from your expense manager and sheets, logs new receipts from email, and nudges owners on missing categories before weekly review.",
    hue: "green",
    badgeColor: "text-emerald-400 bg-emerald-950/40 border-emerald-500/30",
    avatarColor: "#10B981"
  },
  {
    slug: "product-performance",
    name: "Product Performance",
    lead: "Get a clear view of the metrics that matter.",
    description: "Logs into observability tools, walks the flamegraphs, and comes back with hotspots plus a short writeup with screenshots.",
    hue: "red",
    badgeColor: "text-rose-400 bg-rose-950/40 border-rose-500/30",
    avatarColor: "#F43F5E"
  },
  {
    slug: "bug-reproduction",
    name: "Bug Reproduction",
    lead: "Give engineers reports they can trust.",
    description: "Catches the thread, clicks the same path in staging, captures the failure, and drops a repro pack (steps, screenshots, network notes).",
    hue: "red",
    badgeColor: "text-rose-400 bg-rose-950/40 border-rose-500/30",
    avatarColor: "#E11D48"
  },
  {
    slug: "account-health",
    name: "Account Health",
    lead: "See risk and expansion before the QBR.",
    description: "Reads usage and signals across your book and turns portfolio noise into a clear watch list.",
    hue: "blue",
    badgeColor: "text-blue-400 bg-blue-950/40 border-blue-500/30",
    avatarColor: "#3B82F6"
  },
  {
    slug: "chief-of-staff",
    name: "Chief of Staff",
    lead: "Your always-on assistant.",
    description: "Scans Slack, email, calendar, and meeting notes and surfaces what's new and what maps to your priorities. Helps follow up on dropped threads, coordinate schedules, and update deliverables.",
    hue: "orange",
    badgeColor: "text-amber-400 bg-amber-950/40 border-amber-500/30",
    avatarColor: "#F59E0B"
  }
];
