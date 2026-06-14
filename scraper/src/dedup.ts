import { join } from "node:path";
import { DATA_DIR, loadJson, saveJson } from "./store.js";
import type { Candidate } from "./types.js";

interface SeenState {
  ids: Record<string, true>;
  urls: Record<string, string>;   // normalized outbound url -> candidate id
  titles: Record<string, string>; // normalized title -> candidate id
}

const SEEN_PATH = join(DATA_DIR, "seen.json");

export function loadSeen(): SeenState {
  // Back-compat: older state used `postIds`; fold it in if present.
  const raw = loadJson<Partial<SeenState> & { postIds?: Record<string, true> }>(SEEN_PATH, {});
  return {
    ids: { ...(raw.postIds ?? {}), ...(raw.ids ?? {}) },
    urls: raw.urls ?? {},
    titles: raw.titles ?? {},
  };
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

export function isDuplicate(c: Candidate, seen: SeenState): boolean {
  if (seen.ids[c.id]) return true;
  // Same work surfaced on two sources (e.g. a repo on both HN and GitHub) collapses here.
  if (c.outboundUrl && seen.urls[normalizeUrl(c.outboundUrl)]) return true;
  const t = normalizeTitle(c.title);
  if (t && seen.titles[t]) return true;
  return false;
}

export function markSeen(c: Candidate, seen: SeenState): void {
  seen.ids[c.id] = true;
  if (c.outboundUrl) seen.urls[normalizeUrl(c.outboundUrl)] = c.id;
  const t = normalizeTitle(c.title);
  if (t) seen.titles[t] = c.id;
}
