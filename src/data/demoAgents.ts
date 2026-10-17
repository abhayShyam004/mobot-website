export interface DemoMessage {
  id: string;
  role: "user" | "agent" | "system";
  content?: string;
  timestamp?: string;
  event?: {
    type: "created-routine" | "outbound-message";
    name?: string;
    triggerDescription?: string;
    channel?: "email" | "slack";
    to?: string;
    subject?: string;
    body?: string[];
    status?: "ready" | "sent";
  };
}

export interface DemoAgent {
  id: string;
  name: string;
  title: string;
  avatarHue: string; // hex color or preset
  avatarColor: string;
  lastMessageSnippet: string;
  timeString: string;
  hasUnread?: boolean;
  unreadCount?: number;
  isPinned?: boolean;
  messages: DemoMessage[];
  defaultThinkingText?: string;
}

export const DEMO_AGENTS: DemoAgent[] = [
  {
    id: "new-agent",
    name: "New agent",
    title: "General Assistant",
    avatarHue: "orange",
    avatarColor: "#F19D38",
    lastMessageSnippet: "Typing...",
    timeString: "11:12 AM",
    defaultThinkingText: "Thinking",
    messages: [
      {
        id: "msg-init-1",
        role: "agent",
        content: "Hi! I have your browser and workspace open. What would you like me to tackle today?",
        timestamp: "11:10 AM"
      }
    ]
  },
  {
    id: "chief",
    name: "Chief",
    title: "Chief of Staff",
    avatarHue: "green",
    avatarColor: "#54B9A6",
    lastMessageSnippet: "booked the venue and sent the confirmation around.",
    timeString: "Yesterday",
    messages: [
      {
        id: "chief-1",
        role: "user",
        content: "Can you confirm the venue for next Thursday's QBR and notify the leadership channel?",
        timestamp: "Yesterday 3:15 PM"
      },
      {
        id: "chief-2",
        role: "agent",
        content: "On it. Checking availability at The Hibernia and verifying catering options.",
        timestamp: "Yesterday 3:16 PM"
      },
      {
        id: "chief-3",
        role: "system",
        timestamp: "Yesterday 3:20 PM",
        event: {
          type: "outbound-message",
          channel: "slack",
          to: "#leadership",
          subject: "QBR Venue Confirmed",
          body: [
            "QBR is locked for Thursday 9:00 AM at The Hibernia (Room 4A).",
            "Calendar invites updated with parking & transit details."
          ],
          status: "sent"
        }
      },
      {
        id: "chief-4",
        role: "agent",
        content: "booked the venue and sent the confirmation around.",
        timestamp: "Yesterday 3:22 PM"
      }
    ]
  },
  {
    id: "inbox-manager",
    name: "Inbox Manager",
    title: "Communications",
    avatarHue: "purple",
    avatarColor: "#885CF6",
    lastMessageSnippet: "sent. inbox at zero, 5 drafts parked...",
    timeString: "8:12 AM",
    hasUnread: true,
    unreadCount: 5,
    messages: [
      {
        id: "inbox-1",
        role: "user",
        content: "Run my morning inbox pass. Archive notifications, draft replies for customer inquiries, and flag VIPs.",
        timestamp: "7:45 AM"
      },
      {
        id: "inbox-2",
        role: "agent",
        content: "Morning pass complete: 42 newsletters archived, 3 meeting requests confirmed on your calendar.",
        timestamp: "8:00 AM"
      },
      {
        id: "inbox-3",
        role: "agent",
        content: "sent. inbox at zero, 5 drafts parked in your review queue for signoff.",
        timestamp: "8:12 AM"
      }
    ]
  },
  {
    id: "account-manager",
    name: "Account Manager",
    title: "Sales & Client Success",
    avatarHue: "violet",
    avatarColor: "#7C3AED",
    lastMessageSnippet: "invite's out to vicky. globex note ...",
    timeString: "6:12 AM",
    messages: [
      {
        id: "acct-1",
        role: "user",
        content: "Prepare notes on the Globex contract renewal before the 10am call.",
        timestamp: "5:30 AM"
      },
      {
        id: "acct-2",
        role: "agent",
        content: "Reviewed Globex usage: seat growth +34% QoQ, storage utilization at 82%. Prepared proposal for 2-year enterprise expansion.",
        timestamp: "6:05 AM"
      },
      {
        id: "acct-3",
        role: "agent",
        content: "invite's out to vicky. globex note attached to the CRM deal record.",
        timestamp: "6:12 AM"
      }
    ]
  },
  {
    id: "talent-scout",
    name: "Talent Scout",
    title: "Recruiting",
    avatarHue: "blue",
    avatarColor: "#2563EB",
    lastMessageSnippet: "3 intros drafted in your voice, hel...",
    timeString: "3:12 AM",
    messages: [
      {
        id: "talent-1",
        role: "user",
        content: "Keep the SF infra role moving. Source candidates, skip anyone already in our ATS.",
        timestamp: "1:00 AM"
      },
      {
        id: "talent-2",
        role: "system",
        timestamp: "1:05 AM",
        event: {
          type: "created-routine",
          name: "Nightly sourcing pass",
          triggerDescription: "Weeknights at 1:00 AM"
        }
      },
      {
        id: "talent-3",
        role: "agent",
        content: "Screened 24 profiles across GitHub & LinkedIn. 3 intros drafted in your voice, held for approval.",
        timestamp: "3:12 AM"
      }
    ]
  },
  {
    id: "expense-manager",
    name: "Expense Manager",
    title: "Finance & Ops",
    avatarHue: "orange",
    avatarColor: "#EA580C",
    lastMessageSnippet: "report filed. 9 receipts, nothing o...",
    timeString: "7:12 AM",
    messages: [
      {
        id: "exp-1",
        role: "user",
        content: "Match receipts from Gmail against Ramp transactions for last week.",
        timestamp: "6:45 AM"
      },
      {
        id: "exp-2",
        role: "agent",
        content: "Matched 9 receipts automatically. Extracted VAT and vendor categories.",
        timestamp: "7:00 AM"
      },
      {
        id: "exp-3",
        role: "agent",
        content: "report filed. 9 receipts, nothing outstanding on your card.",
        timestamp: "7:12 AM"
      }
    ]
  },
  {
    id: "offsite-crew",
    name: "Offsite crew",
    title: "Operations Team",
    avatarHue: "cyan",
    avatarColor: "#06B6D4",
    lastMessageSnippet: "that leaves the pipeline. 16 spin u...",
    timeString: "5:12 AM",
    messages: [
      {
        id: "offsite-1",
        role: "user",
        content: "Check staging environment status before the team demos today.",
        timestamp: "4:50 AM"
      },
      {
        id: "offsite-2",
        role: "agent",
        content: "All smoke tests passing. Deployed commit fb0a830 across 3 test clusters.",
        timestamp: "5:05 AM"
      },
      {
        id: "offsite-3",
        role: "agent",
        content: "that leaves the pipeline. 16 spin up instances verified ready for the team.",
        timestamp: "5:12 AM"
      }
    ]
  }
];
