---
title: Garment-true virtual try-ons
date: 2026-06-08
sourceDate: 2026-06-06
category: client-work
tools:
  - ComfyUI
  - Stable Diffusion
disciplines:
  - Photography
  - Advertising
thumbnail: https://picsum.photos/seed/garment-tryon/800/1000
score: 9
hoverWhat: A freelance retoucher built a ComfyUI pipeline that maps real garment detail — stitching, drape, print alignment — onto model shots, holding fidelity that off-the-shelf try-on tools lose. Their e-comm client now gets full-catalog coverage from one base shoot.
hoverWhy: This is the fidelity bar that makes AI try-ons client-sellable, and one operator runs it.
modelVersions: SDXL + custom garment LoRA, ComfyUI
source:
  permalink: https://www.reddit.com/r/comfyui/comments/fixture1/
  outboundUrl: null
  author: fixture_retoucher
  subreddit: comfyui
supersededBy: null
fixture: true
---

## The how

1. One base shoot per model — neutral garments, controlled lighting, ~20 poses.
2. Each product garment gets a dedicated LoRA trained on 30–40 flat-lay and detail shots (stitching, buttons, print).
3. ComfyUI graph composites garment onto pose via IPAdapter + ControlNet depth pass, preserving drape physics from the base shot.
4. A final detail pass re-projects the original print at full resolution so patterns never warp.
5. QA grid renders every garment × pose combination overnight; the retoucher approves ~80% untouched.

## Run it back

You'd need a controlled base shoot, product flat-lays, a ComfyUI install with IPAdapter/ControlNet, and an afternoon per garment for LoRA training. The skill that matters is the retoucher's eye — knowing which 20% to reject.
