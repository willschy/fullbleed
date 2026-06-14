import type { ArxivConfig, Candidate } from "../types.js";

// arXiv via its open Atom API (no key, no approval). Feeds the Papers lane.
// Polite usage = max ~1 request / 3s, so we space the queries out.
const API = "https://export.arxiv.org/api/query";

function decodeXml(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function pick(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? decodeXml(m[1]) : "";
}

function parseEntries(xml: string): Candidate[] {
  const out: Candidate[] = [];
  for (const block of xml.split("<entry>").slice(1)) {
    const absUrl = pick(block, "id"); // e.g. http://arxiv.org/abs/2512.16856v1
    if (!absUrl) continue;
    const arxivId = absUrl.replace(/^https?:\/\/arxiv\.org\/abs\//, "");
    const pdf = block.match(/<link[^>]*title="pdf"[^>]*href="([^"]+)"/);
    const firstAuthor = block.match(/<author>\s*<name>([\s\S]*?)<\/name>/);
    const authorCount = (block.match(/<author>/g) ?? []).length;
    const name = firstAuthor ? decodeXml(firstAuthor[1]) : "unknown";
    out.push({
      source: "arxiv",
      id: `arxiv:${arxivId}`,
      sourceLabel: "arXiv",
      title: pick(block, "title"),
      author: authorCount > 1 ? `${name} et al.` : name,
      createdUtc: Math.floor(Date.parse(pick(block, "published")) / 1000),
      url: absUrl.replace(/^http:/, "https:"),
      outboundUrl: pdf ? pdf[1].replace(/^http:/, "https:") : absUrl.replace(/^http:/, "https:"),
      body: pick(block, "summary"),
      thumbnailUrl: null,
      hasImage: false,
      hasVideo: false,
      signal: { score: 0, comments: 0, label: "research" },
      meta: { arxivId },
    });
  }
  return out;
}

export async function fetchArxiv(cfg: ArxivConfig): Promise<Candidate[]> {
  const catFilter = cfg.categories.length ? ` AND (${cfg.categories.map((c) => `cat:${c}`).join(" OR ")})` : "";
  const byId = new Map<string, Candidate>();

  for (const query of cfg.queries) {
    const search = `all:"${query}"${catFilter}`;
    const params = new URLSearchParams({
      search_query: search,
      sortBy: "submittedDate",
      sortOrder: "descending",
      max_results: String(cfg.perQuery),
    });
    const res = await fetch(`${API}?${params}`, {
      headers: { "User-Agent": "fullbleed-scraper/0.1 (curation; credit + linkback)" },
    });
    if (!res.ok) throw new Error(`arXiv "${query}" failed: ${res.status}`);
    for (const c of parseEntries(await res.text())) byId.set(c.id, c);
    await new Promise((r) => setTimeout(r, 3000));
  }

  return [...byId.values()];
}
