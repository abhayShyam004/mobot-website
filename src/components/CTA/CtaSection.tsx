import React from 'react';
import { GrokBotMark } from '../common/GrokBotMark';

export const CtaSection: React.FC = () => {
  return (
    <section id="get-started" className="overflow-hidden">
      <div className="mx-auto w-full max-w-[var(--site-content-width,1280px)] px-4 pt-24 sm:px-6 sm:pt-32">
        <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <h2 className="font-display text-3xl font-normal tracking-tight text-balance sm:text-4xl text-foreground">
              Meet your first Bot
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed text-balance sm:text-base">
              An AI teammate you can trust to get work done
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <a
                href="#download"
                className="inline-flex items-center justify-center rounded-full bg-[var(--grok-bot-fill-emphasis,#f0f0f0)] text-[var(--grok-bot-bubble-user-ink,#141414)] hover:opacity-90 h-11 px-6 text-base font-normal transition-all shadow-xs"
              >
                Get started for free
              </a>
              <a
                href="https://cursor.com/contact-sales?product=grok-bot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-border/50 bg-foreground/[0.04] text-foreground hover:bg-foreground/[0.08] h-11 px-6 text-base font-normal transition-colors"
              >
                Contact sales
              </a>
            </div>
          </div>
        </div>

        {/* Large Wireframe Character Illustration at Bottom */}
        <div className="mt-16 sm:mt-20 flex justify-center overflow-hidden">
          <div className="footer-character flex justify-center text-foreground/40 hover:text-foreground/70 transition-colors duration-500">
            <GrokBotMark size={380} variant="wireframe" fgColor="currentColor" bgColor="transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};
