---
title: Claude Code skills for building ComfyUI custom nodes
date: 2026-03-05
sourceDate: 2026-03-05
category: plugins-skills
tools:
  - ComfyUI
  - Claude
  - WAN
disciplines: ["Image"]
thumbnail: /thumbs/claude-code-skills-for-building-comfyui-custom-nodes-cover.webp
credit: "Matt Str / Unsplash"
score: 8
hoverWhat: A set of Claude Code skills that gives the AI enough context about
  ComfyUI's node APIs to actually write useful custom node code, rather than
  hallucinating its way through the framework.
hoverWhy: A set of Claude Code skills that gives the AI enough context about
  ComfyUI's node APIs to actually write useful custom node code, rather than
  hallucinating its way through the framework.
modelVersions: null
source:
  origin: GitHub
  permalink: https://github.com/jtydhr88/comfyui-custom-node-skills
  outboundUrl: https://github.com/jtydhr88/comfyui-custom-node-skills
  author: jtydhr88
supersededBy: null
fixture: false
---

**What it is.** A curated collection of Claude Code skills, maintained by jtydhr88, that loads ComfyUI-specific knowledge into Claude Code before you ask it to write or modify custom nodes. It covers both the current V3 API and the older V1 API, so Claude is working from real framework context rather than generic Python instincts.

**What it plugs into.** Claude Code, Anthropic's agentic coding tool that runs in your terminal. You also need a ComfyUI environment where you are actually developing or modifying custom nodes.

**Why it helps.** ComfyUI's node API has its own conventions, and asking a general-purpose AI to write a custom node from scratch tends to produce code that looks plausible but breaks in practice. Loading these skills narrows Claude's frame of reference to the actual patterns ComfyUI expects, so the output is closer to something that runs on the first or second try. For a designer or motion artist who wants to wire up a custom node without digging through ComfyUI's source code and community examples by hand, that is a real shortcut.

**How to set it up.** Install Claude Code if you have not already, then clone or download this repository. Follow Anthropic's skills documentation to add the skill files to your Claude Code setup. Once loaded, open a terminal in your ComfyUI project directory and ask Claude Code to build or modify a node. The skills give it the framework vocabulary it needs to interpret your request accurately.

**Limits.** This only helps you if you are using Claude Code specifically. It does nothing for ChatGPT, Cursor, or any other coding assistant. The skills reflect the framework as it existed when they were written, so if Anthropic or the ComfyUI project makes significant API changes, the context Claude is working from may fall behind. Complex nodes with unusual dependencies will still need your own judgment and testing.
