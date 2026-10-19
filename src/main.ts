// Main Production Orchestrator for Grok Bot Website

import { initHeroDemo } from './controllers/heroDemo';
import { initUseCases } from './controllers/useCases';
import { initPricing } from './controllers/pricing';
import { initFaqs } from './controllers/faqs';
import { initDownload } from './controllers/download';
import { initNavigation } from './controllers/navigation';
import { initTheme } from './controllers/theme';
import { initMascotEyes } from './controllers/mascotEyes';
import { initHeroCircle } from './controllers/heroCircle';

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

function initApkDownloadButtons() {
  const MOBOT_APK_URL = 'https://github.com/abhayShyam004/MOBOT/releases/download/v1.1.0/MOBOT-1.1.0-arm64-v8a.apk';

  // Ensure all elements intended as download buttons point directly to the APK
  document.querySelectorAll('a').forEach(el => {
    const text = el.textContent?.trim().toLowerCase() || '';
    const track = el.getAttribute('data-track') || '';
    const isDownloadAction =
      (track.includes('download') || text === 'download' || text === 'download apk' || text === 'download android apk') &&
      !track.includes('downloads.more');

    if (isDownloadAction) {
      el.setAttribute('href', MOBOT_APK_URL);
      el.setAttribute('download', '');
    }
  });
}

function bootstrap() {
  const tasks = [
    { name: 'Navigation', fn: initNavigation },
    { name: 'Theme', fn: initTheme },
    { name: 'HeroDemo', fn: initHeroDemo },
    { name: 'HeroCircle', fn: initHeroCircle },
    { name: 'UseCases', fn: initUseCases },
    { name: 'Pricing', fn: initPricing },
    { name: 'Faqs', fn: initFaqs },
    { name: 'Download', fn: initDownload },
    { name: 'ApkDownloadButtons', fn: initApkDownloadButtons },
    { name: 'MascotEyes', fn: initMascotEyes },
    { name: 'SmoothScroll', fn: initSmoothScroll }
  ];

  for (const task of tasks) {
    try {
      task.fn();
    } catch (err) {
      console.warn(`[MOBOT] Warning initializing ${task.name}:`, err);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
