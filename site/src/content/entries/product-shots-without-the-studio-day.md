---
title: Product shots without the studio day
date: 2026-06-11
sourceDate: 2026-06-10
category: client-work
tools:
  - ComfyUI
  - Flux
disciplines:
  - Photography
  - Packaging
thumbnail: https://picsum.photos/seed/product-shots/800/640
score: 8
hoverWhat: A packaging photographer shoots each product once on a turntable, then generates the full deliverable set — lifestyle contexts, seasonal variants, channel-specific crops — from that single capture session. The client's quarterly refresh dropped from four shoot days to one.
hoverWhy: The photographer kept the client and the margin; the studio days became the leverage, not the product.
modelVersions: Flux 1.1, ComfyUI (depth + reference conditioning)
source:
  permalink: https://www.reddit.com/r/comfyui/comments/fixture10/
  outboundUrl: null
  author: fixture_photographer
  subreddit: comfyui
supersededBy: null
fixture: true
---

## The how

1. One controlled capture session: 36-angle turntable pass + a true-color reference under calibrated light.
2. Product geometry from the turntable pass conditions every generated scene — the label never warps because depth and reference lock it.
3. Scene prompts come from the client's brand world doc (approved settings, seasons, props).
4. Color QA against the calibrated reference is non-negotiable; packaging clients notice a 2% hue shift.
5. Deliverables batch out per channel spec from a single approved master per scene.

## Run it back

The capture discipline is the moat — garbage turntable, garbage everything. Existing studio gear covers it; the ComfyUI graph is buildable in a week of evenings.
