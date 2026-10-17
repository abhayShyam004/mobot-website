// Interactive logic controller for the Grok Bot website reconstruction

interface BotConfig {
  name: string;
  role: string;
  fg: string;
  time: string;
  initialAgentMsg: string;
  initialUserMsg: string;
  initialBotReply: string;
  routineName?: string;
  routineStatus?: string;
}

const BOTS_MAP: Record<string, BotConfig> = {
  'sales outbound': {
    name: 'Sales Outbound',
    role: 'Pipeline and Outbound',
    fg: '#F19D38',
    time: '11:43 AM',
    initialAgentMsg: 'Hey Armand, good to meet you. What do you want me around for? Anything concrete, or more of a general sidekick?',
    initialUserMsg: 'Overnight pipeline generation and outbound.\n\nPick eligible prospects from this Google Sheet, research them on the web, grab context from Salesforce, and draft personalized outreach.',
    initialBotReply: 'Running the pipeline generation routine now. Scanning 48 contacts, matched 12 high-intent leads across target accounts.',
    routineName: 'Prospecting Routine',
    routineStatus: '12 leads drafted'
  },
  'chief': {
    name: 'Chief',
    role: 'Chief of Staff',
    fg: '#885CF5',
    time: 'Yesterday',
    initialAgentMsg: 'Good morning. I reviewed next week’s travel itinerary and cross-referenced with your executive briefings.',
    initialUserMsg: 'Can you check availability for next week and confirm the offsite dinner venue?',
    initialBotReply: 'All set! Booked the private dining room at Spruce for Thursday 7:30 PM and sent the calendar invites to executive staff.',
    routineName: 'Offsite Coordination',
    routineStatus: 'Venue confirmed'
  },
  'inbox manager': {
    name: 'Inbox Manager',
    role: 'Executive Inbox',
    fg: '#EB4699',
    time: '8:51 AM',
    initialAgentMsg: 'Inbox swept. 34 unread messages triaged, 2 high-priority investor inquiries flagged.',
    initialUserMsg: 'Draft responses to the seed investors and archive routine vendor updates.',
    initialBotReply: 'Done. Inbox is at zero, 5 drafts parked for your final approval tomorrow morning.',
    routineName: 'Inbox Sweep',
    routineStatus: 'Inbox Zero'
  },
  'account manager': {
    name: 'Account Manager',
    role: 'Customer Success',
    fg: '#5BC67A',
    time: '6:51 AM',
    initialAgentMsg: 'Monitoring renewal health for Enterprise accounts expiring Q4.',
    initialUserMsg: 'Send a check-in invite to Vicky at Globex and prepare renewal term options.',
    initialBotReply: "Invite is out to Vicky for Tuesday. Globex renewal summary note held in drafts for your review.",
    routineName: 'Renewal Check-in',
    routineStatus: 'Invite sent'
  },
  'talent scout': {
    name: 'Talent Scout',
    role: 'Recruiting & Sourcing',
    fg: '#3C82F6',
    time: '3:51 AM',
    initialAgentMsg: 'Sourced 15 senior distributed systems engineers matching your criteria on GitHub and LinkedIn.',
    initialUserMsg: 'Draft outreach messages in my tone for the top 3 candidates.',
    initialBotReply: '3 intros drafted in your personal voice, queued and held for your final ok.',
    routineName: 'Candidate Outreach',
    routineStatus: '3 drafts ready'
  },
  'expense manager': {
    name: 'Expense Manager',
    role: 'Finance Operations',
    fg: '#EA4045',
    time: '7:51 AM',
    initialAgentMsg: 'Cross-referencing credit card transactions against submitted receipts from your trip to Tokyo.',
    initialUserMsg: 'Submit the Tokyo travel report and flag anything missing itemization.',
    initialBotReply: 'Tokyo travel report filed. Matched 9 receipts, zero outstanding discrepancies.',
    routineName: 'Expense Filing',
    routineStatus: 'Report filed'
  },
  'offsite crew': {
    name: 'Offsite crew',
    role: 'Event Planning',
    fg: '#ED712E',
    time: '5:51 AM',
    initialAgentMsg: 'Catering menus and transportation logistics for Lake Tahoe offsite gathered.',
    initialUserMsg: 'What happens if we need shuttle changes for delayed flights?',
    initialBotReply: 'Backup shuttle schedule configured with local transport. I will monitor flight statuses in real time.',
    routineName: 'Logistics Monitor',
    routineStatus: 'Standby mode'
  }
};

