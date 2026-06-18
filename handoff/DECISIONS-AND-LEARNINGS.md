# Decisions & Learnings — Full Bleed

The "why" behind the build, the design-taste calibration, and the technical gotchas.
Read this before changing anything — it'll save you from re-litigating settled calls
or re-hitting solved problems.

---

## How Will works (the most useful meta-context)

- **He's a designer/entrepreneur, not a web-infra person.** Explain technical things in
  plain language (what `localhost`/deploy/DNS actually mean), and recommend rather than
  dump options. He's sharp; just not steeped in web jargon.
- **He articulates design by feel, not vocabulary.** He'll say "this isn't it" or "feels
  amateurish" — your job is to *name* the underlying idea ("the name is the design brief —
  imagery should bleed to the edges"), then **show, don't ask**. Build the new version and
  let him react.
- **He reverses directions, and that's fine.** He moved from a floating dock → back to a
  side rail; from a morph transition → killed it. With everything tokenized and componentized,
  reversals are cheap. Don't over-engineer to avoid them; just build and iterate.
- **Non-negotiable: design quality.** The site itself is the credibility argument (it's for
  designers, by designers). Treat design as a primary deliverable. Ambition stated explicitly:
  Awwwards-featured level.
- **Rule from day one: do not build without his permission / green light.** He likes to align
  first, then say go.

## Design-taste calibration (hard-won — honor these)

- **Hates heavy font weights.** Rubik capped at ~600 (400 body / 500 titles / 600 display).
  Climate Crisis is the wordmark font ONLY (`--font-display`). IBM Plex Mono for metadata.
- **Hates blur that "pops in" late.** `backdrop-filter: blur()` repaints a frame after layout,
  so frosted elements visibly develop. **Do not use backdrop-filter on anything that animates
  in.** Use solid translucent fills (e.g. `rgba(10,10,9,0.5)`) that paint instantly.
