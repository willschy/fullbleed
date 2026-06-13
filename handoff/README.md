# Full Bleed — Handoff / Resume Here

This folder is a self-contained briefing so a **new chat** (or you) can pick up this
project exactly where it was left off. Read these four files in order:

1. **README.md** (this file) — orientation + how to resume + quick status
2. **PROJECT-STATE.md** — what exists, what's built, what's pending/blocked, file map
3. **DECISIONS-AND-LEARNINGS.md** — every decision + design-taste calibration + technical gotchas
4. **ACCOUNTS-AND-ACCESS.md** — accounts, URLs, IDs, secrets needed, your open homework

The original source-of-truth docs also live in the repo root:
- `project-spec.md` — the full product spec (running doc)
- `VOICE.md` — the house voice for AI-written summaries (draft, needs your redline)

---

## How to resume in a new chat

Open a new chat **in this project directory** (`/Users/wschlesinger/Documents/AI Catalog Scraper Tool`).
The assistant's persistent memory auto-loads, but to be safe, paste this as your first message:

> Read everything in `handoff/` then give me a 5-line status and the top 3 next moves.
> Don't build anything until I say go.

That's it. The new chat will be fully caught up.

---

## What this is (one paragraph)

**Full Bleed** is a curated, always-fresh catalog of groundbreaking real-world AI work,
for working creatives (designers, ADs, CDs, photographers). A scraper pipeline (Reddit
first) finds candidates → filters hard → Claude Sonnet scores them 1–10 against a taste
rubric (only 7+ publishes) and writes them up in a house voice → they appear on a
visual-first catalog site. Repo-as-database (entries are markdown files). Freshness/
superseded system is the moat. Semantic search is the planned killer feature.

---

## Status at a glance (as of June 13, 2026)

- **Site: LIVE (private preview)** → https://fullbleed.pages.dev
  (Cloudflare Pages, auto-deploys on every push to `main`. Noindexed until real launch.)
- **Design: essentially complete** — catalog grid, faceted rail, image-forward card hover,
  entry pages, dark mode, animated filtering, page transitions, bookmarks. Looks/feels strong
  on desktop and mobile.
- **Pipeline: code-complete, not yet running** — all stages written + offline-tested, but
  nothing schedules them yet, and it's blocked on Reddit API approval for real data.
- **This is a PREVIEW, not a launch.** Fixture/placeholder content, no real domain.

## The single most important gotcha for the next chat

**The Claude Preview tool runs its browser tab _backgrounded_, which freezes all CSS/JS
animation (view transitions, Web Animations API sit at currentTime 0). You CANNOT see or
screenshot motion in the preview.** Verify motion *logic* structurally (check classes/state),
then confirm the actual feel on the live deploy / a real device. Screenshots also occasionally
glitch to a 1px sliver or a stale frame — fix with `preview_resize` to a real size.

## Top 3 next moves (my recommendation)

1. **Shareable polish** (quick, the preview link is being shared): OG link-preview image,
   favicon, custom 404, Cloudflare Web Analytics.
2. **Pipeline scheduling**: GitHub Actions workflows that actually run the scraper on a
   cadence, so it's armed the moment Reddit approves.
3. **Semantic search v1**: replace the current fake text-filter with real embeddings-based
   search (the spec's headline feature).

See PROJECT-STATE.md for the full prioritized roadmap.
