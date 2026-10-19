/**
 * Controller for the randomly spinning mascot circle in the Hero headline:
 * "Meet ⚪ MOBOT"
 *
 * Implements organic, lifelike physics with randomized:
 * - Angles (rotations & twirls in both clockwise & counter-clockwise directions)
 * - Timing intervals (unpredictable idle pauses between 1.2s - 3.8s, with 25% rapid double-takes)
 * - Durations (600ms - 1500ms)
 * - Dynamic bezier easings (spring overshoots, snappy glides, playful flings)
 * - Interactive hover & click hyper-spins
 */

export function initHeroCircle(): void {
  // Target the SVG spinner group or the SVG directly
  const spinner = (document.getElementById('hero-circle-spinner') ||
                   document.querySelector('#motion-_r_2e_') ||
                   document.querySelector('#hero h1 svg')) as HTMLElement | null;

  if (!spinner) return;

  const container = spinner.closest('.mobot-mark') as HTMLElement | null || spinner.parentElement;

  let currentRotation = 0;
  let isSpinning = false;
  let timer: number | null = null;
  let microTimer: number | null = null;

  // Center of the 92x92 circle geometry is at (44.87px, 46.23px)
  spinner.style.transformOrigin = '44.87px 46.23px';
  spinner.style.willChange = 'transform';

  if (container) {
    container.style.cursor = 'pointer';
    container.setAttribute('title', 'Yuki Companion (Click to spin!)');
  }

  // Playful easing curves
  const EASINGS = [
    'cubic-bezier(0.34, 1.56, 0.64, 1)',   // energetic spring overshoot
    'cubic-bezier(0.25, 1, 0.5, 1)',        // smooth organic deceleration
    'cubic-bezier(0.16, 1, 0.3, 1)',        // snappy expo out
    'cubic-bezier(0.68, -0.45, 0.27, 1.45)', // subtle back-pull then whip
    'cubic-bezier(0.22, 1, 0.36, 1)'        // sleek quint out
  ];

  function spinRandomly(interactive = false): void {
    if (isSpinning && !interactive) return;
    isSpinning = true;

    if (microTimer) {
      clearTimeout(microTimer);
      microTimer = null;
    }

    // Direction: clockwise (1) or counter-clockwise (-1)
    const dir = Math.random() > 0.45 ? 1 : -1;

    // Number of full 360 rotations + optional quarter-turn orientation
    let turns: number;
    let extraQuarter: number;

    if (interactive) {
      // Faster, bigger spin on user hover or click
      turns = 2 + Math.floor(Math.random() * 2); // 2 or 3 full spins
      extraQuarter = 0;
    } else {
      turns = 1 + Math.floor(Math.random() * 3); // 1, 2, or 3 full spins
      extraQuarter = Math.floor(Math.random() * 4) * 90; // 0, 90, 180, 270 deg
    }

    const delta = dir * (turns * 360 + extraQuarter);
    currentRotation += delta;

    // Duration: snappy if interactive, varied if autonomous
    const duration = interactive
      ? 550 + Math.random() * 350
      : 750 + Math.random() * 750;

    const easing = EASINGS[Math.floor(Math.random() * EASINGS.length)];

    spinner!.style.transition = `transform ${Math.round(duration)}ms ${easing}`;
    spinner!.style.transform = `rotate(${currentRotation}deg)`;

    // Slight scale pulse on container if available
    if (container && interactive) {
      container.style.transition = 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)';
      container.style.transform = 'scale(1.14)';
      setTimeout(() => {
        if (container) container.style.transform = 'scale(1)';
      }, 220);
    }

    setTimeout(() => {
      isSpinning = false;
      scheduleIdleTwitch();
      scheduleNextSpin();
    }, duration);
  }

  // Subtle micro-curiosity twitches while idling
  function scheduleIdleTwitch(): void {
    if (Math.random() > 0.6) return; // 40% chance of a tiny curious glance
    microTimer = window.setTimeout(() => {
      if (isSpinning) return;
      const glance = (Math.random() - 0.5) * 14; // ±7 degrees
      spinner!.style.transition = 'transform 350ms cubic-bezier(0.25, 1, 0.5, 1)';
      spinner!.style.transform = `rotate(${currentRotation + glance}deg)`;

      microTimer = window.setTimeout(() => {
        if (isSpinning) return;
        spinner!.style.transition = 'transform 300ms cubic-bezier(0.25, 1, 0.5, 1)';
        spinner!.style.transform = `rotate(${currentRotation}deg)`;
      }, 500);
    }, 700 + Math.random() * 900);
  }

  function scheduleNextSpin(): void {
    if (timer) clearTimeout(timer);

    // 25% chance of a quick consecutive double-spin (250-450ms)
    // 75% chance of an observational pause (1400-3400ms)
    const delay = Math.random() < 0.25
      ? 250 + Math.random() * 300
      : 1400 + Math.random() * 2200;

    timer = window.setTimeout(() => {
      spinRandomly(false);
    }, delay);
  }

  // Event Listeners for interactive delightful spinning
  const triggerTarget = container || spinner;

  triggerTarget.addEventListener('mouseenter', () => spinRandomly(true));
  triggerTarget.addEventListener('click', () => spinRandomly(true));
  triggerTarget.addEventListener('touchstart', () => spinRandomly(true), { passive: true });

  // Start initial autonomous spin after initial entrance settles
  setTimeout(() => {
    spinRandomly(false);
  }, 900);
}
