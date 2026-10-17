// Hero Desktop Bot Demo Controller - MOBOT Edition

import type { BotAgent } from '../types';

export const BOTS_REGISTRY: Record<string, BotAgent> = {
  'yuki': {
    id: 'yuki',
    name: 'Yuki',
    role: 'Navigation & Daily Companion',
    avatarColor: '#2563EB',
    lastActive: '10:38 AM',
    initialAgentMsg: 'Hey Abhay, good to meet you. What do you want me around for? Anything concrete, or more of a general sidekick?',
    initialUserMsg: 'take me yo the nearest metro station',
    initialBotReply: 'I opened your maps app with a search for the nearest metro station. Depending on your location permissions, it may ask you to enable location first.',
    routineName: 'Android Intent: Google Maps',
    routineStatus: 'Maps launched'
  },
  'eval bot': {
    id: 'eval-bot',
    name: 'Eval Bot',
    role: 'Verification & Quality Auditor',
    avatarColor: '#F59E0B',
    lastActive: '10:35 AM',
    initialAgentMsg: 'Privacy and evaluation monitor active. I audit tool permissions, intent triggers, and agent accuracy.',
    initialUserMsg: 'Do you see my Google Maps history, bookmarks, or personal saved places?',
    initialBotReply: 'No. I don\'t see your Google Maps history, bookmarks, or saved places—just the single search intent triggered for your destination.',
    routineName: 'Privacy Sandbox Guard',
    routineStatus: 'Verified clean'
  },
  'pixel': {
    id: 'pixel',
    name: 'Pixel',
    role: 'Document & Vision Processor',
    avatarColor: '#06B6D4',
    lastActive: 'Yesterday',
    initialAgentMsg: 'Document OCR ready. Point camera or pick a file to extract text, receipts, and structured JSON.',
    initialUserMsg: 'Extract invoice total, invoice date, and itemized breakdown from the receipt photo.',
    initialBotReply: 'Receipt parsed via on-device vision: Total $142.50 across 4 line items. Saved to your local SQLite database.',
    routineName: 'On-Device OCR Engine',
    routineStatus: '4 items extracted'
  },
  'sage': {
    id: 'sage',
    name: 'Sage',
    role: 'Deep Reasoning & Memory',
    avatarColor: '#8B5CF6',
    lastActive: 'Yesterday',
    initialAgentMsg: 'Vector index synced. Ready to query local device documents, conversation history, and technical reasoning.',
    initialUserMsg: 'Compare local SQLite performance vs SharedPreferences for agent memory persistence.',
    initialBotReply: 'SQLite provides ACID transactions and sub-millisecond indexed queries for vector embeddings, making it superior for multi-agent state persistence.',
    routineName: 'SQLite Vector Storage',
    routineStatus: 'Indexed'
  },
  'scout': {
    id: 'scout',
    name: 'Scout',
    role: 'Background Monitor & World Watches',
    avatarColor: '#10B981',
    lastActive: 'Yesterday',
    initialAgentMsg: 'Background world watch service initialized. Running low-power periodic condition checks.',
    initialUserMsg: 'Watch flight AA1024 status and notify me if gate changes or delays occur.',
    initialBotReply: 'Watch active: monitoring flight status every 15 minutes. Gate 42 confirmed on last check.',
    routineName: '24/7 World Watch',
    routineStatus: 'Standby mode'
  }
};