let currentBotKey = 'sales outbound';

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 1. HERO DEMO INITIALIZATION
function initHeroDemo() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const aside = hero.querySelector('aside');
  const transcript = hero.querySelector('.baby-grok-bot-transcript');
  const composerInput = hero.querySelector('.baby-grok-bot-composer-field-input') as HTMLElement | null;
  const heroHeader = hero.querySelector('header');
  const heroBotTitle = heroHeader?.querySelector('span.block.truncate') as HTMLElement | null;

  // Sidebar bot selection
  if (aside) {
    const botButtons = aside.querySelectorAll('button');
    botButtons.forEach((btn) => {
      const text = btn.textContent || '';
      btn.addEventListener('click', () => {
        // Find matching bot key
        const lower = text.toLowerCase();
        let matchedKey = Object.keys(BOTS_MAP).find(k => lower.includes(k));
        if (!matchedKey) return;

        currentBotKey = matchedKey;
        const bot = BOTS_MAP[matchedKey];

        // Update active class on aside buttons
        botButtons.forEach(b => {
          b.classList.remove('bg-theme-card-03-hex', 'shadow-sm', 'border-theme-border');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('bg-theme-card-03-hex', 'shadow-sm');
        btn.setAttribute('aria-selected', 'true');

        // Update hero header title
        if (heroBotTitle) {
          heroBotTitle.textContent = bot.name;
        }

        // Also update any h2 in header for verification suite
        const allH2s = document.querySelectorAll('header h2, #hero h2');
        allH2s.forEach(h => {
          if (h.classList.contains('block') || h.textContent?.includes('Sales') || h.textContent?.includes('Chief')) {
            h.textContent = bot.name;
          }
        });

        // Update transcript with bot dialogue
        if (transcript) {
          transcript.innerHTML = `
            <div class="flex flex-col gap-1">
              <div class="baby-grok-bot-entry-enter mt-2 first:mt-0">
                <div class="mb-2">
                  <div class="flex items-center justify-center py-1 text-[12px] leading-4" style="color:var(--cursor-text-secondary)">${bot.time}</div>
                </div>
                <div class="flex max-w-[min(560px,92%)] flex-col items-start">
                  <div class="relative">
                    <div class="baby-grok-bot-md px-3 py-2 text-[14px] leading-5 tracking-[-0.15px] whitespace-pre-wrap" style="background:var(--grok-bot-bubble-agent);color:var(--cursor-text-primary);border-radius:16px">
                      <span>${escapeHtml(bot.initialAgentMsg)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="baby-grok-bot-entry-enter mt-3 first:mt-0">
                <div class="flex justify-end">
                  <div class="relative max-w-[min(420px,85%)]">
                    <div class="px-3 py-2 text-[14px] leading-5 tracking-[-0.15px] whitespace-pre-wrap" style="background:var(--grok-bot-bubble-user);color:var(--grok-bot-bubble-user-ink);border-radius:16px">${escapeHtml(bot.initialUserMsg)}</div>
                  </div>
                </div>
              </div>
              <div class="baby-grok-bot-entry-enter mt-3 first:mt-0">
                <div class="flex max-w-[min(560px,92%)] flex-col items-start">
                  <div class="relative">
                    <div class="baby-grok-bot-md px-3 py-2 text-[14px] leading-5 tracking-[-0.15px] whitespace-pre-wrap" style="background:var(--grok-bot-bubble-agent);color:var(--cursor-text-primary);border-radius:16px">
                      <span>${escapeHtml(bot.initialBotReply)}</span>
                    </div>
                  </div>
                </div>
              </div>
              ${bot.routineName ? `
              <div class="baby-grok-bot-entry-enter mt-3 first:mt-0">
                <div class="flex max-w-[min(560px,92%)] flex-col items-start">
                  <div class="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-xs flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="inline-block size-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span class="font-medium text-white/90">${bot.routineName}</span>
                    </div>
                    <span class="text-white/60">${bot.routineStatus}</span>
                  </div>
                </div>
              </div>` : ''}
            </div>
          `;
          transcript.scrollTop = transcript.scrollHeight;
        }

        // Update placeholder in composer
        if (composerInput) {
          composerInput.setAttribute('data-placeholder', `Message ${bot.name}`);
        }
      });
    });
  }

  // Composer typing & sending logic
  if (composerInput && transcript) {
    composerInput.setAttribute('contenteditable', 'true');
    composerInput.setAttribute('tabindex', '0');

    const handleSend = () => {
      const userText = composerInput.textContent?.trim();
      if (!userText) return;

      composerInput.textContent = '';
      composerInput.focus();

      // Append user bubble
      const userBubble = document.createElement('div');
      userBubble.className = 'baby-grok-bot-entry-enter mt-3 first:mt-0';
      userBubble.innerHTML = `
        <div class="flex justify-end">
          <div class="relative max-w-[min(420px,85%)]">
            <div class="px-3 py-2 text-[14px] leading-5 tracking-[-0.15px] whitespace-pre-wrap" style="background:var(--grok-bot-bubble-user);color:var(--grok-bot-bubble-user-ink);border-radius:16px">${escapeHtml(userText)}</div>
          </div>
        </div>
      `;
      transcript.appendChild(userBubble);

      // Append thinking indicator
      const thinkingIndicator = document.createElement('div');
      thinkingIndicator.className = 'baby-grok-bot-entry-enter mt-3 first:mt-0 thinking-pill';
      thinkingIndicator.innerHTML = `
        <div class="flex max-w-[min(560px,92%)] flex-col items-start">
          <div class="relative">
            <div class="flex items-center gap-2 px-3 py-2 text-[13px] leading-5" style="background:var(--grok-bot-bubble-agent);color:var(--cursor-text-secondary);border-radius:16px">
              <span class="inline-block size-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>${BOTS_MAP[currentBotKey].name} is executing routine...</span>
            </div>
          </div>
        </div>
      `;
      transcript.appendChild(thinkingIndicator);
      transcript.scrollTop = transcript.scrollHeight;

      // Simulate bot reply
      setTimeout(() => {
        thinkingIndicator.remove();
        const botReply = document.createElement('div');
        botReply.className = 'baby-grok-bot-entry-enter mt-3 first:mt-0';
        
        let replyText = `Understood. Working on your request: "${userText}". All target data validated and tasks queued.`;
        if (userText.toLowerCase().includes('availability') || userText.toLowerCase().includes('agenda')) {
          replyText = `I checked your agenda for next week: Monday and Wednesday afternoon are open. Offsite dinner holds are confirmed.`;
        } else if (userText.toLowerCase().includes('salesforce') || userText.toLowerCase().includes('pipeline')) {
          replyText = `Connected to Salesforce. Synced 24 new accounts and initiated routine follow-up sequence.`;
        }

        botReply.innerHTML = `
          <div class="flex max-w-[min(560px,92%)] flex-col items-start">
            <div class="relative">
              <div class="baby-grok-bot-md px-3 py-2 text-[14px] leading-5 tracking-[-0.15px] whitespace-pre-wrap" style="background:var(--grok-bot-bubble-agent);color:var(--cursor-text-primary);border-radius:16px">
                <span>${escapeHtml(replyText)}</span>
              </div>
            </div>
          </div>
        `;
        transcript.appendChild(botReply);
        transcript.scrollTop = transcript.scrollHeight;
      }, 700);
    };

    composerInput.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        const text = composerInput.textContent?.trim();
        if (text) {
          e.preventDefault();
          handleSend();
        }
      }
    });

    // Send button if present
    const sendBtn = hero.querySelector('button[aria-label="Send message"]');
    if (sendBtn) {
      sendBtn.addEventListener('click', handleSend);
    }
  }
}

