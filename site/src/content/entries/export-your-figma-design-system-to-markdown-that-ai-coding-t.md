---
title: Export your Figma design system to markdown that AI coding tools can
  actually read
date: 2026-03-09
sourceDate: 2026-03-09
category: plugins-skills
tools:
  - Claude
  - Figma
disciplines: ["Design"]
thumbnail: /thumbs/export-your-figma-design-system-to-markdown-that-ai-coding-t-cover.webp
credit: "Mike Tinnion / Unsplash"
score: 8
hoverWhat: A Figma plugin that pulls your local styles and variables out of a
  file and writes them into DESIGN.md and SKILL.md, so Claude Code, Cursor, or
  Codex can reference your real design system when it generates UI.
hoverWhy: A Figma plugin that pulls your local styles and variables out of a
  file and writes them into DESIGN.md and SKILL.md, so Claude Code, Cursor, or
  Codex can reference your real design system when it generates UI.
modelVersions: null
source:
  origin: GitHub
  permalink: https://github.com/bergside/design-md-figma
  outboundUrl: https://www.figma.com/community/plugin/1612814320994608244/design-md-skills
  author: bergside
supersededBy: null
fixture: false
---

**What it is.** A Figma plugin from bergside that reads the local styles and variables already defined in your Figma file — colors, type, spacing, whatever you have set up — and exports them as two plain markdown files: DESIGN.md and SKILL.md. Those files are written to sit alongside your code, where AI coding tools can pick them up as context.

**What it plugs into.** Figma on the source side, and on the output side it is aimed at agentic coding tools: Claude Code, OpenAI Codex, Cursor, and anything else that reads project files for context before generating code.

**Why it helps.** When you ask an AI coding tool to build a component, it is guessing at your color names, your type scale, your spacing tokens unless you tell it otherwise. Dropping a DESIGN.md in the repo gives it something real to work from. The tokens it pulls are the ones you actually defined in Figma, so there is a direct line from your design system to what the model generates, rather than a model approximating something generic.

**How to set it up.** Install the plugin from the Figma Community page. Open the Figma file that holds your design system, run the plugin, and it reads your local styles and variables. It writes out DESIGN.md and SKILL.md, which you then drop into the root of your project repository. From there, tools like Cursor or Claude Code will pick them up when they scan project context. If your design system lives in a separate library file, run the plugin from there rather than a component file.

**Limits.** The export is only as good as what you have defined in Figma. If your local styles are a mess or your variables are incomplete, the output reflects that. It also only reads local styles and variables, so anything living in external libraries that you have not surfaced locally will not make it into the files. The plugin has modest traction at 113 stars, so support and updates may move slowly.
