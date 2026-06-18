---
title: Claude Code skills for automating Higgsfield video and ad pipelines
date: 2026-04-13
sourceDate: 2026-04-13
category: plugins-skills
tools:
  - Claude
  - WAN
disciplines: ["Video"]
thumbnail: /thumbs/claude-code-skills-for-automating-higgsfield-video-and-ad-pi-cover.webp
credit: "Yolk CoWorking - Krakow / Unsplash"
score: 7
hoverWhat: A set of 19 skills that wire Claude Code into Higgsfield AI, letting
  you drive image generation, Seedance 2.0 video, and full UGC ad pipelines from
  a single conversational interface.
hoverWhy: A set of 19 skills that wire Claude Code into Higgsfield AI, letting
  you drive image generation, Seedance 2.0 video, and full UGC ad pipelines from
  a single conversational interface.
modelVersions: null
source:
  origin: GitHub
  permalink: https://github.com/AKCodez/higgsfield-claude-skills
  outboundUrl: https://github.com/AKCodez/higgsfield-claude-skills
  author: AKCodez
supersededBy: null
fixture: false
---

**What it is.** A collection of 19 Claude Code skills built by AKCodez that connect Claude's agentic coding environment to Higgsfield AI. The skills cover image generation, Seedance 2.0 video creation, and end-to-end UGC ad pipelines, with Playwright handling the browser automation underneath.

**What it plugs into.** Claude Code on the AI side, Higgsfield AI for the actual generation work, and Playwright to drive the browser interactions that tie them together. You will need active access to all three.

**Why it helps.** Higgsfield's web interface is capable but manual. Running a UGC ad from brief to finished video normally means clicking through several steps, babysitting outputs, and stitching pieces together yourself. These skills let Claude handle that sequence on your behalf, so you can describe what you want and let it work through the pipeline rather than operating each step by hand.

**How to set it up.** Clone the repo from GitHub, then drop the skill files into your Claude Code skills directory. You will need Playwright installed and a working Higgsfield account. The repo's readme walks through the configuration, including any environment variables for credentials. From there you call the skills by name inside a Claude Code session the same way you would any other skill.

**Limits.** This is a community project with 184 stars at the time of writing, so maintenance depends on one contributor keeping pace with changes to both Claude Code and Higgsfield's interface. Playwright-based automation is brittle by nature and a UI update on Higgsfield's end can break things quietly. There is also no fallback if Higgsfield rate-limits or errors mid-pipeline, so long automated runs carry some risk of partial outputs.
