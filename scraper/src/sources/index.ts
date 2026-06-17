import type { Source, SourcesConfig } from "../types.js";
import { fetchRedditRecent } from "./reddit.js";
import { fetchHackerNews } from "./hackernews.js";
import { fetchGitHub } from "./github.js";
import { fetchArena } from "./arena.js";
import { fetchArxiv } from "./arxiv.js";
import { fetchHuggingFace } from "./huggingface.js";
import { fetchHfPapers } from "./hfpapers.js";
import { fetchProductHunt } from "./producthunt.js";

/**
 * The compiler's source registry. Each enabled source exposes a uniform
 * `fetch()` returning normalized Candidates. Adding a future source (X,
 * Behance, …) means writing one adapter + one entry here — nothing downstream
 * changes.
 */
export function buildSources(cfg: SourcesConfig): Source[] {
  const sources: Source[] = [];

  if (cfg.reddit?.enabled !== false && cfg.reddit?.subreddits?.length) {
    const subs = cfg.reddit.subreddits;
    sources.push({ id: "reddit", label: "Reddit", fetch: () => fetchRedditRecent(subs) });
  }
  if (cfg.hackernews?.enabled) {
    const hn = cfg.hackernews;
    sources.push({ id: "hackernews", label: "Hacker News", fetch: () => fetchHackerNews(hn) });
  }
  if (cfg.github?.enabled) {
    const gh = cfg.github;
    sources.push({ id: "github", label: "GitHub", fetch: () => fetchGitHub(gh) });
  }
  if (cfg.arena?.enabled) {
    const ar = cfg.arena;
    sources.push({ id: "arena", label: "Are.na", fetch: () => fetchArena(ar) });
  }
  if (cfg.arxiv?.enabled) {
    const ax = cfg.arxiv;
    sources.push({ id: "arxiv", label: "arXiv", fetch: () => fetchArxiv(ax) });
  }
  if (cfg.huggingface?.enabled) {
    const hf = cfg.huggingface;
    sources.push({ id: "huggingface", label: "Hugging Face", fetch: () => fetchHuggingFace(hf) });
  }
  if (cfg.hfpapers?.enabled) {
    const hp = cfg.hfpapers;
    sources.push({ id: "hfpapers", label: "HF Papers", fetch: () => fetchHfPapers(hp) });
  }
  if (cfg.producthunt?.enabled) {
    const ph = cfg.producthunt;
    sources.push({ id: "producthunt", label: "Product Hunt", fetch: () => fetchProductHunt(ph) });
  }

  return sources;
}
