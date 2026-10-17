import React, { useState } from 'react';
import { INDIVIDUAL_TIERS, TEAMS_TIERS } from '../../data/pricing';
import type { PricingTier } from '../../data/pricing';
import { Check, RefreshCw } from 'lucide-react';

export const PricingSection: React.FC = () => {
  const [tab, setTab] = useState<'individual' | 'teams'>('individual');

  const tiers: PricingTier[] = tab === 'individual' ? INDIVIDUAL_TIERS : TEAMS_TIERS;

  return (
    <section id="pricing" className="overflow-hidden py-20 sm:py-28">
      <div className="mx-auto flex w-full max-w-[var(--site-content-width,1280px)] flex-col gap-10 px-4 sm:px-6">
        {/* Section Heading & Contact Sales */}
        <div className="flex flex-col items-center gap-4">
          <h2 className="font-display text-3xl font-normal tracking-tight text-balance sm:text-4xl text-center text-black">
            Pricing
          </h2>
          <a
            href="https://cursor.com/contact-sales?product=grok-bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-[#f4f4f6] border border-black/[0.06] text-black px-5 py-2 text-xs sm:text-sm font-medium hover:bg-[#eaeaea] transition-colors"
          >
            Contact sales
          </a>
        </div>

        {/* Individual / Teams Tab Toggle */}
        <div className="flex w-full flex-col items-center gap-8">
          <div
            role="group"
            aria-label="Choose Individual or Teams plans"
            className="bg-[#ebebed] flex rounded-full p-1"
          >
            <button
              type="button"
              aria-pressed={tab === 'individual'}
              onClick={() => setTab('individual')}
              className={`rounded-full px-5 py-1.5 text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                tab === 'individual'
                  ? 'bg-white text-black shadow-xs'
                  : 'text-black/60 hover:text-black'
              }`}
            >
              Individual
            </button>
            <button
              type="button"
              aria-pressed={tab === 'teams'}
              onClick={() => setTab('teams')}
              className={`rounded-full px-5 py-1.5 text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                tab === 'teams'
                  ? 'bg-white text-black shadow-xs'
                  : 'text-black/60 hover:text-black'
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
                className="bg-[#f8f8fa] flex h-full flex-col justify-between rounded-3xl border border-black/[0.06] p-6 sm:p-8 shadow-2xs transition-all hover:border-black/[0.12]"
              >
                <div>
                  <div className="flex min-h-7 items-center justify-between gap-3">
                    <h3 className="text-black/60 text-xs sm:text-sm font-medium">{tier.name}</h3>
                  </div>

                  <p className="mt-3 flex min-w-0 items-baseline gap-1.5">
                    <span className="font-display shrink-0 text-4xl tracking-tight font-normal text-black">
                      ${tier.priceMonthly}
                    </span>
                    <span className="text-black/60 min-w-0 truncate text-xs sm:text-sm">
                      {tier.period}
                    </span>
                  </p>
                  <p className="text-black/50 mt-1 min-h-5 text-xs">
                    {tier.billedNote}
                  </p>

                  <a
                    href={tier.buttonHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-black text-white hover:bg-black/85 h-10 px-6 text-xs sm:text-sm mt-6 w-full font-medium transition-all shadow-xs"
                  >
                    {tier.buttonText}
                  </a>

                  <p className="text-black mt-8 text-xs sm:text-sm font-medium">
                    {tier.includesHeading}
                  </p>

                  <ul className="mt-3 grid content-start gap-2.5">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                        <Check className="text-black/50 mt-0.5 size-3.5 shrink-0 stroke-[2.5]" />
                        <span className="text-black/70 text-xs leading-relaxed">
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          {/* Lower Eligibility Strip */}
          <div className="mt-4 flex w-full max-w-5xl flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-black/[0.06] bg-[#f8f8fa] px-6 py-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <RefreshCw className="size-4 text-black/50 shrink-0" />
              <span className="text-black text-xs sm:text-sm">
                Already on an eligible Premium, Super, Ultra, Teams, or Enterprise plan?{' '}
                <span className="text-black/60">Grok Bot is included.</span>
              </span>
            </div>

            <a
              href="https://grok.com/?product=grok-bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center rounded-full border border-black/[0.08] bg-white px-4 py-2 text-xs font-medium text-black hover:bg-black/[0.04] transition-colors shadow-2xs"
            >
              Sign in with your plan
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
