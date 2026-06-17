---
title: "Keye-VL-2.0: open multimodal model built for long video"
date: 2026-06-09
sourceDate: 2026-06-09
category: models
thumbnail: /thumbs/keye-vl-2-0-open-multimodal-model-built-for-long-video-cover.jpg
credit: "Markus Spiske / Unsplash"
tools: []
disciplines: []
score: 7
hoverWhat: Kwai's open 30B MoE model can reason over hour-long videos in a
  single pass, which puts it in rare company among openly released multimodal
  models.
hoverWhy: Kwai's open 30B MoE model can reason over hour-long videos in a single
  pass, which puts it in rare company among openly released multimodal models.
modelVersions: null
source:
  origin: HF Papers
  permalink: https://huggingface.co/papers/2606.10651
  outboundUrl: https://arxiv.org/abs/2606.10651
  author: Kwai Keye Team et al.
supersededBy: null
fixture: false
---

**What it is.** Kwai Keye-VL-2.0-30B-A3B is an open multimodal model from Kwai's research team, built around a Mixture-of-Experts architecture that activates only about 3 billion parameters at a time despite its 30B total scale. It takes video, images, and text as input and is specifically designed to handle very long video, up to 256K tokens of context, which in practice means footage running into the hour range.

**Why it matters.** Most multimodal models either cap out at short clips or start hallucinating badly once a video runs long. Keye-VL-2.0 was built from the ground up to hold coherent understanding across that longer span, including finding specific moments in time and reasoning about what happened when. For anyone working with documentary footage, recorded sessions, or long-form content, that is a real distinction and a rare one among open models.

**What it improved on.** Earlier open multimodal models struggle with ultra-long contexts because the compute cost grows fast and the models lose track of what happened early in the clip. Keye-VL-2.0 adapts a sparse attention mechanism originally developed by DeepSeek into a multimodal architecture, which lets it process that 256K context window without the usual memory wall. The team also layered in reinforcement learning over video and reasoning tasks to reduce the forgetting that typically happens when you try to train one model to do many things at once.

**Strengths.** Open weights, so you can run and fine-tune it yourself. The MoE design keeps active compute lower than the full parameter count suggests. It benchmarks well on long-video comprehension and on pinpointing specific moments in time, which are the two things that tend to fall apart first in competing models. It also has some agentic capability built in, meaning it can work with code, search, and tools in a multimodal loop.

**Weaknesses.** A 30B MoE model is not light, and even with only 3B parameters active per forward pass, you will need serious hardware to run it at any useful speed. The agentic features are promising but this kind of capability tends to be fragile in practice and will need real testing before you trust it in a production workflow. And as with any model that pushes a benchmark headline, the gap between benchmark performance and how it handles your specific footage can be wider than the numbers suggest.
