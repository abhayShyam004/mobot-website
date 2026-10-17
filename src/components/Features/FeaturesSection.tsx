import React, { useState, useEffect } from 'react';
import { FEATURES_DATA } from '../../data/features';
import { GrokBotMark } from '../common/GrokBotMark';
import { TrafficLights } from '../common/TrafficLights';

export const FeaturesSection: React.FC = () => {
  // Timer simulation for the recording card
  const [recordSec, setRecordSec] = useState(5);
  useEffect(() => {
    const timer = setInterval(() => {
      setRecordSec((s) => (s >= 59 ? 1 : s + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (s: number) => `00:${s.toString().padStart(2, '0')}`;

  return (
    <section id="features" className="overflow-hidden py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[var(--site-content-width,1280px)] px-4 sm:px-6 flex flex-col gap-12 lg:gap-16">
        {/* Section Header */}
        <div className="mx-auto flex max-w-2xl flex-col gap-4 text-center">
          <h2 className="font-display text-3xl tracking-tight text-balance sm:text-4xl text-black font-normal">
            Work with many Bots at once
          </h2>
          <p className="text-black/65 text-base leading-relaxed text-pretty sm:text-lg sm:leading-relaxed font-normal">
            Create a Bot, give it a task, and add another when the work grows—one on a project, one on outbound, one on systems. AI teammates work in parallel, collaborate where it makes sense, and keep working 24/7.
          </p>
        </div>

        {/* Feature Cards Grid (2x2) */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Card 1: Grok Bot works where you work */}
          <article className="bg-[#f7f7f9] flex flex-col justify-between overflow-hidden rounded-3xl border border-black/[0.06] p-6 sm:p-8 shadow-2xs">
            <div className="mb-6">
              <h3 className="text-black text-base sm:text-lg font-medium text-pretty mb-2">
                {FEATURES_DATA[0].title}
              </h3>
              <p className="text-black/65 text-sm leading-relaxed text-pretty">
                {FEATURES_DATA[0].description}
              </p>
            </div>

            <figure className="mt-auto pt-2">
              <div className="rounded-2xl border border-black/[0.08] bg-white p-3.5 shadow-sm space-y-3">
                {/* Computer Bar */}
                <div className="flex items-center justify-between border-b border-black/[0.05] pb-2 px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-black">Computer</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                      <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Working
                    </span>
                  </div>
                </div>

                <p className="text-xs text-black/80 px-1 font-sans">
                  Sign in to Zendesk so I can work the support queue.
                </p>

                {/* Mock Zendesk Window */}
                <div className="rounded-xl border border-black/[0.08] bg-[#fbfbfd] p-3 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-black/[0.05]">
                    <TrafficLights />
                    <span className="text-[10px] font-mono text-black/40">zendesk.com/tickets</span>
                    <div className="w-8" />
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-black/[0.05]">
                      <span className="font-medium text-black">Ticket #8492 — SLA Priority: High</span>
                      <span className="text-emerald-600 font-mono text-[10px]">✓ Resolved</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-black/[0.05]">
                      <span className="font-medium text-black">Ticket #8493 — Account Provisioning</span>
                      <span className="text-amber-600 font-mono text-[10px]">Processing</span>
                    </div>
                  </div>
                </div>
              </div>
            </figure>
          </article>

          {/* Card 2: Show a Bot how it’s done */}
          <article className="bg-[#f7f7f9] flex flex-col justify-between overflow-hidden rounded-3xl border border-black/[0.06] p-6 sm:p-8 shadow-2xs">
            <div className="mb-6">
              <h3 className="text-black text-base sm:text-lg font-medium text-pretty mb-2">
                {FEATURES_DATA[1].title}
              </h3>
              <p className="text-black/65 text-sm leading-relaxed text-pretty">
                {FEATURES_DATA[1].description}
              </p>
            </div>

            <figure className="mt-auto pt-2">
              <div className="rounded-2xl border border-black/[0.08] bg-gradient-to-tr from-amber-100/60 via-rose-100/40 to-sky-100/60 p-4 shadow-sm space-y-3">
                {/* Top Recording Bar */}
                <div className="flex items-center justify-between rounded-xl bg-white/90 backdrop-blur-md border border-black/[0.06] px-3 py-1.5 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-red-500 animate-ping" />
                    <span className="text-xs font-medium text-black">
                      Weekly Reporting <span className="text-black/50">is watching and learning</span>
                    </span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-red-500">
                    {formatTimer(recordSec)}
                  </span>
                </div>

                {/* Simulated Analytics Report Screen */}
                <div className="rounded-xl border border-black/[0.08] bg-white p-3 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between pb-1 text-[11px] text-black/60 font-mono">
                    <span>Revenue Metrics Summary</span>
                    <span>Q3 2026</span>
                  </div>
                  {/* Bar chart mock */}
                  <div className="flex items-end gap-2 h-16 pt-2 pb-1 border-b border-black/[0.05]">
                    <div className="w-full bg-black/10 rounded-t h-[40%]" />
                    <div className="w-full bg-black/15 rounded-t h-[65%]" />
                    <div className="w-full bg-black/20 rounded-t h-[50%]" />
                    <div className="w-full bg-black/30 rounded-t h-[85%]" />
                    <div className="w-full bg-black/70 rounded-t h-[100%]" />
                  </div>
                </div>
              </div>
            </figure>
          </article>

          {/* Card 3: Bots get smarter over time */}
          <article className="bg-[#f7f7f9] flex flex-col justify-between overflow-hidden rounded-3xl border border-black/[0.06] p-6 sm:p-8 shadow-2xs">
            <div className="mb-6">
              <h3 className="text-black text-base sm:text-lg font-medium text-pretty mb-2">
                {FEATURES_DATA[2].title}
              </h3>
              <p className="text-black/65 text-sm leading-relaxed text-pretty">
                {FEATURES_DATA[2].description}
              </p>
            </div>

            <figure className="mt-auto pt-2">
              <div className="rounded-2xl border border-black/[0.08] bg-white p-4 shadow-sm space-y-3">
                <div className="rounded-xl bg-[#f7f7f9] p-3 text-xs leading-relaxed text-black/80 space-y-2 border border-black/[0.05]">
                  <p>
                    Acme replied on pricing, same thread as last quarter. I already had the context, so I answered without waiting on you.
                  </p>
                  <p className="text-black/60">
                    Noted for next time: they only sign annual, and Dana is the one who approves.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1 text-[11px] text-black/60">
                  <div className="flex size-4 items-center justify-center rounded-full bg-purple-600 text-white">
                    <GrokBotMark size={10} fgColor="#ffffff" bgColor="#9333ea" />
                  </div>
                  <span>
                    Updated memory for <strong className="font-semibold text-black">Account Manager</strong>
                  </span>
                </div>
              </div>
            </figure>
          </article>

          {/* Card 4: Connect the Bots */}
          <article className="bg-[#f7f7f9] flex flex-col justify-between overflow-hidden rounded-3xl border border-black/[0.06] p-6 sm:p-8 shadow-2xs">
            <div className="mb-6">
              <h3 className="text-black text-base sm:text-lg font-medium text-pretty mb-2">
                {FEATURES_DATA[3].title}
              </h3>
              <p className="text-black/65 text-sm leading-relaxed text-pretty">
                {FEATURES_DATA[3].description}
              </p>
            </div>

            <figure className="mt-auto pt-2 flex items-center justify-center min-h-[160px]">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-black/[0.08] bg-white px-4 py-2 shadow-sm">
                <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 text-xs font-semibold">
                  ?
                </span>
                <span className="text-xs font-medium text-black">
                  Asking Research...
                </span>
                <div className="flex -space-x-1 pl-1">
                  <span className="size-4 rounded-full bg-teal-500 border border-white" />
                  <span className="size-4 rounded-full bg-red-500 border border-white" />
                  <span className="size-4 rounded-full bg-amber-500 border border-white" />
                </div>
              </div>
            </figure>
          </article>
        </div>
      </div>
    </section>
  );
};
