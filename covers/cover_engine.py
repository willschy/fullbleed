#!/usr/bin/env python3
"""
Full Bleed — production cover generator.  Run AFTER `npm run publish-entries`:

    npm run cover        (== python3 covers/cover_engine.py)

For every entry that does NOT yet have a cover it:
  1) Sonnet art-direction  -> an organic, on-theme Unsplash search concept
  2) Unsplash search       -> quality-gate + best-of-N pick (+ photographer credit)
  3) thermal treatment     -> identical to the launch house style (locked below)
  4) writes WebP at 3 sizes + sets `thumbnail` and `credit` in the entry frontmatter

IDEMPOTENT: entries that already have a `<slug>-cover.webp` are skipped, so only NEW
entries are processed. EVEN hue split: the dominant family cycles across the 5-family
palette by sorted-entry index (decoupled from category), matching the launch grid.

Needs: numpy + Pillow (pip install -r covers/requirements.txt) and
UNSPLASH_ACCESS_KEY + ANTHROPIC_API_KEY in the repo-root .env.
"""
import os, re, io, json, glob, math, hashlib, urllib.request, urllib.parse
import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENTRIES = os.path.join(ROOT, "site", "src", "content", "entries")
THUMBS = os.path.join(ROOT, "site", "public", "thumbs")
W, H = 1333, 1000
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"

# dominant family cycles for an even spectrum split; secondary = the cold/shadow hue.
COLORS = ["green", "pinkred", "blue", "yelorange", "purple"]
SEC = {"green": "purple", "pinkred": "blue", "blue": "green", "yelorange": "purple", "purple": "blue"}

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

# ---------------- thermal treatment (LOCKED — identical to the launch covers) ----------------
PAL = {"pinkred": [(255,165,237),(249,67,78),(187,28,40)],
       "yelorange": [(255,246,127),(255,195,57),(255,92,2)],
       "green": [(200,233,138),(82,160,88),(0,65,46)],
       "blue": [(154,216,255),(0,187,255),(62,62,254)],
       "purple": [(214,183,255),(215,100,254),(146,32,188)]}

