# Project State — Full Bleed

_Snapshot: June 13, 2026._

## Repository shape (npm workspaces monorepo)

```
/ (repo root)
├── package.json            # workspaces: ["scraper", "site"]; root scripts delegate to site
├── package-lock.json       # committed (reproducible CI builds)
├── .nvmrc                  # "22" — pins Cloudflare/CI Node version
├── .env.example            # template for secrets (real .env is gitignored)
├── project-spec.md         # product spec (source of truth)
├── VOICE.md                # house voice for AI writeups (DRAFT — needs Will's redline)
├── handoff/                # this briefing
├── scraper/                # the pipeline (TypeScript, run with tsx)
│   ├── config/
│   │   ├── sources.json    # subreddits + per-sub thresholds (minScore, minVelocity)
│   │   ├── blocklist.json  # keyword kill list
│   │   └── tags.json       # controlled vocab: categories, tools, disciplines
│   └── src/
│       ├── types.ts
│       ├── store.ts        # paths, JSON load/save, .env loader
│       ├── reddit.ts       # OAuth + listing/info fetch (403s without creds now)
│       ├── filters.ts      # dumb filters (flair, blocklist, must-have-demo)
│       ├── dedup.ts        # seen-set: postId / normalized URL / normalized title
│       ├── listen.ts       # poll sources → dumb-filter → holding pen
│       ├── promote.ts      # hourly: velocity-based promotion pen → scoring queue
│       ├── score.ts        # Claude Sonnet scores 1–10 + writeup (VOICE.md sys prompt)
│       ├── publish.ts      # writes entry .md + downloads thumbnail
│       ├── review.ts       # CLI: list / approve <id> / kill <id>
│       └── backfill.ts     # one-time: top posts of past year through same pipeline
└── site/                   # Astro 5 static site
    ├── astro.config.mjs    # site url, devToolbar disabled
    ├── src/
    │   ├── content.config.ts          # entries collection schema (incl. fixture flag)
    │   ├── styles/global.css          # design tokens (light+dark), page transition
    │   ├── layouts/Base.astro         # head, fonts, ClientRouter, theme + bookmark scripts, Footer
    │   ├── components/
    │   │   ├── TopNav.astro           # persistent nav: wordmark + search + links + theme toggle
    │   │   ├── Footer.astro           # persistent slim footer: brand + email + links
    │   │   └── Card.astro             # catalog card: image-forward hover + save button
    │   └── pages/
    │       ├── index.astro            # catalog: rail + grid + FLIP filtering + saved filter
    │       ├── about.astro            # about / credit & takedown
    │       └── entry/[id].astro       # entry page: hero + body + sticky info card + related
    └── src/content/entries/*.md       # THE DATABASE — 9 fixture entries (fixture: true)
```

## The pipeline (Reddit → site)

Flow: **listen (15 min) → dedup → holding pen → promote (hourly, velocity) → Sonnet score+writeup → review queue → publish → (manual) creator note**

Commands (from repo root):
```
npm run listen     # poll sources, dumb-filter, fill holding pen
npm run promote    # promote pen posts with traction to scoring queue
npm run score      # Sonnet scores 1–10 + writes entry; 7+ → review queue
npm run review     # list | approve <id> | kill <id>  (approve publishes)
npm run backfill   # seed from top-of-year posts (--dry to preview)
npm run dev        # run the site locally
npm run build      # build the site
```
- Scoring model: `claude-sonnet-4-6`. Publish threshold: 7+. State lives in `scraper/data/` (committed).
- **Status: code-complete + offline-tested, but never run against live Reddit** (blocked on API approval).

## Site — what's built (V1 essentially complete)

- Catalog grid, full-bleed image-forward cards, cinematic lead card (newest entry spans 2 cols)
- Card hover: image stays visible, gradient deepens, digest rises on a calm clipped slide;
  save (bookmark) button top-right; tap-to-expand on touch
