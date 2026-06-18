#!/usr/bin/env python3
"""Consolidate both A/B voting batches (real pen + synthetic) into one calibration set:
curation/labels.json = {keeps:[...], kills:[...]} with title/summary/source/category/discipline.
Used to rewrite the brief and few-shot the judge."""
import os, json
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def jload(p): return json.load(open(os.path.join(ROOT, p)))
def norm(p): return p if "type" in p else {"type": "pick", "winner": p["winner"], "loser": p["loser"]}

# real-pen cards (from pen + verdicts)
pen = jload("scraper/data/pen.json"); verd = {v["id"]: v for v in jload("scraper/data/verdicts.json")}
post = {p["post"]["id"]: p["post"] for p in pen.values()}
def real_card(i):
    c = post.get(i, {}); v = verd.get(i, {})
    return {"title": c.get("title", ""), "summary": v.get("summary", ""), "source": c.get("sourceLabel", ""),
            "category": v.get("category", ""), "discipline": ""}
# synthetic cards
synth = {c["id"]: c for c in jload("curation/synthetic.json")}
def synth_card(i):
    c = synth[i]; return {k: c.get(k, "") for k in ("title", "summary", "source", "category", "discipline")}

def tally(pref_path, card_fn):
    if not os.path.exists(os.path.join(ROOT, pref_path)): return {}, {}
    prefs = [norm(p) for p in jload(pref_path)]
    keep, kill = defaultdict(float), defaultdict(float)
    for p in prefs:
        if p["type"] == "pick": keep[p["winner"]] += 1; kill[p["loser"]] += 0.6
        elif p["type"] == "keep":
            for i in p["ids"]: keep[i] += 2
        elif p["type"] == "kill":
            for i in p["ids"]: kill[i] += 2
    return keep, kill

keeps, kills = [], []
for pref_path, card_fn, has in [("curation/preferences.json", real_card, lambda i: i in post),
                                 ("curation/preferences-synthetic.json", synth_card, lambda i: i in synth)]:
    keep, kill = tally(pref_path, card_fn)
    for i in set(keep) | set(kill):
        if not has(i): continue
        net = keep[i] - kill[i]
        if net > 0.5: keeps.append(card_fn(i))
        elif net < -0.5: kills.append(card_fn(i))

json.dump({"keeps": keeps, "kills": kills}, open(os.path.join(ROOT, "curation/labels.json"), "w"), indent=1)
print(f"keeps: {len(keeps)}  kills: {len(kills)}  -> curation/labels.json")
PY = None
if __name__ == "__main__":
    pass
