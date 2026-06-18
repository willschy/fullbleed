---
title: "UltraShape: image to 3D mesh from one photo"
date: 2025-12-25
sourceDate: 2025-12-25
category: models
tools:
  - LoRA
  - WAN
disciplines: ["3D"]
thumbnail: /thumbs/ultrashape-image-to-3d-mesh-from-one-photo-cover.webp
credit: "Ivan Pergasi / Unsplash"
score: 7
hoverWhat: A fine-tuned open model that turns a single image into a 3D mesh,
  built on Hunyuan3D-2.1 and free to use commercially.
hoverWhy: A fine-tuned open model that turns a single image into a 3D mesh,
  built on Hunyuan3D-2.1 and free to use commercially.
modelVersions: null
source:
  origin: Hugging Face
  permalink: https://huggingface.co/infinith/UltraShape
  outboundUrl: https://huggingface.co/infinith/UltraShape
  author: infinith
supersededBy: null
fixture: false
---

**What it is.** UltraShape is a fine-tuned image-to-3D model from infinith, built on top of Tencent's Hunyuan3D-2.1. Hand it a single image and it returns a 3D mesh. It's released under Apache 2.0, so commercial use is on the table.

**Why it matters.** Getting a usable mesh from a photo usually means either a subscription to a closed service or a long photogrammetry session with many angles. UltraShape collapses that to one image and one model, which is a meaningful shortcut for concept work, prop reference, or early-stage asset exploration.

**What it improved on.** Hunyuan3D-2.1 is already a capable base, and this fine-tune is aimed at pushing the mesh quality and single-image reconstruction further than the base model alone. The open weights and permissive license are things the base model also offers, so the real argument for UltraShape is the fine-tuning work on top.

**Strengths.** Single-image input keeps the workflow simple. Apache 2.0 means you own what you generate and can use it in client work. Being weights-based means you can run it locally or slot it into your own pipeline rather than depending on a third-party API.

**Weaknesses.** The model is a community fine-tune with limited documentation, so expect some trial and error getting it running. Mesh quality from a single image will always have gaps and guesswork on occluded surfaces, and the output will likely need cleanup before it is production-ready. It also wants a capable GPU, and with thin public benchmarks it is hard to know exactly where it lands relative to closed competitors like Tripo or Meshy.