- **Wants smooth reveals "from the bottom," not bouncy/rushed.** Use `grid-template-rows: 0fr→1fr`
  for clipped height reveals (NOT `max-height` — it's janky). Use calm easeOut
  `cubic-bezier(0.22, 1, 0.36, 1)` with NO spring overshoot for reveals. Fewer simultaneous moves.
- **Image-forward, always.** "Full Bleed" = imagery runs to the card edges; never bury the
  photo under an opaque panel. Card hover puts the digest text *on* the image over a gradient.
- **Wants static chrome.** Nav + footer are persistent (`transition:persist`); only the content
  transitions between pages. He noticed and disliked the nav re-fading on every navigation.
- **Footer: slim and minimal.** One thin bar — brand left, email center, links right. He cut
  the headline/kicker/colophon. Left/right aligned, not centered (centered fought the rail).
- **Placeholder photography is NOT a valid excuse for design feedback.** Early on it was; he
  explicitly retired it. Don't blame fixtures for how something looks — fix the site.

## Visual identity (decided)

- **Name: Full Bleed.** Print/prepress jargon — signals "by designers, for designers."
- **Wordmark font: Climate Crisis** (Google Fonts). Body: Rubik. Metadata: IBM Plex Mono.
- **Accent: registration vermillion** — `#e8490f` (light), `#ff5b27` (dark, runs hotter).
- **Palette: warm gallery neutrals** — paper `#fafaf7` / ink `#131312` (light);
  near-black `#111110` / `#1c1c1a` surfaces (dark). The `⌖` registration mark is the one ornament.
- **Conceit:** the site borrows prepress vocabulary; the work is the hero, chrome is quiet.

## Product decisions (from the spec's decision log — the important ones)

- Publication leads, self-pruning archive backs it. Freshness is the soul/moat.
- 4-category taxonomy doubles as the filter rubric — structure does the curating.
- **No "AI replaces X" framing, ever.** Editorial reframe rule baked into the writeup pass;
  posts that can't be honestly reframed get killed.
- **Sonnet over Haiku** for the taste gate — the judgment IS the product (dimes/day at this volume).
- 15-min polling baseline (5-min reserved for surge); velocity-based promotion; per-sub thresholds.
- Backfill is the FIRST real build step + the taste-gate calibration set; launch at 50–75 entries.
- Sources V1: Reddit only. Added r/StableDiffusion + r/comfyui for production-creative work.
  Known category skew accepted (Reddit over-serves "Tools You Can Steal" + "New Possible").
- Rehost thumbnails only (Pinterest model) + credit + linkback + a takedown page.
- Stack: TS monorepo, Astro, repo-as-database, Cloudflare Pages + Workers AI embeddings. Supabase
  deferred until a feature (search v2 / accounts) needs a backend.
- Bookmarks before accounts; bookmarks ARE the email-capture strategy (V2 magic-link sync).

## Technical gotchas (will bite you if you forget)

- **Preview tab is backgrounded → animations frozen.** (Repeating from README because it's the
  #1 trap.) View transitions and WAAPI sit at currentTime 0 in the Claude Preview; you cannot see
  or screenshot motion. Verify motion logic structurally + on the real deploy. Timers (setTimeout)
  DO still run in the background tab.
- **Preview screenshots glitch** to a 1px-wide sliver or stale frames intermittently. Fix:
  `preview_resize` to a real size (e.g. 1280×860), or restart the preview server.
- **Reddit API now requires pre-approval** (since late 2025) even for personal script apps —
  application via support.reddithelp.com, ~2–4 wk. Unauthenticated JSON 403s. App creation at
  prefs/apps is gated behind approval. RSS feeds (`/r/<sub>/new/.rss`) still work unauthenticated
  but lack votes/flair — dev fallback only, not production.
- **View-transition morph was removed for a reason.** The original card→hero morph shared
  `transition:name=hero-{id}` across every card+hero, so the old hero "zipped" into the matching
  card in the next page's related rail. If you reintroduce a morph, use a SINGLE dynamic transition
  name (only the clicked card + destination hero), and verify on a real device.
- **Entrance animations are gated behind `html.vt-nav`** (added on `astro:after-swap`) so they only
  run on first load, not every navigation. Don't remove this or nav will feel like a "re-fade."
- **Bookmark buttons sit OUTSIDE the card's `<a>`** (as a sibling) so clicking them never triggers
  navigation. The global handler in Base.astro `preventDefault`s + `stopPropagation`s anyway.
- **Build is from repo root**: `npm run build` (delegates to `npm run -w site build`), output
  `site/dist`. Local Node is 26; CI pinned to 22 via `.nvmrc` + `NODE_VERSION` env.
- **`noindex` meta is intentional** (Base.astro) to keep fixture content out of search. REMOVE at
  real launch.

---

# SESSION 2 (June 13/14, 2026) — the compiler, the curation, the voice, the imagery

Everything above is still valid. This section captures the most recent run of work, where the project
went from a Reddit-only scraper to a working multi-source compiler with real, voiced entries on the site.

## The big pivot: a compiler, not a Reddit scraper

- Will wanted to stop waiting on Reddit (1 to 2 week API approval) and pull from many publicly available,
  no-approval sources. The whole pipeline was refactored around a source-agnostic `Candidate` type and a
  tiny `Source` adapter interface. Adding a source is now one adapter file plus one line in `sources/index.ts`.
- The insight that makes it work: the **taste gate is the equalizer**. Sources have different signals
  (HN points, GitHub stars, HF likes, paper upvotes), but the Sonnet judge scores the work itself, so a
  many-source compiler with one judge actually strengthens the bar.
- Sources he chose to start (all no-approval): Hacker News, GitHub, Are.na. Then we added Hugging Face
  models and HF daily papers for the Models and Papers lanes. Are.na and raw arXiv ended up disabled
  (Are.na's public AI channels were noisy; arXiv was an incremental-paper firehose).

## Curation is the product (CURATION.md is the source of truth)

This was the heart of the session. Will was clear: **curation is the whole thing, the sources are pipes.**
Key decisions, all captured in `CURATION.md`:

- **Mission, corrected mid-conversation.** It is NOT a conversion engine for AI haters and NOT preaching.
  It serves the **AI-curious and AI-enthusiasts**, people already a little in. The stance is pragmatic:
  "this exists and is not going away, learn it to leverage it." Use the words **education** and **curation**,
  by creators for creators. He explicitly rejected "empowerment" as corny. Do NOT write the
  "AI isn't going away" thesis literally in copy; it is the spirit, not a line.
- **The category journey (he reverses cheaply, this is normal).** Started at 4 spec categories he hated →
  considered 2 lanes (tools / new drops) → considered a "usability to wow" spectrum (he hated the slider,
  "what the fuck does that mean") → landed on **discrete categories**. Final five: **Tools, Automations,
  Models, Plugins & Skills, Papers** (Papers last). Cut "Demos" (redundant, builds ship with demos) and
  "Techniques" (too vague). 
- **Per-category specifics.** Models entries always cover what it is / why it matters / what it improved on /
  strengths / weaknesses, and **notable big models ALWAYS qualify** (do not slop-filter a major release as
  "generic" — that was a calibration miss we fixed). Tools/Automations get a real how-to-use walkthrough.
  Plugins & Skills is the techie lane (plugins, AI skills, MCP servers, API drops). Papers are judged on
  "notable and worth knowing" not "usable tomorrow" (Will loves bleeding-edge arXiv, e.g. SAM-class releases),
  while genuinely off-domain work (surveillance, pure ML infra) still dies.
- **Money is out.** No monetization framing as a category or angle; it is a byproduct of good curation.
- **Tools vs Automations tiebreaker:** Tool = use it as-is (a finished product); Automation = you assemble
  it into your workflow (a recipe, ships with a setup walkthrough).
- **Discipline is a tag, not a category.** Surfaced on the site as "what you do," never labeled "discipline."

## Freshness rule (and a real bug we fixed)

- Will: **nothing older than ~6 months ever surfaces, ideal ~2 months.** He reacted hard ("this is trash")
  when stale entries showed up.
- The bug: recency was judging GitHub repos by **last commit**, so a repo created 8 months ago with a recent
  push slipped through. Fixed `candidateDate()` to always use **creation/publish/post date** for every source.
  "New" means newly created, not recently touched. After the fix, the 35 keepers became **24 within 180 days**.
- Distribution reality: at ≤180d there were 24, at ≤90d only 11, at ≤60d only 6. The 6-month line is the
  workable pool right now.

## Source findings (from a full-pen judge run)

- **GitHub is the strongest source.** Real shipped tools with demos.
- **Hacker News is low-yield** for this audience (0 of 18 kept). Candidate to mute.
- **The catalog skews hard to the ComfyUI / Stable-Diffusion / open-model world**, because GitHub + HF are
  the sources. Great for "what's newly possible," thin on the everyday 9-to-5 creative tool lane. Open
  question for Will: lean into the generative skew, or broaden sources (Product Hunt, X, Behance) for the
  everyday-creative lane. Not yet resolved.

## The voice (VOICE.md is locked)

- The old VOICE.md and site copy were the corny pre-pivot framing ("groundbreaking real-world AI work",
  campaigns/business plays). Replaced wholesale.
- **Hard style rules from Will: NO em dashes, NO semicolons, NO exclamation points.** Run copy through the
  humanizer skill. No hype words, no AI tells.
- **The key lesson:** the first rewrite over-corrected into cold, clipped, condescending copy ("sounds like a
  fucking asshole"). Warmth is a **rhythm** problem — vary sentence length, let some sentences breathe, and
  never explain the obvious. Warm but not best-friend-warm. The **LTX-2 entry is the approved calibration
  target** (it is in VOICE.md).
- Split insight: judging and writing are separate jobs. The judge only needs CURATION.md (no voice). Only the
  writeup needs VOICE.md. That is why we could run the taste gate before the voice was finished.
- The **entry voice is locked. Site chrome copy (homepage, about) is deliberately deferred.**

## The thumbnail saga (this is where we left off)

A long exploration, because the content (models, code, papers) has no good hero imagery and the site is
image-forward. The path, and why each was rejected:

1. **Scraped thumbnails** (GitHub OG cards, arXiv PDF pages, HF none) — text-heavy and weak. No.
2. **Typographic / diagram cards** — mocked with the visualize tool. Will passed (still a fine fallback).
3. **AI-generated house-style covers** — risograph look via the Higgsfield `generate_image` MCP. Will liked
   the style, then rejected it: for an anti-slop site, generated covers still read as slop. (Tech note: the
   model alias is `nano_banana_pro` → real id `nano_banana_2`; the bare id `nano_banana_2` coerces to
   `nano_banana_flash`. 2k works.)
4. **Real artifact harvest** (model sample images, GitHub README hero, paper figures) — built into
   publish-entries.ts and it half-worked. Microsoft Lens and ERNIE-Image pulled great real images, but many
   repos fell back to text OG cards and papers stayed as PDF pages. Will then changed direction.
5. **FINAL: filtered stock.** Stock photos (Unsplash) run through ONE house **duotone** treatment, each
   category a different cohesive highlight color. Real photos kill the slop problem, the duotone gives
   cohesion and a design-first signature, and an aggressive-but-tasteful treatment hides stock cliché.
   Prototyped and working at `site/src/pages/lab.astro`. Starter palette and next steps are in README.md.

## How Will works (reinforced this session)

- He articulates by feel and **reverses directions freely** (4 categories → spectrum → 5 categories; AI
  covers → stock; etc.). With everything tokenized this is cheap. Build and let him react. Do not over-plan.
- **Show, don't ask.** Concrete samples and screenshots move him; abstract descriptions do not.
- He has a sharp anti-slop, anti-corny radar. He will call cold or fake copy immediately. Take the design and
  copy bar as primary, not as a wrapper.
- He is cost-aware (asked about per-image and per-judge cost). Real numbers, not hand-waving.

## Technical gotchas (new this session)

- **The Claude Preview screenshots glitch to a 1px sliver** intermittently (a known trap, also in the
  original gotchas). Fix by `preview_resize` to a real size, and make demo pages fit one viewport so you do
  not have to scroll (scroll + screenshot was unreliable).
- The Sonnet writeup occasionally slipped a negative-parallelism AI tell ("not just X, it is Y"); the writeup
  prompt now bans it explicitly.
- Papers carry the highest hallucination risk (the model elaborates a mechanism it cannot fully see), so
  fact-check papers against the source before publishing.
- The image-gen and Unsplash work needs no Reddit/scraper credentials. Anthropic key is in .env. GitHub
  token is optional (raises rate limits). Unsplash key is the next one needed.

---

# SESSION 3 (June 17, 2026) — the imagery graveyard, the commercial-intake pivot, going live

Everything above is still valid as history. NOTE: Session 2's "thumbnail saga" (the stock + duotone direction) is now **superseded** — that whole direction was built out further this session and then rejected and reverted. See below.

## Imagery is a GRAVEYARD — read before touching covers

- Every cover-art direction has been tried and rejected. **This session:** (a) a vibrant per-category palette + a blurred-halftone / solarized **stock** duotone treatment baked at publish time — Will: *"ugly as hell, stock is out for good"*; (b) **Y2K-digital code-generated SVG covers** (topic-driven motifs, seeded per-entry palettes, vector so crisp at any size) — also rejected. **Prior session:** AI-generated risograph covers — "slop."
- Will asked to **undo the entire chat's imagery + disciplines work.** We reverted it surgically (kept all prior catalog / pipeline / voice work) — it is gone from the codebase. That revert is commit `18e8c24`.
- **Hard constraints for any future attempt:** NOT stock; NOT AI-slop; NOT color-coded by category (tying cover color to category made the whole site 2–3 colors because the catalog skews); must look **high-quality blown up** on the entry hero; **topic-relevant**. Will has **decision fatigue** on imagery — lead with one near-final option, show real pixels, don't present a survey of choices.
- **Reusable learning from the (reverted) palette work — design-export hex labels lie.** They're CMYK→RGB conversions, and Mac screenshots are wide-gamut (Display P3), so the swatch you *see* is more saturated than its sRGB hex claims. To get true color: eyedrop the actual pixels (Python + Pillow) and convert via the embedded ICC profile to sRGB. For maximum on-screen punch, use Display-P3 CSS / P3-tagged images.

## The open-source-only bias was a real flaw — now fixed

- All original sources (GitHub, HF models, HF papers) are **open-artifact feeds**, so the catalog only ever saw open/buildable work. But working creatives mostly use **commercial** tools (Midjourney, Runway, Adobe, Figma, ChatGPT, Claude). Closed / frontier work (e.g. Fable 5, Claude Opus 4.6) only surfaces via **launch/announcement** sources — never via a repo or model card.
- **Fix:** added **Product Hunt** as a commercial source, and made CURATION.md explicit — *"Open and closed — both first-class; judge the work, never the license."* Confirmed there was **no** open-source bias in the judge or the filters; the bias was purely the source list.
- **The taste gate is the equalizer (reconfirmed).** Product Hunt's raw feed is noisy (CRMs, SEO bots, AI therapy). Of 57 PH launches judged, only **13 kept** — it killed the off-domain business SaaS on-brief and kept the creative-relevant commercial tools (Google Stitch, Figma MCP, Claude in PowerPoint, Chronicle, Magic Patterns…) plus the frontier model **Claude Opus 4.6**. **Popular ≠ kept.** We published 10 (deduped the three Google Stitch versions to the latest).

## Product Hunt source — how it works (so you can tune it)

- `scraper/src/sources/producthunt.ts`. Two paths, auto-selected: **API (preferred)** when `PRODUCTHUNT_KEY`+`PRODUCTHUNT_SECRET` (or a `PRODUCTHUNT_TOKEN`) are set — v2 GraphQL `posts(topic, order: VOTES, postedAfter)`, exchanging key+secret for a client-credentials bearer token; otherwise the **keyless Atom feed** (newest only, no votes, keyword-gated).
- Config in `sources.json`: `topics` (slugs), `minVotes` (popularity floor = 50), `perTopic`, `postedWithinDays`, plus `mustMatch`/`limit` for the fallback. Tune `topics` + `minVotes` to widen/narrow.
- **Will's PH API Key + Secret are in `.env`**, so the API path is live.

## "Commit" means deploy

- When Will says **"commit,"** he means commit **and push to main** (which auto-deploys via Cloudflare). Do not stop at a local commit. (Also in persistent memory.)

## Pipeline gotchas (new — will bite you)

- **`--ids` targeting is broken.** `npm run writeup -- --ids=a,b` (and publish-entries) never receive the flag — it dies in the nested `npm run -w scraper <script>` hops, so they process ALL keepers/writeups, not a targeted subset. Work around by filtering at the **data level** (edit `writeups.json` before `publish-entries`). A background task was spawned to fix arg forwarding + add `--ids` to publish-entries.
- **judge.ts and writeup.ts OVERWRITE their output JSON** (`verdicts.json` / `writeups.json`) with only the current run's output. For a targeted run, back up + merge or you wipe the rest. **publish-entries publishes EVERY writeup in `writeups.json`** and re-harvests each thumbnail — so to add new entries without churning the live ones, set `writeups.json` to only the new entries at publish time, then restore the full set.
- Freshness self-prunes: items drift past the ~180-day ceiling between runs, so keeper counts shrink over time. Expected, not a bug.

## How Will works (reinforced)

- He **reverses freely** — a whole chat's imagery work got thrown out and rebuilt-around without drama. Build, show, let him react; don't over-plan or get attached.
- **Show real pixels / concrete output** — he reacts to those, not abstract descriptions.
- Sharp anti-slop, anti-corny radar; cost-aware. He wants the catalog to reflect the **real, commercial-heavy creative-tool landscape**, not an open-source ML subculture.

---

# SESSION 4 (June 17–18, 2026) — thermal imagery, the dark/Discipline IA, and the big curation recalibration

Everything above is still valid as history. This session shipped the imagery system, reworked the site IA,
and — most importantly — **recalibrated the taste gate from Will's actual votes**, which sharpened and
partly corrected the Session-3 read of his taste.

## Imagery — SOLVED (the graveyard ended)

Winning direction: a **thermal / infrared gradient-map on a REAL photo**, plus heavy film grain,
motion-smear, and haze. Smooth and grainy, NOT pixelated. How we got there:
- Will gave a 5-family × 3-value palette (sampled TRUE via eyedrop, not the dull CMYK→RGB export hexes).
- The voxel/pixel-reconstruction direction (code-generated *subjects*) was tried and abandoned —
  procedural subjects became blobs. The reference Will kept pointing at was the smooth thermal one.
- Breakthrough: **the look needs a real lit subject** (a face/hand/form), so we **reopened real-image
  sourcing** (Will's call — the heavy transform makes "stock" unrecognizable as stock). Sourcing =
  **per-entry Unsplash auto-pull** (Will picked it; Openverse's free corpus was too noisy/irrelevant).
- Hard rules (Will): **no pure black, no pure white** (pixels clamped ~28–220), **even hue split** across
  the grid (dominant family cycled per-entry, decoupled from category), topic-relevant subject.
- Optimized to responsive WebP; wired into the pipeline (`covers/cover_engine.py`), idempotent.
- Reusable lesson: design-export hex labels read DULLER than the wide-gamut swatch — eyedrop real pixels.

## Site IA — dark-only, Discipline/Type, Saved top-right

- **Dark is the brand** (covers were tuned on dark) — light mode retired.
- The **taxonomy question is resolved:** rail = **Discipline** (what it's for) + **Type** (what it is).
  The long **Tool** facet caused a messy scroll and was removed (tools still tag cards). Label choice was
  grounded in UX research (NN/g: two filter groups need distinct, non-synonymous names → "Discipline +
  Type", not "Category + Type").
- **Saved** moved to the top-right utility nav (NN/g + Baymard: that's where people look for a saved view).
- Will reads alignment off real pixels and measures things ("the gray box should top-align with the
  thumbnail") — honor pixel-exact UI rules.

## Curation — recalibrated to Will's votes (THE core work)

The heart of the session. **Curation IS the product**, and the picker wasn't matching Will's taste.

- **Diagnosis:** the judge scored absolute 1–10 against a written brief — the *noisiest, least reliable*
  preference method (research: pairwise > rating scales). That's why picks felt off.
- **Method (research-backed, small-data):** NOT a trained Bradley-Terry/RLHF reward model (needs
  thousands–100k+ comparisons; impossible from one curator). Instead **pairwise A/B elicitation +
  LLM-judge few-shot calibration**. Built `curation/label.mjs` (pick the more worthwhile of two, plus
  "Both belong" / "Neither" for absolute keeps/kills, active-sampled on close calls). Will did ~50
  real-pen votes + ~25 on a synthetic spread (`curation/gen_synthetic.py`).
- **The taste it revealed (sharper than Session 3's "commercial tools" read):** Full Bleed is
  **visual/design-first** — Design/UI · 3D · typography · branding · illustration · image — in ANY form
  (tool, agent skill/MCP, a *specific* model, or a *creative-relevant* paper). The dominant axis is
  **discipline, not format. OUT:** audio/music (hard no), copywriting, most video, **general foundation
  models**, **ML-infra papers** (noise schedulers, efficiency, surveys), low-level ComfyUI nodes / dev
  plumbing, generic workflow automations.
- **Key correction:** "models/papers are out" (an early read) was a confound — it's *infrastructure vs
  creative-relevant*. A texture/relighting/mesh model or a typography/aesthetics paper KEEPS; LTX-2
  (video), Qwen-Omni (audio), FLUX/Lens (general) and noise-scheduling papers KILL.
- **Result:** rewrote `CURATION.md`, recalibrated `judge.ts` to few-shot on `curation/labels.json`.
  **Agreement 62% → 91%** on Will's labeled items; re-judging yields a clean **31-keeper set** (all
  visual disciplines, zero audio/video/papers).
- **Sources rebalanced by measured hit-rate** (`sources.json`): Product Hunt 18% (best), GitHub 12%, HF
  12%, **Hacker News 0%, HF Papers 0%**. Muted HN + HF Papers; retargeted GitHub to design/skills;
  focused Product Hunt on AI + design-tools (stripped audio/music/voice); narrowed HF to image/3D;
  replaced dead HF Papers with a **tight creative-arXiv** (cs.GR/cs.HC) for the papers Will keeps.

## Technical gotchas (new this session)

- **Anthropic rate limits bite at this account's tier (~TPM-bound).** Re-judging 307 candidates 8-wide
  blew past it → ~half failed with 429s. Fixes baked into `judge.ts`: **system-prompt caching** (the
  brief + few-shot are identical every call → ~10× speedup), a **concurrency pool capped at 4**,
  `new Anthropic({ maxRetries: 8 })`, and a **`--resume` flag** (keep existing verdicts, judge only gaps,
  merge — don't overwrite). The judge still OVERWRITES `verdicts.json` unless `--resume`.
- Taste tooling lives in `curation/`: `label.mjs` (A/B server, `node curation/label.mjs [synth]`),
  `gen_synthetic.py`, `build_labels.py`, `draft_brief.py`, and the vote/label JSON.

## The open thread (where to resume)

The judge is recalibrated and committed, but **the live catalog still reflects the OLD judge**. Next:
validate the rebalanced sources (`npm run listen` → `npm run judge`, watch the hit-rate), then **refresh
the catalog** — cut the off-taste entries, run writeup → disciplines → cover on the new keepers. One edge
to decide: the brief's marketing-ops cut is slightly too aggressive (judge wobbles on `claude-ads`, which
Will kept).
