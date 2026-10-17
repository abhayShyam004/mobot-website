// Type definitions for Grok Bot website reconstruction

export interface BotAgent {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  lastActive: string;
  initialAgentMsg: string;
  initialUserMsg: string;
  initialBotReply: string;
  routineName?: string;
  routineStatus?: string;
}

export interface UseCaseData {
  id: string;
  title: string;
  category: string;
  prompt: string;
  reply: string;
  routine: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
  ctaHref: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
