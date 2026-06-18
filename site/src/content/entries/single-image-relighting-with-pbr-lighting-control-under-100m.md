---
title: Single-image relighting with PBR lighting control, under 100ms
date: 2026-05-18
sourceDate: 2026-05-18
category: papers
tools: []
disciplines: ["Image"]
thumbnail: /thumbs/single-image-relighting-with-pbr-lighting-control-under-100m-cover.webp
credit: "freestocks / Unsplash"
score: 8
hoverWhat: PIXLRelight takes a photograph and a lighting specification and hands
  back a relit version in under a tenth of a second, using physically based
  rendering intrinsics to make the light actually behave like light.
hoverWhy: PIXLRelight takes a photograph and a lighting specification and hands
  back a relit version in under a tenth of a second, using physically based
  rendering intrinsics to make the light actually behave like light.
modelVersions: null
source:
  origin: arXiv
  permalink: https://arxiv.org/abs/2605.18735v1
  outboundUrl: https://arxiv.org/abs/2605.18735v1
  author: Miguel Farinha et al.
supersededBy: null
fixture: false
---

**What it is.** A method for relighting a single photograph using physically based lighting. You give it an image and specify the light — position, type, whatever a PBR setup supports — and a transformer-based model applies that illumination to the photo in one forward pass, in under 100 milliseconds. The code and weights are public.

**Why it matters.** Convincing relighting has always meant either a compositing pipeline with a lot of manual work, a slow per-image optimization loop, or accepting that text prompts and environment maps only get you so far. PIXLRelight is fast enough to be interactive and controllable enough to be precise, which is a combination that has been genuinely hard to get from a single open model. For anyone doing product photography, visual development, or compositing work, that gap between "good enough approximation" and "physically plausible result" is exactly where time disappears.

**What is new here.** Most learned relighting approaches either chain inverse rendering and forward rendering together, where errors stack up at each step, or they bake lighting control into something coarse like a text description or a single environment map. PIXLRelight sidesteps both problems with a shared intrinsic conditioning — albedo, diffuse shading, and non-diffuse residuals — that can come from real multi-illumination photographs or from a path-traced render of a rough 3D reconstruction of the input. That shared representation is what lets the model bridge real photography and PBR lighting without the error-accumulation problem. A per-pixel affine modulation layer keeps fine image detail from getting smeared in the process.
