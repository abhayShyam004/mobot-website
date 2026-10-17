// Global Navigation & Mobile Drawer Controller - MOBOT Edition

export function initNavigation() {
  const header = document.querySelector('header');
  if (!header) return;

  const menuBtn = header.querySelector('button[aria-label="Open menu"]') as HTMLButtonElement | null;
  if (!menuBtn) return;

  // Create accessible mobile navigation drawer if not already in DOM
  let drawer = document.getElementById('mobile-menu-drawer');
  if (!drawer) {
    drawer = document.createElement('div');
    drawer.id = 'mobile-menu-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'Mobile navigation menu');
    drawer.className = 'fixed inset-0 z-[100] hidden flex-col bg-black/95 backdrop-blur-2xl p-6 text-white transition-all duration-200';
    drawer.innerHTML = `
      <div class="flex items-center justify-between pb-6 border-b border-white/10">
        <a href="#hero" class="flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-md p-1">
          <img src="/app-icon.svg" alt="MOBOT Icon" width="28" height="28" class="size-7 rounded-lg shrink-0" style="width:28px;height:28px;border-radius:6px;display:block;flex-shrink:0;object-fit:contain" />
          <span class="text-xl font-bold tracking-tight text-white">MOBOT</span>
        </a>
        <button type="button" id="close-mobile-menu" aria-label="Close menu" class="size-10 rounded-full flex items-center justify-center hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-blue-500 outline-none">
          <svg viewBox="0 0 24 24" class="size-6 stroke-current stroke-2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <nav class="flex flex-col gap-6 pt-8 text-lg font-medium" aria-label="Mobile links">
        <a href="#hero" class="hover:text-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-2 py-1 transition-colors">Overview</a>
        <a href="#features" class="hover:text-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-2 py-1 transition-colors">Features</a>
        <a href="#use-cases" class="hover:text-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-2 py-1 transition-colors">Specialist Roster</a>
        <a href="#pricing" class="hover:text-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-2 py-1 transition-colors">Architecture</a>
        <a href="#download" class="hover:text-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-2 py-1 transition-colors">Download</a>
        <a href="#faqs" class="hover:text-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-2 py-1 transition-colors">FAQs</a>
        <a href="https://github.com/abhayShyam004/MOBOT" target="_blank" rel="noopener noreferrer" class="hover:text-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-2 py-1 transition-colors">GitHub Repository</a>
      </nav>
      <div class="mt-auto pt-8 border-t border-white/10 flex flex-col gap-4">
        <a href="#download" class="flex items-center justify-center rounded-full bg-primary text-background py-3 px-6 text-base font-semibold hover:opacity-90 focus-visible:ring-2 focus-visible:ring-blue-500 outline-none">
          Download Android APK
        </a>
      </div>
    `;
    document.body.appendChild(drawer);
  }

  const closeBtn = drawer.querySelector('#close-mobile-menu') as HTMLButtonElement | null;
  const focusableElements = Array.from(
    drawer.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
  ) as HTMLElement[];

  const openDrawer = () => {
    menuBtn.setAttribute('aria-expanded', 'true');
    drawer?.classList.remove('hidden');
    drawer?.classList.add('flex');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      closeBtn?.focus();
    }, 50);
  };

  const closeDrawer = () => {
    menuBtn.setAttribute('aria-expanded', 'false');
    drawer?.classList.add('hidden');
    drawer?.classList.remove('flex');
    document.body.style.overflow = '';
    menuBtn.focus();
  };

  menuBtn.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Keyboard navigation & Focus trapping
  drawer.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeDrawer();
      return;
    }

    if (e.key === 'Tab' && focusableElements.length > 0) {
      const firstEl = focusableElements[0];
      const lastEl = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  });
}
