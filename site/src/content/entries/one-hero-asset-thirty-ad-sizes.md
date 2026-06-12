---
title: One hero asset, thirty ad sizes
date: 2026-05-28
sourceDate: 2026-05-26
category: tools-you-can-steal
tools:
  - Claude Code
  - Figma
disciplines:
  - Advertising
  - Graphic Design
thumbnail: https://picsum.photos/seed/ad-resizer/800/450
score: 8
hoverWhat: A studio's production designer built an auto-resizer that takes one approved hero layout and emits every banner, social, and OOH size with art direction intact — focal points tracked, type reflowed by rules, never just scaled. Thirty sizes ship in minutes instead of two days.
hoverWhy: Resize purgatory is the most automatable misery in production design, and this kills it without losing craft.
modelVersions: Claude Code, Figma plugin API
source:
  permalink: https://www.reddit.com/r/ClaudeAI/comments/fixture3/
  outboundUrl: null
  author: fixture_proddesigner
  subreddit: ClaudeAI
supersededBy: null
fixture: true
---

## The how

1. The hero frame carries annotations: focal point, type hierarchy, logo clear-space, crop tolerances.
2. A Figma plugin walks a size manifest (30 formats from leaderboard to bus shelter).
3. Per size, layout rules decide: crop vs. extend background, stacked vs. inline type, which elements drop at small sizes.
4. Edge cases (skyscraper banners, square socials) get dedicated rule branches the designer tuned over a week of real campaigns.
5. Output lands as organized Figma pages, named to the media plan, ready for QA.

## Run it back

The rules encode taste — budget a week of tuning against a real campaign. After that it's push-button. Plugin scaffolding via Claude Code took the designer two evenings, no prior plugin experience.
