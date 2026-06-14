import type { ArenaConfig, Candidate } from "../types.js";

// Are.na, harvested from curated channels. There are no votes here — a human
// chose to add the block, and that curation IS the signal. (Are.na's search
// endpoint is Cloudflare-gated against bots; channel contents are open with a UA.)
const API = "https://api.are.na/v2";
const UA = "Mozilla/5.0 (Macintosh; fullbleed-curation; credit + linkback)";

interface ArenaBlock {
  id: number;
  class: string; // Image | Link | Media | Text | Attachment
  title: string | null;
  generated_title: string | null;
  description: string | null;
  created_at: string;
  comment_count: number | null;
  source: { url: string | null } | null;
  image: { thumb?: { url: string }; display?: { url: string } } | null;
  user: { slug: string; username: string } | null;
}

function toCandidate(block: ArenaBlock, slug: string): Candidate {
  const outbound = block.source?.url ?? null;
  const thumb = block.image?.display?.url ?? block.image?.thumb?.url ?? null;
  return {
    source: "arena",
    id: `arena:${block.id}`,
    sourceLabel: `Are.na · ${slug}`,
    title: block.title || block.generated_title || "(untitled block)",
    author: block.user?.username ?? slug,
    createdUtc: Math.floor(Date.parse(block.created_at) / 1000),
    url: `https://www.are.na/block/${block.id}`,
    outboundUrl: outbound,
    body: block.description ?? "",
    thumbnailUrl: thumb,
    hasImage: Boolean(block.image),
    hasVideo: block.class === "Media",
    signal: { score: 0, comments: block.comment_count ?? 0, label: "curated" },
    meta: { channel: slug, class: block.class },
  };
}

export async function fetchArena(cfg: ArenaConfig): Promise<Candidate[]> {
  const out: Candidate[] = [];

  for (const slug of cfg.channels) {
    const params = new URLSearchParams({ per: String(cfg.perChannel), direction: "desc" });
    const res = await fetch(`${API}/channels/${slug}/contents?${params}`, {
      headers: { "User-Agent": UA },
    });
    if (!res.ok) throw new Error(`Are.na channel "${slug}" failed: ${res.status}`);
    const json = (await res.json()) as { contents: ArenaBlock[] | null };
    for (const block of json.contents ?? []) {
      // Only blocks that point at real work or carry an image — skip pure text notes.
      if (block.class === "Text") continue;
      if (!block.source?.url && !block.image) continue;
      out.push(toCandidate(block, slug));
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  return out;
}
