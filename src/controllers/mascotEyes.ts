// Physics-based 2D binocular gaze tracking for the mascot character in #get-started
// Implements exact continuous-time analytical spring integration for frame-rate-independent, organic motion

interface EyeState {
  el: HTMLElement;
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
  velocityX: number;
  velocityY: number;
  rxRatio: number;
  ryRatio: number;
}

/**
 * Exact analytical solution of the 2nd-order damped harmonic oscillator:
 * x'' + 2*zeta*omega0*x' + omega0^2*(x - target) = 0
 * 
 * Provides 100% frame-rate-independent physics with zero integration error,
 * preserving momentum across direction reversals and varying refresh rates (60/120/144/240Hz).
 */
function stepSpring(
  x0: number,
  v0: number,
  target: number,
  dt: number,
  omega0 = 22.0,
  zeta = 0.92
): [number, number] {
  const delta = x0 - target;
  if (Math.abs(delta) < 1e-4 && Math.abs(v0) < 1e-3) {
    return [target, 0];
  }

  if (zeta < 0.9999) {
    // Underdamped regime (organic elasticity, subtle micro-overshoot < 0.5%)
    const omegaD = omega0 * Math.sqrt(1.0 - zeta * zeta);
    const decay = Math.exp(-zeta * omega0 * dt);
    const sinTerm = Math.sin(omegaD * dt);
    const cosTerm = Math.cos(omegaD * dt);

    const x = target + decay * (delta * cosTerm + ((v0 + zeta * omega0 * delta) / omegaD) * sinTerm);
    const v = decay * (v0 * cosTerm - ((zeta * omega0 * v0 + omega0 * omega0 * delta) / omegaD) * sinTerm);
    return [x, v];
  } else if (zeta > 1.0001) {
    // Overdamped regime
    const omegaD = omega0 * Math.sqrt(zeta * zeta - 1.0);
    const r1 = -zeta * omega0 + omegaD;
    const r2 = -zeta * omega0 - omegaD;
    const c1 = (v0 - r2 * delta) / (r1 - r2);
    const c2 = (r1 * delta - v0) / (r1 - r2);
    const e1 = Math.exp(r1 * dt);
    const e2 = Math.exp(r2 * dt);
    const x = target + c1 * e1 + c2 * e2;
    const v = c1 * r1 * e1 + c2 * r2 * e2;
    return [x, v];
  } else {
    // Critically damped regime (zeta = 1.0)
    const decay = Math.exp(-omega0 * dt);
    const a = delta;
    const b = v0 + omega0 * delta;
    const x = target + decay * (a + b * dt);
    const v = decay * (v0 - b * omega0 * dt);
    return [x, v];
  }
}

