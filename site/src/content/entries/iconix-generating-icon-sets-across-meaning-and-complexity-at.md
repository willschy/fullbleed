---
title: "Iconix: generating icon sets across meaning and complexity at once"
date: 2026-01-31
sourceDate: 2026-01-31
category: papers
tools:
  - LoRA
disciplines: ["Design"]
thumbnail: /thumbs/iconix-generating-icon-sets-across-meaning-and-complexity-at-cover.webp
credit: "Eric Prouzet / Unsplash"
score: 7
hoverWhat: A research system that builds full icon grids by letting designers
  navigate both what an icon depicts and how detailed it looks, with a user
  study behind it.
hoverWhy: A research system that builds full icon grids by letting designers
  navigate both what an icon depicts and how detailed it looks, with a user
  study behind it.
modelVersions: null
source:
  origin: arXiv
  permalink: https://arxiv.org/abs/2602.00738v1
  outboundUrl: https://arxiv.org/abs/2602.00738v1
  author: Zhida Sun et al.
supersededBy: null
fixture: false
---

**What it is.** Iconix is a co-creative system for generating icon sets. You give it a concept and it builds a two-dimensional grid: one axis moves through semantic territory, from concrete to abstract meanings related to your idea, and the other axis moves through visual complexity, from detailed and elaborate down to simple and stripped. The result is a navigable space of coherent icon variations rather than a pile of one-off generations.

**Why it matters.** Icon work is usually a grind of iteration: generate something, decide it is too literal or too abstract, adjust, repeat. Iconix reframes that by making the semantic and visual dimensions explicit and explorable together. In a study with 32 designers, participants produced more creative grids and reported lower workload compared to a standard workflow, which suggests the structure is actually helping rather than just adding steps.

**What is new here.** Most generative tools treat an icon request as a single prompt and hand back a single result. Iconix builds a semantic scaffold of related analytical perspectives around the concept first, then uses chained image-conditioned generation to keep the style consistent across the whole grid, and then automatically distills each exemplar into a sequence from complex to simple. The progressive simplification piece is the part worth watching: it is a principled way to handle visual abstraction that most current pipelines leave entirely to the designer.
