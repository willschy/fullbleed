---
title: "Hue: brand-aware design system generation for Claude Code and Codex"
date: 2026-04-12
sourceDate: 2026-04-12
category: plugins-skills
tools:
  - Claude
disciplines: ["Design"]
thumbnail: /thumbs/hue-brand-aware-design-system-generation-for-claude-code-and-cover.webp
credit: "Christina Rumpf / Unsplash"
score: 8
hoverWhat: Feed it your visual identity and Hue produces a full design system,
  so any UI your AI assistant builds comes out on-brand without manual cleanup.
hoverWhy: Feed it your visual identity and Hue produces a full design system, so
  any UI your AI assistant builds comes out on-brand without manual cleanup.
modelVersions: null
source:
  origin: GitHub
  permalink: https://github.com/dominikmartn/hue
  outboundUrl: https://hueapp.io
  author: dominikmartn
supersededBy: null
fixture: false
---

**What it is.** Hue is an open-source skill by dominikmartn that takes a brand's visual identity as input and generates a complete design system from it. The idea is that once it knows your brand, any UI your AI coding assistant produces should already match, rather than starting generic and needing corrections.

**What it plugs into.** Claude Code and OpenAI Codex. Those are the two environments it is built for, so if you are already using either of those for UI work, Hue drops into your existing setup.

**Why it helps.** The chronic problem with AI-generated interfaces is that they come out looking like nobody in particular. You spend time after the fact adjusting colors, type, spacing, and component patterns to match what your brand actually needs. Hue tries to move that correction upstream, baking the brand context in before the assistant writes a single line.

**How to set it up.** Install it from the GitHub repository at github.com/dominikmartn/hue. From there you give it your brand materials, the visual identity information the skill needs to build the system, and it handles the generation. The repository and the companion site at hueapp.io are the right places to check for the current setup steps, since the specifics may shift as the project develops.

**Limits.** With 710 stars and an open-source codebase still finding its shape, expect rough edges. How well it handles complex or unusual brand systems is an open question. It also depends entirely on Claude Code or Codex, so if your workflow runs on other tools, it does not help you. And like any skill that interprets brand identity, the output is only as good as the input you give it.
