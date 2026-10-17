export interface FeatureCardData {
  id: string;
  title: string;
  description: string;
  type: "computer" | "recording" | "memory" | "connected";
}

export const FEATURES_DATA: FeatureCardData[] = [
  {
    id: "computer",
    title: "Grok Bot works where you work",
    description: "Log Grok Bot in once. It uses your apps and websites just like you would, including the tools that are harder to navigate.",
    type: "computer"
  },
  {
    id: "recording",
    title: "Show a Bot how it’s done",
    description: "Ask a Bot to follow along as you complete a workflow once. It saves it as a routine and runs it on its own next time.",
    type: "recording"
  },
  {
    id: "memory",
    title: "Bots get smarter over time",
    description: "Bots keep context and learn from each other. Show one a workflow today, hand off the project by Friday.",
    type: "memory"
  },
  {
    id: "connected",
    title: "Connect the Bots",
    description: "Put a few Bots in the same thread and they pass work between themselves. You watch them take action instead of approving every step.",
    type: "connected"
  }
];
