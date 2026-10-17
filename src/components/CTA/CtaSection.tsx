import React from 'react';
import { GrokBotMark } from '../common/GrokBotMark';

export const CtaSection: React.FC = () => {
  return (
    <section id="get-started" className="overflow-hidden pt-20 sm:pt-28">
      <div className="mx-auto w-full max-w-[var(--site-content-width,1280px)] px-4 sm:px-6">
        <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <h2 className="font-display text-3xl font-normal tracking-tight text-balance sm:text-4xl text-black">
              Meet your first Bot
            </h2>
            <p className="text-black/65 text-sm sm:text-base leading-relaxed text-balance font-normal">
              An AI teammate you can trust to get work done
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <a
              href="#download"
              className="inline-flex items-center justify-center rounded-full bg-black text-white hover:bg-black/85 h-10 px-6 text-xs sm:text-sm font-medium transition-all shadow-xs"
            >
              Get started for free
            </a>
            <a
              href="https://cursor.com/contact-sales?product=grok-bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-black/[0.08] bg-[#f5f5f7] text-black hover:bg-[#eaeaea] h-10 px-6 text-xs sm:text-sm font-medium transition-colors"
            >
              Contact sales
            </a>
          </div>
        </div>

        {/* Massive Wireframe Character Outline at Bottom */}
        <div className="mt-14 sm:mt-20 flex justify-center overflow-hidden">
          <div className="footer-character flex justify-center text-[#e2e2e5] hover:text-[#c4c4c8] transition-colors duration-500">
            <GrokBotMark
              size={480}
              variant="wireframe"
              fgColor="currentColor"
              bgColor="transparent"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
