#!/usr/bin/env python3
"""
Full Bleed — discipline tagger.  Assigns each entry 1-2 disciplines from a closed set
(what the work is FOR), used by the site's "Discipline" rail facet.

    npm run disciplines     (== python3 covers/tag_disciplines.py)

IDEMPOTENT: only entries with empty `disciplines: []` are tagged, so re-running (and the
pipeline) only touches new entries. Needs ANTHROPIC_API_KEY in the repo-root .env.
Flow: listen → judge → writeup → publish-entries → disciplines → cover → build.
"""
import os, re, json, glob, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENTRIES = os.path.join(ROOT, "site", "src", "content", "entries")
VOCAB = ["Design", "Image", "Video", "3D", "Audio"]   # closed set — keep in sync with index.astro

def env(k):
    v = os.environ.get(k)
    if v:
        return v
    p = os.path.join(ROOT, ".env")
    if os.path.exists(p):
        for line in open(p):
            if line.startswith(k + "="):
                return line.split("=", 1)[1].strip()
    return None

def field(text, key):
    m = re.search(rf"^{key}:\s*(.+)$", text, re.M)
    return m.group(1).strip() if m else ""

def tag(entries, key):
    lst = "\n".join(f'{i+1}. [{e["slug"]}] "{e["title"]}" (type:{e["category"]}) — {e["what"][:100]}'
                    for i, e in enumerate(entries))
    prompt = ("Tag each entry in a catalog of AI tools/models for working creatives with the creative "
        f"DISCIPLINE(s) it serves, from this closed set ONLY: {VOCAB}. "
        "'Image' covers generative image, photo editing, and retouching; 'Design' covers UI/graphic/brand/"
        "presentation design; 'Video' covers video gen/editing/motion; '3D' covers 3D/spatial; 'Audio' "
        "covers voice/music/sound. Assign 1, or 2 if it genuinely spans two. Pick the best fit even for "
        "general models (a multimodal image+video model -> Image, Video; a reasoning/agent model that helps "
        "make creative work -> its closest discipline).\n\n"
        f"ENTRIES:\n{lst}\n\n"
        'Return ONLY a JSON object mapping slug -> array of disciplines, e.g. {"slug-one":["Image"]}.')
    body = json.dumps({"model": "claude-sonnet-4-6", "max_tokens": 2000,
                       "messages": [{"role": "user", "content": prompt}]}).encode()
    req = urllib.request.Request("https://api.anthropic.com/v1/messages", data=body,
        headers={"x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json"})
    txt = json.load(urllib.request.urlopen(req, timeout=90))["content"][0]["text"]
    return json.loads(re.search(r"\{.*\}", txt, re.S).group(0))

def main():
    key = env("ANTHROPIC_API_KEY")
    if not key:
        print("Missing ANTHROPIC_API_KEY in .env."); return
    paths = sorted(glob.glob(os.path.join(ENTRIES, "*.md")))
    todo = []
    for p in paths:
        t = open(p).read()
        d = field(t, "disciplines")
        if d in ("", "[]"):                  # untagged only
            todo.append((p, os.path.basename(p)[:-3], t))
    if not todo:
        print("All entries already have disciplines. Nothing to do."); return
    print(f"{len(todo)} entr{'y' if len(todo)==1 else 'ies'} to tag — asking Sonnet...")
    meta = [{"slug": s, "title": field(t, "title").strip('"'),
             "category": field(t, "category"), "what": field(t, "hoverWhat")} for (_, s, t) in todo]
    result = tag(meta, key)
    n = 0
    for (p, slug, t) in todo:
        ds = [d for d in (result.get(slug) or []) if d in VOCAB][:2] or ["Design"]
        arr = "[" + ", ".join(f'"{d}"' for d in ds) + "]"
        t = re.sub(r"^disciplines:.*$", f"disciplines: {arr}", t, count=1, flags=re.M)
        open(p, "w").write(t); n += 1
        print(f"  {slug[:42]:42} -> {ds}")
    print(f"\nTagged {n} entries.")

if __name__ == "__main__":
    main()