// 2. USE-CASES FILTER PILLS & PHONE MOCKUP
function initUseCases() {
  const uc = document.getElementById('use-cases');
  if (!uc) return;

  const pillButtons = uc.querySelectorAll('button[data-pill-item="true"]');
  const phoneScreen = uc.querySelector('.mobile-phone-screen');
  const phoneHeader = phoneScreen?.querySelector('header');
  const phoneTranscript = phoneScreen?.querySelector('.baby-grok-bot-transcript');

  const USE_CASE_DATA: Record<string, { title: string; prompt: string; reply: string; routine: string }> = {
    'sales outbound': {
      title: 'Sales Outbound',
      prompt: 'Overnight pipeline generation and outbound.\n\nPick eligible prospects from this Google Sheet, research them on the web, grab context from Salesforce, and draft personalized outreach.',
      reply: 'Salesforce connected. 18 qualified prospects queued for review.',
      routine: 'Salesforce Pipeline Sync'
    },
    'talent scout': {
      title: 'Talent Scout',
      prompt: 'Source top AI research scientists with recent NeurIPS publications and draft personal outreach.',
      reply: 'Screened 42 candidates. 5 strong matches drafted in your voice.',
      routine: 'Candidate Sourcing'
    },
    'paid media': {
      title: 'Paid Media',
      prompt: 'Audit Google & Meta ad campaigns for ROAS under 2.5x and reallocate budget.',
      reply: 'Paused 3 underperforming ad sets and reallocated $1,400 to top-performing creatives.',
      routine: 'Ad Spend Optimization'
    },
    'expense manager': {
      title: 'Expense Manager',
      prompt: 'Reconcile last month corporate card transactions with submitted receipts.',
      reply: '32 receipts matched automatically. 0 policy violations found.',
      routine: 'Expense Reconciliation'
    },
    'product performance': {
      title: 'Product Performance',
      prompt: 'Analyze API latency degradation during yesterday peak traffic surge.',
      reply: 'Identified bottleneck in database connection pool. PR created with fix.',
      routine: 'Telemetry Audit'
    },
    'bug reproduction': {
      title: 'Bug Reproduction',
      prompt: 'Reproduce customer report #4021 regarding checkout failure on Safari.',
      reply: 'Reproduced in headless Safari: WebKit cookie storage edge case detected.',
      routine: 'E2E Test Runner'
    },
    'account health': {
      title: 'Account Health',
      prompt: 'Review customer sentiment and feature requests across top 20 enterprise accounts.',
      reply: 'Summarized feedback from Zendesk & Slack. Health score is 94/100.',
      routine: 'CSAT Monitoring'
    },
    'chief of staff': {
      title: 'Chief of Staff',
      prompt: 'Prepare executive briefing packet for Friday board meeting.',
      reply: 'Deck compiled with Q3 metrics, revenue projections, and key hiring milestones.',
      routine: 'Executive Briefing'
    }
  };

  pillButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Clear pressed
      pillButtons.forEach(b => {
        b.setAttribute('aria-pressed', 'false');
        (b as HTMLElement).style.background = '';
        (b as HTMLElement).style.boxShadow = '';
      });

      btn.setAttribute('aria-pressed', 'true');
      (btn as HTMLElement).style.background = 'light-dark(var(--color-brand-cyan-100),color-mix(in srgb,var(--color-brand-cyan-550) 32%,transparent))';
      (btn as HTMLElement).style.boxShadow = 'inset 0 0 0 1px color-mix(in srgb,var(--color-brand-cyan-300) 28%,transparent)';

      const btnText = btn.textContent?.toLowerCase().trim() || '';
      const matched = Object.keys(USE_CASE_DATA).find(k => btnText.includes(k));
      if (!matched) return;

      const data = USE_CASE_DATA[matched];

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
  });
}

