// Global Navigation & Mobile Drawer Controller - MOBOT Edition

export function initNavigation() {
  const header = document.querySelector('header');
  const menuBtn = (header?.querySelector('button[aria-label="Open menu"]') ||
    document.querySelector('button[data-drawer-trigger="true"]')) as HTMLButtonElement | null;
  if (!menuBtn) return;

  // Create accessible mobile navigation drawer if not already in DOM
  let drawer = document.getElementById('mobile-menu-drawer');
  if (!drawer) {
    drawer = document.createElement('div');
    drawer.id = 'mobile-menu-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'Mobile navigation menu');
    drawer.className = 'fixed inset-0 z-[100] hidden flex-col bg-white dark:bg-[#0c0c0c] p-6 text-primary transition-all duration-200 border-l border-border shadow-2xl';
    drawer.innerHTML = `
      <div class="flex items-center justify-between pb-5 border-b border-border">
        <a href="#hero" class="flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-md p-1">
          <img src="/logo.png" alt="MOBOT Icon" width="28" height="28" class="size-7 rounded-lg shrink-0 object-contain" />
          <span class="text-xl font-bold tracking-tight text-primary font-display">MOBOT</span>
        </a>
        <button type="button" id="close-mobile-menu" aria-label="Close menu" class="size-10 rounded-full flex items-center justify-center text-primary bg-primary/5 hover:bg-primary/10 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all">
          <svg viewBox="0 0 24 24" class="size-5 stroke-current stroke-2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <nav class="flex flex-col gap-4 pt-6 text-base font-medium text-secondary" aria-label="Mobile links">
        <a href="#hero" class="hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/20 rounded px-2 py-1.5 transition-colors">Overview</a>
        <a href="#features" class="hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/20 rounded px-2 py-1.5 transition-colors">Features</a>
        <a href="#use-cases" class="hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/20 rounded px-2 py-1.5 transition-colors">Specialist Roster</a>
        <a href="#pricing" class="hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/20 rounded px-2 py-1.5 transition-colors">Architecture & Pricing</a>
        <a href="#community" class="hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/20 rounded px-2 py-1.5 transition-colors flex items-center gap-2">
          <span>Help Build MOBOT</span>
          <span class="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">Open Source</span>
        </a>
        <a href="#download" class="hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/20 rounded px-2 py-1.5 transition-colors">Download Android APK</a>
        <a href="#faqs" class="hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/20 rounded px-2 py-1.5 transition-colors">FAQs</a>
        <a href="https://github.com/abhayShyam004/MOBOT" target="_blank" rel="noopener noreferrer" class="hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/20 rounded px-2 py-1.5 transition-colors flex items-center gap-1.5">
          <span>GitHub Repository</span>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" class="size-3.5"><path d="M4 12L12 4M12 4H6M12 4V10"/></svg>
        </a>
      </nav>
      <div class="mt-auto pt-6 border-t border-border flex flex-col gap-3">
        <a href="https://github.com/abhayShyam004/MOBOT/releases/download/v1.1.0/MOBOT-1.1.0-arm64-v8a.apk" download class="flex items-center justify-center rounded-full bg-primary text-background py-3 px-6 text-sm font-semibold hover:opacity-90 active:scale-95 transition-all outline-none shadow-sm">
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
