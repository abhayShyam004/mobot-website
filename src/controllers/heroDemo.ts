// Hero Desktop Bot Demo Controller

import type { BotAgent } from '../types';

export const BOTS_REGISTRY: Record<string, BotAgent> = {
  'sales outbound': {
    id: 'sales-outbound',
    name: 'Sales Outbound',
    role: 'Pipeline and Outbound',
    avatarColor: '#F19D38',
    lastActive: '11:43 AM',
    initialAgentMsg: 'Hey Armand, good to meet you. What do you want me around for? Anything concrete, or more of a general sidekick?',
    initialUserMsg: 'Overnight pipeline generation and outbound.\n\nPick eligible prospects from this Google Sheet, research them on the web, grab context from Salesforce, and draft personalized outreach.',
    initialBotReply: 'Running the pipeline generation routine now. Scanning 48 contacts, matched 12 high-intent leads across target accounts.',
    routineName: 'Prospecting Routine',
    routineStatus: '12 leads drafted'
  },
  'chief': {
    id: 'chief',
    name: 'Chief',
    role: 'Chief of Staff',
    avatarColor: '#885CF5',
    lastActive: 'Yesterday',
    initialAgentMsg: 'Good morning. I reviewed next week’s travel itinerary and cross-referenced with your executive briefings.',
    initialUserMsg: 'Can you check availability for next week and confirm the offsite dinner venue?',
    initialBotReply: 'All set! Booked the private dining room at Spruce for Thursday 7:30 PM and sent the calendar invites to executive staff.',
    routineName: 'Offsite Coordination',
    routineStatus: 'Venue confirmed'
  },
  'inbox manager': {
    id: 'inbox-manager',
    name: 'Inbox Manager',
    role: 'Executive Inbox',
    avatarColor: '#EB4699',
    lastActive: '8:51 AM',
    initialAgentMsg: 'Inbox swept. 34 unread messages triaged, 2 high-priority investor inquiries flagged.',
    initialUserMsg: 'Draft responses to the seed investors and archive routine vendor updates.',
    initialBotReply: 'Done. Inbox is at zero, 5 drafts parked for your final approval tomorrow morning.',
    routineName: 'Inbox Sweep',
    routineStatus: 'Inbox Zero'
  },
  'account manager': {
    id: 'account-manager',
    name: 'Account Manager',
    role: 'Customer Success',
    avatarColor: '#5BC67A',
    lastActive: '6:51 AM',
    initialAgentMsg: 'Monitoring renewal health for Enterprise accounts expiring Q4.',
    initialUserMsg: 'Send a check-in invite to Vicky at Globex and prepare renewal term options.',
    initialBotReply: "Invite is out to Vicky for Tuesday. Globex renewal summary note held in drafts for your review.",
    routineName: 'Renewal Check-in',
    routineStatus: 'Invite sent'
  },
  'talent scout': {
    id: 'talent-scout',
    name: 'Talent Scout',
    role: 'Recruiting & Sourcing',
    avatarColor: '#3C82F6',
    lastActive: '3:51 AM',
    initialAgentMsg: 'Sourced 15 senior distributed systems engineers matching your criteria on GitHub and LinkedIn.',
    initialUserMsg: 'Draft outreach messages in my tone for the top 3 candidates.',
    initialBotReply: '3 intros drafted in your personal voice, queued and held for your final ok.',
    routineName: 'Candidate Outreach',
    routineStatus: '3 drafts ready'
  },
  'expense manager': {
    id: 'expense-manager',
    name: 'Expense Manager',
    role: 'Finance Operations',
    avatarColor: '#EA4045',
    lastActive: '7:51 AM',
    initialAgentMsg: 'Cross-referencing credit card transactions against submitted receipts from your trip to Tokyo.',
    initialUserMsg: 'Submit the Tokyo travel report and flag anything missing itemization.',
    initialBotReply: 'Tokyo travel report filed. Matched 9 receipts, zero outstanding discrepancies.',
    routineName: 'Expense Filing',
    routineStatus: 'Report filed'
  },
  'offsite crew': {
    id: 'offsite-crew',
    name: 'Offsite crew',
    role: 'Event Planning',
    avatarColor: '#ED712E',
    lastActive: '5:51 AM',
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

export function initHeroDemo() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const demoContainer = hero.querySelector('.baby-grok-bot') as HTMLElement | null;
  const aside = hero.querySelector('aside');
  const transcript = hero.querySelector('.baby-grok-bot-transcript') as HTMLElement | null;
  const composerInput = hero.querySelector('.baby-grok-bot-composer-field-input') as HTMLElement | null;
  const heroHeader = hero.querySelector('header');
  const heroBotTitle = heroHeader?.querySelector('span.block.truncate') as HTMLElement | null;
  const resizeHandle = hero.querySelector('div[role="separator"]') as HTMLElement | null;

  // 1. Sidebar Resizing
  if (resizeHandle && demoContainer) {
    let isResizing = false;
    let startX = 0;
    let startWidth = 280;

    const setSidebarWidth = (width: number) => {
      const clamped = Math.max(220, Math.min(380, width));
      demoContainer.style.setProperty('--grok-bot-sidebar-width', `${clamped}px`);
      resizeHandle.setAttribute('aria-valuenow', String(clamped));
    };

    resizeHandle.addEventListener('pointerdown', (e: PointerEvent) => {
      isResizing = true;
      startX = e.clientX;
      const currentWidth = parseInt(getComputedStyle(demoContainer).getPropertyValue('--grok-bot-sidebar-width')) || 280;
      startWidth = currentWidth;
      resizeHandle.setPointerCapture(e.pointerId);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    });

    resizeHandle.addEventListener('pointermove', (e: PointerEvent) => {
      if (!isResizing) return;
      const delta = e.clientX - startX;
      setSidebarWidth(startWidth + delta);
    });

    const stopResize = (e: PointerEvent) => {
      if (!isResizing) return;
      isResizing = false;
      try { resizeHandle.releasePointerCapture(e.pointerId); } catch (_) {}
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    resizeHandle.addEventListener('pointerup', stopResize);
    resizeHandle.addEventListener('pointercancel', stopResize);

    // Keyboard accessible resizing
    resizeHandle.addEventListener('keydown', (e: KeyboardEvent) => {
      const currentWidth = parseInt(getComputedStyle(demoContainer).getPropertyValue('--grok-bot-sidebar-width')) || 280;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSidebarWidth(currentWidth - 10);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSidebarWidth(currentWidth + 10);
      }
    });
  }

  // 2. Sidebar Bot Selection
  if (aside) {
    const botButtons = Array.from(aside.querySelectorAll('button'));
    
    const selectBot = (matchedKey: string, btnElement?: HTMLButtonElement) => {
      currentBotKey = matchedKey;
      const bot = BOTS_REGISTRY[matchedKey];

      // Update button highlights
      botButtons.forEach(b => {
        b.classList.remove('bg-theme-card-03-hex', 'shadow-sm', 'border-theme-border');
        b.setAttribute('aria-selected', 'false');
      });
      if (btnElement) {
        btnElement.classList.add('bg-theme-card-03-hex', 'shadow-sm');
        btnElement.setAttribute('aria-selected', 'true');
      }

      // Update header titles
      if (heroBotTitle) {
        heroBotTitle.textContent = bot.name;
      }
      const allH2s = document.querySelectorAll('header h2, #hero h2');
      allH2s.forEach(h => {
        if (h.classList.contains('block') || h.textContent?.includes('Sales') || h.textContent?.includes('Chief')) {
          h.textContent = bot.name;
        }
      });

      // Update transcript content safely
      if (transcript) {
        transcript.innerHTML = `
          <div class="flex flex-col gap-1">
            <div class="baby-grok-bot-entry-enter mt-2 first:mt-0">
              <div class="mb-2">
                <div class="flex items-center justify-center py-1 text-[12px] leading-4" style="color:var(--cursor-text-secondary)">${bot.lastActive}</div>
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

      if (composerInput) {
        composerInput.setAttribute('data-placeholder', `Message ${bot.name}`);
      }
    };

    botButtons.forEach((btn, index) => {
      const text = btn.textContent?.toLowerCase() || '';
      btn.addEventListener('click', () => {
        const matchedKey = Object.keys(BOTS_REGISTRY).find(k => text.includes(k));
        if (matchedKey) selectBot(matchedKey, btn);
      });

      // Arrow navigation inside agent list
      btn.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextBtn = botButtons[(index + 1) % botButtons.length];
          nextBtn?.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevBtn = botButtons[(index - 1 + botButtons.length) % botButtons.length];
          prevBtn?.focus();
        }
      });
    });
  }

  // 3. Message Composer & Chat
  if (composerInput && transcript) {
    composerInput.setAttribute('contenteditable', 'true');
    composerInput.setAttribute('tabindex', '0');

    const handleSend = () => {
      const userText = composerInput.textContent?.trim();
      if (!userText) return;

      composerInput.textContent = '';
      composerInput.focus();

      // Safe user bubble creation
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

      // Thinking indicator
      const thinkingIndicator = document.createElement('div');
      thinkingIndicator.className = 'baby-grok-bot-entry-enter mt-3 first:mt-0 thinking-pill';
      thinkingIndicator.innerHTML = `
        <div class="flex max-w-[min(560px,92%)] flex-col items-start">
          <div class="relative">
            <div class="flex items-center gap-2 px-3 py-2 text-[13px] leading-5" style="background:var(--grok-bot-bubble-agent);color:var(--cursor-text-secondary);border-radius:16px">
              <span class="inline-block size-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>${BOTS_REGISTRY[currentBotKey].name} is executing routine...</span>
            </div>
          </div>
        </div>
      `;
      transcript.appendChild(thinkingIndicator);
      transcript.scrollTop = transcript.scrollHeight;

      // Realistic reply simulation
      setTimeout(() => {
        thinkingIndicator.remove();
        const botReply = document.createElement('div');
        botReply.className = 'baby-grok-bot-entry-enter mt-3 first:mt-0';

        let replyText = `Understood. Working on your request: "${userText}". All target data validated and tasks queued.`;
        const lower = userText.toLowerCase();
        if (lower.includes('availability') || lower.includes('agenda')) {
          replyText = `I checked your agenda for next week: Monday and Wednesday afternoon are open. Offsite dinner holds are confirmed.`;
        } else if (lower.includes('salesforce') || lower.includes('pipeline')) {
          replyText = `Connected to Salesforce. Synced 24 new accounts and initiated routine follow-up sequence.`;
        } else if (lower.includes('candidate') || lower.includes('hire')) {
          replyText = `Screened 18 candidate profiles matching our stack. 3 outreach messages drafted.`;
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
      }, 600);
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
        if (text && document.activeElement === composerInput) {
          e.preventDefault();
          handleSend();
        }
      }
    });

    const sendBtn = hero.querySelector('button[aria-label="Send message"]');
    if (sendBtn) {
      sendBtn.addEventListener('click', handleSend);
    }
  }
}
