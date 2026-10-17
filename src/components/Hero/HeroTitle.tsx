import React from 'react';
import { GrokBotMark } from '../common/GrokBotMark';

export const HeroTitle: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-4 max-w-2xl text-center">
      <h1 className="font-display text-4xl leading-[1.08] tracking-tight text-black sm:text-5xl lg:text-[64px] font-normal flex items-center justify-center flex-wrap gap-x-3.5 gap-y-1">
        <span>Meet</span>
        <span className="inline-flex items-center align-middle mx-0.5 -translate-y-0.5">
          <span className="inline-flex size-[0.88em] items-center justify-center rounded-full bg-black text-white p-1.5 shadow-sm">
            <GrokBotMark size="100%" fgColor="#ffffff" bgColor="#000000" />
          </span>
        </span>
        <span>Grok Bot</span>
      </h1>

      <p className="max-w-xl text-base sm:text-lg leading-relaxed text-black/65 text-balance font-normal">
        AI teammates you can give real work to. Bots can sign in to your tools, use them just like you do, and come back with finished work.
      </p>
    </div>
  );
};
