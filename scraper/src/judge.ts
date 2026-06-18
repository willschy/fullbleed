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
  discipline: string;
  killReason: string | null;
  summary: string;
}

interface LabelCard { title: string; source: string; category: string; discipline?: string; }

// Will's actual keep/kill votes, as few-shot calibration (curation/labels.json from the A/B labeler).
function exemplars(): string {
  try {
    const L = JSON.parse(readFileSync(join(REPO_ROOT, "curation", "labels.json"), "utf8")) as { keeps: LabelCard[]; kills: LabelCard[] };
    const fmt = (a: LabelCard[], n: number) =>
      a.slice(0, n).map((c) => `- [${c.source} · ${c.category}${c.discipline ? " · " + c.discipline : ""}] ${String(c.title).slice(0, 92)}`).join("\n");
    return `\n\n---\n\nTHE CURATOR'S OWN DECISIONS — calibrate your scores so these KEPT examples land 7+ and these KILLED land 5 or below. Match the *pattern*, not just the items.\n\nKEPT (worthy):\n${fmt(L.keeps, 20)}\n\nKILLED (not worthy):\n${fmt(L.kills, 26)}`;
  } catch {
    return "";
  }
}

function systemPrompt(): string {
  const brief = readFileSync(join(REPO_ROOT, "CURATION.md"), "utf8");
  return `You are the taste gate for Full Bleed. Judge ONE candidate against the curation brief and the curator's own decisions below. Be ruthless — the audience sneers at AI slop, so when in doubt, kill it.

${brief}${exemplars()}

---

Score the candidate 1-10 for fit (7+ = worthy of the catalog). Assign the single best Type from exactly: Tools, Automations, Models, Plugins & Skills, Papers. Assign the best Discipline from: Design/UI, Branding, Illustration, Image, 3D, Typography, Motion, Photography (or "none" if it genuinely fits no visual discipline — which is itself a strong kill signal). If it scores below 7, give a one-line killReason (e.g. "audio — out of scope", "general foundation model, no specific creative use", "ML plumbing not a creative tool", "video generation, not a design workflow", "stale", "no real artifact", "generic").

Respond with ONLY a JSON object, no markdown fence:
{"score": number, "category": string, "discipline": string, "killReason": string | null, "summary": string}
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
      body: c.body.slice(0, 1500),
    },
    null,
    2,
  );
}

async function judge(client: Anthropic, system: string, c: Candidate): Promise<Verdict> {
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 500,
    // cache the (identical) brief + few-shot block so only the first call pays for it
    system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: candidateMessage(c) }],
  });
  const text = res.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  const parsed = JSON.parse(text.replace(/^```(json)?\n?|```$/g, "").trim());
  return {
    id: c.id,
    score: parsed.score,
    keep: parsed.score >= KEEP_THRESHOLD,
    category: parsed.category,
    discipline: parsed.discipline ?? "",
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

// run fn over items with at most `n` in flight at once
async function mapPool<T, R>(items: T[], n: number, fn: (x: T, i: number) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (true) {
        const i = next++;
        if (i >= items.length) break;
        out[i] = await fn(items[i], i);
      }
    }),
  );
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
  const resume = process.argv.includes("--resume"); // keep existing verdicts, judge only the gaps
  const perSource = Number(process.argv.find((a) => /^\d+$/.test(a))) || 3;
  const existing = resume ? loadJson<Verdict[]>(join(DATA_DIR, "verdicts.json"), []) : [];
  const have = new Set(existing.map((v) => v.id));
  const toJudge = (all ? items : sample(items, perSource)).filter((c) => !have.has(c.id));

  const system = systemPrompt();
  const client = new Anthropic({ maxRetries: 8 }); // back off + retry through 429s
  console.log(`Judging ${toJudge.length} of ${items.length} penned candidates against CURATION.md…\n`);

  let done = 0;
  const runOne = async (c: Candidate): Promise<Verdict | null> => {
    try {
      const v = await judge(client, system, c);
      done++;
      console.log(
        `${String(done).padStart(3)}/${toJudge.length}  ${String(v.score).padStart(2)}/10  ${(v.keep ? "KEEP" : "kill").padEnd(4)}  ${c.sourceLabel.padEnd(14)} ${c.title.slice(0, 46)}`,
      );
      return v;
    } catch (err) {
      console.error(`judge failed for ${c.id}: ${(err as Error).message}`);
      return null;
    }
  };
  // warm the prompt cache with one call, then fan out (gently, to stay under the rate limit)
  const head = toJudge.length ? [await runOne(toJudge[0])] : [];
  const tail = await mapPool(toJudge.slice(1), 4, runOne);
  const fresh = [...head, ...tail].filter((v): v is Verdict => v !== null);
  const verdicts = [...existing, ...fresh];

  saveJson(join(DATA_DIR, "verdicts.json"), verdicts);
  const kept = verdicts.filter((v) => v.keep).length;
  console.log(`\n${kept}/${verdicts.length} kept (score ≥ ${KEEP_THRESHOLD}). Saved to data/verdicts.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
