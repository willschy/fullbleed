import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { stringify as yamlStringify } from "yaml";
import { REPO_ROOT } from "./store.js";
import type { ScoredCandidate } from "./types.js";

const ENTRIES_DIR = join(REPO_ROOT, "site", "src", "content", "entries");
const THUMBS_DIR = join(REPO_ROOT, "site", "public", "thumbs");

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

async function downloadThumbnail(url: string, slug: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "fullbleed-scraper/0.1" } });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const ext = url.includes(".png") ? "png" : "jpg";
    mkdirSync(THUMBS_DIR, { recursive: true });
    writeFileSync(join(THUMBS_DIR, `${slug}.${ext}`), buf);
    return `/thumbs/${slug}.${ext}`;
  } catch {
    return null;
  }
}

export async function publishCandidate(c: ScoredCandidate): Promise<string> {
  const slug = slugify(c.title);
  const thumbnail = c.post.thumbnailUrl ? await downloadThumbnail(c.post.thumbnailUrl, slug) : null;

  const frontmatter = {
    title: c.title,
    date: new Date().toISOString().slice(0, 10),
    sourceDate: new Date(c.post.createdUtc * 1000).toISOString().slice(0, 10),
    category: c.category,
    tools: c.tools,
    disciplines: c.disciplines,
    thumbnail,
    score: c.score,
    hoverWhat: c.hoverWhat,
    hoverWhy: c.hoverWhy,
    modelVersions: c.modelVersions,
    source: {
      permalink: c.post.permalink,
      outboundUrl: c.post.outboundUrl,
      author: c.post.author,
      subreddit: c.post.subreddit,
    },
    supersededBy: null,
  };

  const md = `---\n${yamlStringify(frontmatter).trim()}\n---\n\n${c.bodyMd}\n`;
  mkdirSync(ENTRIES_DIR, { recursive: true });
  writeFileSync(join(ENTRIES_DIR, `${slug}.md`), md);
  return slug;
}
