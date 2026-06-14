import { join } from "node:path";
import { fetchByFullnames, redditToCandidate } from "./reddit.js";
import { DATA_DIR, loadConfig, loadJson, saveJson } from "./store.js";
import type { Candidate, PenItem, SourcesConfig, SubredditConfig } from "./types.js";

const PEN_PATH = join(DATA_DIR, "pen.json");
const QUEUE_PATH = join(DATA_DIR, "queue.json");
const PEN_MAX_AGE_HOURS = 48;

/**
 * Decide whether a penned candidate has earned a spot in the scoring queue.
 * Reddit promotes on velocity (a fast riser in a small sub beats a slow burner
 * in a big one). The pre-scored sources arrive already carrying their traction
 * number, so they promote once it clears the source's floor.
 */
function promoteVerdict(c: Candidate, cfg: SourcesConfig, subs: Map<string, SubredditConfig>): boolean {
  switch (c.source) {
    case "reddit": {
      const sub = subs.get(String(c.meta.subreddit).toLowerCase());
      if (!sub) return false;
      const ageHours = (Date.now() / 1000 - c.createdUtc) / 3600;
      const velocity = ageHours > 0.5 ? c.signal.score / ageHours : 0;
      return c.signal.score >= sub.minScore || velocity >= sub.minVelocity;
    }
    case "hackernews":
      return c.signal.score >= (cfg.hackernews?.minPoints ?? 0);
    case "github":
      return c.signal.score >= (cfg.github?.minStars ?? 0);
    case "arena":
      return true; // a human already curated it; the taste gate does the rest
    case "arxiv":
      return true; // relevance-gated by search query at catch; the taste gate ranks
    case "huggingface":
      return c.signal.score >= (cfg.huggingface?.minLikes ?? 0);
    case "hfpapers":
      return c.signal.score >= (cfg.hfpapers?.minUpvotes ?? 0);
  }
}

async function main() {
  const config = loadConfig<SourcesConfig>("sources.json");
  const subs = new Map((config.reddit?.subreddits ?? []).map((s) => [s.name.toLowerCase(), s]));
  const pen = loadJson<Record<string, PenItem>>(PEN_PATH, {});
  const queue = loadJson<Candidate[]>(QUEUE_PATH, []);
  const queued = new Set(queue.map((c) => c.id));

  const items = Object.values(pen);
  if (items.length === 0) {
    console.log("Holding pen is empty.");
    return;
  }

  // Refresh Reddit items in one batch so velocity reflects current vote counts.
  const redditFullnames = items
    .filter((i) => i.post.source === "reddit")
    .map((i) => String(i.post.meta.fullname))
    .filter(Boolean);
  if (redditFullnames.length > 0) {
    try {
      for (const fresh of await fetchByFullnames(redditFullnames)) {
        const refreshed = redditToCandidate(fresh);
        if (pen[refreshed.id]) pen[refreshed.id].post = refreshed;
      }
    } catch (err) {
      console.error(`Reddit refresh skipped: ${(err as Error).message}`);
    }
  }

  let promoted = 0;
  let expired = 0;
  for (const { post } of Object.values(pen)) {
    if (queued.has(post.id)) {
      delete pen[post.id];
      continue;
    }
    const ageHours = (Date.now() / 1000 - post.createdUtc) / 3600;
    if (promoteVerdict(post, config, subs)) {
      queue.push(post);
      queued.add(post.id);
      delete pen[post.id];
      promoted++;
      const v = post.signal.score;
      console.log(`PROMOTED [${post.sourceLabel}] "${post.title.slice(0, 70)}" (${v} ${post.signal.label})`);
    } else if (ageHours > PEN_MAX_AGE_HOURS) {
      delete pen[post.id];
      expired++;
    }
  }

  saveJson(PEN_PATH, pen);
  saveJson(QUEUE_PATH, queue);
  console.log(`\nPromoted ${promoted}, expired ${expired}, still penned ${Object.keys(pen).length}, scoring queue ${queue.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
