# Full Bleed — Handoff / Resume Here

*Updated June 13/14, 2026. This supersedes the original handoff. Read these four files in order.*

1. **README.md** (this file) — orientation, how to resume, status, and the exact next step.
2. **PROJECT-STATE.md** — architecture, what is built, the pipeline, the file map, what is pending.
3. **DECISIONS-AND-LEARNINGS.md** — every decision, the taste calibration, the gotchas. The "Session 2" section at the bottom is everything from the most recent run of work.
4. **ACCOUNTS-AND-ACCESS.md** — accounts, API keys, secrets, and Will's open homework.

Source-of-truth docs in the repo root:
- **CURATION.md** — what gets in, the five categories, the bar. This is THE curation brief and it was written this session. Read it.
- **VOICE.md** — the locked house voice for entry writeups. Rewritten this session.
- **project-spec.md** — the original product spec. Still useful for history, but partly superseded by CURATION.md (categories, voice, freshness rule all changed).

The assistant's persistent memory also auto-loads in a new chat in this directory and already holds the key facts. `handoff/` is the fuller version-controlled reference.

---

## How to resume in a new chat

Open a new chat in this project directory (`/Users/wschlesinger/Documents/AI Catalog Scraper Tool`) and paste:

> Read everything in `handoff/` then give me a 5-line status and the top 3 next moves. Don't build anything until I say go.

---

## What this is (one paragraph)

Full Bleed is a curated, always-fresh catalog of new, genuinely useful AI work for working creatives. It is now a multi-source **compiler**, not a Reddit scraper. It catches candidates from many no-approval public sources (Hacker News, GitHub, Hugging Face models, Hugging Face daily papers; Reddit is pending API approval), filters them hard, runs each through a Claude Sonnet **taste gate** that scores 1 to 10 against CURATION.md (7+ keeps), then a **writeup stage** writes each one in the house voice (VOICE.md), and they publish as entries on an Astro site. The repo is the database. The product is the curation, the sources are just pipes.

---

## Status at a glance (June 13/14, 2026)

- The **full pipeline runs end to end**: listen, judge, writeup, publish, live site.
- **20 real, voiced entries are published** on the local site. 4 of the 24 keepers failed their writeup on transient errors and need a quick re-run.
- The site is updated to the **five new categories**. It runs on the local preview. **Nothing is committed** (57 changed files in the working tree).
- The one thing in flight is the **thumbnail treatment**. Decision is locked: filtered stock photography run through a per-category **duotone**. The look is prototyped at `/lab` and it works. We are waiting on Will to lock the five-color palette.

---

## THE IMMEDIATE NEXT STEP (pick up exactly here)

We were dialing in the thumbnail look. The decision is made: **stock photos plus one house duotone treatment, each category a different but cohesive highlight color.** A working prototype lives at `site/src/pages/lab.astro` (run the dev server and open `/lab`). The starter palette:

| Category | Highlight |
|---|---|
| Tools | peach `#F4C7AE` |
| Automations | amber `#F1D8A6` |
| Models | teal `#BCDFDD` |
| Plugins & Skills | lilac `#D5C9EB` |
| Papers | sage `#CCDDBB` |

All five share a near-black ink shadow (`#131312`), which is what makes them read as one family.

**Next, in order:**
1. Will reacts to and locks the five-color palette (the only open question). Tuning notes: Tools and Automations are both warm and a bit close; highlights run hot on bright photos, so the highlight stop can come down a notch.
2. Wire the SVG duotone into `Card.astro` and the entry hero, keyed by category.
3. Get a free Unsplash API key (self-serve, instant), add a stock-pull step that searches an abstract or textural photo per entry, and tint it at render time.
4. Re-run the 4 missing writeups so the catalog is the full 24.

---

## Top next moves (the broader roadmap)

1. **Finish thumbnails** (palette lock, Card duotone, Unsplash pull). This is the active task.
2. **Backfill to full strength** — re-run the 4 failed writeups, and re-run listen/judge for fresh candidates. We are at 24 keepers and the launch goal is 50 to 75.
3. **Site copy** — homepage hero and about page in the new voice. The entry writeup voice is locked. The site chrome copy is the remaining corny stuff and was deliberately deferred.
4. **Scheduling** — GitHub Actions to run the catcher on a cadence. Parked on purpose until curation and imagery are locked, so we do not automate a half-finished pipeline.
5. **Commit** — 57 files are uncommitted. Decide what is real vs scratch (PROJECT-STATE lists the scratch) and commit the milestone.

See PROJECT-STATE.md for the full architecture and file map, and DECISIONS-AND-LEARNINGS.md for why everything is the way it is.
