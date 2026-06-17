---
title: ComfyUI node for multi-subject reference with LTX 2.3
date: 2026-05-31
sourceDate: 2026-05-31
category: plugins-skills
tools:
  - ComfyUI
  - LoRA
disciplines: []
thumbnail: /thumbs/comfyui-node-for-multi-subject-reference-with-ltx-2-3-cover.webp
credit: "Fernando Rodrigues / Unsplash"
score: 7
hoverWhat: A custom ComfyUI node that wires LTX 2.3's multi-subject LoRA system
  into your existing workflow, so you can anchor a video generation to several
  specific references at once.
hoverWhy: A custom ComfyUI node that wires LTX 2.3's multi-subject LoRA system
  into your existing workflow, so you can anchor a video generation to several
  specific references at once.
modelVersions: null
source:
  origin: GitHub
  permalink: https://github.com/liconstudio/ComfyUI-Licon-MSR
  outboundUrl: https://github.com/liconstudio/ComfyUI-Licon-MSR
  author: liconstudio
supersededBy: null
fixture: false
---

**What it is.** A custom node for ComfyUI from liconstudio that handles the Multiple-Subject-Reference LoRA workflow built into LTX 2.3. The idea is that you bring in more than one subject reference and the model keeps them distinct across the generated video, rather than blending or dropping one when things get complicated.

**What it plugs into.** ComfyUI, running LTX 2.3. You also need the MSR LoRA weights that go with that model version. If you are already running LTX 2.3 locally, this slots in as a custom node install.

**Why it helps.** Keeping multiple specific subjects consistent through a generated video is one of the harder problems in open video work right now. Most setups let you anchor to one reference reasonably well. When you need two characters, or a character and a product, or any situation where identity has to hold for more than one thing at once, the default tooling tends to fall apart. This node gives that workflow a dedicated interface inside ComfyUI rather than leaving you to wire it together yourself.

**How to set it up.** Clone the repo into your ComfyUI custom_nodes folder, restart ComfyUI, and the MSR nodes will appear in the node browser. From there you load your subject reference images, attach the MSR LoRA, and connect everything into your existing LTX 2.3 generation chain. The repo README walks through the specific node connections.

**Limits.** This only works with LTX 2.3 and its MSR LoRA, so it is not a general multi-subject solution you can drop onto other models. The project is young, with around 177 stars at the time of writing, which means documentation is still thin and rough edges are likely. Multi-subject consistency in open video models is genuinely hard, and this node gives you the tooling to attempt it, not a guarantee that the results will hold up.
