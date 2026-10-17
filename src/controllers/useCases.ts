// Use Cases Controller & Phone Mockup Synchronization - MOBOT Edition

import type { UseCaseData } from '../types';

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

const USE_CASES: Record<string, UseCaseData> = {
  'yuki': {
    id: 'yuki',
    title: 'Yuki',
    category: 'Companion & Navigation',
    prompt: 'take me yo the nearest metro station',
    reply: 'I opened your maps app with a search for the nearest metro station. Depending on your location permissions, it may ask you to enable location first.',
    routine: 'Android Intent: Google Maps'
  },
  'eval bot': {
    id: 'eval-bot',
    title: 'Eval Bot',
    category: 'Privacy & Verification',
    prompt: 'Do you see my Google Maps history, bookmarks, or personal saved places?',
    reply: 'No. I don\'t see your Google Maps history, bookmarks, or saved places—just the single search intent triggered for your destination.',
    routine: 'Privacy Sandbox Guard'
  },
  'pixel': {
    id: 'pixel',
    title: 'Pixel',
    category: 'Document & OCR Vision',
    prompt: 'Extract invoice total, invoice date, and itemized breakdown from the receipt photo.',
    reply: 'Receipt parsed via on-device vision: Total $142.50 across 4 line items. Saved to your local SQLite database.',
    routine: 'On-Device OCR Engine'
  },
  'sage': {
    id: 'sage',
    title: 'Sage',
    category: 'Reasoning & Memory',
    prompt: 'Compare local SQLite performance vs SharedPreferences for agent memory persistence.',
    reply: 'SQLite provides ACID transactions and sub-millisecond indexed queries for vector embeddings, making it superior for multi-agent state persistence.',
    routine: 'SQLite Vector Storage'
  },
  'scout': {
    id: 'scout',
    title: 'Scout',
    category: 'Background World Watches',
    prompt: 'Watch flight AA1024 status and notify me if gate changes or delays occur.',
    reply: 'Watch active: monitoring flight status every 15 minutes. Gate 42 confirmed on last check.',
    routine: '24/7 World Watch'
  },
  'taffy': {
    id: 'taffy',
    title: 'Taffy',
    category: 'Android Hands & Automation',
    prompt: 'Launch camera document mode and save the high-resolution crop to workspace.',
    reply: 'Document scanner intent executed. Scanned page cropped and saved to /sdcard/MOBOT/docs/doc_01.png.',
    routine: 'Device Intent Dispatcher'
  },
  'plum': {
    id: 'plum',
    title: 'Plum',
    category: 'Voice Dictation & Audio',
    prompt: 'Transcribe audio note from the team standup and summarize the 3 action items.',
    reply: 'Voice transcribed with on-device Whisper: 3 action items extracted and assigned to Yuki and Eval Bot.',
    routine: 'On-Device Whisper STT'
  },
  'vega': {
    id: 'vega',
    title: 'Vega',
    category: 'Scheduled Routines',
    prompt: 'Every morning at 8:00 AM, compile weather forecast, calendar events, and top news.',
    reply: 'Scheduled morning routine active. AlarmManager configured for 08:00 AM daily with wake lock.',
    routine: 'AlarmManager Service'
  }
};

export function initUseCases() {
  const uc = document.getElementById('use-cases');
  if (!uc) return;

  const pillButtons = Array.from(uc.querySelectorAll<HTMLButtonElement>('button[data-pill-item="true"]'));
  const phoneTranscript = uc.querySelector('.baby-mobot-transcript, .baby-grok-bot-transcript') as HTMLElement | null;

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
      const titleSpan = uc.querySelector('.baby-mobot-agent-title-pill span.truncate, .baby-grok-bot-agent-title-pill span.truncate') as HTMLElement | null;
      if (titleSpan) {
        titleSpan.textContent = data.title;
      }

      // Update phone transcript
      if (phoneTranscript) {
        phoneTranscript.innerHTML = `
          <div class="flex flex-col gap-1">
            <div class="baby-mobot-entry-enter baby-grok-bot-entry-enter mt-2 first:mt-0">
              <div class="flex justify-end">
                <div class="relative max-w-[min(420px,85%)]">
                  <div class="px-3 py-2 text-[14px] leading-5 tracking-[-0.15px] whitespace-pre-wrap" style="background:var(--mobot-bubble-user,var(--grok-bot-bubble-user));color:var(--mobot-bubble-user-ink,var(--grok-bot-bubble-user-ink));border-radius:16px">${escapeHtml(data.prompt)}</div>
                </div>
              </div>
            </div>
            <div class="baby-mobot-entry-enter baby-grok-bot-entry-enter mt-3 first:mt-0">
              <div class="flex max-w-[min(560px,92%)] flex-col items-start">
                <div class="relative">
                  <div class="baby-mobot-md baby-grok-bot-md px-3 py-2 text-[14px] leading-5 tracking-[-0.15px] whitespace-pre-wrap" style="background:var(--mobot-bubble-agent,var(--grok-bot-bubble-agent));color:var(--cursor-text-primary);border-radius:16px">
                    <span>${escapeHtml(data.reply)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="baby-mobot-entry-enter baby-grok-bot-entry-enter mt-3 first:mt-0">
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
        pillButtons[(index + 1) % pillButtons.length]?.focus();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        pillButtons[(index - 1 + pillButtons.length) % pillButtons.length]?.focus();
      }
    });
  });
}
