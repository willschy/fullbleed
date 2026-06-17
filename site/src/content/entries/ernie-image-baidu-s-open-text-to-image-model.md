---
title: "ERNIE-Image: Baidu's open text-to-image model"
date: 2026-04-14
sourceDate: 2026-04-14
category: models
thumbnail: /thumbs/ernie-image-baidu-s-open-text-to-image-model-cover.webp
credit: "Colin Lloyd / Unsplash"
tools:
  - Stable Diffusion
  - WAN
disciplines: ["Image"]
score: 7
hoverWhat: An 8B-parameter open-weight image model from Baidu that claims
  top-of-class quality among open generators, worth a look if you're weighing
  alternatives to Flux or SD3.
hoverWhy: An 8B-parameter open-weight image model from Baidu that claims
  top-of-class quality among open generators, worth a look if you're weighing
  alternatives to Flux or SD3.
modelVersions: null
source:
  origin: GitHub
  permalink: https://github.com/baidu/ERNIE-Image
  outboundUrl: https://github.com/baidu/ERNIE-Image
  author: baidu
supersededBy: null
fixture: false
---

**What it is.** An open-weight text-to-image model from Baidu, built on a single-stream Diffusion Transformer architecture with 8 billion parameters. You give it a text prompt and it generates images, with weights available to run locally or self-host.

**Why it matters.** The open text-to-image field has been dominated by a handful of Western labs. A serious entry from Baidu with competitive quality expands the options, and open weights mean you can run it without sending prompts to someone else's API.

**What it improved on.** Baidu's claim is that ERNIE-Image reaches state-of-the-art performance among open-weight models at this parameter count, meaning it's aiming past where earlier open generators like Stable Diffusion landed on quality benchmarks.

**Strengths.** Open weights you can run yourself, a relatively lean 8B parameter footprint for a model in this class, and a single-stream DiT architecture that keeps the design straightforward compared to multi-stage pipelines.

**Weaknesses.** The GitHub repo is sparse, with few hundred stars and limited community testing so far, which makes it hard to know how it actually holds up across diverse prompts and edge cases. Documentation and tooling support are early-stage. And like any model at this scale, it wants capable hardware to run at a reasonable speed.
