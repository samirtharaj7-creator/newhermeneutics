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
- `scripts/generate-static-routes.mjs`: regenerates static clean-URL pages from `index.html`.
- `home/`: Bible hero images.
- `vendor/`: local Tailwind runtime used by the app.
- `.nojekyll`: prevents GitHub Pages from filtering files through Jekyll.

## Regenerate Clean Routes

If `index.html` changes, regenerate the clean route pages:

```bash
node scripts/generate-static-routes.mjs
```
