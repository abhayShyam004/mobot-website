// Use Cases Controller & Phone Mockup Synchronization

import type { UseCaseData } from '../types';

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

const USE_CASES: Record<string, UseCaseData> = {
  'sales outbound': {
    id: 'sales-outbound',
    title: 'Sales Outbound',
    category: 'Sales',
    prompt: 'Overnight pipeline generation and outbound.\n\nPick eligible prospects from this Google Sheet, research them on the web, grab context from Salesforce, and draft personalized outreach.',
    reply: 'Salesforce connected. 18 qualified prospects queued for review.',
    routine: 'Salesforce Pipeline Sync'
  },
  'talent scout': {
    id: 'talent-scout',
    title: 'Talent Scout',
    category: 'Recruiting',
    prompt: 'Source top AI research scientists with recent NeurIPS publications and draft personal outreach.',
    reply: 'Screened 42 candidates. 5 strong matches drafted in your voice.',
    routine: 'Candidate Sourcing'
  },
  'paid media': {
    id: 'paid-media',
    title: 'Paid Media',
    category: 'Marketing',
    prompt: 'Audit Google & Meta ad campaigns for ROAS under 2.5x and reallocate budget.',
    reply: 'Paused 3 underperforming ad sets and reallocated $1,400 to top-performing creatives.',
    routine: 'Ad Spend Optimization'
  },
  'expense manager': {
    id: 'expense-manager',
    title: 'Expense Manager',
    category: 'Finance',
    prompt: 'Reconcile last month corporate card transactions with submitted receipts.',
    reply: '32 receipts matched automatically. 0 policy violations found.',
    routine: 'Expense Reconciliation'
  },
  'product performance': {
    id: 'product-performance',
    title: 'Product Performance',
    category: 'Engineering',
    prompt: 'Analyze API latency degradation during yesterday peak traffic surge.',
    reply: 'Identified bottleneck in database connection pool. PR created with fix.',
    routine: 'Telemetry Audit'
  },
  'bug reproduction': {
    id: 'bug-reproduction',
    title: 'Bug Reproduction',
    category: 'Engineering',
    prompt: 'Reproduce customer report #4021 regarding checkout failure on Safari.',
    reply: 'Reproduced in headless Safari: WebKit cookie storage edge case detected.',
    routine: 'E2E Test Runner'
  },
  'account health': {
    id: 'account-health',
    title: 'Account Health',
    category: 'Customer Success',
    prompt: 'Review customer sentiment and feature requests across top 20 enterprise accounts.',
    reply: 'Summarized feedback from Zendesk & Slack. Health score is 94/100.',
    routine: 'CSAT Monitoring'
  },
  'chief of staff': {
    id: 'chief-of-staff',
    title: 'Chief of Staff',
    category: 'Operations',
    prompt: 'Prepare executive briefing packet for Friday board meeting.',
    reply: 'Deck compiled with Q3 metrics, revenue projections, and key hiring milestones.',
    routine: 'Executive Briefing'
  }
};

export function initUseCases() {
  const uc = document.getElementById('use-cases');
  if (!uc) return;

  const pillButtons = Array.from(uc.querySelectorAll<HTMLButtonElement>('button[data-pill-item="true"]'));
  const phoneScreen = uc.querySelector('.mobile-phone-screen');
  const phoneHeader = phoneScreen?.querySelector('header');
  const phoneTranscript = phoneScreen?.querySelector('.baby-grok-bot-transcript');

  pillButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      // Clear pressed states
      pillButtons.forEach(b => {
        b.setAttribute('aria-pressed', 'false');
        (b as HTMLElement).style.background = '';
        (b as HTMLElement).style.boxShadow = '';
      });

      // Highlight active pill
      btn.setAttribute('aria-pressed', 'true');
      (btn as HTMLElement).style.background = 'light-dark(var(--color-brand-cyan-100),color-mix(in srgb,var(--color-brand-cyan-550) 32%,transparent))';
      (btn as HTMLElement).style.boxShadow = 'inset 0 0 0 1px color-mix(in srgb,var(--color-brand-cyan-300) 28%,transparent)';

      const btnText = btn.textContent?.toLowerCase().trim() || '';
      const matched = Object.keys(USE_CASES).find(k => btnText.includes(k));
      if (!matched) return;

      const data = USE_CASES[matched];

      // Update phone screen title
      if (phoneHeader) {
        const titleSpan = phoneHeader.querySelector('span.block.truncate');
        if (titleSpan) titleSpan.textContent = data.title;
      }

      // Update phone transcript
      if (phoneTranscript) {
        phoneTranscript.innerHTML = `
          <div class="flex flex-col gap-1">
            <div class="baby-grok-bot-entry-enter mt-2 first:mt-0">
              <div class="flex justify-end">
                <div class="relative max-w-[min(420px,85%)]">
                  <div class="px-3 py-2 text-[14px] leading-5 tracking-[-0.15px] whitespace-pre-wrap" style="background:var(--grok-bot-bubble-user);color:var(--grok-bot-bubble-user-ink);border-radius:16px">${escapeHtml(data.prompt)}</div>
                </div>
              </div>
            </div>
            <div class="baby-grok-bot-entry-enter mt-3 first:mt-0">
              <div class="flex max-w-[min(560px,92%)] flex-col items-start">
                <div class="relative">
                  <div class="baby-grok-bot-md px-3 py-2 text-[14px] leading-5 tracking-[-0.15px] whitespace-pre-wrap" style="background:var(--grok-bot-bubble-agent);color:var(--cursor-text-primary);border-radius:16px">
                    <span>${escapeHtml(data.reply)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="baby-grok-bot-entry-enter mt-3 first:mt-0">
              <div class="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-xs flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="inline-block size-2 rounded-full bg-cyan-400"></span>
                  <span class="font-medium text-white/90">${data.routine}</span>
                </div>
                <span class="text-white/60">Complete</span>
              </div>
            </div>
          </div>
        `;
      }
    });

    // Keyboard arrow navigation
    btn.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        (pillButtons[(index + 1) % pillButtons.length] as HTMLElement)?.focus();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        (pillButtons[(index - 1 + pillButtons.length) % pillButtons.length] as HTMLElement)?.focus();
      }
    });
  });
}
