export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  hasLink?: boolean;
  linkText?: string;
  linkHref?: string;
}

export const FAQS_DATA: FaqItem[] = [
  {
    id: "faq-0",
    question: "How is Grok Bot different from AI assistants?",
    answer: "Bots have their own computer, so they can work inside your apps and tools. They also run in parallel, 24/7, even when your laptop is closed."
  },
  {
    id: "faq-1",
    question: "Who is Grok Bot available for today?",
    answer: "Grok Bot is included with Premium, Super, Ultra, Teams, and Enterprise."
  },
  {
    id: "faq-2",
    question: "Is Grok Bot available for enterprises?",
    answer: "Yes. Grok Bot is generally available for Enterprise, as well as for teams on the Teams plan. Contact sales to set up Enterprise access for your organization, including people who don’t already have a seat.",
    hasLink: true,
    linkText: "Contact sales",
    linkHref: "https://cursor.com/contact-sales?product=grok-bot"
  },
  {
    id: "faq-3",
    question: "Where do I talk to Grok Bot?",
    answer: "Work with Grok Bot from your desktop (macOS or Windows) or your phone with the iOS app."
  },
  {
    id: "faq-4",
    question: "How much does Grok Bot cost?",
    answer: "Grok Bot subscriptions come with weekly usage included, with additional usage billed based on token cost. Enterprise customers should contact sales.",
    hasLink: true,
    linkText: "contact sales",
    linkHref: "https://cursor.com/contact-sales?product=grok-bot"
  },
  {
    id: "faq-5",
    question: "Do Bots share one computer?",
    answer: "Yes. Every Grok Bot shares one persistent cloud computer. Your Bots share that machine (files, browser, logins), so they can hand work off and keep context. Isolation is per user, not per Grok Bot."
  },
  {
    id: "faq-6",
    question: "How does Grok Bot handle my data & privacy?",
    answer: "Grok Bot uses the same Cursor SSO, auth, and privacy mode you already trust. Your cloud computer is encrypted in transit and at rest, with training opt-out. Sensitive actions can go through Auto Review before they run. Enterprise admins can set DLP, certs, proxies, and network controls at boot."
  }
];
