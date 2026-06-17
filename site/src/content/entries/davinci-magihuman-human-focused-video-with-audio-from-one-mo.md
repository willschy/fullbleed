---
title: "daVinci-MagiHuman: human-focused video with audio from one model"
date: 2026-03-21
sourceDate: 2026-03-21
category: models
thumbnail: /thumbs/davinci-magihuman-human-focused-video-with-audio-from-one-mo-cover.webp
credit: "Wesley Pribadi / Unsplash"
tools:
  - WAN
disciplines: ["Video", "Audio"]
score: 7
hoverWhat: A multimodal open model from GAIR that turns text or images into
  video with synced audio, tuned specifically for human subjects.
hoverWhy: A multimodal open model from GAIR that turns text or images into video
  with synced audio, tuned specifically for human subjects.
modelVersions: null
source:
  origin: Hugging Face
  permalink: https://huggingface.co/GAIR/daVinci-MagiHuman
  outboundUrl: https://huggingface.co/GAIR/daVinci-MagiHuman
  author: GAIR
supersededBy: null
fixture: false
---

**What it is.** An open model from GAIR that generates video and audio together from text, images, or both. It is built with a specific focus on human subjects, meaning portraits, people in motion, and character-driven clips rather than generic scene generation. Weights are released under Apache 2.0 and the model supports several languages including English, Chinese, Japanese, Korean, German, French, and Cantonese.

**Why it matters.** Human figures are where most open video models fall apart fastest. Faces blur, hands melt, motion looks mechanical. A model tuned specifically for people is a real thing if you are doing character work, concept visualization, or anything where a believable person on screen matters.

**What it improved on.** General-purpose open video models treat human subjects the same as everything else, which tends to show. MagiHuman is built around that problem specifically, and it handles audio generation in the same pass rather than leaving that as a separate step.

**Strengths.** Combined video and audio in one model, a deliberate focus on human figure quality, open weights with a permissive license, and multilingual text input that covers a wider range of working contexts than most open releases.

**Weaknesses.** The model card metadata is sparse, so there is not much published on benchmark performance or hardware requirements beyond what you can infer. Expect it to want a capable GPU. Human-subject focus also means it is a narrower tool, and for landscape or abstract work you would likely look elsewhere. As with most open video models, quality still has ground to cover before it matches closed commercial options.
