import type { Candidate, HackerNewsConfig } from "../types.js";

// Hacker News via the free, no-auth Algolia API. HN is a general feed, so we
// pull recent items per tag stream and keep only AI/creative-relevant ones.
const ALGOLIA = "https://hn.algolia.com/api/v1/search_by_date";

interface AlgoliaHit {
  objectID: string;
  title: string | null;
  url: string | null;
  author: string;
  points: number | null;
  num_comments: number | null;
  created_at_i: number;
  story_text: string | null;
  _tags: string[];
}

function matchesInterest(hit: AlgoliaHit, mustMatch: string[]): boolean {
  // Show HN is already "someone built and shipped a thing" — pre-qualified, so we
  // let the taste gate judge it rather than gating on keywords here. The general
  // "story" firehose must clear the creative-tool keyword list (keeps news out).
  if (hit._tags.includes("show_hn")) return true;
  if (mustMatch.length === 0) return true;
  const hay = `${hit.title ?? ""} ${hit.url ?? ""} ${hit.story_text ?? ""}`.toLowerCase();
  return mustMatch.some((kw) => hay.includes(kw.toLowerCase()));
}

function toCandidate(hit: AlgoliaHit): Candidate {
  const isShow = hit._tags.includes("show_hn");
  return {
    source: "hackernews",
    id: `hn:${hit.objectID}`,
    sourceLabel: isShow ? "Show HN" : "Hacker News",
    title: (hit.title ?? "").replace(/^Show HN:\s*/i, ""),
    author: hit.author,
    createdUtc: hit.created_at_i,
    url: `https://news.ycombinator.com/item?id=${hit.objectID}`,
    outboundUrl: hit.url ?? null,
    body: hit.story_text ?? "",
    thumbnailUrl: null, // HN carries no media; a thumbnail is derived from the link at publish time
    hasImage: false,
    hasVideo: false,
    signal: { score: hit.points ?? 0, comments: hit.num_comments ?? 0, label: "points" },
    meta: { tags: hit._tags },
  };
}

export async function fetchHackerNews(cfg: HackerNewsConfig): Promise<Candidate[]> {
  const cutoff = Math.floor(Date.now() / 1000) - cfg.lookbackHours * 3600;
  const byId = new Map<string, Candidate>();

  for (const stream of cfg.streams) {
    const params = new URLSearchParams({
      tags: stream,
      numericFilters: `points>=${cfg.minPoints},created_at_i>=${cutoff}`,
      hitsPerPage: String(cfg.perStream),
    });
    const res = await fetch(`${ALGOLIA}?${params}`, {
      headers: { "User-Agent": "fullbleed-scraper/0.1 (curation; credit + linkback)" },
    });
    if (!res.ok) throw new Error(`HN ${stream} failed: ${res.status}`);
    const json = (await res.json()) as { hits: AlgoliaHit[] };
    for (const hit of json.hits) {
      if (!hit.title || !matchesInterest(hit, cfg.mustMatch)) continue;
      byId.set(hit.objectID, toCandidate(hit)); // last write wins; show_hn label preferred if duplicated
    }
  }

  return [...byId.values()];
}
