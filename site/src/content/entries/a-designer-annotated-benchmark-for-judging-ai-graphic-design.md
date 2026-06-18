---
title: A designer-annotated benchmark for judging AI graphic design
date: 2026-05-20
sourceDate: 2026-05-20
category: papers
tools: []
disciplines: ["Design"]
thumbnail: /thumbs/a-designer-annotated-benchmark-for-judging-ai-graphic-design-cover.webp
credit: "Kumpan Electric / Unsplash"
score: 7
hoverWhat: TASTE is a preference dataset built by professional designers, and it
  shows that the AI judges most teams rely on today do not actually agree with
  how designers see the work.
hoverWhy: TASTE is a preference dataset built by professional designers, and it
  shows that the AI judges most teams rely on today do not actually agree with
  how designers see the work.
modelVersions: null
source:
  origin: arXiv
  permalink: https://arxiv.org/abs/2605.20731v2
  outboundUrl: https://arxiv.org/abs/2605.20731v2
  author: Haonan Zhu et al.
supersededBy: null
fixture: false
---

**What it is.** A dataset called TASTE, built by having two independent groups of five professional designers evaluate outputs from four text-to-image models across nine graphic design criteria: typography, layout, color harmony, and several others. Each image also got a hallucination flag. The paper pairs the dataset with a validation framework that tests whether designer agreement is meaningfully above random, and then runs current AI preference models against that designer panel to see how they hold up.

**Why it matters.** Most preference data used to train and evaluate image models comes from photo-style comparisons that reduce everything to a single thumbs-up or thumbs-down. Graphic design does not work that way. A layout can be strong and the color choices can be poor, and a single label buries that distinction. If you are using a vision-language model to judge or rank design outputs in a pipeline, TASTE offers the first real evidence of how far off those judges can be from what a professional designer would actually say.

**What is new here.** The multi-dimensional structure is the first contribution: nine criteria evaluated separately, by people who do the work professionally, across multiple models, with a second cohort to keep the labels honest. The signal-validation framework is the second: the authors tested whether designer agreement was real or just noise, and found it was real but moderate, which is a more useful answer than most benchmark papers bother to give. The finding that off-the-shelf VLM judges and dedicated text-to-image scorers both fall short of designer-panel agreement is the part worth sitting with. A small MLP trained on TASTE closes much of that gap, which points toward what better-targeted training data can do for evaluation.
