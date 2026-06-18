---
title: "Open Design: local AI prototyping with your own models"
date: 2026-04-28
sourceDate: 2026-04-28
category: tools
tools:
  - Claude
  - Figma
  - Qwen
disciplines: ["Design"]
thumbnail: /thumbs/open-design-local-ai-prototyping-with-your-own-models-cover.webp
credit: "Maciej Karoń / Unsplash"
score: 8
hoverWhat: A free, local desktop app that turns text prompts into web, mobile,
  and slide prototypes using whichever AI coding CLI you already have set up.
hoverWhy: A free, local desktop app that turns text prompts into web, mobile,
  and slide prototypes using whichever AI coding CLI you already have set up.
modelVersions: null
source:
  origin: GitHub
  permalink: https://github.com/nexu-io/open-design
  outboundUrl: https://open-design.ai
  author: nexu-io
supersededBy: null
fixture: false
---

**What it is.** Open Design is an open-source desktop app that generates UI prototypes, slides, images, and documents from prompts. It runs locally on your machine, connects to whichever AI coding CLI you point it at, and renders everything inside a sandboxed preview. You own the output and the process. Export lands in HTML, PDF, PPTX, or MP4 depending on what you made.

**Why it matters.** Claude Design is closed, waitlisted, and tied to Anthropic's infrastructure. Open Design gives you a similar surface, local and free, with your own API keys and your own model choices. For a designer who wants to prototype a dashboard, a deck, or a mobile flow without bouncing between Figma, a coding agent, and a slide tool, having all of that in one sandboxed app is a real time saver. The 142-plus built-in design systems mean you are starting with something that already looks considered rather than raw HTML.

**How to use it.** Install the desktop app and connect one of the supported CLIs, Claude Code and Cursor are the most common starting points, using your own API key. Pick a design system that fits the project, a Material-based system for Android work, something cleaner for a web pitch, and type a prompt describing the screen or slide you want. The sandboxed preview updates as the agent writes the code, so you can catch structural problems early. When the prototype is close, export to HTML if you are handing it to a developer, PPTX if the deck needs to go to a client, or MP4 if you want a quick walkthrough video. Iterate by prompting again inside the same session rather than starting fresh.

**Limits.** The output is generated code, which means complex interactions and animation can come out rough or need cleanup before they are truly presentable. Quality depends heavily on which CLI and model you are running, so a weaker or slower model will show. Being local-first is the point, but it also means you need a capable machine and a working CLI setup before any of this starts. The project is early and community-driven, so expect gaps and breaking changes as it moves fast.
