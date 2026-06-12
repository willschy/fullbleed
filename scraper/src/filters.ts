import type { RedditPost, SubredditConfig } from "./types.js";

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function dumbFilter(
  post: RedditPost,
  subCfg: SubredditConfig,
  blocklist: string[],
): { pass: boolean; reason: string } {
  if (subCfg.flairs.length > 0 && (!post.flair || !subCfg.flairs.includes(post.flair))) {
    return { pass: false, reason: `flair:${post.flair ?? "none"}` };
  }

  const text = `${post.title} ${post.selftext}`.toLowerCase();
  for (const phrase of blocklist) {
    if (new RegExp(`\\b${escapeRegex(phrase.toLowerCase())}\\b`).test(text)) {
      return { pass: false, reason: `blocklist:${phrase}` };
    }
  }

  const hasDemo = post.hasImage || post.hasVideo || post.outboundUrl !== null;
  if (!hasDemo) return { pass: false, reason: "no-demo" };

  return { pass: true, reason: "ok" };
}
