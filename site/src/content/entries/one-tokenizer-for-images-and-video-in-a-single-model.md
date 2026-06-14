---
title: One tokenizer for images and video in a single model
date: 2026-06-11
sourceDate: 2026-06-11
category: papers
thumbnail: /thumbs/one-tokenizer-for-images-and-video-in-a-single-model.png
tools: []
disciplines: []
score: 7
hoverWhat: HYDRA-X is a research model that handles images and video through a
  single shared tokenizer, which turns out to matter quite a bit for how unified
  multimodal models are actually built.
hoverWhy: HYDRA-X is a research model that handles images and video through a
  single shared tokenizer, which turns out to matter quite a bit for how unified
  multimodal models are actually built.
modelVersions: null
source:
  origin: HF Papers
  permalink: https://huggingface.co/papers/2606.13289
  outboundUrl: https://arxiv.org/abs/2606.13289
  author: Guozhen Zhang et al.
supersededBy: null
fixture: false
---

**What it is.** A 7-billion-parameter multimodal model from Guozhen Zhang and colleagues that processes images and video through one Vision Transformer instead of running separate encoders for each. The core idea is a "holistic tokenizer" that maps both image and video inputs into the same representational space, so the model downstream sees a unified stream rather than two different kinds of input stitched together.

**Why it matters.** Most models that handle both images and video quietly cheat: they tokenize the two modalities separately and reconcile them later, which creates seams in understanding and generation. If a single tokenizer can do the job cleanly, you get a simpler architecture and, in theory, a model that reasons more coherently about visual content over time. The paper also reports a practical finding for editing tasks: having source and target images interact inside the tokenizer rather than inside the language model improves editing consistency and speeds up training. That is a concrete workflow implication, even if the model itself is research-stage.

**What is new here.** Two findings from their ablations are worth sitting with. First, a frame-level causal attention pattern turns out to be better for visual reconstruction than full spatiotemporal attention, which is counterintuitive. Second, compressing temporal information in stages rather than all at once substantially outperforms single-step compression. They also add a lightweight decompressor trained under joint image-and-video teacher supervision, which pushes the compact latent space to carry complementary semantic structure for both modalities. The architecture is not a product you can drop into a pipeline today, but the findings about attention design and temporal compression will likely show up in tools that are.
