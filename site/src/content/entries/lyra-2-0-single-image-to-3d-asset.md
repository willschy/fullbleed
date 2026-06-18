---
title: "Lyra 2.0: single image to 3D asset"
date: 2026-04-06
sourceDate: 2026-04-06
category: models
tools:
  - WAN
disciplines: ["3D"]
thumbnail: /thumbs/lyra-2-0-single-image-to-3d-asset-cover.webp
credit: "Rajan singh / Unsplash"
score: 7
hoverWhat: Nvidia's Lyra 2.0 takes one photo and hands back a 3D asset, which
  cuts out a lot of the manual work that usually sits between a reference image
  and something you can actually use in a scene.
hoverWhy: Nvidia's Lyra 2.0 takes one photo and hands back a 3D asset, which
  cuts out a lot of the manual work that usually sits between a reference image
  and something you can actually use in a scene.
modelVersions: null
source:
  origin: Hugging Face
  permalink: https://huggingface.co/nvidia/Lyra-2.0
  outboundUrl: https://huggingface.co/nvidia/Lyra-2.0
  author: nvidia
supersededBy: null
fixture: false
---

**What it is.** An image-to-3D model from Nvidia. You give it a single photograph or render, and it generates a 3D asset from that one view.

**Why it matters.** Getting from a flat reference to a usable 3D object has always meant either a lot of manual modeling time or a pipeline stitched together from several tools. A model that takes one image and produces geometry directly shortens that gap in a meaningful way for motion designers, art directors building scenes, or anyone who needs a quick 3D pass on a visual idea.

**What it improved on.** Earlier image-to-3D approaches often required multiple views of an object, careful camera setups, or significant cleanup after generation. Lyra 2.0 is built around the single-image case, which is closer to how reference images actually exist in a working creative's folder.

**Strengths.** Single-image input keeps the workflow simple. The weights are available on Hugging Face, so it fits into a local or self-hosted pipeline rather than locking you into a cloud service. Nvidia backing means the research is serious and the model has been built with real compute behind it.

**Weaknesses.** Single-image 3D reconstruction is genuinely hard, and the model will struggle with occluded geometry, the back of an object it cannot see. Output quality will vary with how well-lit and well-framed the input image is. It also wants capable hardware to run at a reasonable speed, and like most models in this space, the results will likely need some cleanup before they are production-ready.
