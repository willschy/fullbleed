---
title: "AnchorFlow: raster images to clean, editable SVGs"
date: 2026-05-19
sourceDate: 2026-05-19
category: papers
tools:
  - Figma
disciplines: ["Design", "Image"]
thumbnail: /thumbs/anchorflow-raster-images-to-clean-editable-svgs-cover.webp
credit: "FÍA YANG / Unsplash"
score: 7
hoverWhat: A research method that converts raster images into SVGs by rethinking
  where anchor points go, so the result is actually editable, not just
  technically vector.
hoverWhy: A research method that converts raster images into SVGs by rethinking
  where anchor points go, so the result is actually editable, not just
  technically vector.
modelVersions: null
source:
  origin: arXiv
  permalink: https://arxiv.org/abs/2605.19551v1
  outboundUrl: https://arxiv.org/abs/2605.19551v1
  author: Mengnan Jiang et al.
supersededBy: null
fixture: false
---

**What it is.** A paper describing AnchorFlow, a system for turning raster images into SVG files. The core idea is that the quality of an SVG conversion lives or dies on anchor point placement, those control points that define each Bezier curve. AnchorFlow predicts a sparse set of anchor points for each path in the image, resolves them into ordered Bezier curves, then runs a rendering-guided correction pass before assembling the final file.

**Why it matters.** Vectorizing artwork is a real part of the job for designers who inherit raster logos, illustrations, or scanned drawings. The existing tools tend to split into two camps: high-fidelity tracers that produce technically accurate paths but bury them in hundreds of redundant anchor points, and compact methods that lose too much of the original geometry. Either way you end up cleaning things up by hand. AnchorFlow is trying to hit a middle point where the SVG is close to the source and actually workable in Illustrator or Figma without a second round of surgery.

**What is new here.** Most prior approaches treat path count or curve density as the lever for balancing fidelity against editability. AnchorFlow argues that anchor placement itself is the right place to intervene. By predicting sparse, image-conditioned anchor fields per path component and then running a rendering-guided correction before final resolution, it keeps the structure compact without drifting from the original geometry. The paper reports a meaningful reduction in editable complexity, meaning fewer anchor points, while holding onto competitive fidelity to the source image. It is a research result at this point, so a production tool is not yet in hand, but the direction is directly relevant to anyone whose work involves wrangling legacy raster art into clean vector form.
