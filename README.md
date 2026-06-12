# Full Bleed

A curated, always-fresh catalog of groundbreaking real-world AI work — for working creatives, by working creatives.

Spec: see `project-spec.md` (source of truth). House voice: `VOICE.md`.

## Layout

- `scraper/` — the pipeline: listen → dedup → holding pen → promote (velocity) → Sonnet score + writeup → review queue → publish
- `site/` — Astro site; the repo is the database (`site/src/content/entries/`)

## Pipeline commands

```sh
npm run listen     # poll sources, dumb-filter, fill the holding pen
npm run promote    # hourly: promote pen posts with traction to the scoring queue
npm run score      # Sonnet scores 1–10 + writes the entry; 7+ lands in the review queue
npm run review     # list / approve <id> / kill <id> — approval publishes the entry
npm run backfill   # one-time seed: top posts from the past 12 months (--dry to preview)
```

State lives in `scraper/data/` (committed — the repo is also the pipeline's memory).
