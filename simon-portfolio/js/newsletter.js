// =========================================
// NEWSLETTER SIGNUP — Formspree integration
// Same pattern as js/contact.js: the endpoint lives in the
// form's `action` attribute in index.html, not here. Create a
// SEPARATE Formspree form for newsletter signups (keeps them
// out of your contact-message inbox), then paste its endpoint
// into the newsletter <form>'s action attribute.
//
// Until that's set, the placeholder is detected automatically
// and this shows a local "thanks" message instead of failing.
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  const emailInput = document.getElementById('newsletter-email');
  const statusEl = document.getElementById('newsletter-status');

  const endpoint = form.getAttribute('action') || '';
  const isConfigured = endpoint.includes('formspree.io/f/') && !endpoint.includes('YOUR_NEWSLETTER_FORM_ID');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      emailInput.setAttribute('aria-invalid', 'true');
      statusEl.textContent = 'Please enter a valid email address.';
      statusEl.classList.remove('is-success');
      statusEl.classList.add('is-error');
      return;
    }

    emailInput.setAttribute('aria-invalid', 'false');

    if (isConfigured) {
      try {
        const formData = new FormData(form);
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData,
        });

        if (!response.ok) throw new Error('Submission failed');

        form.reset();
        statusEl.textContent = "You're on the list — thanks for signing up!";
        statusEl.classList.remove('is-error');
        statusEl.classList.add('is-success');
      } catch (err) {
        statusEl.textContent = 'Something went wrong. Please try again later.';
        statusEl.classList.remove('is-success');
        statusEl.classList.add('is-error');
      }
    } else {
      // No provider configured yet — local confirmation only, so the
      // UI still feels complete while you finish setting this up.
      form.reset();
      statusEl.textContent = 'Thanks! (Newsletter provider not connected yet — see js/newsletter.js)';
      statusEl.classList.remove('is-error');
      statusEl.classList.add('is-success');
    }
  });
});
