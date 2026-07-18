# Hermeneutics Guide Static GitHub Deployment

This folder is a static GitHub Pages-ready export. It does not require Vite, Vercel, Node, npm, or a build command.

## Deploy on GitHub Pages

1. Commit everything in this folder to a GitHub repository.
2. In GitHub, open `Settings` -> `Pages`.
3. Set the source to deploy from the branch and folder that contains this `index.html`.
4. Save. GitHub Pages will serve the static site.

## Files

- `index.html`: the main app shell.
- `404.html`: fallback copy for direct links/hash navigation.
- `assets/`: bundled JavaScript.
- `assets/hermeneutics-route-meta.js`: clean-route and SEO metadata helper.
- `home/`: optimized AVIF/WebP Bible hero images for the homepage scroll reveal.
- `scripts/generate-static-routes.mjs`: regenerates static clean-URL pages from `index.html`.
- `scripts/sanitize-tailwind-runtime.mjs`: deterministically removes the CDN-only production warning from the pinned, self-hosted Tailwind runtime.
- `scripts/validate-production-repairs.mjs`: checks the runtime sanitizer, cache versions, and dynamic-control accessibility mappings.
- `general-hermeneutics-complete-text.md`: source text for the General Hermeneutics document export.
- `vendor/`: local Tailwind runtime used by the app.
- `.nojekyll`: prevents GitHub Pages from filtering files through Jekyll.

PowerPoint inspection data and rendered slide previews are local QA artifacts and are intentionally ignored.

## Regenerate Clean Routes

If `index.html` changes, regenerate the clean route pages:

```bash
node scripts/generate-static-routes.mjs
```

## Validate Production Repairs

After replacing `vendor/tailwind.js`, sanitize it before deployment. The rewrite is exact-match guarded and idempotent.

```bash
node scripts/sanitize-tailwind-runtime.mjs
node scripts/sanitize-tailwind-runtime.mjs --check
node scripts/validate-production-repairs.mjs
node --check mbe-unified.js
```
