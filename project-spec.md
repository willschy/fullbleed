# PROJECT SPEC — FULL BLEED
*Running document. Last updated: June 12, 2026. This is the single source of truth — update as decisions evolve.*

---

## 1. What This Is

A curated, always-fresh feed of groundbreaking real-world AI work — scraped from across the web, filtered hard, and explained so working creatives can run it back themselves.

**Publication-led, archive-backed.** The daily pulse of new finds is the main event (freshness is the whole point — AI workflows go stale fast). The searchable archive is the long-term asset, and it self-prunes so it never rots.

**Not** another AI newsletter. Not news links. Not beginner content. Not art dumps.

---

## 2. Who It's For

Working creatives and design entrepreneurs — designers, art directors, creative directors, motion designers, photographers — who already use AI and want to see what the best people are actually shipping.

- Not for beginners. No prompts-101, no "what is ChatGPT."
- Bleeding-edge case studies at the level of: AI virtual try-ons that actually hold garment detail, a web app with your deck templates in the backend that generates client-ready decks from a brief.
- Two value props: (1) make our 9–5 lives easier and better, (2) show what's newly possible.

---

## 3. Voice & Worldview

**Core stance: for creatives, by creatives. Creatives are the operators. AI is leverage.**

- Every story is about a person with taste getting more reach, speed, or margin.
- **Banned framings:** "AI replaces ___," "no designer needed," "the end of ___," doomer takes, hype-bro takes, "you're falling behind" fear bait.
- Reframe rule: "studio replaces photoshoot with AI" becomes "photographer 10x's their output and pockets the margin." Same story, opposite worldview. Posts that can't be honestly reframed get killed.
- This voice doc becomes the system prompt for every AI-written summary in the pipeline.

**Status: full draft exists at `VOICE.md` in the project folder — needs Will's redline before the pipeline writes anything.**

---

## 4. Content Taxonomy (= the filter rubric)

Four categories. Anything that doesn't fit cleanly gets killed — the structure does the curating.

1. **Client work / Production** — AI in real campaigns, virtual try-ons, production pipelines, real client outcomes
2. **Tools You Can Steal** — internal workflows: deck generators, Figma-to-spec tools, brand-guideline checker bots, auto-resizers that turn one hero asset into 30 ad sizes
3. **New Possible** — capability jumps; stuff that didn't exist last month; first convincing consistent-character campaigns; napkin-sketch-to-working-prototype
4. **Business Plays** — designers productizing skills (e.g., $2K fixed-price brand packages on an AI pipeline, with real revenue shared), AI-powered studio models, niche licensed libraries

### The bar (what qualifies)
**Real work, shown, with the how.** If there's no workflow, numbers, or artifact you could learn from, it doesn't run.

### Auto-kill pile
- Generic wrappers ("I made a logo generator") with no craft
- Pretty image dumps with no application
- "10 prompts every designer needs" listicles
- Posts where the post IS the marketing and no actual work is shown
- AI-girlfriend apps, courses, waitlists, "roast my X"

### Tagging
Tool and discipline tags come from a **controlled vocabulary** in config (canonical names: "ComfyUI" not "Comfy UI"). The model picks from the list or proposes an addition that Will approves. Tag sprawl kills filters by entry 400.

---

## 5. The Pipeline (always-on listener)

**Flow: listen every 15 min → dedup check → holding pen → hourly proof check → AI scores + writes up → review queue → goes live → creator notified.**

### Stage 1 — Catch
- Poll sources every **15 minutes** (GitHub Actions cron jitter makes 5-min polling a fiction, and the hourly promotion gate means nothing is lost; 5-min ambition is reserved for surge mode)
- **Dedup check before the pen:** same outbound URL or near-identical title/embedding = already seen (cross-posts, resurfaced projects). Cheap to build, painful to retrofit.
- New posts matching targets go into the **holding pen** (a post at minute zero has no signal)

### Stage 2 — Dumb filters (free, kills ~80% of trash)
- Showcase / "I built" flairs only, where they exist
- Minimum upvote threshold — **per-subreddit, in config** (~20 for r/SideProject, ~10 for showcase flairs in r/ClaudeAI; tune the rest during backfill)
- Must contain a link, image, or video — no demo, no entry
- Keyword blocklist: "AI girlfriend," "course," "waitlist," "roast my," etc.

### Stage 3 — Hourly proof check
- Re-check the pen every hour; promote on **velocity (upvotes/hour since posting)**, not raw count — a fast riser in a small sub shouldn't wait behind a slow burner in a big one
- Beats every newsletter by hours/days without letting trash through just because it's new

