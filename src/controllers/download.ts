// Download Section Controller

export function initDownload() {
  const dlSection = document.getElementById('download');
  if (!dlSection) return;

  const linuxTrigger = dlSection.querySelector('button[data-linux-picker-trigger="true"]') ||
    Array.from(dlSection.querySelectorAll('button')).find(b => b.textContent?.includes('Linux'));
  const linuxPanel = dlSection.querySelector('#_r_0_') as HTMLElement | null;

  if (linuxTrigger && linuxPanel) {
    const togglePanel = (open?: boolean) => {
      const isCurrentlyOpen = linuxTrigger.getAttribute('aria-expanded') === 'true';
      const shouldOpen = open !== undefined ? open : !isCurrentlyOpen;

      linuxTrigger.setAttribute('aria-expanded', String(shouldOpen));
      linuxPanel.classList.toggle('hidden', !shouldOpen);
    };

    linuxTrigger.addEventListener('click', (e: Event) => {
      e.stopPropagation();
      togglePanel();
    });

    // Close on click outside
    document.addEventListener('click', (e: MouseEvent) => {
      if (!dlSection.contains(e.target as Node)) {
        togglePanel(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && linuxTrigger.getAttribute('aria-expanded') === 'true') {
        togglePanel(false);
        (linuxTrigger as HTMLElement).focus();
      }
    });
  }

  // More downloads drawer
  const buttons = Array.from(dlSection.querySelectorAll('button'));
  const moreBtn = buttons.find(b => b.textContent?.includes('More downloads') || b.textContent?.includes('Other platforms'));
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
