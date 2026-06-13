# Accounts, URLs & Access — Full Bleed

No secrets are stored in this repo (and none should be). This lists what exists, where
things live, and what credentials are needed + where they go.

## URLs

| What | Where |
|---|---|
| Live preview site | https://fullbleed.pages.dev (private preview, noindexed) |
| GitHub repo | https://github.com/willschy/fullbleed (public) |
| Cloudflare dashboard | https://dash.cloudflare.com → Workers & Pages → fullbleed |
| Target domain (not yet registered) | fullbleed.ai |

## Accounts

- **GitHub:** user `willschy`. Git commit identity in this repo:
  `willschy <willschy@users.noreply.github.com>`. `gh` CLI is authenticated on Will's machine.
- **Cloudflare:** account `William.b.schlesinger@gmail.com` (signed up via GitHub OAuth).
  Account ID `9b99a1ac2f1e71808c11d40a01657724`. Pages project name: `fullbleed`.
- **Reddit:** account `u/willschybot`. API application submitted June 12, 2026 (awaiting approval).
- **Anthropic API:** key not yet created/added (needed for the scoring pipeline).

## Cloudflare Pages build config (already set, for reference)

- Production branch: `main` (auto-deploys on every push)
- Framework preset: None
- Build command: `npm run build`
- Build output directory: `site/dist`
- Env var: `NODE_VERSION = 22` (also pinned via `.nvmrc`)

## Secrets — what's needed and where they go

Local dev (`.env` at repo root — gitignored; template in `.env.example`):
```
REDDIT_CLIENT_ID=        # from Reddit script app, once API approved
REDDIT_CLIENT_SECRET=
ANTHROPIC_API_KEY=       # for the scoring stage (npm run score / backfill)
```
For the future GitHub Actions pipeline: the same values go in the repo's
**Settings → Secrets and variables → Actions** (not yet set up — see PROJECT-STATE roadmap #2).

## Will's open homework (the human-only items)

1. **Redline `VOICE.md`** — blocks nothing hard, but improves AI writeup quality. (3-min read.)
2. **Register `fullbleed.ai`** — ~$70–90/yr, 2-yr minimum (registry rule). Deferred to launch;
   snipe risk on a guessable name. Also grab social handles while at it.
3. **Anthropic API key** — create one; drop into `.env` for local pipeline runs.
4. **Reddit script-app credentials** — once the API application is approved, create the script
   app at reddit.com/prefs/apps and add client id + secret to `.env`.

## Persistent memory (auto-loads in new chats in this project dir)

The assistant keeps memory at
`~/.claude/projects/-Users-wschlesinger-Documents-AI-Catalog-Scraper-Tool/memory/`:
- `MEMORY.md` (index)
- `ai-catalog-project-overview.md` (status, URLs, pipeline concept)
- `design-quality-bar.md` (the design-taste calibration)

These load automatically — but `handoff/` is the fuller, version-controlled reference.
