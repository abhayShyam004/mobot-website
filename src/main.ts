// Main Production Orchestrator for Grok Bot Website

import { initHeroDemo } from './controllers/heroDemo';
import { initUseCases } from './controllers/useCases';
import { initPricing } from './controllers/pricing';
import { initFaqs } from './controllers/faqs';
import { initDownload } from './controllers/download';
import { initNavigation } from './controllers/navigation';
import { initTheme } from './controllers/theme';
import { initMascotEyes } from './controllers/mascotEyes';

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e: Event) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update URL hash without jump
        window.history.pushState(null, '', href);
      }
    });
  });
}

function bootstrap() {
  const tasks = [
    { name: 'Navigation', fn: initNavigation },
    { name: 'Theme', fn: initTheme },
    { name: 'HeroDemo', fn: initHeroDemo },
    { name: 'UseCases', fn: initUseCases },
    { name: 'Pricing', fn: initPricing },
    { name: 'Faqs', fn: initFaqs },
    { name: 'Download', fn: initDownload },
    { name: 'MascotEyes', fn: initMascotEyes },
    { name: 'SmoothScroll', fn: initSmoothScroll }
  ];

  for (const task of tasks) {
    try {
      task.fn();
    } catch (err) {
      console.warn(`[Grok Bot] Warning initializing ${task.name}:`, err);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
