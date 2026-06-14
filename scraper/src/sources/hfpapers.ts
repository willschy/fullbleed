import type { Candidate, HfPapersConfig } from "../types.js";

// Hugging Face daily papers — the same papers as arXiv, but ranked by community
// upvotes. That buzz is the notability signal raw arXiv lacks: landmark releases
// get hundreds of upvotes, incremental ones get none. Feeds the Papers lane.
const API = "https://huggingface.co/api/daily_papers";

interface HfPaperItem {
  thumbnail?: string;
  numComments?: number;
  paper: {
    id: string; // arXiv id
    title: string;
    summary: string;
    upvotes: number;
    publishedAt: string;
    authors: { name: string }[];
    ai_keywords?: string[];
  };
}

function toCandidate(item: HfPaperItem): Candidate {
  const p = item.paper;
  const name = p.authors[0]?.name ?? "unknown";
  return {
    source: "hfpapers",
    id: `hfpaper:${p.id}`,
    sourceLabel: "HF Papers",
    title: p.title.replace(/\s+/g, " ").trim(),
    author: p.authors.length > 1 ? `${name} et al.` : name,
    createdUtc: Math.floor(Date.parse(p.publishedAt) / 1000),
    url: `https://huggingface.co/papers/${p.id}`,
    outboundUrl: `https://arxiv.org/abs/${p.id}`,
    body: p.summary,
    thumbnailUrl: item.thumbnail ?? null,
    hasImage: Boolean(item.thumbnail),
    hasVideo: false,
    signal: { score: p.upvotes ?? 0, comments: item.numComments ?? 0, label: "upvotes" },
    meta: { arxivId: p.id, keywords: p.ai_keywords ?? [] },
  };
}

export async function fetchHfPapers(cfg: HfPapersConfig): Promise<Candidate[]> {
  const params = new URLSearchParams({ limit: String(cfg.limit) });
  const res = await fetch(`${API}?${params}`, {
    headers: { "User-Agent": "fullbleed-scraper/0.1 (curation; credit + linkback)" },
  });
  if (!res.ok) throw new Error(`HF daily papers failed: ${res.status}`);
  const items = (await res.json()) as HfPaperItem[];
  return items
    .filter((it) => it.paper && (it.paper.upvotes ?? 0) >= cfg.minUpvotes)
    .map(toCandidate);
}
