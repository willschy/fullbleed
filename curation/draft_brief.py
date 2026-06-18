#!/usr/bin/env python3
"""Draft a new curation brief from Will's confirmed POV + his actual keep/kill votes.
Writes curation/CURATION-draft.md for review."""
import os, json, urllib.request
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def env(k):
    v = os.environ.get(k)
    if v: return v
    p = os.path.join(ROOT, ".env")
    if os.path.exists(p):
        for line in open(p):
            if line.startswith(k + "="): return line.split("=", 1)[1].strip()
    return None

L = json.load(open(os.path.join(ROOT, "curation/labels.json")))
def fmt(items):
    return "\n".join(f'- [{c["source"]}|{c["category"]}|{c.get("discipline") or "?"}] {c["title"][:90]}' for c in items)

PROMPT = f"""You are writing the curation brief for FULL BLEED, a curated catalog of new AI work for
working creatives. This brief is the rubric an LLM taste-judge uses to score candidates keep/kill.

The curator (Will) just revealed his taste by voting on ~75 candidates. His CONFIRMED editorial POV:
**Full Bleed is the best new AI for VISUAL & DESIGN creatives — design/UI, 3D, typography, branding,
illustration, image — delivered in ANY form (a finished tool, an agent skill/MCP, a model, or a
genuinely interesting paper).** OUT: audio/music and copywriting entirely; video only when truly
exceptional; low-level dev/ML plumbing (ComfyUI single-nodes, ffmpeg wrappers, noise-scheduling /
frame-coherence papers); and generic workflow automations (Zapier/Make/Airtable blueprints).

Evidence — things he KEPT:
{fmt(L["keeps"])}

Things he KILLED:
{fmt(L["kills"])}

Write the new brief as clean markdown. Be specific, ruthless, and ANTI-CORNY (no hype words, no
"empowerment", no AI-tells). Include:
1. The mission in 2-3 sentences (visual/design-first; format-agnostic).
2. **What's IN** — the disciplines + the "is this genuinely useful/interesting to a visual creative" test.
3. **What's OUT** — the hard cuts above, stated plainly with the reasoning.
4. **Keep/kill heuristics** — a tight list of concrete rules a judge can apply, grounded in the votes
   (e.g. "a specific, applicable model (texture, relighting, mesh) can keep; a general foundation model
   or an audio/video model kills"). Show how to tell creative-relevant from infrastructure.
5. Keep the existing structure notes: still tag a Type (Tools/Automations/Models/Plugins & Skills/Papers)
   and a Discipline; freshness ≤ ~6 months; must be English and show a real artifact.

Aim for ~60-90 lines. Lead with the POV, not the categories."""

key = env("ANTHROPIC_API_KEY")
body = json.dumps({"model": "claude-sonnet-4-6", "max_tokens": 3000,
                   "messages": [{"role": "user", "content": PROMPT}]}).encode()
req = urllib.request.Request("https://api.anthropic.com/v1/messages", data=body,
    headers={"x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json"})
txt = json.load(urllib.request.urlopen(req, timeout=120))["content"][0]["text"]
open(os.path.join(ROOT, "curation/CURATION-draft.md"), "w").write(txt)
print("wrote curation/CURATION-draft.md (", len(txt), "chars )")