### Stage 4 — AI filter + writeup (Claude Sonnet, single pass)
- **Sonnet, not Haiku** — the taste judgment IS the product; still dimes/day at this volume. Haiku reserved for cheap utility classification if needed. Downgrade later only with bake-off evidence.
- Scores each surviving post 1–10 against the taste rubric: real shipped thing? Visually/conceptually interesting to a designer/CD? "Would Will screenshot this?"
- **Only 7+ goes live**
- Same pass writes the summary in the house voice (`VOICE.md` is the system prompt; reframe or kill replacement-framing posts) and assigns category + tags from the controlled vocab
- **Calibration:** during backfill, Will hand-judges ~50 borderline posts (screenshot: yes/no); rubric prompt is tuned until model agreement hits ~90%
- If a niche has nothing good, publish nothing. Empty-but-honest beats filler.

### Stage 5 — Review queue (V1 training wheels)
- Everything Sonnet passes lands in a dead-simple approve/kill queue for Will — one tap each
- For the first month, Will IS the calibration data, and "Will actually looked at everything" is part of the brand promise
- Removed once the agreement rate earns full autopilot

### Stage 6 — Creator notification (the growth flywheel)
- On publish, the original creator gets a short genuine note ("you got featured") via Reddit DM/comment — fits naturally since we credit them anyway
- Featured creators share their features; every entry is a person with an audience and an incentive to link us
- Template + manual send in V1; nearly free

### Surge mode *(post-V1)*
- When a major model drops, listener kicks to high frequency for ~72 hours and the traction threshold loosens — that's when the wildest experiments flood social, and it's the biggest traffic window ("what can [new model] actually do").

---

## 6. Sources

### V1 — Reddit
- r/ClaudeAI + r/ClaudeCode (showcase flairs)
- r/SideProject, r/InternetIsBeautiful
- r/ChatGPTCoding, r/cursor, r/LocalLLaMA
- **r/StableDiffusion, r/comfyui** — where real production-creative work lives on Reddit (virtual try-on pipelines, consistent characters, product-shot systems); feeds the weakest categories
- **Skip:** r/SomebodyMakeThis (trash), r/ArtificialIntelligence (news/doom), r/graphic_design + r/Design (portfolio-critique noise, wrong bar)

**Known skew, accepted:** V1 sources over-serve "Tools You Can Steal" + "New Possible" and under-serve "Client Work / Production" until X sources land. Launch framing leans on the strong categories — don't fake a balanced catalog.

### Backfill (= first build step)
- Pull each source subreddit's top posts from the past **12 months** through the **identical** pipeline (filters → scoring → writeup)
- **Don't launch until ~50–75 entries clear the 7+ bar** — a grid with 8 entries looks like a dead product
- Doubles as the pipeline shakedown cruise and the taste-gate calibration set
- Old finds honestly stamped as aging — which demonstrates the freshness system on day one

### Later
- X/Twitter threads (where the best virtual try-on / campaign case studies actually live)
- Tool community showcases (Higgsfield, Runway, etc.)
- Source list also grows automatically via search-driven standing orders (Section 9)

### Infra note
- GitHub Actions IPs get blocked by Reddit's public pages → use the free official Reddit API (script app, takes 2 min to set up)
- Start on free GitHub Actions (public repo); pay for the ~$5/mo server only if cron jitter proves painful in practice — two weeks of data will say
- **Reddit API terms, eyes open:** free tier is fine at this volume, but Reddit's data terms restrict commercial reuse. Own-words summaries + thumbnail + heavy credit + link back is the defensible end of the spectrum. Revisit before any paid tier.

---

## 7. Freshness System (the moat)

- Every entry stamped with **date + model/tool versions used**
- When something better lands in the same lane, the old entry gets a **"superseded — see this instead"** forward link
- **Mechanics:** `superseded_by: <slug>` in entry frontmatter. V1: Will notices and sets it manually. Later: embeddings flag "new entry suspiciously similar to old one" as candidates for review. **Automate the noticing, never the judgment.**
- Archive self-prunes instead of rotting; a 6-month-old workflow guide is often worse than nothing
- Freshness is visible in the UI (Section 8) and filterable via a **"current" toggle** that hides superseded workflows — the filter nobody else can offer

---

## 8. The Site

### Homepage — catalog grid
References: Unsplash Collections (imagery-first browsing) × Craftwork catalog (metadata-rich cards, consistent framing).

**Card anatomy:**
- The image/video IS the card
- A few words of title
- Category tag bottom-left · tool tag bottom-right
- Small date stamp doubling as the freshness signal: recent = bold/alive, aging = grayed, superseded = "newer version exists" mark

