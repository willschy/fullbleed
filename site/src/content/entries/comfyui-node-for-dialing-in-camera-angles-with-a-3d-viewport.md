---
title: ComfyUI node for dialing in camera angles with a 3D viewport
date: 2026-01-08
sourceDate: 2026-01-08
category: plugins-skills
tools:
  - ComfyUI
  - Qwen
  - Three.js
disciplines: ["3D", "Image"]
thumbnail: /thumbs/comfyui-node-for-dialing-in-camera-angles-with-a-3d-viewport-cover.webp
credit: "Lory ♥ / Unsplash"
score: 7
hoverWhat: A custom ComfyUI node that lets you position a camera in a live
  Three.js viewport and spits out the prompt text your multi-angle generation
  needs, so you stop guessing at angle descriptions.
hoverWhy: A custom ComfyUI node that lets you position a camera in a live
  Three.js viewport and spits out the prompt text your multi-angle generation
  needs, so you stop guessing at angle descriptions.
modelVersions: null
source:
  origin: GitHub
  permalink: https://github.com/jtydhr88/ComfyUI-qwenmultiangle
  outboundUrl: https://github.com/jtydhr88/ComfyUI-qwenmultiangle
  author: jtydhr88
supersededBy: null
fixture: false
---

**What it is.** A custom node for ComfyUI, built by jtydhr88, that gives you an interactive 3D viewport powered by Three.js. You move a camera around a scene until the angle looks right, and the node writes out a formatted prompt string describing that position, ready to feed into a multi-angle image generation workflow.

**What it plugs into.** ComfyUI. Install it like any other custom node and it drops into your existing graph. It is designed to work with multi-angle or multi-view image generation models, particularly those that expect angle descriptions baked into the prompt.

**Why it helps.** Writing camera angle prompts by hand is a guessing game. "Slightly elevated, three-quarter view from the left" means something different to you than it does to a model, and iterating blind gets expensive fast. Having a viewport where you can see exactly what angle you are describing, and getting the text output automatically, closes that gap. The angle you set is the angle you prompt for.

**How to set it up.** Clone the repo into your ComfyUI custom nodes folder and restart ComfyUI. The node should appear in your node list. Drop it into a workflow that ends at a multi-view or multi-angle model, connect the prompt string output to your text conditioning input, and use the viewport to set your camera before you queue the generation.

**Limits.** The node outputs prompt text, so it is only as useful as the model on the other end is responsive to angle descriptions. Models that do not take camera language seriously in their conditioning will not give you consistent results regardless of how precise your angle is. The Three.js viewport is also a relatively simple preview, not a full 3D scene editor, so very complex spatial setups may still need manual tuning. Adoption is still early, documentation is thin, and edge cases will likely need some trial and error to work through.
