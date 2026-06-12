import { join } from "node:path";
import { fetchListing } from "./reddit.js";
import { dumbFilter } from "./filters.js";
import { isDuplicate, loadSeen, markSeen, saveSeen } from "./dedup.js";
import { DATA_DIR, loadConfig, loadJson, saveJson } from "./store.js";
import type { RedditPost, SubredditConfig } from "./types.js";

const QUEUE_PATH = join(DATA_DIR, "queue.json");
const PAGES = 2; // 2 x 100 = top ~200 posts of the year per subreddit

async function main() {
  const dry = process.argv.includes("--dry");
  const { subreddits } = loadConfig<{ subreddits: SubredditConfig[] }>("sources.json");
  const { phrases } = loadConfig<{ phrases: string[] }>("blocklist.json");
  const seen = loadSeen();
  const queue = loadJson<RedditPost[]>(QUEUE_PATH, []);
  const queued = new Set(queue.map((p) => p.id));

  console.log(`Backfill${dry ? " (dry run)" : ""}: top posts of the past year\n`);
  let totalCandidates = 0;

  for (const sub of subreddits) {
    let after: string | undefined;
    let scanned = 0;
    let candidates = 0;
    const killCounts: Record<string, number> = {};

    for (let page = 0; page < PAGES; page++) {
      const res = await fetchListing(sub.name, "top", { limit: 100, t: "year", after });
      scanned += res.posts.length;

      for (const post of res.posts) {
        if (queued.has(post.id) || isDuplicate(post, seen)) continue;
        const verdict = dumbFilter(post, sub, phrases);
        if (!verdict.pass) {
          killCounts[verdict.reason.split(":")[0]] = (killCounts[verdict.reason.split(":")[0]] ?? 0) + 1;
          continue;
        }
        if (post.score < sub.minScore) {
          killCounts["below-threshold"] = (killCounts["below-threshold"] ?? 0) + 1;
          continue;
        }
        candidates++;
        if (!dry) {
          queue.push(post);
          queued.add(post.id);
          markSeen(post, seen);
        }
      }

      if (!res.after) break;
      after = res.after;
      await new Promise((r) => setTimeout(r, 1100)); // stay polite without OAuth
    }

    totalCandidates += candidates;
    const kills = Object.entries(killCounts).map(([k, v]) => `${k}:${v}`).join(" ");
    console.log(`r/${sub.name}: ${scanned} scanned → ${candidates} candidates (killed ${kills || "none"})`);
  }

  if (!dry) {
    saveSeen(seen);
    saveJson(QUEUE_PATH, queue);
  }
  console.log(`\n${totalCandidates} candidates ${dry ? "would enter" : "added to"} the scoring queue${dry ? "" : ` (now ${queue.length})`}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
