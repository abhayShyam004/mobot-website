import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { GrokBotMark } from '../common/GrokBotMark';

export const AnnouncementBadge: React.FC = () => {
  return (
    <a
      href="https://x.ai/news/introducing-grok-bot"
      className="group mx-auto inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-black/[0.03] py-1 ps-2 pe-2.5 text-xs font-medium text-black/80 hover:bg-black/[0.06] hover:text-black transition-all mb-5 shadow-2xs"
    >
      <span className="flex size-4 items-center justify-center rounded-full bg-[#f19d38] text-white">
        <GrokBotMark size={11} fgColor="#ffffff" bgColor="#f19d38" />
      </span>
      <span>MOBOT v1.1.2 is here</span>
      <span className="text-black/40">→</span>
      <span className="text-black/70 group-hover:text-black flex items-center gap-0.5">
        Read the launch post
        <ArrowUpRight className="size-3 text-black/50 group-hover:text-black transition-colors" />
      </span>
    </a>
  );
};