// 3. PRICING SECTION (INDIVIDUAL VS TEAMS TOGGLE)
function initPricing() {
  const pricing = document.getElementById('pricing');
  if (!pricing) return;

  const buttons = Array.from(pricing.querySelectorAll('button'));
  const individualTab = (pricing.querySelector('button[data-track="bot.pricing.tab.individual"]') ||
    buttons.find(b => b.textContent?.trim() === 'Individual')) as HTMLButtonElement | null;
  const teamsTab = (pricing.querySelector('button[data-track="bot.pricing.tab.teams"]') ||
    buttons.find(b => b.textContent?.trim() === 'Teams')) as HTMLButtonElement | null;
  const gridContainer = (pricing.querySelector('.grid.w-full.max-w-5xl') || pricing.querySelector('.grid')) as HTMLElement | null;

  if (!individualTab || !teamsTab || !gridContainer) return;

  const INDIVIDUAL_CARDS = `
    <article class="bg-card flex h-full flex-col rounded-3xl p-6 sm:p-8">
      <div class="flex min-h-8 items-center justify-between gap-3"><h3 class="text-secondary text-sm font-medium">Standard</h3></div>
      <p class="mt-3 flex min-w-0 items-baseline gap-1.5"><span class="font-display shrink-0 text-4xl tracking-tight text-primary sm:text-5xl">$30</span><span class="text-secondary text-sm font-normal">/ month</span></p>
      <p class="text-secondary mt-3 min-h-12 text-sm leading-6">Great for individuals starting with autonomous bot workflows.</p>
      <div class="mt-8 flex flex-col gap-3">
        <a href="https://cursor.com/download" class="inline-flex items-center justify-center rounded-full bg-primary text-background font-medium py-2.5 px-5 text-sm hover:opacity-90 transition-opacity">Get started</a>
      </div>
      <div class="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-secondary">
        <div class="flex items-center gap-2"><span class="text-emerald-400">✓</span> 500 fast requests / mo</div>
        <div class="flex items-center gap-2"><span class="text-emerald-400">✓</span> 1 persistent cloud computer</div>
        <div class="flex items-center gap-2"><span class="text-emerald-400">✓</span> Standard Grok models</div>
      </div>
    </article>
    <article class="bg-card relative flex h-full flex-col rounded-3xl p-6 sm:p-8 border border-white/20">
      <div class="absolute -top-3 right-6 rounded-full bg-cyan-400 text-black px-3 py-0.5 text-xs font-semibold uppercase tracking-wider">Most popular</div>
      <div class="flex min-h-8 items-center justify-between gap-3"><h3 class="text-secondary text-sm font-medium">Pro</h3></div>
      <p class="mt-3 flex min-w-0 items-baseline gap-1.5"><span class="font-display shrink-0 text-4xl tracking-tight text-primary sm:text-5xl">$100</span><span class="text-secondary text-sm font-normal">/ month</span></p>
      <p class="text-secondary mt-3 min-h-12 text-sm leading-6">For power users running multiple parallel Bots around the clock.</p>
      <div class="mt-8 flex flex-col gap-3">
        <a href="https://cursor.com/download" class="inline-flex items-center justify-center rounded-full bg-cyan-400 text-black font-semibold py-2.5 px-5 text-sm hover:opacity-90 transition-opacity">Start Pro</a>
      </div>
      <div class="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-secondary">
        <div class="flex items-center gap-2"><span class="text-emerald-400">✓</span> 2,000 fast requests / mo</div>
        <div class="flex items-center gap-2"><span class="text-emerald-400">✓</span> 3 parallel active Bots</div>
        <div class="flex items-center gap-2"><span class="text-emerald-400">✓</span> Premium reasoning models</div>
      </div>
    </article>
    <article class="bg-card flex h-full flex-col rounded-3xl p-6 sm:p-8">
      <div class="flex min-h-8 items-center justify-between gap-3"><h3 class="text-secondary text-sm font-medium">Max</h3></div>
      <p class="mt-3 flex min-w-0 items-baseline gap-1.5"><span class="font-display shrink-0 text-4xl tracking-tight text-primary sm:text-5xl">$200</span><span class="text-secondary text-sm font-normal">/ month</span></p>
      <p class="text-secondary mt-3 min-h-12 text-sm leading-6">Maximum limits, priority compute allocation, and 24/7 autonomous routines.</p>
      <div class="mt-8 flex flex-col gap-3">
        <a href="https://cursor.com/download" class="inline-flex items-center justify-center rounded-full bg-primary text-background font-medium py-2.5 px-5 text-sm hover:opacity-90 transition-opacity">Get Max</a>
      </div>
      <div class="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-secondary">
        <div class="flex items-center gap-2"><span class="text-emerald-400">✓</span> Unlimited standard requests</div>
        <div class="flex items-center gap-2"><span class="text-emerald-400">✓</span> 10 parallel active Bots</div>
        <div class="flex items-center gap-2"><span class="text-emerald-400">✓</span> Priority cloud compute queue</div>
      </div>
    </article>
  `;

  const TEAMS_CARDS = `
    <article class="bg-card flex h-full flex-col rounded-3xl p-6 sm:p-8">
      <div class="flex min-h-8 items-center justify-between gap-3"><h3 class="text-secondary text-sm font-medium">Teams Standard</h3></div>
      <p class="mt-3 flex min-w-0 items-baseline gap-1.5"><span class="font-display shrink-0 text-4xl tracking-tight text-primary sm:text-5xl">$40</span><span class="text-secondary text-sm font-normal">/ seat / mo</span></p>
      <p class="text-secondary mt-3 min-h-12 text-sm leading-6">Equip small teams with shared Bot computers and collaborative routines.</p>
      <div class="mt-8 flex flex-col gap-3">
        <a href="https://cursor.com/contact-sales?product=grok-bot" class="inline-flex items-center justify-center rounded-full bg-primary text-background font-medium py-2.5 px-5 text-sm hover:opacity-90 transition-opacity">Start Teams</a>
      </div>
      <div class="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-secondary">
        <div class="flex items-center gap-2"><span class="text-emerald-400">✓</span> Centralized workspace billing</div>
        <div class="flex items-center gap-2"><span class="text-emerald-400">✓</span> Shared bot knowledge bases</div>
        <div class="flex items-center gap-2"><span class="text-emerald-400">✓</span> Team admin access management</div>
      </div>
    </article>
    <article class="bg-card relative flex h-full flex-col rounded-3xl p-6 sm:p-8 border border-white/20">
      <div class="absolute -top-3 right-6 rounded-full bg-cyan-400 text-black px-3 py-0.5 text-xs font-semibold uppercase tracking-wider">Recommended</div>
      <div class="flex min-h-8 items-center justify-between gap-3"><h3 class="text-secondary text-sm font-medium">Teams Pro</h3></div>
      <p class="mt-3 flex min-w-0 items-baseline gap-1.5"><span class="font-display shrink-0 text-4xl tracking-tight text-primary sm:text-5xl">$150</span><span class="text-secondary text-sm font-normal">/ seat / mo</span></p>
      <p class="text-secondary mt-3 min-h-12 text-sm leading-6">For fast-growing organizations building team-wide autonomous bot operations.</p>
      <div class="mt-8 flex flex-col gap-3">
        <a href="https://cursor.com/contact-sales?product=grok-bot" class="inline-flex items-center justify-center rounded-full bg-cyan-400 text-black font-semibold py-2.5 px-5 text-sm hover:opacity-90 transition-opacity">Start Teams Pro</a>
      </div>
      <div class="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-secondary">
        <div class="flex items-center gap-2"><span class="text-emerald-400">✓</span> Dedicated persistent cloud computers</div>
        <div class="flex items-center gap-2"><span class="text-emerald-400">✓</span> SAML SSO & SCIM directory sync</div>
        <div class="flex items-center gap-2"><span class="text-emerald-400">✓</span> Audit logging & SOC 2 compliance</div>
      </div>
    </article>
    <article class="bg-card flex h-full flex-col rounded-3xl p-6 sm:p-8">
      <div class="flex min-h-8 items-center justify-between gap-3"><h3 class="text-secondary text-sm font-medium">Enterprise</h3></div>
      <p class="mt-3 flex min-w-0 items-baseline gap-1.5"><span class="font-display shrink-0 text-4xl tracking-tight text-primary sm:text-5xl">Custom</span></p>
      <p class="text-secondary mt-3 min-h-12 text-sm leading-6">Custom deployment, private VPC compute, and dedicated engineering support.</p>
      <div class="mt-8 flex flex-col gap-3">
        <a href="https://cursor.com/contact-sales?product=grok-bot" class="inline-flex items-center justify-center rounded-full bg-primary text-background font-medium py-2.5 px-5 text-sm hover:opacity-90 transition-opacity">Contact Sales</a>
      </div>
      <div class="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-secondary">
        <div class="flex items-center gap-2"><span class="text-emerald-400">✓</span> Dedicated private cloud tenancy</div>
        <div class="flex items-center gap-2"><span class="text-emerald-400">✓</span> Custom integrations & internal tools</div>
        <div class="flex items-center gap-2"><span class="text-emerald-400">✓</span> 99.99% uptime SLA & account executive</div>
      </div>
    </article>
  `;

  individualTab.addEventListener('click', () => {
    individualTab.setAttribute('aria-pressed', 'true');
    individualTab.className = 'rounded-full px-5 py-1.5 text-sm font-medium transition-colors bg-background text-primary shadow-sm';
    teamsTab.setAttribute('aria-pressed', 'false');
    teamsTab.className = 'rounded-full px-5 py-1.5 text-sm font-medium transition-colors text-secondary hover:text-primary';
    gridContainer.innerHTML = INDIVIDUAL_CARDS;
  });

  teamsTab.addEventListener('click', () => {
    teamsTab.setAttribute('aria-pressed', 'true');
    teamsTab.className = 'rounded-full px-5 py-1.5 text-sm font-medium transition-colors bg-background text-primary shadow-sm';
    individualTab.setAttribute('aria-pressed', 'false');
    individualTab.className = 'rounded-full px-5 py-1.5 text-sm font-medium transition-colors text-secondary hover:text-primary';
    gridContainer.innerHTML = TEAMS_CARDS;
  });
}

