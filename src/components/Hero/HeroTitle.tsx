import React from 'react';
import { GrokBotMark } from '../common/GrokBotMark';

export const HeroTitle: React.FC = () => {
  return (
    <h1 className="font-display text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl text-center flex items-center justify-center flex-wrap gap-x-3 gap-y-1">
      <span>Meet</span>
      <span className="inline-flex items-center align-middle mx-1 -translate-y-0.5">
        <span className="inline-flex size-[0.9em] items-center justify-center rounded-full bg-foreground text-background p-1.5 shadow-md">
          <GrokBotMark size="100%" fgColor="currentColor" bgColor="#ffffff" />
        </span>
      </span>
      <span>Grok Bot</span>
    </h1>
  );
};
