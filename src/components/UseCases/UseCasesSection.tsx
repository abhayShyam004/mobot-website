import React, { useState, useEffect } from 'react';
import { USE_CASES_DATA } from '../../data/useCases';
import { GrokBotMark } from '../common/GrokBotMark';

export const UseCasesSection: React.FC = () => {
  const [activeSlug, setActiveSlug] = useState<string>(USE_CASES_DATA[0].slug);

  const activeBot =
    USE_CASES_DATA.find((b) => b.slug === activeSlug) || USE_CASES_DATA[0];

  useEffect(() => {
    const handleHash = () => {
      const match = /^#use-cases\/(.+)$/.exec(window.location.hash);
      if (match) {
        const found = USE_CASES_DATA.find((b) => b.slug === match[1]);
        if (found) {
          setActiveSlug(found.slug);
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  return (
    <section id="use-cases" className="overflow-hidden py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[var(--site-content-width,1280px)] px-4 sm:px-6">
        <div className="flex flex-col gap-7 max-w-3xl">
          <h2 className="font-display text-3xl font-normal tracking-tight text-balance sm:text-4xl text-black">
            Give each Bot a job
          </h2>

          {/* Interactive Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {USE_CASES_DATA.map((bot) => {
              const isActive = bot.slug === activeSlug;
              return (
                <button
                  key={bot.slug}
                  type="button"
                  data-pill-item="true"
                  aria-pressed={isActive}
                  onClick={() => setActiveSlug(bot.slug)}
                  className={`inline-flex h-8 cursor-pointer items-center rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? `pl-[6px] pr-3.5 border shadow-2xs`
                      : 'px-3.5 text-black/60 border border-black/[0.08] bg-transparent hover:text-black hover:bg-black/[0.03]'
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: `${bot.avatarColor}12`,
                          color: bot.avatarColor,
                          borderColor: `${bot.avatarColor}40`,
                        }
                      : {}
                  }
                >
                  {isActive && (
                    <span
                      className="mr-1.5 flex size-4 shrink-0 items-center justify-center rounded-full overflow-hidden"
                      style={{ backgroundColor: bot.avatarColor }}
                    >
                      <GrokBotMark size={11} fgColor="#ffffff" bgColor={bot.avatarColor} />
                    </span>
                  )}
                  {bot.name}
                </button>
              );
            })}
          </div>

          {/* Dynamic Description */}
          <div className="min-h-[4.5rem] pt-1">
            <p className="text-base sm:text-lg leading-relaxed text-balance">
              <span className="font-semibold text-black">{activeBot.lead}</span>{' '}
              <span className="text-black/65 font-normal">
                {activeBot.description}
              </span>
            </p>
          </div>

          {/* CTA Link */}
          <div className="pt-1">
            <a
              href="#pricing"
              className="inline-flex shrink-0 items-center justify-center rounded-full border border-black/[0.08] bg-[#f5f5f7] px-5 py-2.5 text-xs sm:text-sm font-medium text-black hover:bg-[#ebebed] transition-colors"
            >
              Explore more bots
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