**Consistent card framing** so a janky-but-brilliant workflow screen-recording can sit next to a gorgeous campaign render without the grid looking broken.

**Filters:** category · tool · discipline · date · "current" toggle

### Media policy (rights + reliability)
- **Rehost thumbnails only:** resized ~800px preview captured at ingest (Reddit API provides preview URLs; `i.redd.it` hotlinking is unreliable long-term)
- `v.redd.it` videos: capture poster frame as the card image; playback links to the source post
- Never rehost full-res or full video — that's both a rights line and a storage line
- Pinterest/Are.na model: small derivative + prominent credit + link to original + **a credit/takedown page** (how curation works, how we credit, how to get something removed/corrected)

### Hover-expand (desktop)
- ~300–400ms hover delay (1s feels laggy; shorter avoids accidental popups while mousing across the grid)
- Expanded card **floats over** the grid (Netflix-style) — never pushes other cards around
- Hover layer contains: two-sentence "what this is," the why-it-matters line, tool stack. That's it — it's the trailer, the page is the movie.
- **Three info tiers:** glance (card) → hover (digest) → click (full page)

### Mobile (decided)
- **Tap-once-to-expand, tap-again-to-enter** — same three-tier model, no hover required. Half of traffic will be mobile.

### Entry page (each find gets its own page)
1. Hero visual up top
2. What it is + why it matters (the 20-second scan layer)
3. **The how** — tools with versions, workflow in steps (the section nobody else does)
4. **"Run it back"** — how to recreate it yourself
5. Source credit linking the original creator
6. Freshness stamp (+ superseded forward-link if applicable)

Entry pages are naturally SEO-shaped ("how X built a virtual try-on pipeline with ComfyUI" is exactly what people search) — they're the organic-traffic engine.

### Design principles
- Visual-first; we're serving designers
- Scannable in 20 seconds, deep enough to recreate
- Well-designed and efficient — the site itself is proof of taste
- **The bar (Will, June 12, 2026): exceptional, non-negotiable.** It must look and feel like a design studio made it — because it is for designers, by designers. The site's design IS the credibility argument.
- Motion: beautiful animations **where needed** — purposeful (hover-expand, freshness states, transitions), never decorative noise
- Clear typographic hierarchy throughout; individual card layout treated as a first-class design problem, not a grid cell
- Typography: Will supplies the fonts (pending — see Open Questions)

---

## 9. Search (killer feature)

### V1 — semantic search over the database
- "What do you do?" style input — e.g., "I'm a packaging designer"
- Embeddings via **Cloudflare Workers AI (`bge-small`)** — entries embedded at build time, queries at runtime; free tier, no API key in the browser, no extra vendor
- **Log every query from day one** — empty searches are the future standing orders (V2) and the best demand signal we'll ever get

### V2 — hunt on demand (the moat)
- Database empty for a niche → "nothing yet — hunting" → targeted scrape kicks off → user notified when results land
- **Every empty search becomes a permanent standing order**: "I design book covers" → no results → hunt → book-cover work watched forever
- Self-evolving: users literally tell the system what to curate next. Gets better the more specific people's jobs are — the opposite of generic AI newsletters.
- Quality bar does NOT drop for on-demand hunts. "Nothing's cleared the bar yet — you'll be first to know" beats five mediocre posts.

---

## 10. Bookmarks, Email & Accounts

- **V1:** bookmarks in localStorage — no accounts, no backend, zero friction
- **V1 also ships dumb email capture:** single field in the footer and on entry pages ("new finds, weekly-ish") → Buttondown or similar free tier. Without it, V1 captures zero emails and early evangelists leave no way to bring them back.
- **V2:** "want your saves everywhere? drop your email" → magic-link auth (no passwords to store)
- **The bookmark feature IS the email capture** (V2 layer, lands on top of the V1 list). Accounts are the v2 carrot, not a v1 requirement.

---

## 11. Newsletter

- Weekly "best of," auto-pulled from the database — same pipeline, second output, almost no extra work
- **Deferred past V1 launch — but the list starts on day one** via the V1 footer capture (Section 10)
- The site is the product; the newsletter is the growth engine / heartbeat that brings people back
- Long-term: possibly sellable/paid tier

---

## 12. Tech Stack (decided)

