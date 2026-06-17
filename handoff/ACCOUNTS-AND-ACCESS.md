# Accounts, URLs & Access — Full Bleed

*Updated June 17, 2026.* No secrets are stored in this repo (`.env` is gitignored). This lists what exists, where things live, and what credentials are needed.

## URLs

| What | Where |
|---|---|
| Live preview site | https://fullbleed.pages.dev (private preview, **noindexed**, auto-deploys from `main`) |
| GitHub repo | https://github.com/willschy/fullbleed (public) |
| Cloudflare dashboard | https://dash.cloudflare.com → Workers & Pages → fullbleed |
| Target domain (not yet registered) | fullbleed.ai |

## Accounts

- **GitHub:** user `willschy`. Commit identity `willschy <willschy@users.noreply.github.com>`. `gh` CLI authenticated. The catalog is committed and pushed (latest `128a1cd`).
- **Cloudflare:** `William.b.schlesinger@gmail.com` (via GitHub OAuth). Account ID `9b99a1ac2f1e71808c11d40a01657724`. Pages project `fullbleed`. Auto-deploys on every push to `main`.
- **Anthropic API:** key set in `.env`. Powers judge + writeup (`claude-sonnet-4-6`). Working.
- **Product Hunt:** an API application was created; its **API Key + API Secret are in `.env`** (`PRODUCTHUNT_KEY` / `PRODUCTHUNT_SECRET`). The Product Hunt source's v2 GraphQL API path (vote-ranked, topic-filtered) is live.
- **Reddit:** account `u/willschybot`. API application submitted June 12, 2026 (still awaiting approval). Source skips gracefully until creds are set.
- **Higgsfield MCP** (`generate_image`): available if AI image work is ever revisited (the AI-cover direction was rejected, but the tool's there).

## Cloudflare Pages build config (set, for reference)

- Production branch: `main` (auto-deploys on push). Framework preset: None. Build command: `npm run build`. Output: `site/dist`. Env: `NODE_VERSION = 22` (also `.nvmrc`).

## Secrets — `.env` at repo root (gitignored; template in `.env.example`)

```
ANTHROPIC_API_KEY=sk-...   # SET — powers judge + writeup
GITHUB_TOKEN=              # optional — raises GitHub search rate limit 10→30/min
PRODUCTHUNT_KEY=           # SET — Product Hunt v2 API app key (vote-ranked, topic-filtered pulls)
PRODUCTHUNT_SECRET=        # SET — Product Hunt v2 API app secret
REDDIT_CLIENT_ID=          # pending Reddit API approval
REDDIT_CLIENT_SECRET=
```

For the future GitHub Actions pipeline, the same values go in repo **Settings → Secrets and variables → Actions** (not set up yet).

## Will's open homework (human-only items)

1. **Register `fullbleed.ai`** — ~$70–90/yr. Deferred to launch; snipe risk on a guessable name. Grab social handles too.
2. **Reddit script-app credentials** — once the API application is approved (submitted June 12, ~2–4 wk), create the script app at reddit.com/prefs/apps and add client id + secret to `.env`. Not blocking anything.

**Done / retired:** Anthropic key (set), Product Hunt API key+secret (set this session). The old **Unsplash key** homework is **dead** — it was for the stock-photo thumbnail pull, and stock imagery was rejected outright ("stock is out for good"). The old **thumbnail palette-lock** task is dead for the same reason (that whole direction was reverted). Imagery is unsolved but it's a design decision, not a credential — see README "THE IMMEDIATE NEXT STEP".

## Persistent memory (auto-loads in new chats in this project dir)

`~/.claude/projects/-Users-wschlesinger-Documents-AI-Catalog-Scraper-Tool/memory/` — `MEMORY.md` (index) plus per-fact files, including the new ones this session: `commit-means-deploy.md`, and the updated `thumbnail-treatment.md` (imagery UNSOLVED — all directions rejected). These load automatically; `handoff/` is the fuller version-controlled reference.
