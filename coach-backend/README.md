# Guided Study AI guide

The Guided Study page (`ask-ai/index.html`) can call Claude to coach the reader through the ten
steps. The page is public, so the Anthropic API key lives in a small Cloudflare Worker instead.

- `playbook.md` — the coach's rules (the system prompt).
- `steps.mjs` — the ten steps and the spec for each part (goal, what to coach, pitfalls, finish line).
- `genres.mjs` — the genre guides, copied from the page.
- `worker/` — the Cloudflare Worker. One endpoint, `POST /api/coach`, with three tasks:
  `case_brief` (when a case opens), `step_guide` (when a step opens), `check_work` ("Check my work").

Model: Claude Sonnet 5.5 at medium effort (change `MODEL` / `EFFORT` in `worker/wrangler.toml`).
The prompt is cached, so most of the cost is the answer itself: roughly a few cents per step,
about 20–50 cents for a full study.

## One-time setup (about 5 minutes)

1. Create a free Cloudflare account: https://dash.cloudflare.com/sign-up
2. Get an API key: https://console.anthropic.com → **API Keys** → **Create Key**. Copy it.
3. Set a spending cap: https://console.anthropic.com → **Settings → Limits** → set a monthly limit
   you are comfortable with. This is the real safety net if the site gets heavy traffic.
4. In Terminal, from this repository:

   ```bash
   cd coach-backend/worker
   npm install
   npx wrangler login
   ```

   `wrangler login` opens your browser; approve it with your Cloudflare account.

5. Store the API key as a secret (paste the key when it asks; it is not shown on screen):

   ```bash
   npx wrangler secret put ANTHROPIC_API_KEY
   ```

6. Deploy:

   ```bash
   npx wrangler deploy
   ```

   It prints a URL like `https://hermeneutics-coach.<your-name>.workers.dev`.

7. Turn the guide on: put that URL in `COACH_URL` near the top of the script in
   `ask-ai/index.html`, then commit and push.

To try it before turning it on for everyone, open
`https://hermeneutics.mybibleexplorer.com/ask-ai/?coach=<worker URL>` (only your browser remembers
it; `?coach=off` clears it).

## Local testing without a key

`worker/.dev.vars` sets `MOCK=1`, so `npx wrangler dev` returns sample answers. Serve the site on
port 8000 and open `http://localhost:8000/ask-ai/?coach=http://127.0.0.1:8787`.

## Limits

- 20 requests a minute per visitor (Cloudflare rate limit in `wrangler.toml`).
- Only `https://hermeneutics.mybibleexplorer.com` and `http://localhost:8000` may call it.
- Reader notes are capped at 4,000 characters per part.
