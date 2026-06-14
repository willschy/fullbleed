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
- **Anthropic API:** key created and set in `.env` as of June 13, 2026. Powers the judge and writeup
  stages (`claude-sonnet-4-6`). Working.
- **Unsplash:** no account/key yet. NEEDED for the thumbnail stock-pull (free, self-serve at
  unsplash.com/developers, register an app, copy the Access Key). This is the next key required.
- **Higgsfield MCP** (`generate_image`): used this session to explore AI-generated covers (direction
  since abandoned in favor of filtered stock). Available if needed for other image work.

## Cloudflare Pages build config (already set, for reference)

- Production branch: `main` (auto-deploys on every push)
- Framework preset: None
- Build command: `npm run build`
- Build output directory: `site/dist`
- Env var: `NODE_VERSION = 22` (also pinned via `.nvmrc`)

## Secrets — what's needed and where they go

Local dev (`.env` at repo root — gitignored; template in `.env.example`):
```
ANTHROPIC_API_KEY=sk-...   # SET — powers judge + writeup (claude-sonnet-4-6)
GITHUB_TOKEN=              # optional — raises GitHub search rate limit 10→30/min (no scopes needed)
UNSPLASH_ACCESS_KEY=      # NEEDED NEXT — for the thumbnail stock-pull (self-serve, free)
REDDIT_CLIENT_ID=         # from Reddit script app, once API approved (still pending)
REDDIT_CLIENT_SECRET=
```
For the future GitHub Actions pipeline: the same values go in the repo's
**Settings → Secrets and variables → Actions** (not yet set up — see PROJECT-STATE roadmap #2).

## Will's open homework (the human-only items)

1. **Lock the thumbnail palette** — react to the five duotone colors at `/lab`. This is the active
   blocker for finishing imagery. (See handoff README "immediate next step".)
2. **Unsplash Access Key** — free, self-serve at unsplash.com/developers. Needed for the stock-pull.
   Drop into `.env` as `UNSPLASH_ACCESS_KEY`.
3. **Register `fullbleed.ai`** — ~$70–90/yr, 2-yr minimum. Deferred to launch; snipe risk on a
   guessable name. Grab social handles too.
4. **Reddit script-app credentials** — once the API application is approved (submitted June 12,
   ~2–4 wk), create the script app at reddit.com/prefs/apps and add client id + secret to `.env`.
   Not blocking anything thanks to the no-approval sources.

Done since the original handoff: Anthropic API key created and added (item used to be here). VOICE.md
was rewritten and locked this session, so the old "redline VOICE.md" task is superseded.

## Persistent memory (auto-loads in new chats in this project dir)

The assistant keeps memory at
`~/.claude/projects/-Users-wschlesinger-Documents-AI-Catalog-Scraper-Tool/memory/`:
- `MEMORY.md` (index)
- `ai-catalog-project-overview.md` (status, URLs, pipeline concept)
- `design-quality-bar.md` (the design-taste calibration)

These load automatically — but `handoff/` is the fuller, version-controlled reference.
