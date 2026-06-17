import type { ProductHuntConfig, Candidate } from "../types.js";

// Product Hunt — the COMMERCIAL intake (launched products, mostly closed/paid,
// which the open-artifact feeds GitHub/HF structurally can't see).
//
// Two paths:
//  • API (preferred): the v2 GraphQL API, vote-ranked and topic-filtered, so we
//    pull POPULAR + RELEVANT tools with real upvote counts and thumbnails.
//    Needs a free developer token in PRODUCTHUNT_TOKEN (producthunt.com → API dashboard).
//  • Feed (fallback, keyless): the public Atom feed — newest launches only, no
//    votes, no topics, keyword-gated. Used until the token is set.
// Either way the Sonnet taste gate is the real filter downstream.

const GRAPHQL = "https://api.producthunt.com/v2/api/graphql";
const FEED = "https://www.producthunt.com/feed";
const UA = "fullbleed-scraper/0.1 (curation; credit + linkback)";

// ── API path: vote-ranked, topic-filtered, recent ──────────────────────────
const QUERY = `query ($topic: String!, $postedAfter: DateTime!, $first: Int!) {
  posts(topic: $topic, order: VOTES, postedAfter: $postedAfter, first: $first) {
    nodes {
      id name tagline description slug url website
      votesCount commentsCount createdAt
      thumbnail { url }
      topics { edges { node { slug } } }
      user { name }
    }
  }
}`;

async function fetchViaApi(cfg: ProductHuntConfig, token: string): Promise<Candidate[]> {
  const postedAfter = new Date(Date.now() - (cfg.postedWithinDays ?? 180) * 86_400_000).toISOString();
  const byId = new Map<string, Candidate>();

  for (const topic of cfg.topics ?? []) {
    const res = await fetch(GRAPHQL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": UA,
      },
      body: JSON.stringify({ query: QUERY, variables: { topic, postedAfter, first: cfg.perTopic ?? 20 } }),
    });
    if (!res.ok) throw new Error(`Product Hunt API "${topic}" failed: ${res.status}`);
    const json = (await res.json()) as any;
    if (json.errors) throw new Error(`Product Hunt API "${topic}": ${json.errors.map((e: any) => e.message).join("; ")}`);

    for (const n of json.data?.posts?.nodes ?? []) {
      if ((n.votesCount ?? 0) < (cfg.minVotes ?? 0)) continue;
      byId.set(n.id, {
        source: "producthunt",
        id: `ph:${n.id}`,
        sourceLabel: "Product Hunt",
        title: n.name,
        author: n.user?.name ?? "Product Hunt",
        createdUtc: Math.floor(Date.parse(n.createdAt) / 1000),
        url: n.url ?? `https://www.producthunt.com/posts/${n.slug}`,
        outboundUrl: n.website ?? n.url ?? null,
        body: [n.tagline, n.description].filter(Boolean).join(" — ").slice(0, 1200),
        thumbnailUrl: n.thumbnail?.url ?? null,
        hasImage: Boolean(n.thumbnail?.url),
        hasVideo: false,
        signal: { score: n.votesCount ?? 0, comments: n.commentsCount ?? 0, label: "upvotes" },
        meta: { slug: n.slug, topics: (n.topics?.edges ?? []).map((e: any) => e.node.slug) },
      });
    }
    await new Promise((r) => setTimeout(r, 600)); // be polite to the API
  }
  return [...byId.values()];
}

// ── Feed fallback: keyless Atom, newest launches, keyword-gated, no votes ────
function decodeXml(s: string): string {
  return s
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, "&");
}
function pick(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? m[1].trim() : "";
}
function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

async function fetchViaFeed(cfg: ProductHuntConfig): Promise<Candidate[]> {
  const res = await fetch(FEED, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Product Hunt feed failed: ${res.status}`);
  const xml = await res.text();
  const mustMatch = (cfg.mustMatch ?? []).map((s) => s.toLowerCase());
  const out: Candidate[] = [];

  for (const block of xml.split("<entry>").slice(1)) {
    const phId = (pick(block, "id").match(/Post\/(\d+)/) ?? [])[1];
    if (!phId) continue;
    const title = decodeXml(pick(block, "title"));
    const alt = block.match(/<link[^>]*rel="alternate"[^>]*href="([^"]+)"/);
    const phUrl = alt ? alt[1] : `https://www.producthunt.com/posts/${phId}`;
    const html = decodeXml(pick(block, "content"));
    const tagline = stripHtml(html.split(/<\/p>/i)[0] ?? "");
    const linkRedirect = html.match(/href="(https:\/\/www\.producthunt\.com\/r\/[^"]+)"/);
    const author = decodeXml(stripHtml(pick(block, "author"))) || "Product Hunt";

    const hay = `${title} ${tagline}`.toLowerCase();
    if (mustMatch.length && !mustMatch.some((k) => new RegExp(`\\b${k}\\b`).test(hay))) continue;

    out.push({
      source: "producthunt",
      id: `ph:${phId}`,
      sourceLabel: "Product Hunt",
      title,
      author,
      createdUtc: Math.floor(Date.parse(pick(block, "published")) / 1000),
      url: phUrl,
      outboundUrl: linkRedirect ? linkRedirect[1] : phUrl,
      body: tagline,
      thumbnailUrl: null,
      hasImage: false,
      hasVideo: false,
      signal: { score: 0, comments: 0, label: "launch" },
      meta: { phId },
    });
  }
  return out.slice(0, cfg.limit ?? 50);
}

// Client-only OAuth: trade the app's API Key + Secret for a read access token.
const OAUTH = "https://api.producthunt.com/v2/oauth/token";
async function bearerFromCredentials(key: string, secret: string): Promise<string> {
  const res = await fetch(OAUTH, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", "User-Agent": UA },
    body: JSON.stringify({ client_id: key, client_secret: secret, grant_type: "client_credentials" }),
  });
  if (!res.ok) throw new Error(`Product Hunt OAuth failed: ${res.status} (check PRODUCTHUNT_KEY / PRODUCTHUNT_SECRET)`);
  const json = (await res.json()) as any;
  if (!json.access_token) throw new Error("Product Hunt OAuth returned no access_token");
  return json.access_token as string;
}

export async function fetchProductHunt(cfg: ProductHuntConfig): Promise<Candidate[]> {
  // Prefer a ready dev token; otherwise exchange the app's key + secret for one.
  let bearer = process.env.PRODUCTHUNT_TOKEN?.trim();
  const key = process.env.PRODUCTHUNT_KEY?.trim();
  const secret = process.env.PRODUCTHUNT_SECRET?.trim();
  if (!bearer && key && secret) bearer = await bearerFromCredentials(key, secret);
  return bearer ? fetchViaApi(cfg, bearer) : fetchViaFeed(cfg);
}
