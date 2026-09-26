// =========================================
// LIVE CODE WIDGET — animated typewriter
// Types out the lines below character by character with syntax
// highlighting, pauses, deletes it all, then loops forever.
// Edit `codeLines` to change what it types — each line is an
// array of {cls, text} segments. Available classes:
//   tok-kw    keywords (const, while, ...)
//   tok-str   string literals
//   tok-prop  object property names
//   tok-fn    function calls
//   tok-punct punctuation / operators
//   tok-plain plain identifiers
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  const linesEl = document.getElementById('code-lines');
  const statusDot = document.getElementById('code-status-dot');
  const statusText = document.getElementById('code-status-text');
  if (!linesEl || !statusDot || !statusText) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const codeLines = [
    [{ cls: 'tok-kw', text: 'const ' }, { cls: 'tok-plain', text: 'simon' }, { cls: 'tok-punct', text: ' = {' }],
    [{ cls: 'tok-punct', text: '  ' }, { cls: 'tok-prop', text: 'role' }, { cls: 'tok-punct', text: ': ' }, { cls: 'tok-str', text: "'Full-Stack Developer'" }, { cls: 'tok-punct', text: ',' }],
    [{ cls: 'tok-punct', text: '  ' }, { cls: 'tok-prop', text: 'skills' }, { cls: 'tok-punct', text: ': [' }, { cls: 'tok-str', text: "'AI'" }, { cls: 'tok-punct', text: ', ' }, { cls: 'tok-str', text: "'Cloud'" }, { cls: 'tok-punct', text: ', ' }, { cls: 'tok-str', text: "'APIs'" }, { cls: 'tok-punct', text: '],' }],
    [{ cls: 'tok-punct', text: '  ' }, { cls: 'tok-prop', text: 'location' }, { cls: 'tok-punct', text: ': ' }, { cls: 'tok-str', text: "'Nakuru, Kenya'" }, { cls: 'tok-punct', text: ',' }],
    [{ cls: 'tok-punct', text: '};' }],
    [],
    [{ cls: 'tok-kw', text: 'while ' }, { cls: 'tok-punct', text: '(' }, { cls: 'tok-plain', text: 'simon' }, { cls: 'tok-punct', text: '.' }, { cls: 'tok-prop', text: 'isBuilding' }, { cls: 'tok-punct', text: ') {' }],
    [{ cls: 'tok-punct', text: '  ' }, { cls: 'tok-fn', text: 'ship' }, { cls: 'tok-punct', text: '(' }, { cls: 'tok-fn', text: 'cleanCode' }, { cls: 'tok-punct', text: '());' }],
    [{ cls: 'tok-punct', text: '  ' }, { cls: 'tok-fn', text: 'learn' }, { cls: 'tok-punct', text: '(' }, { cls: 'tok-fn', text: 'somethingNew' }, { cls: 'tok-punct', text: '());' }],
    [{ cls: 'tok-punct', text: '}' }],
  ];

  // Build the row structure once: line numbers + an empty content
  // span per line, so the gutter is stable and only the code
  // "fills in" as typing progresses.
  const contentEls = codeLines.map((_, i) => {
    const row = document.createElement('div');
    row.className = 'code-line';

    const num = document.createElement('span');
    num.className = 'code-line__num';
    num.textContent = i + 1;

    const content = document.createElement('span');
    content.className = 'code-line__content';

    row.appendChild(num);
    row.appendChild(content);
    linesEl.appendChild(row);
    return content;
  });

  // ---- Reduced motion: render the final code once, statically ----
  if (prefersReducedMotion) {
    codeLines.forEach((segments, i) => {
      segments.forEach((seg) => {
        const span = document.createElement('span');
        span.className = seg.cls;
        span.textContent = seg.text;
        contentEls[i].appendChild(span);
      });
    });
    statusText.textContent = 'Done';
    statusDot.classList.add('is-done');
    return;
  }

  // ---- Animated typewriter loop ----
  const cursor = document.createElement('span');
  cursor.className = 'code-cursor';

  const setStatus = (state) => {
    statusDot.classList.remove('is-typing', 'is-done');
    if (state === 'typing') {
      statusDot.classList.add('is-typing');
      statusText.textContent = 'Typing...';
    } else if (state === 'done') {
      statusDot.classList.add('is-done');
      statusText.textContent = 'Done';
    } else {
      statusText.textContent = 'Idle';
    }
  };

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const randomDelay = (base, variance) => base + Math.random() * variance;

  async function typeLine(lineIndex) {
    const segments = codeLines[lineIndex];
    const contentEl = contentEls[lineIndex];

    for (const seg of segments) {
      const span = document.createElement('span');
      span.className = seg.cls;
      contentEl.appendChild(span);
      contentEl.appendChild(cursor);

      for (const char of seg.text) {
        span.textContent += char;
        await wait(randomDelay(16, 22));
      }
    }
    contentEl.appendChild(cursor);
  }

  async function deleteAll() {
    for (let i = contentEls.length - 1; i >= 0; i--) {
      const contentEl = contentEls[i];
      contentEl.appendChild(cursor);

      let tokenSpans = Array.from(contentEl.children).filter((el) => el !== cursor);
      while (tokenSpans.length > 0) {
        const target = tokenSpans[tokenSpans.length - 1];
        target.textContent = target.textContent.slice(0, -1);
        if (target.textContent === '') {
          target.remove();
          tokenSpans.pop();
        }
        await wait(randomDelay(6, 8));
      }
    }
  }

  async function loop() {
    /* eslint-disable no-constant-condition */
    while (true) {
      setStatus('idle');
      await wait(500);

      setStatus('typing');
      for (let i = 0; i < codeLines.length; i++) {
        await typeLine(i);
        await wait(60);
      }

      setStatus('done');
      await wait(2200);

      setStatus('idle');
      await wait(300);
      await deleteAll();
    }
  }

  loop();
});
