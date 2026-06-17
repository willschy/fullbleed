# Full Bleed — Handoff / Resume Here

*Updated June 17, 2026. This supersedes the June 13/14 version. Read these four files in order.*

1. **README.md** (this file) — orientation, how to resume, current status, the exact next step.
2. **PROJECT-STATE.md** — architecture, what is built and live, the pipeline, the file map, what is pending.
3. **DECISIONS-AND-LEARNINGS.md** — every decision and the taste calibration. The "Session 3" section at the bottom is the most recent run of work (the imagery dead-ends and the commercial-intake pivot). Read it.
4. **ACCOUNTS-AND-ACCESS.md** — accounts, keys, secrets, and Will's open homework.

Source-of-truth docs in the repo root:
- **CURATION.md** — what gets in, the five categories, the bar. Updated this session with **"Open and closed — both first-class"** (judge the work, never the license). Read it.
- **VOICE.md** — the locked house voice for entry writeups.
- **project-spec.md** — original spec (history; categories/voice/freshness/sources now superseded by CURATION.md).

The assistant's persistent memory also auto-loads in a new chat in this directory and holds the key facts (including the new ones from this session). `handoff/` is the fuller, version-controlled reference.

---

## How to resume in a new chat

Open a new chat in `/Users/wschlesinger/Documents/AI Catalog Scraper Tool` and paste:

> Read everything in `handoff/` then give me a 5-line status and the top 3 next moves. Don't build anything until I say go.

---

## What this is (one paragraph)

Full Bleed is a curated, always-fresh catalog of new, genuinely useful AI work for working creatives. It is a multi-source **compiler**: it catches candidates from many public sources — Hacker News, GitHub, Hugging Face models, HF daily papers, and now **Product Hunt** (commercial launches; Reddit pending API approval) — filters them, runs each through a Claude Sonnet **taste gate** that scores 1–10 against CURATION.md (7+ keeps), then a **writeup** stage writes each in the house voice (VOICE.md), and they publish as entries on an Astro site. The repo is the database; the product is the curation; the sources are pipes. **As of this session it covers both open AND commercial/closed work** — the open-only bias is fixed.

---

## Status at a glance (June 17, 2026)

- **The site is LIVE and committed/pushed.** `main` is at commit `128a1cd`, pushed to GitHub, auto-deployed via Cloudflare Pages to https://fullbleed.pages.dev (still `noindex` — private preview, not a public launch).
- **31 entries published.** The ~20 from the multi-source compiler, plus **10 commercial entries** from Product Hunt (Google Stitch, Figma MCP, Claude in PowerPoint, Chronicle, Claude Design, Magic Patterns, Pitch Agent, Hera, Kodo, and the frontier model **Claude Opus 4.6**).
- **Product Hunt commercial intake is live and working** — the v2 GraphQL API path (vote-ranked, topic-filtered), using Will's `PRODUCTHUNT_KEY`/`PRODUCTHUNT_SECRET` (now in `.env`).
- **The pipeline runs end to end:** listen → judge → writeup → publish-entries → live site.
- **Imagery is UNSOLVED and is now the #1 open problem.** Entries use harvested thumbnails (the original ~21 use OG-card/sample grabs; the 10 Product Hunt entries use PH product screenshots), so the catalog looks **uneven**. Every cover-art direction tried so far has been rejected (see below + DECISIONS Session 3).

> **Important behavior note:** when Will says **"commit,"** he means commit **and push to main** (which deploys). Don't stop at a local commit.

---

## THE IMMEDIATE NEXT STEP

**Imagery / cover art.** It is the last unsolved piece and the thing now making the live catalog look uneven. It is a **graveyard** — do not casually re-propose a dead direction. Rejected so far:

1. **AI-generated risograph covers** (prior session) — "reads as slop."
2. **Filtered stock photography → blurred-halftone / solarized duotone treatment** (this session) — "ugly as hell, stock is out for good."
3. **Code-generated Y2K-digital SVG covers** (this session) — also rejected; the whole attempt was reverted.

Hard constraints for the next attempt (from Will, hard-won):
- **Not stock.** Stock is out for good.
- **Not AI-slop.** Must not read as generic AI output.
- **Not color-coded by category.** Tying cover color to category made the whole site two or three colors (the catalog skews); decouple color from category.
- **Must look high-quality blown up** on the entry hero (no low-res).
- **Topic-relevant** — the image should relate to what the entry is about.
- Will has **decision fatigue** on imagery. When you revisit: lead with a tight, near-final option (not a survey of choices), and **show real pixels** — he reacts to samples, not descriptions, and reverses freely.

---

## Top next moves (the broader roadmap)

1. **Imagery** — the active blocker above. Solve cover art within the constraints.
2. **Grow the catalog toward 50–75** — add more Product Hunt topics / lower the vote floor; re-run listen+judge for fresh candidates across all sources. We're at 31.
3. **Taxonomy decision (open)** — keep the five categories, or reorganize around **discipline** (image/video/design/photography), which Will floated as possibly a better spine for a visual audience. A "What you do" discipline facet was built this session and then reverted; the question is unresolved.
4. **Site copy** — homepage hero + about page in the locked VOICE.md voice. Still the leftover "corny" pre-pivot copy. Deferred.
5. **Scheduling** — GitHub Actions to run the catcher on a cadence. Still parked.
6. **Pipeline cleanup** — the `--ids` targeting flag silently fails through nested `npm run` hops (writeup/publish process ALL keepers, not the targeted subset). A background task was spawned to fix it; until then, target at the data level. See DECISIONS Session 3.
7. **Launch prep** — remove the `noindex` meta (Base.astro), register `fullbleed.ai`.

See PROJECT-STATE.md for the architecture and file map, and DECISIONS-AND-LEARNINGS.md (Session 3) for why everything is the way it is.
