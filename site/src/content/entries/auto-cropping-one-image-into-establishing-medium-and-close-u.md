---
title: Auto-cropping one image into establishing, medium, and close-up shots
date: 2026-06-04
sourceDate: 2026-06-04
category: papers
tools: []
disciplines: ["Image", "Video"]
thumbnail: /thumbs/auto-cropping-one-image-into-establishing-medium-and-close-u-cover.webp
credit: "Kai Rohweder / Unsplash"
score: 7
hoverWhat: A research paper that teaches a model to read a single human-centric
  photo and spit out three cinematically reasoned crops, the kind of
  establishing-medium-close-up sequence an art director would normally plan by
  hand.
hoverWhy: A research paper that teaches a model to read a single human-centric
  photo and spit out three cinematically reasoned crops, the kind of
  establishing-medium-close-up sequence an art director would normally plan by
  hand.
modelVersions: null
source:
  origin: arXiv
  permalink: https://arxiv.org/abs/2606.05635v1
  outboundUrl: https://arxiv.org/abs/2606.05635v1
  author: Dehong Kong et al.
supersededBy: null
fixture: false
---

**What it is.** A paper proposing ShotCrop, a model trained to take one human-centric image and produce three coordinated crops: an establishing shot for context, a medium shot for the subject, and a close-up for detail or emotion. Each crop comes paired with a brief description of what it is meant to convey, so the output is a small, reasoned shot sequence rather than just a pile of crops. The authors also release TSC-Bench, a benchmark of 1,200 expert-annotated test cases for evaluating this kind of multi-shot composition.

**Why it matters.** Commercial and editorial work almost always needs more than one crop from a single image. A campaign poster, a social set, a product story told across placements. Right now that work is manual: an art director reads the image, decides what each crop should emphasize, and either does it by hand or briefs someone to. A model that understands cinematic framing logic and can propose that three-shot structure automatically could shorten a real step in the layout and pre-production process, even if a human still makes the final call.

**What is new here.** Most existing crop research optimizes for a single aesthetically pleasing frame, which sidesteps the narrative question entirely. ShotCrop treats the three shots as a set with a relationship between them, not three independent crops. The training pipeline is worth noting: the model is fine-tuned with chain-of-thought reasoning to build compositional logic, then extended with semi-supervised learning using pseudo-labels filtered through aesthetic scoring and CLIP similarity, and finally refined with a reinforcement learning step using a reward tailored to shot localization. The paper reports that ShotCrop outperforms GPT-5 on shot localization accuracy by a meaningful margin on their benchmark, which suggests the specialized training is doing real work that a general-purpose model does not replicate out of the box.
