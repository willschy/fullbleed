#!/usr/bin/env python3
"""
Full Bleed — THERMAL look lab (matching Will's 'singular best reference').
Engine: smooth lit organic form -> thermal/infrared gradient-map (cold purple/blue
shadows -> dominant mids -> lime/white highlights) -> heavy film grain -> soft blur + bloom.
NO voxelization. Output JPEG 4:3 (1333x1000).
"""
import numpy as np
from PIL import Image, ImageFilter
import hashlib, os

W,H=1333,1000
OUT=os.path.join(os.path.dirname(__file__),"out_thermal")
os.makedirs(OUT,exist_ok=True)

PAL={"pinkred":[(255,165,237),(249,67,78),(187,28,40)],
     "yelorange":[(255,246,127),(255,195,57),(255,92,2)],
     "green":[(200,233,138),(82,160,88),(0,65,46)],
     "blue":[(154,216,255),(0,187,255),(62,62,254)],
     "purple":[(214,183,255),(215,100,254),(146,32,188)]}

def grid():
    y,x=np.mgrid[0:H,0:W]; return x/W, y/H
_GX,_GY=grid()
def norm(a): a=a-a.min(); return a/(a.max()+1e-9)
def value_noise(rng,scale):
    gh,gw=max(2,int(H/scale)),max(2,int(W/scale))
    return np.asarray(Image.fromarray((rng.random((gh,gw))*255).astype(np.uint8)).resize((W,H),Image.BICUBIC))/255.0
