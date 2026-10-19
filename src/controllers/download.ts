// Download Section Controller

export function initDownload() {
  const dlSection = document.getElementById('download');
  if (!dlSection) return;

  // Alternative Installs drawer toggle
  const altBtn = dlSection.querySelector('button[data-track="bot.downloads.more"]') ||
    Array.from(dlSection.querySelectorAll('button')).find(b =>
      b.textContent?.includes('Alternative Installs') ||
      b.textContent?.includes('More downloads') ||
      b.textContent?.includes('Other platforms')
    );
  const altPanel = dlSection.querySelector('#_r_0_') as HTMLElement | null;

  if (altBtn && altPanel) {
    altBtn.addEventListener('click', (e: Event) => {
      e.stopPropagation();
      const isExpanded = altBtn.getAttribute('aria-expanded') === 'true';
      altBtn.setAttribute('aria-expanded', String(!isExpanded));
      altPanel.classList.toggle('hidden', isExpanded);
    });

    // Close on click outside
    document.addEventListener('click', (e: MouseEvent) => {
      if (!dlSection.contains(e.target as Node)) {
        altBtn.setAttribute('aria-expanded', 'false');
        altPanel.classList.add('hidden');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && altBtn.getAttribute('aria-expanded') === 'true') {
        altBtn.setAttribute('aria-expanded', 'false');
        altPanel.classList.add('hidden');
        (altBtn as HTMLElement).focus();
      }
    });
  }
}
