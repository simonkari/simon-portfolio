// =========================================
// NAVIGATION — sticky header background + mobile menu
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');

  if (!nav || !toggle || !links) return;

  // Add solid background once the user scrolls past the hero
  const handleScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 20);
  };
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Mobile menu toggle
  const closeMenu = () => {
    links.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  const openMenu = () => {
    links.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    // Move focus into the menu for keyboard users (Step 13 accessibility pass)
    const firstLink = links.querySelector('a');
    if (firstLink) firstLink.focus();
  };

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close menu when a link is clicked (mobile)
  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on Escape for keyboard users
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
      toggle.focus();
    }
  });
});