export function initMascotEyes() {
  const leftEyeEl = document.getElementById('mascot-eye-left');
  const rightEyeEl = document.getElementById('mascot-eye-right');
  const fallbackEyesEl = document.getElementById('mascot-eyes');

  if (!leftEyeEl && !fallbackEyesEl) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const eyes: EyeState[] = [];

  if (leftEyeEl && rightEyeEl) {
    eyes.push(
      { el: leftEyeEl, currentX: 0, currentY: 0, targetX: 0, targetY: 0, velocityX: 0, velocityY: 0, rxRatio: 0.28, ryRatio: 0.24 },
      { el: rightEyeEl, currentX: 0, currentY: 0, targetX: 0, targetY: 0, velocityX: 0, velocityY: 0, rxRatio: 0.28, ryRatio: 0.24 }
    );
  } else if (fallbackEyesEl) {
    eyes.push(
      { el: fallbackEyesEl, currentX: 0, currentY: 0, targetX: 0, targetY: 0, velocityX: 0, velocityY: 0, rxRatio: 0.22, ryRatio: 0.20 }
    );
  }

  let isAnimating = false;
  let lastTimestamp = 0;

  // Optional telemetry buffer for motion verification
  let isRecordingTrajectory = false;
  const trajectoryLog: Array<{
    t: number;
    cursorX: number;
    cursorY: number;
    eyes: Array<{ x: number; y: number; vx: number; vy: number; tx: number; ty: number }>;
  }> = [];

  let lastCursorX = window.innerWidth / 2;
  let lastCursorY = window.innerHeight / 2;

  // Physical Spring Constants (tuned from Framer Motion dynamics in original chunks)
  const OMEGA_0 = 22.0; // Natural angular frequency (rad/s)
  const ZETA = 0.92;    // Damping ratio (~0.1% micro-overshoot for living responsiveness)

  // Settling thresholds
  const REST_DELTA = 0.02; // px
  const REST_SPEED = 0.15; // px/s

  function physicsLoop(now: number) {
    if (prefersReducedMotion.matches) {
      for (const eye of eyes) {
        eye.currentX = 0;
        eye.currentY = 0;
        eye.velocityX = 0;
        eye.velocityY = 0;
        eye.el.style.transform = 'translate3d(0px, 0px, 0px)';
      }
      isAnimating = false;
      lastTimestamp = 0;
      return;
    }

    if (!lastTimestamp) {
      lastTimestamp = now;
    }

    // Measure delta time in seconds, clamped between 1ms and 50ms to prevent pause spikes
    const rawDt = (now - lastTimestamp) / 1000.0;
    const dt = Math.min(Math.max(rawDt, 0.001), 0.05);
    lastTimestamp = now;

    let hasActiveMotion = false;

    for (const eye of eyes) {
      // Step continuous analytical spring for X axis
      const [nextX, nextVx] = stepSpring(
        eye.currentX,
        eye.velocityX,
        eye.targetX,
        dt,
        OMEGA_0,
        ZETA
      );

      // Step continuous analytical spring for Y axis
      const [nextY, nextVy] = stepSpring(
        eye.currentY,
        eye.velocityY,
        eye.targetY,
        dt,
        OMEGA_0,
        ZETA
      );

      eye.currentX = nextX;
      eye.velocityX = nextVx;
      eye.currentY = nextY;
      eye.velocityY = nextVy;

      // Subpixel GPU-composited translation (3 decimal places)
      eye.el.style.transform = `translate3d(${eye.currentX.toFixed(3)}px, ${eye.currentY.toFixed(3)}px, 0px)`;

      // Check whether eye has settled to rest
      const isSettledX = Math.abs(eye.currentX - eye.targetX) < REST_DELTA && Math.abs(eye.velocityX) < REST_SPEED;
      const isSettledY = Math.abs(eye.currentY - eye.targetY) < REST_DELTA && Math.abs(eye.velocityY) < REST_SPEED;

      if (!isSettledX || !isSettledY) {
        hasActiveMotion = true;
      } else {
        // Snap to target at rest
        eye.currentX = eye.targetX;
        eye.velocityX = 0;
        eye.currentY = eye.targetY;
        eye.velocityY = 0;
        eye.el.style.transform = `translate3d(${eye.currentX.toFixed(3)}px, ${eye.currentY.toFixed(3)}px, 0px)`;
      }
    }

    // Telemetry capture if active
    if (isRecordingTrajectory) {
      trajectoryLog.push({
        t: performance.now(),
        cursorX: lastCursorX,
        cursorY: lastCursorY,
        eyes: eyes.map(e => ({
          x: e.currentX,
          y: e.currentY,
          vx: e.velocityX,
          vy: e.velocityY,
          tx: e.targetX,
          ty: e.targetY,
        }))
      });
    }

    if (hasActiveMotion) {
      requestAnimationFrame(physicsLoop);
    } else {
      isAnimating = false;
      lastTimestamp = 0;
    }
  }

  function startPhysics() {
    if (!isAnimating && !prefersReducedMotion.matches) {
      isAnimating = true;
      lastTimestamp = 0;
      requestAnimationFrame(physicsLoop);
    }
  }

  /**
   * Pure geometric gaze target calculation.
   * Maps cursor coordinates into the normalized coordinate frame of each eye socket.
   */
  function updateGazeTargets(clientX: number, clientY: number) {
    if (prefersReducedMotion.matches) return;

    lastCursorX = clientX;
    lastCursorY = clientY;

    for (const eye of eyes) {
      const rect = eye.el.getBoundingClientRect();

      // Socket center in client coordinates invariant to current eye translation
      const socketCenterX = rect.left + rect.width / 2 - eye.currentX;
      const socketCenterY = rect.top + rect.height / 2 - eye.currentY;

      // Socket travel limits proportional to rendered eye size
      const maxRadiusX = rect.width * eye.rxRatio;
      const maxRadiusY = rect.height * eye.ryRatio;

      // 2D directional vector from socket center to cursor
      const dx = clientX - socketCenterX;
      const dy = clientY - socketCenterY;
      const dist = Math.hypot(dx, dy);

      if (dist > 0.001) {
        const ux = dx / dist;
        const uy = dy / dist;

        // Smooth asymptotic distance response
        const intensity = dist / Math.sqrt(dist * dist + 160 * 160);

        // Elliptical socket mapping
        eye.targetX = ux * maxRadiusX * intensity;
        eye.targetY = uy * maxRadiusY * intensity;
      } else {
        eye.targetX = 0;
        eye.targetY = 0;
      }
    }

    startPhysics();
  }

  function resetToNeutral() {
    for (const eye of eyes) {
      eye.targetX = 0;
      eye.targetY = 0;
    }
    startPhysics();
  }

  // Pointer event listeners with passive capture
  window.addEventListener('mousemove', (e: MouseEvent) => {
    updateGazeTargets(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener('touchmove', (e: TouchEvent) => {
    if (e.touches.length > 0) {
      updateGazeTargets(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  window.addEventListener('touchstart', (e: TouchEvent) => {
    if (e.touches.length > 0) {
      updateGazeTargets(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // Natural return to forward gaze on pointer leave or window blur
  document.documentElement.addEventListener('mouseleave', resetToNeutral);
  window.addEventListener('blur', resetToNeutral);
  window.addEventListener('touchend', resetToNeutral);
  window.addEventListener('touchcancel', resetToNeutral);

  prefersReducedMotion.addEventListener('change', () => {
    resetToNeutral();
  });

  // Expose trajectory recording API on window for automated verification
  (window as unknown as {
    __startMascotTrajectoryRecording?: () => void;
    __stopMascotTrajectoryRecording?: () => typeof trajectoryLog;
  }).__startMascotTrajectoryRecording = () => {
    trajectoryLog.length = 0;
    isRecordingTrajectory = true;
  };

  (window as unknown as {
    __startMascotTrajectoryRecording?: () => void;
    __stopMascotTrajectoryRecording?: () => typeof trajectoryLog;
  }).__stopMascotTrajectoryRecording = () => {
    isRecordingTrajectory = false;
    return [...trajectoryLog];
  };
}
