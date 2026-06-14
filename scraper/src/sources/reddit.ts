import { fetchListing, redditToCandidate } from "../reddit.js";
import { redditFlairOk } from "../filters.js";
import type { Candidate, SubredditConfig } from "../types.js";

/**
 * Reddit's "listen" pass. Pulls /new per subreddit, applies the flair allow-list
 * (the one Reddit-specific filter), and maps to Candidates.
 * Returns [] with a note if no API credentials are set, so the rest of the
 * compiler keeps running while the Reddit API approval is pending.
 */
export async function fetchRedditRecent(subreddits: SubredditConfig[]): Promise<Candidate[]> {
  if (!process.env.REDDIT_CLIENT_ID || !process.env.REDDIT_CLIENT_SECRET) {
    console.log("  reddit: skipped (no REDDIT_CLIENT_ID/SECRET yet — API approval pending)");
    return [];
  }

  const out: Candidate[] = [];
  for (const sub of subreddits) {
    const { posts } = await fetchListing(sub.name, "new", { limit: 50 });
    for (const post of posts) {
      if (!redditFlairOk(post.flair, sub.flairs)) continue;
      out.push(redditToCandidate(post));
    }
  }
  return out;
}
