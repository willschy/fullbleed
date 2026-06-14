import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DATA_DIR, REPO_ROOT, loadJson, saveJson } from "./store.js";
import type { Candidate, PenItem } from "./types.js";

// The taste gate, split out from score.ts. It JUDGES (score + keep/kill + category)
// against CURATION.md — it does NOT write the entry copy, so nothing is generated in
// the old corny voice. Run this to scrub the pen down to keepers before the (later,
// voice-gated) writeup pass.

const PEN_PATH = join(DATA_DIR, "pen.json");
const MODEL = "claude-sonnet-4-6";
const KEEP_THRESHOLD = 7;

interface Verdict {
  id: string;
  score: number;
  keep: boolean;
  category: string;
  killReason: string | null;
  summary: string;
}

function systemPrompt(): string {
  const brief = readFileSync(join(REPO_ROOT, "CURATION.md"), "utf8");
  return `You are the taste gate for Full Bleed. Judge ONE candidate against the curation brief below. Be ruthless — the audience sneers at AI slop, so when in doubt, kill it.

${brief}

---

Score the candidate 1-10 for fit with the brief (7+ = worthy of the catalog). Assign the single best-fitting category from exactly: Tools, Automations, Models, Plugins & Skills, Papers. If it scores below 7, give a one-line killReason naming why (e.g. "novelty/entertainment, no use", "AI slop", "stale", "not in English", "no real artifact", "generic, not differentiated").

Respond with ONLY a JSON object, no markdown fence:
{"score": number, "category": string, "killReason": string | null, "summary": string}
summary = one neutral, plain sentence describing what it is (not marketing copy).`;
}

function candidateMessage(c: Candidate): string {
  return JSON.stringify(
    {
      source: c.sourceLabel,
      title: c.title,
      author: c.author,
      [c.signal.label]: c.signal.score,
      url: c.url,
      outboundUrl: c.outboundUrl,
      body: c.body.slice(0, 4000),
    },
    null,
    2,
  );
}

async function judge(client: Anthropic, system: string, c: Candidate): Promise<Verdict> {
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 500,
    system,
    messages: [{ role: "user", content: candidateMessage(c) }],
  });
  const text = res.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  const parsed = JSON.parse(text.replace(/^```(json)?\n?|```$/g, "").trim());
  return {
    id: c.id,
    score: parsed.score,
    keep: parsed.score >= KEEP_THRESHOLD,
    category: parsed.category,
    killReason: parsed.killReason ?? null,
    summary: parsed.summary ?? "",
  };
}

/** Default to a diverse sample (top-by-signal per source) so a calibration run is cheap and representative. */
function sample(items: Candidate[], perSource: number): Candidate[] {
  const bySource = new Map<string, Candidate[]>();
  for (const c of items) {
    const arr = bySource.get(c.source) ?? [];
    arr.push(c);
    bySource.set(c.source, arr);
  }
  const out: Candidate[] = [];
  for (const arr of bySource.values()) {
    arr.sort((a, b) => b.signal.score - a.signal.score);
    out.push(...arr.slice(0, perSource));
  }
  // Always include the canonical "should die" case if it's around.
  const jelly = items.find((c) => /jellyfish/i.test(c.title));
  if (jelly && !out.includes(jelly)) out.push(jelly);
  return out;
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY not set — add it to .env.");
    process.exit(1);
  }
  const pen = loadJson<Record<string, PenItem>>(PEN_PATH, {});
  const items = Object.values(pen).map((p) => p.post);
  if (items.length === 0) {
    console.log("Pen is empty. Run `npm run listen` first.");
    return;
  }

  const all = process.argv.includes("--all");
  const perSource = Number(process.argv.find((a) => /^\d+$/.test(a))) || 3;
  const toJudge = all ? items : sample(items, perSource);

  const system = systemPrompt();
  const client = new Anthropic();
  console.log(`Judging ${toJudge.length} of ${items.length} penned candidates against CURATION.md…\n`);

  const verdicts: Verdict[] = [];
  for (const c of toJudge) {
    try {
      const v = await judge(client, system, c);
      verdicts.push(v);
      console.log(
        `${String(v.score).padStart(2)}/10  ${(v.keep ? "KEEP" : "kill").padEnd(4)}  ${c.sourceLabel.padEnd(15)} ${c.title.slice(0, 52)}`,
      );
      console.log(`          ${v.keep ? "→ " + v.category : "✕ " + (v.killReason ?? "below bar")}`);
    } catch (err) {
      console.error(`judge failed for ${c.id}: ${(err as Error).message}`);
    }
  }

  saveJson(join(DATA_DIR, "verdicts.json"), verdicts);
  const kept = verdicts.filter((v) => v.keep).length;
  console.log(`\n${kept}/${verdicts.length} kept (score ≥ ${KEEP_THRESHOLD}). Saved to data/verdicts.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