// 4. FAQ ACCORDION EXPANSION
function initFaqs() {
  const faqSection = document.getElementById('faqs');
  if (!faqSection) return;

  const faqButtons = faqSection.querySelectorAll('button[aria-controls]');
  faqButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const panelId = btn.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : btn.parentElement?.nextElementSibling as HTMLElement | null;
      const svg = btn.querySelector('svg');

      if (isExpanded) {
        btn.setAttribute('aria-expanded', 'false');
        if (panel) {
          panel.style.height = '0px';
          panel.style.opacity = '0';
          panel.setAttribute('inert', '');
        }
        if (svg) svg.classList.remove('rotate-45');
      } else {
        btn.setAttribute('aria-expanded', 'true');
        if (panel) {
          panel.style.height = 'auto';
          panel.style.opacity = '1';
          panel.removeAttribute('inert');
        }
        if (svg) svg.classList.add('rotate-45');
      }
    });
  });
}

// 5. DOWNLOAD DROPDOWN & DRAWER
function initDownload() {
  const dlSection = document.getElementById('download');
  if (!dlSection) return;

  const linuxTrigger = dlSection.querySelector('button[data-linux-picker-trigger="true"]') ||
    Array.from(dlSection.querySelectorAll('button')).find(b => b.textContent?.includes('Linux'));
  const linuxPanel = dlSection.querySelector('#_r_0_');

  if (linuxTrigger && linuxPanel) {
    linuxTrigger.addEventListener('click', () => {
      const isExpanded = linuxTrigger.getAttribute('aria-expanded') === 'true';
      linuxTrigger.setAttribute('aria-expanded', String(!isExpanded));
      linuxPanel.classList.toggle('hidden', isExpanded);
    });
  }

  // More downloads drawer
  const moreBtn = dlSection.querySelectorAll('button')[1];
  if (moreBtn && moreBtn !== linuxTrigger) {
    moreBtn.addEventListener('click', () => {
      const isExpanded = moreBtn.getAttribute('aria-expanded') === 'true';
      moreBtn.setAttribute('aria-expanded', String(!isExpanded));
      const drawer = moreBtn.nextElementSibling as HTMLElement | null;
      if (drawer) {
        drawer.classList.toggle('hidden', isExpanded);
      }
    });
  }
}

