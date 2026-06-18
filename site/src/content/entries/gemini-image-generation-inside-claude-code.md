---
title: Gemini image generation inside Claude Code
date: 2026-03-13
sourceDate: 2026-03-13
category: plugins-skills
tools:
  - Claude
  - WAN
disciplines: ["Image"]
thumbnail: /thumbs/gemini-image-generation-inside-claude-code-cover.webp
credit: "Sean Sinclair / Unsplash"
score: 7
hoverWhat: A Claude Code skill that routes image generation through Gemini, so
  you can prompt, generate, and iterate on visuals without switching out of your
  coding environment.
hoverWhy: A Claude Code skill that routes image generation through Gemini, so
  you can prompt, generate, and iterate on visuals without switching out of your
  coding environment.
modelVersions: null
source:
  origin: GitHub
  permalink: https://github.com/AgriciDaniel/banana-claude
  outboundUrl: https://agricidaniel.com/blog/banana-claude-ai-image-generation
  author: AgriciDaniel
supersededBy: null
fixture: false
---

**What it is.** A Claude Code skill called banana-claude that wraps Gemini's image generation behind a Creative Director interface. You describe what you want, and the skill handles the Gemini API call and returns the result inside Claude Code, where you can keep refining it alongside your project.

**What it plugs into.** Claude Code, Anthropic's terminal-based coding agent. The skill rides on top of that environment and calls out to Gemini for the actual image generation, so you need active access to both.

**Why it helps.** The usual rhythm for a developer or creative who needs a quick visual is to break context: open a separate tool, generate, export, come back. This keeps that loop inside the editor. If you are already using Claude Code to build something and need to generate or iterate on images as part of that work, the round-trip is shorter.

**How to set it up.** Grab the repo from GitHub at the link above. You will need Claude Code installed and a Gemini API key configured. The repo's documentation covers wiring the skill into your Claude Code setup, which follows the standard skill installation pattern. The author also has a writeup on their blog that walks through what the Creative Director layer does and how prompting works in practice.

**Limits.** This is a community skill, so it carries the usual caveats of depending on one developer's maintenance. Output quality is tied to whatever Gemini's image model produces on a given call, and the Creative Director framing does not change the underlying model's constraints around style, accuracy, or content. It is also genuinely only useful if Claude Code is already part of your workflow, and you will need to keep your Gemini API credentials in order.
