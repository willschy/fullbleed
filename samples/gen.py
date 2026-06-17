#!/usr/bin/env python3
"""
Full Bleed — cover generator (Milestone 1, standalone sample).
House style: procedural topic subject -> voxel/pixel reconstruction -> thermal
single-dominant-family color map (+1-2 secondary accents) -> grain/bloom/RGB split.
Output: JPEG 4:3 (1333x1000). NOT wired into the pipeline yet — this is the look lab.
"""
import numpy as np
from PIL import Image, ImageFilter, ImageDraw, ImageFont
import hashlib, os

W, H = 1333, 1000
OUT = os.path.join(os.path.dirname(__file__), "out")
os.makedirs(OUT, exist_ok=True)

# --- TRUE sampled palette (raw pixels from Will's swatch screenshot) ---
PAL = {
    "pinkred":   [(255,165,237),(249,67,78),(187,28,40)],
    "yelorange": [(255,246,127),(255,195,57),(255,92,2)],
    "green":     [(200,233,138),(82,160,88),(0,65,46)],
    "blue":      [(154,216,255),(0,187,255),(62,62,254)],
    "purple":    [(214,183,255),(215,100,254),(146,32,188)],
}
PAPER = (250,250,247)
DARK  = (17,17,16)

def _lerp(a,b,t): return tuple(a[i]+(b[i]-a[i])*t for i in range(3))

def build_lut(family, secondary=None, n=256):
    """Thermal ramp: deep -> mid -> light -> hot-white, with optional secondary accent woven in."""
    L,M,D = PAL[family]
    white = (255,255,255)
    stops = [(0.0,D),(0.42,M),(0.78,L),(1.0,_lerp(L,white,0.55))]
    lut = np.zeros((n,3))
    for i in range(n):
        t = i/(n-1)
        for k in range(len(stops)-1):
            t0,c0 = stops[k]; t1,c1 = stops[k+1]
            if t0<=t<=t1:
                lut[i] = _lerp(c0,c1,(t-t0)/(t1-t0)); break
    if secondary:
        s = PAL[secondary][1]  # secondary mid
        band = np.exp(-((np.linspace(0,1,n)-0.6)**2)/(2*0.10**2))  # accent around upper-mid
        for c in range(3):
            lut[:,c] = lut[:,c]*(1-0.28*band) + s[c]*(0.28*band)
    return np.clip(lut,0,255)

# --- procedural field helpers ---
def grid():
    y,x = np.mgrid[0:H,0:W]
    return x/W, y/H

def value_noise(rng, scale, shape=(H,W)):
    h,w = shape
    gh,gw = max(2,int(h/scale)), max(2,int(w/scale))
    small = rng.random((gh,gw))
    img = Image.fromarray((small*255).astype(np.uint8)).resize((w,h), Image.BICUBIC)
    return np.asarray(img)/255.0

def norm(a):
    a = a-a.min()
    return a/(a.max()+1e-9)

def smoothstep(e0,e1,x):
    t = np.clip((x-e0)/(e1-e0+1e-9),0,1); return t*t*(3-2*t)

_GX,_GY = grid()
def capsule(p0,p1,r,soft=0.014):
    """Capsule as a ROUNDED HEIGHT field (domed cross-section) — so lighting reads as a 3D tube/sphere."""
    ax,ay=p0; bx,by=p1; abx,aby=bx-ax,by-ay
    L2=abx*abx+aby*aby+1e-9
    t=np.clip(((_GX-ax)*abx+(_GY-ay)*aby)/L2,0,1)
    px,py=ax+t*abx, ay+t*aby
    d=np.sqrt((_GX-px)**2+(_GY-py)**2)
    return np.sqrt(np.clip(1-(d/r)**2,0,1))          # 1 at centerline -> 0 at edge, domed

def gblur(a,s):
    return np.asarray(Image.fromarray((np.clip(a,0,1)*255).astype(np.uint8))
                      .filter(ImageFilter.GaussianBlur(s)))/255.0

