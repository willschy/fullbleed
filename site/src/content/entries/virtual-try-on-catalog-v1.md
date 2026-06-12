---
title: Virtual try-on, catalog-scale (v1)
date: 2025-09-15
sourceDate: 2025-09-12
category: client-work
tools:
  - Stable Diffusion
  - ComfyUI
disciplines:
  - Photography
  - Advertising
thumbnail: https://picsum.photos/seed/tryon-v1/800/1000
score: 7
hoverWhat: An early production try-on pipeline — garment swaps across a model catalog using inpainting and manual masking. Print fidelity held only at medium distance, but the studio shipped a 200-SKU catalog with it.
hoverWhy: The first proof that try-on pipelines could survive contact with a real client deadline.
modelVersions: SDXL inpainting, ComfyUI
source:
  permalink: https://www.reddit.com/r/StableDiffusion/comments/fixture8/
  outboundUrl: null
  author: fixture_studio2
  subreddit: StableDiffusion
supersededBy: garment-true-virtual-try-ons
fixture: true
---

## The how

1. Manual garment masks per pose (the slow part — ~10 minutes each).
2. SDXL inpainting swaps garments; a color-matching pass corrects fabric tone.
3. Detail shots done conventionally — the pipeline couldn't hold print at close range.
4. ~200 SKUs shipped over three weeks with two operators.

## Run it back

Superseded — the LoRA-based approach holds garment detail without manual masking and at close range. See the current entry.
