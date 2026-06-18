#!/usr/bin/env python3
"""Generate 60 realistic-but-FAKE catalog candidates spanning the whole taste space,
so Will's A/B votes reveal his curation taste cleanly. Saves curation/synthetic.json."""
import os, re, json, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def env(k):
    v = os.environ.get(k)
    if v: return v
    p = os.path.join(ROOT, ".env")
    if os.path.exists(p):
        for line in open(p):
            if line.startswith(k + "="): return line.split("=", 1)[1].strip()
    return None

PROMPT = """Invent 60 realistic-but-FICTIONAL entries for "Full Bleed", a curated catalog of new AI
work for working creatives (designers, video/photo/3D/audio people). These are FAKE — do not copy
real products — but they must read as believable launches/repos/models/papers.

Deliberately SPAN the whole space so votes are informative. Cover a wide spread across:
- source: "Product Hunt" (polished commercial launches), "GitHub" (repos/skills/nodes),
  "Hugging Face" (model weights), "HF Papers" / "arXiv" (research), "Show HN".
- category: "Tools", "Automations", "Models", "Plugins & Skills", "Papers".
- discipline: design/UI, image, video, 3D, audio/music, photography, copywriting, branding, motion.
- TYPE of thing: finished commercial apps; AI design/agent skills & MCP integrations; raw model
  releases; research papers; low-level ComfyUI nodes/dev plumbing; workflow automations; weird/novel ideas.
- QUALITY: from obvious must-haves, to solid, to mediocre, to borderline AI-slop. Mix them.

For each, return: title (realistic, with a short dash-description like real launches),
summary (1 neutral sentence on what it is), source, category, discipline.

Return ONLY a JSON array of 60 objects: {"title","summary","source","category","discipline"}."""

def main():
    key = env("ANTHROPIC_API_KEY")
    body = json.dumps({"model": "claude-sonnet-4-6", "max_tokens": 8000,
                       "messages": [{"role": "user", "content": PROMPT}]}).encode()
    req = urllib.request.Request("https://api.anthropic.com/v1/messages", data=body,
        headers={"x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json"})
    txt = json.load(urllib.request.urlopen(req, timeout=120))["content"][0]["text"]
    arr = json.loads(re.search(r"\[.*\]", txt, re.S).group(0))
    cards = [{"id": f"synth-{i+1:03d}", "title": c["title"], "summary": c["summary"],
              "source": c["source"], "category": c["category"], "discipline": c.get("discipline", ""),
              "url": None} for i, c in enumerate(arr)]
    out = os.path.join(ROOT, "curation", "synthetic.json")
    json.dump(cards, open(out, "w"), indent=1)
    from collections import Counter
    print(f"wrote {len(cards)} synthetic cards -> {out}")
    print("by source:", dict(Counter(c["source"] for c in cards)))
    print("by category:", dict(Counter(c["category"] for c in cards)))

if __name__ == "__main__":
    main()
