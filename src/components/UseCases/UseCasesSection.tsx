import React, { useState, useEffect } from 'react';
import { USE_CASES_DATA } from '../../data/useCases';
import { GrokBotMark } from '../common/GrokBotMark';
import { TrafficLights } from '../common/TrafficLights';
import { CheckCircle2, Sparkles } from 'lucide-react';

export const UseCasesSection: React.FC = () => {
  const [activeSlug, setActiveSlug] = useState<string>(USE_CASES_DATA[0].slug);

  const activeBot =
    USE_CASES_DATA.find((b) => b.slug === activeSlug) || USE_CASES_DATA[0];

  // Hash change support
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
      <div className="mx-auto grid w-full max-w-[var(--site-content-width,1280px)] gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 items-start">
        {/* Left Column: Title, Pills, Description, CTA */}
        <div className="flex flex-col gap-8 text-center lg:py-6 lg:text-left">
          <h2 className="font-display text-3xl font-normal tracking-tight text-balance sm:text-4xl text-foreground">
            Give each Bot a job
          </h2>

          {/* Interactive Pills */}
          <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
            {USE_CASES_DATA.map((bot) => {
              const isActive = bot.slug === activeSlug;
              return (
                <button
                  key={bot.slug}
                  type="button"
                  data-pill-item="true"
                  aria-pressed={isActive}
                  onClick={() => setActiveSlug(bot.slug)}
                  className={`inline-flex h-8 cursor-pointer items-center rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? `pl-[5px] pr-3.5 bg-foreground/10 text-foreground ring-1 ring-border/80 shadow-xs`
                      : 'px-3 text-muted-foreground hover:text-foreground hover:bg-foreground/5'
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: `${bot.avatarColor}18`,
                          color: bot.avatarColor,
                          boxShadow: `inset 0 0 0 1px ${bot.avatarColor}40`,
                        }
                      : {}
                  }
                >
                  {isActive && (
                    <span className="mr-1.5 flex size-5 shrink-0 items-center justify-center rounded-full overflow-hidden" style={{ backgroundColor: bot.avatarColor }}>
                      <GrokBotMark size={14} fgColor="#ffffff" bgColor={bot.avatarColor} />
                    </span>
                  )}
                  {bot.name}
                </button>
              );
            })}
          </div>

          {/* Dynamic Description */}
          <div className="min-h-[5.5rem] transition-opacity duration-200">
            <p className="max-w-md text-pretty text-base leading-relaxed mx-auto lg:mx-0">
              <span className="text-foreground font-medium">{activeBot.lead}</span>{' '}
              <span className="text-muted-foreground font-normal">
                {activeBot.description}
              </span>
            </p>
          </div>

          {/* CTA Link */}
          <div className="pt-2">
            <a
              href="#pricing"
              className="relative isolate inline-flex shrink-0 items-center justify-center rounded-full border border-border/50 bg-foreground/[0.04] px-5 py-2.5 text-sm font-medium text-foreground hover:bg-foreground/[0.08] transition-colors"
            >
              Explore more bots
            </a>
          </div>
        </div>

        {/* Right Column: Live Bot Action Preview Stage */}
        <div className="min-w-0 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[420px] rounded-3xl border border-border/40 bg-[var(--grok-bot-bg-chrome,#141414)] p-4 shadow-xl overflow-hidden">
            {/* Phone / Device Top Bar */}
            <div className="flex items-center justify-between border-b border-border/30 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="flex size-7 items-center justify-center rounded-full"
                  style={{ backgroundColor: activeBot.avatarColor }}
                >
                  <GrokBotMark size={16} fgColor="#ffffff" bgColor={activeBot.avatarColor} />
                </div>
                <div>
                  <h4 className="text-xs font-medium text-foreground">{activeBot.name}</h4>
                  <span className="text-[10px] text-emerald-400 font-mono">Active</span>
                </div>
              </div>
              <TrafficLights />
            </div>

            {/* Simulated Live Thread */}
            <div className="space-y-3 p-1 text-xs">
              <div className="rounded-2xl rounded-tl-xs bg-[var(--grok-bot-bg-editor,#1c1c1c)] p-3 border border-border/30 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                  <Sparkles className="size-3 text-amber-400" />
                  <span>Routine execution summary</span>
                </div>
                <p className="text-foreground leading-relaxed text-[12.5px]">
                  {activeBot.lead}
                </p>
              </div>

              <div className="rounded-xl border border-border/40 bg-foreground/[0.02] p-3 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span>Batch Output Log</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="size-3" /> Ready for review
                  </span>
                </div>
                <div className="text-[11.5px] text-muted-foreground space-y-1">
                  <p>• {activeBot.description}</p>
                  <p>• Cross-referenced with local guidelines & safety filters.</p>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-3 py-1 text-[11px] font-medium rounded-full bg-foreground/[0.08] text-foreground hover:bg-foreground/15 transition-colors"
                  >
                    Inspect details
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 text-[11px] font-medium rounded-full bg-[var(--grok-bot-fill-emphasis,#f0f0f0)] text-[var(--grok-bot-bubble-user-ink,#141414)] hover:opacity-90 transition-opacity"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
