// Frequently Asked Questions Controller

export function initFaqs() {
  const faqSection = document.getElementById('faqs');
  if (!faqSection) return;

  const faqButtons = Array.from(faqSection.querySelectorAll('button[aria-controls]')) as HTMLButtonElement[];

  faqButtons.forEach((btn, index) => {
    const panelId = btn.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : btn.parentElement?.nextElementSibling as HTMLElement | null;
    const svg = btn.querySelector('svg');

    const toggle = () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        btn.setAttribute('aria-expanded', 'false');
        if (panel) {
          panel.style.height = `${panel.scrollHeight}px`;
          // Force reflow
          void panel.offsetHeight;
          panel.style.transition = 'height 0.25s ease-out, opacity 0.2s ease-out';
          panel.style.height = '0px';
          panel.style.opacity = '0';
          panel.setAttribute('inert', '');
        }
        if (svg) svg.classList.remove('rotate-45');
      } else {
        btn.setAttribute('aria-expanded', 'true');
        if (panel) {
          panel.removeAttribute('inert');
          panel.style.transition = 'height 0.25s ease-out, opacity 0.2s ease-out';
          panel.style.height = `${panel.scrollHeight}px`;
          panel.style.opacity = '1';

          const onTransitionEnd = () => {
            if (btn.getAttribute('aria-expanded') === 'true') {
              panel.style.height = 'auto';
            }
            panel.removeEventListener('transitionend', onTransitionEnd);
          };
          panel.addEventListener('transitionend', onTransitionEnd);
        }
        if (svg) svg.classList.add('rotate-45');
      }
    };

    btn.addEventListener('click', toggle);

    // Keyboard support: Enter, Space, ArrowUp, ArrowDown
    btn.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        toggle();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        faqButtons[(index + 1) % faqButtons.length]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        faqButtons[(index - 1 + faqButtons.length) % faqButtons.length]?.focus();
      }
    });
  });
}
