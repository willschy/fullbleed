---
title: "HairGPT: strand-level 3D hair generation with semantic editing"
date: 2026-05-09
sourceDate: 2026-05-09
category: papers
tools:
  - WAN
disciplines: ["3D"]
thumbnail: /thumbs/hairgpt-strand-level-3d-hair-generation-with-semantic-editin-cover.webp
credit: "Yoann Boyer / Unsplash"
score: 7
hoverWhat: A research framework that treats individual hair strands as the
  generative unit, giving you compositional control over 3D hairstyles by scalp
  region and strand hierarchy.
hoverWhy: A research framework that treats individual hair strands as the
  generative unit, giving you compositional control over 3D hairstyles by scalp
  region and strand hierarchy.
modelVersions: null
source:
  origin: arXiv
  permalink: https://arxiv.org/abs/2605.08824v1
  outboundUrl: https://arxiv.org/abs/2605.08824v1
  author: Haimin Luo et al.
supersededBy: null
fixture: false
---

**What it is.** A research paper introducing HairGPT, a system for generating and editing realistic 3D hairstyles strand by strand. Instead of treating hair as a continuous field the model has to hallucinate all at once, HairGPT breaks the problem into parts: it divides the scalp into semantic regions, then builds hair from the root out, moving from broad layout down to fine strand detail. You can edit one section of a hairstyle without touching the rest, and the system can handle complex or unusual styles that trip up more holistic approaches.

**Why it matters.** Anyone working in character art, virtual production, or digital grooming knows that hair is one of the hardest things to author convincingly. Current generative tools tend to produce hair as a kind of texture blob, which looks fine at a distance but falls apart when you need structural control or want to adjust just the fringe without redoing the whole head. HairGPT is aimed directly at that gap. The compositional editing angle is the part worth watching: if the approach holds up, it means asking a model to change the volume on one scalp region while leaving the rest alone, which is closer to how a grooming artist actually works.

**What is new here.** Most generative hair work leans on diffusion models operating over continuous fields, where global shape and local strand detail are tangled together and hard to pull apart. HairGPT reframes the problem as autoregressive sequence modeling, treating each strand as a token in a sequence rather than a point in a field. It adds a geometric tokenizer and region-aware semantic annotations on top of that, so the model understands which part of the scalp it is working on and can generate hierarchically from layout to detail. The result is a system where generation and editing follow a structure that maps onto how digital hair is actually groomed, rather than one that produces a finished texture and leaves you to interpret it.
