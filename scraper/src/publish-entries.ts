import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { stringify as yamlStringify } from "yaml";
import { DATA_DIR, REPO_ROOT, loadJson } from "./store.js";
import type { Candidate, PenItem } from "./types.js";

// Publishes the writeups (judge-passed, voiced) into the Astro site as entry .md
// files, with a downloaded thumbnail where one exists. New flow:
// listen -> judge -> writeup -> publish-entries. (The old score/review/publish.ts
// path is the legacy Reddit-era flow.)

const ENTRIES_DIR = join(REPO_ROOT, "site", "src", "content", "entries");

const CATEGORY_SLUG: Record<string, string> = {
  Models: "models",
  Tools: "tools",
  Automations: "automations",
  "Plugins & Skills": "plugins-skills",
  Papers: "papers",
};

// Light tool-tagging from the title/body so cards and the rail have something to filter on.
const TOOL_VOCAB = ["ComfyUI", "Claude", "Photoshop", "Figma", "FLUX", "Qwen", "Stable Diffusion", "LoRA", "MCP", "Remotion", "SAM3", "Three.js", "WAN", "SDXL"];

interface Writeup { id: string; category: string; cardTitle: string; digest: string; bodyMd: string; }
interface Verdict { id: string; score: number; category: string; }

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

function toolsFor(c: Candidate, w: Writeup): string[] {
  const hay = `${w.cardTitle} ${c.title} ${w.bodyMd}`.toLowerCase();
  return TOOL_VOCAB.filter((t) => hay.includes(t.toLowerCase())).slice(0, 3);
}

// Thumbnails are NOT harvested here anymore. The thermal cover step (`npm run cover`,
// covers/cover_engine.py) generates a cover per entry after publish. We write
// `thumbnail: null` and the cover step fills it (+ photographer credit).

async function main() {
  const writeups = loadJson<Writeup[]>(join(DATA_DIR, "writeups.json"), []);
  const verdicts = loadJson<Verdict[]>(join(DATA_DIR, "verdicts.json"), []);
  const pen = loadJson<Record<string, PenItem>>(join(DATA_DIR, "pen.json"), {});
  const scoreById = new Map(verdicts.map((v) => [v.id, v.score]));

  if (writeups.length === 0) {
    console.log("No writeups to publish. Run `npm run writeup` first.");
    return;
  }

  mkdirSync(ENTRIES_DIR, { recursive: true });
  let published = 0;

  for (const w of writeups) {
    const c = pen[w.id]?.post;
    if (!c) continue;
    const slug = slugify(w.cardTitle);
    const date = new Date(c.createdUtc * 1000).toISOString().slice(0, 10);
    const thumbnail = null; // cover is generated later by `npm run cover`

    const frontmatter = {
      title: w.cardTitle,
      date,
      sourceDate: date,
      category: CATEGORY_SLUG[w.category] ?? "tools",
      tools: toolsFor(c, w),
      disciplines: [],
      thumbnail,
      score: scoreById.get(w.id) ?? 7,
      hoverWhat: w.digest,
      hoverWhy: w.digest,
      modelVersions: null,
      source: {
        origin: c.sourceLabel,
        permalink: c.url,
        outboundUrl: c.outboundUrl,
        author: c.author,
      },
      supersededBy: null,
      fixture: false,
    };

    const md = `---\n${yamlStringify(frontmatter).trim()}\n---\n\n${w.bodyMd}\n`;
    writeFileSync(join(ENTRIES_DIR, `${slug}.md`), md);
    published++;
    console.log(`  ${frontmatter.category.padEnd(14)} ${w.cardTitle}`);
  }

  console.log(`\nPublished ${published} entries to site/src/content/entries/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
