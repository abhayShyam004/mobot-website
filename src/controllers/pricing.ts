// Pricing & Architecture Section Controller - MOBOT Edition

export function initPricing() {
  const pricing = document.getElementById('pricing');
  if (!pricing) return;

  const buttons = Array.from(pricing.querySelectorAll('button'));
  const individualTab = (pricing.querySelector('button[data-track="bot.pricing.tab.individual"]') ||
    buttons.find(b => b.textContent?.trim() === 'Individual' || b.textContent?.trim() === 'Open Source')) as HTMLButtonElement | null;
  const teamsTab = (pricing.querySelector('button[data-track="bot.pricing.tab.teams"]') ||
    buttons.find(b => b.textContent?.trim() === 'Teams' || b.textContent?.trim() === 'Fleet')) as HTMLButtonElement | null;
  const gridContainer = (pricing.querySelector('.grid.w-full.max-w-5xl') || pricing.querySelector('.grid')) as HTMLElement | null;

  if (!individualTab || !teamsTab || !gridContainer) return;

  const INDIVIDUAL_CARDS = `
    <article class="bg-card border border-border flex h-full flex-col rounded-3xl p-6 sm:p-8 shadow-sm">
      <div class="flex min-h-8 items-center justify-between gap-3"><h3 class="text-secondary text-sm font-medium">On-Device Companion</h3></div>
      <p class="mt-3 flex min-w-0 items-baseline gap-1.5"><span class="font-display shrink-0 text-4xl tracking-tight text-primary sm:text-5xl">$0</span><span class="text-secondary text-sm font-normal">forever · MIT</span></p>
      <p class="text-secondary mt-3 min-h-12 text-sm leading-6">Everyday personal Android companion for system intents, voice, and navigation.</p>
      <div class="mt-8 flex flex-col gap-3">
        <a href="#download" class="inline-flex items-center justify-center rounded-full bg-primary text-background font-medium py-2.5 px-5 text-sm hover:opacity-90 transition-opacity">Download APK</a>
      </div>
      <div class="mt-8 flex flex-col gap-3 border-t border-border pt-6 text-sm text-secondary">
        <div class="flex items-center gap-2"><span class="text-emerald-500 font-bold">✓</span> Direct Android intent hands</div>
        <div class="flex items-center gap-2"><span class="text-emerald-500 font-bold">✓</span> Local SQLite persistent memory</div>
        <div class="flex items-center gap-2"><span class="text-emerald-500 font-bold">✓</span> Zero telemetry & 100% private</div>
      </div>
    </article>
    <article class="bg-card relative flex h-full flex-col rounded-3xl p-6 sm:p-8 border-2 border-primary/30 shadow-md">
      <div class="absolute -top-3 right-6 rounded-full bg-primary text-background px-3 py-0.5 text-xs font-semibold uppercase tracking-wider shadow-sm">Most popular</div>
      <div class="flex min-h-8 items-center justify-between gap-3"><h3 class="text-secondary text-sm font-medium">Specialist Swarm</h3></div>
      <p class="mt-3 flex min-w-0 items-baseline gap-1.5"><span class="font-display shrink-0 text-4xl tracking-tight text-primary sm:text-5xl">Free</span><span class="text-secondary text-sm font-normal">Open Source</span></p>
      <p class="text-secondary mt-3 min-h-12 text-sm leading-6">Run parallel specialists (Yuki, Eval Bot, Pixel, Sage, Scout) concurrently.</p>
      <div class="mt-8 flex flex-col gap-3">
        <a href="https://github.com/abhayShyam004/MOBOT" class="inline-flex items-center justify-center rounded-full bg-primary text-background font-semibold py-2.5 px-5 text-sm hover:opacity-90 transition-opacity">Get on GitHub</a>
      </div>
      <div class="mt-8 flex flex-col gap-3 border-t border-border pt-6 text-sm text-secondary">
        <div class="flex items-center gap-2"><span class="text-emerald-500 font-bold">✓</span> Parallel multi-agent workspaces</div>
        <div class="flex items-center gap-2"><span class="text-emerald-500 font-bold">✓</span> Document OCR & vision parsing</div>
        <div class="flex items-center gap-2"><span class="text-emerald-500 font-bold">✓</span> 24/7 background world watches</div>
      </div>
    </article>
    <article class="bg-card border border-border flex h-full flex-col rounded-3xl p-6 sm:p-8 shadow-sm">
      <div class="flex min-h-8 items-center justify-between gap-3"><h3 class="text-secondary text-sm font-medium">Embedded Host</h3></div>
      <p class="mt-3 flex min-w-0 items-baseline gap-1.5"><span class="font-display shrink-0 text-4xl tracking-tight text-primary sm:text-5xl">Local</span><span class="text-secondary text-sm font-normal">On-Device Engine</span></p>
      <p class="text-secondary mt-3 min-h-12 text-sm leading-6">Complete autonomy with local GGUF/ONNX small models and sandboxed tools.</p>
      <div class="mt-8 flex flex-col gap-3">
        <a href="https://github.com/abhayShyam004/MOBOT#readme" class="inline-flex items-center justify-center rounded-full bg-primary text-background font-medium py-2.5 px-5 text-sm hover:opacity-90 transition-opacity">Audit Source</a>
      </div>
      <div class="mt-8 flex flex-col gap-3 border-t border-border pt-6 text-sm text-secondary">
        <div class="flex items-center gap-2"><span class="text-emerald-500 font-bold">✓</span> Zero-network offline inference</div>
        <div class="flex items-center gap-2"><span class="text-emerald-500 font-bold">✓</span> Hardware camera & audio hands</div>
        <div class="flex items-center gap-2"><span class="text-emerald-500 font-bold">✓</span> Bring-Your-Own-Key (BYOK)</div>
      </div>
    </article>
  `;

  const TEAMS_CARDS = `
    <article class="bg-card border border-border flex h-full flex-col rounded-3xl p-6 sm:p-8 shadow-sm">
      <div class="flex min-h-8 items-center justify-between gap-3"><h3 class="text-secondary text-sm font-medium">Workstation Sync</h3></div>
      <p class="mt-3 flex min-w-0 items-baseline gap-1.5"><span class="font-display shrink-0 text-4xl tracking-tight text-primary sm:text-5xl">Self-Hosted</span><span class="text-secondary text-sm font-normal">LAN</span></p>
      <p class="text-secondary mt-3 min-h-12 text-sm leading-6">Pair your phone companion with your desktop or home server node.</p>
      <div class="mt-8 flex flex-col gap-3">
        <a href="https://github.com/abhayShyam004/MOBOT#readme" class="inline-flex items-center justify-center rounded-full bg-primary text-background font-medium py-2.5 px-5 text-sm hover:opacity-90 transition-opacity">Setup Node</a>
      </div>
      <div class="mt-8 flex flex-col gap-3 border-t border-border pt-6 text-sm text-secondary">
        <div class="flex items-center gap-2"><span class="text-emerald-500 font-bold">✓</span> Local LAN QR code pairing</div>
        <div class="flex items-center gap-2"><span class="text-emerald-500 font-bold">✓</span> Desktop screen & keyboard hands</div>
        <div class="flex items-center gap-2"><span class="text-emerald-400">✓</span> End-to-end encrypted relay</div>
      </div>
    </article>
    <article class="bg-card relative flex h-full flex-col rounded-3xl p-6 sm:p-8 border-2 border-primary/30 shadow-md">
      <div class="absolute -top-3 right-6 rounded-full bg-primary text-background px-3 py-0.5 text-xs font-semibold uppercase tracking-wider shadow-sm">Recommended</div>
      <div class="flex min-h-8 items-center justify-between gap-3"><h3 class="text-secondary text-sm font-medium">Multi-Device Swarm</h3></div>
      <p class="mt-3 flex min-w-0 items-baseline gap-1.5"><span class="font-display shrink-0 text-4xl tracking-tight text-primary sm:text-5xl">Swarm</span><span class="text-secondary text-sm font-normal">Zero Lock-In</span></p>
      <p class="text-secondary mt-3 min-h-12 text-sm leading-6">Coordinate tasks seamlessly across Android phones, tablets, and companion nodes.</p>
      <div class="mt-8 flex flex-col gap-3">
        <a href="https://github.com/abhayShyam004/MOBOT" class="inline-flex items-center justify-center rounded-full bg-primary text-background font-semibold py-2.5 px-5 text-sm hover:opacity-90 transition-opacity">Deploy Fleet</a>
      </div>
      <div class="mt-8 flex flex-col gap-3 border-t border-border pt-6 text-sm text-secondary">
        <div class="flex items-center gap-2"><span class="text-emerald-500 font-bold">✓</span> Distributed SQLite replication</div>
        <div class="flex items-center gap-2"><span class="text-emerald-500 font-bold">✓</span> Shared context memory graph</div>
        <div class="flex items-center gap-2"><span class="text-emerald-500 font-bold">✓</span> Zero monthly seat licensing fees</div>
      </div>
    </article>
    <article class="bg-card border border-border flex h-full flex-col rounded-3xl p-6 sm:p-8 shadow-sm">
      <div class="flex min-h-8 items-center justify-between gap-3"><h3 class="text-secondary text-sm font-medium">Custom Integrations</h3></div>
      <p class="mt-3 flex min-w-0 items-baseline gap-1.5"><span class="font-display shrink-0 text-4xl tracking-tight text-primary sm:text-5xl">Custom</span><span class="text-secondary text-sm font-normal">Open Source</span></p>
      <p class="text-secondary mt-3 min-h-12 text-sm leading-6">Integrate MOBOT companion hands into proprietary private tools and corporate APIs.</p>
      <div class="mt-8 flex flex-col gap-3">
        <a href="https://github.com/abhayShyam004/MOBOT/discussions" class="inline-flex items-center justify-center rounded-full bg-primary text-background font-medium py-2.5 px-5 text-sm hover:opacity-90 transition-opacity">Discussions</a>
      </div>
      <div class="mt-8 flex flex-col gap-3 border-t border-border pt-6 text-sm text-secondary">
        <div class="flex items-center gap-2"><span class="text-emerald-500 font-bold">✓</span> Air-gapped on-premise execution</div>
        <div class="flex items-center gap-2"><span class="text-emerald-500 font-bold">✓</span> Tailored Android intent filters</div>
        <div class="flex items-center gap-2"><span class="text-emerald-500 font-bold">✓</span> Community developer support</div>
      </div>
    </article>
  `;

  const switchTab = (tab: 'individual' | 'teams') => {
    if (tab === 'individual') {
      individualTab.setAttribute('aria-selected', 'true');
      individualTab.setAttribute('aria-pressed', 'true');
      individualTab.className = 'rounded-full px-5 py-1.5 text-sm font-semibold transition-colors bg-primary text-background shadow-sm';

      teamsTab.setAttribute('aria-selected', 'false');
      teamsTab.setAttribute('aria-pressed', 'false');
      teamsTab.className = 'rounded-full px-5 py-1.5 text-sm font-medium transition-colors text-secondary hover:text-primary';

      gridContainer.innerHTML = INDIVIDUAL_CARDS;
    } else {
      teamsTab.setAttribute('aria-selected', 'true');
      teamsTab.setAttribute('aria-pressed', 'true');
      teamsTab.className = 'rounded-full px-5 py-1.5 text-sm font-semibold transition-colors bg-primary text-background shadow-sm';

      individualTab.setAttribute('aria-selected', 'false');
      individualTab.setAttribute('aria-pressed', 'false');
      individualTab.className = 'rounded-full px-5 py-1.5 text-sm font-medium transition-colors text-secondary hover:text-primary';

      gridContainer.innerHTML = TEAMS_CARDS;
    }
  };

  // Initialize active state with proper contrast
  switchTab('individual');

  individualTab.addEventListener('click', () => switchTab('individual'));
  teamsTab.addEventListener('click', () => switchTab('teams'));
}
