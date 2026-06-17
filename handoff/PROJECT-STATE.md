# Project State — Full Bleed

*Snapshot: June 17, 2026. Rewritten this session to reflect the live/committed catalog, the Product Hunt commercial source, and the imagery situation.*

## The shift this session (Session 3)

Three things happened:
1. **A thumbnail/imagery exploration that Will rejected wholesale and we reverted** — a vibrant palette + a blurred-halftone/solarized stock-duotone treatment, then a Y2K code-generated SVG cover system + a "disciplines" facet. Will hated all of it ("ugly as hell"), asked to undo the entire chat's work, and we did. That revert is commit `18e8c24`, which also **committed + pushed the prior-session catalog work for the first time** (it had been uncommitted).
2. **Fixed the open-source-only bias.** The catalog only caught open/buildable work (GitHub/HF) and missed the commercial/closed tools working creatives actually use. We added **Product Hunt** as a commercial source and made the brief explicit that closed/paid work is first-class.
3. **Published the first commercial entries and went live.** Judged 57 Product Hunt launches, kept 13, published 10. Catalog is now **31 entries, committed and deployed** (commit `128a1cd`).

## Repository shape (npm workspaces monorepo)

```
/ (repo root)
├── CURATION.md            # THE curation brief. Now includes "Open and closed — both first-class".
├── VOICE.md               # locked house writeup voice
├── project-spec.md        # original spec (history)
├── README.md
├── handoff/               # this briefing
├── .env                   # ANTHROPIC_API_KEY, PRODUCTHUNT_KEY, PRODUCTHUNT_SECRET set. (gitignored)
├── scraper/               # the pipeline (TypeScript, run with tsx)
│   ├── config/
│   │   ├── sources.json   # per-source config + a "filters" block. NOW INCLUDES producthunt (topics, minVotes, etc.)
│   │   ├── blocklist.json
│   │   └── tags.json
│   └── src/
│       ├── types.ts            # Candidate, Source adapter, all config types. SourceId now includes "producthunt".
│       ├── store.ts            # paths, JSON load/save, .env loader
│       ├── filters.ts          # dumbFilter, looksEnglish, recencyOk, candidateDate. NO open-source bias.
│       ├── sources/            # the adapters (the compiler)
│       │   ├── index.ts        # buildSources() registry — Product Hunt registered here
│       │   ├── reddit.ts       # skips gracefully if no creds (still pending API approval)
│       │   ├── hackernews.ts   # Algolia, no key
│       │   ├── github.ts       # search API, optional GITHUB_TOKEN
│       │   ├── arena.ts        # disabled in config
│       │   ├── arxiv.ts        # disabled (HF Papers is primary)
│       │   ├── huggingface.ts  # models API (Models lane)
│       │   ├── hfpapers.ts     # HF daily_papers, upvote-ranked (Papers lane)
│       │   └── producthunt.ts  # NEW — commercial intake. API path (vote-ranked, topic-filtered) + keyless Atom fallback.
│       ├── listen.ts           # poll enabled sources → recency + english + dumb filter → pen
│       ├── judge.ts            # THE TASTE GATE: Sonnet vs CURATION.md, 7+ keeps. OVERWRITES verdicts.json each run.
│       ├── writeup.ts          # writes entries in VOICE.md voice. OVERWRITES writeups.json each run. --ids targeting is BROKEN (see gotchas).
│       ├── publish-entries.ts  # writeups → Astro entry .md + harvested thumbnail. Publishes EVERY writeup in writeups.json.
│       └── (legacy: backfill.ts, score.ts, publish.ts, review.ts — Reddit-era, kept compiling)
│   └── data/                   # SCRATCH pipeline state (committed, but regenerable)
│       ├── pen.json            # holding pen — ~307 caught candidates (incl. Product Hunt)
│       ├── seen.json           # dedup set
│       ├── verdicts.json       # judge results (now includes Product Hunt verdicts)
│       ├── writeups.json       # 31 generated entries
│       └── keepers.md          # human-readable keeper list
└── site/                       # Astro 5 static site
    ├── src/
    │   ├── content.config.ts   # entries schema (5 categories + disciplines field exists, currently all [])
    │   ├── components/Card.astro   # renders d.thumbnail; data-category/tools/superseded
    │   └── pages/
    │       ├── index.astro     # category + tool + freshness facets (the discipline facet built this session was REVERTED)
    │       ├── entry/[id].astro# hero uses d.thumbnail
    │       └── lab.astro        # SCRATCH (the old duotone lab; harmless)
    ├── public/thumbs/          # harvested entry thumbnails (mixed: OG cards + PH product images)
    └── src/content/entries/*.md  # THE DATABASE — 31 entries
```

