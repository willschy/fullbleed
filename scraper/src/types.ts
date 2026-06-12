export interface SubredditConfig {
  name: string;
  flairs: string[];
  minScore: number;
  minVelocity: number;
}

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

export interface PenItem {
  post: RedditPost;
  firstSeen: number;
}

export interface ScoredCandidate {
  post: RedditPost;
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
