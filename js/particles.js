// =========================================
// FULL-PAGE BACKGROUND — animated particle network
// A lightweight canvas animation: small drifting dots that
// connect with thin lines when close together, in the site's
// accent colors. Fixed to the viewport so it's visible behind
// every section as you scroll, from hero to footer.
//
// Performance choices:
//   - Fixed + viewport-sized (not document-height), so the
//     particle count stays constant no matter how long the
//     page is — no cost from scrolling a "tall" canvas.
//   - Pauses via the Page Visibility API when the browser tab
//     itself isn't visible (switched tabs, minimized window).
//   - Particle count scales down on small screens.
//   - Respects prefers-reduced-motion: draws one static frame
//     instead of animating.
//   - Capped device pixel ratio (max 2) to avoid huge canvases
//     on very high-DPI phones.
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width, height, dpr;
  let particles = [];
  let animationId = null;
  let isRunning = false;

  // Pull the real colors from CSS custom properties, so this
  // automatically matches variables.css if you ever retheme.
  const styles = getComputedStyle(document.documentElement);
  const colorGold = styles.getPropertyValue('--accent').trim() || '#FBBF24';
  const colorGreen = styles.getPropertyValue('--accent-secondary').trim() || '#13B276';
  const colorBg = styles.getPropertyValue('--bg-primary').trim() || '#161F2E';

  const hexToRgb = (hex) => {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  };

  const rgbGold = hexToRgb(colorGold);
  const rgbGreen = hexToRgb(colorGreen);

  const LINK_DISTANCE = 140;

  function getParticleCount() {
    // Roughly 1 particle per 20,000px² of viewport, clamped so
    // small phones and ultra-wide monitors both look right.
    const area = width * height;
    return Math.max(20, Math.min(80, Math.round(area / 20000)));
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = getParticleCount();
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      radius: Math.random() * 1.5 + 0.8,
      color: Math.random() > 0.5 ? rgbGold : rgbGreen,
    }));
  }

  function drawStaticFrame() {
    ctx.fillStyle = colorBg;
    ctx.fillRect(0, 0, width, height);
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, 0.4)`;
      ctx.fill();
    });
  }

  function step() {
    ctx.fillStyle = colorBg;
    ctx.fillRect(0, 0, width, height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges instead of bouncing — keeps motion calm
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, 0.55)`;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < LINK_DISTANCE) {
          const opacity = (1 - dist / LINK_DISTANCE) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${rgbGreen[0]}, ${rgbGreen[1]}, ${rgbGreen[2]}, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    if (isRunning) {
      animationId = requestAnimationFrame(step);
    }
  }

  function start() {
    if (isRunning || prefersReducedMotion) return;
    isRunning = true;
    animationId = requestAnimationFrame(step);
  }

  function stop() {
    isRunning = false;
    if (animationId) cancelAnimationFrame(animationId);
  }

  resize();

  if (prefersReducedMotion) {
    // Draw a single static frame — no motion, no rAF loop, ever
    drawStaticFrame();
  } else {
    start();

    // Pause when the browser tab itself is hidden (switched tabs,
    // minimized) — not tied to scroll position, since this now
    // runs for the whole page, top to bottom.
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 150);
    });
  }
});
