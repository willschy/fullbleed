#!/usr/bin/env python3
"""
Full Bleed — FULL CATALOG run (standalone, nothing published).
1) read all entries -> 2) Sonnet art-direction (organic search subject per entry)
-> 3) assign color cast rotated across palette (even spectrum spread, decoupled from category)
-> 4) Unsplash pull (gate + best-of-N) -> 5) thermal-treat -> 6) full contact sheet.
"""
import os, re, json, glob, urllib.request, urllib.parse, io, time
import numpy as np
import thermal as T
from PIL import Image
import unsplash_pull as U   # reuse search/fetch/quality/best + KEY

ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENTRIES=os.path.join(ROOT,"site/src/content/entries")
CACHE=os.path.join(os.path.dirname(__file__),"cache"); os.makedirs(CACHE,exist_ok=True)

def env(k):
    v=os.environ.get(k)
    if v: return v
    p=os.path.join(ROOT,".env")
    if os.path.exists(p):
        for line in open(p):
            if line.startswith(k+"="): return line.split("=",1)[1].strip()
    return None

def fm(path):
    t=open(path).read(); m=re.search(r"^---\n(.*?)\n---",t,re.S)
    b=m.group(1) if m else ""
    def g(key):
        mm=re.search(rf"^{key}:\s*(.+)$",b,re.M)
        return mm.group(1).strip().strip('"') if mm else ""
    return {"slug":os.path.basename(path)[:-3],"title":g("title"),
            "category":g("category"),"what":g("hoverWhat"),"tools":g("tools")}

def art_direct(entries):
    """One Sonnet call -> {slug: search_query} for an evocative ORGANIC/photographable subject."""
    key=env("ANTHROPIC_API_KEY")
    lst="\n".join(f'{i+1}. [{e["slug"]}] "{e["title"]}" (cat:{e["category"]}) — {e["what"][:90]}'
                  for i,e in enumerate(entries))
    prompt=("You are art-directing cover photos for a catalog of new AI tools/models for creatives. "
        "Each cover is a REAL photo run through a heavy thermal/grain treatment, so the subject must be "
        "a striking, evocative, PHOTOGRAPHABLE thing: a human eye/face/hand/body, motion, nature, light, "
        "an object, a texture. NEVER screenshots, UI, logos, charts, or text. The subject should resonate "
        "with the entry's theme metaphorically (e.g. a text-to-image model -> a human eye; a voice model -> "
        "a singer/mouth; a video model -> projector light/motion; reasoning -> a classical bust). "
        "For each entry return a short 2-4 word Unsplash search query.\n\n"
        f"ENTRIES:\n{lst}\n\n"
        'Return ONLY a JSON object mapping slug -> query, e.g. {"slug-one":"human eye macro"}.')
    body=json.dumps({"model":"claude-sonnet-4-6","max_tokens":2000,
                     "messages":[{"role":"user","content":prompt}]}).encode()
    req=urllib.request.Request("https://api.anthropic.com/v1/messages",data=body,
        headers={"x-api-key":key,"anthropic-version":"2023-06-01","content-type":"application/json"})
    r=json.load(urllib.request.urlopen(req,timeout=90))
    txt=r["content"][0]["text"]
    j=re.search(r"\{.*\}",txt,re.S).group(0)
    return json.loads(j)

# rotation -> even spectrum spread, decoupled from category
ROT=[("green","purple"),("purple","blue"),("yelorange","pinkred"),
     ("blue","purple"),("pinkred","purple"),("blue","green"),("purple","pinkred")]

if __name__=="__main__":
    paths=sorted(glob.glob(os.path.join(ENTRIES,"*.md")))
    entries=[fm(p) for p in paths]
    print(f"{len(entries)} entries; art-directing via Sonnet...")
    queries=art_direct(entries)
    json.dump(queries,open(os.path.join(CACHE,"queries.json"),"w"),indent=1)
    imgs=[]; meta=[]
    for i,e in enumerate(entries):
        q=queries.get(e["slug"]) or e["title"]
        dom,sec=ROT[i%len(ROT)]
        try:
            b=U.best(q)
            if not b: print(f"{i:2} {e['slug'][:28]:28} NO IMG ({q})"); continue
            sc,im,cred,dl=b
            p=os.path.join(CACHE,f"cat_{e['slug'][:30]}.jpg"); im.save(p,quality=95)
            out=T.render_photo(p,dom,sec,"cat-"+e['slug'][:24],i)
            imgs.append(out); meta.append((e['slug'],q,dom,cred))
            print(f"{i:2} {e['slug'][:28]:28} {dom:9} <- {q[:24]:24} | {cred}")
        except Exception as ex:
            print(f"{i:2} {e['slug'][:28]:28} ERR {type(ex).__name__} {ex}")
    cols=5; rows=(len(imgs)+cols-1)//cols; cw,ch=300,225; pad=14; bg=(14,14,16)
    sh=Image.new("RGB",(cols*cw+(cols+1)*pad,rows*ch+(rows+1)*pad),bg)
    for i,im in enumerate(imgs):
        r,c=divmod(i,cols); sh.paste(im.resize((cw,ch)),(pad+c*(cw+pad),pad+r*(ch+pad)))
    sh.save(os.path.join(T.OUT,"_CATALOG_SHEET.jpg"),quality=92)
    json.dump(meta,open(os.path.join(CACHE,"catalog_meta.json"),"w"),indent=1)
    print("CATALOG SHEET ->",os.path.join(T.OUT,"_CATALOG_SHEET.jpg"),f"({len(imgs)} covers)")
