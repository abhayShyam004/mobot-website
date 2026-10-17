import React, { useState, useEffect } from 'react';
import { FEATURES_DATA } from '../../data/features';
import { GrokBotMark } from '../common/GrokBotMark';
import { TrafficLights } from '../common/TrafficLights';
import { Check, Globe, Sparkles, ArrowRight } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  // Timer simulation for the recording card
  const [recordSec, setRecordSec] = useState(4);
  useEffect(() => {
    const timer = setInterval(() => {
      setRecordSec((s) => (s >= 59 ? 1 : s + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (s: number) => `00:${s.toString().padStart(2, '0')}`;

  return (
    <section id="features" className="overflow-hidden py-20 sm:py-28">
      <div className="mx-auto w-full px-4 lg:px-6 xl:max-w-7xl flex flex-col gap-10 lg:gap-14">
        {/* Section Header */}
        <div className="mx-auto flex max-w-2xl flex-col gap-4 text-center">
          <h2 className="font-display text-3xl tracking-tight text-balance sm:text-4xl text-foreground font-normal">
            Work with many Bots at once
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed text-pretty sm:text-lg sm:leading-relaxed">
            Create a Bot, give it a task, and add another when the work grows—one on a project, one on outbound, one on systems. AI teammates work in parallel, collaborate where it makes sense, and keep working 24/7.
          </p>
        </div>

        {/* Feature Cards Grid (2x2) */}
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Card 1: Grok Bot works where you work */}
          <article className="bg-card flex flex-col justify-between overflow-hidden rounded-3xl border border-border/40 p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <h3 className="text-foreground text-lg font-medium text-pretty mb-2">
                {FEATURES_DATA[0].title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
                {FEATURES_DATA[0].description}
              </p>
            </div>

            <figure className="mt-auto pt-4">
              <div className="feature-card-stage rounded-2xl border border-border/50 bg-[var(--grok-bot-bg-chrome,#141414)] p-3 overflow-hidden shadow-inner">
                <div className="flex items-center justify-between pb-2 border-b border-border/30 px-1">
                  <TrafficLights />
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground bg-foreground/[0.05] px-2 py-0.5 rounded-md">
                    <Globe className="size-3 text-sky-400" />
                    <span>zendesk.com/tickets/8492</span>
                  </div>
                  <div className="w-10" />
                </div>

                <div className="p-3 text-xs space-y-2.5">
                  <div className="flex items-center justify-between text-muted-foreground font-mono text-[11px]">
                    <span>Ticket #8492 — SLA Priority: High</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="size-3" /> Resolved
                    </span>
                  </div>
                  <div className="rounded-xl bg-[var(--grok-bot-bg-editor,#1c1c1c)] p-3 border border-border/30 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded-full bg-violet-600 flex items-center justify-center">
                        <GrokBotMark size={12} fgColor="#ffffff" bgColor="#7c3aed" />
                      </div>
                      <span className="font-medium text-foreground text-[12px]">Support Bot</span>
                      <span className="text-[10px] text-muted-foreground font-mono">1m ago</span>
                    </div>
                    <p className="text-muted-foreground text-[12px] leading-relaxed">
                      Cross-referenced customer database and automatically regenerated active API credentials. Confirmation email dispatched.
                    </p>
                  </div>
                </div>
              </div>
            </figure>
          </article>

          {/* Card 2: Show a Bot how it’s done (Screen Recording) */}
          <article className="bg-card flex flex-col justify-between overflow-hidden rounded-3xl border border-border/40 p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <h3 className="text-foreground text-lg font-medium text-pretty mb-2">
                {FEATURES_DATA[1].title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
                {FEATURES_DATA[1].description}
              </p>
            </div>

            <figure className="mt-auto pt-4">
              <div className="feature-card-stage rounded-2xl border border-red-500/30 bg-[var(--grok-bot-bg-chrome,#141414)] p-3 overflow-hidden shadow-inner">
                {/* Recording Top Bar */}
                <div className="feature-recording__bar flex items-center justify-between rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="relative flex size-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full size-2.5 bg-red-500" />
                    </span>
                    <span className="font-medium text-foreground text-[12px]">
                      Weekly Reporting <span className="text-muted-foreground">is watching and learning</span>
                    </span>
                  </div>
                  <span className="font-mono text-red-400 font-semibold text-[11px]">
                    {formatTimer(recordSec)}
                  </span>
                </div>

                {/* Simulated Workflow Screen with Action Cursor */}
                <div className="mt-3 rounded-xl bg-[var(--grok-bot-bg-editor,#1c1c1c)] p-3.5 border border-dashed border-red-500/40 relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono text-muted-foreground">Exporting Monthly Revenue.csv</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-foreground/10 text-foreground/80">
                      Step 2 of 4
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-foreground/10 overflow-hidden">
                    <div className="h-full bg-red-500 w-1/2 transition-all duration-300" />
                  </div>
                  <p className="mt-2.5 text-[11px] text-muted-foreground">
                    Action recorded: Download invoice summary and upload to Google Drive folder.
                  </p>
                </div>
              </div>
            </figure>
          </article>

          {/* Card 3: Bots get smarter over time */}
          <article className="bg-card flex flex-col justify-between overflow-hidden rounded-3xl border border-border/40 p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <h3 className="text-foreground text-lg font-medium text-pretty mb-2">
                {FEATURES_DATA[2].title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
                {FEATURES_DATA[2].description}
              </p>
            </div>

            <figure className="mt-auto pt-4">
              <div className="feature-card-stage rounded-2xl border border-border/50 bg-[var(--grok-bot-bg-chrome,#141414)] p-3 overflow-hidden shadow-inner space-y-2">
                <div className="flex items-center justify-between px-1 text-xs text-muted-foreground font-mono">
                  <span>Learned Knowledge Graph</span>
                  <span className="text-amber-400 flex items-center gap-1">
                    <Sparkles className="size-3" /> 18 Routines
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="rounded-xl bg-[var(--grok-bot-bg-editor,#1c1c1c)] p-2.5 border border-border/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full bg-emerald-400" />
                      <span className="text-foreground font-medium">Stripe Reconciliation</span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">Self-executing daily</span>
                  </div>

                  <div className="rounded-xl bg-[var(--grok-bot-bg-editor,#1c1c1c)] p-2.5 border border-border/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full bg-emerald-400" />
                      <span className="text-foreground font-medium">AWS Billing Alert Dispatch</span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">Threshold &gt; $500</span>
                  </div>

                  <div className="rounded-xl bg-[var(--grok-bot-bg-editor,#1c1c1c)] p-2.5 border border-border/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full bg-emerald-400" />
                      <span className="text-foreground font-medium">QBR Slides Template Filler</span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">Tuesdays at 9am</span>
                  </div>
                </div>
              </div>
            </figure>
          </article>

          {/* Card 4: Connect the Bots */}
          <article className="bg-card flex flex-col justify-between overflow-hidden rounded-3xl border border-border/40 p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <h3 className="text-foreground text-lg font-medium text-pretty mb-2">
                {FEATURES_DATA[3].title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
                {FEATURES_DATA[3].description}
              </p>
            </div>

            <figure className="mt-auto pt-4">
              <div className="feature-card-stage rounded-2xl border border-border/50 bg-[var(--grok-bot-bg-chrome,#141414)] p-4 overflow-hidden shadow-inner">
                <div className="flex items-center justify-center gap-3 py-4">
                  {/* Bot 1 */}
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="size-11 rounded-full bg-emerald-600 flex items-center justify-center shadow-md">
                      <GrokBotMark size={24} fgColor="#ffffff" bgColor="#059669" />
                    </div>
                    <span className="text-[11px] font-medium text-foreground">Chief</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1 text-muted-foreground font-mono text-[10px] bg-foreground/5 px-2 py-0.5 rounded-full">
                      <span>passes context</span>
                      <ArrowRight className="size-3" />
                    </div>
                    <div className="w-16 h-[1px] bg-border/60" />
                  </div>

                  {/* Bot 2 */}
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="size-11 rounded-full bg-amber-500 flex items-center justify-center shadow-md">
                      <GrokBotMark size={24} fgColor="#ffffff" bgColor="#d97706" />
                    </div>
                    <span className="text-[11px] font-medium text-foreground">Scout</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1 text-muted-foreground font-mono text-[10px] bg-foreground/5 px-2 py-0.5 rounded-full">
                      <span>passes context</span>
                      <ArrowRight className="size-3" />
                    </div>
                    <div className="w-16 h-[1px] bg-border/60" />
                  </div>

                  {/* Bot 3 */}
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="size-11 rounded-full bg-indigo-600 flex items-center justify-center shadow-md">
                      <GrokBotMark size={24} fgColor="#ffffff" bgColor="#4f46e5" />
                    </div>
                    <span className="text-[11px] font-medium text-foreground">Legal</span>
                  </div>
                </div>

                <div className="rounded-xl bg-[var(--grok-bot-bg-editor,#1c1c1c)] p-2.5 text-center text-xs text-muted-foreground font-mono border border-border/30">
                  ⚡ Autonomous pipeline: Scout aggregates leads → Legal vets compliance → Chief emails executive summary
                </div>
              </div>
            </figure>
          </article>
        </div>
      </div>
    </section>
  );
};
