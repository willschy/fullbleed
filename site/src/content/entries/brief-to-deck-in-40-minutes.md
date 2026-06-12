---
title: Brief-to-deck in 40 minutes
date: 2026-06-05
sourceDate: 2026-06-03
category: tools-you-can-steal
tools:
  - Claude
  - Figma
  - Next.js
disciplines:
  - Creative Direction
  - Graphic Design
thumbnail: https://picsum.photos/seed/deck-generator/800/500
score: 8
hoverWhat: An AD wired their agency's deck templates into a small web app — paste the client brief, get a structured first draft in the house style with real layouts, not slide soup. Two days of production became 40 minutes of editing.
hoverWhy: The saved time goes to the thinking, which is the part clients actually pay for.
modelVersions: Claude API (Sonnet), Figma REST API
source:
  permalink: https://www.reddit.com/r/SideProject/comments/fixture2/
  outboundUrl: https://example.com/fixture-deck-demo
  author: fixture_ad
  subreddit: SideProject
supersededBy: null
fixture: true
---

## The how

1. The agency's six master deck templates live in Figma; each frame is tagged with a slot schema (headline, support, visual, data).
2. A Next.js app takes the raw brief and calls Claude with the agency's strategy-deck structure as a system prompt.
3. Claude returns slide-by-slide content mapped to slot schemas — it picks which template each section needs.
4. The Figma API populates frames; the AD gets a link to a draft file, never a blank canvas.
5. House rules (banned words, claim-substantiation reminders) run as a lint pass before the file is created.

## Run it back

Template tagging is a weekend; the app is ~400 lines. The leverage compounds with template quality — this is your deck archive becoming infrastructure.
