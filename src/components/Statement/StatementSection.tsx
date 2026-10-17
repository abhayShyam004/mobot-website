import React from 'react';
import { GrokBotMark } from '../common/GrokBotMark';

export const StatementSection: React.FC = () => {
  return (
    <section id="statement" className="overflow-x-clip">
      <div className="mx-auto w-full px-4 lg:px-6 xl:max-w-7xl py-12 sm:py-16">
        <div className="statement-card bg-card relative flex rounded-3xl md:min-h-[22rem] border border-border/40 overflow-hidden shadow-sm">
          {/* Text block */}
          <div className="relative z-10 flex w-full min-w-0 flex-col justify-center gap-4 p-8 pb-44 sm:gap-5 sm:px-12 sm:py-10 md:pr-[42%] md:pb-10">
            <h2 className="font-display text-3xl font-normal tracking-tight text-balance sm:text-4xl text-foreground">
              Message Bots like teammates
            </h2>
            <p className="text-muted-foreground max-w-md text-base leading-relaxed text-pretty sm:text-lg sm:leading-relaxed">
              Give tasks to Bots like you would a teammate on desktop or iOS. Your AI
              teammates take projects from start to end, keep context on how you work
              and get smarter over time, and come back when your approval is needed.
            </p>
          </div>

          {/* Statement Mascot Popout */}
          <div
            aria-hidden="true"
            className="statement-pop pointer-events-none absolute right-4 bottom-[-15%] sm:right-10 md:right-12 md:bottom-[-20%] lg:right-16 flex items-center justify-center opacity-90 transition-transform hover:scale-105 duration-500"
          >
            <div className="statement-pop__frame flex items-center justify-center">
              <div className="statement-character-panel text-primary">
                <GrokBotMark size={320} fgColor="currentColor" bgColor="#141414" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