def _mix(a, b, t): return tuple(a[i] + (b[i] - a[i]) * t for i in range(3))
def _norm(a): a = a - a.min(); return a / (a.max() + 1e-9)
def _gblur(a, s): return np.asarray(Image.fromarray((np.clip(a,0,1)*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(s)))/255.0
def _gblur_rgb(a, s): return np.asarray(Image.fromarray(np.clip(a,0,255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(s))).astype(float)

def _motion_blur(arr, length=24, angle=6, n=12):
    dx, dy = math.cos(math.radians(angle)), math.sin(math.radians(angle))
    base = Image.fromarray(np.clip(arr,0,255).astype(np.uint8)); acc = np.zeros_like(arr, float)
    for i in range(n):
        s = (i - (n-1)/2) * length / n
        acc += np.asarray(base.transform(base.size, Image.AFFINE, (1,0,dx*s,0,1,dy*s), resample=Image.BILINEAR))
    return acc / n

def thermal_lut(dom, sec, n=256):
    """VIBRANT thermal ramp — NO black, NO white (Will's hard rule)."""
    L, M, D = PAL[dom]; sL, sM, sD = PAL[sec]
    shadow = _mix(sD, sM, 0.60)
    stops = [(0.00,shadow),(0.20,sM),(0.40,_mix(D,M,0.5)),(0.62,M),(0.82,_mix(L,M,0.18)),(1.00,_mix(L,M,0.38))]
    lut = np.zeros((n, 3))
    for i in range(n):
        t = i / (n - 1)
        for k in range(len(stops) - 1):
            t0, c0 = stops[k]; t1, c1 = stops[k+1]
            if t0 <= t <= t1:
                lut[i] = _mix(c0, c1, (t - t0) / (t1 - t0)); break
    return np.clip(lut, 0, 255)

def _load_gray(src):
    im = src if isinstance(src, Image.Image) else Image.open(src)
    im = im.convert("L"); w, h = im.size; tgt = W / H
    if w / h > tgt:
        nw = int(h * tgt); im = im.crop(((w-nw)//2, 0, (w+nw)//2, h))
    else:
        nh = int(w / tgt); im = im.crop((0, (h-nh)//2, w, (h+nh)//2))
    return np.asarray(im.resize((W, H))) / 255.0

def thermal_treat(src, dom, sec, seed):
    """Grayscale source -> thermal gradient-map + motion smear + haze + grain. Returns a 1333x1000 PIL image."""
    rng = np.random.default_rng(seed)
    g = _norm(_load_gray(src))
    g = np.clip((g - 0.5) * 1.06 + 0.5, 0, 1)         # gentle contrast
    g = 0.06 + g * 0.84                               # compress: white source can't hit the top
    g = _gblur(g, 2.4)                                # soft focus
    color = thermal_lut(dom, sec)[np.clip((g*255).astype(int), 0, 255)].astype(float)
    color = _motion_blur(color)                       # directional smear
    color = color * 0.78 + _gblur_rgb(color, 48) * 0.22   # veiling haze
    color = _gblur_rgb(color, 2.2)                    # overall haziness
    color = color + rng.standard_normal((H, W, 1)) * 16   # film grain
    color = np.clip(color, 0, 255)
    color = 28 + color * (220 - 28) / 255.0           # HARD CLAMP: no pure black, no near-white
    return Image.fromarray(color.astype(np.uint8))

def save_variants(im, slug):
    im.save(os.path.join(THUMBS, f"{slug}-cover.webp"), "WEBP", quality=80, method=6)          # full / hero
    im.resize((960,720), Image.LANCZOS).save(os.path.join(THUMBS, f"{slug}-cover-md.webp"), "WEBP", quality=78, method=6)
    im.resize((480,360), Image.LANCZOS).save(os.path.join(THUMBS, f"{slug}-cover-sm.webp"), "WEBP", quality=76, method=6)

# ---------------- sourcing ----------------
def unsplash_best(q, key, tries=5):
    qs = urllib.parse.urlencode({"query": q, "per_page": 10, "orientation": "landscape",
                                 "content_filter": "high", "client_id": key})
    req = urllib.request.Request("https://api.unsplash.com/search/photos?" + qs,
                                 headers={"User-Agent": UA, "Accept-Version": "v1"})
    results = json.load(urllib.request.urlopen(req, timeout=25)).get("results", [])
    scored = []
    for r in results[:tries]:
        try:
            data = urllib.request.urlopen(urllib.request.Request(r["urls"]["regular"], headers={"User-Agent": UA}), timeout=40).read()
            im = Image.open(io.BytesIO(data)).convert("RGB")
        except Exception:
            continue
        gg = np.asarray(im.convert("L")) / 255.0
        if not (0.16 < gg.mean() < 0.84):             # reject too-dark / too-washed
            continue
        scored.append((gg.std(), im, f'{r["user"]["name"]} / Unsplash', r["links"].get("download_location")))
    if not scored:
        return None
    scored.sort(key=lambda t: -t[0])                  # best tonal range
    return scored[0]

def art_direct(entries, key):
    """One Sonnet call -> {slug: organic search query}."""
    lst = "\n".join(f'{i+1}. [{e["slug"]}] "{e["title"]}" (cat:{e["category"]}) — {e["what"][:90]}'
                    for i, e in enumerate(entries))
    prompt = ("You are art-directing cover photos for a catalog of new AI tools/models for creatives. "
        "Each cover is a REAL photo run through a heavy thermal/grain treatment, so the subject must be "
        "a striking, evocative, PHOTOGRAPHABLE thing: a human eye/face/hand/body, motion, nature, light, "
        "an object, a texture. NEVER screenshots, UI, logos, charts, or text. The subject should resonate "
        "with the entry's theme metaphorically (text-to-image -> a human eye; a voice model -> a singer/mouth; "
        "a video model -> projector light/motion; reasoning -> a classical bust). For each entry return a "
        "short 2-4 word Unsplash search query.\n\n"
        f"ENTRIES:\n{lst}\n\n"
        'Return ONLY a JSON object mapping slug -> query, e.g. {"slug-one":"human eye macro"}.')
    body = json.dumps({"model": "claude-sonnet-4-6", "max_tokens": 2000,
                       "messages": [{"role": "user", "content": prompt}]}).encode()
    req = urllib.request.Request("https://api.anthropic.com/v1/messages", data=body,
        headers={"x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json"})
    txt = json.load(urllib.request.urlopen(req, timeout=90))["content"][0]["text"]
    return json.loads(re.search(r"\{.*\}", txt, re.S).group(0))

# ---------------- frontmatter helpers ----------------
def field(text, key):
    m = re.search(rf"^{key}:\s*(.+)$", text, re.M)
    return m.group(1).strip().strip('"') if m else ""

def set_cover_fields(text, slug, credit):
    text = re.sub(r"^thumbnail:.*$", f"thumbnail: /thumbs/{slug}-cover.webp", text, count=1, flags=re.M)
    cval = '"' + credit.replace('"', '\\"') + '"'
    if re.search(r"^credit:.*$", text, re.M):
        text = re.sub(r"^credit:.*$", f"credit: {cval}", text, count=1, flags=re.M)
    else:
        text = re.sub(r"^(thumbnail:.*)$", r"\1\n" + f"credit: {cval}", text, count=1, flags=re.M)
    return text

def main():
    ukey, akey = env("UNSPLASH_ACCESS_KEY"), env("ANTHROPIC_API_KEY")
    if not ukey or not akey:
        print("Missing UNSPLASH_ACCESS_KEY and/or ANTHROPIC_API_KEY in .env — cannot generate covers.")
        return
    os.makedirs(THUMBS, exist_ok=True)
    paths = sorted(glob.glob(os.path.join(ENTRIES, "*.md")))
    todo = []
    for i, p in enumerate(paths):              # i = stable sorted index -> even hue split
        slug = os.path.basename(p)[:-3]; t = open(p).read()
        has_cover = field(t, "thumbnail").endswith("-cover.webp") and os.path.exists(os.path.join(THUMBS, f"{slug}-cover.webp"))
        if not has_cover:
            todo.append((i, p, slug, t))
    if not todo:
        print("All entries already have covers. Nothing to do.")
        return
    print(f"{len(todo)} entr{'y' if len(todo)==1 else 'ies'} need covers — art-directing via Sonnet...")
    meta = [{"slug": s, "title": field(t, "title"), "category": field(t, "category"), "what": field(t, "hoverWhat")}
            for (_, _, s, t) in todo]
    try:
        queries = art_direct(meta, akey)
    except Exception as e:
        print("Art-direction failed:", e); queries = {}
    made = 0
    for (i, p, slug, t) in todo:
        q = queries.get(slug) or field(t, "title")
        dom = COLORS[i % 5]; sec = SEC[dom]
        try:
            best = unsplash_best(q, ukey)
            if not best:
                print(f"  SKIP  {slug[:36]:36} (no usable image for '{q}')"); continue
            _, im, credit, dl = best
            seed = int(hashlib.sha1(slug.encode()).hexdigest()[:8], 16)
            save_variants(thermal_treat(im, dom, sec, seed), slug)
            open(p, "w").write(set_cover_fields(t, slug, credit))
            if dl:                              # Unsplash guideline: trigger download endpoint on use
                try: urllib.request.urlopen(urllib.request.Request(dl + f"&client_id={ukey}"), timeout=15)
                except Exception: pass
            made += 1
            print(f"  +     {slug[:36]:36} {dom:9} <- {q[:22]:22} | {credit}")
        except Exception as e:
            print(f"  ERR   {slug[:36]:36} {type(e).__name__}: {e}")
    print(f"\nGenerated {made} cover(s). (WebP 480/960/1333 in site/public/thumbs/)")

if __name__ == "__main__":
    main()
