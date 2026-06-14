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
const THUMBS_DIR = join(REPO_ROOT, "site", "public", "thumbs");

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

// Skip badges, shields, CI status, and social chips — never the hero image.
const BADGE_RE = /shields\.io|img\.shields|\bbadge\b|\/actions\/|\/workflows\/|codecov|coveralls|circleci|travis|appveyor|sonar|opencollective|ko-?fi|buymeacoffee|discord|twitter\.com|\.svg(\?|$)/i;

function ghHeaders(accept: string): Record<string, string> {
  const h: Record<string, string> = { "User-Agent": "fullbleed-scraper/0.1", Accept: accept };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

// First real image in a repo's README (the maker's own hero/demo shot).
async function githubReadmeImage(fullName: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${fullName}/readme`, {
      headers: ghHeaders("application/vnd.github.raw"),
    });
    if (!res.ok) return null;
    const md = await res.text();
    const urls: string[] = [];
    let m: RegExpExecArray | null;
    const mdImg = /!\[[^\]]*\]\(([^)\s]+)/g;
    const htmlImg = /<img[^>]+src=["']([^"']+)["']/gi;
    while ((m = mdImg.exec(md))) urls.push(m[1]);
    while ((m = htmlImg.exec(md))) urls.push(m[1]);
    let pick = urls.find((u) => !BADGE_RE.test(u));
    if (!pick) return null;
    pick = pick.replace("/blob/", "/raw/");
    if (/^https?:\/\//.test(pick)) return pick;
    return `https://raw.githubusercontent.com/${fullName}/HEAD/${pick.replace(/^\.?\//, "")}`;
  } catch {
    return null;
  }
}

// A Hugging Face model page's preview image (often a real sample of its output).
async function hfOgImage(modelId: string): Promise<string | null> {
  try {
    const res = await fetch(`https://huggingface.co/${modelId}`, { headers: { "User-Agent": "Mozilla/5.0 fullbleed" } });
    if (!res.ok) return null;
    const html = await res.text();
    const m = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

// Each entry's own real artifact first; fall back to whatever the catcher had.
async function resolveThumbUrl(c: Candidate): Promise<string | null> {
  if (c.source === "github") return (await githubReadmeImage(c.id.replace(/^gh:/, ""))) ?? c.thumbnailUrl;
  if (c.source === "huggingface") return (await hfOgImage(c.id.replace(/^hf:/, ""))) ?? c.thumbnailUrl;
  return c.thumbnailUrl;
}

async function downloadThumb(url: string, slug: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 fullbleed-scraper/0.1" } });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1200) return null; // skip tiny placeholders / 1px gifs
    const ct = res.headers.get("content-type") ?? "";
    const ext = ct.includes("png") ? "png"
      : ct.includes("gif") ? "gif"
      : ct.includes("webp") ? "webp"
      : /\.png(\?|$)/i.test(url) ? "png"
      : /\.gif(\?|$)/i.test(url) ? "gif"
      : /\.webp(\?|$)/i.test(url) ? "webp"
      : "jpg";
    mkdirSync(THUMBS_DIR, { recursive: true });
    writeFileSync(join(THUMBS_DIR, `${slug}.${ext}`), buf);
    return `/thumbs/${slug}.${ext}`;
  } catch {
    return null;
  }
}

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
    const imgUrl = await resolveThumbUrl(c);
    const thumbnail = imgUrl ? await downloadThumb(imgUrl, slug) : null;

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
    console.log(`${thumbnail ? "+img" : "    "}  ${frontmatter.category.padEnd(14)} ${w.cardTitle}`);
  }

  console.log(`\nPublished ${published} entries to site/src/content/entries/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