def shade(height, k=24.0, amb=0.17, kd=0.74, ks=0.42, light=(-0.5,-0.62,0.62)):
    """Directional lighting on a height field -> highlights/mid/shadow (tonal dimension)."""
    h=gblur(height,5)
    gy,gx=np.gradient(h)
    nx,ny,nz=-gx*k,-gy*k,np.ones_like(h)
    n=np.sqrt(nx*nx+ny*ny+nz*nz); nx,ny,nz=nx/n,ny/n,nz/n
    L=np.array(light,float); L/=np.linalg.norm(L)
    diff=np.clip(nx*L[0]+ny*L[1]+nz*L[2],0,1)
    Hh=np.array([0,0,1.0])+L; Hh/=np.linalg.norm(Hh)
    spec=np.clip(nx*Hh[0]+ny*Hh[1]+nz*Hh[2],0,1)**26
    return np.clip(amb+kd*diff+ks*spec,0,1)

# --- motifs: each returns (height 0..1, mask 0..1, albedo 0..1) ---
#   height -> surface relief that gets LIT (shaded for dimension)
#   albedo -> base brightness/content (token accents, video pixels); default ones = pure form
def m_diffusion(rng):          # text-to-image: bloom emerging (organic, dimensional)
    x,y = grid(); cx,cy=0.5,0.48
    pet = np.zeros((H,W))
    for k in range(6):
        a = k/6*2*np.pi
        px,py = cx+0.23*np.cos(a), cy+0.23*np.sin(a)
        pet += np.exp(-(((x-px)**2+(y-py)**2)/(2*0.082**2)))
    core = np.exp(-(((x-cx)**2+(y-cy)**2)/(2*0.13**2)))
    halo = np.exp(-(((x-cx)**2+(y-cy)**2)/(2*0.34**2)))
    height = norm(pet*0.6+core*0.7+halo*0.4)
    mask = np.clip(smoothstep(0.06,0.45, norm(pet+core*0.9+halo*0.5)),0,1)
    return height, mask, np.ones((H,W))

def m_grid(rng):               # design system: token grid (beveled tiles + active-token accents)
    cols,rows = 10,8
    albedo=np.zeros((H,W)); mask=np.zeros((H,W))
    mx,my = int(W*0.045), int(H*0.045)
    cw,ch = (W-2*mx)//cols, (H-2*my)//rows
    vals = rng.random((rows,cols)); big = rng.random((rows,cols))>0.80
    for r in range(rows):
        for c in range(cols):
            x0,y0 = mx+c*cw, my+r*ch; pad=int(cw*0.10)
            alb = 0.34+0.46*vals[r,c] + (0.20 if big[r,c] else 0.0)
            albedo[y0+pad:y0+ch-pad, x0+pad:x0+cw-pad]=alb
            mask[y0+pad:y0+ch-pad, x0+pad:x0+cw-pad]=1.0
    height=gblur(mask,4)        # rounded tile edges -> bevel under lighting
    return height, mask, np.clip(albedo,0,1)

def m_motion(rng):             # human motion -> flowing mocap streaks (abstract, dimensional)
    height=np.zeros((H,W)); n=5
    for s in range(n):
        y0=0.27+0.46*s/(n-1)
        amp=0.05+0.06*rng.random(); ph=rng.random()*6.28; fr=1.1+1.0*rng.random()
        xs=np.linspace(0.05,0.95,64); ys=y0+amp*np.sin(xs*fr*6.28+ph)
        for i in range(len(xs)-1):
            r=0.010+0.007*np.sin(i/len(xs)*np.pi)
            height=np.maximum(height, 0.95*capsule((xs[i],ys[i]),(xs[i+1],ys[i+1]),r))
        for i in range(0,len(xs),9):                       # mocap markers
            height=np.maximum(height, capsule((xs[i],ys[i]),(xs[i],ys[i]),0.017))
    mask=np.clip(height,0,1)
    return norm(height), mask, np.ones((H,W))

