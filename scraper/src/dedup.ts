import { join } from "node:path";
import { DATA_DIR, loadJson, saveJson } from "./store.js";
import type { RedditPost } from "./types.js";

interface SeenState {
  postIds: Record<string, true>;
  urls: Record<string, string>;   // normalized outbound url -> post id
  titles: Record<string, string>; // normalized title -> post id
}

const SEEN_PATH = join(DATA_DIR, "seen.json");

export function loadSeen(): SeenState {
  return loadJson<SeenState>(SEEN_PATH, { postIds: {}, urls: {}, titles: {} });
}

export function saveSeen(seen: SeenState): void {
  saveJson(SEEN_PATH, seen);
}

export function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    u.hash = "";
    for (const k of [...u.searchParams.keys()]) {
      if (k.startsWith("utm_") || k === "ref" || k === "source") u.searchParams.delete(k);
    }
    return `${u.host.toLowerCase().replace(/^www\./, "")}${u.pathname.replace(/\/$/, "")}${u.search}`;
  } catch {
    return url.toLowerCase();
  }
}

export function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
}

export function isDuplicate(post: RedditPost, seen: SeenState): boolean {
  if (seen.postIds[post.id]) return true;
  if (post.outboundUrl && seen.urls[normalizeUrl(post.outboundUrl)]) return true;
  if (seen.titles[normalizeTitle(post.title)]) return true;
  return false;
}

export function markSeen(post: RedditPost, seen: SeenState): void {
  seen.postIds[post.id] = true;
  if (post.outboundUrl) seen.urls[normalizeUrl(post.outboundUrl)] = post.id;
  seen.titles[normalizeTitle(post.title)] = post.id;
}
