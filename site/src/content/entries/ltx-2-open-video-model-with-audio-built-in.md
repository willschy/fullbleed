---
title: "LTX-2: open video model with audio built in"
date: 2026-01-03
sourceDate: 2026-01-03
category: models
thumbnail: /thumbs/ltx-2-open-video-model-with-audio-built-in-cover.jpg
credit: "Susan Wilkinson / Unsplash"
tools:
  - ComfyUI
  - WAN
disciplines: []
score: 8
hoverWhat: Lightricks' open video model that generates picture and sound
  together in one pass, saving you the separate audio step that most open models
  leave behind.
hoverWhy: Lightricks' open video model that generates picture and sound together
  in one pass, saving you the separate audio step that most open models leave
  behind.
modelVersions: null
source:
  origin: Hugging Face
  permalink: https://huggingface.co/Lightricks/LTX-2
  outboundUrl: https://huggingface.co/Lightricks/LTX-2
  author: Lightricks
supersededBy: null
fixture: false
---

**What it is.** An open video model from Lightricks. Feed it text, an image, or an existing clip, and it returns video with synced audio already baked in. It covers the full range: text-to-video, image-to-video, video-to-video, and the audio variants of each, all from one model with open weights.

**Why it matters.** Open video models almost always come out silent. That means hunting down a second model for sound, wrestling two outputs together, and doubling the friction before you have anything usable. LTX-2 handles picture and audio in the same generation pass, which cuts a multi-step workaround down to one.

**What it improved on.** Lightricks' earlier LTX-Video left audio entirely out of scope. LTX-2 folds it in, and expands the input modes considerably, adding video-to-audio and audio-to-audio paths that the first model never touched.

**Strengths.** Open weights you can actually run and modify. A genuinely broad set of input and output modes under one roof. Slots into ComfyUI and the Diffusers ecosystem without a lot of setup pain. Multilingual prompt support across eight languages.

**Weaknesses.** Clip length stays short, as it does with most open video models at this stage. Quality sits below closed commercial models like Veo or Kling, especially on motion complexity and fine detail. It wants a capable GPU, so running it locally on lighter hardware is going to be a struggle.
