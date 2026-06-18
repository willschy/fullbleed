---
title: "ComfyUI-AnimaTool: anime image generation wired up for AI agents"
date: 2026-02-03
sourceDate: 2026-02-03
category: plugins-skills
tools:
  - ComfyUI
  - Claude
  - MCP
disciplines: ["Image"]
thumbnail: /thumbs/comfyui-animatool-anime-image-generation-wired-up-for-ai-age-cover.webp
credit: "Pablo Gentile / Unsplash"
score: 7
hoverWhat: A ComfyUI custom node that exposes Anima's anime and illustration
  generation as an API, so your AI coding agents can call it directly instead of
  you doing it by hand.
hoverWhy: A ComfyUI custom node that exposes Anima's anime and illustration
  generation as an API, so your AI coding agents can call it directly instead of
  you doing it by hand.
modelVersions: null
source:
  origin: GitHub
  permalink: https://github.com/Moeblack/ComfyUI-AnimaTool
  outboundUrl: https://github.com/Moeblack/ComfyUI-AnimaTool
  author: Moeblack
supersededBy: null
fixture: false
---

**What it is.** A custom node for ComfyUI, by Moeblack, that wraps Anima's anime and illustration image generation in a proper API surface. It gives you three ways in: an MCP Server, an HTTP API, and a CLI, so the generation step can be driven programmatically rather than through the ComfyUI interface.

**What it plugs into.** ComfyUI is the host, and Anima is the underlying model doing the anime and illustration work. The MCP Server interface is the piece that lets AI coding agents, like Claude via the Model Context Protocol, call image generation as a tool during their own workflows.

**Why it helps.** If you are building agent-driven pipelines, the usual gap is that image generation sits behind a UI and has to be triggered by a human. AnimaTool closes that gap for anime-style work. An agent can now request a generated illustration mid-task, get the result back, and keep going, without you stepping in to run a workflow manually.

**How to set it up.** Install it as a custom node through ComfyUI Manager or by cloning the repo into your custom_nodes folder. From there you pick which interface fits your setup: point an MCP-compatible agent at the MCP Server, call the HTTP API from whatever script or automation you are building, or use the CLI for quick command-line access. The repo is the place to check for the exact startup flags and config options, since those details tend to shift as the project develops.

**Limits.** This is tightly scoped to anime and illustration generation through Anima, so it is the wrong tool if you need photorealistic or general-purpose output. With 109 stars it is a young project, which means the API surface may change and documentation is thin. It also inherits whatever hardware Anima needs to run, so a capable GPU is not optional.
