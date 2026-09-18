// =========================================
// STAT COUNTER ANIMATION
// Animates numbers from 0 to their target value
// once they scroll into view. Uses IntersectionObserver
// so it only runs once, when needed (not on every scroll).
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  const statNumbers = document.querySelectorAll('[data-count-to]');
  if (!statNumbers.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animateCount = (el) => {
    const target = parseInt(el.dataset.countTo, 10);
    const suffix = el.dataset.suffix || '';

    if (prefersReducedMotion || isNaN(target)) {
      el.textContent = target + suffix;
      return;
    }

    const duration = 1200; // ms
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // Ease-out for a natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((el) => observer.observe(el));
});
