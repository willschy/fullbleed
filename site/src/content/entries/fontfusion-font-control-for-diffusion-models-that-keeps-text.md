---
title: "FontFusion: font control for diffusion models that keeps text readable"
date: 2026-06-04
sourceDate: 2026-06-04
category: papers
tools: []
disciplines: ["Design", "Image"]
thumbnail: /thumbs/fontfusion-font-control-for-diffusion-models-that-keeps-text-cover.webp
credit: "kaori kubota / Unsplash"
score: 7
hoverWhat: A conditioning framework that lets you specify fonts in generated
  images without the usual tradeoff where tighter typographic control makes the
  actual letters fall apart.
hoverWhy: A conditioning framework that lets you specify fonts in generated
  images without the usual tradeoff where tighter typographic control makes the
  actual letters fall apart.
modelVersions: null
source:
  origin: arXiv
  permalink: https://arxiv.org/abs/2606.06066v1
  outboundUrl: https://arxiv.org/abs/2606.06066v1
  author: Marian Lupascu et al.
supersededBy: null
fixture: false
---

**What it is.** A plug-and-play framework for diffusion transformer models that gives you real font control over generated text. You feed it a font, and it conditions the model to match that typographic style while keeping the letters legible. Under the hood it uses a dual encoder, DeepFont and DINOv2 together, to represent fonts, plus hierarchical token structures that tie typography to image content at multiple levels of detail. It slots into existing diffusion transformer architectures without retraining the base model.

**Why it matters.** Anyone who has tried to get a diffusion model to render a specific typeface knows the problem: push for stylistic fidelity and the text turns to mush, settle for readability and the font is a rough guess at best. That tradeoff has made generated text with real typographic intent essentially unusable for professional work. FontFusion is an attempt to close that gap at the architecture level rather than through prompting or post-processing tricks.

**What is new here.** The dual-encoder approach is the key finding. The paper tested font embedding strategies systematically and found that combining DeepFont and DINOv2 outperformed either alone for typography tasks, which is not obvious and worth knowing. The hierarchical token representation builds explicit relationships between text and font at multiple granularities, and position-aware embeddings create spatial bindings so the style stays tied to where the text actually sits in the image. The paper reports a 76% relative improvement on decorative fonts over single-encoder baselines and font consistency gains in the 68 to 76 percent range over unconditioned models. It does not require retraining existing models, which matters for how quickly this could be adopted.
