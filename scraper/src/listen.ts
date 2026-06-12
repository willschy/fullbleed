import { join } from "node:path";
import { fetchListing } from "./reddit.js";
import { dumbFilter } from "./filters.js";
import { isDuplicate, loadSeen, markSeen, saveSeen } from "./dedup.js";
import { DATA_DIR, loadConfig, loadJson, saveJson } from "./store.js";
import type { PenItem, SubredditConfig } from "./types.js";

const PEN_PATH = join(DATA_DIR, "pen.json");

async function main() {
  const { subreddits } = loadConfig<{ subreddits: SubredditConfig[] }>("sources.json");
  const { phrases } = loadConfig<{ phrases: string[] }>("blocklist.json");
  const seen = loadSeen();
  const pen = loadJson<Record<string, PenItem>>(PEN_PATH, {});

  let added = 0;
  for (const sub of subreddits) {
    const { posts } = await fetchListing(sub.name, "new", { limit: 50 });
    let subAdded = 0;
    for (const post of posts) {
      if (pen[post.id] || isDuplicate(post, seen)) continue;
      const verdict = dumbFilter(post, sub, phrases);
      if (!verdict.pass) {
        markSeen(post, seen); // killed posts shouldn't be re-evaluated next poll
        continue;
      }
      pen[post.id] = { post, firstSeen: Date.now() };
      subAdded++;
    }
    added += subAdded;
    console.log(`r/${sub.name}: ${posts.length} new posts scanned, ${subAdded} penned`);
  }

  saveSeen(seen);
  saveJson(PEN_PATH, pen);
  console.log(`\nHolding pen: +${added}, total ${Object.keys(pen).length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
