---
title: ComfyUI control from inside Claude Code
date: 2026-02-15
sourceDate: 2026-02-15
category: plugins-skills
thumbnail: /thumbs/comfyui-control-from-inside-claude-code-cover.webp
credit: "Dennis Brekke / Unsplash"
tools:
  - ComfyUI
  - Claude
  - FLUX
disciplines: ["Image"]
score: 8
hoverWhat: An MCP server that connects Claude Code directly to ComfyUI, so you
  can generate images and video, edit your graph, and manage models without
  leaving your terminal session.
hoverWhy: An MCP server that connects Claude Code directly to ComfyUI, so you
  can generate images and video, edit your graph, and manage models without
  leaving your terminal session.
modelVersions: null
source:
  origin: GitHub
  permalink: https://github.com/artokun/comfyui-mcp
  outboundUrl: https://comfyui-mcp.artokun.io/docs
  author: artokun
supersededBy: null
fixture: false
---

**What it is.** A Claude Code plugin and MCP server built by artokun that wires Claude Code into a running ComfyUI instance. From inside your Claude session you get 88 tools and 14 pre-built AI skills covering Flux image generation, WAN and LTX video, and Qwen — plus live graph editing and model management, all without touching the ComfyUI browser UI.

**What it plugs into.** Claude Code on one end, ComfyUI on the other. You need both running. The skills cover Flux, WAN video, LTX video, and Qwen, so whatever pipelines you already have set up in ComfyUI for those models become reachable from Claude.

**Why it helps.** If you are already living in a terminal or working with Claude Code as part of a larger creative or code workflow, bouncing over to the ComfyUI browser to tweak a node or kick off a generation breaks your rhythm. This keeps the whole loop in one place. You describe what you want, adjust the graph, and trigger runs through Claude, which is useful when you are iterating quickly or scripting multi-step generation tasks.

**How to set it up.** Install the extension into ComfyUI via the custom nodes route, then point the MCP server config in Claude Code at your running ComfyUI instance. The project docs at comfyui-mcp.artokun.io walk through the connection step by step. You will want ComfyUI already working with whichever models you plan to use before you start, because the plugin drives what is already there rather than replacing your setup.

**Limits.** It is an early community project with 152 stars, so expect rough edges and occasional breakage when ComfyUI or Claude Code updates. The 14 skills cover specific models and workflows, so if your pipeline uses something outside that list you will be managing it manually. You also need a machine capable of running ComfyUI itself at a reasonable speed, since the plugin does nothing to lighten the generation workload.
