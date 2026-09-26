// =========================================
// CONTACT FORM — Formspree integration
// The submission endpoint lives in ONE place: the form's
// `action` attribute in index.html. This script reads it from
// there, so you never have to edit JS to connect the form —
// just set the action URL once.
//
// Setup (2 minutes):
//   1. Go to https://formspree.io and sign up free
//   2. Create a new form, copy the endpoint it gives you
//      (looks like https://formspree.io/f/abcdwxyz)
//   3. Paste it into the `action="..."` attribute on the
//      <form id="contact-form"> in index.html
//
// Until you do that, the placeholder URL is detected automatically
// and the form falls back to opening the visitor's email app instead
// (mailto) — so it still works, just less seamlessly, in the meantime.
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusEl = document.getElementById('contact-status');
  const submitBtn = document.getElementById('contact-submit');

  const endpoint = form.getAttribute('action') || '';
  const isConfigured = endpoint.includes('formspree.io/f/') && !endpoint.includes('YOUR_FORM_ID');

  const fields = {
    name: form.querySelector('#name'),
    email: form.querySelector('#email'),
    message: form.querySelector('#message'),
  };

  const setError = (fieldName, message) => {
    const errorEl = form.querySelector(`[data-error-for="${fieldName}"]`);
    if (errorEl) errorEl.textContent = message;
    fields[fieldName].setAttribute('aria-invalid', message ? 'true' : 'false');
  };

  const validate = () => {
    let isValid = true;

    if (!fields.name.value.trim()) {
      setError('name', 'Please enter your name.');
      isValid = false;
    } else {
      setError('name', '');
    }

    const emailValue = fields.email.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValue) {
      setError('email', 'Please enter your email.');
      isValid = false;
    } else if (!emailPattern.test(emailValue)) {
      setError('email', 'Please enter a valid email address.');
      isValid = false;
    } else {
      setError('email', '');
    }

    if (!fields.message.value.trim()) {
      setError('message', 'Please write a short message.');
      isValid = false;
    } else {
      setError('message', '');
    }

    return isValid;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validate()) {
      statusEl.textContent = 'Please fix the errors above.';
      statusEl.classList.remove('is-success');
      statusEl.classList.add('is-error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const payload = {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      message: fields.message.value.trim(),
    };

    try {
      if (isConfigured) {
        // Formspree is set up — submit via fetch, using their JSON API
        // so we can show our own success/error state instead of a redirect.
        const formData = new FormData(form);
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData,
        });

        if (!response.ok) throw new Error('Submission failed');

        form.reset();
        statusEl.textContent = "Thanks! Your message has been sent — I'll get back to you soon.";
        statusEl.classList.remove('is-error');
        statusEl.classList.add('is-success');
      } else {
        // Formspree not connected yet — fall back to opening the visitor's
        // email client with the message pre-filled, so the form still works.
        const subject = encodeURIComponent(`Portfolio contact from ${payload.name}`);
        const body = encodeURIComponent(`${payload.message}\n\n— ${payload.name} (${payload.email})`);
        window.location.href = `mailto:kariithisimon1715@gmail.com?subject=${subject}&body=${body}`;

        statusEl.textContent = 'Opening your email app to send this message...';
        statusEl.classList.remove('is-error');
        statusEl.classList.add('is-success');
      }
    } catch (err) {
      statusEl.textContent = 'Something went wrong. Please email me directly instead.';
      statusEl.classList.remove('is-success');
      statusEl.classList.add('is-error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
});
