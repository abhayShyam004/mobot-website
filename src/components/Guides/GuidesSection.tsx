import React from 'react';

export const GuidesSection: React.FC = () => {
  return (
    <section id="guides" className="overflow-hidden">
      <div className="mx-auto w-full max-w-[var(--site-content-width,1280px)] px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <h2 className="font-display text-3xl font-normal tracking-tight text-balance sm:text-4xl text-foreground">
              Grok Bot Guides
            </h2>
            <p className="text-foreground/90 max-w-xl text-base sm:text-lg leading-relaxed text-balance">
              How PMs, designers, and GTM run Grok Bot day to day.
            </p>
          </div>

          <a
            href="https://cursor.com/bot/guides"
            className="inline-flex items-center justify-center rounded-full border border-border/50 bg-foreground/[0.04] text-foreground hover:bg-foreground/[0.08] h-11 px-6 text-base font-normal transition-colors"
          >
            Read the guides
          </a>
        </div>
      </div>
    </section>
  );
};
