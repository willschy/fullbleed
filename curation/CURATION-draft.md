# FULL BLEED — Curation Brief

## The Mission

Full Bleed is the sharpest filter for new AI that visual and design creatives actually use. It covers design/UI, 3D, typography, branding, illustration, and image — delivered as finished tools, agent skills/MCPs, models, or papers worth reading. Format is irrelevant; usefulness to someone making something visual is everything.

---

## What's IN

**Disciplines we cover:**
- Design & UI (layout, systems, handoff, components, color, typography)
- Branding (identity, logotype, competitive audit, brand language)
- Illustration & Image (generation, editing, style transfer, relighting, compositing)
- 3D (mesh, texture, rigging, garments, avatars — real-time or otherwise)
- Typography (classification, hierarchy, legibility, emotion — if it treats type as a design problem)
- Motion — only when it's a design tool (keyframe animation for AE, loop tools for motion graphics); not raw video generation pipelines

**The test:** Could a working visual creative — designer, art director, illustrator, 3D artist — open this today and make something better, faster, or previously impossible? If yes, keep reading. If the answer requires three layers of inference, kill it.

**Forms we accept:**
- **Tools** — shipped product, SaaS, desktop app, plugin
- **Models** — weights or APIs, but scoped to a specific visual task (portrait relighting, texture synthesis, mesh generation — not "general vision model")
- **Plugins & Skills** — Claude/Cursor/Codex skills, MCP servers, Figma plugins, ComfyUI integrations with real design-side utility
- **Papers** — only when the finding is specific enough to matter (typography legibility, aesthetic consistency benchmarks, garment simulation) — not architecture surveys
- **Automations** — only when the output is a designed artifact, not a data pipeline

---

## What's OUT

| Category | Why it's cut |
|---|---|
| Audio & music — all of it | Wrong audience, full stop |
| Copywriting tools | Full Bleed is visual; text-as-content is not the same as type-as-design |
| Video — almost all | Only keep when the tool is clearly for a visual/design workflow (batch recomposition, storyboarding for directors); kill raw generation models, frame-coherence papers, ffmpeg wrappers |
| Low-level ML plumbing | Noise schedulers, INT8 loaders, resolution nodes, frame-coherence techniques — these are infrastructure, not creative tools |
| General foundation models | A 7B omnimodal LLM, a general image-edit model, a multimodal reasoning architecture — the creative use case is buried three steps down |
| Generic workflow automations | Airtable blueprints, Make.com templates, content calendars — these are ops, not design |
| Pure dev scaffolding | LoRA dataset generators, quantization tools, training pipelines — serves ML engineers, not creatives |
| Benchmarks for benchmarks' sake | Evaluation papers with no actionable creative output or insight (video editing benchmarks, VLM routing papers) |

---

## Keep / Kill Heuristics

**KEEP if:**
- The model does one specific visual job: relighting a portrait, generating tileable textures, rigging a character, classifying a font — specificity is signal
- It's a design tool that happens to use AI, not an AI experiment that might someday help designers
- The ComfyUI/Claude/Figma integration exposes a creative capability that didn't exist before (full ComfyUI MCP with 88 tools: keep; single noise-scheduling node: kill)
- The paper treats a real design problem — type hierarchy, aesthetic consistency, typographic emotion — not a model architecture problem dressed up in creative language
- Motion tools are clearly post-production/design-side (After Effects keyframes, seamless loop generation for motion graphics)
- Video tool is about a visual editor's actual problem: batch reframing, storyboarding, color grading workflow — not generation throughput

**KILL if:**
- It's a general foundation model (image, video, multimodal) without a specific creative use case in the artifact itself
- It's audio/music in any form — no exceptions
- The "design relevance" is in the repo description but not the tool (e.g. "great for designers!" on a LoRA dataset pipeline)
- It's a ComfyUI node for audio, TTS, ASR, or video-only workflows
- The paper is about making diffusion faster, more consistent, or more efficient — infrastructure, not insight
- It's a Zapier/Make/Airtable automation where the output is a spreadsheet or a notification, not a visual artifact
- The only creative angle is "you could use this to make images" — that describes every LLM on Hugging Face
- It's an open-source vector tool or pixel-grid snapper with no AI component doing real creative work
- The Show HN is a CLI wrapper with a design-flavored name

---

## Tagging Requirements

Every entry needs:
- **Type:** Tools / Models / Plugins & Skills / Papers / Automations
- **Discipline:** Design/UI · Branding · Illustration · Image · 3D · Typography · Motion · Photography
- **Source freshness:** Published or updated within ~6 months of curation date
- **Language:** English (titles, docs, or README sufficient)
- **Artifact check:** There must be something real — weights, a live URL, a GitHub repo with actual code, a published paper. Announcements and waitlists do not qualify.