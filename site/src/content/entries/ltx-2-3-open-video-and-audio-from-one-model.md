---
title: "LTX-2.3: open video and audio from one model"
date: 2026-03-04
sourceDate: 2026-03-04
category: models
thumbnail: /thumbs/ltx-2-3-open-video-and-audio-from-one-model.png
tools: []
disciplines: []
score: 8
hoverWhat: Lightricks' latest open model takes text, images, or existing clips
  and returns video with audio already attached, skipping the separate sound
  step that makes most open video pipelines a chore.
hoverWhy: Lightricks' latest open model takes text, images, or existing clips
  and returns video with audio already attached, skipping the separate sound
  step that makes most open video pipelines a chore.
modelVersions: null
source:
  origin: Hugging Face
  permalink: https://huggingface.co/Lightricks/LTX-2.3
  outboundUrl: https://huggingface.co/Lightricks/LTX-2.3
  author: Lightricks
supersededBy: null
fixture: false
---

**What it is.** An open video model from Lightricks, and an incremental step forward from LTX-2. Feed it text, an image, an image with a text prompt, or an existing video, and it returns a clip with audio already generated in the same pass. The model covers a wide range of tasks: text-to-video, image-to-video, video-to-video, and several audio generation modes including video-to-audio and audio-to-audio.

**Why it matters.** Open video models have mostly been silent, which means sourcing or generating audio separately and then syncing it yourself. LTX-2.3 folds that into one model, so the output arrives with sound already matched to the picture. For a motion designer or editor who needs a fast, self-contained open-source option, that is a real reduction in pipeline steps.

**What it improved on.** Earlier versions of the LTX line left audio entirely out of scope. LTX-2 introduced audio generation; LTX-2.3 refines that foundation. The version bump suggests quality and reliability improvements over LTX-2, though Lightricks has not published a detailed public changelog that spells out every difference.

**Strengths.** Open weights, which means you can run it locally or integrate it into your own pipeline. It supports a broad set of input and output modes, and it connects to the Diffusers library, so the setup path is familiar if you already work with Hugging Face tooling. Multilingual prompt support covers English, German, Spanish, French, Japanese, Korean, Chinese, Italian, and Portuguese.

**Weaknesses.** Clip length is limited, as it is with most open video models right now. Output quality still sits below closed commercial models like Veo or Kling, particularly on motion fidelity and longer or more complex scenes. It asks for meaningful GPU resources to run at a reasonable speed, so lighter hardware will struggle. The audio generation is a genuine differentiator, but it is still maturing and can feel inconsistent depending on the prompt and source material.
