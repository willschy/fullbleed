---
title: Claude Code skills for building ComfyUI custom nodes
date: 2026-03-05
sourceDate: 2026-03-05
category: plugins-skills
thumbnail: /thumbs/claude-code-skills-for-building-comfyui-custom-nodes.png
tools:
  - ComfyUI
  - Claude
  - WAN
disciplines: []
score: 8
hoverWhat: A set of skills that loads Claude Code with working knowledge of
  ComfyUI's node APIs, so you can describe the node you want and get code that
  actually fits the system.
hoverWhy: A set of skills that loads Claude Code with working knowledge of
  ComfyUI's node APIs, so you can describe the node you want and get code that
  actually fits the system.
modelVersions: null
source:
  origin: GitHub
  permalink: https://github.com/jtydhr88/comfyui-custom-node-skills
  outboundUrl: https://github.com/jtydhr88/comfyui-custom-node-skills
  author: jtydhr88
supersededBy: null
fixture: false
---

**What it is.** A curated set of Claude Code skills, maintained by jtydhr88, that covers the ComfyUI custom node system. The skills teach Claude the V3 API (the current recommended path) and the older V1 API, so it has real structural knowledge of how nodes are built rather than guessing from generic Python context.

**What it plugs into.** Claude Code, Anthropic's agentic coding tool, paired with a ComfyUI development setup. You install the skills into Claude Code, and from there you work in whatever editor or terminal you use for node development.

**Why it helps.** Writing a ComfyUI custom node from scratch means learning a specific conventions-heavy system: how inputs and outputs are typed, how the node registers itself, how the execution graph expects things to be wired. Without that context, Claude writes plausible-looking Python that breaks in ComfyUI-specific ways. With these skills loaded, it understands the structure it is writing into, which means fewer rounds of debugging things that have nothing to do with your actual idea.

**How to set it up.** Pull the repo from GitHub and follow Anthropic's skills installation process for Claude Code. The repo covers both API versions, so if you are starting fresh you point Claude at the V3 material; if you are working with older nodes that predate V3, the V1 coverage is there. Once the skills are in place, you describe the node you want and iterate from there in conversation.

**Limits.** Claude Code skills work best as a starting point and a reference, not a fully autonomous builder. Complex nodes with unusual data types or tight performance requirements will still need you to understand what the generated code is doing. The skills reflect the node API as documented, so anything undocumented or very recently changed in ComfyUI may not be covered. And you still need a working ComfyUI dev environment to test what comes out.
