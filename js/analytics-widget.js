// =========================================
// SITE ANALYTICS WIDGET
// Everything below is SAMPLE DATA — replace it with real numbers
// from a privacy-friendly analytics provider (Plausible, Fathom,
// Vercel Analytics, etc.) once the site is live. This is the only
// place you need to edit; the chart, countries, donut, and stat
// counters all render themselves from this one object.
// =========================================

const analyticsData = {
  dateRangeLabel: 'Last 2 weeks · Sep 4 – Sep 18',
  visitors: 6481,
  pageViews: 25908,
  countries: 124,
  topCountry: 'United States',

  // 14 days of sample traffic — [pageViews, visitors] per day
  daily: [
    { views: 1400, visitors: 620 },
    { views: 2900, visitors: 640 },
    { views: 3100, visitors: 610 },
    { views: 3300, visitors: 630 },
    { views: 3450, visitors: 600 },
    { views: 3500, visitors: 590 },
    { views: 3150, visitors: 610 },
    { views: 2950, visitors: 640 },
    { views: 3350, visitors: 660 },
    { views: 2700, visitors: 600 },
    { views: 2850, visitors: 580 },
    { views: 2400, visitors: 560 },
    { views: 2750, visitors: 600 },
    { views: 1600, visitors: 520 },
  ],

  topCountries: [
    { code: 'US', name: 'United States', pct: 20 },
    { code: 'IN', name: 'India', pct: 9 },
    { code: 'CN', name: 'China', pct: 4 },
    { code: 'GB', name: 'United Kingdom', pct: 4 },
    { code: 'SA', name: 'Saudi Arabia', pct: 3 },
  ],

  devices: [
    { label: 'Mobile', pct: 48, colorVar: '--accent' },
    { label: 'Desktop', pct: 48, colorVar: '--accent-secondary' },
    { label: 'Tablet', pct: 4, colorVar: '--border-subtle' },
  ],
};

document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('analytics');
  if (!section) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const styles = getComputedStyle(document.documentElement);
  const cssVar = (name) => styles.getPropertyValue(name).trim();

  // ---- Header text ----
  document.getElementById('analytics-range').textContent = analyticsData.dateRangeLabel;
  document.getElementById('analytics-top-country').textContent = analyticsData.topCountry;

  // ---- Stat counters (comma-formatted, count up on scroll into view) ----
  const statEls = {
    visitors: document.getElementById('analytics-visitors'),
    pageviews: document.getElementById('analytics-pageviews'),
    countries: document.getElementById('analytics-countries'),
  };
  statEls.visitors.dataset.target = analyticsData.visitors;
  statEls.pageviews.dataset.target = analyticsData.pageViews;
  statEls.countries.dataset.target = analyticsData.countries;

  const formatNumber = (n) => Math.round(n).toLocaleString('en-US');

  const animateStat = (el) => {
    const target = Number(el.dataset.target);
    if (prefersReducedMotion || !target) {
      el.textContent = formatNumber(target);
      return;
    }
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatNumber(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // ---- Bar + line chart (built as inline SVG from the daily[] data) ----
  function renderChart() {
    const container = document.getElementById('analytics-chart');
    const { daily } = analyticsData;
    const W = 700;
    const H = 200;
    const padding = 6;
    const barGap = 6;
    const barWidth = (W - padding * 2) / daily.length - barGap;

    const maxViews = Math.max(...daily.map((d) => d.views));
    const maxVisitors = Math.max(...daily.map((d) => d.visitors));

    let bars = '';
    let linePoints = [];

    daily.forEach((d, i) => {
      const x = padding + i * (barWidth + barGap);
      const barH = (d.views / maxViews) * (H - 30);
      const y = H - barH;
      bars += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="2" fill="var(--accent-secondary)" opacity="0.85" />`;

      // Line sits in a lower band, echoing the reference's proportions
      const lineY = H - 14 - (d.visitors / maxVisitors) * 40;
      linePoints.push(`${x + barWidth / 2},${lineY}`);
    });

    const linePath = `<polyline points="${linePoints.join(' ')}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />`;
    const dots = linePoints
      .map((p) => {
        const [x, y] = p.split(',');
        return `<circle cx="${x}" cy="${y}" r="2.5" fill="var(--accent)" />`;
      })
      .join('');

    container.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${bars}${linePath}${dots}</svg>`;
  }

  // ---- Top countries list (with animated fill bars) ----
  function renderCountries() {
    const list = document.getElementById('analytics-countries-list');
    list.innerHTML = analyticsData.topCountries
      .map(
        (c) => `
        <li class="analytics-country">
          <span class="analytics-country__code mono">${c.code}</span>
          <span class="analytics-country__track"><span class="analytics-country__fill" data-pct="${c.pct}"></span></span>
          <span class="analytics-country__pct">${c.pct}%</span>
        </li>`
      )
      .join('');
  }

  // ---- Device donut chart (SVG stroke-dasharray segments) ----
  function renderDonut() {
    const svg = document.getElementById('analytics-donut');
    const legend = document.getElementById('analytics-donut-legend');
    const r = 46;
    const cx = 60;
    const cy = 60;
    const circumference = 2 * Math.PI * r;

    let offset = 0;
    let circles = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--bg-surface-hover)" stroke-width="16" />`;

    analyticsData.devices.forEach((d) => {
      const dash = (d.pct / 100) * circumference;
      circles += `<circle
        cx="${cx}" cy="${cy}" r="${r}" fill="none"
        stroke="var(${d.colorVar})" stroke-width="16"
        stroke-dasharray="0 ${circumference}"
        data-final-dash="${dash} ${circumference - dash}"
        stroke-dashoffset="${-offset}"
        transform="rotate(-90 ${cx} ${cy})"
      />`;
      offset += dash;
    });

    svg.innerHTML = circles;

    legend.innerHTML = analyticsData.devices
      .map(
        (d) => `<li><span class="dot" style="background-color: var(${d.colorVar})"></span>${d.label} ${d.pct}%</li>`
      )
      .join('');
  }

  function animateDonut() {
    const svg = document.getElementById('analytics-donut');
    const segments = svg.querySelectorAll('circle[data-final-dash]');
    segments.forEach((seg) => {
      if (prefersReducedMotion) {
        seg.setAttribute('stroke-dasharray', seg.dataset.finalDash);
      } else {
        requestAnimationFrame(() => {
          seg.setAttribute('stroke-dasharray', seg.dataset.finalDash);
        });
      }
    });
  }

  function animateCountryBars() {
    section.querySelectorAll('.analytics-country__fill').forEach((fill) => {
      const pct = fill.dataset.pct;
      if (prefersReducedMotion) {
        fill.style.width = `${pct}%`;
      } else {
        requestAnimationFrame(() => {
          fill.style.width = `${pct}%`;
        });
      }
    });
  }

  renderChart();
  renderCountries();
  renderDonut();

  // Trigger all the "on scroll into view" animations together once,
  // via the same IntersectionObserver pattern used elsewhere on the site.
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          Object.values(statEls).forEach(animateStat);
          animateCountryBars();
          animateDonut();
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  observer.observe(section);
});