def m_video(rng):              # video + audio: lit filmstrip frames + waveform
    albedo=np.zeros((H,W)); mask=np.zeros((H,W))
    mx=int(W*0.04); strip_top=int(H*0.06); strip_h=int(H*0.54)
    frames=5; gap=int(W*0.016); fw=(W-2*mx-(frames-1)*gap)//frames
    for f in range(frames):
        x0=mx+f*(fw+gap)
        base=norm(value_noise(rng,16))[strip_top:strip_top+strip_h, x0:x0+fw]
        albedo[strip_top:strip_top+strip_h, x0:x0+fw]=0.28+0.62*base
        mask[strip_top:strip_top+strip_h, x0:x0+fw]=1.0
    wy0=int(H*0.70); wy1=int(H*0.96); cyl=(wy0+wy1)//2
    xs=np.arange(mx,W-mx)
    env=(np.sin(xs/W*22)+0.6*np.sin(xs/W*55+1)+0.4*rng.standard_normal(len(xs)).cumsum()/40)
    env=norm(np.abs(env))*((wy1-wy0)/2*0.92)
    for i,xv in enumerate(xs):
        a=int(env[i])+1
        albedo[cyl-a:cyl+a, xv]=0.92; mask[cyl-a:cyl+a, xv]=1.0
    height=gblur(mask,4)
    return height, mask, np.clip(albedo,0,1)

def m_reason(rng):             # agentic reasoning: node-and-edge network over a faint field
    x,y=grid()
    srcs=[(0.27,0.38),(0.62,0.28),(0.50,0.60),(0.81,0.54),(0.38,0.74),(0.72,0.80)]
    field=np.zeros((H,W))
    for sx,sy in srcs:                                   # faint interference relief
        d=np.sqrt((x-sx)**2+(y-sy)**2); field+=np.cos(d*40-1)*np.exp(-d*2.4)
    field=norm(field)*0.34
    for a,b in [(0,2),(1,2),(2,3),(2,4),(3,1),(4,5),(5,3),(0,4)]:   # edges (tubes)
        field=np.maximum(field, 0.70*capsule(srcs[a],srcs[b],0.006))
    for sx,sy in srcs:                                   # nodes (spheres)
        field=np.maximum(field, capsule((sx,sy),(sx,sy),0.026))
    mask=np.clip(field,0,1)                              # deep ground shows where no structure
    return norm(field), mask, np.ones((H,W))

def m_wave(rng):               # voice / TTS: speech waveform (dimensional)
    field=np.zeros((H,W)); mask=np.zeros((H,W))
    mx=int(W*0.08); cyl=int(H*0.5); xs=np.arange(mx,W-mx)
    env=np.zeros(len(xs)); pos=0
    while pos<len(xs):
        seg=rng.integers(40,150); a=rng.random()**1.4
        env[pos:pos+seg]=a; pos+=seg+rng.integers(8,60)
    env=np.asarray(Image.fromarray((env*255).astype(np.uint8)[None,:]).resize((len(xs),1),Image.BICUBIC))[0]/255.0
    carrier=np.sin(xs/W*240); amp=(env*carrier)*(H*0.42)
    for i,xv in enumerate(xs):
        a=int(abs(amp[i]))+3
        field[cyl-a:cyl+a, xv]=0.55+0.45*env[i]; mask[cyl-a:cyl+a, xv]=1.0
    return field, mask, np.ones((H,W))

MOTIFS={"diffusion":m_diffusion,"grid":m_grid,"motion":m_motion,
        "video":m_video,"reason":m_reason,"wave":m_wave}

# --- voxelize + color + finish ---
def voxelize(field, mask, cols):
    rows=int(cols*H/W)
    fs=np.asarray(Image.fromarray((np.clip(field,0,1)*255).astype(np.uint8)).resize((cols,rows),Image.BOX))/255.0
    ms=np.asarray(Image.fromarray((np.clip(mask,0,1)*255).astype(np.uint8)).resize((cols,rows),Image.BOX))/255.0
    up=lambda a:np.asarray(Image.fromarray((a*255).astype(np.uint8)).resize((W,H),Image.NEAREST))/255.0
    return up(fs), up(ms)

