import React from 'react';
import { GrokBotMark } from '../common/GrokBotMark';

export const StatementSection: React.FC = () => {
  return (
    <section id="statement" className="overflow-x-clip py-12 sm:py-16">
      <div className="mx-auto w-full max-w-[var(--site-content-width,1280px)] px-4 sm:px-6">
        <div className="statement-card bg-[#f4f4f6] relative flex rounded-3xl md:min-h-[22rem] border border-black/[0.06] overflow-hidden shadow-2xs">
          {/* Left Text Block */}
          <div className="relative z-10 flex w-full min-w-0 flex-col justify-center gap-4 p-8 pb-48 sm:gap-5 sm:px-12 sm:py-12 md:pr-[42%] md:pb-12">
            <h2 className="font-display text-3xl font-normal tracking-tight text-balance sm:text-4xl text-black">
              Message Bots like teammates
            </h2>
            <p className="text-black/65 max-w-md text-base leading-relaxed text-pretty sm:text-lg sm:leading-relaxed font-normal">
              Give tasks to Bots like you would a teammate on desktop or iOS. Your AI
              teammates take projects from start to end, keep context on how you work
              and get smarter over time, and come back when your approval is needed.
            </p>
          </div>

          {/* Statement Mascot Popout (Solid Black Mascot Peering In) */}
          <div
            aria-hidden="true"
            className="statement-pop pointer-events-none absolute right-[-40px] sm:right-[-20px] md:right-[-10px] lg:right-4 bottom-[-15%] sm:bottom-[-20%] md:bottom-[-22%] flex items-center justify-center transition-transform hover:scale-105 duration-500"
          >
            <div className="statement-pop__frame flex items-center justify-center">
              <div className="statement-character-panel text-black">
                <GrokBotMark size={380} fgColor="#000000" bgColor="#ffffff" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
