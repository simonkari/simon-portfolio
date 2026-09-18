// =========================================
// RANDOM MOMENTS — coverflow carousel
// Reads however many .moments-slide elements exist in the DOM,
// builds matching dots automatically, and handles:
//   - center + peeking-neighbor positioning (is-active/is-prev/is-next)
//   - autoplay, paused on hover, focus, or touch interaction
//   - prev/next arrow buttons
//   - dot navigation
//   - keyboard (Left/Right arrows when the carousel has focus)
//   - touch/pointer swipe
//   - prefers-reduced-motion: no autoplay, instant position changes
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('moments-carousel');
  const track = document.getElementById('moments-track');
  const dotsContainer = document.getElementById('moments-dots');
  const prevBtn = document.getElementById('moments-prev');
  const nextBtn = document.getElementById('moments-next');
  if (!carousel || !track || !dotsContainer || !prevBtn || !nextBtn) return;

  const slides = Array.from(track.querySelectorAll('.moments-slide'));
  const count = slides.length;
  if (count === 0) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let activeIndex = 0;
  let autoplayId = null;
  const AUTOPLAY_INTERVAL = 4500;

  // Build dots to match however many slides are present
  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'moments-carousel__dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to photo ${i + 1} of ${count}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
    return dot;
  });

  const mod = (n, m) => ((n % m) + m) % m;

  function render() {
    slides.forEach((slide, i) => {
      slide.classList.remove('is-active', 'is-prev', 'is-next');
      if (i === activeIndex) {
        slide.classList.add('is-active');
      } else if (i === mod(activeIndex - 1, count)) {
        slide.classList.add('is-prev');
      } else if (i === mod(activeIndex + 1, count)) {
        slide.classList.add('is-next');
      }
    });

    dots.forEach((dot, i) => {
      const isActive = i === activeIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  function goTo(index) {
    activeIndex = mod(index, count);
    render();
  }

  function next() {
    goTo(activeIndex + 1);
  }

  function prev() {
    goTo(activeIndex - 1);
  }

  function startAutoplay() {
    if (prefersReducedMotion || count <= 1) return;
    stopAutoplay();
    autoplayId = setInterval(next, AUTOPLAY_INTERVAL);
  }

  function stopAutoplay() {
    if (autoplayId) clearInterval(autoplayId);
    autoplayId = null;
  }

  prevBtn.addEventListener('click', () => {
    prev();
    startAutoplay(); // restart the timer so it doesn't jump right after a manual click
  });

  nextBtn.addEventListener('click', () => {
    next();
    startAutoplay();
  });

  // Pause on hover / keyboard focus, resume on leave
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('focusin', stopAutoplay);
  carousel.addEventListener('focusout', startAutoplay);

  // Keyboard navigation when the carousel region has focus
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prev();
      startAutoplay();
    } else if (e.key === 'ArrowRight') {
      next();
      startAutoplay();
    }
  });

  // Touch / pointer swipe support
  let dragStartX = null;
  const SWIPE_THRESHOLD = 40;

  track.addEventListener('pointerdown', (e) => {
    dragStartX = e.clientX;
    stopAutoplay();
  });

  track.addEventListener('pointerup', (e) => {
    if (dragStartX === null) return;
    const delta = e.clientX - dragStartX;
    if (delta > SWIPE_THRESHOLD) {
      prev();
    } else if (delta < -SWIPE_THRESHOLD) {
      next();
    }
    dragStartX = null;
    startAutoplay();
  });

  track.addEventListener('pointerleave', () => {
    dragStartX = null;
  });

  render();
  startAutoplay();
});
