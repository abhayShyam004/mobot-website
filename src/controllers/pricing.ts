// Pricing Section Controller

export function initPricing() {
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

  const switchToIndividual = () => {
    individualTab.setAttribute('aria-pressed', 'true');
    individualTab.setAttribute('aria-selected', 'true');
    individualTab.className = 'rounded-full px-5 py-1.5 text-sm font-medium transition-colors bg-background text-primary shadow-sm';
    teamsTab.setAttribute('aria-pressed', 'false');
    teamsTab.setAttribute('aria-selected', 'false');
    teamsTab.className = 'rounded-full px-5 py-1.5 text-sm font-medium transition-colors text-secondary hover:text-primary';
    gridContainer.innerHTML = INDIVIDUAL_CARDS;
  };

  const switchToTeams = () => {
    teamsTab.setAttribute('aria-pressed', 'true');
    teamsTab.setAttribute('aria-selected', 'true');
    teamsTab.className = 'rounded-full px-5 py-1.5 text-sm font-medium transition-colors bg-background text-primary shadow-sm';
    individualTab.setAttribute('aria-pressed', 'false');
    individualTab.setAttribute('aria-selected', 'false');
    individualTab.className = 'rounded-full px-5 py-1.5 text-sm font-medium transition-colors text-secondary hover:text-primary';
    gridContainer.innerHTML = TEAMS_CARDS;
  };

  individualTab.addEventListener('click', switchToIndividual);
  teamsTab.addEventListener('click', switchToTeams);

  // Keyboard navigation
  individualTab.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      teamsTab.focus();
      switchToTeams();
    }
  });

  teamsTab.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      individualTab.focus();
      switchToIndividual();
    }
  });
}
