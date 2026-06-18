---
title: Agent skills that give AI coding tools a design process
date: 2026-03-28
sourceDate: 2026-03-28
category: plugins-skills
tools:
  - Claude
  - WAN
disciplines: ["Design"]
thumbnail: /thumbs/agent-skills-that-give-ai-coding-tools-a-design-process-cover.webp
credit: "Daniel McCullough / Unsplash"
score: 7
hoverWhat: A set of skills for Claude and similar agents that wire in a
  structured design process, so the AI follows a deliberate path instead of
  throwing output at the wall.
hoverWhy: A set of skills for Claude and similar agents that wire in a
  structured design process, so the AI follows a deliberate path instead of
  throwing output at the wall.
modelVersions: null
source:
  origin: GitHub
  permalink: https://github.com/julianoczkowski/designer-skills
  outboundUrl: https://github.com/julianoczkowski/designer-skills
  author: julianoczkowski
supersededBy: null
fixture: false
---

**What it is.** A GitHub collection of agent skills by Julian Oczkowski, built for designers who use AI coding tools to prototype and build. Each skill encodes a step or pattern from the design process so the agent follows a structured path rather than guessing at what a designer would actually want.

**What it plugs into.** AI coding agents that support custom skills or instructions, with the obvious fit being Claude-based tools like Claude Code or similar setups where you can load in skill files to shape how the agent works.

**Why it helps.** When you use an AI coding agent without any guardrails, it optimizes for getting code running, not for getting the design right. These skills push the agent to work the way a designer would, thinking through the problem before reaching for a solution. The result is a prototype that reflects actual design thinking rather than whatever the model decided seemed reasonable.

**How to set it up.** Pull the repo from GitHub and follow the setup instructions in the readme. From there, you load the relevant skill files into your agent environment. Which skills you reach for will depend on the kind of work you are doing, so it is worth reading through what is in the collection before dropping everything in at once.

**Limits.** The collection has under 300 stars, so it is still early and the skills may not cover every kind of design work you do. How well they perform depends heavily on how the underlying agent handles custom instructions, and some tuning to fit your own process is probably unavoidable.
