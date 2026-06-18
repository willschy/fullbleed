# Full Bleed — Handoff / Resume Here

*Updated June 18, 2026. This supersedes the June 17 version. Read these four files in order.*

1. **README.md** (this file) — orientation, how to resume, current status, the exact next step.
2. **PROJECT-STATE.md** — architecture, what is built and live, the pipeline, the file map, what is pending.
3. **DECISIONS-AND-LEARNINGS.md** — every decision and the taste calibration. The **"Session 4"** section at the bottom is the most recent run (the thermal imagery system, the dark/Discipline-Type IA, and the big curation recalibration to a visual/design-first taste). Read it.
4. **ACCOUNTS-AND-ACCESS.md** — accounts, keys, secrets, and Will's open homework.

Source-of-truth docs in the repo root:
- **CURATION.md** — what gets in and the bar. **Rewritten Session 4** to the **visual/design-first** taste (design/UI · 3D · typography · branding · illustration · image; out: audio/music, copywriting, most video, foundation models, infra papers). Read it. (Old brief backed up at `curation/CURATION-prev.md`.)
- **VOICE.md** — the locked house voice for entry writeups.
- **project-spec.md** — original spec (history; categories/voice/freshness/sources now superseded by CURATION.md).

The assistant's persistent memory also auto-loads in a new chat in this directory and holds the key facts (including the new ones from this session). `handoff/` is the fuller, version-controlled reference.

---

## How to resume in a new chat

Open a new chat in `/Users/wschlesinger/Documents/AI Catalog Scraper Tool` and paste:

> Read everything in `handoff/` then give me a 5-line status and the top 3 next moves. Don't build anything until I say go.

---

## What this is (one paragraph)

Full Bleed is a curated, always-fresh catalog of new AI work for **visual & design creatives**. It is a multi-source **compiler**: it catches candidates from public sources — **Product Hunt** (best source), **GitHub** (design/skills), **Hugging Face** (image/3D models), and a tight **arXiv** (creative papers) — filters them, runs each through a Claude Sonnet **taste gate** now **calibrated on Will's actual A/B votes** (visual/design-first; 91% agreement), then a **writeup** stage (VOICE.md) and a **cover** stage (thermal Unsplash treatment) publish them as entries on an Astro site. The repo is the database; **the curation IS the product**; the sources are pipes. Covers both open and commercial work — judged on the work, not the license.

---

## Status at a glance (June 18, 2026)

- **The site is LIVE.** `main` auto-deploys via Cloudflare Pages to https://fullbleed.pages.dev (still `noindex` — private preview). Latest commit `591033f`.
- **31 entries published — but built by the OLD judge.** The live catalog does **not** yet reflect the recalibrated taste (see Curation below). It contains off-taste entries the new judge cuts and is missing new design-first keepers.
- **Imagery is SOLVED and shipped** (was the #1 blocker, a long graveyard). Every entry has a **thermal cover**: a topic-relevant Unsplash photo run through a pure-code treatment (gradient-map → grain → motion-smear → haze), vibrant, **no pure black/white**, even hue split. Auto-pull + photographer attribution + responsive WebP (480/960/1333). Self-sustaining via `npm run cover` (`covers/cover_engine.py`). See DECISIONS Session 4.
- **Site IA reworked + shipped:** **dark-only** (light mode retired); left rail = **Discipline** (Design/Image/Video/3D/Audio) + **Type** (the 5 categories) facets — old **Tool** facet removed; **Saved** moved to the top-right nav; homepage headline removed (top slot reserved for future callout banners).
- **Curation RECALIBRATED — the big work this session.** The judge scored absolute 1–10 vs a brief (the noisiest method), so picks felt off. Built an **A/B taste labeler** (`curation/label.mjs`), collected ~75 of Will's votes (real pen + a synthetic spread), and pinned his real POV: **visual/design-first** (Design/UI · 3D · typography · branding · illustration · image), in any form. **Out:** audio/music, copywriting, most video, general foundation models, infra papers, dev plumbing, generic automations. Rewrote `CURATION.md` + recalibrated `judge.ts` (few-shot on Will's votes). **Judge↔Will agreement 62% → 91%.** Also rebalanced `sources.json` to the new taste (muted Hacker News + HF Papers — both 0% keep-rate; retargeted GitHub/Product Hunt/HF, added a tight creative-arXiv).

> **Important behavior note:** when Will says **"commit,"** he means commit **and push to main** (which deploys). Don't stop at a local commit.

---

## THE IMMEDIATE NEXT STEP

**Refresh the live catalog to the recalibrated (91%) taste.** The site still shows the old judge's picks. Two steps (nothing here is run yet):

1. **Validate the rebalanced sources:** `npm run listen` (new `sources.json`) → `npm run judge` — confirm per-source hit-rate jumps and a fresh on-taste pool appears. The judge is fast now (prompt caching, ~3 min for the whole pen; `--resume` fills any 429 gaps).
2. **Rebuild from the new keepers:** cut the off-taste live entries (the `.md` **and** their `-cover.webp` trio) — e.g. LTX-2, Lens, the papers — and run `npm run writeup` (VOICE.md) → `npm run disciplines` → `npm run cover` on the new design-first keepers (Stitch 2.0, Loki.Build, Photoshop-MCP, the design-skill collections, etc.), then commit/deploy. ⚠️ Pipeline gotchas: `writeup`/`judge` OVERWRITE their JSON; `--ids` targeting is broken — target at the data level.

One edge to decide first: the brief's marketing-ops cut is slightly too aggressive (judge wobbles on ad/skill items like `claude-ads`, which Will *kept*). Soften the rule if wanted.

---

## Top next moves (the broader roadmap)

1. **Catalog refresh** — the immediate step above: make the live catalog reflect the 91% judge.
2. **Grow toward 50–75** — the rebalanced sources + a scheduled catcher should grow it; re-run listen on a cadence.
3. **Newsletter** — the footer "Join" capture isn't wired; it's the return-loop / moat. Capture + a weekly "what's new" digest.
4. **Shareable covers (OG images)** — the thermal covers are a ready-made growth asset; make entries unfurl on social with their cover.
5. **Callout banners** — the homepage top slot (headline removed) wants a positioning line / featured pick for newcomers.
6. **Scheduling** — GitHub Actions to run listen→judge→writeup→disciplines→cover on a cadence (the "always fresh" moat). Parked.
7. **Launch prep** — remove `noindex` (Base.astro), register `fullbleed.ai`.

See PROJECT-STATE.md for the architecture/file map and pipeline, and DECISIONS-AND-LEARNINGS.md (Session 4) for why this session's calls were made.
