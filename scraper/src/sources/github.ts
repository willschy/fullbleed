import type { Candidate, GitHubConfig } from "../types.js";

// GitHub repo search. Works unauthenticated (10 search req/min); a GITHUB_TOKEN
// in .env raises that to 30/min. Stars are the traction signal.
const SEARCH = "https://api.github.com/search/repositories";

interface Repo {
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  created_at: string;
  pushed_at: string;
  owner: { login: string };
}

function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
}

function toCandidate(r: Repo): Candidate {
  return {
    source: "github",
    id: `gh:${r.full_name}`,
    sourceLabel: "GitHub",
    title: r.description ? `${r.full_name} — ${r.description}` : r.full_name,
    author: r.owner.login,
    createdUtc: Math.floor(Date.parse(r.created_at) / 1000),
    url: r.html_url,
    outboundUrl: r.homepage || r.html_url,
    body: r.description ?? "",
    // GitHub renders a repo OG card we can use as a clean, consistent thumbnail.
    thumbnailUrl: `https://opengraph.githubassets.com/1/${r.full_name}`,
    hasImage: true,
    hasVideo: false,
    signal: { score: r.stargazers_count, comments: r.forks_count, label: "stars" },
    meta: { topics: r.topics, pushedAt: r.pushed_at, homepage: r.homepage },
  };
}

export async function fetchGitHub(cfg: GitHubConfig): Promise<Candidate[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "fullbleed-scraper/0.1 (curation; credit + linkback)",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const since = isoDaysAgo(cfg.createdWithinDays);
  const byId = new Map<string, Candidate>();

  for (const query of cfg.queries) {
    const q = `${query} created:>${since} stars:>=${cfg.minStars}`;
    const params = new URLSearchParams({ q, sort: "stars", order: "desc", per_page: String(cfg.perQuery) });
    const res = await fetch(`${SEARCH}?${params}`, { headers });
    if (!res.ok) throw new Error(`GitHub search "${query}" failed: ${res.status}`);
    const json = (await res.json()) as { items: Repo[] };
    for (const repo of json.items) byId.set(repo.full_name, toCandidate(repo));
    await new Promise((r) => setTimeout(r, 1000)); // politeness; stays under the rate cap
  }

  return [...byId.values()];
}
