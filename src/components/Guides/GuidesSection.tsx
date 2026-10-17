import React from 'react';

export const GuidesSection: React.FC = () => {
  return (
    <section id="guides" className="overflow-hidden py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[var(--site-content-width,1280px)] px-4 sm:px-6">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <h2 className="font-display text-3xl font-normal tracking-tight text-balance sm:text-4xl text-black">
              Grok Bot Guides
            </h2>
            <p className="text-black/65 max-w-xl text-base sm:text-lg leading-relaxed text-balance font-normal">
              How PMs, designers, and GTM run Grok Bot day to day.
            </p>
          </div>

          <a
            href="https://cursor.com/bot/guides"
            className="inline-flex items-center justify-center rounded-full border border-black/[0.08] bg-[#f5f5f7] text-black hover:bg-[#ebebed] h-10 px-6 text-xs sm:text-sm font-medium transition-colors"
          >
            Read the guides
          </a>
        </div>
      </div>
    </section>
  );
};