def finish(arr, rng, dark):
    img=Image.fromarray(arr.astype(np.uint8))
    # bloom
    lum=arr.mean(2); bright=np.clip((lum-170)/85,0,1)[...,None]*arr
    bloom=Image.fromarray(bright.astype(np.uint8)).filter(ImageFilter.GaussianBlur(14))
    img=Image.fromarray(np.clip(np.asarray(img)+np.asarray(bloom)*0.42,0,255).astype(np.uint8))
    # chromatic aberration
    a=np.asarray(img); sh=2
    a2=a.copy(); a2[:,sh:,0]=a[:,:-sh,0]; a2[:,:-sh,2]=a[:,sh:,2]; a=a2
    # grain
    g=rng.standard_normal((H,W,1))*(10 if dark else 7)
    a=np.clip(a+g,0,255).astype(np.uint8)
    return Image.fromarray(a)

def find_font(size):
    for p in ["/System/Library/Fonts/Menlo.ttc","/System/Library/Fonts/SFNSMono.ttf",
              "/System/Library/Fonts/Monaco.ttf","/Library/Fonts/Menlo.ttc"]:
        if os.path.exists(p):
            try: return ImageFont.truetype(p,size)
            except: pass
    return ImageFont.load_default()

def render(slug, motif, family, secondary, dark, label, idx):
    seed=int(hashlib.sha1((slug+"v2").encode()).hexdigest()[:8],16)
    rng=np.random.default_rng(seed)
    field,mask,albedo=MOTIFS[motif](rng)
    cols=64
    shaded = shade(field)                               # TONAL DIMENSION: light the relief
    subj = np.clip(albedo*shaded, 0, 1)                 # reflectance * lighting
    # FULL BLEED: a low-value colored ground fills the frame; lit subject sits on it.
    ground = value_noise(rng,64)*0.085 + 0.05           # calmer ground -> subject reads
    fullsmooth = np.maximum(subj*np.clip(mask,0,1), ground)
    fv,_ = voxelize(fullsmooth, np.ones_like(fullsmooth), cols)  # voxelize the WHOLE frame
    yy,xx=np.mgrid[0:H,0:W].astype(float)
    vig = 1 - 0.16*(((xx/W-0.5)**2+(yy/H-0.5)**2)/0.5) # subtle depth at edges
    fv = np.clip(fv*vig,0,1)
    lut=build_lut(family,secondary)
    idxs=np.clip((fv*255).astype(int),0,255)
    color=lut[idxs]                              # HxWx3, fills frame edge-to-edge
    img=finish(color,rng,True)
    img.save(os.path.join(OUT,f"{idx:02d}_{slug[:22]}.jpg"), quality=90)
    return img

JOBS=[
 ("lens","diffusion","pinkred","purple","Lens — text-to-image model"),
 ("figma-mcp","grid","yelorange","pinkred","Figma MCP — design system"),
 ("3d-motion","motion","green","blue","VideoMDM — 3D human motion"),
 ("ltx2","video","blue","purple","LTX-2 — video + audio model"),
 ("opus46","reason","purple","blue","Claude Opus 4.6 — reasoning"),
 ("qwen-tts","wave","pinkred","yelorange","Qwen3-TTS — voice cloning"),
]

def contact(images, name, dark):
    cols=3; rows=2; cw,ch=440,330; pad=26
    bg=DARK if dark else (244,244,241)
    sheet=Image.new("RGB",(cols*cw+(cols+1)*pad, rows*ch+(rows+1)*pad), bg)
    for i,im in enumerate(images):
        r,c=divmod(i,cols)
        th=im.resize((cw,ch))
        sheet.paste(th,(pad+c*(cw+pad), pad+r*(ch+pad)))
    sheet.save(os.path.join(OUT,name), quality=92)

if __name__=="__main__":
    imgs=[]
    for i,(slug,motif,fam,sec,label) in enumerate(JOBS):
        imgs.append(render(slug,motif,fam,sec,True,label,i))
    contact(imgs,"_SHEET.jpg",True)
    print("done ->", OUT)
