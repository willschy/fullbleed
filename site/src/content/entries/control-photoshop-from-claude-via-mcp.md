---
title: Control Photoshop from Claude via MCP
date: 2026-01-26
sourceDate: 2026-01-26
category: plugins-skills
tools:
  - Claude
  - Photoshop
  - MCP
disciplines: ["Image"]
thumbnail: /thumbs/control-photoshop-from-claude-via-mcp-cover.webp
credit: "Luca Nicoletti / Unsplash"
score: 8
hoverWhat: An open-source server that lets Claude drive Photoshop directly, so
  you can describe what you want done and watch it happen in the app.
hoverWhy: An open-source server that lets Claude drive Photoshop directly, so
  you can describe what you want done and watch it happen in the app.
modelVersions: null
source:
  origin: GitHub
  permalink: https://github.com/alisaitteke/photoshop-mcp
  outboundUrl: https://github.com/alisaitteke/photoshop-mcp
  author: alisaitteke
supersededBy: null
fixture: false
---

**What it is.** An open-source MCP server that exposes more than 50 Photoshop actions to any AI assistant that speaks the Model Context Protocol. You tell Claude to resize a layer, swap a color, rename a document, or batch through a folder, and it sends those instructions straight into Photoshop via ExtendScript.

**What it plugs into.** Adobe Photoshop on macOS or Windows, and any MCP-compatible AI client, with Claude being the obvious one. The server is written in TypeScript and runs locally alongside both apps.

**Why it helps.** The gap it closes is between knowing what you want and doing the repetitive work to get there. If you have a folder of product shots that all need the same layer adjustments, or you keep doing the same eight-step prep before you actually start designing, you can describe that sequence once and hand it off. It also means you can stay in Claude mid-conversation, make a decision about a comp, and have Photoshop act on it without switching context.

**How to set it up.** Clone the repo, run the install, then point your MCP client at the local server address. The repo includes configuration examples for Claude Desktop. Photoshop needs to be open and the ExtendScript bridge needs to be running, which on recent versions of Photoshop just means having the app open.

**Limits.** With 102 stars this is early and lightly tested, so expect rough edges. The 50-plus tools cover a lot of ground but complex or deeply nested layer structures may behave unpredictably. It relies on ExtendScript, which Adobe has been moving away from in favor of UXP, so longevity is a real question as Photoshop updates. And anything that requires visual judgment, spotting a bad mask edge or deciding if a grade looks right, is still on you.
