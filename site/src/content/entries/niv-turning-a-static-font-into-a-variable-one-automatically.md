---
title: "NIV: turning a static font into a variable one automatically"
date: 2026-06-03
sourceDate: 2026-06-03
category: papers
tools:
  - WAN
disciplines: ["Design"]
thumbnail: /thumbs/niv-turning-a-static-font-into-a-variable-one-automatically-cover.webp
credit: "Marco Zuppone / Unsplash"
score: 8
hoverWhat: A research method that takes a static font and predicts the glyph
  variations needed to make it fully variable, covering weight, width, slant,
  and more in a single model.
hoverWhy: A research method that takes a static font and predicts the glyph
  variations needed to make it fully variable, covering weight, width, slant,
  and more in a single model.
modelVersions: null
source:
  origin: arXiv
  permalink: https://arxiv.org/abs/2606.05261v1
  outboundUrl: https://arxiv.org/abs/2606.05261v1
  author: Nadav Benedek et al.
supersededBy: null
fixture: false
---

**What it is.** Variable fonts let a single font file stretch and flex across a range of weights, widths, and slants, so a designer can dial in exactly the look they want without swapping files. Building one from scratch is slow, expert work. NIV is a neural method that takes a static font's glyph outlines and a set of target design axes, then predicts the per-point displacements that would make it behave like a proper variable font. The output is a standard variable font file that works in any renderer that already supports them. Code, dataset, and trained weights are all on GitHub.

**Why it matters.** Most typefaces that exist are static. Getting them to flex the way a variable font does normally means a type designer going point by point, which is slow enough that it rarely happens outside of major releases. A method that can automate that conversion meaningfully widens what is available to work with. For motion designers or anyone doing display work who wants a typeface with a specific character but needs weight or width variation, this is the gap it addresses.

**What is new here.** Earlier work on font generation mostly focused on producing new glyphs or matching styles. NIV operates directly on vector geometry and predicts variation across multiple design axes at once, rather than treating each axis separately. A Property Embedding mechanism handles the interactions between axes so that, say, going wider and heavier together stays coherent rather than drifting. The training set was built from over a million variation tuples pulled from variable Google Fonts, and the model generalizes to glyphs it has not seen, including high-complexity CJK characters and handwriting, which is a meaningful stretch from the training distribution.
