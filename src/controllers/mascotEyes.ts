// Interactive cursor tracking for the giant mascot eyes above footer

export function initMascotEyes() {
  const eyesGroupEl = document.getElementById('mascot-eyes');
  if (!eyesGroupEl) return;

  const svgEl = eyesGroupEl.closest('svg');
  if (!svgEl) return;

  const eyesGroup = eyesGroupEl;
  const svg = svgEl;

  // Reduced motion check
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let isAnimating = false;

  const maxShift = 30; // Maximum pupil translation in SVG units

  function render() {
    const dx = targetX - currentX;
    const dy = targetY - currentY;

    // Linear interpolation easing
    currentX += dx * 0.12;
    currentY += dy * 0.12;

    eyesGroup.style.transform = `translate(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px)`;

    // Keep loop active until settled within 0.05px
    if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
      requestAnimationFrame(render);
    } else {
      currentX = targetX;
      currentY = targetY;
      eyesGroup.style.transform = `translate(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px)`;
      isAnimating = false;
    }
  }

  function startAnimation() {
    if (!isAnimating) {
      isAnimating = true;
      requestAnimationFrame(render);
    }
  }

  function onPointerMove(e: MouseEvent | Touch) {
    if (prefersReducedMotion.matches) return;

    const rect = svg.getBoundingClientRect();
    // Eyes center is located in upper half of mascot head
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height * 0.42;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    const angle = Math.atan2(deltaY, deltaX);
    const dist = Math.hypot(deltaX, deltaY);

    // Natural distance response curve
    const shift = Math.min(dist / 500, 1) * maxShift;

    targetX = Math.cos(angle) * shift;
    targetY = Math.sin(angle) * shift;

    startAnimation();
  }

  window.addEventListener('mousemove', (e: MouseEvent) => {
    onPointerMove(e);
  }, { passive: true });

  window.addEventListener('touchmove', (e: TouchEvent) => {
    if (e.touches.length > 0) {
      onPointerMove(e.touches[0]);
    }
  }, { passive: true });

  // Reset to neutral forward gaze when pointer leaves the window
  document.documentElement.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
    startAnimation();
  });

  window.addEventListener('touchend', () => {
    targetX = 0;
    targetY = 0;
    startAnimation();
  });
}
