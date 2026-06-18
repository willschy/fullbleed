---
title: "Hallmark: a design skill that keeps AI-generated UI from looking like
  AI-generated UI"
date: 2026-04-27
sourceDate: 2026-04-27
category: plugins-skills
tools:
  - Claude
disciplines: ["Design"]
thumbnail: /thumbs/hallmark-a-design-skill-that-keeps-ai-generated-ui-from-look-cover.webp
credit: "Geoffrey Crofte / Unsplash"
score: 8
hoverWhat: A rules file you drop into Claude Code, Cursor, or Codex that steers
  the model away from the visual clichés that make AI-built interfaces look
  generic.
hoverWhy: A rules file you drop into Claude Code, Cursor, or Codex that steers
  the model away from the visual clichés that make AI-built interfaces look
  generic.
modelVersions: null
source:
  origin: GitHub
  permalink: https://github.com/Nutlope/hallmark
  outboundUrl: https://www.usehallmark.com/
  author: Nutlope
supersededBy: null
fixture: false
---

**What it is.** Hallmark is an open design skill from Nutlope, sitting at over 3,000 GitHub stars. It is a set of design standards you give to an AI coding tool so it stops producing the rounded-card, gradient-button, hero-section sameness that has come to signal "vibe-coded." The standards live in a file the model reads as a constraint, not a suggestion.

**What it plugs into.** Claude Code, Cursor, and OpenAI Codex. If you are already using one of those to build or prototype UI, Hallmark slots into the same workflow.

**Why it helps.** AI coding tools default to whatever UI patterns are most common in their training data, which turns out to be a narrow range of templates that all look related. Hallmark gives the model explicit rules to work against that gravity, so the output starts from a better visual baseline. For a designer who is using AI to rough out a product or prototype quickly, it means less cleanup time spent undoing bad defaults.

**How to set it up.** Pull the repo from GitHub or visit usehallmark.com, then follow the instructions to add the Hallmark rules file to your project. In Cursor it goes into your rules configuration. In Claude Code and Codex the process is similar. The repo walks through each tool specifically.

**Limits.** Hallmark shapes the model's defaults, but it does not guarantee good taste. A model can follow rules and still make choices you would revise. It also only covers the tools it was built for, so if your workflow runs through something else it will not help. And like any rules file, it will need updating as the tools it targets change their behavior.
