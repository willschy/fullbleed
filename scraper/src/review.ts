import { existsSync, readdirSync, renameSync } from "node:fs";
import { join } from "node:path";
import { mkdirSync } from "node:fs";
import { DATA_DIR, loadJson } from "./store.js";
import { publishCandidate } from "./publish.js";
import { loadSeen, markSeen, saveSeen } from "./dedup.js";
import type { ScoredCandidate } from "./types.js";

const REVIEW_DIR = join(DATA_DIR, "review");
const KILLED_DIR = join(DATA_DIR, "killed");

function listCandidates(): { id: string; candidate: ScoredCandidate }[] {
  if (!existsSync(REVIEW_DIR)) return [];
  return readdirSync(REVIEW_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({
      id: f.replace(".json", ""),
      candidate: loadJson<ScoredCandidate>(join(REVIEW_DIR, f), null as never),
    }));
}

async function main() {
  const [, , command, id] = process.argv;
  const items = listCandidates();

  if (!command || command === "list") {
    if (items.length === 0) {
      console.log("Review queue is empty.");
      return;
    }
    for (const { id, candidate: c } of items) {
      console.log(`\n[${id}] ${c.score}/10 · ${c.category} · ${c.post.sourceLabel}`);
      console.log(`  ${c.title}`);
      console.log(`  ${c.hoverWhat}`);
      console.log(`  why: ${c.hoverWhy}`);
      console.log(`  source: ${c.post.url}`);
    }
    console.log(`\n${items.length} awaiting review. Approve: npm run review -- approve <id> · Kill: npm run review -- kill <id>`);
    return;
  }

  const item = items.find((i) => i.id === id);
  if (!item) {
    console.error(`No candidate with id "${id}" in the review queue.`);
    process.exit(1);
  }

  if (command === "approve") {
    const slug = await publishCandidate(item.candidate);
    const seen = loadSeen();
    markSeen(item.candidate.post, seen);
    saveSeen(seen);
    mkdirSync(join(DATA_DIR, "published"), { recursive: true });
    renameSync(join(REVIEW_DIR, `${id}.json`), join(DATA_DIR, "published", `${id}.json`));
    console.log(`Published: site/src/content/entries/${slug}.md`);
    console.log(`Don't forget the creator note → ${item.candidate.post.author} via ${item.candidate.post.url}`);
  } else if (command === "kill") {
    mkdirSync(KILLED_DIR, { recursive: true });
    renameSync(join(REVIEW_DIR, `${id}.json`), join(KILLED_DIR, `${id}.json`));
    const seen = loadSeen();
    markSeen(item.candidate.post, seen);
    saveSeen(seen);
    console.log(`Killed: "${item.candidate.title}" (kept in data/killed/ as calibration data)`);
  } else {
    console.error(`Unknown command "${command}". Use: list | approve <id> | kill <id>`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
