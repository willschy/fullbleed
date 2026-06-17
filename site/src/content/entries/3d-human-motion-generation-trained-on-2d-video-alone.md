---
title: 3D human motion generation trained on 2D video alone
date: 2026-06-11
sourceDate: 2026-06-11
category: papers
thumbnail: /thumbs/3d-human-motion-generation-trained-on-2d-video-alone-cover.webp
credit: "Ahmad Odeh / Unsplash"
tools: []
disciplines: ["3D", "Video"]
score: 7
hoverWhat: VideoMDM learns to generate 3D body motion without ever seeing 3D
  training data, which could open motion generation to the vastly larger world
  of ordinary video.
hoverWhy: VideoMDM learns to generate 3D body motion without ever seeing 3D
  training data, which could open motion generation to the vastly larger world
  of ordinary video.
modelVersions: null
source:
  origin: HF Papers
  permalink: https://huggingface.co/papers/2606.13364
  outboundUrl: https://arxiv.org/abs/2606.13364
  author: Amir Mann et al.
supersededBy: null
fixture: false
---

**What it is.** A diffusion model that generates 3D human motion sequences, trained entirely from 2D pose keypoints extracted from regular monocular video. There is no 3D motion capture data involved in training. A pretrained 2D-to-3D lifting model supplies rough 3D poses as a noisy starting point, the diffusion model refines them in 3D space, and the supervision signal comes from reprojecting those 3D predictions back into 2D and comparing them against the accurate 2D keypoints from the original video.

**Why it matters.** Captured 3D motion data is expensive and scarce. The libraries that exist skew heavily toward a narrow range of movements recorded in controlled lab settings. Video of people moving, by contrast, is everywhere, covering sports, dance, physical work, and every kind of human activity that never makes it into a mocap session. A method that can learn a coherent 3D motion prior directly from that footage, without needing anyone to annotate 3D ground truth, could meaningfully widen what motion generation tools actually know how to do.

**What is new here.** Most prior work that involves 2D video only lifts 2D poses to 3D at inference time, as a post-processing step. VideoMDM bakes the 3D learning into training itself, so the model builds an internal understanding of how bodies move in three dimensions rather than just projecting a guess at the end. The paper also shows mathematically that a depth-weighted 2D reprojection loss is equivalent in expectation to direct 3D supervision, which is the theoretical grounding for why this works at all. On the standard HumanML3D benchmark, the approach nearly closes the gap to a fully 3D-supervised baseline, and on real-world video datasets covering gym exercise and basketball, human evaluators consistently preferred its outputs.