let currentBotKey = 'yuki';

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function initHeroDemo() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const demoContainer = (hero.querySelector('.baby-mobot, .baby-grok-bot') || hero.querySelector('aside')?.parentElement) as HTMLElement | null;
  const aside = hero.querySelector('aside');
  const transcript = hero.querySelector('.baby-mobot-transcript, .baby-grok-bot-transcript') as HTMLElement | null;
  const composerInput = hero.querySelector('.baby-mobot-composer-field-input, .baby-grok-bot-composer-field-input, [contenteditable="true"]') as HTMLElement | null;
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
      demoContainer.style.setProperty('--mobot-sidebar-width', `${clamped}px`);
      demoContainer.style.setProperty('--grok-bot-sidebar-width', `${clamped}px`);
      resizeHandle.setAttribute('aria-valuenow', String(clamped));
    };

    resizeHandle.addEventListener('pointerdown', (e: PointerEvent) => {
      isResizing = true;
      startX = e.clientX;
      const currentWidth = parseInt(getComputedStyle(demoContainer).getPropertyValue('--mobot-sidebar-width')) ||
        parseInt(getComputedStyle(demoContainer).getPropertyValue('--grok-bot-sidebar-width')) || 280;
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
      const currentWidth = parseInt(getComputedStyle(demoContainer).getPropertyValue('--mobot-sidebar-width')) ||
        parseInt(getComputedStyle(demoContainer).getPropertyValue('--grok-bot-sidebar-width')) || 280;
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
      if (!bot) return;

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
        if (h.classList.contains('block') || h.textContent?.includes('Yuki') || h.textContent?.includes('Eval') || h.textContent?.includes('Pixel') || h.textContent?.includes('Sage') || h.textContent?.includes('Scout')) {
          h.textContent = bot.name;
        }
      });

      // Update transcript content safely
      if (transcript) {
        transcript.innerHTML = `
          <div class="flex flex-col gap-1">
            <div class="baby-mobot-entry-enter baby-grok-bot-entry-enter mt-2 first:mt-0">
              <div class="mb-2">
                <div class="flex items-center justify-center py-1 text-[12px] leading-4" style="color:var(--cursor-text-secondary)">${bot.lastActive}</div>
              </div>
              <div class="flex max-w-[min(560px,92%)] flex-col items-start">
                <div class="relative">
                  <div class="baby-mobot-md baby-grok-bot-md px-3 py-2 text-[14px] leading-5 tracking-[-0.15px] whitespace-pre-wrap" style="background:var(--mobot-bubble-agent,var(--grok-bot-bubble-agent));color:var(--cursor-text-primary);border-radius:16px">
                    <span>${escapeHtml(bot.initialAgentMsg)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="baby-mobot-entry-enter baby-grok-bot-entry-enter mt-3 first:mt-0">
              <div class="flex justify-end">
                <div class="relative max-w-[min(420px,85%)]">
                  <div class="px-3 py-2 text-[14px] leading-5 tracking-[-0.15px] whitespace-pre-wrap" style="background:var(--mobot-bubble-user,var(--grok-bot-bubble-user));color:var(--mobot-bubble-user-ink,var(--grok-bot-bubble-user-ink));border-radius:16px">${escapeHtml(bot.initialUserMsg)}</div>
                </div>
              </div>
            </div>
            <div class="baby-mobot-entry-enter baby-grok-bot-entry-enter mt-3 first:mt-0">
              <div class="flex max-w-[min(560px,92%)] flex-col items-start">
                <div class="relative">
                  <div class="baby-mobot-md baby-grok-bot-md px-3 py-2 text-[14px] leading-5 tracking-[-0.15px] whitespace-pre-wrap" style="background:var(--mobot-bubble-agent,var(--grok-bot-bubble-agent));color:var(--cursor-text-primary);border-radius:16px">
                    <span>${escapeHtml(bot.initialBotReply)}</span>
                  </div>
                </div>
              </div>
            </div>
            ${bot.routineName ? `
            <div class="baby-mobot-entry-enter baby-grok-bot-entry-enter mt-3 first:mt-0">
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
        composerInput.setAttribute('data-placeholder', `Ask ${bot.name}`);
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

      // User bubble
      const userBubble = document.createElement('div');
      userBubble.className = 'baby-mobot-entry-enter baby-grok-bot-entry-enter mt-3 first:mt-0';
      userBubble.innerHTML = `
        <div class="flex justify-end">
          <div class="relative max-w-[min(420px,85%)]">
            <div class="px-3 py-2 text-[14px] leading-5 tracking-[-0.15px] whitespace-pre-wrap" style="background:var(--mobot-bubble-user,var(--grok-bot-bubble-user));color:var(--mobot-bubble-user-ink,var(--grok-bot-bubble-user-ink));border-radius:16px">${escapeHtml(userText)}</div>
          </div>
        </div>
      `;
      transcript.appendChild(userBubble);

      // Thinking indicator
      const activeBot = BOTS_REGISTRY[currentBotKey] || BOTS_REGISTRY['yuki'];
      const thinkingIndicator = document.createElement('div');
      thinkingIndicator.className = 'baby-mobot-entry-enter baby-grok-bot-entry-enter mt-3 first:mt-0 thinking-pill';
      thinkingIndicator.innerHTML = `
        <div class="flex max-w-[min(560px,92%)] flex-col items-start">
          <div class="relative">
            <div class="flex items-center gap-2 px-3 py-2 text-[13px] leading-5" style="background:var(--mobot-bubble-agent,var(--grok-bot-bubble-agent));color:var(--cursor-text-secondary);border-radius:16px">
              <span class="inline-block size-2 rounded-full bg-blue-400 animate-ping"></span>
              <span>${activeBot.name} is executing intent...</span>
            </div>
          </div>
        </div>
      `;
      transcript.appendChild(thinkingIndicator);
      transcript.scrollTop = transcript.scrollHeight;

      // Realistic reply simulation tailored to MOBOT capabilities
      setTimeout(() => {
        thinkingIndicator.remove();
        const botReply = document.createElement('div');
        botReply.className = 'baby-mobot-entry-enter baby-grok-bot-entry-enter mt-3 first:mt-0';

        let replyText = `Understood. Working on your request: "${userText}". Handled by ${activeBot.name} on Android.`;
        const lower = userText.toLowerCase();
        if (lower.includes('metro') || lower.includes('map') || lower.includes('station') || lower.includes('navigate')) {
          replyText = `I opened your maps app with a search for "${userText}". Depending on your location permissions, it may ask you to enable location first.`;
        } else if (lower.includes('privacy') || lower.includes('telemetry') || lower.includes('data')) {
          replyText = `Zero telemetry verified. All agent state, SQLite tables, and API keys are stored strictly in local Android app storage.`;
        } else if (lower.includes('ocr') || lower.includes('receipt') || lower.includes('invoice') || lower.includes('scan')) {
          replyText = `On-device vision executed. Text and amounts extracted and indexed in local SQLite workspace.`;
        } else if (lower.includes('watch') || lower.includes('flight') || lower.includes('monitor')) {
          replyText = `Background watch created. Monitoring target every 15 minutes via Android foreground service.`;
        }

        botReply.innerHTML = `
          <div class="flex max-w-[min(560px,92%)] flex-col items-start">
            <div class="relative">
              <div class="baby-mobot-md baby-grok-bot-md px-3 py-2 text-[14px] leading-5 tracking-[-0.15px] whitespace-pre-wrap" style="background:var(--mobot-bubble-agent,var(--grok-bot-bubble-agent));color:var(--cursor-text-primary);border-radius:16px">
                <span>${escapeHtml(replyText)}</span>
              </div>
            </div>
          </div>
        `;
        transcript.appendChild(botReply);
        transcript.scrollTop = transcript.scrollHeight;
      }, 500);
    };

    composerInput.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });

    const sendBtn = hero.querySelector('button[aria-label="Send message"]');
    if (sendBtn) {
      sendBtn.addEventListener('click', handleSend);
    }
  }
}