## The pipeline (commands, from repo root)

Flow: **listen → judge → writeup → publish-entries → cover → site**

```
npm run listen           # poll enabled sources (incl. Product Hunt), filter, fill pen
npm run judge            # Sonnet taste gate vs CURATION.md; `-- --all` for the whole pen. OVERWRITES verdicts.json.
npm run writeup          # generate entries in VOICE.md voice. OVERWRITES writeups.json. (--ids targeting BROKEN — see gotchas)
npm run publish-entries  # write entries into the site (thumbnail:null — covers come next, no more harvesting)
npm run cover            # thermal cover per entry w/o one: Sonnet art-direction → Unsplash → treat → WebP. Idempotent. (covers/cover_engine.py; needs UNSPLASH_ACCESS_KEY + numpy/Pillow)
npm run dev / build      # run / build the Astro site (output site/dist). Launch config: .claude/launch.json ("site", port 4321)
```

- Model: `claude-sonnet-4-6`. Keep threshold 7+. Needs `ANTHROPIC_API_KEY`. ~1¢/item judge; full-pen pass ~$2–3.

## Sources status

| Source | State | Notes |
|---|---|---|
| **Product Hunt** | **live (NEW)** | Commercial intake. API path (vote-ranked, topic-filtered: artificial-intelligence/design-tools/marketing) using PRODUCTHUNT_KEY+SECRET; keyless Atom-feed fallback. Vote count = signal. |
| Hugging Face models | live, no key | Models lane (open weights) |
| HF daily papers | live, no key | Papers lane (upvote-ranked) |
| GitHub | live, optional token | Open repos. Strong signal but open-only. |
| Hacker News | live, no key | Low yield for this audience |
| Reddit | pending API approval | Adapter built; skips until creds set |
| Are.na / arXiv | built, disabled | |

## The curation brief (CURATION.md)

- Five categories: **Tools · Automations · Models · Plugins & Skills · Papers**. Disciplines are a secondary tag axis (image/video/design…), surfaced as "what you do."
- The bar: new (≤~6 months, target ~2), genuinely impressive/useful, differentiated, English, shows real work.
- **NEW this session — "Open and closed, both first-class":** judge the work, never the license. A closed/paid release (Midjourney, a frontier model, a paid design app) is as worthy as any open repo. An open-source-only catalog is a sourcing failure. (There was no open-source bias in the judge/filters logic — the bias was purely the sources.)

## Current catalog state

- **31 entries, live.** Includes the 10 Product Hunt commercial entries (categories: Models ×1 [Claude Opus 4.6], Plugins & Skills ×2 [Figma MCP, Claude in PowerPoint], Tools ×7 [Stitch 3.0, Chronicle, Claude Design, Magic Patterns, Pitch Agent, Hera, Kodo]).
- The taste gate worked exactly as designed on the commercial intake: of the 57 PH launches, only 13 kept — popular ≠ kept; it killed the CRMs, SEO bots, AI therapy, etc. on-brief.

## Imagery (THE open problem)

UNSOLVED. Every direction has been rejected (AI riso → slop; stock duotone → "ugly as hell"; Y2K code-gen covers → reverted). The codebase has **no cover system**. Entries point to **harvested thumbnails**: the original ~21 use OG-card/sample grabs from publish-entries; the 10 Product Hunt entries use PH product screenshots. The catalog therefore looks **mixed/uneven**. Constraints for the next attempt are in README ("THE IMMEDIATE NEXT STEP") and DECISIONS Session 3.

## Pending / open

- **Imagery** (active blocker — see README).
- **Grow to 50–75** (more PH topics / lower vote floor; re-run listen+judge).
- **Taxonomy:** categories vs discipline spine — unresolved.
- **Site copy** (homepage/about) in VOICE.md — deferred.
- **Scheduling** (GitHub Actions cadence) — parked.
- **`--ids` pipeline bug** — background task spawned to fix.
- **Reddit API** — still pending.
- **Launch:** remove `noindex`; register `fullbleed.ai`.

## Git / deploy state

- `main` @ `128a1cd`, **pushed to origin, deployed** (Cloudflare Pages → fullbleed.pages.dev, noindexed). Working tree clean except whatever the current chat is doing.
- Recent commits: `128a1cd` (Product Hunt + 10 commercial entries) ← `18e8c24` (this session's revert + first commit of the catalog build) ← `0681082` (handoff package).
- `.env` is gitignored (holds ANTHROPIC_API_KEY + PRODUCTHUNT_KEY/SECRET — never committed).
- `scraper/data/*` is committed scratch (regenerable). `npm run build` from repo root → `site/dist`. CI pinned to Node 22.
