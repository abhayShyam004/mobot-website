// Realistic 2D binocular cursor tracking for the giant mascot eyes in #get-started

export function initMascotEyes() {
  const leftEyeEl = document.getElementById('mascot-eye-left');
  const rightEyeEl = document.getElementById('mascot-eye-right');
  const fallbackEyesEl = document.getElementById('mascot-eyes');

  if (!leftEyeEl && !fallbackEyesEl) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Binocular tracking state for each eye
  interface EyeTracker {
    el: HTMLElement;
    targetX: number;
    targetY: number;
    currentX: number;
    currentY: number;
    rxRatio: number;
    ryRatio: number;
  }

  const eyes: EyeTracker[] = [];

  if (leftEyeEl && rightEyeEl) {
    eyes.push(
      { el: leftEyeEl, targetX: 0, targetY: 0, currentX: 0, currentY: 0, rxRatio: 0.28, ryRatio: 0.24 },
      { el: rightEyeEl, targetX: 0, targetY: 0, currentX: 0, currentY: 0, rxRatio: 0.28, ryRatio: 0.24 }
    );
  } else if (fallbackEyesEl) {
    eyes.push(
      { el: fallbackEyesEl, targetX: 0, targetY: 0, currentX: 0, currentY: 0, rxRatio: 0.22, ryRatio: 0.20 }
    );
  }

  let isAnimating = false;

  function render() {
    if (prefersReducedMotion.matches) {
      for (const eye of eyes) {
        eye.currentX = 0;
        eye.currentY = 0;
        eye.el.style.transform = 'translate(0px, 0px)';
      }
      isAnimating = false;
      return;
    }

    let hasDelta = false;

    for (const eye of eyes) {
      const dx = eye.targetX - eye.currentX;
      const dy = eye.targetY - eye.currentY;

      // Smooth linear interpolation (lerp factor = 0.16)
      eye.currentX += dx * 0.16;
      eye.currentY += dy * 0.16;

      eye.el.style.transform = `translate(${eye.currentX.toFixed(2)}px, ${eye.currentY.toFixed(2)}px)`;

      if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
        hasDelta = true;
      } else {
        eye.currentX = eye.targetX;
        eye.currentY = eye.targetY;
        eye.el.style.transform = `translate(${eye.currentX.toFixed(2)}px, ${eye.currentY.toFixed(2)}px)`;
      }
    }

    if (hasDelta) {
      requestAnimationFrame(render);
    } else {
      isAnimating = false;
    }
  }

  function startAnimation() {
    if (!isAnimating && !prefersReducedMotion.matches) {
      isAnimating = true;
      requestAnimationFrame(render);
    }
  }

  function updateGaze(clientX: number, clientY: number) {
    if (prefersReducedMotion.matches) return;

    for (const eye of eyes) {
      const rect = eye.el.getBoundingClientRect();
      
      // Calculate true socket center in client viewport space
      const socketCenterX = rect.left + rect.width / 2 - eye.currentX;
      const socketCenterY = rect.top + rect.height / 2 - eye.currentY;

      // Maximum safe travel within the elliptical eye socket
      const maxRadiusX = rect.width * eye.rxRatio;
      const maxRadiusY = rect.height * eye.ryRatio;

      // 2D Vector from eye socket center to cursor
      const dx = clientX - socketCenterX;
      const dy = clientY - socketCenterY;
      const dist = Math.hypot(dx, dy);

      if (dist > 0.001) {
        const ux = dx / dist;
        const uy = dy / dist;

        // Smooth asymptotic non-linear distance curve
        const intensity = dist / Math.sqrt(dist * dist + 160 * 160);

        // Map to elliptical boundary: (targetX / maxRadiusX)^2 + (targetY / maxRadiusY)^2 <= 1
        eye.targetX = ux * maxRadiusX * intensity;
        eye.targetY = uy * maxRadiusY * intensity;
      } else {
        eye.targetX = 0;
        eye.targetY = 0;
      }
    }

    startAnimation();
  }

  function resetToNeutral() {
    for (const eye of eyes) {
      eye.targetX = 0;
      eye.targetY = 0;
    }
    startAnimation();
  }

  // Pointer event listeners
  window.addEventListener('mousemove', (e: MouseEvent) => {
    updateGaze(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener('touchmove', (e: TouchEvent) => {
    if (e.touches.length > 0) {
      updateGaze(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  window.addEventListener('touchstart', (e: TouchEvent) => {
    if (e.touches.length > 0) {
      updateGaze(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // Return to neutral forward-facing gaze when pointer leaves or touch ends
  document.documentElement.addEventListener('mouseleave', resetToNeutral);
  window.addEventListener('blur', resetToNeutral);
  window.addEventListener('touchend', resetToNeutral);
  window.addEventListener('touchcancel', resetToNeutral);

  // Reduced motion preference changes
  prefersReducedMotion.addEventListener('change', () => {
    resetToNeutral();
  });
}
