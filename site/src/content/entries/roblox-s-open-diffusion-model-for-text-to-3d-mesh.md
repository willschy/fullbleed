---
title: Roblox's open diffusion model for text-to-3D mesh
date: 2026-05-27
sourceDate: 2026-05-27
category: models
tools:
  - WAN
disciplines: ["3D"]
thumbnail: /thumbs/roblox-s-open-diffusion-model-for-text-to-3d-mesh-cover.webp
credit: "Yunus Alexander / Unsplash"
score: 7
hoverWhat: Roblox released open weights for a diffusion model that turns text
  into 3D meshes, which puts game-ready asset generation in reach for anyone
  with the hardware to run it.
hoverWhy: Roblox released open weights for a diffusion model that turns text
  into 3D meshes, which puts game-ready asset generation in reach for anyone
  with the hardware to run it.
modelVersions: null
source:
  origin: Hugging Face
  permalink: https://huggingface.co/Roblox/cubepart
  outboundUrl: https://huggingface.co/Roblox/cubepart
  author: Roblox
supersededBy: null
fixture: false
---

**What it is.** CubePart is an open-weights diffusion model from Roblox that generates 3D meshes from text prompts. It ships under an OpenRAIL license and comes with an accompanying arXiv paper (2605.28763) that explains the approach.

**Why it matters.** Getting from a text description to a usable 3D mesh has typically meant either a paid API or stitching together several unreliable tools. A named, documented model with open weights gives artists and technical directors something they can actually inspect, fine-tune, and run on their own infrastructure.

**What it improved on.** Most text-to-3D work in the open-source space has leaned on point clouds or NeRF-style representations that need extra conversion steps before a mesh is usable in a real pipeline. CubePart targets mesh output directly, which is closer to what game engines and DCC tools actually want.

**Strengths.** Open weights mean you own the inference and can fine-tune on your own asset library. The OpenRAIL license is permissive enough for most commercial work. The arxiv paper gives you a real explanation of the architecture rather than a marketing one-pager. And the Roblox provenance suggests the outputs were shaped around practical, game-ready geometry rather than research demos.

**Weaknesses.** The model is very new and has attracted little community attention so far, which means thin documentation, few community workflows, and unknown rough edges. Output quality and polygon counts at this stage are unclear from the public release alone. It will want a capable GPU, and how well the meshes hold up for high-fidelity work outside a game-asset context is an open question.
