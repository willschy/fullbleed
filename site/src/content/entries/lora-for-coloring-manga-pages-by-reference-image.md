---
title: LoRA for coloring manga pages by reference image
date: 2026-06-10
sourceDate: 2026-06-10
category: models
tools:
  - ComfyUI
  - FLUX
  - LoRA
disciplines: ["Image"]
thumbnail: /thumbs/lora-for-coloring-manga-pages-by-reference-image-cover.webp
credit: "FÍA YANG / Unsplash"
score: 7
hoverWhat: A fine-tuned LoRA on FLUX.2-klein that takes a black-and-white manga
  page and a reference image and colors the line art to match the palette and
  style of that reference.
hoverWhy: A fine-tuned LoRA on FLUX.2-klein that takes a black-and-white manga
  page and a reference image and colors the line art to match the palette and
  style of that reference.
modelVersions: null
source:
  origin: Hugging Face
  permalink: https://huggingface.co/thedeoxen/FLUX.2-klein-9B-manga-colorization-by-reference-LORA
  outboundUrl: https://huggingface.co/thedeoxen/FLUX.2-klein-9B-manga-colorization-by-reference-LORA
  author: thedeoxen
supersededBy: null
fixture: false
---

**What it is.** A LoRA adapter trained on top of Black Forest Labs' FLUX.2-klein 9B model, built specifically for manga colorization. You feed it a black-and-white manga page alongside a color reference image, and it applies the palette and style from the reference to the line art.

**Why it matters.** Coloring manga or comic pages by hand is slow, and getting consistent color across a chapter is slower still. Having a reference-guided model means you can drop in a single color key image and carry that look across many pages without re-specifying everything from scratch each time.

**What it improved on.** General-purpose image-to-image models will colorize line art, but they make their own palette decisions. This LoRA shifts control to the reference image, so the output follows the colors you chose rather than whatever the base model prefers.

**Strengths.** Built on FLUX.2-klein, which is lighter than the full FLUX.1 dev, so it runs on more modest hardware than the biggest FLUX variants. Apache 2.0 license means you can use it commercially. Works within the diffusers ecosystem, so dropping it into an existing ComfyUI or diffusers pipeline is straightforward.

**Weaknesses.** With only 16 likes at the time of writing, this is a niche community release with limited public testing behind it. Line art with unusual inking styles or heavy tones may not colorize cleanly. How faithfully it tracks a complex reference image is hard to predict without running your own tests. It also inherits FLUX.2-klein's GPU appetite, so a capable card is still required.
