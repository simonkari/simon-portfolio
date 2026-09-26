// =========================================
// MAIN ENTRY POINT
// Imports/initializes feature modules.
// Nav + counters logic are added in their own
// files (nav.js, counters.js) and wired up here
// as each section is built.
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  // Footer copyright year, kept current automatically
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
