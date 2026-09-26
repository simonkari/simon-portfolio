// =========================================
// SIDE QUICK-NAV
// - Expands (icon + label) while the page is being scrolled,
//   collapses back to small dots ~1.1s after scrolling stops.
// - Stays expanded on hover or keyboard focus, so it never
//   disappears out from under someone trying to click/tab to it.
// - Highlights whichever section is currently in view
//   (scrollspy), via IntersectionObserver.
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  const sideNav = document.getElementById('side-nav');
  if (!sideNav) return;

  const links = Array.from(sideNav.querySelectorAll('.side-nav__link'));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let collapseTimeout;
  let isPointerInside = false;
  let isFocusInside = false;

  const expand = () => sideNav.classList.add('is-expanded');
  const scheduleCollapse = () => {
    clearTimeout(collapseTimeout);
    collapseTimeout = setTimeout(() => {
      if (!isPointerInside && !isFocusInside) {
        sideNav.classList.remove('is-expanded');
      }
    }, 1100);
  };

  // Expand while scrolling, collapse shortly after it stops
  window.addEventListener(
    'scroll',
    () => {
      expand();
      scheduleCollapse();
    },
    { passive: true }
  );

  // Stay expanded on hover
  sideNav.addEventListener('mouseenter', () => {
    isPointerInside = true;
    expand();
  });
  sideNav.addEventListener('mouseleave', () => {
    isPointerInside = false;
    scheduleCollapse();
  });

  // Stay expanded while any link inside has keyboard focus
  sideNav.addEventListener('focusin', () => {
    isFocusInside = true;
    expand();
  });
  sideNav.addEventListener('focusout', () => {
    isFocusInside = false;
    scheduleCollapse();
  });

  // Scrollspy — highlight whichever section is currently in view.
  // rootMargin trims the observed area to a band around the
  // vertical center of the viewport, so the "active" section
  // feels accurate rather than triggering the instant a section's
  // edge appears at the very top or bottom.
  const sectionIds = links.map((link) => link.dataset.section);
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const setActive = (id) => {
    links.forEach((link) => {
      link.classList.toggle('is-active', link.dataset.section === id);
    });
  };

  if (sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  // On very short/no-JS-motion setups there's no harm in leaving
  // the collapse/expand logic running — it just won't animate,
  // since the CSS transitions are already disabled under
  // prefers-reduced-motion (see style.css).
  if (prefersReducedMotion) {
    // no-op — behavior above still works, just without motion
  }
});
