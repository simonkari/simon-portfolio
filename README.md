# Simon Kariithi — Portfolio

Personal portfolio site for Simon Kariithi (Full-Stack Developer, AI Engineer, Designer).

**Live:** https://simon-portfolio-beryl.vercel.app/
**Repo:** https://github.com/simonkari/simon-portfolio
**Stack:** Plain HTML, CSS, and JavaScript — no framework, no build step required.

---

## 1. Running locally

No build step required.

1. Open the folder in VS Code (or your editor of choice)
2. Right-click `index.html` → "Open with Live Server" (install the free "Live Server"
   VS Code extension first — gives you auto-reload on save)
   - Or just double-click `index.html` to open it directly in a browser
3. Edit, save, refresh

## 2. Deploying changes (GitHub + Vercel)

This site auto-deploys: every push to the `main` branch on GitHub triggers a new
Vercel deployment automatically, live in under a minute.

```bash
git add .
git commit -m "describe what you changed"
git push
```

That's it — no dashboard clicking, no manual re-upload. Check your
[Vercel dashboard](https://vercel.com/dashboard) to watch the deploy happen.

## 3. File structure

```
simon-portfolio/
├── index.html              All page content lives here, section by section
├── projects.json           Reference copy of project data (not live-rendered — see note below)
├── css/
│   ├── reset.css           Base browser reset
│   ├── variables.css       Design tokens: colors, type scale, spacing, radii
│   ├── style.css           All component/section styles
│   └── responsive.css      Breakpoint overrides (640px, 768px, 900px, 1024px+)
├── js/                     One file per feature — see section 5 below
├── assets/
│   ├── favicon.svg         "SK" monogram favicon
│   ├── images/              headshot.jpg, og-image.png, projects/, moments/
│   └── icons/
├── sitemap.xml / robots.txt  SEO files, already pointed at your live URL
├── .gitignore
└── README.md                This file
```

## 4. Editing content — where to look for what

| What you want to change | Where |
|---|---|
| Colors, fonts, spacing | `css/variables.css` — every color/size is a CSS variable, change once, applies everywhere |
| Hero name, headline, stats | `index.html` → `<section id="hero">` |
| "What I'm Building" project | `index.html` → `<section id="featured-project">` |
| The 4 project cards | `index.html` → `<section id="projects">` (each is a `<article class="project-card">`) |
| Service packages | `index.html` → `<section id="services">` |
| Tech stack logos (marquee) | `index.html` → `<ul id="marquee-list">` — add/remove `<li class="marquee__item">` entries freely, the loop rebuilds itself |
| Your story / photo | `index.html` → `<section id="about">`, photo file is `assets/images/headshot.jpg` |
| Random Moments carousel | `index.html` → `<ul id="moments-track">` — add/remove `<li class="moments-slide">` blocks, dots/arrows adapt automatically |
| Blog/writing cards | `index.html` → `<section id="writing">` |
| Site Analytics numbers | `js/analytics-widget.js` → the `analyticsData` object at the top (currently **sample data**, see section 7) |
| Contact info, socials | `index.html` → `<section id="contact">` and the `<footer>` |
| Code widget's typed snippet | `js/code-widget.js` → the `codeLines` array |

**Note on `projects.json`:** early in the build this was meant to be the live data
source, but the project cards ended up hardcoded directly into `index.html` instead
(better for SEO — see the Step 7 decision). The JSON file is kept as a clean
reference/backup of your project data, but editing it alone won't change what's on
the page — edit the HTML directly.

## 5. JavaScript files, what each one does

| File | Does |
|---|---|
| `main.js` | Footer copyright year |
| `nav.js` | Sticky header background on scroll, mobile menu toggle |
| `side-nav.js` | Right-edge quick-nav: scroll-to-expand, scrollspy active-section highlighting |
| `counters.js` | Hero stat count-up animation |
| `reveal.js` | Scroll-triggered fade-in for cards/sections |
| `particles.js` | Full-page animated background (gold/green dots + connecting lines) |
| `marquee.js` | Tech stack infinite-loop logo scroller |
| `code-widget.js` | Animated typewriter code snippet |
| `moments-carousel.js` | Random Moments coverflow carousel |
| `analytics-widget.js` | Site Analytics chart/donut/counters (sample data) |
| `contact.js` | Contact form validation + Formspree submission |
| `newsletter.js` | Newsletter form validation + Formspree submission |

## 6. Forms — Formspree

Both forms submit to Formspree, configured directly on the `<form>` tag's `action`
attribute in `index.html` (not in the JS — the JS just reads whatever URL is there):

- **Contact form:** `https://formspree.io/f/xyzjwnjz`
- **Newsletter form:** `https://formspree.io/f/mnpnnove`

Log into [formspree.io](https://formspree.io) to see submissions, set up email
notifications, or add spam filtering rules.

## 7. Known placeholders still worth finishing

Everything below works and looks correct, but is placeholder content marked in the
code with `PLACEHOLDER` comments — worth a pass before you send this link to anyone:

- [ ] Real numbers for hero stats: Projects Built / Happy Clients (`index.html`, `#hero`)
- [ ] Descriptions, live links, and repo links for the 4 project cards
- [ ] Phone number and Calendly (or similar) booking link in Contact section
- [ ] Second paragraph of your story in the About section
- [ ] Real photos + captions for the 4 Random Moments carousel slides
- [ ] Site Analytics — currently sample data (`js/analytics-widget.js`); swap in real
      numbers once you connect a privacy-friendly analytics provider (Plausible,
      Fathom, or Vercel Analytics all work well for a static site like this)
- [ ] Mama's Kitchen live demo / repo links, once that project ships

## 8. Optional: custom domain

Currently live at the free `.vercel.app` URL. To connect a real domain:
1. Buy one (Namecheap, Porkbun, etc.) if you don't have one
2. In Vercel → your project → Settings → Domains → add it
3. Add the DNS records Vercel gives you at your registrar
4. Once it's active, update the canonical tag, Open Graph tags, `sitemap.xml`, and
   `robots.txt` in `index.html` to the new domain (same find-and-replace we did to
   switch from the placeholder domain to the current Vercel URL)

## 9. Production build (optional, `dist/`)

`dist/` is a combined + minified version of the CSS/JS (not currently deployed —
Vercel is serving the project root as-is, which works fine and is simpler to
maintain). Regenerate it only if you want the smaller payload:

```bash
mkdir -p dist/css dist/js
npx clean-css-cli -o dist/css/style.min.css css/reset.css css/variables.css css/style.css css/responsive.css
npx terser js/nav.js -c -m -o dist/js/nav.min.js
npx terser js/counters.js -c -m -o dist/js/counters.min.js
npx terser js/reveal.js -c -m -o dist/js/reveal.min.js
npx terser js/particles.js -c -m -o dist/js/particles.min.js
npx terser js/side-nav.js -c -m -o dist/js/side-nav.min.js
npx terser js/marquee.js -c -m -o dist/js/marquee.min.js
npx terser js/code-widget.js -c -m -o dist/js/code-widget.min.js
npx terser js/moments-carousel.js -c -m -o dist/js/moments-carousel.min.js
npx terser js/analytics-widget.js -c -m -o dist/js/analytics-widget.min.js
npx terser js/contact.js -c -m -o dist/js/contact.min.js
npx terser js/newsletter.js -c -m -o dist/js/newsletter.min.js
npx terser js/main.js -c -m -o dist/js/main.min.js
cp index.html dist/index.html   # then manually swap in the .min.css/.min.js paths
cp -r assets projects.json robots.txt sitemap.xml dist/
```

`dist/` is git-ignored, so it never pollutes the repo — regenerate it locally
whenever you actually want to deploy it.

## 10. Accessibility & performance notes

- Every animation (particles, counters, carousels, typewriter, scroll-reveal)
  respects `prefers-reduced-motion` and either skips or shows a static final state
- All images use `loading="lazy"` and have a graceful "coming soon" fallback if the
  file is missing
- Color palette was extracted and contrast-checked against WCAG AA (see the accent
  gold/green + text colors in `variables.css`)
- Mobile menu and side quick-nav are fully keyboard-navigable
