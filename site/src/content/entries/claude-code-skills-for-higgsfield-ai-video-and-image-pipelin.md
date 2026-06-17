---
title: Claude Code skills for Higgsfield AI video and image pipelines
date: 2026-04-13
sourceDate: 2026-04-13
category: plugins-skills
thumbnail: /thumbs/claude-code-skills-for-higgsfield-ai-video-and-image-pipelin-cover.jpg
credit: "Kirill Sh / Unsplash"
tools:
  - Claude
  - WAN
disciplines: []
score: 7
hoverWhat: A set of 19 Claude Code skills that wire Claude directly into
  Higgsfield AI, so you can generate images, kick off Seedance 2.0 video jobs,
  and run full UGC ad pipelines from a single automated workflow.
hoverWhy: A set of 19 Claude Code skills that wire Claude directly into
  Higgsfield AI, so you can generate images, kick off Seedance 2.0 video jobs,
  and run full UGC ad pipelines from a single automated workflow.
modelVersions: null
source:
  origin: GitHub
  permalink: https://github.com/AKCodez/higgsfield-claude-skills
  outboundUrl: https://github.com/AKCodez/higgsfield-claude-skills
  author: AKCodez
supersededBy: null
fixture: false
---

**What it is.** A collection of 19 skills for Claude Code, built by AKCodez, that connect Claude to Higgsfield AI's platform. Each skill handles a discrete piece of the creative pipeline: image generation, Seedance 2.0 video creation, or assembling UGC-style ad sequences. Playwright handles the browser side, automating the interactions with Higgsfield that you would otherwise do by hand.

**What it plugs into.** Claude Code on one end, Higgsfield AI on the other. Playwright sits in between, driving the Higgsfield web interface so the skills do not depend on an official API. That means it works as long as the Higgsfield UI stays consistent, and breaks when it does not.

**Why it helps.** Running a UGC ad pipeline normally means bouncing between tools, babysitting browser tabs, and manually stitching outputs together. These skills hand that coordination off to Claude, so you describe what you want and the workflow runs. For teams producing volume, cutting that back-and-forth is where the time actually goes.

**How to set it up.** Clone the repo, install the dependencies including Playwright, and add the skills to your Claude Code setup according to the instructions in the README. You will need a Higgsfield account and working credentials. Once the skills are loaded, you can call them from Claude Code the same way you would any other skill, either individually or chained into a longer pipeline.

**Limits.** Because this uses Playwright browser automation rather than a proper API, it is inherently fragile. A Higgsfield UI update can break a skill with no warning. The project has 184 stars but it is a community build with one author, so support and maintenance depend entirely on AKCodez keeping up with changes. It also requires a local environment capable of running Playwright alongside Claude Code, which is a bit of setup overhead before you get anything working.
