---
title: Layout editing that keeps your design's structure intact
date: 2026-02-01
sourceDate: 2026-02-01
category: papers
tools: []
disciplines: ["Design"]
thumbnail: /thumbs/layout-editing-that-keeps-your-design-s-structure-intact-cover.webp
credit: "Michael Myers / Unsplash"
score: 7
hoverWhat: A research framework that edits graphic design layouts geometrically
  while holding the untouched elements in place, and does it without needing
  matched before-and-after training pairs.
hoverWhy: A research framework that edits graphic design layouts geometrically
  while holding the untouched elements in place, and does it without needing
  matched before-and-after training pairs.
modelVersions: null
source:
  origin: arXiv
  permalink: https://arxiv.org/abs/2602.01046v1
  outboundUrl: https://arxiv.org/abs/2602.01046v1
  author: Jiawei Lin et al.
supersededBy: null
fixture: false
---

**What it is.** ReLayout is a research framework for editing the layout of a graphic design in response to a specific instruction. You tell it to resize, reposition, or otherwise adjust an element, and it executes that change while keeping the spatial relationships among everything else intact. It does this by building a relation graph, a representation of how the untouched elements relate to each other in position and size, and using that graph as a constraint throughout the edit.

**Why it matters.** Anyone who has tried to automate layout work knows that touching one element tends to wreck the composition around it. The spatial logic of a design is implicit, not written down anywhere, so tools that move things around without modeling those relationships produce results that have to be manually cleaned up. ReLayout is an attempt to make that relational structure explicit and computable, which is the right problem to be solving if automated redesign is ever going to be genuinely useful to a working designer.

**What is new here.** Most layout models need paired training data, an original design next to its edited version, which is expensive and rare to collect. ReLayout sidesteps that by training on reconstruction instead. It learns to rebuild a design from its parts, its relation graph, and a synthesized editing operation, which means it can develop a feel for the editing process without anyone ever labeling a true before-and-after pair. A multimodal large language model handles the backbone, so four different editing actions are unified inside a single model rather than split across separate systems. The user studies and quantitative results in the paper show it outperforming baseline approaches on both edit accuracy and structure preservation, which suggests the approach is doing something real.
