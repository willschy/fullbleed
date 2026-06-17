# Cover generation

The thermal cover-art system for Full Bleed. Turns each entry into a vibrant,
grainy, hazy thermal photo cover — the look locked on 2026-06-17.

## Run

```
pip install -r covers/requirements.txt   # one time (numpy + Pillow)
npm run cover                            # == python3 covers/cover_engine.py
```

Needs `UNSPLASH_ACCESS_KEY` + `ANTHROPIC_API_KEY` in the repo-root `.env`.

## Where it fits

```
listen → judge → writeup → publish-entries → cover → build
```

`publish-entries` writes entries with `thumbnail: null`. `cover` then fills a cover
for every entry that doesn't have one yet:

1. **Sonnet art-direction** → an organic, on-theme Unsplash search concept per entry.
2. **Unsplash** → quality-gate + best-of-N pick (rejects too-dark / too-washed), with
   photographer credit.
3. **Thermal treatment** (`thermal_treat`, locked) → WebP at 480 / 960 / 1333 px.
4. Writes `thumbnail` + `credit` into the entry frontmatter.

**Idempotent** — entries that already have a `<slug>-cover.webp` are skipped, so re-running
only processes new entries. **Even hue split** — the dominant family cycles across the
5-family palette by sorted-entry index (decoupled from category).

## House rules (don't break)

- **No pure black, no pure white** — pixels hard-clamped to 28–220.
- **One dominant family per cover**, secondary = the cold/shadow hue.
- Real photo source (Unsplash), never AI-generated or screenshot imagery.

`samples/` is the original exploration lab; `covers/` is the production source of truth.
