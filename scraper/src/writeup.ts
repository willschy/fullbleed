import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DATA_DIR, REPO_ROOT, loadJson, saveJson } from "./store.js";
import { recencyOk } from "./filters.js";
import type { Candidate, PenItem } from "./types.js";

// The writeup stage. Turns a kept candidate into a real catalog entry (card title
// + digest + body) in the house voice from VOICE.md. Separate from judge.ts (which
// only decides keep/kill) so the corny old voice never touched anything.

const PEN_PATH = join(DATA_DIR, "pen.json");
const MODEL = "claude-sonnet-4-6";
const MAX_AGE_DAYS = 180;

interface Verdict {
  id: string;
  score: number;
  keep: boolean;
  category: string;
  killReason: string | null;
  summary: string;
}

interface Writeup {
  id: string;
  category: string;
  cardTitle: string;
  digest: string;
  bodyMd: string;
}

// The bold-label sections each category gets (from VOICE.md).
const ANATOMY: Record<string, string> = {
  Models: "**What it is.** / **Why it matters.** / **What it improved on.** / **Strengths.** / **Weaknesses.**",
  Tools: "**What it is.** / **Why it matters.** / **How to use it.** (a short, real walkthrough of fitting it into a creative's workflow) / **Limits.**",
  Automations: "**What it is.** / **Why it matters.** / **How to set it up.** (a short, real walkthrough) / **Limits.**",
  "Plugins & Skills": "**What it is.** / **What it plugs into.** / **Why it helps.** / **How to set it up.** / **Limits.**",
  Papers: "**What it is.** (plain language) / **Why it matters.** / **What is new here.**",
};

function systemPrompt(): string {
  const voice = readFileSync(join(REPO_ROOT, "VOICE.md"), "utf8");
  return `${voice}

---

# Your task

Write one catalog entry for the candidate you are given, in the voice and rules above. The category and its section labels are in the user message. Use those exact bold labels, each as its own short paragraph.

Ground every claim in the information provided plus widely known facts. Do NOT invent specific numbers, benchmarks, prices, or hardware requirements that are not supported by the input. When you are unsure of a specific, speak generally and honestly ("the clips run short", "it wants a capable GPU") instead of making up a figure. Always include the honest weaknesses or limits.

Never use negative-parallelism constructions ("not just X, it is Y", "it is not about X, it is about Y") or tailing negations ("no guessing", "no fuss"). State the point directly and plainly instead.

Respond with ONLY a JSON object, no markdown fence:
{"cardTitle": string, "digest": string, "bodyMd": string}
- cardTitle: a few plain words for what the thing is or does. No hype.
- digest: one warm sentence for the card, what it is and why a working creative would care.
- bodyMd: markdown using the category's bold-label sections.`;
}

function userMessage(c: Candidate, category: string, summary?: string): string {
  return `Category: ${category}
Sections to write: ${ANATOMY[category] ?? ANATOMY.Tools}
${summary ? `\nWhat this is (from the curation pass, treat as established fact): ${summary}\n` : ""}
Candidate:
${JSON.stringify(
    {
      source: c.sourceLabel,
      title: c.title,
      author: c.author,
      [c.signal.label]: c.signal.score,
      url: c.url,
      outboundUrl: c.outboundUrl,
      topics: c.meta.topics,
      body: c.body.slice(0, 5000),
    },
    null,
    2,
  )}`;
}

async function writeOne(client: Anthropic, system: string, c: Candidate, category: string, summary?: string): Promise<Writeup> {
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 1500,
    system,
    messages: [{ role: "user", content: userMessage(c, category, summary) }],
  });
  const text = res.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  const p = JSON.parse(text.replace(/^```(json)?\n?|```$/g, "").trim());
  return { id: c.id, category, cardTitle: p.cardTitle, digest: p.digest, bodyMd: p.bodyMd };
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY not set — add it to .env.");
    process.exit(1);
  }
  const verdicts = loadJson<Verdict[]>(join(DATA_DIR, "verdicts.json"), []);
  const pen = loadJson<Record<string, PenItem>>(PEN_PATH, {});
  const post = (id: string): Candidate | undefined => pen[id]?.post;

  let keepers = verdicts.filter((v) => v.keep).filter((v) => {
    const p = post(v.id);
    return p !== undefined && recencyOk(p, MAX_AGE_DAYS);
  });

  const idsArg = process.argv.find((a) => a.startsWith("--ids="));
  if (idsArg) {
    const want = new Set(idsArg.slice("--ids=".length).split(","));
    keepers = keepers.filter((v) => want.has(v.id));
  }

  if (keepers.length === 0) {
    console.log("No matching keepers to write up.");
    return;
  }

  const system = systemPrompt();
  const client = new Anthropic();
  console.log(`Writing ${keepers.length} ${keepers.length === 1 ? "entry" : "entries"}…\n`);

  const summaryById = new Map(verdicts.map((v) => [v.id, v.summary]));

  const out: Writeup[] = [];
  for (const v of keepers) {
    const c = post(v.id);
    if (!c) continue;
    try {
      const w = await writeOne(client, system, c, v.category, summaryById.get(v.id));
      out.push(w);
      console.log(`\n══════ [${w.category}] ${w.cardTitle} ══════`);
      console.log(w.digest);
      console.log("");
      console.log(w.bodyMd);
    } catch (err) {
      console.error(`writeup failed for ${v.id}: ${(err as Error).message}`);
    }
  }

  saveJson(join(DATA_DIR, "writeups.json"), out);
  console.log(`\nWrote ${out.length} entries → data/writeups.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
