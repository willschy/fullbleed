import type { Candidate, RedditPost } from "./types.js";

const UA = "macos:fullbleed-scraper:v0.1 (curation pipeline with credit + linkback)";

let oauthToken: { value: string; expiresAt: number } | null = null;

async function getOauthToken(): Promise<string | null> {
  const id = process.env.REDDIT_CLIENT_ID;
  const secret = process.env.REDDIT_CLIENT_SECRET;
  if (!id || !secret) return null;
  if (oauthToken && Date.now() < oauthToken.expiresAt - 60_000) return oauthToken.value;

  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": UA,
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`Reddit OAuth failed: ${res.status}`);
  const json = (await res.json()) as { access_token: string; expires_in: number };
  oauthToken = { value: json.access_token, expiresAt: Date.now() + json.expires_in * 1000 };
  return oauthToken.value;
}

async function redditGet(path: string, params: Record<string, string>): Promise<any> {
  const token = await getOauthToken();
  const qs = new URLSearchParams({ ...params, raw_json: "1" }).toString();
  const url = token
    ? `https://oauth.reddit.com${path}?${qs}`
    : `https://www.reddit.com${path}.json?${qs}`;
  const headers: Record<string, string> = { "User-Agent": UA };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { headers });
  if (res.status === 403 && !token) {
    throw new Error(
      "Reddit blocks unauthenticated access. Create a free script app at https://www.reddit.com/prefs/apps " +
        "and set REDDIT_CLIENT_ID + REDDIT_CLIENT_SECRET in .env (see .env.example).",
    );
  }
  if (!res.ok) throw new Error(`Reddit GET ${path} failed: ${res.status}`);
  return res.json();
}

function pickPreview(d: any): string | null {
  const img = d.preview?.images?.[0];
  if (!img) {
    return d.thumbnail?.startsWith("http") ? d.thumbnail : null;
  }
  const candidates = [...(img.resolutions ?? []), img.source].filter(Boolean);
  // closest to 960px wide without going wildly over
  candidates.sort((a: any, b: any) => Math.abs(a.width - 960) - Math.abs(b.width - 960));
  return candidates[0]?.url ?? null;
}

function normalize(d: any): RedditPost {
  const permalink = `https://www.reddit.com${d.permalink}`;
  const rawUrl: string = d.url ?? "";
  const isSelfLink = !rawUrl || rawUrl.includes(d.permalink) || d.is_self;
  return {
    id: d.id,
    fullname: d.name,
    subreddit: d.subreddit,
    title: d.title,
    author: d.author,
    createdUtc: d.created_utc,
    score: d.score,
    numComments: d.num_comments,
    flair: d.link_flair_text ?? null,
    permalink,
    outboundUrl: isSelfLink ? null : rawUrl,
    selftext: d.selftext ?? "",
    thumbnailUrl: pickPreview(d),
    hasImage: d.post_hint === "image" || Boolean(d.preview?.images?.length) || Boolean(d.is_gallery),
    hasVideo: Boolean(d.is_video),
  };
}

export async function fetchListing(
  subreddit: string,
  sort: "new" | "top",
  opts: { limit?: number; t?: string; after?: string } = {},
): Promise<{ posts: RedditPost[]; after: string | null }> {
  const params: Record<string, string> = { limit: String(opts.limit ?? 50) };
  if (opts.t) params.t = opts.t;
  if (opts.after) params.after = opts.after;
  const json = await redditGet(`/r/${subreddit}/${sort}`, params);
  return {
    posts: json.data.children.map((c: any) => normalize(c.data)),
    after: json.data.after ?? null,
  };
}

export async function fetchByFullnames(fullnames: string[]): Promise<RedditPost[]> {
  const out: RedditPost[] = [];
  for (let i = 0; i < fullnames.length; i += 100) {
    const chunk = fullnames.slice(i, i + 100);
    const json = await redditGet("/api/info", { id: chunk.join(",") });
    out.push(...json.data.children.map((c: any) => normalize(c.data)));
  }
  return out;
}

/** Map Reddit's raw shape into the source-agnostic Candidate currency. */
export function redditToCandidate(p: RedditPost): Candidate {
  return {
    source: "reddit",
    id: `reddit:${p.id}`,
    sourceLabel: `r/${p.subreddit}`,
    title: p.title,
    author: p.author,
    createdUtc: p.createdUtc,
    url: p.permalink,
    outboundUrl: p.outboundUrl,
    body: p.selftext,
    thumbnailUrl: p.thumbnailUrl,
    hasImage: p.hasImage,
    hasVideo: p.hasVideo,
    signal: { score: p.score, comments: p.numComments, label: "upvotes" },
    meta: { subreddit: p.subreddit, flair: p.flair, fullname: p.fullname },
  };
}
