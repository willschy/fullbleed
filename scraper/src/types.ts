// ──────────────────────────────────────────────────────────────────────────
// The compiler: many sources, one currency.
// Every adapter normalizes its site's posts into a `Candidate`. Every stage
// downstream of the catch (dedup, dumb-filter, pen, scoring, publish) is
// source-agnostic and only ever sees `Candidate`.
// ──────────────────────────────────────────────────────────────────────────

export type SourceId = "reddit" | "hackernews" | "github" | "arena" | "arxiv" | "huggingface" | "hfpapers";

export interface CandidateSignal {
  /** Primary popularity number: upvotes / points / stars. 0 for pure-curation sources. */
  score: number;
  /** Secondary engagement: comments / forks. 0 if N/A. */
  comments: number;
  /** What `score` actually counts, for display: "upvotes" | "points" | "stars" | "curated". */
  label: string;
}

export interface Candidate {
  source: SourceId;
  /** Globally unique, namespaced: "reddit:abc123", "hn:48521284", "gh:owner/repo", "arena:3235876". */
  id: string;
  /** Human-readable origin: "r/comfyui", "Show HN", "GitHub", "Are.na · artificial-intelligence". */
  sourceLabel: string;
  title: string;
  author: string;
  /** Unix seconds. */
  createdUtc: number;
  /** Canonical page on the source itself (the permalink we credit + link back to). */
  url: string;
  /** The actual work/demo being shown. May equal `url`, or be null if there's none. */
  outboundUrl: string | null;
  /** Selftext / description / readme excerpt — whatever prose the source gives us. */
  body: string;
  thumbnailUrl: string | null;
  hasImage: boolean;
  hasVideo: boolean;
  signal: CandidateSignal;
  /** Source-specific extras the generic stages don't need but later ones might (flair, topics, stars…). */
  meta: Record<string, unknown>;
}

/** A source that can be polled for fresh candidates during a `listen` pass. */
export interface Source {
  id: SourceId;
  label: string;
  fetch: () => Promise<Candidate[]>;
}

// ── Config shapes (scraper/config/sources.json) ────────────────────────────

export interface SubredditConfig {
  name: string;
  flairs: string[];
  minScore: number;
  minVelocity: number;
}

export interface RedditConfig {
  enabled?: boolean;
  subreddits: SubredditConfig[];
}

export interface HackerNewsConfig {
  enabled?: boolean;
  /** Algolia tag streams to pull, e.g. ["show_hn", "story"]. */
  streams: string[];
  minPoints: number;
  /** Keep only items whose title/body/url contains one of these (HN is a general feed). */
  mustMatch: string[];
  lookbackHours: number;
  perStream: number;
}

export interface GitHubConfig {
  enabled?: boolean;
  /** Search expressions, e.g. "comfyui custom node", "ai design tool". */
  queries: string[];
  minStars: number;
  createdWithinDays: number;
  perQuery: number;
}

export interface ArenaConfig {
  enabled?: boolean;
  /** Channel slugs to harvest, e.g. ["artificial-intelligence"]. Human curation is the signal. */
  channels: string[];
  perChannel: number;
}

export interface ArxivConfig {
  enabled?: boolean;
  /** Keyword searches, e.g. "virtual try-on", "consistent character". */
  queries: string[];
  /** Optional category constraint, e.g. ["cs.CV", "cs.GR"]; empty = all categories. */
  categories: string[];
  perQuery: number;
}

export interface HuggingFaceConfig {
  enabled?: boolean;
  /** Creative pipeline tags to pull, e.g. ["text-to-image", "text-to-video"]. */
  pipelines: string[];
  minLikes: number;
  perPipeline: number;
}

export interface HfPapersConfig {
  enabled?: boolean;
  /** Upvote floor — the notability signal raw arXiv lacks. */
  minUpvotes: number;
  /** How many recent daily papers to scan before filtering. */
  limit: number;
}

/** Cross-cutting catch-time gates from the curation brief. */
export interface FiltersConfig {
  /** Hard recency ceiling — nothing older than this ever enters the pen. */
  maxAgeDays: number;
  /** Drop candidates whose title/body reads as non-English. */
  englishOnly: boolean;
}

export interface SourcesConfig {
  filters?: FiltersConfig;
  reddit?: RedditConfig;
  hackernews?: HackerNewsConfig;
  github?: GitHubConfig;
  arena?: ArenaConfig;
  arxiv?: ArxivConfig;
  huggingface?: HuggingFaceConfig;
  hfpapers?: HfPapersConfig;
}

// ── Reddit's raw shape (used only inside the Reddit adapter + backfill) ─────

export interface RedditPost {
  id: string;
  fullname: string;
  subreddit: string;
  title: string;
  author: string;
  createdUtc: number;
  score: number;
  numComments: number;
  flair: string | null;
  permalink: string;
  outboundUrl: string | null;
  selftext: string;
  thumbnailUrl: string | null;
  hasImage: boolean;
  hasVideo: boolean;
}

// ── Pipeline state ─────────────────────────────────────────────────────────

export interface PenItem {
  post: Candidate;
  firstSeen: number;
}

export interface ScoredCandidate {
  post: Candidate;
  score: number;
  killReason: string | null;
  category: string;
  title: string;
  tools: string[];
  disciplines: string[];
  proposedTags: string[];
  hoverWhat: string;
  hoverWhy: string;
  bodyMd: string;
  modelVersions: string | null;
  scoredAt: number;
}
