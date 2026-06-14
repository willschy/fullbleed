import type { Candidate } from "./types.js";

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// CJK, Hangul, Hiragana/Katakana, Cyrillic, Arabic, Thai. A stray accent or emoji
// is fine; a run of these means the entry isn't in English.
const NON_LATIN_SCRIPT = /[぀-ヿ㐀-鿿가-힯Ѐ-ӿ؀-ۿ฀-๿]/g;

/** Heuristic English gate — catches the obvious non-English entries (e.g. Chinese tool names). */
export function looksEnglish(text: string): boolean {
  const hits = text.match(NON_LATIN_SCRIPT);
  return !hits || hits.length < 3;
}

/**
 * When the thing actually came into existence — the freshness signal.
 * Always the creation/publish/post date, never last-activity: a repo created
 * 8 months ago with a recent commit is NOT a new find, and must not pass the
 * recency gate. "New" means new, across every source.
 */
export function candidateDate(c: Candidate): number {
  return c.createdUtc;
}

/** Hard recency ceiling from the curation brief — stale work never surfaces. */
export function recencyOk(c: Candidate, maxAgeDays: number): boolean {
  const ageDays = (Date.now() / 1000 - candidateDate(c)) / 86_400;
  return ageDays <= maxAgeDays;
}

/** Reddit-only: keep posts whose flair is in the allow-list (empty list = accept all). */
export function redditFlairOk(flair: string | null, flairs: string[]): boolean {
  if (flairs.length === 0) return true;
  return flair !== null && flairs.includes(flair);
}

/**
 * The cheap, source-agnostic gate. Free, kills obvious trash before anything
 * expensive runs. The real taste judgment is the Sonnet stage downstream.
 */
export function dumbFilter(c: Candidate, blocklist: string[]): { pass: boolean; reason: string } {
  const text = `${c.title} ${c.body}`.toLowerCase();
  for (const phrase of blocklist) {
    if (new RegExp(`\\b${escapeRegex(phrase.toLowerCase())}\\b`).test(text)) {
      return { pass: false, reason: `blocklist:${phrase}` };
    }
  }

  const hasDemo = c.hasImage || c.hasVideo || c.outboundUrl !== null;
  if (!hasDemo) return { pass: false, reason: "no-demo" };

  return { pass: true, reason: "ok" };
}
