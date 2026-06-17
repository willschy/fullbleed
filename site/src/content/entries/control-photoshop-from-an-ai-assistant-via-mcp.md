---
title: Control Photoshop from an AI assistant via MCP
date: 2026-01-26
sourceDate: 2026-01-26
category: plugins-skills
thumbnail: /thumbs/control-photoshop-from-an-ai-assistant-via-mcp-cover.webp
credit: "Luca Nicoletti / Unsplash"
tools:
  - Claude
  - Photoshop
  - MCP
disciplines: ["Image"]
score: 7
hoverWhat: An open-source MCP server that lets Claude and other AI assistants
  drive Photoshop directly, so you can describe what you want and watch the
  layers move.
hoverWhy: An open-source MCP server that lets Claude and other AI assistants
  drive Photoshop directly, so you can describe what you want and watch the
  layers move.
modelVersions: null
source:
  origin: GitHub
  permalink: https://github.com/alisaitteke/photoshop-mcp
  outboundUrl: https://github.com/alisaitteke/photoshop-mcp
  author: alisaitteke
supersededBy: null
fixture: false
---

**What it is.** An open-source MCP server, built by alisaitteke, that exposes over 50 Photoshop actions to any AI assistant that speaks the Model Context Protocol. Under the hood it runs ExtendScript, the same scripting engine Photoshop has always had, but surfaced through a layer that Claude or another MCP-compatible assistant can call directly.

**What it plugs into.** Adobe Photoshop on macOS or Windows, and any AI assistant that supports MCP, with Claude being the obvious pairing. You run the server locally alongside Photoshop, and the assistant talks to it.

**Why it helps.** The pitch is that you describe an edit in plain language and the assistant executes it in the actual application, layers, masks, adjustments and all, rather than generating a flattened image from scratch. For repetitive work, batch renaming layers, applying the same adjustment across a set of files, building out a document structure, that kind of thing is where this starts to feel genuinely useful rather than just interesting.

**How to set it up.** Clone the repo, install the Node dependencies, and point your MCP-compatible assistant at the server. The repo is TypeScript, so you will need Node on your machine. From there you configure your assistant to connect to the local server, open Photoshop, and start giving instructions. The GitHub readme walks through the connection steps.

**Limits.** With 102 stars at the time of writing, this is early and lightly tested in production. The quality of what the assistant can do is bounded by how well ExtendScript can express it, and complex compositing work will bump into those limits quickly. It also requires Photoshop to already be open and running, so it is a co-pilot setup, not a headless pipeline. Windows support is listed but the project feels Mac-first in practice, and there is no guarantee of stability across Photoshop versions.