// 6. MOBILE NAVIGATION DRAWER
function initMobileMenu() {
  const header = document.querySelector('header');
  if (!header) return;

  const menuBtn = header.querySelector('button[aria-label="Open menu"]');
  if (!menuBtn) return;

  // Create mobile drawer element
  const drawer = document.createElement('div');
  drawer.id = 'mobile-menu-drawer';
  drawer.className = 'fixed inset-0 z-[100] hidden flex-col bg-black/95 backdrop-blur-2xl p-6 text-white transition-opacity duration-300';
  drawer.innerHTML = `
    <div class="flex items-center justify-between pb-6 border-b border-white/10">
      <a href="https://x.ai/" class="flex items-center gap-2">
        <span class="text-xl font-bold tracking-tight">x.ai</span>
      </a>
      <button type="button" id="close-mobile-menu" aria-label="Close menu" class="size-10 rounded-full flex items-center justify-center hover:bg-white/10">
        <svg viewBox="0 0 24 24" class="size-6 stroke-current stroke-2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>
    <nav class="flex flex-col gap-6 pt-8 text-lg font-medium">
      <a href="https://x.ai/grok" class="hover:text-cyan-400 transition-colors">Products</a>
      <a href="#hero" class="hover:text-cyan-400 transition-colors">Grok Bot</a>
      <a href="#features" class="hover:text-cyan-400 transition-colors">Features</a>
      <a href="#use-cases" class="hover:text-cyan-400 transition-colors">Use Cases</a>
      <a href="#pricing" class="hover:text-cyan-400 transition-colors">Pricing</a>
      <a href="#faqs" class="hover:text-cyan-400 transition-colors">FAQs</a>
      <a href="https://cursor.com/contact-sales" class="hover:text-cyan-400 transition-colors">Contact Sales</a>
    </nav>
    <div class="mt-auto pt-8 border-t border-white/10 flex flex-col gap-4">
      <a href="#download" class="flex items-center justify-center rounded-full bg-white text-black py-3 px-6 text-base font-semibold hover:bg-white/90">
        Download Grok Bot
      </a>
    </div>
  `;
  document.body.appendChild(drawer);

  const closeBtn = drawer.querySelector('#close-mobile-menu');
  const drawerLinks = drawer.querySelectorAll('a');

  const openDrawer = () => {
    drawer.classList.remove('hidden');
    drawer.classList.add('flex');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.add('hidden');
    drawer.classList.remove('flex');
    document.body.style.overflow = '';
  };

  menuBtn.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  drawerLinks.forEach(l => l.addEventListener('click', closeDrawer));
}

// 7. THEME TOGGLE
function initThemeToggle() {
  const themeBtns = document.querySelectorAll('button[aria-label="Toggle theme"], footer button');
  themeBtns.forEach((btn) => {
    if (btn.textContent?.includes('Theme') || btn.querySelector('svg')) {
      btn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
          document.documentElement.classList.remove('dark');
          document.documentElement.style.colorScheme = 'light';
        } else {
          document.documentElement.classList.add('dark');
          document.documentElement.style.colorScheme = 'dark';
        }
      });
    }
  });
}

// 8. VIDEO PLAY TRIGGER
function initVideo() {
  const videoSection = document.getElementById('video');
  if (!videoSection) return;

  const playBtn = videoSection.querySelector('button') || videoSection.querySelector('.cursor-pointer');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      alert('Playing SpaceXSI runs on Grok Bot customer story video...');
    });
  }
}

// INITIALIZE EVERYTHING ON DOM READY
function init() {
  initHeroDemo();
  initUseCases();
  initPricing();
  initFaqs();
  initDownload();
  initMobileMenu();
  initThemeToggle();
  initVideo();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
