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
