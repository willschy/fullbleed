#!/usr/bin/env python3
"""
Full Bleed — Unsplash auto-pull + thermal treatment (production-leaning proof).
Needs UNSPLASH_ACCESS_KEY (env or repo .env). Search -> quality-gate + best-of-N ->
thermal-treat -> record photographer attribution. Run: python3 unsplash_pull.py
(Queries + casts hand-set here; production = the LLM art-direction step emits them.)
"""
import urllib.request, urllib.parse, json, os, io
import numpy as np
import thermal as T
from PIL import Image

ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE=os.path.join(os.path.dirname(__file__),"cache"); os.makedirs(CACHE,exist_ok=True)
BROWSER="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"

def access_key():
    k=os.environ.get("UNSPLASH_ACCESS_KEY")
    if k: return k
    envp=os.path.join(ROOT,".env")
    if os.path.exists(envp):
        for line in open(envp):
            if line.startswith("UNSPLASH_ACCESS_KEY="):
                return line.split("=",1)[1].strip()
    return None
KEY=access_key()

def search(q, per=10):
    qs=urllib.parse.urlencode({"query":q,"per_page":per,"orientation":"landscape",
                               "content_filter":"high","client_id":KEY})
    req=urllib.request.Request("https://api.unsplash.com/search/photos?"+qs,
                               headers={"User-Agent":BROWSER,"Accept-Version":"v1"})
    return json.load(urllib.request.urlopen(req,timeout=25)).get("results",[])

def fetch(url):
    try:
        data=urllib.request.urlopen(urllib.request.Request(url,headers={"User-Agent":BROWSER}),timeout=40).read()
        return Image.open(io.BytesIO(data)).convert("RGB")
    except Exception: return None

def quality(im):                       # reject too-dark/washed; score by tonal range
    g=np.asarray(im.convert("L"))/255.0; m,s=g.mean(),g.std()
    if not (0.16<m<0.84): return -1
    return s

def best(q, tries=5):
    res=search(q); scored=[]
    for r in res[:tries]:
        im=fetch(r["urls"]["regular"])
        if im is None: continue
        sc=quality(im)
        if sc>0:
            cred=f'{r["user"]["name"]} / Unsplash'
            scored.append((sc,im,cred,r["links"].get("download_location")))
    if not scored: return None
    scored.sort(key=lambda t:-t[0])
    return scored[0]

JOBS=[
 ("lens",   "human eye macro closeup",      "green","purple"),
 ("figma",  "architect hands blueprint",    "yelorange","pinkred"),
 ("motion", "dancer motion long exposure",  "blue","purple"),
 ("ltx",    "cinema projector light beam",  "blue","green"),
 ("opus",   "marble statue face classical", "purple","blue"),
 ("qwen",   "singer microphone studio",     "pinkred","yelorange"),
]

if __name__=="__main__":
    if not KEY:
        print("NO KEY: set UNSPLASH_ACCESS_KEY in env or .env and re-run."); raise SystemExit(1)
    creds={}; imgs=[]
    for i,(slug,q,dom,sec) in enumerate(JOBS):
        b=best(q)
        if not b: print(f"{slug:8} no candidate"); imgs.append(None); continue
        sc,im,cred,dl=b
        p=os.path.join(CACHE,f"u_{slug}.jpg"); im.save(p,quality=95)
        imgs.append(T.render_photo(p,dom,sec,"u-"+slug,i)); creds[slug]=cred
        if dl:  # Unsplash guideline: trigger download endpoint when a photo is used
            try: urllib.request.urlopen(urllib.request.Request(dl+f"&client_id={KEY}"),timeout=15)
            except Exception: pass
        print(f"{slug:8} OK  {cred}")
    imgs=[x for x in imgs if x]
    cols,rows=3,2; cw,ch=440,330; pad=22; bg=(12,12,14)
    sh=Image.new("RGB",(cols*cw+(cols+1)*pad,rows*ch+(rows+1)*pad),bg)
    for i,im in enumerate(imgs):
        r,c=divmod(i,cols); sh.paste(im.resize((cw,ch)),(pad+c*(cw+pad),pad+r*(ch+pad)))
    sh.save(os.path.join(T.OUT,"_UNSPLASH_SHEET.jpg"),quality=92)
    print("creds:",json.dumps(creds)); print("sheet ->",os.path.join(T.OUT,"_UNSPLASH_SHEET.jpg"))
