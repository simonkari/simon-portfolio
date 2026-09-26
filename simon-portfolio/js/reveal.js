// =========================================
// SCROLL-REVEAL
// Fades + lifts elements with class="reveal" into place
// as they enter the viewport. One IntersectionObserver
// watches everything (cheaper than a scroll listener),
// and each element is revealed once, then unobserved.
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Skip the animation entirely — just show everything immediately
    revealEls.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
});