- Left **faceted rail**: Saved · Category · Tool (with counts) · Freshness (current-only toggle);
  collapses to scrolling chip rows on mobile
- **FLIP-animated filtering** (survivors glide, newcomers fade-lift, removed cards float out)
- **Global search** in the nav (works from any page; submits to `/?q=` and filters on arrival)
- **Entry pages**: rounded hero + glass back pill, standfirst + why-line, "The how" as numbered
  step cards, "Run it back", sticky info card (category/stack/freshness/source + Save button),
  related-entries rail, superseded-banner forward link
- **Dark mode**: full theme system, no-flash init, sun/moon toggle, follows system pref
- **Page transition**: one intentional rise-and-fade between routes (exit faster than enter)
- **Persistent chrome**: nav + footer use `transition:persist` (static, content transitions inside)
- **Bookmarks**: localStorage `fb-saved`, save on cards + entry pages, Saved filter with live count
- **Slim footer**: Climate Crisis wordmark (left), email capture (center, stores locally), links (right)
- Deployed to Cloudflare Pages, auto-deploy on push, noindexed pre-launch

## NOT built yet (gaps)

| Gap | Notes |
|---|---|
| **Pipeline scheduling** | No GitHub Actions workflows run the scraper. The "always-on listener" is currently manual-only. Highest-leverage infra to build. |
| **Semantic search v1** | Current nav search is plain text-substring match. Spec wants embeddings-based meaning search (Cloudflare Workers AI `bge-small`, build-time index). The killer feature, still faked. |
| **Query logging** | Spec: log every search from day one (→ V2 standing orders). Needs a small endpoint (Cloudflare Function/Worker). |
| **Email service wiring** | Footer form stores intent in localStorage only; not connected to Buttondown/etc. Needed before launch. |
| **Share polish** | No OG image, no favicon, no custom 404. Link unfurls blank when shared. |
| **Analytics** | Cloudflare Web Analytics not enabled (free, no cookie banner). |
| **Creator notification** | Manual "you got featured" template not written. |
| **Real content + media** | All entries are fixtures w/ picsum images; thumbnail rehosting in publish.ts untested vs real Reddit. |

## Blocked / waiting (not our keyboard)

- **Reddit API approval** — application submitted June 12, 2026; ~2–4 week review. Unblocks real
  content → backfill → calibration. Until then, unauthenticated Reddit JSON 403s.
- **Voice-doc redline** — `VOICE.md` is a strong draft; Will needs to mark it up. Improves writeup
  quality. Pipeline can run on the draft meanwhile.
- **Domain** — `fullbleed.ai` confirmed unregistered (June 12); registration deferred to launch.

## Deferred to V2 (explicitly, per spec)

Magic-link accounts (= the bookmark→email sync bridge), on-demand "hunt" search, newsletter sends,
surge mode, X / tool-community sources, monetization.

## Prioritized roadmap

1. **Shareable polish** — OG image, favicon, custom 404, Cloudflare Web Analytics. (quick wins)
2. **Pipeline scheduling** — GitHub Actions workflows + repo secrets (ANTHROPIC_API_KEY, Reddit creds). Arm it pre-approval.
3. **Semantic search v1** — embeddings + build-time index + runtime query; log queries from day one.
4. **On Reddit approval** — `npm run backfill --dry` to tune thresholds → real backfill → score → a
   calibration session where Will hand-judges ~50 borderline posts vs Sonnet (tune rubric to ~90% agreement) → launch at 50–75 entries.
5. **Email wiring** (Buttondown) before launch.
6. **Launch** — register `fullbleed.ai`, swap real content in, remove the `noindex` meta in Base.astro, announce.

## Design polish still open (surfaces during device review)

Entry hero can eat the fold (consider capping height), empty states could be more charming,
a quick accessibility pass (focus states / keyboard / alt text), mobile entry-page two-col stacking.
