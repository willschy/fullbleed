import { join } from "node:path";
import { buildSources } from "./sources/index.js";
import { dumbFilter, looksEnglish, recencyOk } from "./filters.js";
import { isDuplicate, loadSeen, markSeen, saveSeen } from "./dedup.js";
import { DATA_DIR, loadConfig, loadJson, saveJson } from "./store.js";
import type { PenItem, SourcesConfig } from "./types.js";

const PEN_PATH = join(DATA_DIR, "pen.json");

async function main() {
  const config = loadConfig<SourcesConfig>("sources.json");
  const { phrases } = loadConfig<{ phrases: string[] }>("blocklist.json");
  const seen = loadSeen();
  const pen = loadJson<Record<string, PenItem>>(PEN_PATH, {});
  const filters = config.filters ?? { maxAgeDays: 180, englishOnly: true };

  const sources = buildSources(config);
  if (sources.length === 0) {
    console.log("No sources enabled in config/sources.json.");
    return;
  }

  let added = 0;
  for (const source of sources) {
    const kills = { stale: 0, nonEnglish: 0, dumb: 0 };
    let scanned = 0;
    let penned = 0;
    try {
      const candidates = await source.fetch();
      scanned = candidates.length;
      for (const c of candidates) {
        if (pen[c.id] || isDuplicate(c, seen)) continue;
        // Hard brief gates first, cheapest/most-decisive: recency, then language.
        if (!recencyOk(c, filters.maxAgeDays)) { markSeen(c, seen); kills.stale++; continue; }
        if (filters.englishOnly && !looksEnglish(`${c.title} ${c.body}`)) { markSeen(c, seen); kills.nonEnglish++; continue; }
        const verdict = dumbFilter(c, phrases);
        if (!verdict.pass) { markSeen(c, seen); kills.dumb++; continue; }
        pen[c.id] = { post: c, firstSeen: Date.now() };
        penned++;
      }
      added += penned;
      console.log(`${source.label}: ${scanned} scanned, ${penned} penned (killed — stale ${kills.stale}, non-EN ${kills.nonEnglish}, dumb ${kills.dumb})`);
    } catch (err) {
      // One source failing (rate limit, outage, missing creds) must not sink the rest.
      console.error(`${source.label}: FAILED — ${(err as Error).message}`);
    }
  }

  saveSeen(seen);
  saveJson(PEN_PATH, pen);
  console.log(`\nHolding pen: +${added}, total ${Object.keys(pen).length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