| Piece | Choice |
|---|---|
| Shape | **One TypeScript monorepo**: scraper + site together; one language everywhere |
| Database | **The repo is the database** — each entry = markdown/JSON file + thumbnail, committed by the pipeline; supersession is frontmatter; every editorial decision is version-controlled |
| Site framework | **Astro** (content collections, visual-first, fast static output) |
| Hosting | **Cloudflare Pages** — rebuilds on push, free |
| Scraper runtime | GitHub Actions (free, public repo); $5/mo server only if jitter hurts |
| Reddit access | Official free API (script app) — public pages block Actions IPs |
| AI filter + summaries | **Claude Sonnet**, single pass (score + writeup + category + tags); Haiku only for cheap utility passes |
| Search | Cloudflare Workers AI embeddings (`bge-small`), build-time index, runtime query (v1) → agentic hunt (v2) |
| Bookmarks | localStorage (v1) → magic-link email auth (v2) |
| Email capture | Footer field → Buttondown free tier (v1) |
| Analytics | Cloudflare built-in (free, no cookie banner) |
| Polling cadence | 15-min listener; hourly promotion check; 72h surge mode post-V1 |
| Backend (future) | Supabase bolts on when search v2 / accounts need it — without touching the site |

---

## 12b. Success Metrics (decide before launch, measure from day one)

- **Return-visitor rate + bookmark rate** — is it valuable?
- **Search queries** (logged from day one) — is there demand we're not serving? These become V2 standing orders.
- **Entries/week clearing the 7+ bar** — is the pipeline healthy?
- **Email signups** — is the growth asset compounding?

---

## 13. V1 Cut Line (decided)

**Ships:** Reddit listener (15-min) + dedup + holding pen + hourly velocity check · Sonnet scoring + writeups · review queue · creator notifications · 12-month backfill (launch at 50–75 entries) · site (grid, hover-expand, tap-to-expand mobile, entry pages, filters, freshness system, credit/takedown page) · localStorage bookmarks · footer email capture · semantic search v1 · query logging · Cloudflare analytics

**Deferred:** search v2 hunts · accounts/magic link · newsletter sends · surge mode · X + tool-community sources · monetization

---

## 14. Parked / Open Questions

- [ ] **Domain registration — deferred by Will, handle later.** Target: **`fullbleed.ai`** (confirmed unregistered June 12, 2026; note .ai runs ~$70–90/yr and registrations are 2-yr minimum). Fallback/defensive options also open at last check: `fullbleed.design`, `fullbleed.gallery`, `fullbleed.studio`. `fullbleed.com` is corporate-held. Social handles unchecked. Risk accepted: unregistered names can get sniped while parked.
- [ ] **Voice doc** — full draft at `VOICE.md`, needs Will's redline before the pipeline writes anything (blocks backfill)
- [ ] **Fonts** — Will is supplying them (files or names + web-license status). Blocks final site design, not the pipeline.
- [ ] **Sources beyond Reddit** — X + tool communities, post-V1
- [ ] **Monetization** — paid newsletter? Pro archive access? Later problem. (Revisit Reddit API commercial terms then.)

---

## 15. Decision Log

- Publication leads, library backs it (freshness is the soul; archive self-prunes)
- Always-on listener over daily cron — with holding pen + hourly proof check to preserve the quality bar
- Taxonomy doubles as filter rubric; structure does the curating
- No replacement framing, ever — editorial reframe rule baked into the AI writeup pass
- Hover-expand at 300–400ms, floating overlay, three info tiers
- Bookmarks before accounts; accounts via magic link = email capture strategy
- Empty search results become permanent standing scrape orders (self-evolving curation)
- *June 12, 2026:* Sonnet over Haiku for the taste gate (the judgment is the product); calibrate against ~50 hand-judged posts during backfill
- *June 12, 2026:* 15-min baseline polling (5-min reserved for surge); velocity-based promotion; per-sub thresholds in config
- *June 12, 2026:* Backfill is V1's first build step; launch gate = 50–75 entries
- *June 12, 2026:* Add r/StableDiffusion + r/comfyui; accept V1 category skew honestly
- *June 12, 2026:* Rehost thumbnails only + credit/takedown page (Pinterest model)
- *June 12, 2026:* Stack: TypeScript monorepo, Astro, repo-as-database, Cloudflare Pages + Workers AI embeddings; Supabase deferred until a feature needs it
- *June 12, 2026:* V1 ships dumb footer email capture (the cut line previously captured zero emails)
- *June 12, 2026:* Creator notification on publish = primary launch-phase growth flywheel
- *June 12, 2026:* Review queue before publish for month one — Will is the calibration data
- *June 12, 2026:* Mobile = tap-once-expand, tap-again-enter
- *June 12, 2026:* Controlled tag vocabulary in config; model proposes, Will approves additions
- *June 12, 2026:* **Name: Full Bleed.** Primary domain target: `fullbleed.ai` (unregistered at decision time; registration deferred)
