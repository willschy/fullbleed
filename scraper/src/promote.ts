import { join } from "node:path";
import { fetchByFullnames } from "./reddit.js";
import { DATA_DIR, loadConfig, loadJson, saveJson } from "./store.js";
import type { PenItem, RedditPost, SubredditConfig } from "./types.js";

const PEN_PATH = join(DATA_DIR, "pen.json");
const QUEUE_PATH = join(DATA_DIR, "queue.json");
const PEN_MAX_AGE_HOURS = 48;

async function main() {
  const { subreddits } = loadConfig<{ subreddits: SubredditConfig[] }>("sources.json");
  const cfgByName = new Map(subreddits.map((s) => [s.name.toLowerCase(), s]));
  const pen = loadJson<Record<string, PenItem>>(PEN_PATH, {});
  const queue = loadJson<RedditPost[]>(QUEUE_PATH, []);
  const queued = new Set(queue.map((p) => p.id));

  const ids = Object.values(pen).map((item) => item.post.fullname);
  if (ids.length === 0) {
    console.log("Holding pen is empty.");
    return;
  }

  const fresh = await fetchByFullnames(ids);
  let promoted = 0;
  let expired = 0;

  for (const post of fresh) {
    const cfg = cfgByName.get(post.subreddit.toLowerCase());
    if (!cfg || !pen[post.id]) continue;

    const ageHours = (Date.now() / 1000 - post.createdUtc) / 3600;
    const velocity = ageHours > 0.5 ? post.score / ageHours : 0;
    const hasTraction = post.score >= cfg.minScore || velocity >= cfg.minVelocity;

    if (hasTraction && !queued.has(post.id)) {
      queue.push(post);
      delete pen[post.id];
      promoted++;
      console.log(`PROMOTED r/${post.subreddit}: "${post.title}" (${post.score} pts, ${velocity.toFixed(1)}/hr)`);
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
