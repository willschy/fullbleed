import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DATA_DIR, REPO_ROOT, loadConfig, loadJson, saveJson } from "./store.js";
import type { RedditPost, ScoredCandidate } from "./types.js";

const QUEUE_PATH = join(DATA_DIR, "queue.json");
const MODEL = "claude-sonnet-4-6";
const PUBLISH_THRESHOLD = 7;

interface TagVocab {
  categories: string[];
  tools: string[];
  disciplines: string[];
}

function buildSystemPrompt(vocab: TagVocab): string {
  const voice = readFileSync(join(REPO_ROOT, "VOICE.md"), "utf8");
  return `You are the editorial filter and writer for Full Bleed, a curated catalog of groundbreaking real-world AI work for working creatives.

${voice}

---

# Your task

You receive one Reddit post. Score it 1-10 against this rubric, then (if 7+) write it up in the house voice above.

The rubric — all three must be strong for a 7+:
1. REAL: a real, shipped thing is shown — with the workflow, numbers, or artifact someone could learn from. No demo or "how" = max 4.
2. INTERESTING: visually or conceptually interesting to a working designer, art director, or creative director. Dev-only tooling with no creative application = max 5.
3. SCREENSHOT TEST: would a discerning creative director screenshot this to show a colleague?

Auto-kill (score 1-3): generic wrappers with no craft, pretty image dumps with no application, prompt listicles, posts that are pure self-marketing with no work shown, AI-girlfriend/course/waitlist content.

Category must be exactly one of: ${vocab.categories.join(", ")}. If it doesn't fit one cleanly, kill it (this is the curating mechanism).

Tools must come from this list: ${vocab.tools.join(", ")}. Disciplines from: ${vocab.disciplines.join(", ")}. If a genuinely important tag is missing from the vocabulary, put it in proposedTags instead — never invent tags in the main fields.

Respond with ONLY a JSON object (no markdown fence):
{
  "score": number,
  "killReason": string | null,           // why it dies, if score < 7
  "category": string,
  "title": string,                        // card title: a few words, the outcome not the tool
  "tools": string[],
  "disciplines": string[],
  "proposedTags": string[],
  "hoverWhat": string,                    // exactly two sentences: what this is
  "hoverWhy": string,                     // one line: why it matters to a working creative
  "bodyMd": string,                       // markdown: "## The how" (numbered steps, tools with versions where stated) then "## Run it back" (what you'd need to recreate it). Only claim what the post actually shows.
  "modelVersions": string | null          // e.g. "Flux 1.1, ComfyUI" — versions if stated, else null
}`;
}

function postToUserMessage(post: RedditPost): string {
  return JSON.stringify(
    {
      subreddit: post.subreddit,
      title: post.title,
      author: post.author,
      flair: post.flair,
      upvotes: post.score,
      comments: post.numComments,
      outboundUrl: post.outboundUrl,
      permalink: post.permalink,
      hasImage: post.hasImage,
      hasVideo: post.hasVideo,
      selftext: post.selftext.slice(0, 6000),
    },
    null,
    2,
  );
}

export async function scorePost(client: Anthropic, system: string, post: RedditPost): Promise<ScoredCandidate> {
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system,
    messages: [{ role: "user", content: postToUserMessage(post) }],
  });
  const text = res.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  const parsed = JSON.parse(text.replace(/^```(json)?\n?|```$/g, "").trim());
  return { post, scoredAt: Date.now(), ...parsed };
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY is not set — scoring stage cannot run. Add it to .env or the environment.");
    process.exit(1);
  }
  const vocab = loadConfig<TagVocab>("tags.json");
  const system = buildSystemPrompt(vocab);
  const client = new Anthropic();
  const queue = loadJson<RedditPost[]>(QUEUE_PATH, []);

  if (queue.length === 0) {
    console.log("Scoring queue is empty.");
    return;
  }

  let passed = 0;
  const remaining: RedditPost[] = [];
  for (const post of queue) {
    try {
      const candidate = await scorePost(client, system, post);
      if (candidate.score >= PUBLISH_THRESHOLD) {
        saveJson(join(DATA_DIR, "review", `${post.id}.json`), candidate);
        passed++;
        console.log(`${candidate.score}/10 → REVIEW QUEUE: "${candidate.title}" [${candidate.category}]`);
      } else {
        console.log(`${candidate.score}/10 → killed: "${post.title}" (${candidate.killReason ?? "below bar"})`);
      }
    } catch (err) {
      console.error(`Scoring failed for ${post.id}, keeping in queue:`, err);
      remaining.push(post);
    }
  }

  saveJson(QUEUE_PATH, remaining);
  console.log(`\nScored ${queue.length - remaining.length}, ${passed} passed to review, ${remaining.length} retained after errors`);
}

const isDirectRun = process.argv[1]?.endsWith("score.ts");
if (isDirectRun) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
