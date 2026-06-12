---
title: Napkin sketch to clickable prototype, mid-meeting
date: 2026-04-22
sourceDate: 2026-04-20
category: new-possible
tools:
  - Claude Code
disciplines:
  - Product Design
  - Web Design
thumbnail: https://picsum.photos/seed/napkin-prototype/800/600
score: 7
hoverWhat: A product designer photographed a whiteboard sketch during a client workshop and had Claude Code turn it into a working clickable prototype before the meeting ended — real components, real interactions, deployed to a URL the client opened on their phone.
hoverWhy: The gap between "imagine this" and "tap this" used to be a week; closing it inside the meeting changes how workshops sell work.
modelVersions: Claude Code (Opus)
source:
  permalink: https://www.reddit.com/r/ClaudeCode/comments/fixture6/
  outboundUrl: https://example.com/fixture-prototype
  author: fixture_pd
  subreddit: ClaudeCode
supersededBy: null
fixture: true
---

## The how

1. Phone photo of the whiteboard flow, dropped straight into Claude Code.
2. A standing project template (design tokens, component library, deploy config) means generation lands styled, not generic.
3. Claude Code builds the three-screen flow as a Next.js app against the template, ~15 minutes including two correction rounds.
4. Push to a preview URL; client walks the flow on their phone while the workshop is still running.

## Run it back

The unlock is the pre-built template — tokens and components ready so output looks like you, not like a demo. Build that once; every workshop after is theater.
