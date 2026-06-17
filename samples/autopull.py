#!/usr/bin/env python3
"""
Full Bleed — auto-pull proof v2: per-entry CC0 image (Openverse) -> quality-gate +
best-of-N selection -> thermal treatment. Proves the chosen pipeline can hold a floor.
(Queries + casts hand-set here; in production the LLM art-direction step emits them.)
"""
import urllib.request, urllib.parse, json, os, io
import numpy as np
import thermal as T
from PIL import Image

CACHE=os.path.join(os.path.dirname(__file__),"cache"); os.makedirs(CACHE,exist_ok=True)
BROWSER="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"

def search(q,n=14):
    qs=urllib.parse.urlencode({"q":q,"license":"cc0,pdm","page_size":n,"mature":"false"})
    req=urllib.request.Request("https://api.openverse.org/v1/images/?"+qs,
                               headers={"User-Agent":"fullbleed/0.1"})
    try: return json.load(urllib.request.urlopen(req,timeout=25))["results"]
    except Exception: return []

def fetch_img(url):
    for ref in ["https://www.flickr.com/","https://commons.wikimedia.org/",None]:
        try:
            h={"User-Agent":BROWSER}
            if ref: h["Referer"]=ref
            data=urllib.request.urlopen(urllib.request.Request(url,headers=h),timeout=40).read()
            return Image.open(io.BytesIO(data)).convert("RGB")
        except Exception: continue
    return None

def quality(im):
    """Reject too-dark/too-washed/extreme-shape; score by tonal range (contrast)."""
    g=np.asarray(im.convert("L"))/255.0
    m,s=g.mean(),g.std(); w,h=im.size; ar=w/h
    if w<800 or h<600: return -1
    if not (0.18<m<0.82): return -1
    if not (0.85<ar<2.2): return -1
    return s

def best_image(q, tries=6):
    cands=search(q); scored=[]
    for r in cands[:tries]:
        u=(r.get("url") or "")
        if not u.lower().split("?")[0].endswith((".jpg",".jpeg",".png")): continue
        im=fetch_img(u)
        if im is None: continue
        sc=quality(im)
        if sc>0: scored.append((sc,im,r.get("title","")))
    if not scored: return None,None
    scored.sort(key=lambda t:-t[0])
    return scored[0][1], scored[0][2]

JOBS=[
 ("lens",   "human eye closeup",            "green","purple"),
 ("figma",  "hands holding pencil drawing", "yelorange","pinkred"),
 ("motion", "ballet dancer movement",       "blue","purple"),
 ("ltx",    "film projector light beam",    "blue","green"),
 ("opus",   "marble statue face",           "purple","blue"),
 ("qwen",   "person singing microphone",    "pinkred","yelorange"),
]

if __name__=="__main__":
    imgs=[]
    for i,(slug,q,dom,sec) in enumerate(JOBS):
        im,title=best_image(q)
        if im is None: print(f"{slug:8} no good candidate"); imgs.append(None); continue
        p=os.path.join(CACHE,f"{slug}.jpg"); im.save(p,quality=95)
        imgs.append(T.render_photo(p,dom,sec,"pull-"+slug,i))
        print(f"{slug:8} OK  {(title or '')[:40]}")
    imgs=[x for x in imgs if x]
    cols,rows=3,2; cw,ch=440,330; pad=22; bg=(12,12,14)
    sh=Image.new("RGB",(cols*cw+(cols+1)*pad,rows*ch+(rows+1)*pad),bg)
    for i,im in enumerate(imgs):
        r,c=divmod(i,cols); sh.paste(im.resize((cw,ch)),(pad+c*(cw+pad),pad+r*(ch+pad)))
    sh.save(os.path.join(T.OUT,"_AUTOPULL2_SHEET.jpg"),quality=92)
    print("sheet ->", os.path.join(T.OUT,"_AUTOPULL2_SHEET.jpg"))
