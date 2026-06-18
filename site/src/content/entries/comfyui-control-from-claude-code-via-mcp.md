---
title: ComfyUI control from Claude Code via MCP
date: 2026-02-15
sourceDate: 2026-02-15
category: plugins-skills
tools:
  - ComfyUI
  - Claude
  - FLUX
disciplines: ["Image"]
thumbnail: /thumbs/comfyui-control-from-claude-code-via-mcp-cover.webp
credit: "Toolmash Expo / Unsplash"
score: 9
hoverWhat: A plugin that connects Claude Code to your ComfyUI instance, so you
  can generate images and video, edit the graph, and manage models all from a
  conversation.
hoverWhy: A plugin that connects Claude Code to your ComfyUI instance, so you
  can generate images and video, edit the graph, and manage models all from a
  conversation.
modelVersions: null
source:
  origin: GitHub
  permalink: https://github.com/artokun/comfyui-mcp
  outboundUrl: https://comfyui-mcp.artokun.io/docs
  author: artokun
supersededBy: null
fixture: false
---

**What it is.** An MCP server and Claude Code plugin by artokun that bridges your Claude session to a running ComfyUI instance. You get 88 tools and 14 pre-built AI skills covering Flux image generation, WAN and LTX video, and Qwen — enough to run a real generation workflow without touching the ComfyUI interface directly.

**What it plugs into.** Claude Code, using the Model Context Protocol. On the other end it talks to a local ComfyUI instance. Flux, WAN, LTX, and Qwen workflows need to already be installed and working in your ComfyUI setup before the plugin can call them.

**Why it helps.** Switching between a chat session and the ComfyUI graph to tweak a prompt, swap a model, or kick off a video generation breaks your thinking. This keeps it in one place. You describe what you want in Claude, the plugin handles the ComfyUI side, and you get results back in the same thread. Live graph editing means you can adjust a running workflow mid-session rather than hunting through nodes manually.

**How to set it up.** Install the MCP server from the repo and point it at your ComfyUI URL. In Claude Code, add it as a plugin following the MCP configuration steps in the docs at comfyui-mcp.artokun.io/docs. From there you can call any of the 88 tools by name or lean on the 14 named skills for common tasks like generating an image with Flux or kicking off an LTX video clip. The docs walk through each skill and its expected inputs.

**Limits.** At 152 stars this is still a young project, so expect rough edges and API changes as it matures. It requires Claude Code specifically — not the web interface or the API directly — so it only helps if that is already in your workflow. Every model the skills reference has to be present and working in your own ComfyUI setup; the plugin does not install them for you. And because it is talking to a local ComfyUI instance, generation speed is still entirely down to your hardware.
