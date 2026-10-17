import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const AnnouncementBadge: React.FC = () => {
  return (
    <a
      href="https://x.ai/news/introducing-grok-bot"
      className="group/launch mx-auto inline-flex max-w-full items-center gap-1.5 rounded-full border border-border/80 bg-card/60 px-3 py-1.5 text-xs transition-colors hover:border-foreground/20 hover:bg-card mb-5 sm:mb-6 shadow-sm"
    >
      <span className="font-semibold text-foreground">Grok Bot is here</span>
      <span className="hidden sm:inline text-foreground/40">•</span>
      <span className="hidden sm:inline text-foreground/70 group-hover/launch:text-foreground transition-colors">
        Read the launch post
      </span>
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-foreground/[0.06] text-foreground group-hover/launch:bg-foreground/10 transition-colors ml-0.5">
        <ArrowUpRight className="size-3" />
      </span>
    </a>
  );
};
