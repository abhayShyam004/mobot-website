import React, { useState } from 'react';
import { INDIVIDUAL_TIERS, TEAMS_TIERS } from '../../data/pricing';
import type { PricingTier } from '../../data/pricing';
import { Check, Sparkles } from 'lucide-react';

export const PricingSection: React.FC = () => {
  const [tab, setTab] = useState<'individual' | 'teams'>('individual');

  const tiers: PricingTier[] = tab === 'individual' ? INDIVIDUAL_TIERS : TEAMS_TIERS;

  return (
    <section id="pricing" className="overflow-hidden py-20 sm:py-28">
      <div className="mx-auto flex w-full max-w-[var(--site-content-width,1280px)] flex-col gap-10 px-4 sm:px-6">
        {/* Section Heading & Contact Sales */}
        <div className="flex flex-col items-center gap-5">
          <h2 className="font-display text-3xl font-normal tracking-tight text-balance sm:text-4xl text-center text-foreground">
            Pricing
          </h2>
          <a
            href="https://cursor.com/contact-sales?product=grok-bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-foreground/[0.04] border border-border/50 text-foreground px-5 py-2 text-sm font-medium hover:bg-foreground/[0.08] transition-colors"
          >
            Contact sales
          </a>
        </div>

        {/* Individual / Teams Tab Toggle */}
        <div className="flex w-full flex-col items-center gap-8">
          <div
            role="group"
            aria-label="Choose Individual or Teams plans"
            className="bg-foreground/[0.06] border border-border/40 flex rounded-full p-1"
          >
            <button
              type="button"
              aria-pressed={tab === 'individual'}
              onClick={() => setTab('individual')}
              className={`rounded-full px-5 py-1.5 text-sm font-medium transition-all ${
                tab === 'individual'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Individual
            </button>
            <button
              type="button"
              aria-pressed={tab === 'teams'}
              onClick={() => setTab('teams')}
              className={`rounded-full px-5 py-1.5 text-sm font-medium transition-all ${
                tab === 'teams'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Teams
            </button>
          </div>

          {/* Pricing Cards Grid (3 Columns) */}
          <div className="grid w-full max-w-5xl gap-5 md:grid-cols-3">
            {tiers.map((tier) => (
              <article
                key={tier.id}
                className="bg-card flex h-full flex-col justify-between rounded-3xl border border-border/40 p-6 sm:p-8 shadow-sm transition-all hover:border-border/80"
              >
                <div>
                  <div className="flex min-h-8 items-center justify-between gap-3">
                    <h3 className="text-foreground text-sm font-medium">{tier.name}</h3>
                  </div>

                  <p className="mt-3 flex min-w-0 items-baseline gap-1.5">
                    <span className="font-display shrink-0 text-4xl tracking-tight font-normal text-foreground">
                      ${tier.priceMonthly}
                    </span>
                    <span className="text-muted-foreground min-w-0 truncate text-sm">
                      {tier.period}
                    </span>
                  </p>
                  <p className="text-muted-foreground mt-1 min-h-5 text-xs">
                    {tier.billedNote}
                  </p>

                  <a
                    href={tier.buttonHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-[var(--grok-bot-fill-emphasis,#f0f0f0)] text-[var(--grok-bot-bubble-user-ink,#141414)] hover:opacity-90 h-11 px-6 text-sm mt-6 w-full font-medium transition-all shadow-xs"
                  >
                    {tier.buttonText}
                  </a>

                  <p className="text-foreground mt-8 text-sm font-medium">
                    {tier.includesHeading}
                  </p>

                  <ul className="mt-3 grid content-start gap-2.5">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="text-muted-foreground mt-0.5 size-4 shrink-0 stroke-[2]" />
                        <span className="text-muted-foreground text-xs leading-relaxed">
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          {/* Inclusion Banner at Bottom */}
          <div className="mt-4 flex w-full max-w-5xl flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-border/40 bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-foreground/10 text-foreground shrink-0">
                <Sparkles className="size-4" />
              </div>
              <span className="text-foreground text-sm">
                Already on an eligible Premium, Super, Ultra, Teams, or Enterprise plan?{' '}
                <span className="text-muted-foreground">Grok Bot is included.</span>
              </span>
            </div>

            <a
              href="https://grok.com/?product=grok-bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center rounded-full border border-border/50 bg-foreground/[0.04] px-5 py-2.5 text-sm font-medium text-foreground hover:bg-foreground/[0.08] transition-colors"
            >
              Sign in with your plan
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
