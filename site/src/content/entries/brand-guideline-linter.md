---
title: A linter for brand guidelines
date: 2026-02-14
sourceDate: 2026-02-12
category: tools-you-can-steal
tools:
  - Claude
  - n8n
disciplines:
  - Branding
  - Creative Direction
thumbnail: https://picsum.photos/seed/brand-linter/800/550
score: 7
hoverWhat: A brand team at a mid-size agency runs every outgoing deck and asset through a bot that checks it against the client's brand guidelines — wrong logo lockup, off-palette colors, banned phrasing — before anything leaves the building. Violations come back as a checklist, not a bounce.
hoverWhy: Guideline enforcement is the least glamorous, most reputation-saving job in branding — and it automates almost completely.
modelVersions: Claude (Sonnet), n8n
source:
  permalink: https://www.reddit.com/r/ClaudeAI/comments/fixture7/
  outboundUrl: null
  author: fixture_brandteam
  subreddit: ClaudeAI
supersededBy: null
fixture: true
---

## The how

1. Each client's guidelines PDF is distilled once into a structured rule file (lockups, clear-space, palette values, voice rules, banned terms).
2. An n8n flow watches the "outgoing" folder; new PDFs/decks get page-imaged and sent to Claude with the client's rule file.
3. Claude returns violations with page numbers and severity; borderline calls are flagged "judgment" rather than auto-failed.
4. Report lands in the project channel. Humans overrule freely — the bot is a checklist, not a gate.

## Run it back

One afternoon per client to structure the rules, one n8n flow forever. Start with your most guideline-sensitive client and the most embarrassing past mistake.
