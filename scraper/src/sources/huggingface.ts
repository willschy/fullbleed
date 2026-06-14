import type { Candidate, HuggingFaceConfig } from "../types.js";

// Hugging Face via its free public API (no key for public listing). Feeds the
// Models lane — recent models that have actually drawn traction (likes).
const API = "https://huggingface.co/api/models";

interface HfModel {
  id: string; // "black-forest-labs/FLUX.1-dev"
  likes: number;
  downloads: number;
  createdAt: string;
  pipeline_tag?: string;
  tags?: string[];
}

function toCandidate(m: HfModel): Candidate {
  const [owner] = m.id.split("/");
  return {
    source: "huggingface",
    id: `hf:${m.id}`,
    sourceLabel: "Hugging Face",
    title: m.id,
    author: owner,
    createdUtc: Math.floor(Date.parse(m.createdAt) / 1000),
    url: `https://huggingface.co/${m.id}`,
    outboundUrl: `https://huggingface.co/${m.id}`,
    body: [m.pipeline_tag, ...(m.tags ?? [])].filter(Boolean).join(", "),
    thumbnailUrl: null,
    hasImage: false,
    hasVideo: false,
    signal: { score: m.likes, comments: m.downloads, label: "likes" },
    meta: { pipeline: m.pipeline_tag, downloads: m.downloads },
  };
}

export async function fetchHuggingFace(cfg: HuggingFaceConfig): Promise<Candidate[]> {
  const byId = new Map<string, Candidate>();
  // Two passes: "likes" surfaces proven hits (but skews old); "createdAt" catches
  // fresh drops the recency gate would otherwise never see. minLikes keeps the
  // fresh pass from being pure noise (a little traction = social proof it works).
  const sorts = ["likes", "createdAt"];

  for (const pipeline of cfg.pipelines) {
    for (const sort of sorts) {
      const params = new URLSearchParams({
        pipeline_tag: pipeline,
        sort,
        direction: "-1",
        limit: String(cfg.perPipeline),
      });
      const res = await fetch(`${API}?${params}`, {
        headers: { "User-Agent": "fullbleed-scraper/0.1 (curation; credit + linkback)" },
      });
      if (!res.ok) throw new Error(`Hugging Face "${pipeline}/${sort}" failed: ${res.status}`);
      const models = (await res.json()) as HfModel[];
      for (const m of models) {
        if (m.likes < cfg.minLikes) continue;
        byId.set(m.id, toCandidate(m));
      }
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  return [...byId.values()];
}
