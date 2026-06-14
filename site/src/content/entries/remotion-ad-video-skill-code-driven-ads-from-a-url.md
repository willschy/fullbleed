---
title: "Remotion ad video skill: code-driven ads from a URL"
date: 2026-05-19
sourceDate: 2026-05-19
category: plugins-skills
thumbnail: /thumbs/remotion-ad-video-skill-code-driven-ads-from-a-url.png
tools:
  - Claude
  - Remotion
disciplines: []
score: 7
hoverWhat: Point an AI coding agent at a product URL and get a working Remotion
  project back, no video-generation model in the loop.
hoverWhy: Point an AI coding agent at a product URL and get a working Remotion
  project back, no video-generation model in the loop.
modelVersions: null
source:
  origin: GitHub
  permalink: https://github.com/leosssvip-dot/remotion-ad-video-skill
  outboundUrl: https://github.com/leosssvip-dot/remotion-ad-video-skill
  author: leosssvip-dot
supersededBy: null
fixture: false
---

**What it is.** A skill for AI coding agents that takes a product URL and scaffolds a full Remotion video project around it. The agent reads the page, pulls what it needs, and writes the code to produce an animated ad, using Remotion's React-based renderer rather than any diffusion or video-generation model.

**What it plugs into.** Remotion, the library that lets you build videos in React and render them to MP4. The skill is designed to run through an AI coding agent, so you wire it into whatever agentic setup you are already using, something like Claude, Cursor, or a similar tool that can write and execute code on your behalf.

**Why it helps.** Building a Remotion ad from scratch means writing a fair amount of boilerplate React before you get to anything visual. This skill offloads that scaffolding to the agent, so you start with a working project rather than a blank file. Because it works from a URL, the agent can pull product details directly from a live page and fold them into the composition, which cuts down the copy-paste work considerably.

**How to set it up.** Clone the repo and connect it to your coding agent as a skill or tool. Point the agent at a product URL and let it run. The output is a Remotion project directory you can open, tweak, and render. From there it is standard Remotion workflow: edit the components, adjust timing, render with the Remotion CLI.

**Limits.** With only 92 stars and a thin README, this is early and lightly documented, so expect to do some spelunking to get it working with your specific agent setup. The output quality depends on what the agent makes of the source page, so unusual page structures or heavy JavaScript-rendered content may trip it up. And because this is code-generated animation rather than footage, what you get looks like motion graphics, which is the right tool for some ads and the wrong one for others.
