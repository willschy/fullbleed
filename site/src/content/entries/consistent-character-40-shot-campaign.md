---
title: One character, forty shots, zero drift
date: 2026-06-10
sourceDate: 2026-06-09
category: new-possible
tools:
  - Flux
  - Kling
  - ComfyUI
disciplines:
  - Motion
  - Advertising
  - Creative Direction
thumbnail: https://picsum.photos/seed/character-campaign/800/450
score: 9
hoverWhat: A motion designer ran a brand mascot through a 40-shot social campaign — same character, consistent across angles, lighting, and motion — using a Flux character LoRA feeding Kling for animation. Six months ago this needed a 3D pipeline and a render farm.
hoverWhy: Consistent characters were the wall between AI video and real campaign work. The wall just moved.
modelVersions: Flux 1.1 + character LoRA, Kling 2.5, ComfyUI
source:
  permalink: https://www.reddit.com/r/StableDiffusion/comments/fixture5/
  outboundUrl: null
  author: fixture_motion
  subreddit: StableDiffusion
supersededBy: null
fixture: true
---

## The how

1. Character sheet first: 60 renders of the mascot across angles/expressions, generated then hand-curated to 25 for LoRA training.
2. Flux LoRA locks identity; every campaign still is generated against it with shot-specific prompts from the boards.
3. Stills become Kling image-to-video shots, 4–8 seconds each; motion prompts kept minimal to avoid identity drift.
4. Drift QA: every tenth frame auto-compared against the character sheet; failing shots regenerate with tighter conditioning.
5. Edit assembled conventionally — the AI replaces the render pipeline, not the editor.

## Run it back

Character sheet discipline is everything: curate training images like you're casting. Budget two days for the LoRA loop, then shots are minutes each.
