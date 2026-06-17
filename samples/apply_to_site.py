#!/usr/bin/env python3
"""Wire the 31 catalog covers into the LOCAL site (reversible; nothing committed).
Re-treats from cached originals -> site/public/thumbs/{slug}-cover.jpg, points each
entry's `thumbnail` frontmatter at it. Same entry order + ROT casts as catalog_run.py."""
import os, re, glob
import thermal as T
from PIL import Image

ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENTRIES=os.path.join(ROOT,"site/src/content/entries")
THUMBS=os.path.join(ROOT,"site/public/thumbs"); os.makedirs(THUMBS,exist_ok=True)
# EVEN 5-family split (each dominant ~6/31), interleaved hue order for grid spread
ROT=[("green","purple"),("pinkred","blue"),("blue","green"),
     ("yelorange","purple"),("purple","blue")]

paths=sorted(glob.glob(os.path.join(ENTRIES,"*.md")))
done=0
for i,p in enumerate(paths):
    slug=os.path.basename(p)[:-3]
    src=os.path.join(os.path.dirname(__file__),"cache",f"cat_{slug[:30]}.jpg")
    if not os.path.exists(src): print("MISSING cache:",slug); continue
    dom,sec=ROT[i%len(ROT)]
    im=T.render_photo(src,dom,sec,"site-"+slug[:20],i)
    im.save(os.path.join(THUMBS,f"{slug}-cover.webp"),"WEBP",quality=80,method=6)         # full / hero (1333)
    im.resize((960,720),Image.LANCZOS).save(
        os.path.join(THUMBS,f"{slug}-cover-md.webp"),"WEBP",quality=78,method=6)           # retina card (960)
    im.resize((480,360),Image.LANCZOS).save(
        os.path.join(THUMBS,f"{slug}-cover-sm.webp"),"WEBP",quality=76,method=6)           # card (480)
    t=open(p).read()
    t=re.sub(r"^thumbnail:.*$", f"thumbnail: /thumbs/{slug}-cover.webp", t, count=1, flags=re.M)
    open(p,"w").write(t); done+=1
print(f"wired {done}/{len(paths)} entries -> /thumbs/<slug>-cover.jpg")
