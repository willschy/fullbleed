---
title: ComfyUI node for locking a character's face and voice across generated video
date: 2026-03-21
sourceDate: 2026-03-21
category: plugins-skills
thumbnail: /thumbs/comfyui-node-for-locking-a-character-s-face-and-voice-across-cover.jpg
credit: "Anita Jankovic / Unsplash"
tools:
  - ComfyUI
  - LoRA
disciplines: []
score: 7
hoverWhat: A custom ComfyUI node that takes a reference image and a reference
  voice and keeps both consistent through a generated clip, so you can build
  video around a specific identity instead of a generic one.
hoverWhy: A custom ComfyUI node that takes a reference image and a reference
  voice and keeps both consistent through a generated clip, so you can build
  video around a specific identity instead of a generic one.
modelVersions: null
source:
  origin: GitHub
  permalink: https://github.com/ID-LoRA/ID-LoRA-LTX2.3-ComfyUI
  outboundUrl: https://id-lora.github.io/
  author: ID-LoRA
supersededBy: null
fixture: false
---

**What it is.** A custom ComfyUI node built on top of LTX 2.3 that takes a reference image and a reference audio clip and uses both to anchor the generated video. The face in the output tracks the reference image, and the voice in the output tracks the reference audio, giving you a stable audio-visual identity across the clip rather than a fresh random one each time.

**What it plugs into.** ComfyUI, running on LTX 2.3 as the underlying video model. You install it as a custom node inside an existing ComfyUI setup.

**Why it helps.** Most video generation workflows treat identity as a happy accident. You generate, you check if the face looks close enough, you generate again. This node makes identity the input, not the outcome. If you are building a series of clips around a character, a spokesperson, or a recurring face, having the reference baked into the node means you are not massaging outputs after the fact. The voice piece is rarer still, since audio-visual consistency from a single reference is something even commercial tools handle poorly.

**How to set it up.** Clone the repository into your ComfyUI custom nodes folder, install the dependencies listed in the repo, and restart ComfyUI. From there you wire in a reference image node and a reference audio node alongside your prompt, and the ID-LoRA node handles the conditioning from both. The project page at id-lora.github.io shows example workflows worth looking at before you build your own.

**Limits.** With 136 stars this is early-community territory, so expect rough edges and gaps in documentation. Clip length is bounded by what LTX 2.3 can produce, which is short. The quality of the identity lock depends heavily on how clean your reference image and audio are. And like anything running LTX 2.3 locally, you will need a capable GPU to get anywhere reasonable on generation time.
