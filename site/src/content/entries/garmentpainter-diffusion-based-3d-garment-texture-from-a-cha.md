---
title: "GarmentPainter: diffusion-based 3D garment texture from a character photo"
date: 2026-03-09
sourceDate: 2026-03-09
category: papers
tools:
  - WAN
disciplines: ["3D", "Image"]
thumbnail: /thumbs/garmentpainter-diffusion-based-3d-garment-texture-from-a-cha-cover.webp
credit: "Nadir sYzYgY / Unsplash"
score: 7
hoverWhat: A research framework that paints UV-space garment textures guided by
  a character reference image, keeping the result consistent across the full 3D
  surface without needing the reference to line up with the mesh.
hoverWhy: A research framework that paints UV-space garment textures guided by a
  character reference image, keeping the result consistent across the full 3D
  surface without needing the reference to line up with the mesh.
modelVersions: null
source:
  origin: arXiv
  permalink: https://arxiv.org/abs/2603.08228v1
  outboundUrl: https://arxiv.org/abs/2603.08228v1
  author: Jinbo Wu et al.
supersededBy: null
fixture: false
---

**What it is.** GarmentPainter is a diffusion model framework that generates textures for 3D garments by working in UV space rather than on rendered 2D views. You feed it a UV position map, which encodes the garment's 3D structure, and a character reference image showing the look you want. The model synthesizes a texture that holds together across the whole garment surface, and it can target specific components like a collar or sleeve through a type selection module, all without requiring the reference photo to be spatially aligned to the mesh.

**Why it matters.** Texturing 3D garments is one of those tasks that sounds solved but keeps biting people. Approaches built on 2D diffusion often fall apart when you rotate the model and the seams don't match. Methods that do maintain 3D consistency typically need either expensive per-asset optimization or careful, tedious alignment between a reference image and the mesh geometry. GarmentPainter sidesteps both problems, which matters if you are working on character pipelines, virtual try-on, or any game or film asset work where you need credible cloth textures at volume.

**What is new here.** The core contribution is using the UV position map as structural guidance fed directly into the diffusion model alongside the character reference, keeping everything in a spatially aligned input without touching the underlying UNet architecture. That design choice is what lets the framework skip mesh-to-image alignment entirely. The type selection module on top of that gives you part-level control, so you can drive the sleeve texture from one reference detail and the body from another, which is more granular than most texture synthesis approaches offer at this stage.