def gblur(a,s):
    return np.asarray(Image.fromarray((np.clip(a,0,1)*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(s)))/255.0

def shade(height,k=20.0,amb=0.12,kd=0.8,ks=0.5,light=(-0.45,-0.6,0.66)):
    h=gblur(height,6); gy,gx=np.gradient(h)
    nx,ny,nz=-gx*k,-gy*k,np.ones_like(h)
    n=np.sqrt(nx*nx+ny*ny+nz*nz); nx,ny,nz=nx/n,ny/n,nz/n
    L=np.array(light,float); L/=np.linalg.norm(L)
    diff=np.clip(nx*L[0]+ny*L[1]+nz*L[2],0,1)
    Hh=np.array([0,0,1.0])+L; Hh/=np.linalg.norm(Hh)
    spec=np.clip(nx*Hh[0]+ny*Hh[1]+nz*Hh[2],0,1)**22
    return np.clip(amb+kd*diff+ks*spec,0,1)

def _mix(a,b,t): return tuple(a[i]+(b[i]-a[i])*t for i in range(3))
def thermal_lut(dom,sec,n=256):
    """VIBRANT thermal ramp — NO black, NO white. Cool vibrant secondary in shadow ->
    dominant mids -> lime/soft-hot highlight. Stays saturated end to end (like the ref board)."""
    L,M,D=PAL[dom]; sL,sM,sD=PAL[sec]
    shadow=_mix(sD,sM,0.60)                       # vibrant cool shadow, lifted off the deep (NO black)
    stops=[(0.00,shadow),(0.20,sM),(0.40,_mix(D,M,0.5)),
           (0.62,M),(0.82,_mix(L,M,0.18)),
           (1.00,_mix(L,M,0.38))]                 # highlight = saturated light, pulled to mid (NO white)
    lut=np.zeros((n,3))
    for i in range(n):
        t=i/(n-1)
        for k in range(len(stops)-1):
            t0,c0=stops[k]; t1,c1=stops[k+1]
            if t0<=t<=t1: lut[i]=_mix(c0,c1,(t-t0)/(t1-t0)); break
    return np.clip(lut,0,255)

def gblur_rgb(a,s):
    return np.asarray(Image.fromarray(np.clip(a,0,255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(s))).astype(float)

def motion_blur(arr,length=22,angle=6,n=12):
    import math
    dx,dy=math.cos(math.radians(angle)),math.sin(math.radians(angle))
    base=Image.fromarray(np.clip(arr,0,255).astype(np.uint8)); acc=np.zeros_like(arr,float)
    for i in range(n):
        s=(i-(n-1)/2)*length/n
        sh=base.transform(base.size,Image.AFFINE,(1,0,dx*s,0,1,dy*s),resample=Image.BILINEAR)
        acc+=np.asarray(sh)
    return acc/n

# --- smooth organic forms (no hard edges) ---
def form_blobs(rng):                       # dreamy organic mass (like the macro refs)
    f=np.zeros((H,W))
    for k in range(5):
        cx,cy=0.25+0.5*rng.random(),0.25+0.5*rng.random(); s=0.13+0.16*rng.random()
        f+=(0.7+0.6*rng.random())*np.exp(-(((_GX-cx)**2+(_GY-cy)**2)/(2*s**2)))
    return norm(f+0.25*value_noise(rng,90))
def form_drape(rng):                       # flowing folds (cloth/water sheen)
    ph=rng.random()*6.28
    f=np.sin((_GX*3+_GY*1.5)*3.0+ph)+0.6*np.sin((_GX*5-_GY*2)*2.0+ph*1.7)
    f=norm(f)*0.7+0.3*value_noise(rng,70)
    return norm(gblur(f,3))
def form_ridge(rng):                       # a soft central mass rising (figure-ish glow)
    cx,cy=0.5,0.52
    f=np.exp(-(((_GX-cx)**2/0.16+(_GY-cy)**2/0.10)))
    f=f*(0.8+0.4*np.sin(_GY*9+rng.random()*6))
    return norm(f+0.2*value_noise(rng,80))

FORMS={"blobs":form_blobs,"drape":form_drape,"ridge":form_ridge}

def render(slug,formk,dom,sec,idx):
    rng=np.random.default_rng(int(hashlib.sha1(slug.encode()).hexdigest()[:8],16))
    height=FORMS[formk](rng)
    val=norm(shade(height,amb=0.05,kd=0.95,ks=0.6))   # smooth tonal form, full range
    val=np.clip((val-0.46)*1.85+0.46,0,1)             # push contrast -> hit black & white
    val=gblur(val,1.6)                                # soft focus
    lut=thermal_lut(dom,sec)
    color=lut[np.clip((val*255).astype(int),0,255)]
    img=color.astype(np.uint8)
    # bloom on highlights
    lum=color.mean(2); bright=np.clip((lum-150)/105,0,1)[...,None]*color
    bloom=np.asarray(Image.fromarray(bright.astype(np.uint8)).filter(ImageFilter.GaussianBlur(20)))
    img=np.clip(img+bloom*0.5,0,255)
    # heavy monochrome film grain
    g=rng.standard_normal((H,W,1))*24
    img=np.clip(img+g,0,255).astype(np.uint8)
    out=Image.fromarray(img)
    out.save(os.path.join(OUT,f"{idx:02d}_{slug}.jpg"),quality=90)
    return out

JOBS=[("green-purple","ridge","green","purple"),
      ("blue-cyan","blobs","blue","green"),
      ("purple-blue","drape","purple","blue"),
      ("pink-purple","blobs","pinkred","purple"),
      ("orange-pink","drape","yelorange","pinkred"),
      ("blue-purple","ridge","blue","purple")]

def contact(imgs):
    cols,rows=3,2; cw,ch=440,330; pad=24; bg=(12,12,14)
    s=Image.new("RGB",(cols*cw+(cols+1)*pad,rows*ch+(rows+1)*pad),bg)
    for i,im in enumerate(imgs):
        r,c=divmod(i,cols); s.paste(im.resize((cw,ch)),(pad+c*(cw+pad),pad+r*(ch+pad)))
    s.save(os.path.join(OUT,"_SHEET.jpg"),quality=92)

def load_gray(path):
    im=Image.open(path).convert("L"); w,h=im.size; tgt=W/H
    if w/h>tgt: nw=int(h*tgt); im=im.crop(((w-nw)//2,0,(w+nw)//2,h))
    else: nh=int(w/tgt); im=im.crop((0,(h-nh)//2,w,(h+nh)//2))
    return np.asarray(im.resize((W,H)))/255.0

def render_photo(path,dom,sec,name,idx):
    rng=np.random.default_rng(idx+7)
    g=norm(load_gray(path))
    g=np.clip((g-0.5)*1.06+0.5,0,1)               # gentle contrast
    g=0.06+g*0.84                                  # compress range: white source can't hit the top
    g=gblur(g,2.4)                                # soft focus
    lut=thermal_lut(dom,sec)
    color=lut[np.clip((g*255).astype(int),0,255)].astype(float)
    color=motion_blur(color,length=24,angle=6)    # directional smear
    haze=gblur_rgb(color,48)                       # veiling haze
    color=color*0.78+haze*0.22
    color=gblur_rgb(color,2.2)                      # overall haziness (no white-pushing bloom)
    color=color+rng.standard_normal((H,W,1))*16    # grain
    color=np.clip(color,0,255)
    color=28+color*(220-28)/255.0                   # HARD CLAMP: no pure black, no near-white (28..220)
    out=Image.fromarray(color.astype(np.uint8))
    out.save(os.path.join(OUT,f"P{idx}_{name}.jpg"),quality=90); return out

if __name__=="__main__":
    import sys
    if len(sys.argv)>1 and sys.argv[1]=="photo":
        base="/Users/wschlesinger/Documents/AI Image Inputs/2026-05-29 Adidas Volleyball On-Figure Ten Images"
        P=[("adidas-club-volleyball-CUTREF-womens-long-sleeve-front.jpg","green","purple","green"),
           ("adidas-club-volleyball-CUTREF-womens-short-sleeve-front.jpg","blue","purple","blue"),
           ("adidas-club-volleyball-aces-womens-long-sleeve-front-side-crop.jpg","pinkred","purple","pink"),
           ("adidas-club-volleyball-wildcats-womens-long-sleeve-front-side-crop.jpg","purple","blue","purple")]
        imgs=[render_photo(os.path.join(base,f),d,s,n,i) for i,(f,d,s,n) in enumerate(P)]
        cols,rows=2,2; cw,ch=500,375; pad=24; bg=(12,12,14)
        sheet=Image.new("RGB",(cols*cw+(cols+1)*pad,rows*ch+(rows+1)*pad),bg)
        for i,im in enumerate(imgs):
            r,c=divmod(i,cols); sheet.paste(im.resize((cw,ch)),(pad+c*(cw+pad),pad+r*(ch+pad)))
        sheet.save(os.path.join(OUT,"_PHOTO_SHEET.jpg"),quality=92); print("photo done")
    else:
        imgs=[render(s,f,d,sec,i) for i,(s,f,d,sec) in enumerate(JOBS)]
        contact(imgs); print("done ->",OUT)
