// =========================================
// TECH STACK MARQUEE
// Duplicates the #marquee-list content once (so the loop is
// seamless — as copy 1 scrolls off, copy 2 is already in
// position to continue it) and computes the animation duration
// from the real measured width, so the scroll SPEED stays
// visually consistent (px/second) no matter how many logos are
// in the list — add 5 more logos later and it just keeps
// flowing at the same pace instead of suddenly speeding up.
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('marquee-track');
  const list = document.getElementById('marquee-list');
  if (!track || !list) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Don't duplicate or animate — leave it as one static, manually
    // scrollable row (overflow-x: auto is set in the CSS for this case).
    return;
  }

  // Clone the list for a seamless loop. The clone is purely
  // decorative/duplicate content, so it's hidden from screen readers.
  const clone = list.cloneNode(true);
  clone.removeAttribute('id');
  clone.removeAttribute('aria-label');
  clone.setAttribute('aria-hidden', 'true');
  track.appendChild(clone);

  const PIXELS_PER_SECOND = 45;

  function setSpeed() {
    const distance = list.getBoundingClientRect().width;
    const duration = distance / PIXELS_PER_SECOND;
    track.style.setProperty('--marquee-distance', `-${distance}px`);
    track.style.animationDuration = `${duration}s`;
  }

  setSpeed();

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(setSpeed, 200);
  });
});
