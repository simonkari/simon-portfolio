# Simon Kariithi — Portfolio

Personal portfolio site for Simon Kariithi (Full-Stack Developer, AI Engineer, Designer).

## Status
🚧 In progress — being built step by step. See `PROJECT-LOG.md` (added later) or the build conversation for current progress.

## Running locally
No build step required — it's plain HTML/CSS/JS.

1. Open the folder in VS Code (or your editor of choice)
2. Right-click `index.html` → "Open with Live Server" (recommended — install the "Live Server" VS Code extension for auto-reload)
   - Or simply double-click `index.html` to open it directly in your browser
3. Edit files, save, refresh

## Editing content
- **Projects:** edit `projects.json` — no HTML editing needed to update project cards
- **Colors/spacing/type scale:** edit `css/variables.css`
- **Text content:** edit directly in `index.html` (marked with placeholder comments)

## Production build (dist/)
The `dist/` folder is an optional, pre-built production version: combined + minified
CSS, minified JS, same HTML (unminified — an HTML minifier corrupted the inline
`onerror` image-fallback attributes, so `index.html` in `dist/` is left as-is on
purpose). Deploy `dist/` instead of the project root for a slightly smaller payload.

**Always edit files in the project root, never inside `dist/`.** If you change
anything, regenerate `dist/` before your next deploy:

```bash
mkdir -p dist/css dist/js
npx clean-css-cli -o dist/css/style.min.css css/reset.css css/variables.css css/style.css css/responsive.css
npx terser js/nav.js -c -m -o dist/js/nav.min.js
npx terser js/counters.js -c -m -o dist/js/counters.min.js
npx terser js/reveal.js -c -m -o dist/js/reveal.min.js
npx terser js/contact.js -c -m -o dist/js/contact.min.js
npx terser js/newsletter.js -c -m -o dist/js/newsletter.min.js
npx terser js/main.js -c -m -o dist/js/main.min.js
cp index.html dist/index.html   # then manually swap in the .min.css/.min.js paths, see dist/index.html for reference
cp -r assets projects.json robots.txt sitemap.xml dist/
```

This step is optional — deploying the unminified root folder works perfectly
fine too, just with slightly larger CSS/JS file sizes.

## Full setup, editing guide, and deployment instructions
Coming in Step 18 (Handoff Documentation).
